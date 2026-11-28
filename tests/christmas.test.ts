import { describe, expect, it } from 'vitest';
import { GIFT_PROBLEM_IDS, ornamentCount, treeYear } from '../src/utils/christmasTree';
import { filterProblems, isProblemOpen, problems } from '../src/data/problems';
import { solutionCode } from '../src/data/solutionCode';

const kst = (s: string) => new Date(`${s}+09:00`);

describe('모두의 트리', () => {
  it('12/21 ~ 12/25 (한국 시간)에만 보인다', () => {
    expect(treeYear(kst('2026-12-20T23:59:00'))).toBeNull();
    expect(treeYear(kst('2026-12-21T00:00:00'))).toBe(2026);
    expect(treeYear(kst('2026-12-25T23:59:00'))).toBe(2026);
    expect(treeYear(kst('2026-12-26T00:00:00'))).toBeNull();
    // 12/20 15:00 UTC = 12/21 00:00 KST
    expect(treeYear(new Date('2026-12-20T15:00:00Z'))).toBe(2026);
  });

  it('장식 수는 자리 수까지', () => {
    expect(ornamentCount(0, 30)).toBe(0);
    expect(ornamentCount(12, 30)).toBe(12);
    expect(ornamentCount(99, 30)).toBe(30);
  });
});

describe('크리스마스 선물 문제', () => {
  const gifts = GIFT_PROBLEM_IDS.map((id) => problems.find((p) => p.id === id)!);

  it('두 문제가 있고 정답 코드가 있다', () => {
    expect(gifts.every(Boolean)).toBe(true);
    for (const g of gifts) expect(solutionCode[g.id], g.id).toBeTruthy();
  });

  it('24일, 25일에 열린다', () => {
    expect(gifts.map((g) => g.opensOn)).toEqual(['2026-12-24', '2026-12-25']);
    expect(isProblemOpen(gifts[0], kst('2026-12-23T23:59:00'))).toBe(false);
    expect(isProblemOpen(gifts[0], kst('2026-12-24T00:00:00'))).toBe(true);
    expect(isProblemOpen(gifts[1], kst('2026-12-24T12:00:00'))).toBe(false);
  });

  it('열리기 전에는 목록에 없다', () => {
    const ids = filterProblems(problems, {}).map((p) => p.id);
    const today = new Date(Date.now() + 9 * 3600_000).toISOString().slice(0, 10);
    for (const g of gifts) expect(ids.includes(g.id)).toBe(today >= g.opensOn!);
  });

  it('여는 날이 없는 문제는 언제나 열려 있다', () => {
    expect(isProblemOpen({})).toBe(true);
  });
});
