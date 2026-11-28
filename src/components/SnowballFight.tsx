import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { Volume2, VolumeX, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { bossHp, bossScore, difficultyAt, gameLockedUntil, hitScore, readBestScore, recordScore } from '../utils/snowballGame';
import { MUTE_KEY, readMuted, Sfx } from '../utils/snowballSfx';
import { lazyWithReload } from '../lib/lazyWithReload';

// Its own chunk: three.js only downloads for people who open 대결.
const SnowballDuel = lazyWithReload(() => import('./SnowballDuel'));
import type { SoundName } from '../utils/snowballSfx';

// 눈싸움: snowmen pop up from the snow mounds at the back and throw; the
// player moves along the front, hides behind three snow walls and throws
// back. Gift boxes drop power-ups, and every so often the 눈사람 대장 (boss)
// shows up. Drawn on one canvas in an 800×500 field scaled to fit; React
// state only holds the phase and the result, everything per-frame is in refs.

const W = 800;
const H = 500;
const HORIZON = 150;
const MOUND_Y = 205;
const FORT_Y = 388;
const PLAYER_Y = 452;
const SLOTS = [110, 250, 400, 550, 690];
const FORTS = [180, 400, 620];
const FORT_W = 104;
const FORT_HP = 10;
const MAX_AMMO = 5;
const AMMO_REGEN = 0.4;
const PLAYER_SPEED = 440;
const PLAYER_BALL_SPEED = 780;
const START_LIVES = 3;
const MAX_LIVES = 5;
const RAPID_INTERVAL = 0.09;
const FIRST_BOSS_AT = 35;
const BOSS_GAP = 45;
const POWER_SECONDS = 8;

type Phase = 'ready' | 'playing' | 'over';
type GiftKind = 'triple' | 'rapid' | 'repair' | 'heart';

const GIFT_INFO: Record<GiftKind, { icon: string; label: string }> = {
  triple: { icon: '✨', label: '3방향 던지기!' },
  rapid: { icon: '🔥', label: '연사! 누르고 있으면 계속 던져요' },
  repair: { icon: '🧱', label: '눈 벽 수리!' },
  heart: { icon: '❤️', label: '하트 +1' },
};

interface Enemy {
  x: number;
  state: 'hidden' | 'rising' | 'up' | 'ducking' | 'hit';
  rise: number; // 0 hidden … 1 fully up
  timer: number;
  thrown: boolean;
  golden: boolean;
}

interface Boss {
  number: number;
  hp: number;
  maxHp: number;
  x: number;
  dir: number;
  rise: number;
  state: 'entering' | 'fighting' | 'down';
  timer: number;
  flash: number;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  left: number; // player balls: distance left to the aimed point
  big?: boolean;
}

interface Gift {
  x: number;
  y: number;
  t: number;
  kind: GiftKind;
}

interface Puff {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface Game {
  time: number;
  score: number;
  combo: number;
  bestCombo: number;
  hits: number;
  lives: number;
  invulnerable: number;
  ammo: number;
  regen: number;
  px: number;
  moveTo: number;
  keys: { left: boolean; right: boolean };
  firing: boolean;
  aim: { x: number; y: number };
  fireTimer: number;
  throwAnim: number;
  triple: number;
  rapid: number;
  enemies: Enemy[];
  boss: Boss | null;
  bossCount: number;
  nextBossAt: number;
  forts: number[];
  mine: Ball[];
  theirs: Ball[];
  gifts: Gift[];
  giftTimer: number;
  puffs: Puff[];
  popups: { x: number; y: number; text: string; life: number; color: string; size: number }[];
  banner: { text: string; life: number } | null;
  shake: number;
  flash: number;
  hitStop: number;
  sounds: SoundName[];
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function newGame(): Game {
  return {
    time: 0,
    score: 0,
    combo: 0,
    bestCombo: 0,
    hits: 0,
    lives: START_LIVES,
    invulnerable: 0,
    ammo: MAX_AMMO,
    regen: 0,
    px: W / 2,
    moveTo: W / 2,
    keys: { left: false, right: false },
    firing: false,
    aim: { x: W / 2, y: MOUND_Y - 30 },
    fireTimer: 0,
    throwAnim: 0,
    triple: 0,
    rapid: 0,
    enemies: SLOTS.map((x, i) => ({ x, state: 'hidden', rise: 0, timer: 0.3 + (i % 3) * 0.4, thrown: false, golden: false })),
    boss: null,
    bossCount: 0,
    nextBossAt: FIRST_BOSS_AT,
    forts: FORTS.map(() => FORT_HP),
    mine: [],
    theirs: [],
    gifts: [],
    giftTimer: rand(7, 10),
    puffs: [],
    popups: [],
    banner: null,
    shake: 0,
    flash: 0,
    hitStop: 0,
    sounds: [],
  };
}

function burst(g: Game, x: number, y: number, n = 10, color = '#ffffff') {
  for (let i = 0; i < n; i++) {
    const a = rand(0, Math.PI * 2);
    const s = rand(50, 200);
    g.puffs.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 50, life: rand(0.35, 0.75), color });
  }
}

function popup(g: Game, x: number, y: number, text: string, color = '#c0262d', size = 16) {
  g.popups.push({ x, y, text, life: 0.9, color, size });
}

/** Where a snowman can be hit: head and upper body. */
function enemyTarget(e: Enemy) {
  return { x: e.x, y: MOUND_Y - 30 * e.rise, r: 30 };
}

function bossTarget(b: Boss) {
  return { x: b.x, y: MOUND_Y - 70 * b.rise, r: 52 };
}

function spawnBall(g: Game, sx: number, sy: number, tx: number, ty: number, big = false) {
  const dx = tx - sx;
  const dy = ty - sy;
  const d = Math.hypot(dx, dy) || 1;
  g.mine.push({ x: sx, y: sy, vx: (dx / d) * PLAYER_BALL_SPEED, vy: (dy / d) * PLAYER_BALL_SPEED, left: d + 40, big });
}

function throwAt(g: Game, tx: number, ty: number) {
  const free = g.rapid > 0;
  if (!free && g.ammo < 1) return;
  if (!free) g.ammo -= 1;
  g.throwAnim = 0.15;
  const sx = g.px + 12;
  const sy = PLAYER_Y - 30;
  const ay = Math.min(ty, FORT_Y - 40);
  spawnBall(g, sx, sy, tx, ay);
  if (g.triple > 0) {
    // Same distance, fanned out
    const a = Math.atan2(ay - sy, tx - sx);
    const d = Math.hypot(tx - sx, ay - sy);
    for (const off of [-0.2, 0.2]) spawnBall(g, sx, sy, sx + Math.cos(a + off) * d, sy + Math.sin(a + off) * d);
  }
  g.sounds.push('throw');
}

function scoreHit(g: Game, x: number, y: number, golden: boolean) {
  const pts = hitScore(g.combo, golden);
  g.score += pts;
  g.combo += 1;
  g.hits += 1;
  g.bestCombo = Math.max(g.bestCombo, g.combo);
  popup(g, x, y - 34, `+${pts}`, golden ? '#b8860b' : '#c0262d', golden ? 22 : 17);
  const milestone: Record<number, string> = { 5: '나이스!', 10: '그레이트!', 20: '엄청나요!', 30: '눈싸움의 신!' };
  if (milestone[g.combo]) g.banner = { text: `${milestone[g.combo]} ${g.combo}연속`, life: 1.1 };
  g.hitStop = 0.05;
  g.sounds.push(golden ? 'golden' : 'hit');
}

function applyGift(g: Game, kind: GiftKind, x: number, y: number) {
  if (kind === 'triple') g.triple = POWER_SECONDS;
  if (kind === 'rapid') g.rapid = POWER_SECONDS;
  if (kind === 'repair') g.forts = FORTS.map(() => FORT_HP);
  if (kind === 'heart') g.lives = Math.min(MAX_LIVES, g.lives + 1);
  g.banner = { text: `${GIFT_INFO[kind].icon} ${GIFT_INFO[kind].label}`, life: 1.4 };
  burst(g, x, y, 18, '#ffe27a');
  g.sounds.push('power');
}

function pickGift(g: Game): GiftKind {
  const pool: GiftKind[] = ['triple', 'triple', 'rapid', 'rapid', 'repair'];
  if (g.forts.every((hp) => hp === FORT_HP)) pool.pop();
  if (g.lives < MAX_LIVES) pool.push('heart', 'heart');
  return pool[Math.floor(Math.random() * pool.length)];
}

function enemyThrow(g: Game, sx: number, sy: number, tx: number, speed: number) {
  const dx = tx - sx;
  const dy = PLAYER_Y - sy;
  const d = Math.hypot(dx, dy);
  g.theirs.push({ x: sx, y: sy, vx: (dx / d) * speed, vy: (dy / d) * speed, left: 0 });
}

function step(g: Game, dt: number): boolean {
  // Timers that run even during hit-stop
  g.shake = Math.max(0, g.shake - dt);
  g.flash = Math.max(0, g.flash - dt);
  if (g.banner) {
    g.banner.life -= dt;
    if (g.banner.life <= 0) g.banner = null;
  }
  if (g.hitStop > 0) {
    g.hitStop -= dt;
    return true;
  }

  g.time += dt;
  const diff = difficultyAt(g.time);

  // Player
  if (g.keys.left || g.keys.right) {
    g.px += ((g.keys.right ? 1 : 0) - (g.keys.left ? 1 : 0)) * PLAYER_SPEED * dt;
    g.moveTo = g.px;
  } else {
    const d = g.moveTo - g.px;
    g.px += Math.sign(d) * Math.min(Math.abs(d), PLAYER_SPEED * dt);
  }
  g.px = Math.max(30, Math.min(W - 30, g.px));
  g.invulnerable = Math.max(0, g.invulnerable - dt);
  g.throwAnim = Math.max(0, g.throwAnim - dt);
  g.triple = Math.max(0, g.triple - dt);
  g.rapid = Math.max(0, g.rapid - dt);
  if (g.ammo < MAX_AMMO) {
    g.regen += dt;
    if (g.regen >= AMMO_REGEN) {
      g.regen = 0;
      g.ammo += 1;
    }
  } else {
    g.regen = 0;
  }
  if (g.firing && g.rapid > 0) {
    g.fireTimer -= dt;
    if (g.fireTimer <= 0) {
      g.fireTimer = RAPID_INTERVAL;
      throwAt(g, g.aim.x, g.aim.y);
    }
  }

  // Boss arrival: the regular snowmen duck out of the way
  if (!g.boss && g.time >= g.nextBossAt) {
    g.bossCount += 1;
    const hp = bossHp(g.bossCount);
    g.boss = { number: g.bossCount, hp, maxHp: hp, x: W / 2, dir: 1, rise: 0, state: 'entering', timer: 1.4, flash: 0 };
    g.banner = { text: '⚠️ 눈사람 대장 등장!', life: 1.6 };
    g.sounds.push('boss');
    for (const e of g.enemies) if (e.state !== 'hidden' && e.state !== 'hit') e.state = 'ducking';
  }
  const boss = g.boss;
  if (boss) {
    boss.flash = Math.max(0, boss.flash - dt);
    boss.timer -= dt;
    if (boss.state === 'entering') {
      boss.rise = Math.min(1, boss.rise + dt * 1.2);
      if (boss.rise >= 1) {
        boss.state = 'fighting';
        boss.timer = 1.0;
      }
    } else if (boss.state === 'fighting') {
      boss.x += boss.dir * (70 + 15 * boss.number) * dt;
      if (boss.x < 200 || boss.x > 600) boss.dir *= -1;
      if (boss.timer <= 0) {
        // A fan of three at the player
        const spread = 70;
        for (const off of [-spread, 0, spread]) enemyThrow(g, boss.x, MOUND_Y - 80, g.px + off, diff.ballSpeed * 0.85);
        boss.timer = Math.max(0.8, 1.6 - 0.15 * boss.number);
        g.sounds.push('bossThrow');
      }
    } else {
      boss.rise = Math.max(0, boss.rise - dt * 0.9);
      if (boss.rise <= 0) {
        g.boss = null;
        g.nextBossAt = g.time + BOSS_GAP;
      }
    }
  }

  // Snowmen
  const up = g.enemies.filter((e) => e.state !== 'hidden').length;
  const maxUp = g.boss ? 0 : diff.maxUp;
  for (const e of g.enemies) {
    e.timer -= dt;
    switch (e.state) {
      case 'hidden':
        if (e.timer <= 0 && up < maxUp) {
          e.state = 'rising';
          e.thrown = false;
          e.golden = Math.random() < 0.08;
        }
        break;
      case 'rising':
        e.rise = Math.min(1, e.rise + dt * 5);
        if (e.rise >= 1) {
          e.state = 'up';
          e.timer = e.golden ? 1.1 : diff.windup + rand(0, 0.35);
        }
        break;
      case 'up':
        if (e.timer <= 0) {
          if (!e.golden && !e.thrown) {
            e.thrown = true;
            enemyThrow(g, e.x, MOUND_Y - 40, g.px + rand(-26, 26), diff.ballSpeed);
            e.timer = 0.4;
          } else {
            e.state = 'ducking';
          }
        }
        break;
      case 'ducking':
      case 'hit':
        e.rise = Math.max(0, e.rise - dt * (e.state === 'hit' ? 2.2 : 4.5));
        if (e.rise <= 0) {
          e.timer = (e.state === 'hit' ? diff.respawn + 0.5 : diff.respawn) + rand(0, 0.9);
          e.state = 'hidden';
        }
        break;
    }
  }

  // Gifts float down from the back; hit one with a snowball to open it
  g.giftTimer -= dt;
  if (g.giftTimer <= 0) {
    g.giftTimer = rand(9, 14);
    g.gifts.push({ x: rand(140, W - 140), y: HORIZON + 10, t: 0, kind: pickGift(g) });
  }
  g.gifts = g.gifts.filter((gift) => {
    gift.t += dt;
    gift.y += 42 * dt;
    gift.x += Math.sin(gift.t * 2.4) * 30 * dt;
    return gift.y < FORT_Y - 30;
  });

  // My snowballs
  g.mine = g.mine.filter((b) => {
    const mx = b.vx * dt;
    const my = b.vy * dt;
    b.x += mx;
    b.y += my;
    b.left -= Math.hypot(mx, my);
    for (let i = 0; i < g.gifts.length; i++) {
      const gift = g.gifts[i];
      if (Math.hypot(b.x - gift.x, b.y - gift.y) < 26) {
        applyGift(g, gift.kind, gift.x, gift.y);
        g.gifts.splice(i, 1);
        return false;
      }
    }
    if (g.boss && g.boss.state === 'fighting') {
      const t = bossTarget(g.boss);
      if (Math.hypot(b.x - t.x, b.y - t.y) < t.r) {
        g.boss.hp -= 1;
        g.boss.flash = 0.12;
        g.score += 5;
        burst(g, b.x, b.y, 8);
        g.sounds.push('hit');
        if (g.boss.hp <= 0) {
          const pts = bossScore(g.boss.number);
          g.score += pts;
          g.boss.state = 'down';
          g.banner = { text: `🏆 대장 격파! +${pts}`, life: 1.8 };
          burst(g, t.x, t.y, 40, '#ffe27a');
          g.gifts.push({ x: t.x, y: t.y, t: 0, kind: pickGift(g) });
          g.hitStop = 0.25;
          g.sounds.push('bossDown');
        }
        return false;
      }
    }
    for (const e of g.enemies) {
      if (e.rise < 0.45 || e.state === 'hit' || e.state === 'hidden') continue;
      const t = enemyTarget(e);
      if (Math.hypot(b.x - t.x, b.y - t.y) < t.r) {
        scoreHit(g, t.x, t.y, e.golden);
        e.state = 'hit';
        burst(g, t.x, t.y, e.golden ? 24 : 14, e.golden ? '#ffe27a' : '#ffffff');
        return false;
      }
    }
    if (b.left <= 0) {
      g.combo = 0;
      burst(g, b.x, b.y, 5);
      return false;
    }
    return true;
  });

  // Their snowballs
  g.theirs = g.theirs.filter((b) => {
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    if (b.y >= FORT_Y - 12 && b.y <= FORT_Y + 14) {
      for (let i = 0; i < FORTS.length; i++) {
        if (g.forts[i] > 0 && Math.abs(b.x - FORTS[i]) < FORT_W / 2) {
          g.forts[i] -= 1;
          burst(g, b.x, FORT_Y - 6, 9);
          g.sounds.push('thud');
          return false;
        }
      }
    }
    if (b.y >= PLAYER_Y - 28 && b.y <= PLAYER_Y + 12 && Math.abs(b.x - g.px) < 22) {
      if (g.invulnerable <= 0) {
        g.lives -= 1;
        g.combo = 0;
        g.invulnerable = 1.3;
        g.shake = 0.35;
        g.flash = 0.3;
        burst(g, g.px, PLAYER_Y - 20, 18);
        g.sounds.push('hurt');
      }
      return false;
    }
    return b.y < H + 20;
  });

  g.puffs = g.puffs.filter((p) => {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 420 * dt;
    p.life -= dt;
    return p.life > 0;
  });
  g.popups = g.popups.filter((p) => {
    p.y -= 46 * dt;
    p.life -= dt;
    return p.life > 0;
  });

  return g.lives > 0;
}

// ---- Sound ------------------------------------------------------------------------
// A few synthesized blips; no audio files to download.


// ---- Drawing -----------------------------------------------------------------------

function circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, fill: string) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function drawScene(ctx: CanvasRenderingContext2D) {
  const sky = ctx.createLinearGradient(0, 0, 0, HORIZON);
  sky.addColorStop(0, '#1d2b4f');
  sky.addColorStop(1, '#4a6fa5');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, HORIZON);
  ctx.fillStyle = '#dfe9f3';
  ctx.beginPath();
  ctx.moveTo(0, HORIZON);
  for (let x = 0; x <= W; x += 40) ctx.lineTo(x, HORIZON - 18 - 14 * Math.sin(x / 90));
  ctx.lineTo(W, HORIZON);
  ctx.fill();
  for (const x of [40, 160, 330, 470, 610, 760]) {
    ctx.fillStyle = '#2f5d50';
    ctx.beginPath();
    ctx.moveTo(x, HORIZON - 58);
    ctx.lineTo(x - 18, HORIZON - 8);
    ctx.lineTo(x + 18, HORIZON - 8);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(x, HORIZON - 58);
    ctx.lineTo(x - 7, HORIZON - 38);
    ctx.lineTo(x + 7, HORIZON - 38);
    ctx.fill();
  }
  const ground = ctx.createLinearGradient(0, HORIZON, 0, H);
  ground.addColorStop(0, '#eaf2fa');
  ground.addColorStop(1, '#ffffff');
  ctx.fillStyle = ground;
  ctx.fillRect(0, HORIZON, W, H - HORIZON);
}

