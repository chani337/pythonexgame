// Verifies the shared-computer session handling (backlog item 8).
//
// Two halves:
//
//   1. It EXECUTES the real storage adapter from src/lib/supabase.ts against
//      fake Storage objects. The adapter is the entire mechanism behind
//      "공용 컴퓨터예요" -- if it ever reads through to localStorage as a
//      fallback, a session that was supposed to die with the tab survives it,
//      and nothing about the UI would look different. That is not a bug a
//      type check or a glance at the diff would catch.
//
//   2. It reads the source to check the things types can't: that every
//      pyquests_* localStorage key the app writes has an explicit logout
//      decision, that the idle timer is actually armed, that a logout exists
//      on mobile (where the desktop sidebar is display:none), and that no
//      service-worker route can cache a Supabase response.
//
//   npm run verify:shared-pc
//
import { build } from 'esbuild';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(import.meta.dirname, '..');
const read = (rel) => readFile(join(ROOT, rel), 'utf8');

let failures = 0;
const ok = (label, extra = '') => console.log(`  통과 ${label}${extra ? ' — ' + extra : ''}`);
const bad = (label, detail) => {
  failures++;
  console.log(`  실패 ${label}\n       ${detail}`);
};
const check = (cond, label, detail) => (cond ? ok(label) : bad(label, detail));

// ---------------------------------------------------------------------------
// A Storage stand-in. `blocked` reproduces a browser with storage disabled,
// which throws on access rather than returning null.
// ---------------------------------------------------------------------------
function fakeStorage({ blocked = false } = {}) {
  const map = new Map();
  const guard = () => {
    if (blocked) throw new DOMException('storage disabled', 'SecurityError');
  };
  return {
    get length() { guard(); return map.size; },
    key(i) { guard(); return [...map.keys()][i] ?? null; },
    getItem(k) { guard(); return map.has(k) ? map.get(k) : null; },
    setItem(k, v) { guard(); map.set(k, String(v)); },
    removeItem(k) { guard(); map.delete(k); },
    clear() { guard(); map.clear(); },
    _map: map,
  };
}

// ---------------------------------------------------------------------------
// 1. The real adapter, executed
// ---------------------------------------------------------------------------
console.log('\n[1] supabase.ts 세션 저장소 어댑터 — 실제 실행');

const dir = await mkdtemp(join(ROOT, 'node_modules', '.vshared-'));
let mod;
try {
  const out = join(dir, 'supabase.mjs');
  await build({
    entryPoints: [join(ROOT, 'src/lib/supabase.ts')],
    outfile: out,
    format: 'esm',
    platform: 'node',
    bundle: true,
    logLevel: 'silent',
    define: {
      // createClient rejects an empty url, and the unconfigured branch would
      // skip straight past the adapter. These are never dialled.
      'import.meta.env.VITE_SUPABASE_URL': '"https://verify.supabase.co"',
      'import.meta.env.VITE_SUPABASE_ANON_KEY': '"verify-anon-key"',
      'import.meta.env.DEV': 'false',
    },
  });

  // Must exist before the module body runs: createClient touches storage.
  globalThis.localStorage = fakeStorage();
  globalThis.sessionStorage = fakeStorage();

  mod = await import(pathToFileURL(out).href);
} finally {
  await rm(dir, { recursive: true, force: true });
}

const required = ['isSharedComputerMode', 'setSharedComputerMode', 'clearSharedComputerMode', 'purgeAuthTokens', 'supabase'];
const missing = required.filter((n) => typeof mod[n] === 'undefined');
if (missing.length) {
  bad('필요한 export', `없음: ${missing.join(', ')}`);
  console.log('\n이후 검사를 진행할 수 없습니다.');
  process.exit(1);
}
ok('export', required.join(', '));

// The adapter isn't exported (nothing else should reach it), so reach it the
// way supabase-js does.
const adapter = mod.supabase.auth?.storage ?? mod.supabase.auth?.storageKey !== undefined
  ? mod.supabase.auth.storage
  : undefined;

