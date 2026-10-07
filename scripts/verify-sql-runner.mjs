// Runs every SQL reference solution through the SAME formatting and
// translation code the browser uses, and compares byte-for-byte against the
// stored expected output.
//
// The point is that the move from Pyodide's sqlite3 to sql.js must not change
// a single stored answer. Python's sqlite3 returns a float for a REAL column
// and str(88.0) is "88.0", while JS has one number type -- that difference
// alone broke 4 problems in the first prototype, so this check is not
// optional.
//
// It imports the real modules (oracleToSqlite, sqlSeed) rather than copies, so
// editing either one and breaking compatibility fails here.
//
//   npm run fetch:sqljs && npm run verify:sql
//
import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(import.meta.dirname, '..');
const WASM = join(ROOT, 'node_modules/sql.js/dist/sql-wasm.wasm');

if (!existsSync(WASM)) {
  console.error('node_modules/sql.js 가 없습니다. npm install 을 먼저 실행하세요.');
  process.exit(1);
}

const dir = await mkdtemp(join(ROOT, 'node_modules', '.vsql-'));
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
const scMod = await load('src/data/solutionCode.ts', 'solutions');
const solutionCode = scMod.solutionCode || scMod.default;
const { decodeAnswer } = await load('src/utils/answerObfuscation.ts', 'obf');
const { translateOracleSqlToSqlite, translateOracleOuterJoinToAnsi } = await load('src/utils/oracleToSqlite.ts', 'oracle');
const { buildSeedSql, DEFAULT_SQL_DATASET } = await load('src/data/sqlSeed.ts', 'seed');
await rm(dir, { recursive: true, force: true });

const initSqlJs = (await import('sql.js')).default;
const SQL = await initSqlJs({ locateFile: () => WASM });
const SEED = buildSeedSql(DEFAULT_SQL_DATASET);

// --- mirrors useSqlRunner's columnTypes / formatValue / toStdout ----------
function columnTypes(db, sql, columns) {
  const body = sql.trim().replace(/;\s*$/, '');
  if (!body) return null;
  const sel = columns.map((c, i) => `typeof("${c.replace(/"/g, '""')}") AS t${i}`).join(', ');
  try {
    const probe = db.exec(`SELECT ${sel} FROM (${body}) LIMIT 1`);
    const row = probe[0]?.values?.[0];
    return row ? row.map(String) : null;
  } catch { return null; }
}
function formatValue(v, type) {
  if (v === null) return 'NULL';
  if (v instanceof Uint8Array) return `<BLOB ${v.length} bytes>`;
  if (type === 'real' && typeof v === 'number' && Number.isInteger(v)) return v.toFixed(1);
  return String(v);
}
function run(code) {
  const db = new SQL.Database();
  try {
    db.run(SEED);
    const translated = translateOracleSqlToSqlite(code);
    const raw = db.exec(translated);
    if (raw.length === 0) return 'SQL 쿼리가 성공적으로 실행되었습니다.';
    const lines = [];
    for (const r of raw) {
      const types = columnTypes(db, translated, r.columns);
      lines.push(r.columns.join(' | '));
      lines.push('-'.repeat(40));
      for (const row of r.values) lines.push(row.map((v, i) => formatValue(v, types?.[i])).join(' | '));
    }
    return lines.join('\n');
  } finally { db.close(); }
}

// --- 1. every reference solution reproduces its stored output -------------
const sqlProblems = problems.filter((p) => p.language === 'sql');
let pass = 0; const fails = []; const noSolution = [];

for (const p of sqlProblems) {
  const code = solutionCode[p.id];
  if (!code) { noSolution.push(p.id); continue; }
  const expected = decodeAnswer(p.testCases[0].expected).replace(/\r\n/g, '\n').trim();
  let actual;
  try { actual = run(code).replace(/\r\n/g, '\n').trim(); }
  catch (e) { actual = 'ERROR: ' + e.message; }
  if (actual === expected) pass++;
  else fails.push({ id: p.id, code: code.trim(), expected, actual });
}

