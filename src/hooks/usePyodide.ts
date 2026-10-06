import { useState, useEffect } from 'react';

declare global {
  interface Window {
    loadPyodide?: (config?: { indexURL?: string }) => Promise<any>;
  }
}

export const PYODIDE_VERSION = '0.26.2';

// Where to try loading the runtime from, in order.
//
// jsDelivr first: it is a real CDN with edge caching, and serving the 13MB
// core from Vercel would put that traffic on this project's own bandwidth.
// The self-hosted copy exists because school and corporate networks commonly
// block CDNs outright -- which this app's audience sits behind -- and without
// a fallback the site loads fine but Python silently never works.
//
// `npm run fetch:pyodide` populates public/pyodide/ (gitignored, 13.15MB) and
// prints the SRI hash below; `prebuild` runs it on every build.
const PYODIDE_SOURCES: { label: string; indexURL: string; integrity: string | null }[] = [
  {
    label: 'jsDelivr CDN',
    indexURL: `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`,
    // sha384 of pyodide.js at v0.26.2. Without this, a compromised CDN gets
    // arbitrary script execution on every visitor. Regenerate when bumping
    // the version: npm run fetch:pyodide
    integrity: 'sha384-tVslJOEkg7nVRW3Y3/ReGX0NnonNrbcmt1R5qFbQXQdGa2chRkoJYHAjAsv3zoTq',
  },
  {
    label: '자체 호스팅',
    indexURL: '/pyodide/',
    // Same-origin, so SRI adds nothing -- and pinning a hash here would break
    // the moment the version is bumped without re-running the fetch script.
    integrity: null,
  },
];

// Long enough to not give up on a slow school connection mid-download, short
// enough that a blocked CDN doesn't look like a hang. The old code polled for
// window.loadPyodide every 200ms up to 30 times, so a blocked CDN took a full
// 6 seconds to even be noticed -- and a slow-but-working one was declared
// failed at exactly the same point.
const SCRIPT_TIMEOUT_MS = 8000;

function injectPyodideScript(source: { indexURL: string; integrity: string | null }): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `${source.indexURL}pyodide.js`;
    script.async = true;
    if (source.integrity) {
      script.integrity = source.integrity;
      // Required for SRI on a cross-origin script: without it the response is
      // opaque and the browser cannot verify the hash.
      script.crossOrigin = 'anonymous';
    }

    const timer = setTimeout(() => {
      cleanup();
      script.remove();
      reject(new Error(`${SCRIPT_TIMEOUT_MS / 1000}초 안에 응답하지 않았습니다`));
    }, SCRIPT_TIMEOUT_MS);

    function cleanup() {
      clearTimeout(timer);
      script.onload = null;
      script.onerror = null;
    }

    // onload/onerror give an immediate verdict -- no polling, and an SRI
    // mismatch surfaces here as an error rather than a mysterious timeout.
    script.onload = () => { cleanup(); resolve(); };
    script.onerror = () => {
      cleanup();
      script.remove();
      reject(new Error('스크립트를 불러올 수 없습니다 (차단, 오프라인 또는 SRI 불일치)'));
    };

    document.head.appendChild(script);
  });
}

// Read through a function call so TypeScript does not carry the `undefined`
// narrowing from `delete window.loadPyodide` below into the call site.
const readPyodideLoader = (): Window['loadPyodide'] => window.loadPyodide;

async function bootPyodide(): Promise<any> {
  const failures: string[] = [];

  for (const source of PYODIDE_SOURCES) {
    try {
      // Reset so a half-successful previous attempt (script loaded, wasm
      // blocked) cannot leave a stale loader behind for this one.
      delete window.loadPyodide;
      await injectPyodideScript(source);

      const loader = readPyodideLoader();
      if (!loader) {
        throw new Error('스크립트가 loadPyodide 를 등록하지 않았습니다');
      }

      // indexURL must match where the loader came from, otherwise it would
      // fetch the wasm and stdlib from the other origin.
      const py = await loader({ indexURL: source.indexURL });
      console.info(`[PyQuests] Pyodide v${PYODIDE_VERSION} 로드 성공 — ${source.label} (${source.indexURL})`);
      return py;
    } catch (err: any) {
      const reason = err?.message || String(err);
      console.warn(`[PyQuests] Pyodide 로드 실패 — ${source.label}: ${reason}`);
      failures.push(`${source.label}: ${reason}`);
    }
  }

  throw new Error(
    '파이썬 실행 엔진을 불러오지 못했습니다.\n' +
    '인터넷 연결을 확인해 주세요. 학교나 회사 네트워크에서 차단된 경우일 수도 있습니다.\n' +
    `(${failures.join(' / ')})`
  );
}

