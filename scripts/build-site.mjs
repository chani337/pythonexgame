// Generates site/index.html from site/index.template.html.
//
// Every number and code sample on the landing page is read out of the app's
// own data files. The brief for this project called out that the existing
// marketing copy was wrong -- "5개 언어를 브라우저에서 바로 실행" when Java
// and C never reach a runtime -- and hand-typed figures on a separate site
// are exactly how that happens again. Counts drift the moment someone adds
// a problem; generated counts can't.
//
//   npm run build:site
//
import { build } from 'esbuild';
import { createHash } from 'node:crypto';
import { mkdtemp, rm, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(import.meta.dirname, '..');
const SITE = join(ROOT, 'site');

// The deployed app. The landing page is a separate Vercel project, so it
// links across rather than routing internally.
const APP_URL = process.env.PYQUESTS_APP_URL || 'https://pyquests.vercel.app';

const dir = await mkdtemp(join(ROOT, 'node_modules', '.site-'));
async function load(rel, name) {
  const out = join(dir, name + '.mjs');
  await build({
    entryPoints: [join(ROOT, rel)], outfile: out,
    format: 'esm', platform: 'node', bundle: true, logLevel: 'silent',
    external: ['react'],
  });
  return import(pathToFileURL(out).href);
}

const { problems } = await load('src/data/problems.ts', 'problems');
const { docChapters } = await load('src/data/docs.ts', 'docs');
const solutionsMod = await load('src/data/solutionCode.ts', 'solutions');
const { decodeAnswer } = await load('src/utils/answerObfuscation.ts', 'obf');
const { changelogEntries } = await load('src/data/changelog.ts', 'changelog');
await rm(dir, { recursive: true, force: true });
const solutionCode = solutionsMod.solutionCode || solutionsMod.default;

// --- counts ---------------------------------------------------------------
// `language` is optional and absent on 99 of the Python problems, so the
// default has to match filterProblems' (`problem.language || 'python'`).
const lang = (p) => p.language ?? 'python';

const LANG_META = [
  { key: 'python',    label: 'Python',     runtime: 'Pyodide (WASM Python)' },
  { key: 'algorithm', label: '알고리즘',    runtime: 'Pyodide (WASM Python)' },
  { key: 'sql',       label: 'SQL',        runtime: 'sql.js (SQLite WASM)' },
  { key: 'js',        label: 'JavaScript', runtime: 'Web Worker' },
  { key: 'html',      label: 'HTML',       runtime: 'iframe 미리보기' },
  { key: 'css',       label: 'CSS',        runtime: 'iframe 미리보기' },
  { key: 'java',      label: 'Java',       runtime: null },
  { key: 'c',         label: 'C',          runtime: null },
];

const rows = LANG_META.map((m) => {
  const own = problems.filter((p) => lang(p) === m.key);
  const byType = { coding: 0, quiz: 0, fill: 0 };
  own.forEach((p) => byType[p.type]++);
  return { ...m, total: own.length, ...byType };
});

// Computed for the summary this script prints, not for the page: the landing
// page deliberately states no problem counts. Both are intentionally absent
// from VALUES below, so putting {{TOTAL_PROBLEMS}} back into the template
// fails the unresolved-placeholder check instead of quietly reintroducing a
// number that would then need keeping accurate.
const totalProblems = problems.length;
const executable = rows.filter((r) => r.runtime).reduce((a, r) => a + r.coding, 0);

const DOC_META = [
  ['python', 'Python'], ['sql', 'SQL'], ['java', 'Java'],
  ['js', 'JavaScript'], ['c', 'C'], ['html', 'HTML'], ['css', 'CSS'],
];
const docCounts = DOC_META.map(([key, label]) => ({
  label,
  n: docChapters.filter((c) => (c.category ?? 'python') === key).length,
}));

// --- example problems -----------------------------------------------------
// Real problems, pulled by id. If either is ever renamed this script fails
// loudly instead of shipping a page that describes a problem nobody can find.
function example(id) {
  const p = problems.find((x) => x.id === id);
  if (!p) throw new Error(`예제 문제 '${id}' 가 problems.ts 에 없습니다 — 이름이 바뀌었는지 확인하세요.`);
  const solution = solutionCode[p.id];
  if (!solution) throw new Error(`예제 문제 '${id}' 의 정답 코드가 없습니다.`);
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    constraints: p.constraints ?? [],
    solution: solution.replace(/\n+$/, ''),
    expected: decodeAnswer(p.testCases[0].expected),
  };
}

const pyExample = example('basic_part1_q3');
const sqlExample = example('sql_q1');

// --- latest update --------------------------------------------------------
const latest = changelogEntries[0];

// --- render ---------------------------------------------------------------
const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

// Problem descriptions and constraints use `backticks` for inline code.
const inlineCode = (s) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');

const docList = docCounts.map((d) =>
  `          <li><span class="g-l">${esc(d.label)}</span><span class="g-n">${d.n}</span></li>`
).join('\n');

const constraintList = pyExample.constraints.map((c) => `<li>${inlineCode(c)}</li>`).join('');

const latestItems = latest.items.slice(0, 3).map((i) => `          <li>${esc(i)}</li>`).join('\n');

