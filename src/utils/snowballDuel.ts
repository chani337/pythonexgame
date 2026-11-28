// 친구랑 눈싸움 (src/components/SnowballDuel.tsx): the rules, kept pure so
// they can be tested without a canvas or a network.
//
// Each player sees themselves on the near side of the field and the friend
// mirrored on the far side. Everything about a player -- where they are,
// their walls, their hearts -- is decided on their own screen and sent to
// the other: a snowball is judged by the screen it lands on. In a classroom
// that is fair enough, and it means two screens never argue about a hit.

export interface Point {
  x: number;
  y: number;
}

// The field, in ground units (the 3D scene draws 1 unit = 1 unit). Wide
// enough to run around in, with two staggered rows of walls per side.
export const DUEL_W = 1200;
export const DUEL_H = 1000;

// My half (my screen's coordinates): y grows toward me.
export const HALF_TOP = 560;
export const HALF_BOTTOM = 960;
export const WALLS: Point[] = [
  { x: 240, y: 610 },
  { x: 600, y: 610 },
  { x: 960, y: 610 },
  { x: 420, y: 770 },
  { x: 780, y: 770 },
];
export const WALL_W = 120;
export const WALL_DEPTH = 18;
export const WALL_HP = 6;

export const DUEL_HEARTS = 5;
export const DUEL_SECONDS = 90;
export const DUEL_SPEED = 420; // units/s, the player
export const DUEL_BALL_SPEED = 760;
export const DUEL_AMMO = 5;
export const DUEL_AMMO_REGEN = 0.45;
export const HIT_RADIUS = 26;
export const INVULNERABLE_SECONDS = 0.8;

// Position updates per second. Each one is a Realtime message, and those
// are metered, so only while moving (plus a heartbeat).
export const STATE_HZ = 8;


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
    x: Math.max(40, Math.min(DUEL_W - 40, p.x)),
    y: Math.max(HALF_TOP, Math.min(HALF_BOTTOM, p.y)),
  };
}

/**
 * A ball from where I stand toward a target. Aiming at your own half (or
 * behind you) still throws forward, so a mis-tap never wastes a snowball.
 */
export function throwToward(from: Point, target: Point, id: string): DuelBall {
  let dx = target.x - from.x;
  let dy = target.y - from.y;
  if (dy > -40) {
    dx = 0;
    dy = -1;
  }
  const len = Math.hypot(dx, dy) || 1;
  return { id, x: from.x, y: from.y - 20, vx: (dx / len) * DUEL_BALL_SPEED, vy: (dy / len) * DUEL_BALL_SPEED };
}

export function moveBall(b: DuelBall, dt: number): DuelBall {
  return { ...b, x: b.x + b.vx * dt, y: b.y + b.vy * dt };
}

export function offField(b: Point): boolean {
  return b.x < -20 || b.x > DUEL_W + 20 || b.y < -20 || b.y > DUEL_H + 20;
}

/** Which of my walls (index into WALLS) a ball is passing through, or -1. */
export function wallHit(b: Point, walls: number[]): number {
  return WALLS.findIndex(
    (w, i) => walls[i] > 0 && Math.abs(b.y - w.y) <= WALL_DEPTH && Math.abs(b.x - w.x) <= WALL_W / 2
  );
}

/** Whether a ball hits me, standing at `me`. */
export function playerHit(b: Point, me: Point): boolean {
  return Math.hypot(b.x - me.x, b.y - me.y) <= HIT_RADIUS;
}

export type DuelOutcome = 'win' | 'lose' | 'draw';

/** What one screen tells the other (or the AI). Coordinates are the sender's. */
export type DuelMsg =
  | { t: 'start' }
  | { t: 'state'; x: number; y: number; h: number; w: number[] }
  | { t: 'throw'; b: DuelBall }
  | { t: 'hitMe'; id: string; h: number }
  | { t: 'hitWall'; id: string; i: number; hp: number }
  | { t: 'dead' }
  | { t: 'end'; hostOutcome: DuelOutcome }
  | { t: 'again' }
  | { t: 'bye' };

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
