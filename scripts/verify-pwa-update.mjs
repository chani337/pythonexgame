// End-to-end test of the PWA update flow (src/components/UpdatePrompt.tsx)
// against a real production build, in real Chrome.
//
// Uses dist/ as "v1" and derives "v2" from it: a marker <meta> in
// index.html, with index.html's precache revision in sw.js changed to match
// -- exactly what a real redeploy changes from the service worker's point of
// view. A local server stands in for Vercel: real files, /assets/* 404 when
// missing, SPA fallback, max-age=0 must-revalidate.
//
// Needs a build first, so it is not part of verify:all:
//
//   npm run build && npm run verify:pwa-update
//
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { cp, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { join, extname, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const S = await mkdtemp(join(tmpdir(), 'pyquests-pwa-'));
await cp(join(ROOT, 'dist'), join(S, 'v1'), { recursive: true });
await cp(join(ROOT, 'dist'), join(S, 'v2'), { recursive: true });
{
  const html = (await readFile(join(S, 'v2/index.html'), 'utf8')).replace('<head>', '<head>\n<meta name="pq-build" content="v2">');
  await writeFile(join(S, 'v2/index.html'), html);
  const md5 = createHash('md5').update(html).digest('hex');
  const sw = await readFile(join(S, 'v2/sw.js'), 'utf8');
  const sw2 = sw.replace(/(url:"index\.html",revision:")[0-9a-f]+(")/, `$1${md5}$2`);
  if (sw2 === sw) throw new Error('sw.js 에서 index.html precache 항목을 찾지 못했습니다. npm run build 를 먼저 하세요.');
  await writeFile(join(S, 'v2/sw.js'), sw2);
}
const PORT = 5400;
let root = join(S, 'v1');
let failSw = false;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.wasm': 'application/wasm' };
const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (failSw && path === '/sw.js') { res.writeHead(500); return res.end('down'); }
  let file = join(root, path);
  try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html'); await stat(file); }
  catch {
    if (path.startsWith('/assets/')) { res.writeHead(404); return res.end('not found'); }
    file = join(root, 'index.html');
  }
  res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Cache-Control': 'public, max-age=0, must-revalidate' });
  res.end(await readFile(file));
});
await new Promise((r) => server.listen(PORT, '127.0.0.1', r));
const BASE = `http://localhost:${PORT}`;

