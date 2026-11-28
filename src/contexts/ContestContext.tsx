import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SOLVED_SAVED_EVENT, useAuth } from './AuthContext';
import { contestPhase } from '../utils/contest';
import type { ContestBoard } from '../utils/contest';

// The 대항전 board, shared by the home card, the sidebar (teachers get a
// menu item) and the join modal. One fetch for all of them; refetched on
// login/logout, after every saved solve, and every minute while it runs.

interface ContestContextValue {
  board: ContestBoard | null;
  refresh: () => void;
  /** The sign-up modal, opened from the card, the menu or a /join/<code> link. */
  joinOpen: boolean;
  joinCode: string;
  openJoin: (code?: string) => void;
  closeJoin: () => void;
}

const ContestContext = createContext<ContestContextValue | undefined>(undefined);

// A /join/<code> visit that has to log in first -- Google login leaves the
// page and comes back -- keeps its code here until the modal can use it.
const PENDING_CODE_KEY = 'pyquests_join_code';

function readPendingCode(): string {
  try {
    return sessionStorage.getItem(PENDING_CODE_KEY) ?? '';
  } catch {
    return '';
  }
}

function writePendingCode(code: string) {
  try {
    if (code) sessionStorage.setItem(PENDING_CODE_KEY, code);
    else sessionStorage.removeItem(PENDING_CODE_KEY);
  } catch {
    // Storage blocked: the code lives only as long as this page.
  }
}

export function ContestProvider({ children, initialJoinCode }: { children: ReactNode; initialJoinCode?: string }) {
  const { user } = useAuth();
  const [board, setBoard] = useState<ContestBoard | null>(null);
  const [joinCode, setJoinCode] = useState(() => initialJoinCode ?? readPendingCode());
  const [joinOpen, setJoinOpen] = useState(() => Boolean(initialJoinCode ?? readPendingCode()));

  const refresh = useCallback(() => {
    if (!isSupabaseConfigured) return;
    supabase.rpc('contest_board').then(({ data, error }) => {
      // Before migration 005 the function doesn't exist; no board then.
      setBoard(error ? null : ((data as ContestBoard | null) ?? null));
    });
  }, []);

  const userId = user?.id;
  useEffect(() => {
    refresh();
  }, [refresh, userId]);

  useEffect(() => {
    window.addEventListener(SOLVED_SAVED_EVENT, refresh);
    return () => window.removeEventListener(SOLVED_SAVED_EVENT, refresh);
  }, [refresh]);

  const running = board ? contestPhase(board.contest) === 'running' : false;
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') refresh();
    }, 60_000);
    return () => window.clearInterval(id);
  }, [running, refresh]);

  useEffect(() => {
    if (initialJoinCode) writePendingCode(initialJoinCode);
  }, [initialJoinCode]);

  const openJoin = useCallback((code = '') => {
    setJoinCode(code);
    writePendingCode(code);
    setJoinOpen(true);
  }, []);

  const closeJoin = useCallback(() => {
    setJoinOpen(false);
    setJoinCode('');
    writePendingCode('');
  }, []);

  return (
    <ContestContext.Provider value={{ board, refresh, joinOpen, joinCode, openJoin, closeJoin }}>
      {children}
    </ContestContext.Provider>
  );
}

// eslint-disable-next-line react/only-export-components
export function useContest(): ContestContextValue {
  const ctx = useContext(ContestContext);
  if (!ctx) throw new Error('useContest must be used inside ContestProvider');
  return ctx;
}
