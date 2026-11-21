// The pure parts of the snowball fight (src/components/SnowballFight.tsx):
// difficulty over time, scoring and the best-score record. Kept out of the
// component so they can be tested without a canvas.

export interface Difficulty {
  /** Seconds between an enemy popping up and throwing. */
  windup: number;
  /** Enemy snowball speed, px/s on the 800×500 field. */
  ballSpeed: number;
  /** How many enemies may be up at once. */
  maxUp: number;
  /** Seconds a hidden enemy waits before it may pop up again (lower bound). */
  respawn: number;
}

// Gentle for the first half minute, then ramps until about two minutes in.
export function difficultyAt(seconds: number): Difficulty {
  const t = Math.min(Math.max(seconds, 0), 120) / 120; // 0 → 1
  return {
    windup: 1.1 - 0.6 * t,
    ballSpeed: 230 + 200 * t,
    maxUp: 1 + Math.floor(t * 3.5),
    respawn: 1.6 - 1.0 * t,
  };
}

export const HIT_POINTS = 10;
export const GOLDEN_POINTS = 50;
export const MAX_COMBO_MULTIPLIER = 5;

/** Points for a hit, given how many hits in a row came before it. */
export function hitScore(combo: number, golden: boolean): number {
  const base = golden ? GOLDEN_POINTS : HIT_POINTS;
  return base * Math.min(1 + Math.floor(combo / 3), MAX_COMBO_MULTIPLIER);
}

const BEST_PREFIX = 'pyquests_snowball_best_';

/** accountKey is the user id, or 'guest'. */
export function readBestScore(accountKey: string): number {
  try {
    return Number(localStorage.getItem(BEST_PREFIX + accountKey)) || 0;
  } catch {
    return 0;
  }
}

/** Saves `score` if it beats the record; returns the (possibly new) best. */
export function recordScore(accountKey: string, score: number): number {
  const best = readBestScore(accountKey);
  if (score <= best) return best;
  try {
    localStorage.setItem(BEST_PREFIX + accountKey, String(score));
  } catch {
    // Storage blocked: the record lasts until the page closes.
  }
  return score;
}
