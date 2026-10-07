// Checks that deep URLs actually resolve.
//
// This exists because of a bug that survived unnoticed for a long time: the
// SPA rewrite in vercel.json pointed at /index.html while cleanUrls was on,
// and cleanUrls 308-redirects /index.html to /. The destination therefore
// resolved to a redirect rather than a file, and every path except / returned
// 404 in production.
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

const rewrites = vercel.rewrites ?? [];
const catchAll = rewrites.find((r) => r.source === '/(.*)' || r.source === '/:path*');
check(Boolean(catchAll), 'SPA catch-all rewrite 존재',
      'rewrite 가 없으면 / 외의 모든 경로가 404 입니다');

if (catchAll) {
  // The exact bug. cleanUrls strips .html, which turns an .html destination
  // into a 308 and leaves the rewrite pointing at a redirect.
  const destIsHtml = /\.html$/.test(catchAll.destination);
  check(
    !(vercel.cleanUrls === true && destIsHtml),
    'cleanUrls 와 .html destination 이 함께 쓰이지 않음',
    `cleanUrls: ${vercel.cleanUrls}, destination: ${catchAll.destination}\n`
    + "       cleanUrls 가 /index.html 을 / 로 308 리다이렉트하므로, rewrite 가\n"
    + '       파일이 아니라 리다이렉트를 가리켜 모든 깊은 경로가 404 가 됩니다.'
  );

  check(
    catchAll.destination === '/index.html' || catchAll.destination === '/',
    'destination 이 index 를 가리킴',
    `destination: ${catchAll.destination}`
  );
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
