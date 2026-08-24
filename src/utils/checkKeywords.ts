// Bare-word tokens need a word-boundary match -- a plain substring check
// would make e.g. "in" trivially match inside "print" or "join", or "or"
// inside "for", defeating the check for almost any real code.
const BARE_WORDS = new Set([
  'for', 'while', 'if', 'elif', 'else', 'def', 'class', 'try', 'except', 'finally', 'raise',
  'lambda', 'return', 'import', 'and', 'or', 'not', 'in', 'is', 'pass', 'super', 'isinstance',
  'break', 'continue', 'yield', 'with', 'as', 'global', 'nonlocal', 'assert', 'del',
]);

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function tokenPresent(token: string, code: string): boolean {
  if (BARE_WORDS.has(token)) {
    return new RegExp(`\\b${escapeRegExp(token)}\\b`).test(code);
  }
  return code.includes(token);
}

export interface KeywordCheckResult {
  ok: boolean;
  missingRequired: string[];
  presentForbidden: string[];
}

// Only checks the raw submitted code text -- deliberately simple (no AST),
// so it's a speed bump against the most obvious "just print the answer"
// shortcut, not a full plagiarism/correctness detector.
export function checkKeywords(code: string, required: string[] = [], forbidden: string[] = []): KeywordCheckResult {
  const missingRequired = required.filter((tok) => !tokenPresent(tok, code));
  const presentForbidden = forbidden.filter((tok) => tokenPresent(tok, code));
  return {
    ok: missingRequired.length === 0 && presentForbidden.length === 0,
    missingRequired,
    presentForbidden,
  };
}
