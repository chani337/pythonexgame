// Exercises the CDN -> self-hosted fallback in src/hooks/usePyodide.ts without
// a browser, by giving the module a fake document/window and scripting which
// sources succeed.
//
// What this proves: ordering, that a blocked CDN falls through, that a CDN
// whose script loads but whose wasm fails ALSO falls through, that SRI and
// crossOrigin are set on the cross-origin script only, that the timeout
// fires, and that total failure produces the Korean message instead of a hang.
//
// What it cannot prove: that a real browser accepts the SRI hash, or that
// Pyodide boots. scripts/verify-pyodide-core.mjs covers the second; the first
// needs a deploy.
//
//   npm run verify:pyodide
//
import { build } from 'esbuild';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');

// --- fake DOM -----------------------------------------------------------
// `plan` maps a script src to how it behaves: 'load', 'error', or 'hang'.
// `wasmFails` is a set of indexURLs where loadPyodide() itself rejects.
function installFakeDom({ plan, wasmFails = new Set(), onLoadPyodide }) {
  const injected = [];

  const head = {
    appendChild(script) {
      injected.push(script);
      const behaviour = plan(script.src);
      if (behaviour === 'hang') return;
      // Async, like a real network response.
      setTimeout(() => {
        if (behaviour === 'load') {
          // A real pyodide.js defines window.loadPyodide as a side effect.
          globalThis.window.loadPyodide = async ({ indexURL }) => {
            onLoadPyodide?.(indexURL);
            if (wasmFails.has(indexURL)) {
              throw new Error('wasm 다운로드 실패 (시뮬레이션)');
            }
            return { __source: indexURL };
          };
          script.onload?.();
        } else {
          script.onerror?.(new Error('network'));
        }
      }, 1);
    },
  };

  globalThis.document = {
    head,
    createElement: () => ({
      src: '', async: false, integrity: '', crossOrigin: '',
      onload: null, onerror: null,
      remove() { this.__removed = true; },
    }),
  };
  globalThis.window = {};
  return { injected };
}

async function loadHook() {
  // Emitted inside the project, not os.tmpdir(): the module imports react for
  // the hook itself, and a bundle outside the tree cannot resolve it.
  const dir = await mkdtemp(join(ROOT, 'node_modules', '.pyoloader-'));
  const outfile = join(dir, 'h.mjs');
  await build({
    entryPoints: [join(ROOT, 'src/hooks/usePyodide.ts')],
    outfile, format: 'esm', platform: 'neutral', bundle: true, logLevel: 'silent',
    // The hook function is never called here -- only bootPyodide is.
    external: ['react'],
  });
  const mod = await import('file://' + outfile);
  await rm(dir, { recursive: true, force: true });
  return mod;
}

const { PYODIDE_VERSION, __bootPyodideForTests: boot } = await loadHook();

if (!boot) {
  console.error('usePyodide.ts 가 __bootPyodideForTests 를 export 하지 않습니다.');
  process.exit(1);
}

const CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
const SELF = '/pyodide/';

const results = [];
function check(name, pass, detail = '') {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'OK  ' : '실패'} ${name}${detail ? '  — ' + detail : ''}`);
}

// --- 1. happy path: CDN first ------------------------------------------
{
  const seen = [];
  const { injected } = installFakeDom({ plan: () => 'load', onLoadPyodide: (u) => seen.push(u) });
  const py = await boot();
  check('정상: jsDelivr 에서 로드', py.__source === CDN, py.__source);
  check('정상: 자체 호스팅은 시도하지 않음', injected.length === 1, `주입된 script ${injected.length}개`);
  check('SRI: 교차 출처 스크립트에 integrity 설정', injected[0].integrity.startsWith('sha384-'), injected[0].integrity.slice(0, 20) + '...');
  check('SRI: crossOrigin=anonymous 동반', injected[0].crossOrigin === 'anonymous', injected[0].crossOrigin);
  check('indexURL 이 스크립트 출처와 일치', seen[0] === CDN, seen[0]);
}

// --- 2. CDN blocked -> self-hosted -------------------------------------
{
  const { injected } = installFakeDom({
    plan: (src) => (src.startsWith('https://') ? 'error' : 'load'),
  });
  const py = await boot();
  check('CDN 차단: 자체 호스팅으로 폴백', py.__source === SELF, py.__source);
  check('CDN 차단: 두 출처를 순서대로 시도', injected.length === 2 && injected[0].src.startsWith('https://'), `${injected.length}개`);
  check('자체 호스팅에는 integrity 없음 (동일 출처)', injected[1].integrity === '', JSON.stringify(injected[1].integrity));
  check('실패한 script 태그는 DOM 에서 제거', injected[0].__removed === true);
}

// --- 3. CDN script loads but its wasm fails -> still falls through ------
{
  const { injected } = installFakeDom({ plan: () => 'load', wasmFails: new Set([CDN]) });
  const py = await boot();
  check('CDN wasm 실패: 자체 호스팅으로 폴백', py.__source === SELF, py.__source);
  check('CDN wasm 실패: 스크립트는 성공했어도 재시도', injected.length === 2);
}

// --- 4. both fail -> Korean error, no hang -----------------------------
{
  installFakeDom({ plan: () => 'error' });
  let message = '';
  try { await boot(); } catch (e) { message = e.message; }
  check('전부 실패: 에러를 던짐', message.length > 0);
  check('전부 실패: 한국어 안내 포함', message.includes('파이썬 실행 엔진을 불러오지 못했습니다'), message.split('\n')[0]);
  check('전부 실패: 차단 가능성 언급', message.includes('차단'));
  check('전부 실패: 두 출처의 실패 이유 모두 포함', message.includes('jsDelivr') && message.includes('자체 호스팅'));
}

// --- 5. timeout --------------------------------------------------------
{
  installFakeDom({ plan: (src) => (src.startsWith('https://') ? 'hang' : 'load') });
  const t0 = Date.now();
  const py = await boot();
  const elapsed = Date.now() - t0;
  check('무응답 CDN: 타임아웃 후 폴백', py.__source === SELF, `${elapsed}ms`);
  check('무응답 CDN: 8초 안에 포기', elapsed >= 7500 && elapsed < 11000, `${elapsed}ms`);
}

// --- 6. the SRI hash in the source matches the fetched copy ------------
{
  let marker = null;
  try {
    marker = JSON.parse(await readFile(resolve(ROOT, 'public/pyodide/version.json'), 'utf8'));
  } catch { /* fallback copy not fetched */ }

  if (!marker) {
    console.log('참고 public/pyodide/version.json 없음 — SRI 대조 생략 (npm run fetch:pyodide)');
  } else {
    const source = await readFile(resolve(ROOT, 'src/hooks/usePyodide.ts'), 'utf8');
    const expected = marker.integrity['pyodide.js'];
    check('SRI 해시가 실제 파일과 일치', source.includes(expected), expected.slice(0, 28) + '...');
    check('버전 문자열 일치', marker.version === PYODIDE_VERSION, `${marker.version} vs ${PYODIDE_VERSION}`);
  }
}

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} 통과`);
process.exit(failed.length === 0 ? 0 : 1);
