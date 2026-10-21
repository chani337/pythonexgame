import { describe, it, expect } from 'vitest';
import { diffOutput, visibleLines } from '../src/utils/outputDiff';

const hint = (e: string, a: string) => diffOutput(e, a).hint;

describe('diffOutput — 어디가 다른지', () => {
  it('같으면 차이 없음', () => {
    const d = diffOutput('김철수\n20', '김철수\n20');
    expect(d.firstDiff).toBeNull();
    expect(d.hint).toBeNull();
  });

  it('처음 달라지는 줄 번호', () => {
    expect(diffOutput('a\nb\nc', 'a\nX\nc').firstDiff).toBe(2);
  });

  it('끝의 빈 줄은 차이로 보지 않음 (채점기도 trim 함)', () => {
    expect(diffOutput('a\nb\n', 'a\nb').firstDiff).toBeNull();
  });

  it('출력 없음', () => {
    expect(hint('88.0', '')).toMatch(/아무것도 출력되지 않았어요/);
  });

  it('88 vs 88.0 — 정수/실수', () => {
    expect(hint('88.0', '88')).toMatch(/실수로/);
    expect(hint('88', '88.0')).toMatch(/정수로/);
  });

  it('따옴표까지 출력 (repr)', () => {
    expect(hint('김철수', "'김철수'")).toMatch(/따옴표까지/);
  });

  it('대소문자', () => {
    expect(hint('Hello', 'hello')).toMatch(/대소문자/);
  });

  it('띄어쓰기', () => {
    expect(hint('a, b', 'a,b')).toMatch(/띄어쓰기/);
  });

  it('줄 끝 공백', () => {
    expect(hint('a', 'a ')).toMatch(/줄 끝에 공백/);
  });

  it('반올림 차이', () => {
    expect(hint('6.71', '6.714')).toMatch(/반올림/);
  });

  it('줄 순서만 다름', () => {
    expect(hint('a\nb\nc', 'c\na\nb')).toMatch(/순서/);
  });

  it('줄이 더 많음 / 부족함', () => {
    expect(hint('a', 'a\nb\nc')).toMatch(/2줄 더 많아요/);
    expect(hint('a\nb', 'a')).toMatch(/1줄 부족/);
  });

  it('SQL — 조회한 열이 다름', () => {
    const rule = '-'.repeat(40);
    expect(hint(`name | dept\n${rule}\n김철수 | 개발팀`, `name | age\n${rule}\n김철수 | 20`)).toBe('조회한 열이 달라요. 기대: name, dept / 내 결과: name, age');
  });

  it('SQL — 행 개수가 다름', () => {
    const rule = '-'.repeat(40);
    expect(hint(`name\n${rule}\na\nb`, `name\n${rule}\na\nb\nc`)).toMatch(/기대 2행 \/ 내 결과 3행/);
  });

  it('원인을 특정할 수 없으면 hint 없이 줄 번호만', () => {
    const d = diffOutput('apple', 'banana');
    expect(d.firstDiff).toBe(1);
    expect(d.hint).toBeNull();
  });
});

describe('visibleLines — 긴 출력', () => {
  it('짧으면 전부', () => {
    const v = visibleLines(diffOutput('a\nb', 'a\nc'));
    expect(v.lines.length).toBe(2);
    expect(v.skippedBefore).toBe(0);
  });

  it('길면 처음 달라진 줄 주변만', () => {
    const e = Array.from({ length: 40 }, (_, i) => `row ${i}`).join('\n');
    const a = e.replace('row 30', 'row X');
    const v = visibleLines(diffOutput(e, a));
    expect(v.lines.some((l) => l.n === 31 && !l.same)).toBe(true);
    expect(v.skippedBefore).toBeGreaterThan(0);
    expect(v.lines.length).toBeLessThanOrEqual(12);
  });
});
