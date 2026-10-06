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

export const supabase = createClient(
  envUrl || PLACEHOLDER_URL,
  envAnonKey || PLACEHOLDER_ANON_KEY
);
