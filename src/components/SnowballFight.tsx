import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { difficultyAt, hitScore, readBestScore, recordScore } from '../utils/snowballGame';

// 눈싸움: snowmen pop up from the snow mounds at the back and throw; the
// player moves along the front, hides behind three snow walls and throws
// back. Drawn on one canvas in an 800×500 field scaled to fit; React state
// only holds the phase and the final score, everything per-frame is in refs.

const W = 800;
const H = 500;
const HORIZON = 150;
const MOUND_Y = 205;
const FORT_Y = 388;
const PLAYER_Y = 452;
const SLOTS = [110, 250, 400, 550, 690];
const FORTS = [180, 400, 620];
const FORT_W = 104;
const FORT_HP = 6;
const MAX_AMMO = 5;
const AMMO_REGEN = 0.45;
const PLAYER_SPEED = 430;
const PLAYER_BALL_SPEED = 760;
const LIVES = 3;

type Phase = 'ready' | 'playing' | 'over';

interface Enemy {
  x: number;
  state: 'hidden' | 'rising' | 'up' | 'ducking' | 'hit';
  rise: number; // 0 hidden … 1 fully up
  timer: number;
  thrown: boolean;
  golden: boolean;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  left: number; // player balls: distance to the aimed point
}

interface Puff {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

interface Game {
  time: number;
  score: number;
  combo: number;
  lives: number;
  invulnerable: number;
  ammo: number;
  regen: number;
  px: number;
  moveTo: number;
  keys: { left: boolean; right: boolean };
  throwAnim: number;
  enemies: Enemy[];
  forts: number[];
  mine: Ball[];
  theirs: Ball[];
  puffs: Puff[];
  popups: { x: number; y: number; text: string; life: number }[];
}

function newGame(): Game {
  return {
    time: 0,
    score: 0,
    combo: 0,
    lives: LIVES,
    invulnerable: 0,
    ammo: MAX_AMMO,
    regen: 0,
    px: W / 2,
    moveTo: W / 2,
    keys: { left: false, right: false },
    throwAnim: 0,
    enemies: SLOTS.map((x, i) => ({ x, state: 'hidden', rise: 0, timer: 0.6 + i * 0.35, thrown: false, golden: false })),
    forts: FORTS.map(() => FORT_HP),
    mine: [],
    theirs: [],
    puffs: [],
    popups: [],
  };
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function burst(g: Game, x: number, y: number, n = 10) {
  for (let i = 0; i < n; i++) {
    const a = rand(0, Math.PI * 2);
    const s = rand(40, 170);
    g.puffs.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 40, life: rand(0.35, 0.7) });
  }
}

function enemyHead(e: Enemy) {
  return { x: e.x, y: MOUND_Y - 34 * e.rise, r: 24 };
}

function throwAt(g: Game, tx: number, ty: number) {
  if (g.ammo < 1) return;
  g.ammo -= 1;
  g.throwAnim = 0.18;
  const sx = g.px + 12;
  const sy = PLAYER_Y - 30;
  const ay = Math.min(ty, FORT_Y - 40);
  const dx = tx - sx;
  const dy = ay - sy;
  const d = Math.hypot(dx, dy) || 1;
  g.mine.push({ x: sx, y: sy, vx: (dx / d) * PLAYER_BALL_SPEED, vy: (dy / d) * PLAYER_BALL_SPEED, left: d });
}

/** Space bar: aim at the nearest enemy that is up, or straight ahead. */
function autoThrow(g: Game) {
  let best: Enemy | null = null;
  for (const e of g.enemies) {
    if ((e.state === 'up' || e.state === 'rising') && (!best || Math.abs(e.x - g.px) < Math.abs(best.x - g.px))) best = e;
  }
  if (best) {
    const h = enemyHead({ ...best, rise: 1 });
    throwAt(g, h.x, h.y);
  } else {
    throwAt(g, g.px, MOUND_Y - 30);
  }
}

