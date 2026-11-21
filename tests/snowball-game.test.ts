// The snowball fight's rules that aren't drawing: the difficulty ramp and
// the score for a hit.
import { describe, it, expect } from 'vitest';
import { bossHp, bossScore, difficultyAt, hitScore, GOLDEN_POINTS, HIT_POINTS, MAX_COMBO_MULTIPLIER } from '../src/utils/snowballGame';

describe('difficultyAt', () => {
  it('처음부터 두 명', () => {
    expect(difficultyAt(0).maxUp).toBe(2);
    expect(difficultyAt(0).ballSpeed).toBe(240);
  });

  it('시간이 갈수록 어려워지고 90초에서 멈춘다', () => {
    const a = difficultyAt(20);
    const b = difficultyAt(70);
    expect(b.ballSpeed).toBeGreaterThan(a.ballSpeed);
    expect(b.windup).toBeLessThan(a.windup);
    expect(difficultyAt(90)).toEqual(difficultyAt(600));
    expect(difficultyAt(90).maxUp).toBe(5);
  });

  it('음수 시간은 0 으로 본다', () => {
    expect(difficultyAt(-5)).toEqual(difficultyAt(0));
  });
});

describe('보스', () => {
  it('뒤에 나올수록 튼튼하고 점수도 크다', () => {
    expect(bossHp(1)).toBe(12);
    expect(bossHp(3)).toBe(22);
    expect(bossScore(2)).toBeGreaterThan(bossScore(1));
  });
});

describe('hitScore', () => {
  it('콤보 3번마다 배수가 오르고 최대 5배', () => {
    expect(hitScore(0, false)).toBe(HIT_POINTS);
    expect(hitScore(2, false)).toBe(HIT_POINTS);
    expect(hitScore(3, false)).toBe(HIT_POINTS * 2);
    expect(hitScore(100, false)).toBe(HIT_POINTS * MAX_COMBO_MULTIPLIER);
  });

  it('황금 눈사람은 50점부터', () => {
    expect(hitScore(0, true)).toBe(GOLDEN_POINTS);
  });
});
