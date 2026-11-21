// XP, levels and tiers. XP is derived from solved problems, never stored:
// the ranking views compute the same numbers server-side (public.problem_xp
// in migrations/003_xp.sql), so the weights below must match that function.
// tests/levels.test.ts checks they do.
import type { Problem } from '../data/problems';

type Difficulty = Problem['difficulty'];

// Coding problems by difficulty. Quiz and fill-in-the-blank are a flat 5:
// they can be retried until right, so they shouldn't outweigh real code.
export const CODING_XP: Record<Difficulty, number> = {
  basic: 10,
  intermediate: 20,
  advanced: 40,
  expert: 80,
};
export const CHOICE_XP = 5;

export function problemXp(problem: Pick<Problem, 'type' | 'difficulty'>): number {
  return problem.type === 'coding' ? CODING_XP[problem.difficulty] : CHOICE_XP;
}

export function totalXp(problems: Problem[], solvedIds: string[]): number {
  const solved = new Set(solvedIds);
  let xp = 0;
  for (const p of problems) {
    if (solved.has(p.id)) xp += problemXp(p);
  }
  return xp;
}

export interface Tier {
  id: string;
  name: string;
  icon: string;
  minXp: number;
  color: string;
}

// Ascending. Set so today's top students sit around Platinum, with two
// tiers still above them.
export const TIERS: Tier[] = [
  { id: 'bronze', name: '브론즈', icon: '🥉', minXp: 0, color: '#a0603a' },
  { id: 'silver', name: '실버', icon: '🥈', minXp: 200, color: '#6e7781' },
  { id: 'gold', name: '골드', icon: '🥇', minXp: 800, color: '#b08800' },
  { id: 'platinum', name: '플래티넘', icon: '💎', minXp: 2000, color: '#0e7490' },
  { id: 'diamond', name: '다이아', icon: '💠', minXp: 4000, color: '#1d4ed8' },
  { id: 'master', name: '마스터', icon: '👑', minXp: 7000, color: '#8250df' },
];

export function tierFor(xp: number): Tier {
  let tier = TIERS[0];
  for (const t of TIERS) if (xp >= t.minXp) tier = t;
  return tier;
}

/** The tier after `tier`, or null at the top. */
export function nextTier(tier: Tier): Tier | null {
  const i = TIERS.findIndex((t) => t.id === tier.id);
  return TIERS[i + 1] ?? null;
}

// Level L starts at 5·(L−1)² XP: the first quiz is Lv.2, and each level
// takes a little longer than the one before.
const LEVEL_STEP = 5;

export function levelStartXp(level: number): number {
  return LEVEL_STEP * (level - 1) ** 2;
}

export function levelFor(xp: number): number {
  return Math.floor(Math.sqrt(Math.max(0, xp) / LEVEL_STEP)) + 1;
}