if (!adapter || typeof adapter.getItem !== 'function') {
  bad('createClient 에 커스텀 storage 전달',
      'supabase.auth.storage 가 우리 어댑터가 아닙니다 — 세션이 기본 localStorage 에 저장되어 '
      + '"공용 컴퓨터예요" 옵션이 아무 일도 하지 않습니다');
} else {
  ok('createClient 에 커스텀 storage 전달');

  const TOKEN = 'sb-verify-auth-token';
  const reset = () => {
    globalThis.localStorage = fakeStorage();
    globalThis.sessionStorage = fakeStorage();
  };

  // (a) default mode -> localStorage
  reset();
  mod.clearSharedComputerMode();
  adapter.setItem(TOKEN, 'persistent');
  check(
    globalThis.localStorage.getItem(TOKEN) === 'persistent' && globalThis.sessionStorage.getItem(TOKEN) === null,
    '기본 모드: 세션이 localStorage 에 저장됨',
    `localStorage=${globalThis.localStorage.getItem(TOKEN)}, sessionStorage=${globalThis.sessionStorage.getItem(TOKEN)}`
  );
  check(mod.isSharedComputerMode() === false, '기본 모드: isSharedComputerMode() === false', '기본값이 공용 모드입니다');

  // (b) shared mode -> sessionStorage, and no copy left behind
  reset();
  mod.setSharedComputerMode(true);
  adapter.setItem(TOKEN, 'ephemeral');
  check(
    globalThis.sessionStorage.getItem(TOKEN) === 'ephemeral' && globalThis.localStorage.getItem(TOKEN) === null,
    '공용 모드: 세션이 sessionStorage 에만 저장됨',
    `localStorage=${globalThis.localStorage.getItem(TOKEN)}, sessionStorage=${globalThis.sessionStorage.getItem(TOKEN)}`
  );
  check(mod.isSharedComputerMode() === true, '공용 모드: 플래그가 읽힘', '플래그를 못 읽습니다');

  // (c) the one that matters: a leftover localStorage token must NOT be read
  // in shared mode. A fallback read here resurrects a session that was
  // supposed to end when the tab closed.
  reset();
  globalThis.localStorage.setItem(TOKEN, 'leftover-from-last-student');
  mod.setSharedComputerMode(true);
  check(
    adapter.getItem(TOKEN) === null,
    '공용 모드: localStorage 의 잔여 토큰을 읽지 않음',
    `읽어 왔습니다: ${adapter.getItem(TOKEN)} — 탭을 닫아도 세션이 살아남습니다`
  );

  // (d) ...and switching into shared mode actively removes it, so no later
  // read in default mode can find it either.
  check(
    globalThis.localStorage.getItem(TOKEN) === null,
    '공용 모드 전환 시 localStorage 의 기존 토큰 제거',
    '남아 있습니다 — 다음 기본 모드 방문자가 그 세션으로 로그인됩니다'
  );

  // (e) removeItem clears both stores: "logged out" must mean logged out
  // regardless of which mode wrote the token.
  reset();
  globalThis.localStorage.setItem(TOKEN, 'a');
  globalThis.sessionStorage.setItem(TOKEN, 'b');
  adapter.removeItem(TOKEN);
  check(
    globalThis.localStorage.getItem(TOKEN) === null && globalThis.sessionStorage.getItem(TOKEN) === null,
    '로그아웃: 두 저장소 모두에서 토큰 제거',
    `localStorage=${globalThis.localStorage.getItem(TOKEN)}, sessionStorage=${globalThis.sessionStorage.getItem(TOKEN)}`
  );

  // (f) purgeAuthTokens finds the token by pattern -- used when signOut()
  // fails offline and the local session has to end anyway.
  reset();
  globalThis.localStorage.setItem('sb-abcdefgh-auth-token', 'x');
  globalThis.localStorage.setItem('sb-abcdefgh-auth-token-code-verifier', 'y');
  globalThis.localStorage.setItem('pyquests_dark_mode', 'true');
  globalThis.sessionStorage.setItem('sb-abcdefgh-auth-token', 'z');
  mod.purgeAuthTokens();
  check(
    globalThis.localStorage.getItem('sb-abcdefgh-auth-token') === null
      && globalThis.localStorage.getItem('sb-abcdefgh-auth-token-code-verifier') === null
      && globalThis.sessionStorage.getItem('sb-abcdefgh-auth-token') === null,
    'purgeAuthTokens: 패턴으로 토큰 제거 (오프라인 로그아웃 대비)',
    '토큰이 남았습니다'
  );
  check(
    globalThis.localStorage.getItem('pyquests_dark_mode') === 'true',
    'purgeAuthTokens: 관계없는 키는 건드리지 않음',
    '앱 설정까지 지웠습니다'
  );

  // (g) storage blocked entirely (private mode, policy) must not throw --
  // this module is at the root of the import graph, so a throw here is a
  // white screen for the whole site.
  globalThis.localStorage = fakeStorage({ blocked: true });
  globalThis.sessionStorage = fakeStorage({ blocked: true });
  let threw = null;
  try {
    mod.isSharedComputerMode();
    mod.setSharedComputerMode(true);
    mod.purgeAuthTokens();
    adapter.setItem(TOKEN, 'v');
    adapter.getItem(TOKEN);
    adapter.removeItem(TOKEN);
  } catch (err) {
    threw = err;
  }
  check(threw === null, '스토리지가 차단된 브라우저에서 예외를 던지지 않음',
        `${threw && threw.message} — 이 모듈이 던지면 사이트 전체가 흰 화면입니다`);
}

