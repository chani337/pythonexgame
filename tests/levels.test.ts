// XP, levels and tiers. The weights live twice -- here for the dashboard and
// in migrations/003_xp.sql for the ranking -- so the main job of this file is
// keeping the two from drifting apart.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { CHOICE_XP, CODING_XP, TIERS, levelFor, levelStartXp, nextTier, problemXp, tierFor, totalXp } from '../src/utils/levels';
import { problems } from '../src/data/problems';

describe('XP 가중치', () => {
  const sql = readFileSync(new URL('../migrations/003_xp.sql', import.meta.url), 'utf8');

  it('서버 problem_xp 와 같다', () => {
    for (const [difficulty, xp] of Object.entries(CODING_XP)) {
      expect(sql).toMatch(new RegExp(`WHEN p_difficulty = '${difficulty}'\\s+THEN ${xp}\\b`));
    }
    expect(sql).toMatch(new RegExp(`WHEN p_type <> 'coding'\\s+THEN ${CHOICE_XP}\\b`));
  });

  it('코딩은 난이도별, 퀴즈 · 빈칸은 고정', () => {
    expect(problemXp({ type: 'coding', difficulty: 'expert' })).toBe(80);
    expect(problemXp({ type: 'quiz', difficulty: 'expert' })).toBe(5);
    expect(problemXp({ type: 'fill', difficulty: 'basic' })).toBe(5);
  });

  it('푼 문제만 더하고, 없는 id 는 무시한다', () => {
    const coding = problems.find((p) => p.type === 'coding' && p.difficulty === 'basic')!;
    expect(totalXp(problems, [coding.id, 'no_such_problem'])).toBe(10);
    expect(totalXp(problems, [])).toBe(0);
  });
});

describe('레벨', () => {
  it('0 XP 는 Lv.1, 첫 퀴즈(5 XP)로 Lv.2', () => {
    expect(levelFor(0)).toBe(1);
    expect(levelFor(4)).toBe(1);
    expect(levelFor(5)).toBe(2);
  });

  it('각 레벨의 시작 XP 에서 정확히 오른다', () => {
    for (let level = 1; level <= 60; level++) {
      expect(levelFor(levelStartXp(level))).toBe(level);
      if (level > 1) expect(levelFor(levelStartXp(level) - 1)).toBe(level - 1);
    }
  });
});

describe('등급', () => {
  it('경계에서 바뀐다', () => {
    expect(tierFor(0).id).toBe('bronze');
    expect(tierFor(199).id).toBe('bronze');
    expect(tierFor(200).id).toBe('silver');
    expect(tierFor(7000).id).toBe('master');
  });

  it('오름차순이고, 마스터 다음은 없다', () => {
    for (let i = 1; i < TIERS.length; i++) expect(TIERS[i].minXp).toBeGreaterThan(TIERS[i - 1].minXp);
    expect(nextTier(TIERS[TIERS.length - 1])).toBeNull();
    expect(nextTier(TIERS[0])?.id).toBe('silver');
  });

  it('전부 풀면 최고 등급에 닿는다', () => {
    const all = totalXp(problems, problems.map((p) => p.id));
    expect(tierFor(all).id).toBe('master');
  });
});
