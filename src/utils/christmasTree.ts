// 모두의 트리 (src/components/ChristmasTree.tsx): when it shows and how
// many ornaments a day's count hangs.
import { kstDate } from './winterEvent';

export const TREE_DAYS = ['21', '22', '23', '24', '25'];

// Solvers in a day that light the star. About what a weekday brings now.
export const TREE_GOAL = 10;

// The two gift problems (src/data/problems.ts), opening on the 24th and 25th.
export const GIFT_PROBLEM_IDS = ['xmas_2026_gift1', 'xmas_2026_gift2'];

/** The year whose tree to show: Dec 21–25 (Korean time), otherwise null. */
export function treeYear(now: Date = new Date()): number | null {
  const d = kstDate(now);
  const md = d.slice(5);
  return md >= '12-21' && md <= '12-25' ? Number(d.slice(0, 4)) : null;
}

/** Ornaments drawn for `solvers`, capped at the tree's spots. */
export function ornamentCount(solvers: number, spots: number): number {
  return Math.max(0, Math.min(solvers, spots));
}
