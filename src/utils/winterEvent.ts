// Winter event (12월 연속 학습 챌린지): dates, badges, streak math and the
// local solve-day log. Every date here is Korean time (Asia/Seoul, UTC+9) --
// the class is in Korea, so "today" has to flip at Korean midnight no matter
// what timezone the browser reports.

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

interface KstParts {
  year: number;
  month: number; // 1-12
  day: number;
}

function kstParts(d: Date): KstParts {
  const shifted = new Date(d.getTime() + KST_OFFSET_MS);
  return { year: shifted.getUTCFullYear(), month: shifted.getUTCMonth() + 1, day: shifted.getUTCDate() };
}

const pad2 = (n: number) => String(n).padStart(2, '0');

/** Korean day of the week, 0 = Sunday … 6 = Saturday. */
export function kstDayOfWeek(d: Date = new Date()): number {
  return new Date(d.getTime() + KST_OFFSET_MS).getUTCDay();
}

/** Minutes since Korean midnight (0–1439). */
export function kstMinuteOfDay(d: Date = new Date()): number {
  const shifted = new Date(d.getTime() + KST_OFFSET_MS);
  return shifted.getUTCHours() * 60 + shifted.getUTCMinutes();
}

/** Korean date as 'YYYY-MM-DD'. */
export function kstDate(d: Date = new Date()): string {
  const { year, month, day } = kstParts(d);
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

/** Nov 20 – Dec 31: snow, the Santa hat and snowflake confetti. */
export function isWinterDecorSeason(now: Date = new Date()): boolean {
  const { month, day } = kstParts(now);
  return (month === 11 && day >= 20) || month === 12;
}

/** December: the only month whose days count toward the streak. */
export function isChallengeRunning(now: Date = new Date()): boolean {
  return kstParts(now).month === 12;
}

/**
 * Which year's challenge card the dashboard shows: that year from Nov 20 to
 * Dec 31, the previous year from Jan 1 to Jan 15 (the gift claim window),
 * otherwise null.
 */
export function challengeYear(now: Date = new Date()): number | null {
  const { year, month, day } = kstParts(now);
  if (isWinterDecorSeason(now)) return year;
  if (month === 1 && day <= 15) return year - 1;
  return null;
}

export interface WinterBadge {
  id: string;
  days: number;
  icon: string;
  name: string;
  description: string;
}

export const WINTER_BADGES: WinterBadge[] = [
  { id: 'winter_first_snow', days: 3, icon: '❄️', name: '첫눈', description: '12월에 3일 연속으로 문제 풀기' },
  { id: 'winter_snowman', days: 7, icon: '☃️', name: '눈사람 코더', description: '12월에 7일 연속으로 문제 풀기' },
  { id: 'winter_reindeer', days: 14, icon: '🦌', name: '루돌프의 코', description: '12월에 14일 연속으로 문제 풀기' },
  { id: 'winter_santa', days: 25, icon: '🎅', name: '산타의 조수', description: '12월 1일부터 25일까지 하루도 빠짐없이 풀기' },
];

// The streak length that earns the gift. A constant so it is one edit to change.
export const GIFT_BADGE_DAYS = 7;

/** December days of `year` present in `days`, as day-of-month numbers. */
function decemberDaySet(days: string[], year: number): Set<number> {
  const prefix = `${year}-12-`;
  const set = new Set<number>();
  for (const d of days) {
    if (d.startsWith(prefix)) set.add(Number(d.slice(prefix.length)));
  }
  return set;
}

/** Longest run of consecutive December days in `year` (other months and years are ignored). */
export function longestDecemberRun(days: string[], year: number): number {
  const set = decemberDaySet(days, year);
  let best = 0;
  let run = 0;
  for (let day = 1; day <= 31; day++) {
    run = set.has(day) ? run + 1 : 0;
    if (run > best) best = run;
  }
  return best;
}

/**
 * December run ending today -- or yesterday, when today has not been solved
 * yet, so the streak doesn't read 0 all morning. 0 outside December.
 */
export function currentDecemberRun(days: string[], now: Date = new Date()): number {
  if (!isChallengeRunning(now)) return 0;
  const { year, day: today } = kstParts(now);
  const set = decemberDaySet(days, year);
  let day = set.has(today) ? today : today - 1;
  let run = 0;
  while (day >= 1 && set.has(day)) {
    run++;
    day--;
  }
  return run;
}

// ---- Local solve-day log ----------------------------------------------------

const SOLVE_DAYS_PREFIX = 'pyquests_solve_days_';
const MAX_SOLVE_DAYS = 60;
export const SOLVE_DAYS_CHANGE_EVENT = 'pyquests-solve-days-change';

/** accountKey is the user id, or 'guest'. */
export function readSolveDays(accountKey: string): string[] {
  try {
    const raw = localStorage.getItem(SOLVE_DAYS_PREFIX + accountKey);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((d): d is string => typeof d === 'string') : [];
  } catch {
    return [];
  }
}

/** Adds today (Korean date) to the log: deduplicated, sorted, last 60 kept. */
export function recordSolveDay(accountKey: string, now: Date = new Date()): void {
  const today = kstDate(now);
  const days = readSolveDays(accountKey);
  if (days.includes(today)) return;
  const next = [...days, today].sort().slice(-MAX_SOLVE_DAYS);
  try {
    localStorage.setItem(SOLVE_DAYS_PREFIX + accountKey, JSON.stringify(next));
  } catch {
    return;
  }
  window.dispatchEvent(new Event(SOLVE_DAYS_CHANGE_EVENT));
}

// ---- Snow toggle ------------------------------------------------------------

const SNOW_OFF_KEY = 'pyquests_snow_off';
export const SNOW_CHANGE_EVENT = 'pyquests-snow-change';

export function isSnowEnabled(): boolean {
  try {
    return localStorage.getItem(SNOW_OFF_KEY) !== '1';
  } catch {
    return true;
  }
}

export function setSnowEnabled(enabled: boolean): void {
  if (enabled === isSnowEnabled()) return;
  try {
    if (enabled) localStorage.removeItem(SNOW_OFF_KEY);
    else localStorage.setItem(SNOW_OFF_KEY, '1');
  } catch {
    // Storage blocked: nothing to persist, and isSnowEnabled() stays true.
  }
  window.dispatchEvent(new Event(SNOW_CHANGE_EVENT));
}
