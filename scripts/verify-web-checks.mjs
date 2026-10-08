// Runs the HTML/CSS grader in real Chrome, under the production CSP, against
// every html/css problem:
//
//   1. the reference solution must pass every check,
//   2. the starter code must fail at least one (otherwise the problem is
//      solved by pressing submit),
//   3. alternate spellings of a correct answer must still pass
//      (`red` / `#f00` / `rgb(255, 0, 0)` -- the reason checks compare
//      computed styles), and
//   4. scripts in the student's page must not run, in any form -- checked
//      twice: once under the production CSP, and once under a CSP that
//      allows inline scripts, so the sandbox is proven on its own rather
//      than credited for what the CSP already blocks. A control iframe with
//      allow-scripts must get through in that second run, or the attack list
//      isn't actually testing anything.
//
// jsdom can't do this: it has no cascade, so getComputedStyle would not
// resolve `#f00` to `rgb(255, 0, 0)` and the test would prove nothing.
// The page is served over http with the CSP header copied from vercel.json,
// because srcdoc documents inherit it and file:// has no real 'self'.
//
//   node scripts/verify-web-checks.mjs
//   CHROME=/path/to/chrome node scripts/verify-web-checks.mjs
//
import { build } from 'esbuild';
import { createServer } from 'node:http';
import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';

const ROOT = resolve(import.meta.dirname, '..');

const CHROME_CANDIDATES = [
  process.env.CHROME,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);
const chrome = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chrome) {
  console.error('Chrome 을 찾지 못했습니다. CHROME=/경로 로 지정하세요.');
  process.exit(1);
}

// --- production CSP, minus what a <meta>/test page can't honour -------------
const vercel = JSON.parse(await readFile(join(ROOT, 'vercel.json'), 'utf8'));
const csp = vercel.headers
  .flatMap((h) => h.headers)
  .find((h) => h.key === 'Content-Security-Policy')?.value;
if (!csp) throw new Error('vercel.json 에서 CSP 를 찾지 못했습니다.');
if (!/frame-src 'none'/.test(csp)) {
  // The comment in WebPreview.tsx relies on this being the case; if the
  // policy changed, re-read that reasoning before trusting this run.
  console.warn("참고: CSP 에 frame-src 'none' 이 없습니다.");
}

// --- bundle the real grader and data ----------------------------------------
const dir = await mkdtemp(join(tmpdir(), 'pyquests-webchecks-'));
const entry = join(dir, 'entry.ts');
await writeFile(entry, `
  import { runWebChecks } from ${JSON.stringify(join(ROOT, 'src/utils/webChecks.ts'))};
  import { problems } from ${JSON.stringify(join(ROOT, 'src/data/problems.ts'))};
  import { solutionCode } from ${JSON.stringify(join(ROOT, 'src/data/solutionCode.ts'))};
  import { withBaseHead } from ${JSON.stringify(join(ROOT, 'src/utils/previewDocument.ts'))};
  Object.assign(window, { runWebChecks, problems, solutionCode, withBaseHead });
`);
await build({ entryPoints: [entry], outfile: join(dir, 'bundle.js'), bundle: true, format: 'iife', logLevel: 'silent' });
const bundle = await readFile(join(dir, 'bundle.js'), 'utf8');

// Same attributes as WebPreview.tsx. Duplicated rather than imported because
// that file is a React component; the check below fails if they drift.
const previewSource = await readFile(join(ROOT, 'src/components/WebPreview.tsx'), 'utf8');
if (!previewSource.includes('sandbox="allow-same-origin"') || /allow-scripts"/.test(previewSource)) {
  throw new Error('WebPreview.tsx 의 sandbox 속성이 이 검증과 다릅니다.');
}

