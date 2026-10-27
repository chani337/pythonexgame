// Replays every NumPy / Pandas / Matplotlib problem in a real Pyodide, with
// the same runtime setup the app uses (src/lib/pythonRuntime.ts): datasets
// written to data/, warning filters, Agg backend, the Korean font, and the
// figure_check harness.
//
//   1. the reference solution must pass, and
//   2. the starter code must not (otherwise pressing submit solves it).
//
// Expected outputs are base64 in problems.ts, which makes a wrong one
// invisible on inspection -- this is what catches it.
//
//   node scripts/verify-python-libs.mjs            # verify
//   node scripts/verify-python-libs.mjs --write    # fill "__FILL__" expected
//                                                  #   values from solutions,
//                                                  #   and print them for review
//
// Packages (~60MB) are fetched from jsDelivr on first run and cached in
// node_modules/.cache/pyodide-packages.
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { mkdtemp, rm, readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const LIB_CATEGORIES = new Set(['NumPy', 'Pandas', 'Matplotlib', '실전']);
const WRITE = process.argv.includes('--write');

const pyDir = join(ROOT, 'public', 'pyodide');
try {
  await access(join(pyDir, 'pyodide.mjs'));
} catch {
  console.error('public/pyodide/ 가 없습니다. npm run fetch:pyodide 를 먼저 실행하세요.');
  process.exit(1);
}

async function load(rel, name) {
  const dir = await mkdtemp(join(tmpdir(), 'pyquests-' + name + '-'));
  const outfile = join(dir, name + '.mjs');
  await build({ entryPoints: [join(ROOT, rel)], outfile, format: 'esm', platform: 'node', bundle: true, logLevel: 'silent' });
  const mod = await import('file://' + outfile);
  await rm(dir, { recursive: true, force: true });
  return mod;
}
const { problems } = await load('src/data/problems.ts', 'problems');
const { solutionCode } = await load('src/data/solutionCode.ts', 'solutions');
const { decodeAnswer } = await load('src/utils/answerObfuscation.ts', 'obf');
const rt = await load('src/lib/pythonRuntime.ts', 'runtime');

// Node shims for the browser build of pyodide.asm.js (see verify-pyodide-core).
globalThis.require = createRequire(import.meta.url);
globalThis.__dirname = pyDir;
globalThis.__filename = join(pyDir, 'pyodide.asm.js');
const { loadPyodide } = await import('file://' + join(pyDir, 'pyodide.mjs'));
const cacheDir = join(ROOT, 'node_modules', '.cache', 'pyodide-packages');
await mkdir(cacheDir, { recursive: true });
const py = await loadPyodide({ indexURL: pyDir + '/', packageCacheDir: cacheDir });
await py.loadPackage(['numpy', 'pandas', 'matplotlib'], { messageCallback: () => {} });

const fontRes = await fetch(rt.KOREAN_FONT_URL);
if (!fontRes.ok) throw new Error(`한글 글꼴을 받지 못했습니다: HTTP ${fontRes.status}`);
py.FS.mkdirTree(rt.KOREAN_FONT_PATH.slice(0, rt.KOREAN_FONT_PATH.lastIndexOf('/')));
py.FS.writeFile(rt.KOREAN_FONT_PATH, new Uint8Array(await fontRes.arrayBuffer()));
await py.runPythonAsync(rt.PY_RUNTIME_SETUP);
await py.runPythonAsync(rt.PY_FONT_SETUP);

let lines = [];
py.setStdout({ batched: (s) => lines.push(s) });
py.setStderr({ batched: (s) => lines.push(s) });

// Mirrors usePyodide.runCode for the two runners these problems use.
async function run(code, problem) {
  lines = [];
  rt.writeDatasets(py);
  await py.runPythonAsync(rt.PY_BEFORE_RUN);
  // Fresh namespace per run, stricter than the app's shared globals: a
  // solution can't pass on a variable left over from the previous problem.
  const ns = py.globals.get('dict')();
  // Same 10 s guard as the app, so a hanging solution fails instead of
  // hanging this script.
  const guarded = !/numpy|np\.|pandas|pd\.|matplotlib|plt\./.test(code);
  if (guarded) py.globals.get('_pq_guard_start')(rt.RUN_GUARD_SECONDS);
  try {
    await py.runPythonAsync(code, { globals: ns });
    if (problem.testRunnerCode === 'stdout_match') {
      return { outputs: [lines.join('\n').trim()] };
    }
    ns.set('test_cases', py.toPy(problem.testCases.map((t) => t.input)));
    await py.runPythonAsync(problem.testRunnerCode === 'figure_check' ? rt.FIGURE_CHECK_HARNESS : problem.testRunnerCode, { globals: ns });
    const all = lines.join('\n');
    const i = all.indexOf('###TEST_OUT###');
    if (i === -1) return { error: '테스트 출력 표식 없음', stdout: all };
    return { outputs: JSON.parse(all.slice(i + '###TEST_OUT###'.length).trim()) };
  } catch (e) {
    const msg = String(e.message || e);
    return { error: msg.includes(rt.TIMEOUT_MARKER) ? '시간 초과(10초)' : msg.split('\n').slice(-2).join(' ') };
  } finally {
    if (guarded) py.globals.get('_pq_guard_stop')();
    ns.destroy();
  }
}

// The app's own comparison functions (src/utils/grading.ts), so this can't
// approve an answer the app would reject. norm() maps each side to a form
// that compares equal exactly when the app's matcher does.
const { cleanOutput, unwrapQuotes } = await load('src/utils/grading.ts', 'grading');
const norm = (s, runner) =>
  runner === 'stdout_match'
    ? cleanOutput(s)
    : unwrapQuotes(s).replace(/\s+/g, ' ');

const lib = problems.filter((p) => LIB_CATEGORIES.has(p.category) && p.type === 'coding');
const fills = new Map();
let failed = 0;
for (const p of lib) {
  const sol = solutionCode[p.id];
  if (!sol) { console.log(`✗ ${p.id}: 정답 코드 없음`); failed++; continue; }
  const res = await run(sol, p);
  if (res.error) { console.log(`✗ ${p.id}: 정답 코드 실행 오류 — ${res.error}`); failed++; continue; }

  const needsFill = p.testCases.some((t) => t.expected === '__FILL__');
  if (needsFill) {
    if (!WRITE) { console.log(`✗ ${p.id}: 기대값이 비어 있음 (--write 로 채우세요)`); failed++; continue; }
    fills.set(p.id, res.outputs);
    console.log(`✎ ${p.id}`);
    p.testCases.forEach((t, i) => console.log(`    ${t.input.split('|')[0]}  →  ${res.outputs[i]}`));
    continue;
  }

  const ok = p.testCases.every((t, i) => norm(res.outputs[i] ?? '', p.testRunnerCode) === norm(decodeAnswer(t.expected), p.testRunnerCode));
  if (!ok) {
    failed++;
    console.log(`✗ ${p.id}: 정답 코드가 기대값과 다름`);
    p.testCases.forEach((t, i) => console.log(`    기대: ${decodeAnswer(t.expected)}\n    실제: ${res.outputs[i]}`));
    continue;
  }
  const start = await run(p.initialCode ?? '', p);
  const startPasses = !start.error && p.testCases.every((t, i) => norm(start.outputs[i] ?? '', p.testRunnerCode) === norm(decodeAnswer(t.expected), p.testRunnerCode));
  if (startPasses) { failed++; console.log(`✗ ${p.id}: 시작 코드가 이미 통과함`); continue; }
  console.log(`✓ ${p.id}`);
}

// Efficiency tests (perfTests): the reference must pass them, and a
// correct-but-slow solution -- one per problem, below -- must pass every
// correctness test yet fail on time. Otherwise the efficiency test isn't
// measuring anything.
const SLOW = JSON.parse(await readFile(join(ROOT, 'scripts', 'perf-slow-solutions.json'), 'utf8'));
async function runPerf(code, problem) {
  lines = [];
  const ns = py.globals.get('dict')();
  try {
    await py.runPythonAsync(code, { globals: ns });
    ns.set('_pq_perf_calls', py.toPy(problem.perfTests));
    ns.set('_pq_reference', solutionCode[problem.id]);
    await py.runPythonAsync(rt.PERF_HARNESS, { globals: ns });
    const all = lines.join('\n');
    const i = all.indexOf('###PERF_OUT###');
    return i === -1 ? null : JSON.parse(all.slice(i + '###PERF_OUT###'.length).trim());
  } finally {
    ns.destroy();
  }
}
if (!WRITE) {
  for (const p of lib.filter((q) => q.perfTests?.length)) {
    const ref = await runPerf(solutionCode[p.id], p);
    const refOk = ref && ref.every((r) => r.status === 'ok');
    const slowSrc = SLOW[p.id];
    if (!slowSrc) { failed++; console.log(`✗ ${p.id}: 느린 풀이(perf-slow-solutions.json)가 없음`); continue; }
    const slowCorrect = await run(slowSrc, p);
    const slowPassesCorrectness = !slowCorrect.error && p.testCases.every((t, i) => norm(slowCorrect.outputs[i] ?? '', p.testRunnerCode) === norm(decodeAnswer(t.expected), p.testRunnerCode));
    const slow = await runPerf(slowSrc, p);
    const slowFails = slow && slow.some((r) => r.status !== 'ok');
    const ok = refOk && slowPassesCorrectness && slowFails;
    if (!ok) failed++;
    console.log(`${ok ? '✓' : '✗'} ${p.id}: 효율성 — 정답 ${ref?.map((r) => `${r.status} ${r.ms}ms/${r.limitMs}ms`).join(', ')} · 느린 풀이 정확성 ${slowPassesCorrectness ? '통과' : '실패'}, 효율성 ${slow?.map((r) => `${r.status} ${r.ms}ms`).join(', ')}`);
  }
}

// Realistic mistakes, each one edit away from the reference solution. A
// check loose enough to accept one of these is a check that isn't checking.
const WRONG = [
  ['np_e2', "scores >= 60", "scores > 60", '경계값 60점을 불합격 처리'],
  ['pd_i1', "df['수학'] >= 90", "df['수학'] > 90", '90점을 빠뜨림'],
  ['pd_a3', "df['강수량'] = df['강수량'].fillna(0)\n", '', '빈칸을 채우지 않음'],
  ['pd_i2', 'ascending=False', 'ascending=True', '오름차순으로 정렬'],
  ['np_a1', 'axis=0', 'axis=1', '과목별이 아니라 학생별 평균'],
  ['plt_i2', 'plt.legend()\n', '', '범례 없음'],
  ['plt_e1', ", linestyle='--'", '', '평균선이 실선'],
  ['plt_a1', 'bins=5', 'bins=10', '구간 수가 다름'],
  ['plt_b3', 'plt.bar(fruits, sold)', 'plt.plot(fruits, sold)', '막대 대신 선 그래프'],
];
if (!WRITE) {
  for (const [id, from, to, what] of WRONG) {
    const p = lib.find((q) => q.id === id);
    const sol = solutionCode[id];
    if (!p || !sol?.includes(from)) { failed++; console.log(`✗ ${id}: 오답 케이스 원본을 찾지 못함 (${from})`); continue; }
    const res = await run(sol.replace(from, to), p);
    const passes = !res.error && p.testCases.every((t, i) => norm(res.outputs[i] ?? '', p.testRunnerCode) === norm(decodeAnswer(t.expected), p.testRunnerCode));
    if (passes) { failed++; console.log(`✗ ${id}: 오답(${what})인데 통과함`); } else console.log(`✓ ${id}: 오답 — ${what}`);
  }
}

if (WRITE && fills.size) {
  const path = join(ROOT, 'src/data/problems.ts');
  let src = await readFile(path, 'utf8');
  const b64 = (s) => Buffer.from(s, 'utf8').toString('base64');
  for (const [id, outputs] of fills) {
    const start = src.indexOf(`"id": "${id}"`);
    const end = src.indexOf('\n  }', start);
    let block = src.slice(start, end);
    // Example shown to students: the stdout itself, or the check values.
    const p = lib.find((q) => q.id === id);
    const example = p.testRunnerCode !== 'figure_check'
      ? outputs[0]
      : p.testCases.map((t, i) => `${t.input.split('|')[0].replace(/`/g, '')}: ${outputs[i]}`).join('\n');
    block = block.replace('"output": "__FILL__"', `"output": ${JSON.stringify(example)}`);
    // By test-case position: only some cases may be "__FILL__" (a case
    // added to an existing problem), so the n-th expected gets outputs[n].
    let i = 0;
    block = block.replace(/"expected": "([^"]*)"/g, (m, v) => {
      const k = i++;
      return v === '__FILL__' ? `"expected": "${b64(outputs[k])}"` : m;
    });
    src = src.slice(0, start) + block + src.slice(end);
  }
  await writeFile(path, src);
  console.log(`\n${fills.size}개 문제의 기대값을 채웠습니다. 위 값이 맞는지 직접 확인하세요.`);
}

console.log(failed ? `\n${failed}건 실패` : `\n전부 통과 — 문제 ${lib.length}개, 오답 케이스 ${WRONG.length}개`);
process.exit(failed ? 1 : 0);