// Exported for scripts/verify-pyodide-loader.mjs, which drives it with a fake
// document to check the fallback ordering, the timeout and the SRI attributes
// without needing a browser.
export const __bootPyodideForTests = bootPyodide;

// Pyodide's loadPackage is idempotent but still does an await round-trip and
// logs on every call. Tracking what is loaded keeps repeat runs instant and
// lets the UI show the "preparing numpy" message only on the first one.
const loadedPackages = new Set<string>();

export interface TestResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
}

export interface RunResponse {
  success: boolean;
  stdout: string;
  error?: string;
  testResults?: TestResult[];
}

// sqlite3 has no equivalent of Oracle's `(+)` outer-join operator, so a
// `FROM a, b WHERE a.col = b.col(+) [AND ...]` query is rewritten into the
// ANSI `a LEFT JOIN b ON a.col = b.col [WHERE ...]` form sqlite3 understands.
// Only the single comma-joined two-table shape the SQL problems use is
// supported -- this is a targeted rewrite, not a general SQL parser.
function translateOracleOuterJoinToAnsi(sql: string): string {
  if (!sql.includes('(+)')) return sql;
  const m = sql.match(/FROM\s+(\S+)\s+(\S+)\s*,\s*(\S+)\s+(\S+)\s+WHERE\s+([\s\S]*?)(;?\s*)$/i);
  if (!m) return sql;
  const [, table1, alias1, table2, alias2, whereBody] = m;
  const conditions = whereBody.split(/\s+AND\s+/i);
  const joinIdx = conditions.findIndex((c) => c.includes('(+)'));
  if (joinIdx === -1) return sql;
  const joinCond = conditions[joinIdx].replace(/\(\+\)/, '').trim();
  const plusToken = conditions[joinIdx].match(/(\S+)\(\+\)/)?.[1] ?? '';
  const optionalIsAlias2 = plusToken.startsWith(`${alias2}.`);
  const drivingTable = optionalIsAlias2 ? table1 : table2;
  const drivingAlias = optionalIsAlias2 ? alias1 : alias2;
  const optionalTable = optionalIsAlias2 ? table2 : table1;
  const optionalAlias = optionalIsAlias2 ? alias2 : alias1;
  const remaining = conditions.filter((_, i) => i !== joinIdx).join(' AND ');
  const prefix = sql.slice(0, m.index);
  return (
    prefix +
    `FROM ${drivingTable} ${drivingAlias} LEFT JOIN ${optionalTable} ${optionalAlias} ON ${joinCond}` +
    (remaining ? ` WHERE ${remaining}` : '') +
    ';'
  );
}

