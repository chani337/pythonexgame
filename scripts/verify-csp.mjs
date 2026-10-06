// Checks the Content-Security-Policy in vercel.json against what the built
// app actually loads. Catches the two failure modes that are invisible until
// the policy is enforced in production:
//
//   1. a stale inline-script hash (dark mode silently stops applying before
//      first paint), and
//   2. a subresource origin that no directive allows.
//
// It cannot replace a Report-Only deploy -- only a real browser knows whether
// Pyodide needs 'unsafe-eval' on top of 'wasm-unsafe-eval', for instance.
// See docs/security-headers.md for that procedure.
//
//   npm run build && npm run verify:csp
//
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const vercel = JSON.parse(await readFile(resolve(ROOT, 'vercel.json'), 'utf8'));
const html = await readFile(resolve(ROOT, 'dist/index.html'), 'utf8');

const headers = vercel.headers?.[0]?.headers ?? [];
const byKey = Object.fromEntries(headers.map((h) => [h.key, h.value]));

const cspHeader =
  byKey['Content-Security-Policy'] ?? byKey['Content-Security-Policy-Report-Only'];
const enforcing = Boolean(byKey['Content-Security-Policy']);

if (!cspHeader) {
  console.error('vercel.json 에 CSP 헤더가 없습니다.');
  process.exit(1);
}

const directives = Object.fromEntries(
  cspHeader.split(';').map((part) => {
    const [name, ...values] = part.trim().split(/\s+/);
    return [name, values];
  })
);

const problems = [];
const notes = [];

console.log(`모드: ${enforcing ? 'Content-Security-Policy (강제)' : 'Content-Security-Policy-Report-Only (관찰)'}`);
console.log(`지시어 ${Object.keys(directives).length}개\n`);

// --- 1. inline script hashes must match the current build ----------------
const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)];
const scriptSrc = directives['script-src'] ?? [];

for (const [, body] of inline) {
  const hash = `'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`;
  if (scriptSrc.includes(hash)) {
    console.log(`OK   인라인 script 해시 일치  ${hash}`);
  } else if (scriptSrc.includes("'unsafe-inline'")) {
    notes.push(`인라인 script 가 'unsafe-inline' 으로 허용됨 — 해시(${hash})로 좁히는 것을 권장`);
  } else {
    problems.push(`인라인 script 해시 불일치. script-src 에 ${hash} 를 넣어야 합니다 (npm run csp:hash)`);
  }
}
if (inline.length === 0) console.log('OK   인라인 script 없음');

// --- 2. every subresource in index.html must be allowed ------------------
const DIRECTIVE_FOR_TAG = {
  script: 'script-src',
  stylesheet: 'style-src',
  manifest: 'manifest-src',
};

function allows(directive, url) {
  const values = directives[directive] ?? directives['default-src'] ?? [];
  if (url.startsWith('/') || url.startsWith('./')) return values.includes("'self'");
  const origin = new URL(url).origin;
  return values.includes(origin) || values.includes("'self'") && origin === 'self';
}

const subresources = [
  ...[...html.matchAll(/<script[^>]*\bsrc="([^"]+)"/g)].map((m) => ['script', m[1]]),
  ...[...html.matchAll(/<link[^>]*\brel="stylesheet"[^>]*\bhref="([^"]+)"/g)].map((m) => ['stylesheet', m[1]]),
  ...[...html.matchAll(/<link[^>]*\bhref="([^"]+)"[^>]*\brel="stylesheet"/g)].map((m) => ['stylesheet', m[1]]),
  ...[...html.matchAll(/<link[^>]*\brel="manifest"[^>]*\bhref="([^"]+)"/g)].map((m) => ['manifest', m[1]]),
];

for (const [tag, url] of subresources) {
  const directive = DIRECTIVE_FOR_TAG[tag];
  if (allows(directive, url)) {
    console.log(`OK   ${directive.padEnd(13)} ${url.slice(0, 64)}`);
  } else {
    problems.push(`${directive} 가 허용하지 않는 출처: ${url}`);
  }
}

// --- 3. origins fetched at runtime, which no static scan can find --------
// Established by reading the code, not by scanning strings: scanning dist/
// would also pick up every URL inside the HTML/CSS study-guide chapters,
// which are text in a <pre> and never requested.
const RUNTIME = [
  ['connect-src', 'https://cdn.jsdelivr.net', 'Pyodide 가 받는 wasm / 패키지 휠'],
  ['connect-src', process.env.VITE_SUPABASE_URL || '', 'Supabase REST'],
  ['font-src', 'https://fonts.gstatic.com', 'Google Fonts 폰트 파일'],
];

