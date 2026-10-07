import { useCallback, useState } from 'react';
import type { RunResponse } from './usePyodide';
import { translateOracleSqlToSqlite } from '../utils/oracleToSqlite';
import { buildSeedSql, DEFAULT_SQL_DATASET, SQL_DATASETS } from '../data/sqlSeed';

// SQL used to run through Pyodide: the raw query was interpolated into a
// Python triple-quoted string that opened sqlite3 and printed the rows. That
// cost 14.6MB of download for a single SQL problem (13.15MB Pyodide core plus
// the 1.45MB sqlite3 wheel), routed on a `trim().toUpperCase().startsWith()`
// check that sent anything beginning with a comment into Python as code, and
// escaped only backslashes and `"""` on the way in.
//
// sql.js is SQLite compiled to wasm: 0.71MB, no Python involved, and the query
// is handed to the engine as a query instead of as source code.
export const SQLJS_VERSION = '1.14.2';

// sha384 of sql-wasm.js at this version. Without it a compromised CDN gets
// arbitrary script execution on every visitor who opens a SQL problem.
// Regenerate when bumping the version: npm run fetch:sqljs
export const SQLJS_INTEGRITY = 'sha384-7Zym2PlgXfg8ap8cqJUwlZrLl+VEwt0NVbzYfhH28IWLnSpAgQOnSCY2+EXo5MtM';

const SQLJS_SOURCES: { label: string; baseURL: string; integrity: string | null }[] = [
  {
    label: 'jsDelivr CDN',
    baseURL: `https://cdn.jsdelivr.net/npm/sql.js@${SQLJS_VERSION}/dist/`,
    integrity: SQLJS_INTEGRITY,
  },
  {
    // Same-origin, so SRI adds nothing and pinning a hash here would break the
    // moment the version is bumped without re-running the fetch script.
    label: '자체 호스팅',
    baseURL: '/sql-js/',
    integrity: null,
  },
];

const SCRIPT_TIMEOUT_MS = 8000;

type SqlValue = string | number | Uint8Array | null;
interface SqlJsResult { columns: string[]; values: SqlValue[][] }
interface SqlJsDatabase {
  run(sql: string): void;
  exec(sql: string): SqlJsResult[];
  close(): void;
}
interface SqlJsStatic { Database: new () => SqlJsDatabase }

declare global {
  interface Window {
    initSqlJs?: (config?: { locateFile?: (file: string) => string }) => Promise<SqlJsStatic>;
  }
}

function injectScript(src: string, integrity: string | null): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    if (integrity) {
      script.integrity = integrity;
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
    script.onload = () => { cleanup(); resolve(); };
    script.onerror = () => {
      cleanup();
      script.remove();
      reject(new Error('스크립트를 불러올 수 없습니다 (차단, 오프라인 또는 SRI 불일치)'));
    };
    document.head.appendChild(script);
  });
}

const readInit = (): Window['initSqlJs'] => window.initSqlJs;

// One engine instance for the whole session; each run gets a fresh Database
// from it, so no state leaks between runs.
let enginePromise: Promise<SqlJsStatic> | null = null;

function loadEngine(): Promise<SqlJsStatic> {
  if (enginePromise) return enginePromise;

  enginePromise = (async () => {
    const failures: string[] = [];
    for (const source of SQLJS_SOURCES) {
      try {
        delete window.initSqlJs;
        await injectScript(`${source.baseURL}sql-wasm.js`, source.integrity);
        const init = readInit();
        if (!init) throw new Error('스크립트가 initSqlJs 를 등록하지 않았습니다');

        // locateFile must point at the same origin the loader came from, or
        // the wasm would be fetched from the other one.
        const engine = await init({ locateFile: (file) => `${source.baseURL}${file}` });
        console.info(`[PyQuests] sql.js ${SQLJS_VERSION} 로드 성공 — ${source.label} (${source.baseURL})`);
        return engine;
      } catch (err: unknown) {
        const reason = err instanceof Error ? err.message : String(err);
        console.warn(`[PyQuests] sql.js 로드 실패 — ${source.label}: ${reason}`);
        failures.push(`${source.label}: ${reason}`);
      }
    }
    // Let the next attempt retry instead of caching the failure forever.
    enginePromise = null;
    throw new Error(
      'SQL 실행 엔진을 불러오지 못했습니다.\n' +
      '인터넷 연결을 확인해 주세요. 학교나 회사 네트워크에서 차단된 경우일 수도 있습니다.\n' +
      `(${failures.join(' / ')})`
    );
  })();

  return enginePromise;
}

export interface SqlResultTable {
  columns: string[];
  /** Already formatted for display; NULL is the literal string 'NULL'. */
  rows: string[][];
}