interface SnowmanLook {
  golden?: boolean;
  dazed?: boolean;
  windingUp?: boolean;
  flash?: boolean;
  angry?: boolean;
}

/** A snowman whose body centre is (x, y), drawn at `s` scale. */
function drawSnowman(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, look: SnowmanLook) {
  const body = look.flash ? '#ffd1d1' : look.golden ? '#ffe27a' : '#ffffff';
  const edge = look.golden ? '#d4a017' : '#a9c2dc';
  circle(ctx, x, y + 22 * s, 27 * s, edge);
  circle(ctx, x, y + 22 * s, 25 * s, body);
  circle(ctx, x, y - 10 * s, 20 * s, edge);
  circle(ctx, x, y - 10 * s, 18 * s, body);
  // Buttons
  circle(ctx, x, y + 14 * s, 2.4 * s, '#2b2b2b');
  circle(ctx, x, y + 26 * s, 2.4 * s, '#2b2b2b');
  // Eyes
  if (look.dazed) {
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2 * s;
    for (const ex of [-6, 6]) {
      ctx.beginPath();
      ctx.moveTo(x + (ex - 3) * s, y - 16 * s);
      ctx.lineTo(x + (ex + 3) * s, y - 10 * s);
      ctx.moveTo(x + (ex + 3) * s, y - 16 * s);
      ctx.lineTo(x + (ex - 3) * s, y - 10 * s);
      ctx.stroke();
    }
  } else {
    circle(ctx, x - 6 * s, y - 13 * s, 2.4 * s, '#1a1a1a');
    circle(ctx, x + 6 * s, y - 13 * s, 2.4 * s, '#1a1a1a');
    if (look.angry) {
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 2 * s;
      ctx.beginPath();
      ctx.moveTo(x - 10 * s, y - 20 * s);
      ctx.lineTo(x - 3 * s, y - 17 * s);
      ctx.moveTo(x + 10 * s, y - 20 * s);
      ctx.lineTo(x + 3 * s, y - 17 * s);
      ctx.stroke();
    }
  }
  // Carrot nose
  ctx.fillStyle = '#f08a24';
  ctx.beginPath();
  ctx.moveTo(x, y - 8 * s);
  ctx.lineTo(x + 13 * s, y - 5 * s);
  ctx.lineTo(x, y - 3 * s);
  ctx.fill();
  // Hat
  ctx.fillStyle = look.golden ? '#b8860b' : '#2b2b2b';
  ctx.fillRect(x - 16 * s, y - 29 * s, 32 * s, 4 * s);
  ctx.fillRect(x - 11 * s, y - 46 * s, 22 * s, 18 * s);
  ctx.fillStyle = '#c0262d';
  ctx.fillRect(x - 11 * s, y - 33 * s, 22 * s, 4 * s);
  // Stick arm, raised with a snowball while winding up
  ctx.strokeStyle = '#6b4a2b';
  ctx.lineWidth = 3 * s;
  ctx.beginPath();
  ctx.moveTo(x + 22 * s, y + 14 * s);
  if (look.windingUp) {
    ctx.lineTo(x + 38 * s, y - 14 * s);
    ctx.stroke();
    circle(ctx, x + 40 * s, y - 18 * s, 7 * s, '#ffffff');
  } else {
    ctx.lineTo(x + 40 * s, y + 24 * s);
    ctx.stroke();
  }
}

