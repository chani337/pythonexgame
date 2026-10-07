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
export function translateOracleSqlToSqlite(sql: string): string {
  return translateOracleOuterJoinToAnsi(sql)
    .replace(/\bNVL\s*\(/gi, 'IFNULL(')
    .replace(/\bOFFSET\s+(\d+)\s+ROWS\s+FETCH\s+(?:FIRST|NEXT)\s+(\d+)\s+ROWS?\s+ONLY\b/gi, 'LIMIT $2 OFFSET $1')
    .replace(/\bFETCH\s+(?:FIRST|NEXT)\s+(\d+)\s+ROWS?\s+ONLY\b/gi, 'LIMIT $1');
}
