// 친구랑 눈싸움 (src/components/SnowballDuel.tsx): the rules, kept pure so
// they can be tested without a canvas or a network.
//
// Each player sees themselves at the bottom of an 800×500 field and the
// friend mirrored at the top. Everything about a player -- where they are,
// their walls, their hearts -- is decided on their own screen and sent to
// the other: a snowball is judged by the screen it lands on. In a classroom
// that is fair enough, and it means two screens never argue about a hit.

export const DUEL_W = 800;
export const DUEL_H = 500;

// My half of the field (my screen's coordinates).
export const HALF_TOP = 300;
export const HALF_BOTTOM = 475;
export const WALL_Y = 318;
export const WALL_XS = [190, 400, 610];
export const WALL_W = 96;
export const WALL_HP = 6;

export const DUEL_HEARTS = 5;
export const DUEL_SECONDS = 90;
export const DUEL_SPEED = 380; // px/s, the player
export const DUEL_BALL_SPEED = 640;
export const DUEL_AMMO = 5;
export const DUEL_AMMO_REGEN = 0.45;
export const HIT_RADIUS = 22;
export const INVULNERABLE_SECONDS = 0.8;

// Position updates per second. Each one is a Realtime message, and those
// are metered, so only while moving (plus a heartbeat).
export const STATE_HZ = 8;

export interface Point {
  x: number;
  y: number;
}

export interface DuelBall {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/** A point on the friend's screen, as it appears on mine. */
export function mirror<T extends Point>(p: T): T {
  return { ...p, x: DUEL_W - p.x, y: DUEL_H - p.y };
}

/** A ball thrown on the friend's screen, as it flies on mine. */
export function mirrorBall(b: DuelBall): DuelBall {
  return { ...b, x: DUEL_W - b.x, y: DUEL_H - b.y, vx: -b.vx, vy: -b.vy };
}

/** Keep a player inside their half. */
export function clampToHalf(p: Point): Point {
  return {
    x: Math.max(28, Math.min(DUEL_W - 28, p.x)),
    y: Math.max(HALF_TOP, Math.min(HALF_BOTTOM, p.y)),
  };
}

/**
 * A ball from (x, y) toward a target. Aiming at your own half (or behind
 * you) still throws forward, so a mis-tap never wastes a snowball backwards.
 */
export function throwToward(from: Point, target: Point, id: string): DuelBall {
  const sx = from.x;
  const sy = from.y - 28;
  let dx = target.x - sx;
  let dy = target.y - sy;
  if (dy > -40) {
    dx = 0;
    dy = -1;
  }
  const len = Math.hypot(dx, dy) || 1;
  return { id, x: sx, y: sy, vx: (dx / len) * DUEL_BALL_SPEED, vy: (dy / len) * DUEL_BALL_SPEED };
}

export function moveBall(b: DuelBall, dt: number): DuelBall {
  return { ...b, x: b.x + b.vx * dt, y: b.y + b.vy * dt };
}

export function offField(b: Point): boolean {
  return b.x < -20 || b.x > DUEL_W + 20 || b.y < -20 || b.y > DUEL_H + 20;
}

/** Which of my walls (index) a ball is passing through, or -1. */
export function wallHit(b: Point, walls: number[]): number {
  if (b.y < WALL_Y - 14 || b.y > WALL_Y + 14) return -1;
  return WALL_XS.findIndex((wx, i) => walls[i] > 0 && Math.abs(b.x - wx) <= WALL_W / 2);
}

/** Whether a ball hits me, standing at `me` (my feet; the body is above). */
export function playerHit(b: Point, me: Point): boolean {
  return Math.hypot(b.x - me.x, b.y - (me.y - 22)) <= HIT_RADIUS;
}

export type DuelOutcome = 'win' | 'lose' | 'draw';

/** When time runs out: more hearts wins, then more wall left. */
export function outcomeAtTime(mine: { hearts: number; walls: number[] }, theirs: { hearts: number; walls: number[] }): DuelOutcome {
  if (mine.hearts !== theirs.hearts) return mine.hearts > theirs.hearts ? 'win' : 'lose';
  const a = mine.walls.reduce((s, w) => s + w, 0);
  const b = theirs.walls.reduce((s, w) => s + w, 0);
  if (a !== b) return a > b ? 'win' : 'lose';
  return 'draw';
}

// ---- rooms ----------------------------------------------------------------------

/** Four digits, easy to say across a desk. Not secret: a room is two people. */
export function makeRoomCode(rand: () => number = Math.random): string {
  return String(1000 + Math.floor(rand() * 9000));
}

export function isRoomCode(s: string): boolean {
  return /^\d{4}$/.test(s);
}

export function channelName(code: string): string {
  return `snowball-duel-${code}`;
}
