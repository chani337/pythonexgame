// Checks that deep URLs actually resolve.
//
// This exists because of a bug that survived unnoticed for a long time: the
// SPA rewrite in vercel.json pointed at /index.html, and Vercel canonicalises
// /index.html to / with a 308. The destination therefore resolved to a
// redirect rather than a file, and every path except / returned 404 in
// production.
//
// Worth recording that the first fix attempt was wrong: the 308 looked like
// it came from cleanUrls, so cleanUrls was removed -- and /index.html still
// 308'd, because that canonicalisation is Vercel's default. Only the
// deployed-host probe below settled it.
//
// Nothing caught it locally because `vite preview` has its own SPA fallback,
// so the routes all returned 200 on a dev machine regardless of what
// vercel.json said. The only check that would have found it is one that asks
// the deployed host.
//
//   npm run verify:routing                          # config checks only
//   PYQUESTS_URL=https://pyquests.vercel.app npm run verify:routing
//
import { readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(import.meta.dirname, '..');

let failures = 0;
const ok = (label, extra = '') => console.log(`  통과 ${label}${extra ? ' — ' + extra : ''}`);
const bad = (label, detail) => { failures++; console.log(`  실패 ${label}\n       ${detail}`); };
const check = (cond, label, detail) => (cond ? ok(label) : bad(label, detail));

const dir = await mkdtemp(join(ROOT, 'node_modules', '.vroute-'));
const out = join(dir, 'routes.mjs');
await build({
  entryPoints: [join(ROOT, 'src/lib/routes.ts')], outfile: out,
  format: 'esm', platform: 'node', bundle: true, logLevel: 'silent',
});
const { staticPaths, parsePath, buildPath } = await import(pathToFileURL(out).href);
await rm(dir, { recursive: true, force: true });

const vercel = JSON.parse(await readFile(join(ROOT, 'vercel.json'), 'utf8'));

console.log('\n[1] vercel.json 라우팅 설정');

// Vercel validates vercel.json against a schema and fails the deploy on an
// unknown top-level property. From outside that is invisible -- the previous
// build simply stays up -- so a config-only commit looks deployed and isn't.
// This cost two wrong diagnoses: a '//' comment key was added here, the
// deploys silently failed, and production kept answering with the old config
// while the fixes appeared to have no effect.
const ALLOWED_TOP_LEVEL = new Set([
  'rewrites', 'redirects', 'headers', 'cleanUrls', 'trailingSlash',
  'buildCommand', 'outputDirectory', 'installCommand', 'framework',
  'devCommand', 'regions', 'functions', 'crons', 'images', 'public', 'git',
]);
const unknownKeys = Object.keys(vercel).filter((k) => !ALLOWED_TOP_LEVEL.has(k));
check(unknownKeys.length === 0, 'vercel.json 에 알 수 없는 최상위 키가 없음',
      `알 수 없는 키: ${unknownKeys.join(', ')}\n`
      + '       Vercel 이 스키마 검증에 실패해 배포가 거부되고, 이전 빌드가\n'
      + '       그대로 서비스됩니다 — 밖에서는 "배포됐는데 효과가 없는" 것처럼 보입니다.\n'
      + '       주석이 필요하면 docs/ 에 쓰세요.');

const rewrites = vercel.rewrites ?? [];
// The catch-all must skip /assets/: a hashed chunk that no longer exists
// (a tab left open across a deploy) has to 404, not get index.html with a
// 200 -- the browser rejects that as a module and, before ViewErrorBoundary,
// the app went blank. See src/lib/lazyWithReload.ts.
const CATCH_ALL = '/((?!assets/).*)';
const catchAll = rewrites.find((r) => r.source === CATCH_ALL);
const unguarded = rewrites.find((r) => r.source === '/(.*)' || r.source === '/:path*');
check(!unguarded, '없는 /assets/ 파일이 index.html 로 응답되지 않음',
      `rewrite source 가 ${unguarded?.source} 입니다. ${CATCH_ALL} 로 바꾸세요.\n`
      + '       배포 전에 열어 둔 탭이 옛 청크를 요청하면 HTML 이 돌아가 화면이 하얘집니다.');
check(Boolean(catchAll), 'SPA catch-all rewrite 존재',
      'rewrite 가 없으면 / 외의 모든 경로가 404 입니다');

if (catchAll) {
  // The exact bug: Vercel 308-redirects /index.html to / by default, so an
  // .html destination is a redirect rather than a servable file and the
  // rewrite produces a 404.
  check(
    !/\.html$/.test(catchAll.destination),
    'destination 이 .html 이 아님',
    `destination: ${catchAll.destination}\n`
    + '       Vercel 은 /index.html 을 / 로 308 리다이렉트합니다. rewrite 가\n'
    + '       파일이 아니라 리다이렉트를 가리켜 모든 깊은 경로가 404 가 됩니다.\n'
    + "       destination 을 '/' 로 두세요."
  );

  check(catchAll.destination === '/', "destination 이 '/' 임",
        `destination: ${catchAll.destination}`);
}

// A redirect whose source swallows an app path would shadow the rewrite.
const redirects = vercel.redirects ?? [];
const shadowed = staticPaths().filter((p) =>
  redirects.some((r) => r.source === p || r.source === '/(.*)')
);
check(shadowed.length === 0, 'redirects 가 앱 경로를 가로채지 않음',
      `가로채는 경로: ${shadowed.join(', ')}`);

console.log('\n[2] routes.ts 와 광고하는 경로가 일치하는지');

const paths = staticPaths();
console.log(`  staticPaths: ${paths.length}개 — ${paths.join(' ')}`);
const unresolved = paths.filter((p) => p !== '/' && parsePath(p).view === 'dashboard');
check(unresolved.length === 0, '모든 staticPaths 가 해석됨',
      `대시보드로 떨어지는 경로: ${unresolved.join(', ')}`);
const notCanonical = paths.filter((p) => buildPath(parsePath(p)) !== p);
check(notCanonical.length === 0, '모든 staticPaths 가 정규형',
      `왕복하지 않는 경로: ${notCanonical.join(', ')}`);

const base = process.env.PYQUESTS_URL;
if (!base) {
  console.log('\n[3] 배포본 확인 — 건너뜀');
  console.log('  PYQUESTS_URL 을 지정하면 실제 호스트에서 각 경로를 확인합니다.');
  console.log('  예: PYQUESTS_URL=https://pyquests.vercel.app npm run verify:routing');
} else {
  console.log(`\n[3] 배포본 확인 — ${base}`);
  // The only check that would have caught the original bug: vite preview has
  // its own SPA fallback, so a dev machine says 200 no matter what.
  const probes = [...paths, '/problems/basic_part1_q3', '/nope'];
  for (const p of probes) {
    let status = 0, redirect = '';
    try {
      const res = await fetch(base + p, { redirect: 'manual' });
      status = res.status;
      redirect = res.headers.get('location') ?? '';
    } catch (err) {
      bad(`${p} 요청 실패`, err.message);
      continue;
    }
    if (status === 200) {
      ok(p.padEnd(26), '200');
    } else {
      bad(p.padEnd(26), `${status}${redirect ? ' -> ' + redirect : ''}\n`
          + '       SPA rewrite 가 동작하지 않습니다. 붙여넣은 링크와 새로고침이 모두 깨집니다.');
    }
  }
}

console.log(failures === 0 ? '\n모두 통과.' : `\n${failures}건 실패.`);
process.exit(failures === 0 ? 0 : 1);
