// The winter event's date math. All of it is Korean time, and the boundaries
// (Nov 20, Dec 1, Jan 1, Jan 15) are exactly where a UTC/KST mix-up shows up.
import { describe, it, expect } from 'vitest';
import {
  kstDate,
  isWinterDecorSeason,
  isChallengeRunning,
  challengeYear,
  longestDecemberRun,
  currentDecemberRun,
} from '../src/utils/winterEvent';

// A Korean wall-clock time as a Date.
const kst = (s: string) => new Date(`${s}+09:00`);

describe('kstDate', () => {
  it('UTC 오후 4시는 한국에서 다음 날이다', () => {
    expect(kstDate(new Date('2026-11-30T16:00:00Z'))).toBe('2026-12-01');
  });
});

describe('isWinterDecorSeason', () => {
  it('11월 20일부터 12월 31일까지다', () => {
    expect(isWinterDecorSeason(kst('2026-11-19T23:59:00'))).toBe(false);
    expect(isWinterDecorSeason(kst('2026-11-20T00:00:00'))).toBe(true);
    expect(isWinterDecorSeason(kst('2026-12-31T23:59:00'))).toBe(true);
    expect(isWinterDecorSeason(kst('2027-01-01T00:00:00'))).toBe(false);
  });
});

describe('isChallengeRunning', () => {
  it('12월에만 진행된다', () => {
    expect(isChallengeRunning(kst('2026-11-30T12:00:00'))).toBe(false);
    expect(isChallengeRunning(kst('2026-12-01T00:00:00'))).toBe(true);
  });
});

describe('challengeYear', () => {
  it('꾸미기 기간과 다음 해 1월 15일까지 카드를 보여 준다', () => {
    expect(challengeYear(kst('2026-11-25T12:00:00'))).toBe(2026);
    expect(challengeYear(kst('2027-01-15T12:00:00'))).toBe(2026);
    expect(challengeYear(kst('2027-01-16T12:00:00'))).toBeNull();
    expect(challengeYear(kst('2026-10-01T12:00:00'))).toBeNull();
  });
});

const days = ['2026-11-30', '2026-12-01', '2026-12-02', '2026-12-03', '2026-12-05', '2026-12-06'];

describe('longestDecemberRun', () => {
  it('11월 날짜는 이어 세지 않는다', () => {
    expect(longestDecemberRun(days, 2026)).toBe(3);
  });

  it('다른 해의 12월은 무시한다', () => {
    expect(longestDecemberRun(['2025-12-01', '2025-12-02'], 2026)).toBe(0);
  });
});

describe('currentDecemberRun', () => {
  it('오늘 아직 안 풀었으면 어제까지 센다', () => {
    expect(currentDecemberRun(days, kst('2026-12-07T12:00:00'))).toBe(2);
  });

  it('오늘 풀었으면 오늘까지 센다', () => {
    expect(currentDecemberRun(days, kst('2026-12-06T12:00:00'))).toBe(2);
  });

  it('어제도 안 풀었으면 끊긴다', () => {
    expect(currentDecemberRun(days, kst('2026-12-08T12:00:00'))).toBe(0);
  });
});