const CHROME = [process.env.CHROME, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].filter(Boolean).find((p) => existsSync(p));
if (!CHROME) { console.error('Chrome 을 찾지 못했습니다. CHROME=/경로 로 지정하세요.'); process.exit(1); }
const chrome = spawn(CHROME,
  ['--headless=new', '--remote-debugging-port=9340', `--user-data-dir=${S}/pwa-prof-${Date.now()}`, '--window-size=1280,900', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let version;
for (let i = 0; i < 40; i++) { try { version = await (await fetch('http://127.0.0.1:9340/json/version')).json(); break; } catch {} await sleep(250); }

async function openTab(url) {
  const t = await (await fetch(`http://127.0.0.1:9340/json/new?${encodeURIComponent(url)}`, { method: 'PUT' })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pend = new Map(); const tab = { navigations: 0, ws };
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); }
    if (d.method === 'Page.frameNavigated' && !d.params.frame.parentId) tab.navigations++; };
  tab.send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  tab.ev = async (e) => (await tab.send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result?.result?.value;
  await tab.send('Page.enable'); await tab.send('Runtime.enable'); await tab.send('Network.enable');
  return tab;
}
const build = (t) => t.ev(`document.querySelector('meta[name="pq-build"]')?.content || 'v1'`);
const toast = (t) => t.ev(`(()=>{const s=document.querySelector('[role=status] strong'); return s ? s.textContent : null})()`);
const click = (t, label) => t.ev(`(()=>{const b=[...document.querySelectorAll('[role=status] button')].find(b=>b.textContent.trim()===${JSON.stringify(label)}); b?.click(); return !!b})()`);
const waitFor = async (fn, ms = 15000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { const v = await fn(); if (v) return v; await sleep(300); } return null; };
const controlled = (t) => t.ev(`!!navigator.serviceWorker.controller`);

const results = [];
const check = (ok, what, detail) => { results.push({ ok, what, detail }); console.log(`${ok ? '✓' : '✗'} ${what}${detail !== undefined ? '  — ' + JSON.stringify(detail) : ''}`); };

// 1. First install & launch
const A = await openTab(BASE + '/dashboard');
await waitFor(async () => (await A.ev('navigator.serviceWorker.getRegistration().then(r=>!!(r&&r.active))')));
await A.send('Page.reload'); await sleep(2500);
check(await controlled(A), '1. 최초 설치: 서비스 워커가 페이지를 제어함');
check((await toast(A)) === null, '1. 최신 버전일 때 알림 없음');
const regCount = await A.ev('navigator.serviceWorker.getRegistrations().then(r=>r.length)');
check(regCount === 1, '1. 서비스 워커 중복 등록 없음', regCount);

// Tab B: a student mid-answer.
const B = await openTab(BASE + '/problems/css_q1');
await waitFor(() => B.ev(`!!document.querySelector('.cm-content')`));
await sleep(800);
await B.ev(`document.querySelector('.cm-content').focus()`);
await B.send('Input.insertText', { text: 'h1 { color: red; } /*작성중*/' });
await sleep(400);
const typed = () => B.ev(`document.querySelector('.cm-content').innerText.includes('작성중')`);
check(await typed(), '   (탭 B 에 작성 중인 코드 입력)');
const bNavBase = B.navigations;

// 9a. Update check while the server is down: nothing breaks, no toast.
failSw = true;
await A.ev('navigator.serviceWorker.getRegistration().then(r=>r.update()).then(()=>"ok",e=>"rejected")');
await sleep(1000);
check((await toast(A)) === null && (await A.ev(`document.getElementById('root').innerText.length > 100`)), '9. 업데이트 확인 실패(서버 500): 알림 없음, 앱 정상');
failSw = false;

// 2. Deploy v2; the running app detects it (foreground check path).
root = join(S, 'v2');
await A.ev(`(()=>{Object.defineProperty(document,'visibilityState',{value:'hidden',configurable:true});document.dispatchEvent(new Event('visibilitychange'));Object.defineProperty(document,'visibilityState',{value:'visible',configurable:true});})()`);
// MIN_CHECK_GAP is 5 min, so foregrounding right away must NOT check yet.
await A.ev(`document.dispatchEvent(new Event('visibilitychange'))`); await sleep(1500);
const tooSoon = await toast(A);
check(tooSoon === null, '2. 5분 안에 다시 포그라운드로 와도 바로 재확인하지 않음 (과도한 요청 방지)', tooSoon);
// Launch path: a newly opened window checks on registration.
const C = await openTab(BASE + '/dashboard');
const tC = await waitFor(() => toast(C), 20000);
check(tC === '새로운 업데이트가 있습니다.', '2·3. 앱 실행 시 새 버전 감지 → 알림 표시', tC);
const tA = await waitFor(() => toast(A), 10000);
check(tA === '새로운 업데이트가 있습니다.', '2·3. 이미 열려 있던 창에도 알림 표시', tA);
check((await build(C)) === 'v1', '   알림만 뜨고 아직 v1 그대로 (사용자 선택 전에는 안 바뀜)', await build(C));

// 5. 나중에
await click(A, '나중에'); await sleep(500);
check((await toast(A)) === null, '5. 나중에: 알림이 닫힘');
check((await A.ev(`document.getElementById('root').innerText.length > 100`)) && (await build(A)) === 'v1', '5. 나중에: 기존 버전으로 계속 사용 가능');
await A.send('Page.reload'); await sleep(3000);
check((await toast(A)) === null, '6. 나중에 후 새로고침해도 같은 세션에서는 다시 묻지 않음');
check(await typed(), '5. 탭 B 의 작성 중인 코드 유지');

// 4. 업데이트 in C
const navBefore = C.navigations;
await click(C, '업데이트');
await waitFor(async () => C.navigations > navBefore, 15000);
await sleep(3000);
check(C.navigations - navBefore === 1, '4. 업데이트: 정확히 한 번만 새로고침 (무한 새로고침 없음)', C.navigations - navBefore);
check((await build(C)) === 'v2', '4. 업데이트 후 최신 버전(v2) 로드', await build(C));
check((await toast(C)) === null, '4·6. 업데이트 후 알림 다시 안 뜸');
check(await C.ev(`document.getElementById('root').innerText.length > 100`), '4. 업데이트 후 앱 정상 실행');

// Multi-tab: B must not be reloaded out from under its typed answer.
const tB = await waitFor(() => toast(B), 8000);
check(tB === '다른 창에서 업데이트를 적용했어요.', '다중 탭: 다른 창에는 강제 새로고침 대신 안내', tB);
check(await typed(), '다중 탭: 탭 B 의 작성 중인 코드가 그대로 있음');
check(B.navigations === bNavBase, '다중 탭: 탭 B 는 새로고침되지 않음', { before: bNavBase, after: B.navigations });

// 6. Reload after update: no repeat
await C.send('Page.reload'); await sleep(3000);
check((await toast(C)) === null && (await build(C)) === 'v2', '6. 업데이트 후 새로고침: 반복 알림 없음, v2 유지');

// Old caches cleaned, one precache left.
const caches = await C.ev(`caches.keys()`);
check(caches.filter((k) => k.includes('precache')).length === 1, '캐시: 이전 버전 precache 정리됨, 하나만 남음', caches);

// 9b. Offline launch
await C.send('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
await C.send('Page.navigate', { url: BASE + '/problems' }); await sleep(3500);
check((await C.ev(`document.getElementById('root').innerText.length > 100`)) && (await build(C)) === 'v2', '9. 오프라인 실행: 캐시된 v2 로 정상 표시');
check((await toast(C)) === null, '9. 오프라인: 업데이트 알림/오류 없음');
await C.send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });

// 8. Mobile width rendering of the prompt
root = join(S, 'v1'); // "deploy" again so a prompt appears
const M = await openTab('about:blank');
await M.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await M.send('Page.navigate', { url: BASE + '/dashboard' });
const tM = await waitFor(() => toast(M), 20000);
check(tM === '새로운 업데이트가 있습니다.', '8. 모바일 화면에서도 알림 표시', tM);
const box = await M.ev(`(()=>{const r=document.querySelector('[role=status]').getBoundingClientRect();return {l:Math.round(r.left),r:Math.round(r.right),w:innerWidth}})()`);
check(box.l >= 0 && box.r <= box.w, '8. 모바일: 알림이 화면 밖으로 넘치지 않음', box);

const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} 통과`);
for (const t of [A, B, C, M]) t.ws.close();
server.close();
await new Promise((r) => { chrome.once('exit', r); chrome.kill(); });
await rm(S, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
process.exit(failed ? 1 : 0);
