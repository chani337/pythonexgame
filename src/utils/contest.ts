// 과정 대항전: the shapes the contest RPCs return (migrations/005_contest.sql)
// and the arithmetic the screens do on them. Pure, so tests can check it
// without a database.
import { kstDate } from './winterEvent';

export interface ContestInfo {
  id: string;
  name: string;
  starts_on: string; // YYYY-MM-DD, Korean time
  ends_on: string; // inclusive
  today: string; // the server's Korean date
  rounds: number;
  round_now: number; // 0 before the start
  languages: string[];
  difficulties: string[];
}

export interface ContestClass {
  id: string;
  name: string;
  teacher_name: string | null;
  capacity: number | null;
  participants: number;
  // 정원 if the teacher set one, else the number who joined (at least 1).
  denominator: number;
  solved: number;
  stars: number;
  cheer: string | null;
  today_solvers: number;
  round_wins: number;
  mvp: { name: string; solved: number } | null;
  growth: { name: string; gain: number } | null;
}

export interface ContestRound {
  round: number;
  start: string;
  end: string;
  finished: boolean;
  winner: string | null; // class id; null for a tie or before the end
  avgs: Record<string, number>;
}

export interface ContestDay {
  day: string;
  avgs: Record<string, number>; // cumulative per-head average by class id
}

export interface ContestMine {
  class_id: string | null;
  solved: number;
  solved_today: number;
  teacher_class_ids: string[];
}

export interface ContestBoard {
  contest: ContestInfo;
  classes: ContestClass[];
  rounds: ContestRound[];
  daily: ContestDay[];
  mine: ContestMine | null;
}

// Two classes is the plan; a third gets the next color.
export const CLASS_COLORS = ['#0969da', '#d4500b', '#1a7f37', '#8250df'];

export const ROUND_DAYS = 7;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Whole days from a to b (YYYY-MM-DD). */
export function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / DAY_MS);
}

export function addDays(day: string, n: number): string {
  return new Date(Date.parse(`${day}T00:00:00Z`) + n * DAY_MS).toISOString().slice(0, 10);
}

export type ContestPhase = 'upcoming' | 'running' | 'finished';

export function contestPhase(c: Pick<ContestInfo, 'starts_on' | 'ends_on' | 'today'>): ContestPhase {
  if (c.today < c.starts_on) return 'upcoming';
  if (c.today <= c.ends_on) return 'running';
  return 'finished';
}

/** New problems per head. */
export function classAverage(c: Pick<ContestClass, 'solved' | 'denominator'>): number {
  return c.denominator > 0 ? c.solved / c.denominator : 0;
}

/**
 * Each class's share of the gauge, in percent, summing to 100: the averages
 * divided by their total. Before anyone solves it's an even split.
 */
export function gaugeShares(classes: Pick<ContestClass, 'solved' | 'denominator'>[]): number[] {
  const avgs = classes.map(classAverage);
  const sum = avgs.reduce((a, b) => a + b, 0);
  if (sum === 0) return classes.map(() => 100 / Math.max(classes.length, 1));
  return avgs.map((a) => (a / sum) * 100);
}

/** The class strictly ahead on average, or null when tied (or nobody has solved). */
export function leadingClass<T extends Pick<ContestClass, 'solved' | 'denominator'>>(classes: T[]): T | null {
  let best: T | null = null;
  let tie = false;
  for (const c of classes) {
    const avg = classAverage(c);
    if (!best || avg > classAverage(best)) {
      best = c;
      tie = false;
    } else if (avg === classAverage(best)) {
      tie = true;
    }
  }
  return best && !tie && classAverage(best) > 0 ? best : null;
}

/** The champion: highest average; round wins break a tie (기획안: 최종 승부). */
export function finalWinner(classes: ContestClass[]): ContestClass | null {
  const top = leadingClass(classes);
  if (top) return top;
  const bestAvg = Math.max(...classes.map(classAverage));
  const tied = classes.filter((c) => classAverage(c) === bestAvg);
  const mostWins = Math.max(...tied.map((c) => c.round_wins));
  const byWins = tied.filter((c) => c.round_wins === mostWins);
  return bestAvg > 0 && byWins.length === 1 ? byWins[0] : null;
}

// ---- codes ------------------------------------------------------------------

// What the server generates: six characters, no 0/O/1/I/L.
export const CODE_PATTERN = /^[A-HJKMNP-Z2-9]{6}$/;

/** "py-7k2a " → "PY7K2A", the same way the server reads a code. */
export function normalizeCode(raw: string): string {
  return raw.replace(/[\s-]/g, '').toUpperCase();
}

export function joinLink(code: string, origin: string = window.location.origin): string {
  return `${origin}/join/${code}`;
}

// ---- the teacher's roster ----------------------------------------------------

export interface RosterSolve {
  problem_id: string;
  solved_at: string;
}

export interface RosterStudent {
  user_id: string;
  real_name: string;
  display_name: string;
  joined_at: string;
  solves: RosterSolve[];
  review_count: number;
  answer_views: number;
}

