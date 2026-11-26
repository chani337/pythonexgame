// The snowball fight's rules that aren't drawing: the difficulty ramp and
// the score for a hit.
import { describe, it, expect } from 'vitest';
import { bossHp, bossScore, difficultyAt, gameLockedUntil, hitScore, GOLDEN_POINTS, HIT_POINTS, MAX_COMBO_MULTIPLIER } from '../src/utils/snowballGame';

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

describe('수업 시간 잠금 (한국 시간)', () => {
  const kst = (hhmm: string) => new Date(`2026-12-01T${hhmm}:00+09:00`);

  it('오전 수업: 09:00 부터 12:50 전까지', () => {
    expect(gameLockedUntil(kst('08:59'))).toBeNull();
    expect(gameLockedUntil(kst('09:00'))).toBe('12:50');
    expect(gameLockedUntil(kst('12:49'))).toBe('12:50');
    expect(gameLockedUntil(kst('12:50'))).toBeNull();
  });

  it('오후 수업: 14:10 부터 17:51 전까지', () => {
    expect(gameLockedUntil(kst('14:09'))).toBeNull();
    expect(gameLockedUntil(kst('14:10'))).toBe('17:51');
    expect(gameLockedUntil(kst('17:50'))).toBe('17:51');
    expect(gameLockedUntil(kst('17:51'))).toBeNull();
  });

  it('주말에는 하루 종일 열려 있다', () => {
    expect(gameLockedUntil(new Date('2026-12-05T10:00:00+09:00'))).toBeNull(); // 토
    expect(gameLockedUntil(new Date('2026-12-06T15:00:00+09:00'))).toBeNull(); // 일
    expect(gameLockedUntil(new Date('2026-12-07T10:00:00+09:00'))).toBe('12:50'); // 월
  });

  it('요일도 한국 시간으로 본다', () => {
    // 2026-12-07 01:00 UTC = 월 10:00 KST -- 잠김
    expect(gameLockedUntil(new Date('2026-12-07T01:00:00Z'))).toBe('12:50');
    // 2026-12-05 (토) 01:00 UTC = 토 10:00 KST -- 주말이라 열림
    expect(gameLockedUntil(new Date('2026-12-05T01:00:00Z'))).toBeNull();
  });

  it('브라우저 시간대와 상관없이 한국 시간으로 본다', () => {
    // 00:30 UTC = 09:30 KST
    expect(gameLockedUntil(new Date('2026-12-01T00:30:00Z'))).toBe('12:50');
  });
});
