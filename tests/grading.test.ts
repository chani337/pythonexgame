import { describe, it, expect } from 'vitest';
import { unwrapQuotes, stdoutMatches, sqlOutputMatches, sqlOrderMatters, valueMatches } from '../src/utils/grading';

describe('채점 비교 규칙', () => {
  it('전체를 감싼 따옴표 한 쌍만 벗긴다', () => {
    expect(unwrapQuotes("'hello'")).toBe('hello');
    expect(unwrapQuotes('"hello"')).toBe('hello');
    expect(unwrapQuotes("hello")).toBe('hello');
  });

  it('끝에만 있는 따옴표는 건드리지 않는다 (SQL 실무 44 버그)', () => {
    // The old rule turned this into "... 'BRONZE" and no answer could match.
    const expected = "name | dflt_value\n----------------------------------------\nid | NULL\nname | NULL\ngrade | 'BRONZE'";
    expect(sqlOutputMatches(expected, expected)).toBe(true);
    // Quotes that are part of the output compare exactly, at either end.
    expect(stdoutMatches("'a' and 'b'", "'a' and 'b'")).toBe(true);
    expect(stdoutMatches("'김철수'", '김철수')).toBe(false);
  });

  it('stdout: 줄바꿈 방식과 앞뒤 공백은 무시, 내용은 정확히', () => {
    expect(stdoutMatches('김철수\r\n20\n', '김철수\n20')).toBe(true);
    expect(stdoutMatches('김철수\n21', '김철수\n20')).toBe(false);
  });

  it('SQL: 열 이름 줄은 대소문자 무시, 값은 정확히', () => {
    const rule = '-'.repeat(40);
    expect(sqlOutputMatches(`NAME | Position\n${rule}\n김철수 | 팀장`, `name | position\n${rule}\n김철수 | 팀장`)).toBe(true);
    expect(sqlOutputMatches(`name\n${rule}\nTEMP@company.com`, `name\n${rule}\ntemp@company.com`)).toBe(false);
  });

  it('SQL: 정렬을 요구하지 않는 문제는 행 순서 무시', () => {
    const rule = '-'.repeat(40);
    const a = `name | score\n${rule}\n김철수 | 90\n이영희 | 95`;
    const b = `name | score\n${rule}\n이영희 | 95\n김철수 | 90`;
    expect(sqlOutputMatches(a, b, true)).toBe(true);
    expect(sqlOutputMatches(a, b)).toBe(false);
    // Rows are still compared as a multiset: a missing or extra row fails.
    expect(sqlOutputMatches(a, `name | score\n${rule}\n김철수 | 90\n김철수 | 90`, true)).toBe(false);
    // The header stays on top -- it's not sorted in with the rows.
    expect(sqlOutputMatches(`score | name\n${rule}\n90 | 김철수`, `name | score\n${rule}\n90 | 김철수`, true)).toBe(false);
    expect(sqlOrderMatters('SELECT name FROM users;')).toBe(false);
    expect(sqlOrderMatters('select name from users order  by name;')).toBe(true);
    expect(sqlOrderMatters(undefined)).toBe(true);
  });

  it('함수 결과: 따옴표 한 쌍과 공백 차이 무시', () => {
    expect(valueMatches("'abc'", 'abc')).toBe(true);
    expect(valueMatches('[1,  2]', '[1, 2]')).toBe(true);
    expect(valueMatches('[1, 3]', '[1, 2]')).toBe(false);
  });
});
