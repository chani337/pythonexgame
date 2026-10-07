import { createClient } from '@supabase/supabase-js';

// Credentials come from the environment only. They used to have the live
// project's URL and publishable key hardcoded as `|| 'https://...'`
// fallbacks, which made .env / .env.example / .gitignore pointless and meant
// rotating the key required a code change and a redeploy. A publishable key
// is meant to be public -- it is in the client bundle either way -- but it
// should still be configuration, not source.
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(envUrl && envAnonKey);

// createClient throws "supabaseUrl is required." on an empty value, and this
// module sits at the root of the import graph -- letting it throw would take
// down the entire app, including the parts that work fine without a backend
// (problem solving, the study guide, the sandbox, guest progress in
// localStorage). So an unconfigured build gets a syntactically valid but
// non-routable placeholder, and every call site gates on
// isSupabaseConfigured instead.
//
// The handful of places that don't check the flag (Dashboard's ranking tabs,
// Board) all handle `{ data: null, error }`, which is what supabase-js
// returns when the request fails -- so they degrade to empty rather than
// crashing. Board is additionally unreachable without a login, which is
// itself impossible when unconfigured.
const PLACEHOLDER_URL = 'https://unconfigured.invalid';
const PLACEHOLDER_ANON_KEY = 'unconfigured-anon-key';

if (!isSupabaseConfigured && import.meta.env.DEV) {
  const missing = [
    !envUrl && 'VITE_SUPABASE_URL',
    !envAnonKey && 'VITE_SUPABASE_ANON_KEY',
  ].filter(Boolean).join(', ');

  console.error(
    `[PyQuests] ${missing} 가 설정되지 않았습니다.\n` +
    '로그인, 랭킹, 진도 동기화가 비활성화되고 게스트 모드로만 동작합니다.\n' +
    '.env.example 을 .env 로 복사한 뒤 Supabase 프로젝트 값을 채워 주세요.'
  );
}

// ---------------------------------------------------------------------------
// Shared-computer mode
// ---------------------------------------------------------------------------
// This site is meant for school computer labs, where the realistic failure is
// not an attacker -- it is a student who closes the lid and walks out, leaving
// the next person holding their account.
//
// supabase-js defaults to localStorage, which survives closing the tab, the
// browser, and a reboot. Checking "공용 컴퓨터예요" at login moves the session
// token to sessionStorage, which the browser discards when the tab closes.
//
// The client is a module-level singleton created before anyone has chosen
// anything, so the choice can't be a createClient argument. Instead the
// storage adapter below is consulted on every single read and write and picks
// its backing store at that moment. Nothing else in the app has to know.
const SHARED_PC_FLAG = 'pyquests_shared_pc';

// The flag itself lives in sessionStorage, which is the point: it dies with
// the tab at the same moment the token it governs does, so the two can never
// disagree about where the session is.
function readSharedFlag(): boolean {
  try {
    return sessionStorage.getItem(SHARED_PC_FLAG) === '1';
  } catch {
    // Safari in Private Browsing used to throw here, and a browser with
    // storage blocked entirely still does. Defaulting to false keeps the
    // normal path working; shared mode simply isn't available.
    return false;
  }
}

/** True when this tab is running as a shared/public computer session. */
export function isSharedComputerMode(): boolean {
  return readSharedFlag();
}

// supabase-js derives its storage key from the project ref
// (sb-<ref>-auth-token). We don't hardcode it -- passing an explicit
// storageKey to createClient would have been cleaner but would also have
// invalidated every existing user's session on deploy, logging the whole
// site out. So the few places that need to clear "whatever the auth token is
// called" match the pattern instead.
const AUTH_KEY_PATTERN = /^sb-.*-auth-token/;

function authKeysIn(store: Storage): string[] {
  const keys: string[] = [];
  for (let i = 0; i < store.length; i++) {
    const key = store.key(i);
    if (key && AUTH_KEY_PATTERN.test(key)) keys.push(key);
  }
  return keys;
}

/**
 * Switch this tab into (or out of) shared-computer mode.
 *
 * Must be called *before* the sign-in call it applies to. The adapter reads
 * the flag per call, so flipping it while a session is live would split reads
 * and writes across two stores.
 */
export function setSharedComputerMode(on: boolean): void {
  try {
    if (on) {
      sessionStorage.setItem(SHARED_PC_FLAG, '1');
      // A token left in localStorage by an earlier persistent login (or by a
      // sign-out that failed offline) would otherwise outlive the tab and
      // defeat the entire option.
      authKeysIn(localStorage).forEach((k) => localStorage.removeItem(k));
    } else {
      sessionStorage.removeItem(SHARED_PC_FLAG);
    }
  } catch {
    // Storage unavailable -- nothing to do, and readSharedFlag() already
    // reports false.
  }
}

/** Forget the shared-computer choice. Called on sign-out. */
export function clearSharedComputerMode(): void {
  setSharedComputerMode(false);
}

/** Remove the Supabase session token from both stores. */
export function purgeAuthTokens(): void {
  try {
    authKeysIn(localStorage).forEach((k) => localStorage.removeItem(k));
  } catch { /* storage unavailable */ }
  try {
    authKeysIn(sessionStorage).forEach((k) => sessionStorage.removeItem(k));
  } catch { /* storage unavailable */ }
}

const authStorage = {
  getItem: (key: string): string | null => {
    try {
      // Read only from the store this mode owns. Falling back to the other
      // one would let a leftover localStorage token resurrect a session that
      // was supposed to end with the tab.
      return (readSharedFlag() ? sessionStorage : localStorage).getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      const shared = readSharedFlag();
      (shared ? sessionStorage : localStorage).setItem(key, value);
      // Token refresh runs every hour; without this a single stale copy in
      // the other store would sit there indefinitely.
      (shared ? localStorage : sessionStorage).removeItem(key);
    } catch { /* storage unavailable */ }
  },
  removeItem: (key: string): void => {
    // Sign-out clears both unconditionally -- "logged out" has to mean
    // logged out regardless of which mode wrote the token.
    try { localStorage.removeItem(key); } catch { /* storage unavailable */ }
    try { sessionStorage.removeItem(key); } catch { /* storage unavailable */ }
  },
};

export const supabase = createClient(
  envUrl || PLACEHOLDER_URL,
  envAnonKey || PLACEHOLDER_ANON_KEY,
  {
    auth: {
      storage: authStorage,
      // Unchanged defaults, spelled out because the storage override makes
      // it non-obvious what the session lifetime now is: the token is still
      // persisted and still auto-refreshed -- only *where* it lands moves.
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