export interface Roster {
  class: { id: string; name: string; teacher_name: string | null; capacity: number | null; cheer: string | null; student_code: string };
  contest: { id: string; name: string; starts_on: string; ends_on: string; today: string };
  students: RosterStudent[];
}

export type StudentStatus = '활발' | '쉬는 중' | '독려 필요' | '확인 필요';

export interface StudentStats {
  today: number;
  round: number;
  total: number;
  streak: number;
  lastAt: string | null;
  // Ten or more solves inside one minute: worth a look, never removed automatically.
  burst: boolean;
  status: StudentStatus;
}

/** Which round `day` falls in (1-based), clamped to the contest. */
export function roundOf(contest: Pick<ContestInfo, 'starts_on' | 'ends_on'>, day: string): number {
  const last = Math.floor(daysBetween(contest.starts_on, contest.ends_on) / ROUND_DAYS) + 1;
  const n = Math.floor(daysBetween(contest.starts_on, day) / ROUND_DAYS) + 1;
  return Math.min(Math.max(n, 1), last);
}

export const BURST_SOLVES = 10;

export function studentStats(
  solves: RosterSolve[],
  contest: Pick<Roster['contest'], 'starts_on' | 'ends_on' | 'today'>
): StudentStats {
  const { today } = contest;
  const days = solves.map((s) => kstDate(new Date(s.solved_at)));
  const daySet = new Set(days);
  const round = roundOf(contest, today > contest.ends_on ? contest.ends_on : today);
  const roundStart = addDays(contest.starts_on, (round - 1) * ROUND_DAYS);
  const roundEnd = addDays(roundStart, ROUND_DAYS - 1);

  // Today, or up to yesterday when today has nothing yet -- so a streak
  // doesn't read 0 every morning.
  let streak = 0;
  let day = daySet.has(today) ? today : addDays(today, -1);
  while (day >= contest.starts_on && daySet.has(day)) {
    streak++;
    day = addDays(day, -1);
  }

  const times = solves.map((s) => Date.parse(s.solved_at)).sort((a, b) => a - b);
  let burst = false;
  for (let i = 0; i + BURST_SOLVES - 1 < times.length; i++) {
    if (times[i + BURST_SOLVES - 1] - times[i] < 60_000) {
      burst = true;
      break;
    }
  }

  const lastAt = solves.length ? solves.reduce((a, s) => (s.solved_at > a ? s.solved_at : a), solves[0].solved_at) : null;
  const todayCount = days.filter((d) => d === today).length;
  const quietDays = lastAt ? daysBetween(kstDate(new Date(lastAt)), today) : Infinity;
  const status: StudentStatus = burst ? '확인 필요' : todayCount > 0 ? '활발' : quietDays >= 3 ? '독려 필요' : '쉬는 중';

  return {
    today: todayCount,
    round: days.filter((d) => d >= roundStart && d <= roundEnd).length,
    total: solves.length,
    streak,
    lastAt,
    burst,
    status,
  };
}

/** "김민수", "김민수(2)" … for students sharing a real name, in join order. */
export function displayNames(students: Pick<RosterStudent, 'user_id' | 'real_name' | 'joined_at'>[]): Map<string, string> {
  const seen = new Map<string, number>();
  const out = new Map<string, string>();
  [...students]
    .sort((a, b) => a.joined_at.localeCompare(b.joined_at))
    .forEach((s) => {
      const n = (seen.get(s.real_name) ?? 0) + 1;
      seen.set(s.real_name, n);
      out.set(s.user_id, n === 1 ? s.real_name : `${s.real_name}(${n})`);
    });
  return out;
}

/** "오늘 14:20", "어제", "3일 전" from a timestamp, in Korean time. */
export function relativeDay(at: string | null, today: string): string {
  if (!at) return '—';
  const d = new Date(at);
  const gap = daysBetween(kstDate(d), today);
  if (gap <= 0) {
    const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
    return `오늘 ${String(kst.getUTCHours()).padStart(2, '0')}:${String(kst.getUTCMinutes()).padStart(2, '0')}`;
  }
  return gap === 1 ? '어제' : `${gap}일 전`;
}

const csvCell = (v: string | number) => {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** The roster as CSV, with a BOM so Excel reads the Korean correctly. */
export function rosterCsv(roster: Roster): string {
  const names = displayNames(roster.students);
  const header = ['이름', '닉네임', '오늘', '이번 라운드', '대회 누적', '연속 일수', '마지막 풀이', '상태', '정답 본 문제', '오답노트'];
  const rows = roster.students.map((s) => {
    const st = studentStats(s.solves, roster.contest);
    return [
      names.get(s.user_id) ?? s.real_name,
      s.display_name,
      st.today,
      st.round,
      st.total,
      st.streak,
      st.lastAt ? new Date(st.lastAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }) : '',
      st.status,
      s.answer_views,
      s.review_count,
    ];
  });
  return '﻿' + [header, ...rows].map((r) => r.map(csvCell).join(',')).join('\n') + '\n';
}
