// Runs every example cell in the SQL 학습 가이드 the way DocsViewer does:
// a fresh sql.js database seeded with the users/orders data the SQL problems
// use, Oracle syntax translated, every statement executed.
//
// A cell must run without error, except the ones listed below that exist to
// show an error on purpose. Oracle-only syntax (ROLLUP, MINUS, GRANT, ...)
// belongs in markdown with a note, never in a runnable cell -- this is what
// catches one slipping in.
//
//   node scripts/verify-sql-guide.mjs
//
import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import initSqlJs from 'sql.js';

const ROOT = resolve(import.meta.dirname, '..');

async function load(rel, name) {
  const dir = await mkdtemp(join(tmpdir(), 'pyquests-' + name + '-'));
  const outfile = join(dir, name + '.mjs');
  await build({ entryPoints: [join(ROOT, rel)], outfile, format: 'esm', platform: 'node', bundle: true, logLevel: 'silent' });
  const mod = await import('file://' + outfile);
  await rm(dir, { recursive: true, force: true });
  return mod;
}

// Cell id -> the error it is there to demonstrate.
const EXPECTED_ERRORS = {
  SQL_2_WHERE_cell_3: /no such column: 개발팀/,       // 따옴표를 빠뜨리면
  SQL_12_DDL_DML_cell_3: /UNIQUE constraint failed/,   // PRIMARY KEY 중복
  SQL_12_DDL_DML_cell_13: /no such table: orders/,     // DROP 뒤 조회
};

const { docChapters } = await load('src/data/docs.ts', 'docs');
const { buildSeedSql } = await load('src/data/sqlSeed.ts', 'seed');
const { translateOracleSqlToSqlite } = await load('src/utils/oracleToSqlite.ts', 'oracle');
const SQL = await initSqlJs();

const cells = docChapters.filter((c) => c.category === 'sql').flatMap((c) => c.cells.filter((x) => x.type === 'code'));
let failed = 0;
for (const cell of cells) {
  const db = new SQL.Database();
  db.run(buildSeedSql());
  let error = null;
  try {
    db.exec(translateOracleSqlToSqlite(cell.content));
  } catch (e) {
    error = String(e.message || e);
  } finally {
    db.close();
  }
  const expected = EXPECTED_ERRORS[cell.id];
  if (expected) {
    if (!error || !expected.test(error)) { failed++; console.log(`✗ ${cell.id}: 일부러 낸 오류가 안 남 (${error ?? '오류 없음'})`); }
  } else if (error) {
    failed++;
    console.log(`✗ ${cell.id}: ${error}\n    ${cell.content.split('\n')[0]}`);
  }
}
for (const id of Object.keys(EXPECTED_ERRORS)) {
  if (!cells.some((c) => c.id === id)) { failed++; console.log(`✗ ${id}: 그런 셀이 없음 (가이드가 바뀌었으면 목록도 고치세요)`); }
}
console.log(failed ? `\n${failed}건 실패` : `SQL 학습 가이드 예제 ${cells.length}개 전부 실행됨 (일부러 오류 ${Object.keys(EXPECTED_ERRORS).length}개 포함)`);
process.exit(failed ? 1 : 0);
