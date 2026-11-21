// The snowball fight's rules that aren't drawing: the difficulty ramp and
// the score for a hit.
import { describe, it, expect } from 'vitest';
import { difficultyAt, hitScore, GOLDEN_POINTS, HIT_POINTS, MAX_COMBO_MULTIPLIER } from '../src/utils/snowballGame';

describe('difficultyAt', () => {
  it('시작은 한 명씩, 느리게', () => {
    const d = difficultyAt(0);
    expect(d.maxUp).toBe(1);
    expect(d.ballSpeed).toBe(230);
  });

  it('시간이 갈수록 어려워지고 2분에서 멈춘다', () => {
    const a = difficultyAt(30);
    const b = difficultyAt(90);
    expect(b.ballSpeed).toBeGreaterThan(a.ballSpeed);
    expect(b.windup).toBeLessThan(a.windup);
    expect(difficultyAt(120)).toEqual(difficultyAt(600));
    expect(difficultyAt(120).maxUp).toBe(4);
  });

  it('음수 시간은 0 으로 본다', () => {
    expect(difficultyAt(-5)).toEqual(difficultyAt(0));
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
