import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { ArrowLeft, Volume2, VolumeX, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { gameLockedUntil } from '../utils/snowballGame';
import { MUTE_KEY, readMuted, Sfx } from '../utils/snowballSfx';
import type { SoundName } from '../utils/snowballSfx';
import {
  channelName,
  clampToHalf,
  DUEL_AMMO,
  DUEL_AMMO_REGEN,
  DUEL_H,
  DUEL_HEARTS,
  DUEL_SECONDS,
  DUEL_SPEED,
  DUEL_W,
  HALF_TOP,
  INVULNERABLE_SECONDS,
  isRoomCode,
  makeRoomCode,
  mirror,
  mirrorBall,
  moveBall,
  offField,
  outcomeAtTime,
  playerHit,
  STATE_HZ,
  throwToward,
  WALL_HP,
  WALL_W,
  WALL_XS,
  WALL_Y,
  wallHit,
} from '../utils/snowballDuel';
import type { DuelBall, DuelOutcome, Point } from '../utils/snowballDuel';

// 친구랑 눈싸움: two screens in one Supabase Realtime channel named by a
// four-digit room code. Nothing is stored -- the channel only relays
// messages while both are in it. Each screen runs its own player and judges
// the snowballs that land on it (see src/utils/snowballDuel.ts).

type Phase = 'lobby' | 'hosting' | 'joining' | 'connecting' | 'countdown' | 'playing' | 'judging' | 'over' | 'left';

type Msg =
  | { t: 'start' }
  | { t: 'state'; x: number; y: number; h: number; w: number[] }
  | { t: 'throw'; b: DuelBall }
  | { t: 'hitMe'; id: string; h: number }
  | { t: 'hitWall'; id: string; i: number; hp: number }
  | { t: 'dead' }
  | { t: 'end'; hostOutcome: DuelOutcome }
  | { t: 'again' }
  | { t: 'bye' };

interface Sim {
  me: Point;
  moveTo: Point | null;
  keys: { l: boolean; r: boolean; u: boolean; d: boolean };
  hearts: number;
  walls: number[];
  ammo: number;
  regen: number;
  invulnerable: number;
  throwAnim: number;
  myBalls: DuelBall[];
  theirBalls: DuelBall[];
  them: Point;
  themTarget: Point;
  theirHearts: number;
  theirWalls: number[];
  theirThrowAnim: number;
  timeLeft: number;
  countdown: number;
  puffs: { x: number; y: number; vx: number; vy: number; life: number }[];
  popups: { x: number; y: number; text: string; life: number; color: string }[];
  shake: number;
  flash: number;
  sounds: SoundName[];
  sentAt: number;
  sentPos: Point;
  seq: number;
}

function newSim(): Sim {
  const me = { x: DUEL_W / 2, y: 440 };
  return {
    me,
    moveTo: null,
    keys: { l: false, r: false, u: false, d: false },
    hearts: DUEL_HEARTS,
    walls: WALL_XS.map(() => WALL_HP),
    ammo: DUEL_AMMO,
    regen: 0,
    invulnerable: 0,
    throwAnim: 0,
    myBalls: [],
    theirBalls: [],
    them: mirror(me),
    themTarget: mirror(me),
    theirHearts: DUEL_HEARTS,
    theirWalls: WALL_XS.map(() => WALL_HP),
    theirThrowAnim: 0,
    timeLeft: DUEL_SECONDS,
    countdown: 3,
    puffs: [],
    popups: [],
    shake: 0,
    flash: 0,
    sounds: [],
    sentAt: 0,
    sentPos: { x: -1, y: -1 },
    seq: 0,
  };
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function burst(s: Sim, x: number, y: number, n = 10) {
  for (let i = 0; i < n; i++) {
    const a = rand(0, Math.PI * 2);
    const v = rand(60, 220);
    s.puffs.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rand(0.3, 0.6) });
  }
}

// ---- drawing ------------------------------------------------------------------------

function circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, fill: string) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

