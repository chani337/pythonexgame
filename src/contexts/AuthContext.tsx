import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import { isProfaneOrForbidden } from '../utils/profanityFilter';
import { problems } from '../data/problems';

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  streak: number;
  last_solved_date: string | null;
  sandbox_runs: number;
  solvedCount?: number;
}

export interface LeaderboardUser {
  id: string;
  display_name: string;
  email: string;
  streak: number;
  solved_count: number;
}

export interface ActivityEvent {
  id: string; // `${userId}_${problemId}_${insertedAt}` so re-solves after a delete still get a fresh key
  displayName: string;
  problemTitle: string;
  insertedAt: number;
}

const PROBLEM_TITLE_BY_ID = new Map(problems.map((p) => [p.id, p.title]));
const MAX_RECENT_ACTIVITY = 15;

// Every per-account localStorage key this app writes, keyed by the prefix
// before the trailing user id / 'guest' suffix.
const SCOPED_KEY_PREFIXES = [
  'pyquests_solved_ids_',
  'pyquests_streak_',
  'pyquests_last_solved_date_',
  'pyquests_sandbox_runs_',
  'pyquests_review_ids_',
  'pyquests_read_chapters_',
  'pyquests_docs_quiz_answers_',
  'pyquests_display_name_',
];

// On a shared/public computer, whoever logged in before us (or forgot to
// log out) otherwise leaves their solved-problem history sitting in this
// browser's localStorage forever. Call this on every login/logout so the
// only account data left behind is whoever is active right now (or none,
// once everyone's logged out) -- not a trail of every account that ever
// touched this browser.
function purgeOtherAccountsLocalStorage(keepId: string) {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    const prefix = SCOPED_KEY_PREFIXES.find((p) => key.startsWith(p));
    if (!prefix) continue;
    const suffix = key.slice(prefix.length);
    if (suffix !== keepId && suffix !== 'guest') {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k));
}

// profiles.email is no longer publicly readable (RLS locks it to the owning
// row), so the admin's row is excluded from public leaderboards by id
// instead of by email.
export const ADMIN_EMAIL = 'chani7873@daum.net';
export const ADMIN_USER_ID = 'cf1c67dd-2b5e-4f86-9a0b-d0dda805f3da';

// Accounts that should never show up on the public leaderboard or activity
// feed, even though they aren't the single ADMIN_USER_ID (used elsewhere
// for actual admin authorization, e.g. the support board). Exported so
// other leaderboard views (e.g. the weekly/per-language breakdowns in
// Dashboard) apply the same exclusion.
export const EXCLUDED_LEADERBOARD_IDS = [ADMIN_USER_ID];