const SUCCESS_NO_RESULT = 'SQL 쿼리가 성공적으로 실행되었습니다.';

/**
 * Asks SQLite for each column's storage class.
 *
 * Needed because Python's sqlite3 hands back a float for a REAL column and
 * `str(88.0)` is "88.0", while JavaScript has a single number type so
 * `String(88)` is "88". Every stored expected output was produced by the
 * Python path, so the formatter has to know which columns are REAL to stay
 * byte-compatible. sql.js exposes no column-type accessor, hence asking the
 * engine directly.
 *
 * Returns null for query shapes that can't be wrapped, in which case numbers
 * fall back to plain formatting.
 */
function columnTypes(db: SqlJsDatabase, sql: string, columns: string[]): string[] | null {
  const body = sql.trim().replace(/;\s*$/, '');
  if (!body) return null;
  const selectList = columns
    .map((c, i) => `typeof("${c.replace(/"/g, '""')}") AS t${i}`)
    .join(', ');
  try {
    const probe = db.exec(`SELECT ${selectList} FROM (${body}) LIMIT 1`);
    const row = probe[0]?.values?.[0];
    return row ? row.map((v) => String(v)) : null;
  } catch {
    return null;
  }
}

function formatValue(value: SqlValue, type: string | undefined): string {
  if (value === null) return 'NULL';
  if (value instanceof Uint8Array) return `<BLOB ${value.length} bytes>`;
  if (type === 'real' && typeof value === 'number' && Number.isInteger(value)) {
    // Matches Python's str(88.0) -> "88.0".
    return value.toFixed(1);
  }
  return String(value);
}

/**
 * The exact text the old Python harness printed, so the 36 stored expected
 * outputs keep matching:
 *
 *   print(" | ".join(cols))
 *   print("-" * 40)
 *   print(" | ".join(str(x) if x is not None else 'NULL' for x in row))
 *
 * The UI renders `tables` instead; this string exists for grading.
 */
function toStdout(tables: SqlResultTable[]): string {
  if (tables.length === 0) return SUCCESS_NO_RESULT;
  const lines: string[] = [];
  for (const table of tables) {
    lines.push(table.columns.join(' | '));
    lines.push('-'.repeat(40));
    for (const row of table.rows) lines.push(row.join(' | '));
  }
  return lines.join('\n');
}

export interface SqlRunResult extends RunResponse {
  /** Structured results for table rendering. Empty for a write-only query. */
  tables?: SqlResultTable[];
}

export function useSqlRunner() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runCode = useCallback(async (
    code: string,
    testCases?: { input: string; expected: string }[],
    testRunnerCode?: string,
    datasetId: string = DEFAULT_SQL_DATASET.id
  ): Promise<SqlRunResult> => {
    let engine: SqlJsStatic;
    try {
      setLoading(true);
      engine = await loadEngine();
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      return { success: false, stdout: '', error: message };
    } finally {
      setLoading(false);
    }

    const dataset = SQL_DATASETS[datasetId] ?? DEFAULT_SQL_DATASET;
    const db = new engine.Database();
    try {
      db.run(buildSeedSql(dataset));

      // Normalise the same mobile-keyboard substitutions the Python path did;
      // a smart quote from an iPad would otherwise be a syntax error.
      const normalized = code
        .replace(/[“”]/g, '"')
        .replace(/[‘’´ʹ]/g, "'")
        .replace(/ /g, ' ');

      const translated = translateOracleSqlToSqlite(normalized);

      // exec() runs every statement and returns one entry per statement that
      // produced rows, so multi-statement input works without extra handling.
      const raw = db.exec(translated);
      const tables: SqlResultTable[] = raw.map((result) => {
        const types = columnTypes(db, translated, result.columns);
        return {
          columns: result.columns,
          rows: result.values.map((row) => row.map((v, i) => formatValue(v, types?.[i]))),
        };
      });

      const stdout = toStdout(tables);

      if (testRunnerCode === 'stdout_match') {
        const expected = testCases?.[0] ? String(testCases[0].expected) : '';
        const cleanExpected = expected.replace(/^['"]|['"]$/g, '').replace(/\r\n/g, '\n').trim();
        const cleanActual = stdout.replace(/\r\n/g, '\n').trim();
        const passed = cleanActual === cleanExpected;
        return {
          success: passed,
          stdout,
          tables,
          testResults: [{ input: '전체 코드 출력', expected: cleanExpected, actual: cleanActual, passed }],
        };
      }

      return { success: true, stdout, tables };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, stdout: '', error: `SQL 실행 오류: ${message}` };
    } finally {
      db.close();
    }
  }, []);

  return { loading, error, runCode };
}
