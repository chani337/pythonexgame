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

// A small company: departments, employees, products. Used by the problems
// with `sqlDataset: 'company'` -- the beginner and practice-oriented SELECT
// problems and every DDL/DML problem. Gaps are deliberate: 인사팀 has nobody
// (outer joins), 윤서연 has no department and three people have no email
// (NULL handling), one product is out of stock.
//
// Same rule as the default dataset: the expected outputs were computed from
// these rows. Re-run `npm run verify:sql` after any edit.
export const COMPANY_SQL_DATASET: SqlDataset = {
  id: 'company',
  tables: [
    {
      name: 'departments',
      columns: ['dept_id INT PRIMARY KEY', 'dept_name TEXT', 'location TEXT'],
      rows: [
        [10, '개발팀', '서울'],
        [20, '기획팀', '서울'],
        [30, '디자인팀', '부산'],
        [40, '인사팀', '서울'],
      ],
    },
    {
      name: 'employees',
      columns: ['emp_id INT PRIMARY KEY', 'name TEXT', 'dept_id INT', 'position TEXT', 'salary INT', 'hire_date TEXT', 'email TEXT'],
      rows: [
        [1, '김철수', 10, '팀장', 6200, '2015-03-02', 'cs.kim@company.com'],
        [2, '이영희', 20, '대리', 4300, '2019-07-15', 'yh.lee@company.com'],
        [3, '박민수', 10, '사원', 3600, '2022-01-10', null],
        [4, '최수민', 30, '과장', 5100, '2017-11-20', 'sm.choi@company.com'],
        [5, '정찬희', 10, '대리', 4500, '2020-05-04', 'ch.jung@company.com'],
        [6, '한지민', 20, '사원', 3400, '2023-02-13', null],
        [7, '오세훈', 30, '사원', 3500, '2022-09-01', 'sh.oh@company.com'],
        [8, '윤서연', null, '인턴', 2500, '2024-07-01', null],
      ],
    },
    {
      name: 'products',
      columns: ['product_id INT PRIMARY KEY', 'name TEXT', 'category TEXT', 'price INT', 'stock INT'],
      rows: [
        [101, '무선 마우스', '주변기기', 25000, 40],
        [102, '기계식 키보드', '주변기기', 89000, 15],
        [103, '27인치 모니터', '모니터', 320000, 8],
        [104, '노트북 거치대', '액세서리', 35000, 0],
        [105, 'USB-C 허브', '액세서리', 42000, 25],
        [106, '웹캠', '주변기기', 58000, 3],
      ],
    },
  ],
};

// Problems opt into a dataset by id (Problem.sqlDataset); the default is
// users/orders.
export const SQL_DATASETS: Record<string, SqlDataset> = {
  [DEFAULT_SQL_DATASET.id]: DEFAULT_SQL_DATASET,
  [COMPANY_SQL_DATASET.id]: COMPANY_SQL_DATASET,
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