const VALUES = {
  APP_URL,
  DOC_CHAPTERS: String(docChapters.length),
  DOC_LIST: docList,
  PY_TITLE: esc(pyExample.title),
  PY_DESC: inlineCode(pyExample.description),
  PY_CONSTRAINTS: constraintList,
  PY_SOLUTION: esc(pyExample.solution),
  PY_EXPECTED: esc(pyExample.expected),
  SQL_TITLE: esc(sqlExample.title),
  SQL_DESC: inlineCode(sqlExample.description),
  SQL_SOLUTION: esc(sqlExample.solution),
  SQL_EXPECTED: esc(sqlExample.expected),
  LATEST_DATE: latest.date.replace(/-/g, '.'),
  LATEST_TITLE: esc(latest.title),
  LATEST_ITEMS: latestItems,
  BUILD_DATE: latest.date,
};

let html = await readFile(join(SITE, 'index.template.html'), 'utf8');
for (const [key, value] of Object.entries(VALUES)) {
  html = html.replaceAll(`{{${key}}}`, value);
}

const unresolved = [...html.matchAll(/\{\{([A-Z_]+)\}\}/g)].map((m) => m[1]);
if (unresolved.length) {
  throw new Error(`치환되지 않은 자리표시자: ${[...new Set(unresolved)].join(', ')}`);
}

// --- the one inline script, and its CSP hash ------------------------------
// This page has exactly one script: the pre-paint check that stops the mobile
// splash replaying on every refresh. It is allowed by sha256 rather than
// 'unsafe-inline', so an injected <script> still cannot run -- but that only
// holds while the hash in site/vercel.json matches the script's bytes. If it
// drifts, the real script stops running and the splash comes back on every
// load, which is the kind of thing nobody notices for months.
//
// So the hash is derived here, from the generated page, and written into (or
// checked against) the CSP.
const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)];
const external = [...html.matchAll(/<script[^>]*\bsrc=/g)];

if (external.length) {
  throw new Error("외부 <script src=...> 는 쓸 수 없습니다. CSP 가 해시로만 허용합니다.");
}
if (scripts.length !== 1) {
  throw new Error(
    `인라인 <script> 는 정확히 1개여야 합니다 (현재 ${scripts.length}개).\n` +
    '추가하려면 site/vercel.json 의 CSP 에 해시를 함께 넣도록 이 스크립트를 먼저 고치세요.'
  );
}

const scriptHash = 'sha256-' + createHash('sha256').update(scripts[0][1], 'utf8').digest('base64');
const VERCEL = join(SITE, 'vercel.json');
const vercelRaw = await readFile(VERCEL, 'utf8');
const cspLine = vercelRaw.match(/"value": "(default-src 'none';[^"]*)"/);
if (!cspLine) {
  throw new Error('site/vercel.json 에서 CSP 를 찾지 못했습니다.');
}
const currentCsp = cspLine[1];
const wantedCsp = currentCsp.replace(/script-src [^;]*/, `script-src '${scriptHash}'`);
const cspNeedsUpdate = currentCsp !== wantedCsp;

// The brief for this project called out that the old copy claimed every
// language runs in the browser. Java and C never reach a runtime, so that
// phrasing must not come back.
for (const banned of ['5개 언어를 브라우저에서 바로 실행', '6개 언어를 브라우저에서 바로 실행']) {
  if (html.includes(banned)) {
    throw new Error(`"${banned}" 는 사실이 아닙니다 (Java·C 는 실행되지 않습니다).`);
  }
}

// --check regenerates and compares instead of writing, so CI fails when
// index.html was hand-edited or problem counts changed without a rebuild.
if (process.argv.includes('--check')) {
  if (cspNeedsUpdate) {
    console.error('site/vercel.json 의 CSP 해시가 인라인 스크립트와 다릅니다.');
    console.error(`  필요한 값: script-src '${scriptHash}'`);
    console.error('  npm run build:site 로 갱신하세요.');
    process.exit(1);
  }
  let current = '';
  try {
    current = await readFile(join(SITE, 'index.html'), 'utf8');
  } catch {
    console.error('site/index.html 이 없습니다. npm run build:site 를 실행하세요.');
    process.exit(1);
  }
  if (current !== html) {
    console.error('site/index.html 이 최신이 아닙니다.');
    console.error('템플릿이나 문제 데이터가 바뀐 뒤 재생성하지 않았거나, index.html 을 직접 수정했습니다.');
    console.error('  npm run build:site');
    process.exit(1);
  }
  console.log(`site/index.html 최신 상태 — 문제 ${totalProblems}개 / 실행 ${executable}개 / 가이드 ${docChapters.length}챕터`);
  process.exit(0);
}

await writeFile(join(SITE, 'index.html'), html);

if (cspNeedsUpdate) {
  await writeFile(VERCEL, vercelRaw.replace(currentCsp, wantedCsp));
  console.log(`site/vercel.json 의 CSP 해시 갱신됨 → '${scriptHash}'`);
}

console.log('site/index.html 생성됨');
console.log(`  문제 ${totalProblems}개 (실제 코드 실행 ${executable}개)`);
console.log(`  학습 가이드 ${docChapters.length}챕터`);
console.log(`  앱 주소 ${APP_URL}`);
console.log(`  예제 ${pyExample.id}, ${sqlExample.id}`);