// The in-browser SQL engine is sqlite3, which doesn't understand Oracle-only
// syntax -- so Oracle syntax that problems teach ((+), FETCH FIRST, NVL) is
// translated to its sqlite3 equivalent right before execution. The user
// always sees and writes Oracle syntax; only the engine input differs.
function translateOracleSqlToSqlite(sql: string): string {
  return translateOracleOuterJoinToAnsi(sql)
    .replace(/\bNVL\s*\(/gi, 'IFNULL(')
    .replace(/\bOFFSET\s+(\d+)\s+ROWS\s+FETCH\s+(?:FIRST|NEXT)\s+(\d+)\s+ROWS?\s+ONLY\b/gi, 'LIMIT $2 OFFSET $1')
    .replace(/\bFETCH\s+(?:FIRST|NEXT)\s+(\d+)\s+ROWS?\s+ONLY\b/gi, 'LIMIT $1');
}

// `enabled` defers the actual WASM download/init (Pyodide + numpy/pandas is
// several MB and blocks the main thread for multiple seconds) until a view
// that needs Python actually mounts, instead of eagerly loading it for every
// visit including the dashboard/problem list which never run Python at all.
export function usePyodide(enabled: boolean = true) {
  const [pyodide, setPyodide] = useState<any>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  // Non-null while a package wheel is downloading mid-run. numpy is 11MB and
  // pandas pulls 35MB with its dependencies, so without this the run button
  // just sits there looking broken for ten seconds or more.
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let isMounted = true;
    setLoading(true);

    (async () => {
      try {
        const py = await bootPyodide();
        if (isMounted) {
          setPyodide(py);
          setLoading(false);
        }
      } catch (err: any) {
        console.error('Pyodide Init Error:', err);
        if (isMounted) {
          setError(err.message || '파이썬 실행 엔진 로드 중 오류가 발생했습니다.');
          setLoading(false);
        }
      }
    })();

    // NOTE: numpy and pandas are deliberately NOT preloaded here any more.
    // Only 4 of 377 problems import them (numpy_q1/q2, pandas_q1/q2) and the
    // two wheels are ~35MB together on top of the 13MB core, so every visitor
    // who opened any Python screen was downloading ~48MB to run `print()`.
    // ensurePackage() below fetches them on first actual use instead.

    return () => {
      isMounted = false;
    };
  }, [enabled]);

  // Loads a wheel on first use and reports progress. Cached across runs and
  // across problems, so only the first numpy/pandas problem in a session
  // pays the download.
  const ensurePackage = async (py: any, name: string, label: string) => {
    if (loadedPackages.has(name)) return;
    setStatus(`${label}를 준비하는 중입니다... (최초 1회만 내려받습니다)`);
    try {
      await py.loadPackage(name);
      loadedPackages.add(name);
    } catch (err) {
      // Most likely cause: jsDelivr is blocked and the core came from the
      // self-hosted copy, which deliberately does not ship the wheels.
      console.warn(`[PyQuests] ${name} 패키지 로드 실패:`, err);
      throw new Error(
        `${label} 패키지를 불러올 수 없습니다. 네트워크에서 cdn.jsdelivr.net 이 차단되어 있을 수 있습니다.`
      );
    } finally {
      setStatus(null);
    }
  };

  const runCode = async (
    code: string,
    testCases?: { input: string; expected: string }[],
    testRunnerCode?: string
  ): Promise<RunResponse> => {
    if (!pyodide) {
      return { success: false, stdout: '', error: '파이썬 엔진이 아직 준비되지 않았습니다.' };
    }

    const stdoutLines: string[] = [];

    // Redirect stdout/stderr in pyodide
    pyodide.setStdout({
      batched: (msg: string) => {
        stdoutLines.push(msg);
      },
    });
    pyodide.setStderr({
      batched: (msg: string) => {
        stdoutLines.push(msg);
      },
    });

    try {
      // Normalize mobile smart quotes, apostrophes, and non-breaking spaces
      let normalizedCode = code
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/[\u2018\u2019\u00B4\u02B9]/g, "'")
        .replace(/\u00A0/g, ' ');

      // Raw SQL (SELECT/CREATE/INSERT/UPDATE/DELETE/WITH) is transparently routed through
      // an in-memory sqlite3 database seeded with the same fixed users/orders tables used
      // throughout the SQL docs and problems, so any caller can accept plain SQL as "code".
      const trimmedForSqlCheck = normalizedCode.trim().toUpperCase();
      const isRawSql =
        trimmedForSqlCheck.startsWith('SELECT') ||
        trimmedForSqlCheck.startsWith('CREATE') ||
        trimmedForSqlCheck.startsWith('INSERT') ||
        trimmedForSqlCheck.startsWith('UPDATE') ||
        trimmedForSqlCheck.startsWith('DELETE') ||
        trimmedForSqlCheck.startsWith('WITH');

      if (isRawSql) {
        const cleanSql = translateOracleSqlToSqlite(normalizedCode).replace(/\\/g, '\\\\').replace(/"""/g, '\\"\\"\\"');
        normalizedCode = `import sqlite3
conn = sqlite3.connect(':memory:')
cursor = conn.cursor()
cursor.executescript("""
CREATE TABLE IF NOT EXISTS users (id INT, name TEXT, age INT, score INT, dept TEXT);
DELETE FROM users;
INSERT INTO users VALUES
  (1, '\uAE40\uCCA0\uC218', 20, 90, '\uAC1C\uBC1C\uD300'),
  (2, '\uC774\uC601\uD76C', 25, 85, '\uAE30\uD68D\uD300'),
  (3, '\uBC15\uBBFC\uC218', 22, 100, '\uAC1C\uBC1C\uD300'),
  (4, '\uCD5C\uC218\uBBFC', 28, 70, '\uB514\uC790\uC778\uD300'),
  (5, '\uC815\uCC2C\uD76C', 24, 95, '\uAC1C\uBC1C\uD300');

CREATE TABLE IF NOT EXISTS orders (order_id INT, user_id INT, product TEXT, price INT);
DELETE FROM orders;
INSERT INTO orders VALUES
  (101, 1, '\uB178\uD2B8\uBD81', 1500000),
  (102, 1, '\uB9C8\uC6B0\uC2A4', 30000),
  (103, 3, '\uD0A4\uBCF4\uB4DC', 120000),
  (104, 5, '\uBAA8\uB2C8\uD130', 450000);
""")

query = """${cleanSql}"""
try:
    cursor.execute(query)
    rows = cursor.fetchall()
    if cursor.description:
        cols = [d[0] for d in cursor.description]
        print(" | ".join(cols))
        print("-" * 40)
        for r in rows:
            print(" | ".join(str(x) if x is not None else 'NULL' for x in r))
    else:
        conn.commit()
        print("SQL \uCFFC\uB9AC\uAC00 \uC131\uACF5\uC801\uC73C\uB85C \uC2E4\uD589\uB418\uC5C8\uC2B5\uB2C8\uB2E4.")
except Exception as e:
    print(f"SQL \uC2E4\uD589 \uC624\uB958: {e}")
`;
        // sqlite3 is unvendored from Pyodide's standard library and must be
        // loaded explicitly. Stays lazy -- only SQL problems pay for it.
        await ensurePackage(pyodide, 'sqlite3', 'SQL 실행 엔진');
      }

      // Loaded on demand rather than preloaded at init. The patterns below
      // were checked against every reference solution and every runnable doc
      // cell that touches these packages -- all of them match (the scan is in
      // the task notes), so nothing silently misses its import.
      //   `numpy`  catches: import numpy, import numpy as np, from numpy import x
      //   `np.`    catches: np.array(...) when the import line is elsewhere
      if (normalizedCode.includes('numpy') || normalizedCode.includes('np.')) {
        await ensurePackage(pyodide, 'numpy', 'numpy');
      }
      if (normalizedCode.includes('pandas') || normalizedCode.includes('pd.')) {
        await ensurePackage(pyodide, 'pandas', 'pandas');
      }

      // Clear python globals cache (except builtins) to avoid state pollution between runs
      await pyodide.runPythonAsync(`
import sys
# Keep only essential and loaded modules
`);

      // 1. Run the user's custom function definition in Pyodide
      await pyodide.runPythonAsync(normalizedCode);

      // 1.5. If the test runner is output-based matching (stdout_match)
      if (testRunnerCode === 'stdout_match') {
        const userStdout = stdoutLines.join('\n').trim();
        const expected = testCases && testCases[0] ? String(testCases[0].expected) : '';
        
        const cleanExpected = expected.replace(/^['"]|['"]$/g, '');
        
        const cleanActual = userStdout.replace(/\r\n/g, '\n').trim();
        const cleanExpectedNorm = cleanExpected.replace(/\r\n/g, '\n').trim();

        const passed = cleanActual === cleanExpectedNorm;

        return {
          success: passed,
          stdout: userStdout,
          testResults: [
            {
              input: '전체 코드 출력',
              expected: cleanExpectedNorm,
              actual: cleanActual,
              passed
            }
          ]
        };
      }

      // 2. If it's sandbox or quiz and there are no testCases, just return execution
      if (!testCases || !testRunnerCode) {
        return {
          success: true,
          stdout: stdoutLines.join('\n'),
        };
      }

      // 3. Inject test_cases into Python global scope
      const inputs = testCases.map((tc) => tc.input);
      pyodide.globals.set('test_cases', pyodide.toPy(inputs));

      // 4. Run the validation harness
      await pyodide.runPythonAsync(testRunnerCode);

      // 5. Clean up injected globals
      pyodide.globals.delete('test_cases');

      const stdoutResult = stdoutLines.join('\n');
      const testMarker = '###TEST_OUT###';
      const markerIndex = stdoutResult.indexOf(testMarker);

      if (markerIndex === -1) {
        return {
          success: false,
          stdout: stdoutResult,
          error: '테스트 프레임워크와 연결되지 않았습니다. 함수명과 매개변수를 확인해 주세요.',
        };
      }

      const userStdout = stdoutResult.substring(0, markerIndex).trim();
      const testJSON = stdoutResult.substring(markerIndex + testMarker.length).trim();
      const actualOutputs: string[] = JSON.parse(testJSON);

      const testResults = testCases.map((tc, index) => {
        const actual = (actualOutputs[index] !== undefined ? actualOutputs[index] : '').trim();
        const expected = tc.expected.trim();

        // Standardize quotes or spaces for comparisons
        const cleanActual = actual.replace(/^['"]|['"]$/g, '').replace(/\s+/g, ' ');
        const cleanExpected = expected.replace(/^['"]|['"]$/g, '').replace(/\s+/g, ' ');

        const passed = cleanActual === cleanExpected;

        return {
          input: tc.input,
          expected: tc.expected,
          actual,
          passed,
        };
      });

      const allPassed = testResults.every((tr) => tr.passed);

      return {
        success: allPassed,
        stdout: userStdout,
        testResults,
      };
    } catch (err: any) {
      return {
        success: false,
        stdout: stdoutLines.join('\n'),
        error: err.message || String(err),
      };
    }
  };

  return { loading, error, status, runCode, pyodide };
}