/** A kid in a hat; `feet` is where they stand, `up` is +1 for me, -1 for the friend. */
function drawKid(ctx: CanvasRenderingContext2D, feet: Point, up: 1 | -1, hat: string, coat: string, throwing: boolean, hurt: boolean) {
  const body = { x: feet.x, y: feet.y - 22 * up };
  if (hurt && Math.floor(performance.now() / 90) % 2 === 0) ctx.globalAlpha = 0.45;
  ctx.fillStyle = 'rgba(40, 70, 110, 0.15)';
  ctx.beginPath();
  ctx.ellipse(feet.x, feet.y, 20, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  circle(ctx, body.x, body.y, 17, coat);
  circle(ctx, body.x, body.y - 20 * up, 12, '#ffe0c2');
  circle(ctx, body.x, body.y - 31 * up, 10, hat);
  circle(ctx, body.x + 9, body.y - 39 * up, 4.5, '#ffffff');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(body.x - 12, body.y - (up === 1 ? 30 : 26), 24, 4);
  circle(ctx, body.x - 4, body.y - 19 * up, 1.6, '#1a1a1a');
  circle(ctx, body.x + 4, body.y - 19 * up, 1.6, '#1a1a1a');
  // Arm, up when throwing
  ctx.strokeStyle = coat;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(body.x + 13, body.y - 4 * up);
  ctx.lineTo(body.x + 24, throwing ? body.y - 26 * up : body.y + 8 * up);
  ctx.stroke();
  if (throwing) circle(ctx, body.x + 25, body.y - 30 * up, 6, '#ffffff');
  ctx.globalAlpha = 1;
}

function drawWall(ctx: CanvasRenderingContext2D, x: number, y: number, hp: number, up: 1 | -1) {
  if (hp <= 0) {
    ctx.fillStyle = '#dbe7f3';
    ctx.beginPath();
    ctx.ellipse(x, y + 8 * up, WALL_W / 2, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  const h = 14 + 20 * (hp / WALL_HP);
  const top = up === 1 ? y + 12 - h : y - 12;
  ctx.fillStyle = '#a9c2dc';
  ctx.fillRect(x - WALL_W / 2 - 2, top - 2, WALL_W + 4, h + 4);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x - WALL_W / 2, top, WALL_W, h);
  ctx.strokeStyle = '#c6d8ea';
  ctx.lineWidth = 1;
  for (let i = 1; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(x - WALL_W / 2 + (WALL_W / 4) * i, top);
    ctx.lineTo(x - WALL_W / 2 + (WALL_W / 4) * i, top + h);
    ctx.stroke();
  }
}

function drawHearts(ctx: CanvasRenderingContext2D, x: number, y: number, n: number, align: 'left' | 'right') {
  ctx.font = '18px system-ui, sans-serif';
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText('❤️'.repeat(Math.max(n, 0)) + '🤍'.repeat(Math.max(DUEL_HEARTS - n, 0)), x, y);
}

function draw(ctx: CanvasRenderingContext2D, s: Sim, names: { me: string; them: string }, phase: Phase) {
  ctx.save();
  if (s.shake > 0) ctx.translate(rand(-5, 5) * s.shake * 3, rand(-5, 5) * s.shake * 3);
  const ground = ctx.createLinearGradient(0, 0, 0, DUEL_H);
  ground.addColorStop(0, '#dbe9f6');
  ground.addColorStop(0.5, '#f4f8fc');
  ground.addColorStop(1, '#ffffff');
  ctx.fillStyle = ground;
  ctx.fillRect(-20, -20, DUEL_W + 40, DUEL_H + 40);
  // Halves: the friend's tinted blue, mine red, the no-man's-land between.
  ctx.fillStyle = 'rgba(31, 111, 235, 0.05)';
  ctx.fillRect(0, 0, DUEL_W, DUEL_H - HALF_TOP + 25);
  ctx.fillStyle = 'rgba(192, 38, 45, 0.05)';
  ctx.fillRect(0, HALF_TOP - 25, DUEL_W, DUEL_H);
  ctx.setLineDash([10, 10]);
  ctx.strokeStyle = '#a9c2dc';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, DUEL_H / 2);
  ctx.lineTo(DUEL_W, DUEL_H / 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // The friend stands upright too. Mirrored, their body is 22px *below*
  // the point we're sent (their feet), which is where their screen judges
  // hits -- so the figure is drawn around that.
  WALL_XS.forEach((x, i) => drawWall(ctx, DUEL_W - x, DUEL_H - WALL_Y, s.theirWalls[i], 1));
  if (phase !== 'left') drawKid(ctx, { x: s.them.x, y: s.them.y + 44 }, 1, '#1f6feb', '#3b82f6', s.theirThrowAnim > 0, false);
  WALL_XS.forEach((x, i) => drawWall(ctx, x, WALL_Y, s.walls[i], 1));
  drawKid(ctx, s.me, 1, '#c0262d', '#e5484d', s.throwAnim > 0, s.invulnerable > 0);

  for (const b of [...s.myBalls, ...s.theirBalls]) {
    circle(ctx, b.x, b.y, 7.5, '#a9c2dc');
    circle(ctx, b.x, b.y, 6.5, '#ffffff');
  }
  for (const p of s.puffs) {
    ctx.globalAlpha = Math.max(0, p.life * 2);
    circle(ctx, p.x, p.y, 3, '#ffffff');
  }
  ctx.globalAlpha = 1;
  ctx.font = 'bold 18px system-ui, sans-serif';
  ctx.textAlign = 'center';
  for (const p of s.popups) {
    ctx.globalAlpha = Math.min(1, p.life * 2);
    ctx.fillStyle = p.color;
    ctx.fillText(p.text, p.x, p.y);
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  if (s.flash > 0) {
    ctx.fillStyle = `rgba(192, 38, 45, ${s.flash * 0.6})`;
    ctx.fillRect(0, 0, DUEL_W, DUEL_H);
  }

  // HUD: friend top-left, me bottom-left, clock top-right.
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fillRect(8, 8, 250, 30);
  ctx.fillRect(8, DUEL_H - 38, 250, 30);
  ctx.fillStyle = '#1f6feb';
  ctx.font = 'bold 14px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(names.them, 16, 23);
  drawHearts(ctx, 250, 23, s.theirHearts, 'right');
  ctx.fillStyle = '#c0262d';
  ctx.font = 'bold 14px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(names.me, 16, DUEL_H - 23);
  drawHearts(ctx, 250, DUEL_H - 23, s.hearts, 'right');
  for (let i = 0; i < DUEL_AMMO; i++) circle(ctx, DUEL_W - 24 - i * 18, DUEL_H - 23, 6, i < s.ammo ? '#7fb3e0' : '#dbe7f3');
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fillRect(DUEL_W - 78, 8, 70, 30);
  ctx.fillStyle = s.timeLeft <= 10 ? '#c0262d' : '#1a1a1a';
  ctx.font = 'bold 18px ui-monospace, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`${Math.ceil(Math.max(s.timeLeft, 0))}`, DUEL_W - 43, 24);

  if (phase === 'countdown') {
    ctx.fillStyle = 'rgba(26, 26, 26, 0.35)';
    ctx.fillRect(0, 0, DUEL_W, DUEL_H);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 96px system-ui, sans-serif';
    ctx.fillText(s.countdown > 0 ? String(Math.ceil(s.countdown)) : '시작!', DUEL_W / 2, DUEL_H / 2);
  }
}

// ---- component -------------------------------------------------------------------

interface SnowballDuelProps {
  onBack: () => void;
  onClose: () => void;
}

const OUTCOME_TEXT: Record<DuelOutcome, string> = { win: '🏆 이겼어요!', lose: '졌어요… 한 판 더?', draw: '무승부!' };

export default function SnowballDuel({ onBack, onClose }: SnowballDuelProps) {
  const { user, profile } = useAuth();
  const myName = profile?.display_name || (user ? user.email?.split('@')[0] ?? '나' : '손님');
  const myId = useRef(Math.random().toString(36).slice(2, 10)).current;

  const [phase, setPhaseState] = useState<Phase>('lobby');
  const phaseRef = useRef<Phase>('lobby');
  const setPhase = (p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  };
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [friend, setFriend] = useState<{ id: string; name: string } | null>(null);
  const friendRef = useRef<{ id: string; name: string } | null>(null);
  const [outcome, setOutcome] = useState<DuelOutcome | null>(null);
  const [tally, setTally] = useState({ me: 0, them: 0 });
  const [againSent, setAgainSent] = useState(false);
  const [lockedUntil, setLockedUntil] = useState<string | null>(() => gameLockedUntil());
  const [muted, setMuted] = useState(readMuted);
  const mutedRef = useRef(muted);

  const isHost = useRef(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const simRef = useRef<Sim>(newSim());
  const namesRef = useRef({ me: myName, them: '친구' });
  const again = useRef({ mine: false, theirs: false });
  const judgeTimer = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sfxRef = useRef<Sfx | null>(null);
  if (!sfxRef.current) sfxRef.current = new Sfx();

  namesRef.current = { me: myName, them: friend?.name ?? '친구' };

  const send = useCallback((m: Msg) => {
    void channelRef.current?.send({ type: 'broadcast', event: 'm', payload: m });
  }, []);

  const leaveChannel = useCallback(() => {
    const ch = channelRef.current;
    if (!ch) return;
    void ch.send({ type: 'broadcast', event: 'm', payload: { t: 'bye' } satisfies Msg });
    void supabase.removeChannel(ch);
    channelRef.current = null;
  }, []);

  useEffect(() => () => {
    leaveChannel();
    sfxRef.current?.close();
    if (judgeTimer.current) window.clearTimeout(judgeTimer.current);
  }, [leaveChannel]);

  const finish = useCallback((o: DuelOutcome) => {
    if (phaseRef.current === 'over') return;
    if (judgeTimer.current) {
      window.clearTimeout(judgeTimer.current);
      judgeTimer.current = null;
    }
    setOutcome(o);
    setTally((t) => ({ me: t.me + (o === 'win' ? 1 : 0), them: t.them + (o === 'lose' ? 1 : 0) }));
    simRef.current.sounds.push(o === 'win' ? 'win' : 'over');
    again.current = { mine: false, theirs: false };
    setAgainSent(false);
    setPhase('over');
  }, []);

  const beginRound = useCallback(() => {
    simRef.current = newSim();
    setOutcome(null);
    setAgainSent(false);
    again.current = { mine: false, theirs: false };
    setPhase('countdown');
  }, []);

  const startIfBothReady = useCallback(() => {
    if (isHost.current && again.current.mine && again.current.theirs) {
      send({ t: 'start' });
      beginRound();
    }
  }, [beginRound, send]);

  const onMessage = useCallback((m: Msg) => {
    const s = simRef.current;
    switch (m.t) {
      case 'start':
        beginRound();
        return;
      case 'state':
        s.themTarget = mirror({ x: m.x, y: m.y });
        s.theirHearts = m.h;
        s.theirWalls = m.w;
        return;
      case 'throw':
        s.theirBalls.push(mirrorBall(m.b));
        s.theirThrowAnim = 0.2;
        return;
      case 'hitMe': {
        const b = s.myBalls.find((x) => x.id === m.id);
        s.myBalls = s.myBalls.filter((x) => x.id !== m.id);
        s.theirHearts = m.h;
        burst(s, b?.x ?? s.them.x, b?.y ?? s.them.y + 22, 16);
        s.popups.push({ x: s.them.x, y: s.them.y + 60, text: '맞았다!', life: 0.8, color: '#1a7f37' });
        s.sounds.push('hit');
        return;
      }
      case 'hitWall': {
        const b = s.myBalls.find((x) => x.id === m.id);
        s.myBalls = s.myBalls.filter((x) => x.id !== m.id);
        s.theirWalls = s.theirWalls.map((hp, i) => (i === m.i ? m.hp : hp));
        if (b) burst(s, b.x, b.y, 8);
        s.sounds.push('thud');
        return;
      }
      case 'dead':
        finish('win');
        return;
      case 'end':
        finish(m.hostOutcome === 'win' ? 'lose' : m.hostOutcome === 'lose' ? 'win' : 'draw');
        return;
      case 'again':
        again.current.theirs = true;
        startIfBothReady();
        return;
      case 'bye':
        if (phaseRef.current !== 'lobby') setPhase('left');
        return;
    }
  }, [beginRound, finish, startIfBothReady]);

  const connect = useCallback((roomCode: string, host: boolean) => {
    if (!isSupabaseConfigured) {
      setError('지금은 대결 서버에 연결할 수 없어요.');
      return;
    }
    leaveChannel();
    isHost.current = host;
    setCode(roomCode);
    setFriend(null);
    friendRef.current = null;
    setTally({ me: 0, them: 0 });
    setError('');
    setPhase(host ? 'hosting' : 'connecting');

    const ch = supabase.channel(channelName(roomCode), {
      config: { broadcast: { self: false }, presence: { key: myId } },
    });
    channelRef.current = ch;
    ch.on('broadcast', { event: 'm' }, ({ payload }) => onMessage(payload as Msg));
    ch.on('presence', { event: 'sync' }, () => {
      const people = Object.values(ch.presenceState<{ id: string; name: string; host: boolean }>()).flat();
      const others = people.filter((p) => p.id !== myId);
      if (!host && others.length > 1 && phaseRef.current === 'connecting') {
        setError('이 방은 이미 두 명이 대결 중이에요.');
        leaveChannel();
        setPhase('joining');
        return;
      }
      const other = others[0] ?? null;
      if (other && !friendRef.current) {
        friendRef.current = { id: other.id, name: other.name };
        setFriend(friendRef.current);
        if (host && phaseRef.current === 'hosting') {
          send({ t: 'start' });
          beginRound();
        }
      } else if (!other && friendRef.current && phaseRef.current !== 'lobby') {
        setPhase('left');
      }
    });
    ch.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await ch.track({ id: myId, name: myName, host });
        if (!host) {
          // No host in the room after a few seconds: wrong code.
          window.setTimeout(() => {
            if (phaseRef.current === 'connecting' && !friendRef.current) {
              setError(`${roomCode}번 방이 없어요. 친구 화면의 숫자를 다시 확인해 주세요.`);
              leaveChannel();
              setPhase('joining');
            }
          }, 4000);
        }
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        setError('연결하지 못했어요. 잠시 후 다시 해 주세요.');
        setPhase(host ? 'lobby' : 'joining');
      }
    });
  }, [beginRound, leaveChannel, myId, myName, onMessage, send]);

  // ---- the loop --------------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = DUEL_W * dpr;
    canvas.height = DUEL_H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    let raf = 0;
    let last = performance.now();
    let lockCheck = 0;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const s = simRef.current;
      const ph = phaseRef.current;

      lockCheck -= dt;
      if (lockCheck <= 0) {
        lockCheck = 1;
        const until = gameLockedUntil();
        setLockedUntil(until);
        if (until && channelRef.current) {
          leaveChannel();
          setPhase('lobby');
        }
      }

      if (ph === 'countdown') {
        s.countdown -= dt;
        if (s.countdown <= -0.5) setPhase('playing');
      }

      // Effects always run so hits finish animating after the end.
      s.shake = Math.max(0, s.shake - dt);
      s.flash = Math.max(0, s.flash - dt);
      s.puffs = s.puffs.filter((p) => (p.life -= dt) > 0).map((p) => ({ ...p, x: p.x + p.vx * dt, y: p.y + p.vy * dt }));
      s.popups = s.popups.filter((p) => (p.life -= dt) > 0).map((p) => ({ ...p, y: p.y - 30 * dt }));
      s.them = { x: s.them.x + (s.themTarget.x - s.them.x) * Math.min(1, dt * 12), y: s.them.y + (s.themTarget.y - s.them.y) * Math.min(1, dt * 12) };
      s.theirThrowAnim = Math.max(0, s.theirThrowAnim - dt);

      if (ph === 'playing') {
        // Me
        const kx = (s.keys.r ? 1 : 0) - (s.keys.l ? 1 : 0);
        const ky = (s.keys.d ? 1 : 0) - (s.keys.u ? 1 : 0);
        if (kx || ky) {
          const len = Math.hypot(kx, ky);
          s.me = clampToHalf({ x: s.me.x + (kx / len) * DUEL_SPEED * dt, y: s.me.y + (ky / len) * DUEL_SPEED * dt });
          s.moveTo = null;
        } else if (s.moveTo) {
          const dx = s.moveTo.x - s.me.x;
          const dy = s.moveTo.y - s.me.y;
          const d = Math.hypot(dx, dy);
          const stepLen = Math.min(d, DUEL_SPEED * dt);
          s.me = clampToHalf(d < 1 ? s.moveTo : { x: s.me.x + (dx / d) * stepLen, y: s.me.y + (dy / d) * stepLen });
        }
        s.invulnerable = Math.max(0, s.invulnerable - dt);
        s.throwAnim = Math.max(0, s.throwAnim - dt);
        if (s.ammo < DUEL_AMMO) {
          s.regen += dt;
          if (s.regen >= DUEL_AMMO_REGEN) {
            s.regen = 0;
            s.ammo += 1;
          }
        }

        // My balls fly; the friend's screen says when they land.
        s.myBalls = s.myBalls.map((b) => moveBall(b, dt)).filter((b) => !offField(b));

        // Their balls: judged here.
        const keep: DuelBall[] = [];
        let changed = false;
        for (const raw of s.theirBalls) {
          const b = moveBall(raw, dt);
          if (offField(b)) continue;
          const wi = wallHit(b, s.walls);
          if (wi >= 0) {
            s.walls = s.walls.map((hp, i) => (i === wi ? hp - 1 : hp));
            burst(s, b.x, b.y, 9);
            s.sounds.push('thud');
            send({ t: 'hitWall', id: b.id, i: wi, hp: s.walls[wi] });
            changed = true;
            continue;
          }
          if (s.invulnerable <= 0 && playerHit(b, s.me)) {
            s.hearts -= 1;
            s.invulnerable = INVULNERABLE_SECONDS;
            s.shake = 0.3;
            s.flash = 0.35;
            burst(s, s.me.x, s.me.y - 22, 18);
            s.sounds.push('hurt');
            send({ t: 'hitMe', id: b.id, h: s.hearts });
            changed = true;
            continue;
          }
          keep.push(b);
        }
        s.theirBalls = keep;

        // Tell the friend where I am: on a change, else once a second.
        s.sentAt += dt;
        const moved = Math.abs(s.me.x - s.sentPos.x) + Math.abs(s.me.y - s.sentPos.y) > 1;
        if (changed || (moved && s.sentAt >= 1 / STATE_HZ) || s.sentAt >= 1) {
          s.sentAt = 0;
          s.sentPos = { ...s.me };
          send({ t: 'state', x: Math.round(s.me.x), y: Math.round(s.me.y), h: s.hearts, w: s.walls });
        }

        if (s.hearts <= 0) {
          send({ t: 'dead' });
          finish('lose');
        } else {
          s.timeLeft -= dt;
          if (s.timeLeft <= 0) {
            // The host's screen calls a timeout, so both agree; the friend
            // falls back to its own call if that message never comes.
            const mine = outcomeAtTime({ hearts: s.hearts, walls: s.walls }, { hearts: s.theirHearts, walls: s.theirWalls });
            if (isHost.current) {
              send({ t: 'end', hostOutcome: mine });
              finish(mine);
            } else {
              setPhase('judging');
              judgeTimer.current = window.setTimeout(() => finish(mine), 2500);
            }
          }
        }
      }

      if (s.sounds.length) {
        if (!mutedRef.current) for (const snd of new Set(s.sounds)) sfxRef.current?.play(snd);
        s.sounds.length = 0;
      }
      draw(ctx, s, namesRef.current, phaseRef.current);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [finish, leaveChannel, send]);

  const throwAt = useCallback((target: Point) => {
    const s = simRef.current;
    if (phaseRef.current !== 'playing' || s.ammo <= 0) return;
    s.ammo -= 1;
    s.seq += 1;
    const b = throwToward(s.me, target, `${myId}-${s.seq}`);
    s.myBalls.push(b);
    s.throwAnim = 0.2;
    s.sounds.push('throw');
    send({ t: 'throw', b: { ...b, x: Math.round(b.x), y: Math.round(b.y), vx: Math.round(b.vx), vy: Math.round(b.vy) } });
  }, [myId, send]);

  // Keyboard: WASD / arrows move in 2D, Space throws straight ahead. e.code,
  // so the Korean IME doesn't turn A into 'ㅁ'.
  useEffect(() => {
    const onKey = (e: KeyboardEvent, down: boolean) => {
      if (e.key === 'Escape' && down) {
        onClose();
        return;
      }
      if ((e.target as HTMLElement | null)?.tagName === 'INPUT') return;
      const k = simRef.current.keys;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') k.l = down;
      else if (e.code === 'KeyD' || e.code === 'ArrowRight') k.r = down;
      else if (e.code === 'KeyW' || e.code === 'ArrowUp') k.u = down;
      else if (e.code === 'KeyS' || e.code === 'ArrowDown') k.d = down;
      else if (e.code === 'Space') {
        if (down && !e.repeat) throwAt({ x: simRef.current.me.x, y: 0 });
      } else return;
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
  }, [onClose, throwAt]);

  // Pointer: on my half it walks there, above it throws there.
  const dragging = useRef(false);
  const toField = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * DUEL_W, y: ((e.clientY - r.top) / r.height) * DUEL_H };
  };
  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (phaseRef.current !== 'playing') return;
    const p = toField(e);
    e.currentTarget.setPointerCapture(e.pointerId);
    if (p.y >= HALF_TOP - 20) {
      dragging.current = true;
      simRef.current.moveTo = clampToHalf(p);
    } else {
      throwAt(p);
    }
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (dragging.current) simRef.current.moveTo = clampToHalf(toField(e));
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  const toggleMute = () => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    try {
      localStorage.setItem(MUTE_KEY, next ? '1' : '0');
    } catch {
      // Storage blocked: muted for now only.
    }
  };

  const host = () => {
    sfxRef.current?.unlock();
    connect(makeRoomCode(), true);
  };
  const join = () => {
    sfxRef.current?.unlock();
    const c = input.trim();
    if (!isRoomCode(c)) {
      setError('숫자 네 자리를 넣어 주세요.');
      return;
    }
    connect(c, false);
  };
  const backToLobby = () => {
    leaveChannel();
    setFriend(null);
    friendRef.current = null;
    setPhase('lobby');
  };
  const askAgain = () => {
    again.current.mine = true;
    setAgainSent(true);
    send({ t: 'again' });
    startIfBothReady();
  };

  const overlay = lockedUntil || !['playing', 'countdown'].includes(phase);

  return (
    <div className="snowball-game" role="dialog" aria-modal="true" aria-label="친구랑 눈싸움" onClick={onClose}>
      <div className="snowball-game-panel" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button onClick={() => { backToLobby(); onBack(); }} aria-label="혼자 하기로 돌아가기" title="혼자 하기로" style={{ background: 'transparent', border: '1px solid var(--border-subtle)', padding: '0.35rem', cursor: 'pointer', display: 'flex' }}>
              <ArrowLeft size={16} />
            </button>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1a1a1a' }}>⛄ 친구랑 눈싸움</span>
            {code && phase !== 'lobby' && phase !== 'joining' && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                방 {code}{friend ? ` · ${tally.me} : ${tally.them}` : ''}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button onClick={toggleMute} aria-label={muted ? '소리 켜기' : '소리 끄기'} style={{ background: 'transparent', border: '1px solid var(--border-subtle)', padding: '0.35rem', cursor: 'pointer', display: 'flex' }}>
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <button onClick={onClose} aria-label="닫기" style={{ background: 'transparent', border: '1px solid var(--border-subtle)', padding: '0.35rem', cursor: 'pointer', display: 'flex' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="snowball-game-stage" style={{ position: 'relative', width: '100%', aspectRatio: `${DUEL_W} / ${DUEL_H}`, background: '#eaf2fa' }}>
          <canvas
            ref={canvasRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{ width: '100%', height: '100%', display: 'block', touchAction: 'none', cursor: phase === 'playing' ? 'crosshair' : 'default' }}
          />
          {overlay && (
            <div className="snowball-game-overlay">
              {lockedUntil ? (
                <>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>📚 지금은 수업 시간이에요</div>
                  <div style={{ fontSize: '0.9rem' }}>눈싸움은 <b>{lockedUntil}</b>부터 다시 할 수 있어요.</div>
                  <button className="btn-primary" onClick={onClose}>닫기</button>
                </>
              ) : phase === 'lobby' ? (
                <>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>👥 친구랑 눈싸움</div>
                  <div style={{ fontSize: '0.85rem', textAlign: 'center', lineHeight: 1.7 }}>
                    한 명이 방을 만들고, 다른 한 명이 방 번호를 넣으면 시작해요.
                    <br />
                    하트 {DUEL_HEARTS}개를 먼저 다 잃으면 져요. {DUEL_SECONDS}초가 지나면 하트가 많은 쪽이 이겨요.
                  </div>
                  {error && <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffd1d1' }}>{error}</div>}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button className="btn-primary" onClick={host}>방 만들기</button>
                    <button className="btn-secondary" onClick={() => { setError(''); setInput(''); setPhase('joining'); }}>방 번호 넣기</button>
                  </div>
                </>
              ) : phase === 'joining' || phase === 'connecting' ? (
                <form onSubmit={(e) => { e.preventDefault(); join(); }} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', alignItems: 'center' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>친구 화면에 보이는 방 번호</div>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    inputMode="numeric"
                    autoFocus
                    placeholder="0000"
                    aria-label="방 번호"
                    style={{ width: '9rem', fontSize: '2rem', fontWeight: 900, letterSpacing: '0.3em', textAlign: 'center', padding: '0.3rem', border: '2px solid #ffffff', background: 'rgba(255,255,255,0.95)', color: '#1a1a1a', fontFamily: 'var(--font-mono)' }}
                  />
                  {error && <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffd1d1', textAlign: 'center' }}>{error}</div>}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="button" className="btn-secondary" onClick={backToLobby}>뒤로</button>
                    <button type="submit" className="btn-primary" disabled={phase === 'connecting'}>{phase === 'connecting' ? '찾는 중…' : '들어가기'}</button>
                  </div>
                </form>
              ) : phase === 'hosting' ? (
                <>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>친구에게 이 번호를 알려 주세요</div>
                  <div style={{ fontSize: '4rem', fontWeight: 900, letterSpacing: '0.2em', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>{code}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>친구가 「방 번호 넣기」로 들어오면 바로 시작해요…</div>
                  <button className="btn-secondary" onClick={backToLobby}>취소</button>
                </>
              ) : phase === 'judging' ? (
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>시간 끝! 판정 중…</div>
              ) : phase === 'over' && outcome ? (
                <>
                  <div style={{ fontSize: '2rem', fontWeight: 900 }}>{OUTCOME_TEXT[outcome]}</div>
                  <div style={{ fontSize: '0.9rem' }}>{myName} {tally.me} : {tally.them} {friend?.name ?? '친구'}</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-primary" onClick={askAgain} disabled={againSent}>{againSent ? '친구를 기다리는 중…' : '한 판 더'}</button>
                    <button className="btn-secondary" onClick={backToLobby}>그만하기</button>
                  </div>
                </>
              ) : phase === 'left' ? (
                <>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>친구가 나갔어요</div>
                  <button className="btn-primary" onClick={backToLobby}>처음으로</button>
                </>
              ) : null}
            </div>
          )}
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          이동: WASD·방향키 또는 내 쪽(아래) 눈밭을 끌기 · 던지기: 친구 쪽(위)을 클릭·탭, 스페이스는 앞으로 · 눈 벽 뒤에 숨으세요 · Esc 닫기
        </div>
      </div>
    </div>
  );
}