const runner = `
const ATTACKS = [
  '<script>parent.__pwned++</script>',
  '<img src="data:," onerror="parent.__pwned++">',
  '<img src=x onerror="parent.__pwned++">',
  '<body onload="parent.__pwned++">',
  '<svg><script>parent.__pwned++</script></svg>',
  '<iframe srcdoc="<script>top.__pwned++</script>"></iframe>',
  '<a id=a href="javascript:parent.__pwned++">x</a><style>a{}</style>',
  '<meta http-equiv="refresh" content="0;url=javascript:parent.__pwned++">',
  '<object data="javascript:parent.__pwned++"></object>',
];
const makeFrame = (sandbox) => {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('sandbox', sandbox);
  document.body.appendChild(iframe);
  const render = (code) => new Promise((res) => {
    iframe.onload = () => res(iframe.contentDocument);
    iframe.srcdoc = withBaseHead(code) + '\\n<!-- ' + Math.random() + ' -->';
  });
  return { iframe, render };
};
const countPwned = async (sandbox) => {
  const { render } = makeFrame(sandbox);
  window.__pwned = 0;
  for (const a of ATTACKS) {
    await render(a);
    await new Promise((r) => setTimeout(r, 150));
  }
  return window.__pwned;
};
const report = (out) => {
  const pre = document.createElement('pre');
  pre.id = 'result';
  pre.textContent = JSON.stringify(out);
  document.body.appendChild(pre);
};

(async () => {
  const out = [];
  if (location.pathname === '/relaxed') {
    const n = await countPwned('allow-same-origin');
    out.push({ ok: n === 0, what: '인라인 스크립트 허용 CSP 에서도 sandbox 만으로 차단 (' + ATTACKS.length + '종)', detail: n });
    const control = await countPwned('allow-same-origin allow-scripts');
    out.push({ ok: control > 0, what: '대조군: allow-scripts 를 주면 실제로 뚫린다 (검사가 유효함)', detail: control });
    return report(out);
  }
  const { iframe, render } = makeFrame('allow-same-origin');
  const grade = async (code, checks) => {
    const doc = await render(code);
    return runWebChecks(doc, checks);
  };
  const web = problems.filter((p) => (p.language === 'html' || p.language === 'css') && p.type === 'coding');

  for (const p of web) {
    const sol = solutionCode[p.id];
    if (!sol) { out.push({ ok: false, what: p.id + ': 정답 코드 없음' }); continue; }
    const r = await grade(sol, p.webChecks);
    const failed = r.filter((x) => !x.passed);
    out.push({ ok: failed.length === 0, what: p.id + ': 정답 코드 통과', detail: failed });

    const s = await grade(p.initialCode ?? '', p.webChecks);
    out.push({ ok: s.some((x) => !x.passed), what: p.id + ': 시작 코드는 불합격' });
  }

  // Alternate spellings of the same answer.
  const css1 = problems.find((p) => p.id === 'css_q1');
  if (css1) {
    for (const color of ['#f00', '#ff0000', 'rgb(255, 0, 0)', 'RED']) {
      const code = solutionCode.css_q1.replace('color: red', 'color: ' + color);
      const r = await grade(code, css1.webChecks);
      out.push({ ok: r.every((x) => x.passed), what: 'css_q1: color ' + color + ' 도 정답', detail: r.filter((x) => !x.passed) });
    }
    const wrong = solutionCode.css_q1.replace('color: red', 'color: blue');
    const r = await grade(wrong, css1.webChecks);
    out.push({ ok: !r[0].passed, what: 'css_q1: color blue 는 오답' });
    // font-size in another unit that computes to the same 20px.
    const rem = solutionCode.css_q1.replace('font-size: 20px', 'font-size: 1.25rem');
    const r2 = await grade(rem, css1.webChecks);
    out.push({ ok: r2.every((x) => x.passed), what: 'css_q1: 1.25rem(=20px) 도 정답', detail: r2.filter((x) => !x.passed) });
  }
  const css2 = problems.find((p) => p.id === 'css_q2');
  if (css2) {
    // gap shorthand vs the longhand the check reads.
    const longhand = solutionCode.css_q2.replace('gap: 16px', 'column-gap: 16px');
    const r = await grade(longhand, css2.webChecks);
    out.push({ ok: r.every((x) => x.passed), what: 'css_q2: column-gap 으로 써도 정답', detail: r.filter((x) => !x.passed) });
  }
  const html1 = problems.find((p) => p.id === 'html_q1');
  if (html1) {
    // Whitespace and a missing skeleton shouldn't matter.
    const r = await grade('<h1>\\n  안녕하세요\\n</h1><p>첫 번째   웹 페이지입니다.</p>', html1.webChecks);
    out.push({ ok: r.every((x) => x.passed), what: 'html_q1: 공백·골격 없어도 정답', detail: r.filter((x) => !x.passed) });
  }

  // Common wrong answers must fail. Each is the reference solution with one
  // realistic mistake, so a check that is too loose shows up here.
  const WRONG = [
    ['css_q3', '.menu a {', 'a {', '자손 선택자 대신 모든 a 를 초록색으로'],
    ['css_q4', '2px solid black', '2px black', '테두리 스타일(solid) 빠뜨림'],
    ['css_q5', 'box-sizing: border-box;', 'box-sizing: content-box;', 'content-box 그대로'],
    ['css_q2', 'display: flex;', 'display: block;', 'flex 안 씀'],
    ['css_q12', 'repeat(3, 1fr)', 'repeat(2, 1fr)', '2열로 만듦'],
    ['css_q13', 'position: relative;', 'position: static;', '부모 기준점 없음'],
    ['css_q16', 'display: flex;', 'display: block;', '카드를 flex 로 배치하지 않음'],
    ['html_q5', '<ol>', '<ul>', 'ol 대신 ul'],
    ['html_q12', '<main>', '<div class="main">', 'main 을 div 로 남김'],
    ['html_q13', 'aria-label="메뉴 열기"', 'title="메뉴 열기"', 'aria-label 대신 title'],
  ];
  for (const [id, from, to, what] of WRONG) {
    const p = problems.find((q) => q.id === id);
    const sol = solutionCode[id];
    if (!p || !sol || !sol.includes(from)) { out.push({ ok: false, what: id + ': 오답 케이스 원본을 찾지 못함 (' + from + ')' }); continue; }
    const r = await grade(sol.replace(from, to).replace('</main>', to.startsWith('<div') ? '</div>' : '</main>'), p.webChecks);
    out.push({ ok: r.some((x) => !x.passed), what: id + ': 오답 — ' + what });
  }

  // A broken selector is an authoring bug: it must fail that check, not throw.
  const bad = await grade('<p>x</p>', [{ kind: 'exists', selector: 'p[', label: 'bad' }]);
  out.push({ ok: bad.length === 1 && !bad[0].passed && /잘못된 선택자/.test(bad[0].actual), what: '잘못된 선택자는 불합격으로 처리' });

  // Scripts must never run inside the preview.
  const n = await countPwned('allow-same-origin');
  out.push({ ok: n === 0, what: '운영 CSP 에서 미리보기 안 스크립트 차단 (' + ATTACKS.length + '종)', detail: n });

  // The site's typeface is applied by default, and the student's own
  // font-family always wins over it, even from a zero-specificity rule.
  const fdoc = await render('<!DOCTYPE html><p>가나다</p>');
  const ff = iframe.contentWindow.getComputedStyle(fdoc.querySelector('p')).fontFamily;
  out.push({ ok: ff.startsWith('"Pretendard Variable"'), what: '미리보기 기본 폰트가 사이트와 같은 Pretendard', detail: ff });
  const own = await render('<style>*{font-family:serif}</style><p>x</p>');
  const ownFf = iframe.contentWindow.getComputedStyle(own.querySelector('p')).fontFamily;
  out.push({ ok: ownFf === 'serif', what: '학생이 쓴 font-family 가 기본 폰트보다 우선', detail: ownFf });
  // Prepending before <!DOCTYPE> must not drop the page into quirks mode.
  const modes = [];
  for (const c of ['<!DOCTYPE html><p>x</p>', '<p>x</p>']) modes.push((await render(c)).compatMode);
  out.push({ ok: modes.every((m) => m === 'CSS1Compat'), what: '폰트 삽입 후에도 표준 모드 유지 (quirks 아님)', detail: modes });
  // The font file itself is fetched from jsDelivr under the inherited CSP.
  // Network-dependent, so reported but not fatal.
  const ldoc = await render('<p>가나다라마바사</p>');
  await ldoc.fonts.ready;
  await new Promise((r) => setTimeout(r, 1500));
  const loaded = [...ldoc.fonts].some((f) => f.family.includes('Pretendard') && f.status === 'loaded');
  out.push({ ok: true, warn: !loaded, what: loaded ? 'Pretendard 파일이 CSP 아래에서 실제로 로드됨' : 'Pretendard 파일 로드 확인 못 함 (네트워크 문제일 수 있음)' });

  // The preview can still be read from outside -- the grader depends on it.
  const doc = await render('<style>p{color:#00f}</style><p>x</p>');
  const c = iframe.contentWindow.getComputedStyle(doc.querySelector('p')).color;
  out.push({ ok: c === 'rgb(0, 0, 255)', what: '부모가 미리보기의 계산된 스타일을 읽을 수 있음', detail: c });

  report(out);
})().catch((e) => report([{ ok: false, what: '실행 오류: ' + e.message }]));
`;

