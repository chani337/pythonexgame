// Seed data for the SQL problems.
//
// This used to be a Python string literal built inside usePyodide's runCode,
// which meant the schema, the rows and the execution harness were one
// inseparable blob -- and the user's query was interpolated into a Python
// triple-quoted string alongside it. Declaring it as data instead makes the
// per-problem schema below possible and removes that interpolation entirely.
//
// The rows are what every SQL problem's expected output was computed against,
// so changing them invalidates answer keys. Don't edit without re-running
// `npm run verify:sql`.

export interface SqlTableSeed {
  name: string;
  /** Column definitions in `name TYPE` form, used verbatim in CREATE TABLE. */
  columns: string[];
  rows: (string | number | null)[][];
}

export interface SqlDataset {
  id: string;
  tables: SqlTableSeed[];
}

// The dataset every current problem runs against. The docs' SQL chapters
// describe these exact two tables, and ProblemWorkspace shows them above the
// editor, so the three have to agree.
export const DEFAULT_SQL_DATASET: SqlDataset = {
  id: 'default',
  tables: [
    {
      name: 'users',
      columns: ['id INT', 'name TEXT', 'age INT', 'score INT', 'dept TEXT'],
      rows: [
        [1, '김철수', 20, 90, '개발팀'],
        [2, '이영희', 25, 85, '기획팀'],
        [3, '박민수', 22, 100, '개발팀'],
        [4, '최수민', 28, 70, '디자인팀'],
        [5, '정찬희', 24, 95, '개발팀'],
      ],
    },
    {
      name: 'orders',
      columns: ['order_id INT', 'user_id INT', 'product TEXT', 'price INT'],
      rows: [
        [101, 1, '노트북', 1500000],
        [102, 1, '마우스', 30000],
        [103, 3, '키보드', 120000],
        [104, 5, '모니터', 450000],
      ],
    },
  ],
};

// Problems can opt into a different dataset by id. Nothing uses this yet --
// it exists so a future problem needing its own tables doesn't require
// touching the runner.
export const SQL_DATASETS: Record<string, SqlDataset> = {
  [DEFAULT_SQL_DATASET.id]: DEFAULT_SQL_DATASET,
};

function quote(value: string | number | null): string {
  if (value === null) return 'NULL';
  if (typeof value === 'number') return String(value);
  return `'${value.replace(/'/g, "''")}'`;
}

/**
 * Builds the CREATE TABLE + INSERT script for a dataset.
 *
 * Every run gets a fresh in-memory database, so there is no DELETE-then-insert
 * dance like the old Python harness needed (it reused one connection and had
 * to clear the tables first).
 */
export function buildSeedSql(dataset: SqlDataset = DEFAULT_SQL_DATASET): string {
  const statements: string[] = [];
  for (const table of dataset.tables) {
    statements.push(`CREATE TABLE ${table.name} (${table.columns.join(', ')});`);
    if (table.rows.length > 0) {
      const values = table.rows.map((row) => `(${row.map(quote).join(', ')})`).join(',\n  ');
      statements.push(`INSERT INTO ${table.name} VALUES\n  ${values};`);
    }
  }
  return statements.join('\n');
}
