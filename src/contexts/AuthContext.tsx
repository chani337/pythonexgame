import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

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
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  syncSolvedToSupabase: (problemId: string) => Promise<void>;
  syncStatsToSupabase: (streak: number, lastSolvedDate: string, sandboxRuns: number) => Promise<void>;
  fetchUserSolvedIds: () => Promise<string[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Initialize leaderboard state with persistent local cache or default ranking to guarantee 0ms instant display on first visit
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(() => {
    const cached = localStorage.getItem('pyquests_cached_leaderboard');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Leaderboard cache parse error:', e);
      }
    }
    return DEFAULT_LEADERBOARD;
  });

  const updateLeaderboardState = (newList: LeaderboardUser[]) => {
    let finalData = newList;
    if (!finalData || finalData.length === 0) {
      const cached = localStorage.getItem('pyquests_cached_leaderboard');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            finalData = parsed;
          }
        } catch (e) {
          console.error('Cache restore error:', e);
        }
      }
    }
    if (!finalData || finalData.length === 0) {
      finalData = DEFAULT_LEADERBOARD;
    }
    setLeaderboard(finalData);
    localStorage.setItem('pyquests_cached_leaderboard', JSON.stringify(finalData));
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
        fetchProfile(session.user.id, session.user.email || '');
      } else {
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
        fetchProfile(session.user.id, session.user.email || '');
      } else {
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_solved_problems' }, () => {
        refreshLeaderboard();
      })
      .subscribe();

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
        mergeLocalStorageProgress(userId);
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
      const savedSolved = localStorage.getItem(`pyquests_solved_ids_${userId}`) || localStorage.getItem('pyquests_solved_ids');
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
    } catch (err) {
      console.error('Merge local storage progress error:', err);
    }
  };

  const refreshLeaderboard = async () => {
    try {
      const userMap: Record<string, LeaderboardUser> = {};

      if (isSupabaseConfigured) {
        // Query profiles without non-existent column 'solved_count'
        const { data: profData, error: profErr } = await supabase
          .from('profiles')
          .select('id, display_name, email, streak');

        const { data: solvedData, error: solvedErr } = await supabase
          .from('user_solved_problems')
          .select('user_id, problem_id');

        const solvedCounts: Record<string, number> = {};
        if (solvedData) {
          solvedData.forEach((row) => {
            solvedCounts[row.user_id] = (solvedCounts[row.user_id] || 0) + 1;
          });
        }

        if (!profErr && profData) {
          profData.forEach((item: any) => {
            userMap[item.id] = {
              id: item.id,
              display_name: item.display_name || item.email?.split('@')[0] || '익명 러너',
              email: item.email || '',
              streak: item.streak || 0,
              solved_count: solvedCounts[item.id] || 0,
            };
          });
        } else {
          if (profErr) console.warn('Supabase profiles fetch notice:', profErr);
          if (solvedErr) console.warn('Supabase solved fetch notice:', solvedErr);
        }

        // Include any user_id from user_solved_problems even if profile table row was not created yet
        Object.keys(solvedCounts).forEach((uid) => {
          if (!userMap[uid]) {
            userMap[uid] = {
              id: uid,
              display_name: '러너_' + uid.slice(0, 5),
              email: '',
              streak: 0,
              solved_count: solvedCounts[uid],
            };
          }
        });
      }

      let formatted = Object.values(userMap);

      // Guarantee active logged-in user OR guest runner is ALWAYS displayed on the leaderboard
      const activeUserId = user?.id || localStorage.getItem('pyquests_last_user_id') || 'local_runner';
      const activeUserEmail = user?.email || localStorage.getItem('pyquests_last_user_email') || 'local@pyquests.local';

      const userKey = `pyquests_solved_ids_${activeUserId}`;
      const savedLocal = localStorage.getItem(userKey) || localStorage.getItem('pyquests_solved_ids');
      const localSolvedCount = savedLocal ? JSON.parse(savedLocal).length : 0;
      const userStreak = profile?.streak || parseInt(localStorage.getItem(`pyquests_streak_${activeUserId}`) || localStorage.getItem('pyquests_streak') || '0', 10);

      const existingIndex = formatted.findIndex((u) => u.id === activeUserId || (u.email && activeUserEmail && u.email.toLowerCase() === activeUserEmail.toLowerCase()));
      if (existingIndex !== -1) {
        formatted[existingIndex].solved_count = Math.max(formatted[existingIndex].solved_count || 0, localSolvedCount);
        formatted[existingIndex].streak = Math.max(formatted[existingIndex].streak || 0, userStreak);
      } else if (localSolvedCount > 0 || userStreak > 0 || user) {
        formatted.push({
          id: activeUserId,
          display_name: profile?.display_name || (user?.email ? user.email.split('@')[0] : '나 (게스트 러너)'),
          email: activeUserEmail,
          streak: userStreak,
          solved_count: localSolvedCount,
        });
      }

      // Sort real DB & active local solvers by solved_count DESC, then streak DESC
      formatted.sort((a, b) => (b.solved_count - a.solved_count) || (b.streak - a.streak));

      // Show ONLY real registered users if any exist; fallback to defaults only if no users exist
      const combined = formatted.length > 0 ? formatted : DEFAULT_LEADERBOARD;

      // Show ALL users on the leaderboard without truncation
      updateLeaderboardState(combined);
    } catch (err) {
      console.error('Leaderboard error:', err);
      updateLeaderboardState([]);
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

  const signUp = async (email: string, password: string, displayName: string) => {
    if (!isSupabaseConfigured) {
      return { error: { message: '클라우드 데이터베이스 접속 정보가 설정되지 않았습니다.' } };
    }
    const res = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (!res.error && res.data.user) {
      // Create profile row
      await supabase.from('profiles').upsert({
        id: res.data.user.id,
        email,
        display_name: displayName || email.split('@')[0],
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

  const ensureProfileExists = async (userId: string, userEmail: string) => {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('profiles').upsert({
        id: userId,
        email: userEmail,
        display_name: userEmail.split('@')[0],
      }, { onConflict: 'id' });
    } catch (err) {
      console.error('Ensure profile error:', err);
    }
  };

  const syncSolvedToSupabase = async (problemId: string) => {
    if (!isSupabaseConfigured || !user) return;
    try {
      await ensureProfileExists(user.id, user.email || '');
      await supabase.from('user_solved_problems').upsert(
        { user_id: user.id, problem_id: problemId },
        { onConflict: 'user_id,problem_id' }
      );

      await supabase.from('profiles').update({
        updated_at: new Date().toISOString(),
      }).eq('id', user.id);

      refreshLeaderboard();
    } catch (err) {
      console.error('Sync solved error:', err);
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
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        syncSolvedToSupabase,
        syncStatsToSupabase,
        fetchUserSolvedIds,
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
