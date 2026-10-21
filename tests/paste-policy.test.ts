import { describe, it, expect } from 'vitest';
import { isShortPaste, SHORT_PASTE_MAX } from '../src/utils/pastePolicy';

describe('붙여넣기 — 문제 편집기', () => {
  it('한 줄짜리 짧은 내용은 허용', () => {
    expect(isShortPaste('total_score')).toBe(true);
    expect(isShortPaste("df['수학'].mean()")).toBe(true);
    expect(isShortPaste('x'.repeat(SHORT_PASTE_MAX))).toBe(true);
  });

  it('길거나 여러 줄이면 막음', () => {
    expect(isShortPaste('x'.repeat(SHORT_PASTE_MAX + 1))).toBe(false);
    expect(isShortPaste('a = 1\nprint(a)')).toBe(false);
    expect(isShortPaste('a = 1\r\n')).toBe(false);
  });
});
