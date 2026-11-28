// The AI for 눈싸움 when there's no friend around. It plays by the same
// rules as a second screen would: it lives in its own mirrored coordinates,
// hears the player's messages and answers with the same DuelMsg a friend's
// screen sends -- so SnowballDuel treats it exactly like a friend.
import {
  clampToHalf,
  DUEL_AMMO,
  DUEL_AMMO_REGEN,
  DUEL_HEARTS,
  DUEL_SPEED,
  DUEL_W,
  HALF_TOP,
  INVULNERABLE_SECONDS,
  mirror,
  mirrorBall,
  moveBall,
  offField,
  playerHit,
  STATE_HZ,
  throwToward,
  WALL_HP,
  WALL_W,
  WALLS,
  wallHit,
} from './snowballDuel';
import type { DuelBall, DuelMsg, Point } from './snowballDuel';

export type BotLevel = 'easy' | 'normal' | 'hard';

export const BOT_LEVELS: Record<BotLevel, { label: string; speed: number; spread: number; gap: [number, number]; dodge: number; cover: number }> = {
  // speed: share of a player's speed · spread: aim error (units) · gap:
  // seconds between throws · dodge: chance to sidestep a ball heading at it ·
  // cover: chance to go hide behind a wall when it next decides where to go.
  easy: { label: '쉬움', speed: 0.55, spread: 140, gap: [1.3, 2.2], dodge: 0.15, cover: 0.25 },
  normal: { label: '보통', speed: 0.8, spread: 75, gap: [0.8, 1.4], dodge: 0.5, cover: 0.4 },
  hard: { label: '어려움', speed: 0.95, spread: 30, gap: [0.45, 0.85], dodge: 0.85, cover: 0.5 },
};

export interface Bot {
  level: BotLevel;
  me: Point;
  goal: Point;
  hearts: number;
  walls: number[];
  ammo: number;
  regen: number;
  invulnerable: number;
  incoming: DuelBall[];
  judged: Set<string>; // balls it already decided whether to dodge
  target: Point; // the player, in the bot's coordinates
  thinkIn: number;
  throwIn: number;
  sentIn: number;
  seq: number;
  dead: boolean;
  rand: () => number;
}

export function newBot(level: BotLevel, rand: () => number = Math.random): Bot {
  const start = { x: DUEL_W / 2, y: 880 };
  return {
    level,
    me: start,
    goal: start,
    hearts: DUEL_HEARTS,
    walls: WALLS.map(() => WALL_HP),
    ammo: DUEL_AMMO,
    regen: 0,
    invulnerable: 0,
    incoming: [],
    judged: new Set(),
    target: mirror(start),
    thinkIn: 0.5,
    throwIn: 1.2,
    sentIn: 0,
    seq: 0,
    dead: false,
    rand,
  };
}

/** A message from the player's screen. */
export function botReceive(bot: Bot, m: DuelMsg): void {
  if (m.t === 'state') bot.target = mirror({ x: m.x, y: m.y });
  else if (m.t === 'throw') bot.incoming.push(mirrorBall(m.b));
  else if (m.t === 'dead') bot.dead = true;
}

const between = (r: () => number, a: number, b: number) => a + r() * (b - a);

/** Where to stand next: behind a standing wall, or out in the open to throw. */
function chooseGoal(bot: Bot): Point {
  const cfg = BOT_LEVELS[bot.level];
  const standing = WALLS.map((w, i) => ({ w, hp: bot.walls[i] })).filter((x) => x.hp > 0);
  if (standing.length > 0 && (bot.ammo <= 1 || bot.rand() < cfg.cover)) {
    const pick = standing[Math.floor(bot.rand() * standing.length)].w;
    return clampToHalf({ x: pick.x + between(bot.rand, -WALL_W / 3, WALL_W / 3), y: pick.y + 70 });
  }
  return clampToHalf({ x: between(bot.rand, 80, DUEL_W - 80), y: between(bot.rand, HALF_TOP + 10, 720) });
}

