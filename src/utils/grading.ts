// Output comparison rules shared by every grader (Python, JS, SQL) and by the
// verify scripts, so a script can't approve an answer the app would reject.

/**
 * Removes one pair of quotes that wraps the WHOLE text: `'hello'` -> `hello`.
 * Only for per-call values (valueMatches), and always on both sides.
 *
 * Whole-output comparison used to run `s.replace(/^['"]|['"]$/g, '')` on the
 * expected side only. That also ate a quote that merely ended the text --
 * `grade | 'BRONZE'` became `grade | 'BRONZE`, so the correct answer could
 * never match. No stored expected output is quote-wrapped
 * (tests/problem-data.test.ts checks), so whole outputs compare exactly.
 */
export function unwrapQuotes(text: string): string {
  const s = text.trim();
  if (s.length >= 2 && (s[0] === "'" || s[0] === '"') && s[s.length - 1] === s[0]) return s.slice(1, -1);
  return s;
}

/** Line endings unified and outer whitespace trimmed. */
export const cleanOutput = (text: string) => text.replace(/\r\n/g, '\n').trim();

/** Whole-output (stdout_match) comparison used by the Python and JS graders. */
export const stdoutMatches = (actual: string, expected: string) =>
  cleanOutput(actual) === cleanOutput(expected);

/**
 * SQL result text with its column-header lines lower-cased. Table and column
 * names are case-insensitive in SQL, so `SELECT Name` or `AS NAME` must not
 * fail a problem that expects `name`. Only header lines (the one above each
 * dashed rule) change; values like '사원' or an email stay exact.
 */
export function normalizeSqlHeaders(text: string): string {
  const lines = cleanOutput(text).split('\n');
  return lines.map((line, i) => (/^-{40}$/.test(lines[i + 1] ?? '') ? line.toLowerCase() : line)).join('\n');
}

/** SQL comparison: stdout_match plus case-insensitive headers. */
export const sqlOutputMatches = (actual: string, expected: string) =>
  normalizeSqlHeaders(actual) === normalizeSqlHeaders(expected);

/** Per-call (function harness) comparison: quotes unwrapped, whitespace collapsed. */
export const valueMatches = (actual: string, expected: string) =>
  unwrapQuotes(actual).replace(/\s+/g, ' ') === unwrapQuotes(expected).replace(/\s+/g, ' ');