const server = createServer((req, res) => {
  if (req.url === '/bundle.js') {
    res.writeHead(200, { 'Content-Type': 'text/javascript' });
    return res.end(bundle);
  }
  if (req.url === '/runner.js') {
    res.writeHead(200, { 'Content-Type': 'text/javascript' });
    return res.end(runner);
  }
  // /relaxed: the production policy with inline scripts allowed, so only the
  // sandbox stands between the attacks and the parent page.
  const policy = req.url === '/relaxed'
    ? csp.replace(/script-src [^;]*/, "script-src 'self' 'unsafe-inline'")
    : csp;
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Content-Security-Policy': policy });
  res.end('<!doctype html><meta charset="utf-8"><body><script src="/bundle.js"></script><script src="/runner.js"></script></body>');
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const unescape = (s) => s.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
async function runPage(path) {
  const { stdout } = await promisify(execFile)(
    chrome,
    ['--headless=new', '--disable-gpu', '--no-first-run', `--user-data-dir=${join(dir, 'profile' + path.replace(/\W/g, '_'))}`, '--virtual-time-budget=15000', '--dump-dom', base + path],
    { maxBuffer: 16 * 1024 * 1024, timeout: 60_000 }
  );
  const m = stdout.match(/<pre id="result">([\s\S]*?)<\/pre>/);
  if (!m) return [{ ok: false, what: `${path}: 결과를 읽지 못했습니다 (페이지가 끝까지 실행되지 않음)` }];
  return JSON.parse(unescape(m[1]));
}

let results;
try {
  results = [...(await runPage('/')), ...(await runPage('/relaxed'))];
} finally {
  server.close();
  await rm(dir, { recursive: true, force: true });
}

let failed = 0;
for (const r of results) {
  console.log(`${r.ok ? (r.warn ? '!' : '✓') : '✗'} ${r.what}`);
  if (!r.ok) {
    failed++;
    if (r.detail !== undefined) console.log('    ', JSON.stringify(r.detail));
  }
}
console.log(`\n${results.length - failed}/${results.length} 통과`);
process.exit(failed ? 1 : 0);
