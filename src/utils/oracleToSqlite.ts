// Oracle -> SQLite translation for the SQL problems.
//
// The course material teaches Oracle syntax, but the in-browser engine is
// SQLite, so the few Oracle-only constructs the problems use are rewritten
// right before execution. Students always read and write Oracle syntax; only
// the engine's input differs.
//
// Extracted verbatim from usePyodide.ts when SQL execution moved off Pyodide
// to sql.js. scripts/verify-sql-runner.mjs pins the behaviour so the move
// cannot have changed it.

// sqlite3 has no equivalent of Oracle's `(+)` outer-join operator, so a
// `FROM a, b WHERE a.col = b.col(+) [AND ...]` query is rewritten into the
// ANSI `a LEFT JOIN b ON a.col = b.col [WHERE ...]` form sqlite3 understands.
// Only the single comma-joined two-table shape the SQL problems use is
// supported -- this is a targeted rewrite, not a general SQL parser.
export function translateOracleOuterJoinToAnsi(sql: string): string {
  if (!sql.includes('(+)')) return sql;
  // FROM t1 [[AS] a1], t2 [[AS] a2] WHERE ... -- aliases optional; without
  // one, the table name is what the conditions qualify columns with.
  const m = sql.match(/FROM\s+(\w+)(?:\s+(?:AS\s+)?(\w+))?\s*,\s*(\w+)(?:\s+(?:AS\s+)?(\w+))?\s+WHERE\s+([\s\S]*?)(;?\s*)$/i);
  if (!m) return sql;
  const [, table1, a1, table2, a2, whereBody] = m;
  const alias1 = a1 ?? table1;
  const alias2 = a2 ?? table2;
  const conditions = whereBody.split(/\s+AND\s+/i);
  const joinIdx = conditions.findIndex((c) => c.includes('(+)'));
  if (joinIdx === -1) return sql;
  // The (+) marks the side that may be missing. Find which operand carries
  // it, however it is spaced: `o.user_id(+)`, `o.user_id (+)`, or written
  // first (`o.user_id(+) = u.id`). Matching on the text right before "(+)"
  // broke on `u.id=o.user_id(+)` (no spaces) and turned the join around.
  const cond = conditions[joinIdx];
  const sides = cond.split('=');
  const optionalSide = sides.find((side) => side.includes('(+)')) ?? '';
  const optionalQualifier = optionalSide.replace(/\(\+\)/, '').trim().split('.')[0].toLowerCase();
  const optionalIsAlias2 = optionalQualifier === alias2.toLowerCase();
  const joinCond = cond.replace(/\s*\(\+\)/, '').trim();
  const drivingTable = optionalIsAlias2 ? table1 : table2;
  const drivingAlias = optionalIsAlias2 ? alias1 : alias2;
  const optionalTable = optionalIsAlias2 ? table2 : table1;
  const optionalAlias = optionalIsAlias2 ? alias2 : alias1;
  const remaining = conditions.filter((_, i) => i !== joinIdx).join(' AND ');
  const prefix = sql.slice(0, m.index);
  const as = (table: string, alias: string) => (alias === table ? table : `${table} ${alias}`);
  return (
    prefix +
    `FROM ${as(drivingTable, drivingAlias)} LEFT JOIN ${as(optionalTable, optionalAlias)} ON ${joinCond}` +
    (remaining ? ` WHERE ${remaining}` : '') +
    ';'
  );
}

// The in-browser SQL engine is sqlite3, which doesn't understand Oracle-only
// syntax -- so Oracle syntax that problems teach ((+), FETCH FIRST, NVL) is
// translated to its sqlite3 equivalent right before execution. The user
// always sees and writes Oracle syntax; only the engine input differs.
export function translateOracleSqlToSqlite(sql: string): string {
  return translateOracleOuterJoinToAnsi(sql)
    .replace(/\bNVL\s*\(/gi, 'IFNULL(')
    .replace(/\bOFFSET\s+(\d+)\s+ROWS\s+FETCH\s+(?:FIRST|NEXT)\s+(\d+)\s+ROWS?\s+ONLY\b/gi, 'LIMIT $2 OFFSET $1')
    .replace(/\bFETCH\s+(?:FIRST|NEXT)\s+(\d+)\s+ROWS?\s+ONLY\b/gi, 'LIMIT $1')
    // SQL Server's column-level `col INT FOREIGN KEY REFERENCES t(c)`; SQLite
    // only takes the bare `REFERENCES` there. The table-level form has
    // `(col)` between the two keywords, so it isn't matched.
    .replace(/\bFOREIGN\s+KEY\s+(?=REFERENCES\b)/gi, '');
}