/** Advance the bot by dt seconds; returns what it says back. */
export function botStep(bot: Bot, dt: number): DuelMsg[] {
  const out: DuelMsg[] = [];
  if (bot.dead) return out;
  const cfg = BOT_LEVELS[bot.level];
  bot.invulnerable = Math.max(0, bot.invulnerable - dt);

  // The player's balls land here.
  const keep: DuelBall[] = [];
  let changed = false;
  for (const raw of bot.incoming) {
    const b = moveBall(raw, dt);
    if (offField(b)) continue;
    const wi = wallHit(b, bot.walls);
    if (wi >= 0) {
      bot.walls = bot.walls.map((hp, i) => (i === wi ? hp - 1 : hp));
      out.push({ t: 'hitWall', id: b.id, i: wi, hp: bot.walls[wi] });
      changed = true;
      continue;
    }
    if (bot.invulnerable <= 0 && playerHit(b, bot.me)) {
      bot.hearts -= 1;
      bot.invulnerable = INVULNERABLE_SECONDS;
      out.push({ t: 'hitMe', id: b.id, h: bot.hearts });
      changed = true;
      continue;
    }
    // Coming at me soon? Maybe sidestep (decided once per ball).
    if (b.vy > 0 && !bot.judged.has(b.id)) {
      const t = (bot.me.y - b.y) / b.vy;
      const x = b.x + b.vx * t;
      if (t > 0 && t < 0.7 && Math.abs(x - bot.me.x) < 45) {
        bot.judged.add(b.id);
        if (bot.rand() < cfg.dodge) {
          const side = x > bot.me.x ? -1 : 1;
          bot.goal = clampToHalf({ x: bot.me.x + side * 110, y: bot.me.y });
          bot.thinkIn = 0.6;
        }
      }
    }
    keep.push(b);
  }
  bot.incoming = keep;

  if (bot.hearts <= 0) {
    bot.dead = true;
    out.push({ t: 'state', x: Math.round(bot.me.x), y: Math.round(bot.me.y), h: 0, w: bot.walls });
    out.push({ t: 'dead' });
    return out;
  }

  // Where to go.
  bot.thinkIn -= dt;
  if (bot.thinkIn <= 0) {
    bot.goal = chooseGoal(bot);
    bot.thinkIn = between(bot.rand, 1, 2.2);
  }
  const dx = bot.goal.x - bot.me.x;
  const dy = bot.goal.y - bot.me.y;
  const d = Math.hypot(dx, dy);
  if (d > 1) {
    const stepLen = Math.min(d, DUEL_SPEED * cfg.speed * dt);
    bot.me = clampToHalf({ x: bot.me.x + (dx / d) * stepLen, y: bot.me.y + (dy / d) * stepLen });
  }

  // Throw.
  if (bot.ammo < DUEL_AMMO) {
    bot.regen += dt;
    if (bot.regen >= DUEL_AMMO_REGEN) {
      bot.regen = 0;
      bot.ammo += 1;
    }
  }
  bot.throwIn -= dt;
  if (bot.throwIn <= 0 && bot.ammo > 0) {
    bot.ammo -= 1;
    bot.seq += 1;
    const aim = { x: bot.target.x + between(bot.rand, -cfg.spread, cfg.spread), y: bot.target.y };
    const b = throwToward(bot.me, aim, `bot-${bot.seq}`);
    out.push({ t: 'throw', b });
    bot.throwIn = between(bot.rand, cfg.gap[0], cfg.gap[1]);
  }

  bot.sentIn -= dt;
  if (changed || bot.sentIn <= 0) {
    bot.sentIn = 1 / STATE_HZ;
    out.push({ t: 'state', x: Math.round(bot.me.x), y: Math.round(bot.me.y), h: bot.hearts, w: bot.walls });
  }
  return out;
}