function step(g: Game, dt: number): boolean {
  g.time += dt;
  const diff = difficultyAt(g.time);

  // Player
  if (g.keys.left || g.keys.right) {
    g.px += (g.keys.right ? 1 : 0) * PLAYER_SPEED * dt - (g.keys.left ? 1 : 0) * PLAYER_SPEED * dt;
    g.moveTo = g.px;
  } else {
    const d = g.moveTo - g.px;
    g.px += Math.sign(d) * Math.min(Math.abs(d), PLAYER_SPEED * dt);
  }
  g.px = Math.max(30, Math.min(W - 30, g.px));
  g.invulnerable = Math.max(0, g.invulnerable - dt);
  g.throwAnim = Math.max(0, g.throwAnim - dt);
  if (g.ammo < MAX_AMMO) {
    g.regen += dt;
    if (g.regen >= AMMO_REGEN) {
      g.regen = 0;
      g.ammo += 1;
    }
  } else {
    g.regen = 0;
  }

  // Enemies
  const up = g.enemies.filter((e) => e.state !== 'hidden').length;
  for (const e of g.enemies) {
    e.timer -= dt;
    switch (e.state) {
      case 'hidden':
        if (e.timer <= 0 && up < diff.maxUp) {
          e.state = 'rising';
          e.thrown = false;
          e.golden = Math.random() < 0.08;
        }
        break;
      case 'rising':
        e.rise = Math.min(1, e.rise + dt * 4);
        if (e.rise >= 1) {
          e.state = 'up';
          e.timer = e.golden ? 1.3 : diff.windup + rand(0, 0.4);
        }
        break;
      case 'up':
        if (e.timer <= 0) {
          if (!e.golden && !e.thrown) {
            e.thrown = true;
            const sx = e.x;
            const sy = MOUND_Y - 40;
            const tx = g.px + rand(-28, 28);
            const dx = tx - sx;
            const dy = PLAYER_Y - sy;
            const d = Math.hypot(dx, dy);
            g.theirs.push({ x: sx, y: sy, vx: (dx / d) * diff.ballSpeed, vy: (dy / d) * diff.ballSpeed, left: 0 });
            e.timer = 0.45;
          } else {
            e.state = 'ducking';
          }
        }
        break;
      case 'ducking':
      case 'hit':
        e.rise = Math.max(0, e.rise - dt * (e.state === 'hit' ? 3 : 4));
        if (e.rise <= 0) {
          e.timer = (e.state === 'hit' ? diff.respawn + 0.6 : diff.respawn) + rand(0, 1.2);
          e.state = 'hidden';
        }
        break;
    }
  }

  // My snowballs
  g.mine = g.mine.filter((b) => {
    const mx = b.vx * dt;
    const my = b.vy * dt;
    b.x += mx;
    b.y += my;
    b.left -= Math.hypot(mx, my);
    for (const e of g.enemies) {
      if (e.rise < 0.5 || e.state === 'hit' || e.state === 'hidden') continue;
      const h = enemyHead(e);
      if (Math.hypot(b.x - h.x, b.y - h.y) < h.r + 6) {
        const pts = hitScore(g.combo, e.golden);
        g.score += pts;
        g.combo += 1;
        g.popups.push({ x: h.x, y: h.y - 30, text: `+${pts}`, life: 0.8 });
        e.state = 'hit';
        burst(g, h.x, h.y, e.golden ? 22 : 12);
        return false;
      }
    }
    if (b.left <= 0) {
      g.combo = 0;
      burst(g, b.x, b.y, 6);
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
          burst(g, b.x, FORT_Y - 6, 8);
          return false;
        }
      }
    }
    if (b.y >= PLAYER_Y - 26 && b.y <= PLAYER_Y + 10 && Math.abs(b.x - g.px) < 22) {
      if (g.invulnerable <= 0) {
        g.lives -= 1;
        g.combo = 0;
        g.invulnerable = 1.2;
        burst(g, g.px, PLAYER_Y - 20, 16);
      }
      return false;
    }
    return b.y < H + 20;
  });

  g.puffs = g.puffs.filter((p) => {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 380 * dt;
    p.life -= dt;
    return p.life > 0;
  });
  g.popups = g.popups.filter((p) => {
    p.y -= 40 * dt;
    p.life -= dt;
    return p.life > 0;
  });

  return g.lives > 0;
}

// ---- Drawing -----------------------------------------------------------------

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
  // Far hills and pines
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

