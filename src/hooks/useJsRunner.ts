import type { RunResponse } from './usePyodide';

// Globals removed from the worker before user code runs, and why.
//
// The worker has no DOM, but "no DOM" is not "no network". A blob: worker
// inherits the creating page's origin, so fetch('https://...') reaches any
// host and fetch('/api/...') reaches this very site with the visitor's
// cookies attached -- user-submitted code could exfiltrate data or use the
// site as a springboard. None of the JavaScript problems need any of these
// (their reference solutions use only Promise, setTimeout and Error).
//
// Exported so the sandbox test harness asserts against the same list.
export const BLOCKED_WORKER_GLOBALS: Record<string, string> = {
  // --- network: exfiltration and SSRF-by-proxy ---
  fetch: '네트워크 요청',
  XMLHttpRequest: '네트워크 요청 (구형 API)',
  WebSocket: '양방향 네트워크 연결',
  EventSource: '서버 전송 이벤트 스트림',
  importScripts: '외부 스크립트를 이 워커 안으로 불러오기',
  navigator: 'sendBeacon 전송 수단과 환경 정보',

  // --- persistence: writing data that outlives the run ---
  indexedDB: '브라우저 영구 저장소',
  caches: 'Cache Storage (서비스워커 캐시) 조작',
  localStorage: '브라우저 저장소',
  sessionStorage: '브라우저 저장소',

  // --- escaping the worker / forging results ---
  // postMessage is the big one: without it, user code can send the main
  // thread a fake { ok: true, stdout: '<expected output>' } and be graded
  // as correct without running anything.
  postMessage: '메인 스레드에 임의 메시지 주입 (채점 결과 위조)',
  self: '차단된 전역에 다시 접근하는 우회 경로',
  globalThis: '차단된 전역에 다시 접근하는 우회 경로',
  close: '워커 강제 종료',
  addEventListener: '워커 메시지 핸들러 가로채기',
  removeEventListener: '워커 메시지 핸들러 제거',
  dispatchEvent: '임의 이벤트 발생',
  Worker: '중첩 워커로 이 제약을 우회',
  SharedWorker: '중첩 워커로 이 제약을 우회',

  // --- cross-context messaging ---
  BroadcastChannel: '다른 탭/컨텍스트와 통신',
  MessageChannel: '다른 컨텍스트와 통신',
  MessagePort: '다른 컨텍스트와 통신',

  // --- misc ---
  Notification: '알림 생성',
  location: '페이지 주소 정보',
};

// Deliberately NOT blocked, because problems legitimately use them:
//   Promise, setTimeout, setInterval, queueMicrotask, Error, JSON, Math,
//   Date, Map, Set, Symbol, RegExp, BigInt, Intl, crypto, performance,
//   and every Array/Object/String/Number builtin.
// setInterval stays reachable, but the 5s terminate() below ends the worker
// regardless of what is still scheduled.

const MAX_OUTPUT_LINES = 1000;
const MAX_OUTPUT_CHARS = 10000;

// The worker receives { code } and executes it in an isolated global scope,
// wrapped in an async IIFE so top-level await works. console.* calls are
// intercepted and collected as "stdout" lines, mirroring how Python's
// print() output is captured via usePyodide.
//
// Two layers block the globals above:
//   1. Each one is redefined on the REAL worker global as a stub that throws.
//      Mutating the actual global object (rather than only shadowing names)
//      is what makes `Function('return this')().fetch` fail too -- that
//      escape hands back the same object we just neutered.
//   2. Each one is also passed as a parameter to the user-code function, so
//      the identifier resolves to the stub first. This produces the clear
//      Korean error message, and still holds on an engine where step 1's
//      defineProperty was refused for a built-in.
// Exported so scripts/verify-js-sandbox.mjs can execute this exact source in
// a node:vm context that stands in for the worker global scope.
export const WORKER_SOURCE = `
// Captured before the lockdown runs. Both are needed afterwards: the worker
// still has to install its message handler and report its own result, but by
// then the identifiers \`self\` and \`postMessage\` resolve to stubs that throw.
const __realGlobal = self;
const __postResult = self.postMessage.bind(self);

const BLOCKED = ${JSON.stringify(BLOCKED_WORKER_GLOBALS)};
const MAX_OUTPUT_LINES = ${MAX_OUTPUT_LINES};
const MAX_OUTPUT_CHARS = ${MAX_OUTPUT_CHARS};

function makeBlockedStub(name, reason) {
  const fail = () => {
    throw new Error(
      name + '은(는) 학습용 실행 환경에서 차단되어 있습니다. (' + reason + ')'
    );
  };
  // A Proxy so every shape of use fails: fetch(), new WebSocket(),
  // indexedDB.open(), self.postMessage -- not just a direct call.
  return new Proxy(function () {}, {
    apply: fail,
    construct: fail,
    get: fail,
    set: fail,
    has: fail,
    getPrototypeOf: fail,
  });
}

const STUBS = {};
const NAMES = Object.keys(BLOCKED);
for (const name of NAMES) {
  const stub = makeBlockedStub(name, BLOCKED[name]);
  STUBS[name] = stub;
  try {
    // Non-writable and non-configurable so user code cannot put the real
    // one back.
    Object.defineProperty(self, name, {
      value: stub,
      writable: false,
      configurable: false,
      enumerable: false,
    });
  } catch (err) {
    // Some engines refuse to redefine certain built-ins. Fall back to a
    // plain assignment; layer 2 (parameter shadowing) still applies.
    try { self[name] = stub; } catch (err2) { /* best effort */ }
  }
}

__realGlobal.onmessage = async function (e) {
  const code = (e.data && e.data.code) || '';
  const logs = [];
  let outputChars = 0;
  let truncated = false;

  const stringify = (a) => {
    if (typeof a === 'string') return a;
    if (a === undefined) return 'undefined';
    if (a === null) return 'null';
    if (a instanceof Error) return a.message;
    try { return JSON.stringify(a); } catch (err) { return String(a); }
  };

  // Unbounded output used to be a way to exhaust memory with
  // while(true){ console.log('x') } -- the array grew until the tab died,
  // which the 5s timeout could not help with because the main thread was
  // starved too.
  const collect = (...args) => {
    if (truncated) return;
    if (logs.length >= MAX_OUTPUT_LINES) { truncated = true; return; }
    let line;
    try { line = args.map(stringify).join(' '); } catch (err) { line = '[출력 불가]'; }
    if (outputChars + line.length > MAX_OUTPUT_CHARS) {
      const room = MAX_OUTPUT_CHARS - outputChars;
      if (room > 0) logs.push(line.slice(0, room));
      truncated = true;
      return;
    }
    outputChars += line.length + 1;
    logs.push(line);
  };

  const fakeConsole = {
    log: collect, error: collect, warn: collect, info: collect,
    debug: collect, trace: collect,
  };

  const stdout = () => {
    const body = logs.join('\\n');
    return truncated
      ? body + '\\n\\n[출력이 너무 많아 일부만 표시합니다 — 최대 ' +
        MAX_OUTPUT_LINES + '줄 / ' + MAX_OUTPUT_CHARS + '자]'
      : body;
  };

  try {
    const runner = new Function(
      ...NAMES,
      'console',
      'return (async () => {\\n' + code + '\\n})();'
    );
    await runner(...NAMES.map((n) => STUBS[n]), fakeConsole);
    __postResult({ ok: true, stdout: stdout() });
  } catch (err) {
    __postResult({
      ok: false,
      stdout: stdout(),
      error: err && err.message ? err.message : String(err),
    });
  }
};
`;

