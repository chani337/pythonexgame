import type { RunResponse } from './usePyodide';

// The worker receives { code } and executes it in an isolated global scope
// (no DOM/window access), wrapped in an async IIFE so top-level await works.
// console.* calls are intercepted and collected as "stdout" lines, mirroring
// how Python's print() output is captured via usePyodide.
const WORKER_SOURCE = `
self.onmessage = async function (e) {
  const code = e.data && e.data.code || '';
  const logs = [];
  const stringify = (a) => {
    if (typeof a === 'string') return a;
    if (a === undefined) return 'undefined';
    if (a === null) return 'null';
    if (a instanceof Error) return a.message;
    try { return JSON.stringify(a); } catch (err) { return String(a); }
  };
  const collect = (...args) => { logs.push(args.map(stringify).join(' ')); };
  const fakeConsole = { log: collect, error: collect, warn: collect, info: collect };

  try {
    const runner = new Function('console', 'return (async () => {\\n' + code + '\\n})();');
    await runner(fakeConsole);
    self.postMessage({ ok: true, stdout: logs.join('\\n') });
  } catch (err) {
    self.postMessage({ ok: false, stdout: logs.join('\\n'), error: err && err.message ? err.message : String(err) });
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

      worker.postMessage({ code });
    });
  };

  return { loading, error, runCode };
}