console.log('=== SQL 정답 코드 재현 ===');
console.log(`  대조 ${sqlProblems.length - noSolution.length} / ${sqlProblems.length} 문제`);
console.log(`  바이트 단위 일치: ${pass}`);
console.log(`  불일치: ${fails.length}`);
if (noSolution.length) console.log(`  정답 코드 없어 대조 불가: ${noSolution.length}개 (${noSolution.join(', ')})`);
for (const f of fails) {
  console.log(`\n  실패 ${f.id}`);
  console.log(`    SQL  : ${JSON.stringify(f.code.slice(0, 120))}`);
  console.log(`    기대  : ${JSON.stringify(f.expected.slice(0, 180))}`);
  console.log(`    실제  : ${JSON.stringify(f.actual.slice(0, 180))}`);
}

// --- 2. the Oracle translator still behaves as it did in usePyodide -------
const ORACLE_CASES = [
  ['NVL -> IFNULL', 'SELECT NVL(dept, 0) FROM users;', /IFNULL\(/],
  ['FETCH FIRST -> LIMIT', 'SELECT name FROM users ORDER BY score DESC FETCH FIRST 3 ROWS ONLY;', /LIMIT 3/],
  ['OFFSET+FETCH -> LIMIT/OFFSET', 'SELECT name FROM users OFFSET 2 ROWS FETCH NEXT 3 ROWS ONLY;', /LIMIT 3 OFFSET 2/],
  ['(+) -> LEFT JOIN', 'SELECT u.name FROM users u, orders o WHERE u.id = o.user_id(+);', /LEFT JOIN/],
  ['(+) 없으면 무변경', 'SELECT name FROM users;', /^SELECT name FROM users;$/],
];
console.log('\n=== Oracle 번역기 동작 고정 ===');
let trPass = 0;
for (const [label, input, expectRe] of ORACLE_CASES) {
  const out = translateOracleSqlToSqlite(input);
  const ok = expectRe.test(out);
  if (ok) trPass++;
  console.log(`  ${ok ? 'OK  ' : '실패'} ${label.padEnd(30)} ${ok ? '' : JSON.stringify(out.slice(0, 90))}`);
}
if (typeof translateOracleOuterJoinToAnsi !== 'function') {
  console.log('  실패 translateOracleOuterJoinToAnsi 가 export 되지 않았습니다');
}

// --- 3. inputs the old prefix-sniffing router mishandled ------------------
const ROUTING_CASES = [
  ['주석으로 시작', '-- 내 풀이\nSELECT name FROM users;'],
  ['선행 개행/공백', '\n   SELECT name FROM users;'],
  ['소문자 with', 'with t as (select 1 as n) select n from t;'],
  ['여러 문장', 'SELECT name FROM users LIMIT 1; SELECT dept FROM users LIMIT 1;'],
  ['쓰기 전용 쿼리', "INSERT INTO users VALUES (9,'테스트',30,50,'임시');"],
];
console.log('\n=== 기존 라우터가 못 다루던 입력 ===');
let routePass = 0;
for (const [label, sql] of ROUTING_CASES) {
  try {
    const out = run(sql);
    routePass++;
    console.log(`  OK   ${label.padEnd(16)} ${JSON.stringify(out.split('\n')[0].slice(0, 50))}`);
  } catch (e) {
    console.log(`  실패 ${label.padEnd(16)} ${e.message.slice(0, 60)}`);
  }
}

// --- 4. errors surface instead of throwing out of the runner -------------
console.log('\n=== 에러 처리 ===');
let errOk = 0;
for (const [label, sql] of [['문법 오류', 'SELCT * FROM users;'], ['없는 테이블', 'SELECT * FROM nope;']]) {
  try { run(sql); console.log(`  실패 ${label}: 에러가 발생하지 않았습니다`); }
  catch (e) { errOk++; console.log(`  OK   ${label.padEnd(12)} ${e.message.slice(0, 55)}`); }
}

const total = fails.length + (ORACLE_CASES.length - trPass) + (ROUTING_CASES.length - routePass) + (2 - errOk);
console.log(`\n${total === 0 ? '전부 통과' : total + '건 실패'}`);
process.exit(total === 0 ? 0 : 1);