let cachedWorkerUrl: string | null = null;
function getWorkerUrl(): string {
  if (!cachedWorkerUrl) {
    const blob = new Blob([WORKER_SOURCE], { type: 'application/javascript' });
    cachedWorkerUrl = URL.createObjectURL(blob);
  }
  return cachedWorkerUrl;
}

const RUN_TIMEOUT_MS = 5000;

// What this sandbox does NOT stop, stated plainly:
//
//   * Memory exhaustion. `new Array(1e9).fill(0)` asks for ~8GB; the browser
//     either throws RangeError (reported as a normal run error) or kills the
//     worker, in which case onerror/onmessageerror fires or the timeout below
//     does. Either way the page survives, but there is no way to cap a
//     worker's heap from script -- only Chrome's per-renderer limit applies.
//     A fresh Worker per run keeps one bad run from affecting the next.
//   * CPU for up to RUN_TIMEOUT_MS. terminate() is the only lever, and it is
//     already wired up below. A tight loop burns one core for 5s.
//   * Reading the page's own origin indirectly, e.g. via error stack strings.
//     Harmless -- the origin is public.
//
// Everything in BLOCKED_WORKER_GLOBALS above is verified blocked by
// `npm run verify:sandbox`, which runs the real WORKER_SOURCE in a node:vm
// context and tries 21 escape routes.

export function useJsRunner() {
  // JavaScript runs natively in the browser, so unlike Pyodide there is no
  // WASM download/init phase to wait for.
  const loading = false;
  const error: string | null = null;

  const runCode = (
    code: string,
    testCases?: { input: string; expected: string }[],
    testRunnerCode?: string
  ): Promise<RunResponse> => {
    return new Promise((resolve) => {
      let settled = false;
      const worker = new Worker(getWorkerUrl());

      const finish = (result: RunResponse) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        worker.terminate();
        resolve(result);
      };

      const timer = setTimeout(() => {
        finish({
          success: false,
          stdout: '',
          error: `실행 시간이 ${RUN_TIMEOUT_MS / 1000}초를 초과했습니다. 무한 루프가 없는지 확인해 주세요.`,
        });
      }, RUN_TIMEOUT_MS);

      worker.onmessage = (e: MessageEvent) => {
        const { ok, stdout, error: workerError } = e.data || {};

        if (!ok) {
          finish({ success: false, stdout: stdout || '', error: workerError || 'JavaScript 실행 중 오류가 발생했습니다.' });
          return;
        }

        if (testRunnerCode === 'stdout_match') {
          const expected = testCases && testCases[0] ? String(testCases[0].expected) : '';
          const cleanExpected = expected.replace(/^['"]|['"]$/g, '').replace(/\r\n/g, '\n').trim();
          const cleanActual = String(stdout || '').replace(/\r\n/g, '\n').trim();
          const passed = cleanActual === cleanExpected;
          finish({
            success: passed,
            stdout,
            testResults: [
              { input: '전체 코드 출력', expected: cleanExpected, actual: cleanActual, passed },
            ],
          });
          return;
        }

        finish({ success: true, stdout: stdout || '' });
      };

      worker.onerror = (e: ErrorEvent) => {
        finish({ success: false, stdout: '', error: e.message || 'JavaScript 실행 중 오류가 발생했습니다.' });
      };

      // Fires when the worker's result can't be deserialized (e.g. it died
      // mid-post after an out-of-memory). Without this the run would hang
      // until the timeout instead of reporting something useful.
      worker.onmessageerror = () => {
        finish({
          success: false,
          stdout: '',
          error: '실행 결과를 전달받지 못했습니다. 메모리를 너무 많이 사용하는 코드가 아닌지 확인해 주세요.',
        });
      };

      worker.postMessage({ code });
    });
  };

  return { loading, error, runCode };
}