function drawEnemy(ctx: CanvasRenderingContext2D, e: Enemy) {
  if (e.rise <= 0) return;
  ctx.save();
  // Clip at the mound top so the snowman rises out of it.
  ctx.beginPath();
  ctx.rect(e.x - 50, 0, 100, MOUND_Y + 2);
  ctx.clip();
  const by = MOUND_Y + 30 - 64 * e.rise;
  const body = e.golden ? '#ffe27a' : '#ffffff';
  const edge = e.golden ? '#d4a017' : '#b9cde2';
  circle(ctx, e.x, by + 22, 26, edge);
  circle(ctx, e.x, by + 22, 24, body);
  circle(ctx, e.x, by - 8, 19, edge);
  circle(ctx, e.x, by - 8, 17, body);
  // Face
  const stunned = e.state === 'hit';
  ctx.fillStyle = '#1a1a1a';
  if (stunned) {
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('x  x', e.x, by - 8);
  } else {
    circle(ctx, e.x - 6, by - 11, 2.2, '#1a1a1a');
    circle(ctx, e.x + 6, by - 11, 2.2, '#1a1a1a');
  }
  ctx.fillStyle = '#f08a24';
  ctx.beginPath();
  ctx.moveTo(e.x, by - 6);
  ctx.lineTo(e.x + 12, by - 3);
  ctx.lineTo(e.x, by - 1);
  ctx.fill();
  // Hat
  ctx.fillStyle = e.golden ? '#b8860b' : '#2b2b2b';
  ctx.fillRect(e.x - 15, by - 26, 30, 4);
  ctx.fillRect(e.x - 10, by - 42, 20, 17);
  ctx.fillStyle = '#c0262d';
  ctx.fillRect(e.x - 10, by - 30, 20, 4);
  // Arm up while about to throw
  if (e.state === 'up' && !e.golden && !e.thrown && e.timer < 0.35) {
    ctx.strokeStyle = '#6b4a2b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(e.x + 20, by + 12);
    ctx.lineTo(e.x + 36, by - 14);
    ctx.stroke();
    circle(ctx, e.x + 38, by - 18, 6, '#ffffff');
  }
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
    ctx.fillStyle = '#e3edf7';
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
  // Crumbled bite out of the top as it takes hits
  if (hp < FORT_HP) {
    ctx.fillStyle = '#f1f6fb';
    ctx.beginPath();
    ctx.arc(x - 18 + (hp % 3) * 14, top - 2, 9 + (FORT_HP - hp) * 2, 0, Math.PI);
    ctx.fill();
  }
}