export const DEFAULT_LEADERBOARD: LeaderboardUser[] = [
  { id: 'default-runner-1', display_name: '알고리즘마스터', email: 'algo@pyquests.io', streak: 3, solved_count: 5 },
  { id: 'default-runner-2', display_name: '코드파이썬', email: 'code@pyquests.io', streak: 2, solved_count: 3 },
  { id: 'default-runner-3', display_name: '파이썬러너', email: 'runner@pyquests.io', streak: 2, solved_count: 2 },
  { id: 'default-runner-4', display_name: '디버깅왕', email: 'debug@pyquests.io', streak: 1, solved_count: 1 },
  { id: 'default-runner-5', display_name: '코딩스타', email: 'star@pyquests.io', streak: 1, solved_count: 1 },
];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isConfigured: boolean;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  leaderboard: LeaderboardUser[];
  refreshLeaderboard: () => Promise<void>;
  recentActivity: ActivityEvent[];
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  syncSolvedToSupabase: (problemId: string) => Promise<void>;
  syncStatsToSupabase: (streak: number, lastSolvedDate: string, sandboxRuns: number) => Promise<void>;
  fetchUserSolvedIds: () => Promise<string[]>;
  syncReadChapterToSupabase: (chapterId: string, isRead: boolean) => Promise<void>;
  fetchUserReadChapterIds: () => Promise<string[]>;
  syncReviewProblemToSupabase: (problemId: string, isInReview: boolean) => Promise<void>;
  fetchUserReviewProblemIds: () => Promise<string[]>;
  syncQuizAnswerToSupabase: (chapterId: string, questionIndex: number, answerIndex: number) => Promise<void>;
  fetchUserQuizAnswers: () => Promise<Record<string, number>>;
  updateDisplayName: (newDisplayName: string) => Promise<{ error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [recentActivity, setRecentActivity] = useState<ActivityEvent[]>([]);

  // Initialize leaderboard state with persistent local cache or empty array
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(() => {
    const cached = localStorage.getItem('pyquests_cached_leaderboard');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed.filter((u: any) => !u.id?.startsWith('default-runner-'));
      } catch (e) {
        console.error('Leaderboard cache parse error:', e);
      }
    }
    return [];
  });

  const updateLeaderboardState = (newList: LeaderboardUser[]) => {
    const realUsersOnly = (newList || []).filter((u) => !u.id?.startsWith('default-runner-'));
    setLeaderboard(realUsersOnly);
    localStorage.setItem('pyquests_cached_leaderboard', JSON.stringify(realUsersOnly));
  };

  // Fetch initial session & user profile
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        localStorage.setItem('pyquests_last_user_id', session.user.id);
        if (session.user.email) {
          localStorage.setItem('pyquests_last_user_email', session.user.email);
        }
        purgeOtherAccountsLocalStorage(session.user.id);
        fetchProfile(session.user.id, session.user.email || '');
      } else {
        purgeOtherAccountsLocalStorage('guest');
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        localStorage.setItem('pyquests_last_user_id', session.user.id);
        if (session.user.email) {
          localStorage.setItem('pyquests_last_user_email', session.user.email);
        }
        purgeOtherAccountsLocalStorage(session.user.id);
        fetchProfile(session.user.id, session.user.email || '');
      } else {
        purgeOtherAccountsLocalStorage('guest');
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch initial leaderboard & subscribe to Realtime DB changes
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    refreshLeaderboard();

    // Periodic 15-second auto refresh
    const intervalId = setInterval(() => {
      refreshLeaderboard();
    }, 15000);

    // Supabase Realtime WebSocket subscription
    const channel = supabase
      .channel('public:realtime_leaderboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        refreshLeaderboard();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_solved_problems' }, (payload) => {
        console.log('[activity-feed] wildcard binding saw a user_solved_problems change:', payload.eventType);
        refreshLeaderboard();
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'user_solved_problems' }, (payload) => {
        console.log('[activity-feed] INSERT-specific binding fired');
        handleNewSolveActivity(payload.new as { user_id: string; problem_id: string });
      })
      .subscribe((status) => {
        console.log('[activity-feed] realtime channel status:', status);
      });

    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProfile = async (userId: string, userEmail: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        // Upsert profile if missing or error
        const newProf = {
          id: userId,
          email: userEmail,
          display_name: userEmail.split('@')[0],
          streak: 0,
          last_solved_date: null,
          sandbox_runs: 0,
        };
        await supabase.from('profiles').upsert(newProf, { onConflict: 'id' });
        setProfile(newProf);
      } else {
        setProfile(data);
        await mergeLocalStorageProgress(userId);
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
      refreshLeaderboard();
    }
  };

  const mergeLocalStorageProgress = async (userId: string) => {
    try {
      const savedSolved = localStorage.getItem(`pyquests_solved_ids_${userId}`) || localStorage.getItem('pyquests_solved_ids_guest');
      if (savedSolved) {
        const solvedIds: string[] = JSON.parse(savedSolved);
        if (solvedIds.length > 0) {
          const records = solvedIds.map((pid) => ({
            user_id: userId,
            problem_id: pid,
          }));
          await supabase.from('user_solved_problems').upsert(records, { onConflict: 'user_id,problem_id' });
        }
      }

      const savedReadChapters = localStorage.getItem(`pyquests_read_chapters_${userId}`) || localStorage.getItem('pyquests_read_chapters_guest');
      if (savedReadChapters) {
        const readChapterIds: string[] = JSON.parse(savedReadChapters);
        if (readChapterIds.length > 0) {
          const records = readChapterIds.map((cid) => ({
            user_id: userId,
            chapter_id: cid,
          }));
          await supabase.from('user_read_chapters').upsert(records, { onConflict: 'user_id,chapter_id' });
        }
      }

      const savedReview = localStorage.getItem(`pyquests_review_ids_${userId}`) || localStorage.getItem('pyquests_review_ids_guest');
      if (savedReview) {
        const reviewIds: string[] = JSON.parse(savedReview);
        if (reviewIds.length > 0) {
          const records = reviewIds.map((pid) => ({
            user_id: userId,
            problem_id: pid,
          }));
          await supabase.from('user_review_problems').upsert(records, { onConflict: 'user_id,problem_id' });
        }
      }

      const savedQuizAnswers = localStorage.getItem(`pyquests_docs_quiz_answers_${userId}`) || localStorage.getItem('pyquests_docs_quiz_answers_guest');
      if (savedQuizAnswers) {
        const quizMap: Record<string, number> = JSON.parse(savedQuizAnswers);
        const records = Object.entries(quizMap)
          .map(([key, answerIndex]) => {
            const match = key.match(/^(.+)_(\d+)$/);
            if (!match) return null;
            return {
              user_id: userId,
              chapter_id: match[1],
              question_index: parseInt(match[2], 10),
              answer_index: answerIndex,
            };
          })
          .filter((r): r is NonNullable<typeof r> => r !== null);
        if (records.length > 0) {
          await supabase.from('user_quiz_answers').upsert(records, { onConflict: 'user_id,chapter_id,question_index' });
        }
      }
    } catch (err) {
      console.error('Merge local storage progress error:', err);
    }
  };

  const refreshLeaderboard = async () => {
    try {
      const userMap: Record<string, LeaderboardUser> = {};

      if (isSupabaseConfigured) {
        // Public leaderboard data (nickname + streak + solved_count, no
        // email) comes from a view so it stays readable without exposing
        // profiles.email. solved_count is aggregated server-side in the
        // view (GROUP BY user_id) instead of being computed here by
        // fetching every row of user_solved_problems -- that table has
        // long since passed PostgREST's default 1000-row response cap, so
        // a raw unbounded select was silently returning a different
        // arbitrary slice of rows on every call, making counts flap on
        // every refresh. The view's aggregate always returns exactly one
        // row per profile, so it can never be truncated like that.
        const { data: profData, error: profErr } = await supabase
          .from('leaderboard_public')
          .select('id, display_name, streak, solved_count');

        if (!profErr && profData) {
          profData.forEach((item: any) => {
            userMap[item.id] = {
              id: item.id,
              display_name: item.display_name || '익명 러너',
              email: '',
              streak: item.streak || 0,
              solved_count: item.solved_count || 0,
            };
          });
        } else if (profErr) {
          console.warn('Supabase leaderboard fetch notice:', profErr);
        }
      }

      // Admin account is excluded from the public leaderboard (recovery/testing data shouldn't rank)
      let formatted = Object.values(userMap).filter((u) => !EXCLUDED_LEADERBOARD_IDS.includes(u.id));

      // Guarantee active logged-in user OR guest runner is ALWAYS displayed on the leaderboard
      const activeUserId = user?.id || localStorage.getItem('pyquests_last_user_id') || 'local_runner';
      const activeUserEmail = user?.email || localStorage.getItem('pyquests_last_user_email') || 'local@pyquests.local';
      const isActiveUserAdmin = activeUserEmail?.toLowerCase() === ADMIN_EMAIL;

      const userKey = `pyquests_solved_ids_${activeUserId}`;
      const savedLocal = localStorage.getItem(userKey);
      const localSolvedCount = savedLocal ? JSON.parse(savedLocal).length : 0;
      const userStreak = profile?.streak || parseInt(localStorage.getItem(`pyquests_streak_${activeUserId}`) || '0', 10);

      if (!isActiveUserAdmin) {
        const existingIndex = formatted.findIndex((u) => u.id === activeUserId || (u.email && activeUserEmail && u.email.toLowerCase() === activeUserEmail.toLowerCase()));
        if (existingIndex !== -1) {
          // Logged-in users already have a DB row here -- trust it as-is.
          // Mixing in the local cache via Math.max let a stale/out-of-sync
          // browser cache push the displayed count above (or pin it below)
          // the real synced total, which is why the same account's rank
          // used to flicker between different numbers on every refresh.
          // Local cache is only meaningful as an optimistic estimate for
          // guests who have no DB row at all (handled below).
          if (!user) {
            formatted[existingIndex].solved_count = Math.max(formatted[existingIndex].solved_count || 0, localSolvedCount);
            formatted[existingIndex].streak = Math.max(formatted[existingIndex].streak || 0, userStreak);
          }
        } else if (localSolvedCount > 0 || userStreak > 0 || user) {
          formatted.push({
            id: activeUserId,
            display_name: profile?.display_name || (user?.email ? user.email.split('@')[0] : '나 (게스트 러너)'),
            email: activeUserEmail,
            streak: userStreak,
            solved_count: localSolvedCount,
          });
        }
      }

      // Sort real DB & active local solvers by solved_count DESC, then streak DESC
      formatted.sort((a, b) => (b.solved_count - a.solved_count) || (b.streak - a.streak));

      // Show ONLY Top 10 real registered users from database / session
      const combined = formatted;

      // Show TOP 10 users on the leaderboard
      updateLeaderboardState(combined.slice(0, 10));
    } catch (err) {
      console.error('Leaderboard error:', err);
      updateLeaderboardState([]);
    }
  };

  // Turns a raw `user_solved_problems` INSERT into a "OOO님이 방금 '문제'를
  // 풀었어요!" feed entry for the dashboard. The realtime payload only has
  // user_id/problem_id, so the display name is looked up from the public
  // leaderboard view and the problem title from the local bundled data.
  const handleNewSolveActivity = async (row: { user_id: string; problem_id: string }) => {
    console.log('[activity-feed] INSERT event received:', row);
    if (!row?.user_id || !row?.problem_id) {
      console.log('[activity-feed] dropped: missing user_id/problem_id on payload');
      return;
    }
    if (EXCLUDED_LEADERBOARD_IDS.includes(row.user_id)) {
      console.log('[activity-feed] dropped: user_id is in EXCLUDED_LEADERBOARD_IDS');
      return;
    }

    const problemTitle = PROBLEM_TITLE_BY_ID.get(row.problem_id);
    if (!problemTitle) {
      console.log('[activity-feed] dropped: no title found for problem_id', row.problem_id);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('leaderboard_public')
        .select('display_name')
        .eq('id', row.user_id)
        .single();

      if (error || !data?.display_name) {
        console.log('[activity-feed] dropped: leaderboard_public lookup failed', error);
        return;
      }

      const entry: ActivityEvent = {
        id: `${row.user_id}_${row.problem_id}_${Date.now()}`,
        displayName: data.display_name,
        problemTitle,
        insertedAt: Date.now(),
      };

      console.log('[activity-feed] showing entry:', entry);
      setRecentActivity((prev) => [entry, ...prev].slice(0, MAX_RECENT_ACTIVITY));
    } catch (err) {
      console.error('Activity feed lookup error:', err);
    }
  };

  const fetchUserSolvedIds = async (): Promise<string[]> => {
    if (!isSupabaseConfigured || !user) return [];
    try {
      const { data, error } = await supabase
        .from('user_solved_problems')
        .select('problem_id')
        .eq('user_id', user.id);

      if (!error && data) {
        return data.map((row) => row.problem_id);
      }
    } catch (err) {
      console.error('Fetch solved ids error:', err);
    }
    return [];
  };

  const fetchUserReadChapterIds = async (): Promise<string[]> => {
    if (!isSupabaseConfigured || !user) return [];
    try {
      const { data, error } = await supabase
        .from('user_read_chapters')
        .select('chapter_id')
        .eq('user_id', user.id);

      if (!error && data) {
        return data.map((row) => row.chapter_id);
      }
    } catch (err) {
      console.error('Fetch read chapter ids error:', err);
    }
    return [];
  };

  const fetchUserReviewProblemIds = async (): Promise<string[]> => {
    if (!isSupabaseConfigured || !user) return [];
    try {
      const { data, error } = await supabase
        .from('user_review_problems')
        .select('problem_id')
        .eq('user_id', user.id);

      if (!error && data) {
        return data.map((row) => row.problem_id);
      }
    } catch (err) {
      console.error('Fetch review problem ids error:', err);
    }
    return [];
  };

  const fetchUserQuizAnswers = async (): Promise<Record<string, number>> => {
    if (!isSupabaseConfigured || !user) return {};
    try {
      const { data, error } = await supabase
        .from('user_quiz_answers')
        .select('chapter_id, question_index, answer_index')
        .eq('user_id', user.id);

      if (!error && data) {
        const result: Record<string, number> = {};
        data.forEach((row) => {
          result[`${row.chapter_id}_${row.question_index}`] = row.answer_index;
        });
        return result;
      }
    } catch (err) {
      console.error('Fetch quiz answers error:', err);
    }
    return {};
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    if (!isSupabaseConfigured) {
      return { error: { message: '클라우드 데이터베이스 접속 정보가 설정되지 않았습니다.' } };
    }
    const cleanName = (displayName || email.split('@')[0]).trim();
    if (cleanName.length > 5) {
      return { error: { message: '닉네임은 최대 5자까지만 가능합니다.' } };
    }
    if (isProfaneOrForbidden(cleanName)) {
      return { error: { message: '부적절하거나 비하/욕설 단어는 닉네임으로 사용할 수 없습니다.' } };
    }

    try {
      // Check duplication via the public view (profiles itself is locked to
      // the owning row now, so a direct table query would only ever see
      // this session's own row).
      const { data: dupData } = await supabase
        .from('leaderboard_public')
        .select('id')
        .ilike('display_name', cleanName);

      if (dupData && dupData.length > 0) {
        return { error: { message: '이미 사용 중인 닉네임입니다.' } };
      }
    } catch (err) {
      console.warn('Signup duplication check notice:', err);
    }

    const res = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: cleanName,
        },
      },
    });

    if (!res.error && res.data.user) {
      // Create profile row
      await supabase.from('profiles').upsert({
        id: res.data.user.id,
        email,
        display_name: cleanName,
        streak: 0,
        sandbox_runs: 0,
      });
      refreshLeaderboard();
    }
    return { error: res.error };
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: { message: '클라우드 데이터베이스 접속 정보가 설정되지 않았습니다.' } };
    }
    const res = await supabase.auth.signInWithPassword({ email, password });
    if (!res.error) {
      refreshLeaderboard();
    }
    return { error: res.error };
  };

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      return { error: { message: '클라우드 데이터베이스 접속 정보가 설정되지 않았습니다.' } };
    }
    const res = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    return { error: res.error };
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  // Only creates the profile row if it's genuinely missing (needed for the
  // FK on tables like user_solved_problems) -- ignoreDuplicates makes this
  // INSERT ... ON CONFLICT DO NOTHING instead of DO UPDATE, so it never
  // touches an existing row. This used to overwrite display_name back to
  // the email prefix on every solve/review/quiz sync, silently wiping out
  // any nickname the user had actually set.
  const ensureProfileExists = async (userId: string, userEmail: string) => {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('profiles').upsert({
        id: userId,
        email: userEmail,
        display_name: userEmail.split('@')[0],
      }, { onConflict: 'id', ignoreDuplicates: true });
    } catch (err) {
      console.error('Ensure profile error:', err);
    }
  };

  const syncSolvedToSupabase = async (problemId: string) => {
    console.log('[activity-feed] syncSolvedToSupabase entered. isSupabaseConfigured:', isSupabaseConfigured, 'user:', user?.id || 'NOT LOGGED IN');
    if (!isSupabaseConfigured || !user) {
      console.log('[activity-feed] syncSolvedToSupabase bailed out early (not configured or no user)');
      return;
    }
    try {
      await ensureProfileExists(user.id, user.email || '');
      const { error: upsertError } = await supabase.from('user_solved_problems').upsert(
        { user_id: user.id, problem_id: problemId },
        { onConflict: 'user_id,problem_id' }
      );
      if (upsertError) {
        console.error('[activity-feed] user_solved_problems upsert failed:', upsertError);
      } else {
        console.log('[activity-feed] user_solved_problems upsert succeeded for', problemId);
      }

      const { error: updateError } = await supabase.from('profiles').update({
        updated_at: new Date().toISOString(),
      }).eq('id', user.id);
      if (updateError) {
        console.error('[activity-feed] profiles updated_at touch failed:', updateError);
      }

      refreshLeaderboard();
    } catch (err) {
      console.error('Sync solved error:', err);
    }
  };

  const syncReadChapterToSupabase = async (chapterId: string, isRead: boolean) => {
    if (!isSupabaseConfigured || !user) return;
    try {
      if (isRead) {
        await ensureProfileExists(user.id, user.email || '');
        await supabase.from('user_read_chapters').upsert(
          { user_id: user.id, chapter_id: chapterId },
          { onConflict: 'user_id,chapter_id' }
        );
      } else {
        await supabase.from('user_read_chapters')
          .delete()
          .eq('user_id', user.id)
          .eq('chapter_id', chapterId);
      }
    } catch (err) {
      console.error('Sync read chapter error:', err);
    }
  };

  const syncReviewProblemToSupabase = async (problemId: string, isInReview: boolean) => {
    if (!isSupabaseConfigured || !user) return;
    try {
      if (isInReview) {
        await ensureProfileExists(user.id, user.email || '');
        await supabase.from('user_review_problems').upsert(
          { user_id: user.id, problem_id: problemId },
          { onConflict: 'user_id,problem_id' }
        );
      } else {
        await supabase.from('user_review_problems')
          .delete()
          .eq('user_id', user.id)
          .eq('problem_id', problemId);
      }
    } catch (err) {
      console.error('Sync review problem error:', err);
    }
  };

  const syncQuizAnswerToSupabase = async (chapterId: string, questionIndex: number, answerIndex: number) => {
    if (!isSupabaseConfigured || !user) return;
    try {
      await ensureProfileExists(user.id, user.email || '');
      await supabase.from('user_quiz_answers').upsert(
        { user_id: user.id, chapter_id: chapterId, question_index: questionIndex, answer_index: answerIndex },
        { onConflict: 'user_id,chapter_id,question_index' }
      );
    } catch (err) {
      console.error('Sync quiz answer error:', err);
    }
  };

  const syncStatsToSupabase = async (streak: number, lastSolvedDate: string, sandboxRuns: number) => {
    if (!isSupabaseConfigured || !user) return;
    try {
      await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email || '',
        display_name: profile?.display_name || user.email?.split('@')[0] || '러너',
        streak,
        last_solved_date: lastSolvedDate,
        sandbox_runs: sandboxRuns,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

      setProfile((prev) => prev ? { ...prev, streak, last_solved_date: lastSolvedDate, sandbox_runs: sandboxRuns } : null);
      refreshLeaderboard();
    } catch (err) {
      console.error('Sync stats error:', err);
    }
  };

  const updateDisplayName = async (newDisplayName: string) => {
    if (!user) {
      setAuthModalOpen(true);
      return { error: { message: '로그인한 회원만 닉네임을 변경할 수 있습니다. 먼저 로그인해 주세요.' } };
    }

    const cleanName = newDisplayName.trim();
    if (!cleanName) {
      return { error: { message: '닉네임을 입력해 주세요.' } };
    }
    if (cleanName.length > 5) {
      return { error: { message: '닉네임은 최대 5자까지만 가능합니다.' } };
    }
    if (isProfaneOrForbidden(cleanName)) {
      return { error: { message: '부적절하거나 비하/욕설 단어는 닉네임으로 사용할 수 없습니다.' } };
    }

    const activeUserId = user.id;

    // 1. Duplication check in Supabase profiles table
    if (isSupabaseConfigured) {
      try {
        const { data: existing, error: dupErr } = await supabase
          .from('leaderboard_public')
          .select('id, display_name')
          .ilike('display_name', cleanName);

        if (!dupErr && existing) {
          const otherUserMatch = existing.find((p) => p.id !== activeUserId);
          if (otherUserMatch) {
            return { error: { message: '이미 다른 러너가 사용 중인 닉네임입니다.' } };
          }
        }
      } catch (err) {
        console.warn('Duplication check warning:', err);
      }
    }

    // 2. Duplication check in current cached leaderboard
    const isDuplicateInLeaderboard = leaderboard.some(
      (u) => u.id !== activeUserId && u.display_name.toLowerCase() === cleanName.toLowerCase()
    );
    if (isDuplicateInLeaderboard) {
      return { error: { message: '이미 사용 중인 닉네임입니다.' } };
    }

    // Save to local storage for instant availability
    localStorage.setItem(`pyquests_display_name_${activeUserId}`, cleanName);
    localStorage.setItem('pyquests_display_name', cleanName);

    // Update profile state
    setProfile((prev) => {
      if (prev) {
        return { ...prev, display_name: cleanName };
      }
      return {
        id: activeUserId,
        email: user?.email || '',
        display_name: cleanName,
        streak: 0,
        last_solved_date: null,
        sandbox_runs: 0,
      };
    });

    if (isSupabaseConfigured && user) {
      try {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email || '',
            display_name: cleanName,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });

        if (error) {
          console.error('Supabase profile name update error:', error);
          return { error };
        }
      } catch (err) {
        console.error('Update display name error:', err);
        return { error: err };
      }
    }

    // Refresh leaderboard with new display name
    await refreshLeaderboard();
    return {};
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isConfigured: isSupabaseConfigured,
        authModalOpen,
        setAuthModalOpen,
        leaderboard,
        refreshLeaderboard,
        recentActivity,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        syncSolvedToSupabase,
        syncStatsToSupabase,
        fetchUserSolvedIds,
        syncReadChapterToSupabase,
        fetchUserReadChapterIds,
        syncReviewProblemToSupabase,
        fetchUserReviewProblemIds,
        syncQuizAnswerToSupabase,
        fetchUserQuizAnswers,
        updateDisplayName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
