import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import {
  addDays,
  classAverage,
  CODE_PATTERN,
  contestPhase,
  daysBetween,
  displayNames,
  finalWinner,
  gaugeShares,
  leadingClass,
  normalizeCode,
  relativeDay,
  roundOf,
  rosterCsv,
  studentStats,
} from '../src/utils/contest';
import type { ContestClass, Roster } from '../src/utils/contest';

const cls = (over: Partial<ContestClass>): ContestClass => ({
  id: 'x', name: 'x', teacher_name: null, capacity: null, participants: 1, denominator: 1,
  solved: 0, stars: 0, cheer: null, today_solvers: 0, round_wins: 0, mvp: null, growth: null, ...over,
});

describe('게이지', () => {
  it('기획안 예시: 22명 330문제 대 28명 364문제 → 53.6 : 46.4', () => {
    const [a, b] = gaugeShares([
      { solved: 330, denominator: 22 },
      { solved: 364, denominator: 28 },
    ]);
    expect(a.toFixed(1)).toBe('53.6');
    expect(b.toFixed(1)).toBe('46.4');
  });

  it('아무도 안 풀었으면 50 : 50', () => {
    expect(gaugeShares([{ solved: 0, denominator: 20 }, { solved: 0, denominator: 25 }])).toEqual([50, 50]);
  });

  it('평균은 풀이 수 / 인원', () => {
    expect(classAverage({ solved: 30, denominator: 20 })).toBe(1.5);
  });

  it('앞선 반: 동점이면 없음', () => {
    const a = cls({ id: 'a', solved: 10, denominator: 5 });
    const b = cls({ id: 'b', solved: 4, denominator: 2 });
    expect(leadingClass([a, b])).toBeNull();
    expect(leadingClass([a, cls({ id: 'c', solved: 1 })])?.id).toBe('a');
  });

  it('최종 승부: 평균이 같으면 라운드 승수로', () => {
    const a = cls({ id: 'a', solved: 10, denominator: 5, round_wins: 1 });
    const b = cls({ id: 'b', solved: 4, denominator: 2, round_wins: 3 });
    expect(finalWinner([a, b])?.id).toBe('b');
    expect(finalWinner([{ ...a, round_wins: 3 }, b])).toBeNull();
  });
});

describe('대회 기간', () => {
  const c = { starts_on: '2027-01-04', ends_on: '2027-01-31' };

  it('시작 전 / 진행 / 종료', () => {
    expect(contestPhase({ ...c, today: '2027-01-03' })).toBe('upcoming');
    expect(contestPhase({ ...c, today: '2027-01-04' })).toBe('running');
    expect(contestPhase({ ...c, today: '2027-01-31' })).toBe('running');
    expect(contestPhase({ ...c, today: '2027-02-01' })).toBe('finished');
  });

  it('라운드는 7일씩', () => {
    expect(roundOf(c, '2027-01-04')).toBe(1);
    expect(roundOf(c, '2027-01-10')).toBe(1);
    expect(roundOf(c, '2027-01-11')).toBe(2);
    expect(roundOf(c, '2027-01-31')).toBe(4);
    expect(roundOf(c, '2027-03-01')).toBe(4);
  });

  it('날짜 계산', () => {
    expect(daysBetween('2026-12-31', '2027-01-04')).toBe(4);
    expect(addDays('2026-12-30', 3)).toBe('2027-01-02');
  });
});

describe('코드', () => {
  it('대소문자 · 공백 · 하이픈을 무시한다', () => {
    expect(normalizeCode(' py-7k2a ')).toBe('PY7K2A');
  });

  it('헷갈리는 글자는 코드에 없다', () => {
    expect(CODE_PATTERN.test('PY7K2A')).toBe(true);
    expect(CODE_PATTERN.test('PY0K2A')).toBe(false);
    expect(CODE_PATTERN.test('PYIK2A')).toBe(false);
    expect(CODE_PATTERN.test('PYLK2A')).toBe(false);
  });

  it('서버의 코드 글자표와 같다', () => {
    const sql = fs.readFileSync('migrations/005_contest.sql', 'utf8');
    const alphabet = sql.match(/alphabet CONSTANT TEXT := '([A-Z0-9]+)'/)![1];
    for (const ch of alphabet) expect(CODE_PATTERN.test(ch.repeat(6)), ch).toBe(true);
    expect(alphabet.length).toBe(31);
  });
});

