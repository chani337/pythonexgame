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
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);

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
        fetchProfile(session.user.id, session.user.email || '');
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
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

      if (error && error.code === 'PGRST116') {
        // Create profile if missing
        const newProf = {
          id: userId,
          email: userEmail,
          display_name: userEmail.split('@')[0],
          streak: 0,
          last_solved_date: null,
          sandbox_runs: 0,
        };
        await supabase.from('profiles').insert(newProf);
        setProfile(newProf);
      } else if (data) {
        setProfile(data);
        // Merge offline local storage progress into Supabase if present
        mergeLocalStorageProgress(userId);
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const mergeLocalStorageProgress = async (userId: string) => {
    try {
      const savedSolved = localStorage.getItem('pyquests_solved_ids');
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
    if (!isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, email, streak, user_solved_problems(count)')
        .order('streak', { ascending: false })
        .limit(10);

      if (!error && data) {
        const formatted: LeaderboardUser[] = data.map((item: any) => ({
          id: item.id,
          display_name: item.display_name || item.email?.split('@')[0] || '익명 러너',
          email: item.email || '',
          streak: item.streak || 0,
          solved_count: item.user_solved_problems?.[0]?.count || 0,
        }));
        setLeaderboard(formatted);
      }
    } catch (err) {
      console.error('Leaderboard error:', err);
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
      return { error: { message: 'Supabase URL과 Anon Key가 .env 파일에 설정되지 않았습니다.' } };
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
      return { error: { message: 'Supabase URL과 Anon Key가 .env 파일에 설정되지 않았습니다.' } };
    }
    const res = await supabase.auth.signInWithPassword({ email, password });
    if (!res.error) {
      refreshLeaderboard();
    }
    return { error: res.error };
  };

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      return { error: { message: 'Supabase URL과 Anon Key가 .env 파일에 설정되지 않았습니다.' } };
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

  const syncSolvedToSupabase = async (problemId: string) => {
    if (!isSupabaseConfigured || !user) return;
    try {
      await supabase.from('user_solved_problems').upsert(
        { user_id: user.id, problem_id: problemId },
        { onConflict: 'user_id,problem_id' }
      );
      refreshLeaderboard();
    } catch (err) {
      console.error('Sync solved error:', err);
    }
  };

  const syncStatsToSupabase = async (streak: number, lastSolvedDate: string, sandboxRuns: number) => {
    if (!isSupabaseConfigured || !user) return;
    try {
      await supabase.from('profiles').update({
        streak,
        last_solved_date: lastSolvedDate,
        sandbox_runs: sandboxRuns,
        updated_at: new Date().toISOString(),
      }).eq('id', user.id);

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
