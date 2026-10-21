// Explains why an output-graded answer was marked wrong.
//
// The graders compare the whole output as one string, so a failed run used
// to say only "TEST 1 FAIL". Most wrong answers are nearly right -- one
// line, a trailing ".0", quotes from printing a repr, a missing space -- and
// without being told where, a student re-reads correct code looking for a
// bug that isn't there.
//
// Pure functions, no DOM: ProblemWorkspace renders the result, and
// tests/output-diff.test.ts pins each hint to the case that triggers it.

export interface DiffLine {
  /** 1-based line number. */
  n: number;
  expected: string | null;
  actual: string | null;
  same: boolean;
}

export interface OutputDiff {
  lines: DiffLine[];
  /** 1-based number of the first differing line, or null if identical. */
  firstDiff: number | null;
  /** A short Korean explanation of the most likely cause, when one fits. */
  hint: string | null;
}

const NUM = /^-?\d+(\.\d+)?$/;

// The most specific explanation for one pair of differing lines.
function explainLine(expected: string, actual: string): string | null {
  if (expected.toLowerCase() === actual.toLowerCase()) {
    return '대소문자가 달라요.';
  }
  if (expected.replace(/\s+/g, '') === actual.replace(/\s+/g, '')) {
    if (expected.trimEnd() === actual.trimEnd()) return '줄 끝에 공백이 있어요.';
    return '띄어쓰기(공백)가 달라요.';
  }
  const unquote = (s: string) => s.replace(/^(['"])(.*)\1$/, '$2');
  if (unquote(actual) === expected && actual !== expected) {
    return '따옴표까지 출력됐어요. 문자열 값만 출력되게 해 보세요.';
  }
  if (unquote(expected) === actual && actual !== expected) {
    return '따옴표가 빠졌어요.';
  }
  if (NUM.test(expected) && NUM.test(actual) && Number(expected) === Number(actual)) {
    return expected.includes('.')
      ? `값은 맞지만 소수점 표시가 달라요. ${expected} 처럼 실수로 출력해야 해요.`
      : `값은 맞지만 소수점 표시가 달라요. ${expected} 처럼 정수로 출력해야 해요.`;
  }
  if (NUM.test(expected) && NUM.test(actual)) {
    const e = Number(expected);
    const a = Number(actual);
    if (Math.abs(e - a) < Math.max(1e-6, Math.abs(e) * 0.01)) {
      return '값이 아주 조금 달라요. 반올림 자릿수를 확인해 보세요.';
    }
  }
  return null;
}

export function diffOutput(expectedRaw: string, actualRaw: string): OutputDiff {
  const split = (s: string) => s.replace(/\r\n/g, '\n').replace(/\n+$/, '').split('\n');
  const expected = expectedRaw.trim() === '' ? [] : split(expectedRaw);
  const actual = actualRaw.trim() === '' ? [] : split(actualRaw);

  const len = Math.max(expected.length, actual.length);
  const lines: DiffLine[] = [];
  for (let i = 0; i < len; i++) {
    const e = i < expected.length ? expected[i] : null;
    const a = i < actual.length ? actual[i] : null;
    lines.push({ n: i + 1, expected: e, actual: a, same: e === a });
  }
  const first = lines.find((l) => !l.same);
  const firstDiff = first ? first.n : null;

  let hint: string | null = null;
  if (firstDiff !== null) {
    if (actual.length === 0) {
      hint = '아무것도 출력되지 않았어요. 결과를 print 했는지 확인해 보세요.';
    } else if (expected.length === actual.length && [...expected].sort().join('\n') === [...actual].sort().join('\n')) {
      hint = '내용은 같지만 줄 순서가 달라요.';
    } else if (isSqlTable(expected) && isSqlTable(actual) && expected[0] !== actual[0]) {
      // SQL results are "col | col" over a dashed rule (useSqlRunner's text
      // form). A different header means different columns were selected --
      // the most common SQL mistake, and nothing below line 1 matters yet.
      hint = `조회한 열이 달라요. 기대: ${cols(expected[0])} / 내 결과: ${cols(actual[0])}`;
    } else if (isSqlTable(expected) && isSqlTable(actual) && expected.length !== actual.length) {
      hint = `행 개수가 달라요. 기대 ${expected.length - 2}행 / 내 결과 ${actual.length - 2}행 — WHERE 조건을 확인해 보세요.`;
    } else if (first && first.expected !== null && first.actual !== null) {
      hint = explainLine(first.expected, first.actual);
      if (!hint && expected.length !== actual.length) hint = lineCountHint(expected.length, actual.length);
    } else {
      hint = lineCountHint(expected.length, actual.length);
    }
  }
  return { lines, firstDiff, hint };
}

const isSqlTable = (lines: string[]) => lines.length >= 2 && /^-{3,}$/.test(lines[1]);
const cols = (header: string) => header.split(' | ').join(', ');

function lineCountHint(expected: number, actual: number): string {
  return actual > expected
    ? `출력이 ${actual - expected}줄 더 많아요. 필요 없는 print 가 남아 있지 않은지 확인해 보세요.`
    : `출력이 ${expected - actual}줄 부족해요.`;
}

/**
 * The lines worth showing: everything for short outputs, otherwise a window
 * around the first difference, so a 40-line table doesn't bury it.
 */
export function visibleLines(diff: OutputDiff, context = 3, max = 12): { lines: DiffLine[]; skippedBefore: number; skippedAfter: number } {
  if (diff.lines.length <= max || diff.firstDiff === null) {
    return { lines: diff.lines.slice(0, Math.max(max, diff.lines.length)), skippedBefore: 0, skippedAfter: 0 };
  }
  const start = Math.max(0, diff.firstDiff - 1 - context);
  const end = Math.min(diff.lines.length, start + max);
  return { lines: diff.lines.slice(start, end), skippedBefore: start, skippedAfter: diff.lines.length - end };
}