function drawPlayer(ctx: CanvasRenderingContext2D, g: Game) {
  if (g.invulnerable > 0 && Math.floor(g.invulnerable * 12) % 2 === 0) return;
  const x = g.px;
  const y = PLAYER_Y;
  ctx.fillStyle = 'rgba(30, 60, 100, 0.12)';
  ctx.beginPath();
  ctx.ellipse(x, y + 22, 24, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  // Coat (seen from behind)
  ctx.fillStyle = '#2f6fb3';
  ctx.beginPath();
  ctx.ellipse(x, y + 6, 20, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  // Throwing arm
  ctx.strokeStyle = '#2f6fb3';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x + 14, y);
  if (g.throwAnim > 0) ctx.lineTo(x + 24, y - 30);
  else ctx.lineTo(x + 22, y + 12);
  ctx.stroke();
  // Head, beanie, scarf
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
  ctx.font = 'bold 22px Pretendard, sans-serif';
  ctx.fillText(`${g.score}`, 16, 34);
  ctx.font = '600 12px Pretendard, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.fillText(`최고 ${Math.max(best, g.score)}`, 16, 52);
  if (g.combo >= 3) {
    ctx.fillStyle = '#ffe27a';
    ctx.font = 'bold 13px Pretendard, sans-serif';
    ctx.fillText(`콤보 ×${Math.min(1 + Math.floor(g.combo / 3), 5)}`, 16, 70);
  }
  ctx.textAlign = 'right';
  ctx.font = '20px sans-serif';
  ctx.fillText('❤️'.repeat(g.lives) + '🤍'.repeat(LIVES - g.lives), W - 14, 34);
  // Ammo in the sky, under the hearts, clear of the player
  for (let i = 0; i < MAX_AMMO; i++) {
    const cx = W - 22 - i * 18;
    circle(ctx, cx, 54, 6.5, i < g.ammo ? '#ffffff' : 'rgba(255,255,255,0.25)');
  }
}

function draw(ctx: CanvasRenderingContext2D, g: Game, best: number) {
  drawScene(ctx);
  for (const e of g.enemies) {
    drawEnemy(ctx, e);
    drawMound(ctx, e.x);
  }
  for (const b of g.theirs) {
    // Bigger as it comes closer
    const r = 4 + 7 * Math.max(0, (b.y - MOUND_Y) / (PLAYER_Y - MOUND_Y));
    ctx.fillStyle = 'rgba(30, 60, 100, 0.1)';
    ctx.beginPath();
    ctx.ellipse(b.x, b.y + r + 8, r, r * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    circle(ctx, b.x, b.y, r + 1, '#aac3dc');
    circle(ctx, b.x, b.y, r, '#ffffff');
  }
  FORTS.forEach((x, i) => drawFort(ctx, x, g.forts[i]));
  drawPlayer(ctx, g);
  for (const b of g.mine) {
    const r = 4 + 5 * Math.max(0, (b.y - MOUND_Y) / (PLAYER_Y - MOUND_Y));
    circle(ctx, b.x, b.y, r + 1, '#aac3dc');
    circle(ctx, b.x, b.y, r, '#ffffff');
  }
  for (const p of g.puffs) {
    ctx.globalAlpha = Math.max(0, p.life * 1.6);
    circle(ctx, p.x, p.y, 3, '#ffffff');
  }
  ctx.globalAlpha = 1;
  ctx.textAlign = 'center';
  ctx.font = 'bold 16px Pretendard, sans-serif';
  for (const p of g.popups) {
    ctx.globalAlpha = Math.min(1, p.life * 2);
    ctx.fillStyle = '#c0262d';
    ctx.fillText(p.text, p.x, p.y);
  }
  ctx.globalAlpha = 1;
  drawHud(ctx, g, best);
}

// ---- Component -----------------------------------------------------------------

interface SnowballFightProps {
  onClose: () => void;
}

export default function SnowballFight({ onClose }: SnowballFightProps) {
  const { user } = useAuth();
  const accountKey = user ? user.id : 'guest';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game>(newGame());
  const phaseRef = useRef<Phase>('ready');
  const [phase, setPhase] = useState<Phase>('ready');
  const [best, setBest] = useState(() => readBestScore(accountKey));
  const bestRef = useRef(best);
  const [result, setResult] = useState<{ score: number; record: boolean } | null>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  const setPausedBoth = (p: boolean) => {
    pausedRef.current = p;
    setPaused(p);
  };

  const start = useCallback(() => {
    gameRef.current = newGame();
    phaseRef.current = 'playing';
    pausedRef.current = false;
    setPaused(false);
    setResult(null);
    setPhase('playing');
  }, []);

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
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const g = gameRef.current;
      if (phaseRef.current === 'playing' && !pausedRef.current) {
        const alive = step(g, dt);
        if (!alive) {
          phaseRef.current = 'over';
          const newBest = recordScore(accountKey, g.score);
          setResult({ score: g.score, record: g.score > bestRef.current });
          bestRef.current = newBest;
          setBest(newBest);
          setPhase('over');
        }
      }
      draw(ctx, g, bestRef.current);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [accountKey]);

  // Keyboard: move, throw, pause, close.
  useEffect(() => {
    const onKey = (e: KeyboardEvent, down: boolean) => {
      const g = gameRef.current;
      if (e.key === 'Escape' && down) {
        onClose();
        return;
      }
      if (phaseRef.current !== 'playing') {
        if (down && (e.key === ' ' || e.key === 'Enter')) {
          e.preventDefault();
          start();
        }
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') g.keys.left = down;
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') g.keys.right = down;
      else if (e.key === ' ' && down) {
        e.preventDefault();
        if (!pausedRef.current && !e.repeat) autoThrow(g);
      } else if ((e.key === 'p' || e.key === 'P') && down) setPausedBoth(!pausedRef.current);
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
  }, [onClose, start]);

  // Leaving the tab pauses instead of letting snowmen win in the background.
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

  // Mouse: the player follows the pointer sideways and a click throws at it.
  // Touch: the strip along the bottom moves the player, a tap above throws.
  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (phaseRef.current !== 'playing' || pausedRef.current) return;
    const g = gameRef.current;
    const { x, y } = toField(e);
    if (e.pointerType === 'touch' && y > FORT_Y - 10) {
      g.moveTo = x;
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }
    throwAt(g, x, y);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (phaseRef.current !== 'playing') return;
    const { x, y } = toField(e);
    if (e.pointerType === 'mouse' || (e.buttons > 0 && y > FORT_Y - 60)) gameRef.current.moveTo = x;
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
            {phase === 'playing' && (
              <button className="btn-secondary" onClick={() => setPausedBoth(!paused)} style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem' }}>
                {paused ? '계속하기' : '일시정지'}
              </button>
            )}
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
            style={{ width: '100%', height: '100%', display: 'block', touchAction: 'none', cursor: phase === 'playing' ? 'crosshair' : 'default' }}
          />
          {(phase !== 'playing' || paused) && (
            <div className="snowball-game-overlay">
              {phase === 'ready' && (
                <>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>⛄ 눈싸움</div>
                  <div style={{ fontSize: '0.85rem', lineHeight: 1.7, textAlign: 'center' }}>
                    눈사람이 튀어나오면 맞혀요! 눈 벽 뒤에 숨어서 피할 수 있어요.
                    <br />
                    <b>마우스</b> 움직여서 이동 · 클릭해서 던지기 &nbsp;|&nbsp; <b>키보드</b> ←→ 이동 · 스페이스 던지기
                    <br />
                    <b>휴대폰</b> 아래쪽을 끌어서 이동 · 위쪽을 탭해서 던지기
                  </div>
                  <button className="btn-primary" onClick={start}>시작하기</button>
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
                  <div style={{ fontSize: '2.2rem', fontWeight: 900 }}>{result.score.toLocaleString()}점</div>
                  <button className="btn-primary" onClick={start}>다시 하기</button>
                </>
              )}
            </div>
          )}
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          황금 눈사람은 +50점 · 연속으로 맞히면 점수가 최대 5배 · P 일시정지 · Esc 닫기
        </div>
      </div>
    </div>
  );
}