function drawEnemy(ctx: CanvasRenderingContext2D, e: Enemy) {
  if (e.rise <= 0) return;
  ctx.save();
  ctx.beginPath();
  ctx.rect(e.x - 60, 0, 120, MOUND_Y + 2);
  ctx.clip();
  const y = MOUND_Y + 34 - 74 * e.rise;
  if (e.state === 'hit') {
    // Knocked over backwards
    ctx.translate(e.x, y + 30);
    ctx.rotate(-(1 - e.rise) * 1.4);
    ctx.translate(-e.x, -(y + 30));
  }
  drawSnowman(ctx, e.x, y, 1, {
    golden: e.golden,
    dazed: e.state === 'hit',
    windingUp: e.state === 'up' && !e.golden && !e.thrown && e.timer < 0.35,
  });
  ctx.restore();
}

function drawBoss(ctx: CanvasRenderingContext2D, b: Boss) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, W, MOUND_Y + 2);
  ctx.clip();
  const y = MOUND_Y + 90 - 160 * b.rise;
  if (b.state === 'down') {
    ctx.translate(b.x, y + 60);
    ctx.rotate(-(1 - b.rise) * 1.2);
    ctx.translate(-b.x, -(y + 60));
  }
  drawSnowman(ctx, b.x, y, 2, { dazed: b.state === 'down', flash: b.flash > 0, angry: true, windingUp: b.state === 'fighting' && b.timer < 0.3 });
  ctx.restore();
}