describe('담임 화면 학생 통계', () => {
  const contest = { starts_on: '2027-01-04', ends_on: '2027-01-31', today: '2027-01-13' };
  // 12:00 KST on a given day
  const at = (day: string, min = 0) => new Date(Date.parse(`${day}T03:00:00Z`) + min * 60_000).toISOString();

  it('오늘 · 이번 라운드 · 누적 · 연속', () => {
    const st = studentStats(
      [
        { problem_id: 'a', solved_at: at('2027-01-05') },
        { problem_id: 'b', solved_at: at('2027-01-11') },
        { problem_id: 'c', solved_at: at('2027-01-12') },
        { problem_id: 'd', solved_at: at('2027-01-13') },
        { problem_id: 'e', solved_at: at('2027-01-13', 5) },
      ],
      contest
    );
    expect(st).toMatchObject({ today: 2, round: 4, total: 5, streak: 3, status: '활발', burst: false });
  });

  it('오늘 아직 안 풀었으면 어제까지의 연속을 보여 준다', () => {
    const st = studentStats([{ problem_id: 'a', solved_at: at('2027-01-12') }], contest);
    expect(st.streak).toBe(1);
    expect(st.status).toBe('쉬는 중');
  });

  it('3일 이상 안 풀었거나 하나도 없으면 독려 필요', () => {
    expect(studentStats([{ problem_id: 'a', solved_at: at('2027-01-10') }], contest).status).toBe('독려 필요');
    expect(studentStats([], contest).status).toBe('독려 필요');
  });

  it('1분 안에 10문제 이상은 확인 필요', () => {
    const solves = Array.from({ length: 10 }, (_, i) => ({ problem_id: `p${i}`, solved_at: at('2027-01-13', 0) }));
    expect(studentStats(solves, contest).status).toBe('확인 필요');
  });

  it('같은 이름은 들어온 순서대로 (2), (3)', () => {
    const names = displayNames([
      { user_id: 'u2', real_name: '김민수', joined_at: '2027-01-02T00:00:00Z' },
      { user_id: 'u1', real_name: '김민수', joined_at: '2027-01-01T00:00:00Z' },
      { user_id: 'u3', real_name: '이서연', joined_at: '2027-01-01T00:00:00Z' },
    ]);
    expect(names.get('u1')).toBe('김민수');
    expect(names.get('u2')).toBe('김민수(2)');
    expect(names.get('u3')).toBe('이서연');
  });

  it('마지막 풀이 표시', () => {
    expect(relativeDay(at('2027-01-13'), '2027-01-13')).toBe('오늘 12:00');
    expect(relativeDay(at('2027-01-12'), '2027-01-13')).toBe('어제');
    expect(relativeDay(at('2027-01-10'), '2027-01-13')).toBe('3일 전');
    expect(relativeDay(null, '2027-01-13')).toBe('—');
  });

  it('CSV: BOM, 머리글, 쉼표가 든 값은 따옴표', () => {
    const roster: Roster = {
      class: { id: 'c', name: '1반', teacher_name: null, capacity: null, cheer: null, student_code: 'PY7K2A' },
      contest: { id: 'k', name: '대항전', ...contest },
      students: [{ user_id: 'u', real_name: '김,민수', display_name: 'nick', joined_at: '2027-01-01T00:00:00Z', solves: [], review_count: 2, answer_views: 1 }],
    };
    const csv = rosterCsv(roster);
    expect(csv.startsWith('﻿이름,닉네임,오늘')).toBe(true);
    expect(csv).toContain('"김,민수",nick,0,0,0,0,,독려 필요,1,2');
  });
});