for (const [directive, origin, why] of RUNTIME) {
  if (!origin) {
    notes.push(`${directive}: VITE_SUPABASE_URL 이 설정되지 않아 Supabase 출처를 확인하지 못했습니다`);
    continue;
  }
  if (allows(directive, origin)) {
    console.log(`OK   ${directive.padEnd(13)} ${origin}  (${why})`);
  } else {
    problems.push(`${directive} 에 ${origin} 가 없습니다 — ${why}`);
  }
}

// wss:// for Supabase realtime is a separate scheme from https://
const supaUrl = process.env.VITE_SUPABASE_URL;
if (supaUrl) {
  const wss = supaUrl.replace(/^https:/, 'wss:');
  if ((directives['connect-src'] ?? []).includes(wss)) {
    console.log(`OK   connect-src   ${wss}  (Supabase realtime)`);
  } else {
    problems.push(`connect-src 에 ${wss} 가 없습니다 — Supabase realtime 웹소켓이 막힙니다`);
  }
}

// --- 4. directives the app's own runtime requires ------------------------
const REQUIRED = [
  ['script-src', "'wasm-unsafe-eval'", 'Pyodide 의 WebAssembly 컴파일'],
  ['script-src', "'unsafe-eval'", 'useJsRunner 의 new Function (blob 워커는 문서 CSP 를 상속)'],
  ['worker-src', 'blob:', 'useJsRunner 가 blob URL 로 워커를 생성'],
];
for (const [directive, token, why] of REQUIRED) {
  if ((directives[directive] ?? []).includes(token)) {
    console.log(`OK   ${directive.padEnd(13)} ${token}  (${why})`);
  } else {
    problems.push(`${directive} 에 ${token} 가 필요합니다 — ${why}`);
  }
}

// --- 5. hardening that should be present --------------------------------
const EXPECTED_LOCKS = [
  ['object-src', "'none'"],
  ['frame-ancestors', "'none'"],
  ['base-uri', "'self'"],
];
for (const [directive, token] of EXPECTED_LOCKS) {
  if (!(directives[directive] ?? []).includes(token)) {
    notes.push(`${directive} ${token} 를 넣는 것을 권장합니다`);
  }
}

for (const key of ['X-Content-Type-Options', 'Referrer-Policy', 'X-Frame-Options', 'Permissions-Policy']) {
  if (byKey[key]) console.log(`OK   헤더          ${key}: ${byKey[key].slice(0, 50)}`);
  else problems.push(`${key} 헤더가 없습니다`);
}

// Vercel adds `access-control-allow-origin: *` to every static file it
// serves, and vercel.json headers are additive -- omitting the key leaves
// that default in place (verified against the live deployment). So the
// header must be PRESENT with a restrictive value, not absent.
const acao = byKey['Access-Control-Allow-Origin'];
if (!acao) {
  problems.push(
    'Access-Control-Allow-Origin 을 명시해야 합니다 — 생략하면 Vercel 기본값 * 이 그대로 남습니다'
  );
} else if (acao === '*') {
  problems.push('Access-Control-Allow-Origin 이 * 입니다 — 자기 출처로 좁히세요');
} else {
  console.log(`OK   Access-Control-Allow-Origin ${acao} (Vercel 기본값 * 를 덮어씀)`);
}

// fullscreen must stay allowed -- DocsViewer's 집중 모드 uses it
const pp = byKey['Permissions-Policy'] ?? '';
if (/\bfullscreen=\(\)/.test(pp)) {
  problems.push("Permissions-Policy 가 fullscreen 을 차단합니다 — DocsViewer 집중 학습 모드가 깨집니다");
} else if (/fullscreen=\(self\)/.test(pp)) {
  console.log('OK   Permissions-Policy fullscreen=(self) (집중 학습 모드 유지)');
}

console.log('');
if (notes.length) {
  console.log('참고:');
  for (const n of notes) console.log('  - ' + n);
  console.log('');
}
if (problems.length) {
  console.log('문제:');
  for (const p of problems) console.log('  ! ' + p);
  process.exit(1);
}
console.log('CSP 정적 검증 통과. 실제 위반 여부는 Report-Only 배포로 확인하세요.');