// ---------------------------------------------------------------------------
// 2. Source-level checks
// ---------------------------------------------------------------------------
const authCtx = await read('src/contexts/AuthContext.tsx');
const appTsx = await read('src/App.tsx');
const sidebar = await read('src/components/Sidebar.tsx');
const authModal = await read('src/components/AuthModal.tsx');
const viteConfig = await read('vite.config.ts');
const indexCss = await read('src/index.css');

console.log('\n[2] 로그아웃 시 정리 — 앱이 쓰는 모든 pyquests_* 키에 결정이 있는지');

// Every pyquests_* key written anywhere in src/, including the scoped ones
// built from a prefix + user id.
const SRC_FILES = [
  ['AuthContext.tsx', authCtx],
  ['App.tsx', appTsx],
  ['Sidebar.tsx', sidebar],
  ['AuthModal.tsx', authModal],
  ['Dashboard.tsx', await read('src/components/Dashboard.tsx')],
  ['DocsViewer.tsx', await read('src/components/DocsViewer.tsx')],
  ['useDarkMode.ts', await read('src/hooks/useDarkMode.ts')],
  ['useIdleLogout.ts', await read('src/hooks/useIdleLogout.ts')],
  ['supabase.ts', await read('src/lib/supabase.ts')],
];

const written = new Set();
for (const [, text] of SRC_FILES) {
  // localStorage.setItem('pyquests_x', ...) and the `${prefix}${id}` form,
  // plus the prefix constants themselves. Comments are stripped first so a
  // prose mention of `pyquests_*` isn't mistaken for a key.
  const code = text.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of code.matchAll(/['"`](pyquests_[a-z0-9_]*)/g)) written.add(m[1]);
}

// What the logout path removes, literally.
const logoutBlock = authCtx.slice(
  authCtx.indexOf('function purgeSignedOutAccountLocalStorage'),
  authCtx.indexOf('// ADMIN_EMAIL')
);
const scopedPrefixes = [...authCtx.matchAll(/^\s*'(pyquests_[a-z_]*_)',$/gm)].map((m) => m[1]);

// Keys deliberately left in place, with the reason that has to stay true.
const INTENTIONAL_KEEPS = {
  pyquests_solved_ids_guest: '게스트 키 — 병합 실패 시 재시도용, 지우면 데이터 유실',
  pyquests_dark_mode: '기기 설정, 개인정보 아님',
  pyquests_sidebar_collapsed: '기기 설정, 개인정보 아님',
  pyquests_shared_pc: '세션 플래그 — clearSharedComputerMode() 가 처리',
  pyquests_last_activity_at: '무활동 타이머 — clearIdleTimer() 가 처리',
  pyquests_sandbox_code: '공용 모드에서만 삭제 (개인 기기에서는 작업물 보존)',
  // Where you were in the study guide. Unscoped and shared between everyone
  // on the browser, like the two settings above -- it shows the previous
  // person's reading position, which is UI state rather than their data.
  pyquests_docs_last_category: '학습가이드 UI 위치, 개인정보 아님',
  pyquests_docs_last_chapter_idx: '학습가이드 UI 위치, 개인정보 아님',
  pyquests_docs_toc_open: '학습가이드 UI 상태, 개인정보 아님',
};

const rows = [];
for (const key of [...written].sort()) {
  // The scoped prefixes are templates, not keys: `pyquests_solved_ids_` is
  // removed for the leaving user id by the prefix loop.
  const isScopedPrefix = scopedPrefixes.includes(key);
  const isGuestKey = key.endsWith('_guest');
  let verdict = null;

  // INTENTIONAL_KEEPS first: pyquests_sandbox_code appears in the logout
  // block but only inside the shared-mode branch, so matching the block
  // would label it unconditionally cleared.
  if (isScopedPrefix) verdict = '계정별 키 — 접두사 루프로 삭제';
  else if (key in INTENTIONAL_KEEPS) verdict = '결정: ' + INTENTIONAL_KEEPS[key];
  else if (logoutBlock.includes(`'${key}'`)) verdict = '로그아웃 시 삭제';
  else if (isGuestKey && key.replace(/_guest$/, '_') in Object.fromEntries(scopedPrefixes.map((p) => [p, 1])))
    verdict = '게스트 키 — 보존(병합 재시도용)';

  rows.push([key, verdict]);
}

const undecided = rows.filter(([, v]) => v === null);
for (const [key, v] of rows) {
  console.log(`  ${key.padEnd(34)} ${v ?? '>>> 결정 없음 <<<'}`);
}
if (undecided.length) {
  bad('모든 pyquests_* 키에 로그아웃 결정이 있음',
      `결정 없음: ${undecided.map(([k]) => k).join(', ')}\n`
      + '       새 키를 추가했다면 로그아웃 시 삭제하거나 INTENTIONAL_KEEPS 에 근거와 함께 넣으세요.');
} else {
  ok('모든 pyquests_* 키에 로그아웃 결정이 있음', `${rows.length}개`);
}

// The three the backlog named explicitly.
for (const key of ['pyquests_cached_leaderboard', 'pyquests_last_user_id', 'pyquests_last_user_email']) {
  check(logoutBlock.includes(`'${key}'`), `로그아웃 시 ${key} 삭제`,
        '남겨두면 이전 사용자가 랭킹에서 "나"로 강조됩니다');
}
check(logoutBlock.includes('purgeAuthTokens()'), '로그아웃 시 Supabase 토큰 강제 제거',
      '네트워크가 끊긴 상태의 로그아웃이 브라우저를 로그인 상태로 남깁니다');

console.log('\n[3] 60분 무활동 자동 로그아웃');

check(/useIdleLogout\(\s*Boolean\(user\)/.test(authCtx), 'AuthContext 가 로그인 상태에서 타이머를 가동',
      'useIdleLogout 호출이 없거나 조건이 바뀌었습니다 — 자동 로그아웃이 전혀 동작하지 않습니다');
check(/signOut\('idle'\)/.test(authCtx), '타이머가 signOut(\'idle\') 을 호출',
      '로그아웃 정리를 건너뛰는 경로입니다');
check(authCtx.includes('clearIdleTimer()'), '로그아웃 시 타이머 초기화',
      '다음 사용자가 로그인 즉시 로그아웃됩니다');

const idle = SRC_FILES.find(([n]) => n === 'useIdleLogout.ts')[1];
check(/IDLE_LIMIT_MS = 60 \* 60 \* 1000/.test(idle), '제한이 60분', '백로그가 요구한 값은 60분입니다');
check(!/setTimeout\(\s*[^,]*,\s*IDLE_LIMIT_MS/.test(idle), '마감을 setTimeout 이 아니라 타임스탬프로 판정',
      '백그라운드 탭의 타이머는 스로틀되고 절전 중에는 멈춥니다');
check(idle.includes("localStorage") && idle.includes('pyquests_last_activity_at'),
      '활동 시각을 탭 간에 공유', '한 탭에서 작업 중인데 다른 탭이 로그아웃시킵니다');
check(idle.includes('visibilitychange'), '탭 복귀 시 즉시 마감 확인',
      '숨겨진 탭에서는 인터벌이 돌지 않아 오래된 마감이 방치됩니다');
check(appTsx.includes('IdleLogoutNotice'), '자동 로그아웃 안내 표시',
      '설명 없는 로그아웃은 사이트 고장과 구별되지 않습니다');

console.log('\n[4] 항상 보이는 로그아웃');

// The desktop account card is display:none below 768px, so the mobile panel
// needs its own logout -- otherwise there is no way to log out on a phone.
const mobileHidesDesktop = /@media \(max-width: 768px\)[\s\S]*?\.sidebar-desktop\s*\{\s*display:\s*none/.test(indexCss);
const mobileBlock = sidebar.slice(sidebar.indexOf('MOBILE BOTTOM TAB BAR'));
check(!mobileHidesDesktop || /signOut\(\)/.test(mobileBlock),
      '모바일(≤768px)에서도 로그아웃 가능',
      '.sidebar-desktop 이 숨겨지는데 모바일 패널에 로그아웃이 없습니다 — 휴대폰에서 로그아웃할 방법이 없습니다');
check(/signOut\(\)/.test(sidebar.slice(0, sidebar.indexOf('MOBILE BOTTOM TAB BAR'))),
      '데스크톱 사이드바에 로그아웃', '로그아웃 버튼이 사라졌습니다');

console.log('\n[5] 공용 컴퓨터 옵션');

check(authModal.includes('공용 컴퓨터예요'), '로그인 화면에 공용 컴퓨터 체크박스', '옵션이 없습니다');
check(authModal.indexOf('공용 컴퓨터예요') < authModal.indexOf('Google OAuth Login Button'),
      '체크박스가 Google 버튼보다 위', 'Google 로그인 사용자에게는 보이지 않습니다');
for (const [fn, arg] of [['signIn', 'sharedComputer'], ['signUp', 'sharedComputer'], ['signInWithGoogle', 'sharedComputer']]) {
  check(new RegExp(`${fn}\\([^)]*${arg}`).test(authModal), `${fn} 에 선택값 전달`,
        '체크박스가 아무 효과도 없습니다');
}
check(/setSharedComputerMode\(sharedComputer\);[\s\S]{0,400}?supabase\.auth\.signInWithPassword/.test(authCtx),
      '토큰이 기록되기 전에 모드를 적용', '어댑터는 쓰기 시점에 저장소를 고릅니다 — 순서가 뒤바뀌면 무효입니다');

console.log('\n[6] 서비스워커가 개인화 응답을 캐시하지 않는지');

const workbox = viteConfig.slice(viteConfig.indexOf('runtimeCaching'), viteConfig.lastIndexOf(']'));
const patterns = [...workbox.matchAll(/urlPattern:\s*(.+)/g)].map((m) => m[1].trim());
console.log(`  runtimeCaching 경로 ${patterns.length}개`);
patterns.forEach((p) => console.log(`    ${p.replace(/,$/, '')}`));
check(!/supabase/i.test(workbox), 'Supabase 를 캐시하는 경로 없음',
      'Supabase 응답이 캐시되면 로그아웃 후에도 개인 데이터가 디스크에 남습니다');
check(!/urlPattern:\s*\/\^?\\?\/?\(\?:/.test(workbox) && !patterns.some((p) => p.includes('.*')),
      '모든 경로가 특정 출처·경로로 한정됨', '와일드카드 경로는 Supabase 응답까지 삼킬 수 있습니다');
const globs = (viteConfig.match(/globPatterns:\s*\[(.*?)\]/s) || [, ''])[1];
check(!/json|txt/.test(globs), '프리캐시 glob 에 데이터 파일 없음', `globPatterns=${globs}`);

console.log(
  failures === 0
    ? '\n모두 통과.'
    : `\n${failures}건 실패.`
);
process.exit(failures === 0 ? 0 : 1);