function drawMound(ctx: CanvasRenderingContext2D, x: number) {
  ctx.fillStyle = '#a9c2dc';
  ctx.beginPath();
  ctx.ellipse(x, MOUND_Y + 8, 58, 22, 0, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#dbe8f5';
  ctx.beginPath();
  ctx.ellipse(x, MOUND_Y + 8, 55, 19, 0, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#f7fbff';
  ctx.beginPath();
  ctx.ellipse(x - 8, MOUND_Y + 2, 30, 8, 0, Math.PI, 0);
  ctx.fill();
}

function drawFort(ctx: CanvasRenderingContext2D, x: number, hp: number) {
  if (hp <= 0) {
    ctx.fillStyle = '#d6e4f2';
    ctx.beginPath();
    ctx.ellipse(x, FORT_Y + 18, FORT_W / 2, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  const h = 10 + 26 * (hp / FORT_HP);
  const top = FORT_Y + 18 - h;
  ctx.fillStyle = '#a9c2dc';
  ctx.fillRect(x - FORT_W / 2 - 2, top - 2, FORT_W + 4, h + 4);
  ctx.fillStyle = '#dbe8f5';
  ctx.fillRect(x - FORT_W / 2, top, FORT_W, h);
  ctx.fillStyle = '#f7fbff';
  ctx.fillRect(x - FORT_W / 2, top, FORT_W, 5);
  ctx.strokeStyle = '#b9cde2';
  ctx.lineWidth = 1;
  for (let row = top + 11; row < top + h - 3; row += 11) {
    ctx.beginPath();
    ctx.moveTo(x - FORT_W / 2, row);
    ctx.lineTo(x + FORT_W / 2, row);
    ctx.stroke();
  }
  if (hp < FORT_HP) {
    ctx.fillStyle = '#f1f6fb';
    ctx.beginPath();
    ctx.arc(x - 18 + (hp % 3) * 14, top - 2, 9 + ((FORT_HP - hp) / FORT_HP) * 12, 0, Math.PI);
    ctx.fill();
  }
}

function drawGift(ctx: CanvasRenderingContext2D, gift: Gift) {
  const { x, y } = gift;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(gift.t * 3) * 0.15);
  // Glow so it reads as "shoot me"
  ctx.fillStyle = 'rgba(255, 226, 122, 0.35)';
  ctx.beginPath();
  ctx.arc(0, 0, 24 + Math.sin(gift.t * 6) * 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#c0262d';
  ctx.fillRect(-14, -12, 28, 24);
  ctx.fillStyle = '#ffe27a';
  ctx.fillRect(-3, -12, 6, 24);
  ctx.fillRect(-14, -3, 28, 6);
  ctx.beginPath();
  ctx.ellipse(-6, -15, 6, 4, -0.4, 0, Math.PI * 2);
  ctx.ellipse(6, -15, 6, 4, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(GIFT_INFO[gift.kind].icon, x, y - 26);
}

function drawPlayer(ctx: CanvasRenderingContext2D, g: Game) {
  if (g.invulnerable > 0 && Math.floor(g.invulnerable * 12) % 2 === 0) return;
  const x = g.px;
  const y = PLAYER_Y;
  ctx.fillStyle = 'rgba(30, 60, 100, 0.12)';
  ctx.beginPath();
  ctx.ellipse(x, y + 22, 24, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  if (g.triple > 0 || g.rapid > 0) {
    ctx.fillStyle = g.rapid > 0 ? 'rgba(255, 140, 60, 0.25)' : 'rgba(255, 226, 122, 0.35)';
    ctx.beginPath();
    ctx.arc(x, y, 34, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#2f6fb3';
  ctx.beginPath();
  ctx.ellipse(x, y + 6, 20, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2f6fb3';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x + 14, y);
  if (g.throwAnim > 0) ctx.lineTo(x + 24, y - 30);
  else ctx.lineTo(x + 22, y + 12);
  ctx.stroke();
  circle(ctx, x, y - 20, 13, '#f2c9a0');
  ctx.fillStyle = '#c0262d';
  ctx.beginPath();
  ctx.arc(x, y - 22, 13.5, Math.PI, 0);
  ctx.fill();
  circle(ctx, x, y - 37, 4.5, '#ffffff');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x - 14, y - 24, 28, 4);
  ctx.fillStyle = '#1a7f37';
  ctx.fillRect(x - 13, y - 9, 26, 6);
  ctx.fillRect(x + 4, y - 5, 6, 14);
}

function drawHud(ctx: CanvasRenderingContext2D, g: Game, best: number) {
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Pretendard, sans-serif';
  ctx.fillText(`${g.score.toLocaleString()}`, 16, 36);
  ctx.font = '600 12px Pretendard, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.fillText(`최고 ${Math.max(best, g.score).toLocaleString()}`, 16, 54);
  let line = 74;
  if (g.combo >= 3) {
    ctx.fillStyle = '#ffe27a';
    ctx.font = 'bold 13px Pretendard, sans-serif';
    ctx.fillText(`🔥 ${g.combo}연속 · ×${Math.min(1 + Math.floor(g.combo / 3), 5)}`, 16, line);
    line += 20;
  }
  // Power-up timers
  for (const [on, icon] of [[g.triple, '✨'], [g.rapid, '🔥']] as const) {
    if (on <= 0) continue;
    ctx.font = '14px sans-serif';
    ctx.fillText(icon, 16, line);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(36, line - 9, 70, 6);
    ctx.fillStyle = '#ffe27a';
    ctx.fillRect(36, line - 9, 70 * (on / POWER_SECONDS), 6);
    line += 18;
  }
  ctx.textAlign = 'right';
  ctx.font = '20px sans-serif';
  ctx.fillText('❤️'.repeat(g.lives) + '🤍'.repeat(Math.max(0, START_LIVES - g.lives)), W - 14, 34);
  for (let i = 0; i < MAX_AMMO; i++) {
    const cx = W - 22 - i * 18;
    const full = g.rapid > 0 || i < g.ammo;
    circle(ctx, cx, 54, 6.5, full ? (g.rapid > 0 ? '#ffb36b' : '#ffffff') : 'rgba(255,255,255,0.25)');
  }
  // Boss HP bar
  if (g.boss && g.boss.state !== 'down') {
    const bw = 300;
    const bx = (W - bw) / 2;
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(bx - 2, 14, bw + 4, 14);
    ctx.fillStyle = '#c0262d';
    ctx.fillRect(bx, 16, bw * (g.boss.hp / g.boss.maxHp), 10);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Pretendard, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`눈사람 대장 ${g.boss.number > 1 ? `Lv.${g.boss.number}` : ''}`, W / 2, 44);
  }
}

function drawBall(ctx: CanvasRenderingContext2D, b: Ball, grow: number) {
  const r = 4 + grow * Math.max(0, (b.y - MOUND_Y) / (PLAYER_Y - MOUND_Y));
  circle(ctx, b.x, b.y, r + 1, '#aac3dc');
  circle(ctx, b.x, b.y, r, '#ffffff');
}

function draw(ctx: CanvasRenderingContext2D, g: Game, best: number) {
  ctx.save();
  if (g.shake > 0) ctx.translate(rand(-1, 1) * 22 * g.shake, rand(-1, 1) * 22 * g.shake);
  drawScene(ctx);
  if (g.boss) drawBoss(ctx, g.boss);
  for (const e of g.enemies) {
    drawEnemy(ctx, e);
    drawMound(ctx, e.x);
  }
  for (const gift of g.gifts) drawGift(ctx, gift);
  for (const b of g.theirs) {
    const r = 4 + 7 * Math.max(0, (b.y - MOUND_Y) / (PLAYER_Y - MOUND_Y));
    ctx.fillStyle = 'rgba(30, 60, 100, 0.1)';
    ctx.beginPath();
    ctx.ellipse(b.x, b.y + r + 8, r, r * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    drawBall(ctx, b, 7);
  }
  FORTS.forEach((x, i) => drawFort(ctx, x, g.forts[i]));
  drawPlayer(ctx, g);
  for (const b of g.mine) drawBall(ctx, b, 5);
  for (const p of g.puffs) {
    ctx.globalAlpha = Math.max(0, p.life * 1.6);
    circle(ctx, p.x, p.y, 3.2, p.color);
  }
  ctx.globalAlpha = 1;
  ctx.textAlign = 'center';
  for (const p of g.popups) {
    ctx.globalAlpha = Math.min(1, p.life * 2);
    ctx.font = `900 ${p.size}px Pretendard, sans-serif`;
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ffffff';
    ctx.strokeText(p.text, p.x, p.y);
    ctx.fillStyle = p.color;
    ctx.fillText(p.text, p.x, p.y);
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  if (g.flash > 0) {
    ctx.fillStyle = `rgba(192, 38, 45, ${g.flash * 0.9})`;
    ctx.fillRect(0, 0, W, H);
  }
  if (g.banner) {
    const a = Math.min(1, g.banner.life * 2.5);
    const scale = 1 + Math.max(0, g.banner.life - 1) * 0.6;
    ctx.globalAlpha = a;
    ctx.textAlign = 'center';
    ctx.font = `900 ${Math.round(30 * scale)}px Pretendard, sans-serif`;
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#1d2b4f';
    ctx.strokeText(g.banner.text, W / 2, 280);
    ctx.fillStyle = '#ffe27a';
    ctx.fillText(g.banner.text, W / 2, 280);
    ctx.globalAlpha = 1;
  }
  drawHud(ctx, g, best);
}

// ---- Component ---------------------------------------------------------------------

interface SnowballFightProps {
  onClose: () => void;
}

interface Result {
  score: number;
  record: boolean;
  hits: number;
  bestCombo: number;
  bosses: number;
  seconds: number;
}

// Solo against the snowmen, or 친구랑 대결 (SnowballDuel) from the start screen.
export default function SnowballFight({ onClose }: SnowballFightProps) {
  const [duel, setDuel] = useState(false);
  if (duel) {
    return (
      <Suspense fallback={<div className="snowball-game"><div className="snowball-game-panel" style={{ textAlign: 'center', padding: '3rem' }}>3D 눈밭을 불러오는 중…</div></div>}>
        <SnowballDuel onBack={() => setDuel(false)} onClose={onClose} />
      </Suspense>
    );
  }
  return <SoloFight onClose={onClose} onDuel={() => setDuel(true)} />;
}

function SoloFight({ onClose, onDuel }: SnowballFightProps & { onDuel: () => void }) {
  const { user } = useAuth();
  const accountKey = user ? user.id : 'guest';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game>(newGame());
  const phaseRef = useRef<Phase>('ready');
  const [phase, setPhase] = useState<Phase>('ready');
  const [best, setBest] = useState(() => readBestScore(accountKey));
  const bestRef = useRef(best);
  const [result, setResult] = useState<Result | null>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  // Class hours: set while locked, to the time it unlocks.
  const [lockedUntil, setLockedUntil] = useState<string | null>(() => gameLockedUntil());
  const lockedRef = useRef(lockedUntil);
  const [muted, setMuted] = useState(readMuted);
  const mutedRef = useRef(muted);
  const sfxRef = useRef<Sfx | null>(null);
  if (!sfxRef.current) sfxRef.current = new Sfx();

  const setPausedBoth = (p: boolean) => {
    pausedRef.current = p;
    setPaused(p);
  };

  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    try {
      localStorage.setItem(MUTE_KEY, next ? '1' : '0');
    } catch {
      // Storage blocked: muted for this game only.
    }
  }, []);

  const start = useCallback(() => {
    if (gameLockedUntil()) return;
    sfxRef.current?.unlock();
    gameRef.current = newGame();
    phaseRef.current = 'playing';
    pausedRef.current = false;
    setPaused(false);
    setResult(null);
    setPhase('playing');
  }, []);

  useEffect(() => () => sfxRef.current?.close(), []);

  // Main loop: runs for the life of the modal; only steps while playing.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let raf = 0;
    let last = performance.now();
    let lockCheck = 0;
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const g = gameRef.current;
      // Once a second: has a class started (or ended)? A game in progress
      // pauses where it is and can carry on once the lock lifts.
      lockCheck -= dt;
      if (lockCheck <= 0) {
        lockCheck = 1;
        const until = gameLockedUntil();
        if (until !== lockedRef.current) {
          lockedRef.current = until;
          setLockedUntil(until);
        }
        if (until && phaseRef.current === 'playing' && !pausedRef.current) {
          pausedRef.current = true;
          setPaused(true);
          g.firing = false;
        }
      }
      if (phaseRef.current === 'playing' && !pausedRef.current) {
        const alive = step(g, dt);
        if (!alive) {
          phaseRef.current = 'over';
          g.sounds.push('over');
          g.banner = null;
          const newBest = recordScore(accountKey, g.score);
          setResult({
            score: g.score,
            record: g.score > bestRef.current,
            hits: g.hits,
            bestCombo: g.bestCombo,
            bosses: g.bossCount - (g.boss && g.boss.state !== 'down' ? 1 : 0),
            seconds: Math.floor(g.time),
          });
          bestRef.current = newBest;
          setBest(newBest);
          setPhase('over');
        }
      }
      if (g.sounds.length) {
        if (!mutedRef.current) {
          // Dedupe within a frame so a triple throw isn't three times as loud.
          for (const s of new Set(g.sounds)) sfxRef.current?.play(s);
        }
        g.sounds.length = 0;
      }
      draw(ctx, g, bestRef.current);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [accountKey]);

  // Keyboard: move, throw, pause, mute, close. Letters are read from
  // e.code (the physical key): with the Korean IME on, e.key for A is 'ㅁ',
  // which is why WASD "didn't work" for most students.
  useEffect(() => {
    const onKey = (e: KeyboardEvent, down: boolean) => {
      const g = gameRef.current;
      if (e.key === 'Escape' && down) {
        onClose();
        return;
      }
      if (e.code === 'KeyM' && down) {
        toggleMute();
        return;
      }
      if (phaseRef.current !== 'playing') {
        if (down && (e.code === 'Space' || e.key === 'Enter')) {
          e.preventDefault();
          start();
        }
        return;
      }
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') g.keys.left = down;
      else if (e.code === 'ArrowRight' || e.code === 'KeyD') g.keys.right = down;
      else if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') {
        // Straight ahead: with the keyboard, where you stand is your aim.
        g.aim = { x: g.px, y: MOUND_Y - 30 };
        if (down && !pausedRef.current && !e.repeat) throwAt(g, g.aim.x, g.aim.y);
        g.firing = down;
      } else if (e.code === 'KeyP' && down) {
        if (!lockedRef.current) setPausedBoth(!pausedRef.current);
      }
      else return;
      e.preventDefault();
    };
    const kd = (e: KeyboardEvent) => onKey(e, true);
    const ku = (e: KeyboardEvent) => onKey(e, false);
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    return () => {
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
    };
  }, [onClose, start, toggleMute]);

  // Leaving the tab pauses instead of letting the snowmen win in the background.
  useEffect(() => {
    const onVis = () => {
      if (document.hidden && phaseRef.current === 'playing') setPausedBoth(true);
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const toField = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - rect.left) / rect.width) * W, y: ((e.clientY - rect.top) / rect.height) * H };
  };

  // Moving and aiming are separate, so you can stay behind a wall and still
  // throw at a snowman across the field: the snow strip along the bottom
  // moves the player (click or drag, mouse or finger; A/D and ←→ also
  // move), anywhere above throws at that point -- held down with 🔥, it
  // keeps throwing. (The first version walked the player to the mouse, which
  // dragged you out of cover every time you aimed.)
  const touchMoving = useRef(false);
  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (phaseRef.current !== 'playing' || pausedRef.current) return;
    const g = gameRef.current;
    const { x, y } = toField(e);
    e.currentTarget.setPointerCapture(e.pointerId);
    if (y > FORT_Y - 10) {
      touchMoving.current = true;
      g.moveTo = x;
      return;
    }
    g.aim = { x, y };
    g.firing = true;
    g.fireTimer = RAPID_INTERVAL;
    throwAt(g, x, y);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (phaseRef.current !== 'playing') return;
    const g = gameRef.current;
    const { x, y } = toField(e);
    if (touchMoving.current) g.moveTo = x;
    if (g.firing) g.aim = { x, y };
  };
  const onPointerUp = () => {
    touchMoving.current = false;
    gameRef.current.firing = false;
  };

  return (
    <div className="snowball-game" role="dialog" aria-modal="true" aria-label="눈싸움 게임" onClick={onClose}>
      <div className="snowball-game-panel" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1a1a1a' }}>⛄ 눈싸움</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>최고 점수 {best.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {phase === 'playing' && !lockedUntil && (
              <button className="btn-secondary" onClick={() => setPausedBoth(!paused)} style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem' }}>
                {paused ? '계속하기' : '일시정지'}
              </button>
            )}
            <button onClick={toggleMute} aria-label={muted ? '소리 켜기' : '소리 끄기'} title={muted ? '소리 켜기 (M)' : '소리 끄기 (M)'} style={{ background: 'transparent', border: '1px solid var(--border-subtle)', padding: '0.35rem', cursor: 'pointer', display: 'flex' }}>
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <button onClick={onClose} aria-label="닫기" style={{ background: 'transparent', border: '1px solid var(--border-subtle)', padding: '0.35rem', cursor: 'pointer', display: 'flex' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="snowball-game-stage" style={{ position: 'relative', width: '100%', aspectRatio: `${W} / ${H}`, background: '#eaf2fa' }}>
          <canvas
            ref={canvasRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{ width: '100%', height: '100%', display: 'block', touchAction: 'none', cursor: phase === 'playing' ? 'crosshair' : 'default' }}
          />
          {(phase !== 'playing' || paused || lockedUntil) && (
            <div className="snowball-game-overlay">
              {lockedUntil ? (
                <>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>📚 지금은 수업 시간이에요</div>
                  <div style={{ fontSize: '0.9rem', textAlign: 'center', lineHeight: 1.7 }}>
                    눈싸움은 <b>{lockedUntil}</b>부터 다시 할 수 있어요.
                    {phase === 'playing' && <><br />하던 게임은 그때 이어서 할 수 있어요.</>}
                  </div>
                  <button className="btn-primary" onClick={onClose}>닫기</button>
                </>
              ) : (
              <>
              {phase === 'ready' && (
                <>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900 }}>⛄ 눈싸움</div>
                  <div style={{ fontSize: '0.85rem', lineHeight: 1.7, textAlign: 'center' }}>
                    튀어나오는 눈사람을 맞히고, 날아오는 눈덩이는 눈 벽 뒤에서 피하세요.
                    <br />
                    🎁 선물을 맞히면 아이템! · ⚠️ 가끔 <b>눈사람 대장</b>이 나타나요.
                    <br />
                    <span style={{ opacity: 0.85 }}>
                      이동: A·D 또는 ←→, 아래쪽 눈밭을 끌기 &nbsp;|&nbsp; 던지기: 위쪽을 클릭·탭 (W·스페이스는 바로 앞으로)
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button className="btn-primary" onClick={start}>혼자 하기</button>
                    <button className="btn-secondary" onClick={onDuel}>👥 친구랑 대결</button>
                  </div>
                </>
              )}
              {phase === 'playing' && paused && (
                <>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>일시정지</div>
                  <button className="btn-primary" onClick={() => setPausedBoth(false)}>계속하기</button>
                </>
              )}
              {phase === 'over' && result && (
                <>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{result.record ? '🎉 새 최고 점수!' : '게임 끝!'}</div>
                  <div style={{ fontSize: '2.4rem', fontWeight: 900 }}>{result.score.toLocaleString()}점</div>
                  <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <span>⏱ {result.seconds}초 버팀</span>
                    <span>🎯 {result.hits}명 맞힘</span>
                    <span>🔥 최고 {result.bestCombo}연속</span>
                    {result.bosses > 0 && <span>🏆 대장 {result.bosses}번 격파</span>}
                  </div>
                  <button className="btn-primary" onClick={start}>다시 하기</button>
                </>
              )}
              </>
              )}
            </div>
          )}
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          황금 눈사람 +50 · 연속으로 맞히면 최대 5배 · 🎁 ✨3방향 🔥연사 🧱벽 수리 ❤️하트 · P 일시정지 · M 소리 · Esc 닫기
        </div>
      </div>
    </div>
  );
}
