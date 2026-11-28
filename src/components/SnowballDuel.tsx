import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { ArrowLeft, Volume2, VolumeX, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DuelScene } from '../lib/duelScene';
import { gameLockedUntil } from '../utils/snowballGame';
import { MUTE_KEY, readMuted, Sfx } from '../utils/snowballSfx';
import type { SoundName } from '../utils/snowballSfx';
import { BOT_LEVELS, botReceive, botStep, newBot } from '../utils/snowballBot';
import type { Bot, BotLevel } from '../utils/snowballBot';
import {
  channelName,
  clampToHalf,
  DUEL_AMMO,
  DUEL_AMMO_REGEN,
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
  WALLS,
  wallHit,
} from '../utils/snowballDuel';
import type { DuelBall, DuelMsg, DuelOutcome, Point } from '../utils/snowballDuel';

// 눈싸움 대결, in 3D. Against a friend: two screens in one Supabase Realtime
// channel named by a four-digit room code; nothing is stored, the channel
// only relays messages while both are in it. Against the AI: the same
// messages, answered by src/utils/snowballBot.ts in this tab. Either way
// each side runs its own player and judges the snowballs that land on it
// (src/utils/snowballDuel.ts); DuelScene only draws.

type Phase = 'lobby' | 'hosting' | 'joining' | 'connecting' | 'countdown' | 'playing' | 'judging' | 'over' | 'left';

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
  themHit: number;
  timeLeft: number;
  countdown: number;
  puffs: { x: number; y: number; vx: number; vy: number; life: number }[];
  shake: number;
  sounds: SoundName[];
  sentAt: number;
  sentPos: Point;
  seq: number;
}

function newSim(): Sim {
  const me = { x: DUEL_W / 2, y: 880 };
  return {
    me,
    moveTo: null,
    keys: { l: false, r: false, u: false, d: false },
    hearts: DUEL_HEARTS,
    walls: WALLS.map(() => WALL_HP),
    ammo: DUEL_AMMO,
    regen: 0,
    invulnerable: 0,
    throwAnim: 0,
    myBalls: [],
    theirBalls: [],
    them: mirror(me),
    themTarget: mirror(me),
    theirHearts: DUEL_HEARTS,
    theirWalls: WALLS.map(() => WALL_HP),
    theirThrowAnim: 0,
    themHit: 0,
    timeLeft: DUEL_SECONDS,
    countdown: 3,
    puffs: [],
    shake: 0,
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

interface Hud {
  hearts: number;
  theirHearts: number;
  ammo: number;
  time: number;
  countdown: number;
}

const OUTCOME_TEXT: Record<DuelOutcome, string> = { win: '🏆 이겼어요!', lose: '졌어요… 한 판 더?', draw: '무승부!' };

interface SnowballDuelProps {
  onBack: () => void;
  onClose: () => void;
}

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
  const [hud, setHud] = useState<Hud>({ hearts: DUEL_HEARTS, theirHearts: DUEL_HEARTS, ammo: DUEL_AMMO, time: DUEL_SECONDS, countdown: 3 });
  const [webglError, setWebglError] = useState(false);

  const isHost = useRef(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  // Against the AI: the bot, and what the player said to it this frame.
  const botRef = useRef<Bot | null>(null);
  const [botLevel, setBotLevel] = useState<BotLevel | null>(null);
  const botInbox = useRef<DuelMsg[]>([]);
  const simRef = useRef<Sim>(newSim());
  const again = useRef({ mine: false, theirs: false });
  const judgeTimer = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<DuelScene | null>(null);
  const sfxRef = useRef<Sfx | null>(null);
  if (!sfxRef.current) sfxRef.current = new Sfx();

  const send = useCallback((m: DuelMsg) => {
    if (botRef.current) botInbox.current.push(m);
    else void channelRef.current?.send({ type: 'broadcast', event: 'm', payload: m });
  }, []);

  const leaveChannel = useCallback(() => {
    const ch = channelRef.current;
    if (!ch) return;
    void ch.send({ type: 'broadcast', event: 'm', payload: { t: 'bye' } satisfies DuelMsg });
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
    if (botRef.current) {
      botRef.current = newBot(botRef.current.level);
      botInbox.current = [];
    }
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

  const onMessage = useCallback((m: DuelMsg) => {
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
        s.theirThrowAnim = 0.25;
        return;
      case 'hitMe': {
        const b = s.myBalls.find((x) => x.id === m.id);
        s.myBalls = s.myBalls.filter((x) => x.id !== m.id);
        s.theirHearts = m.h;
        s.themHit = 0.35;
        burst(s, b?.x ?? s.them.x, b?.y ?? s.them.y, 18);
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
      setError('지금은 대결 서버에 연결할 수 없어요. 컴퓨터랑 해 보세요.');
      return;
    }
    leaveChannel();
    botRef.current = null;
    setBotLevel(null);
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
    ch.on('broadcast', { event: 'm' }, ({ payload }) => onMessage(payload as DuelMsg));
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
        setError('연결하지 못했어요. 잠시 후 다시 하거나 컴퓨터랑 해 보세요.');
        setPhase(host ? 'lobby' : 'joining');
      }
    });
  }, [beginRound, leaveChannel, myId, myName, onMessage, send]);

  const playBot = (level: BotLevel) => {
    sfxRef.current?.unlock();
    leaveChannel();
    isHost.current = true; // this tab calls the timeout
    botRef.current = newBot(level);
    setBotLevel(level);
    setFriend({ id: 'bot', name: `AI 눈사람 (${BOT_LEVELS[level].label})` });
    friendRef.current = null;
    setTally({ me: 0, them: 0 });
    setError('');
    setCode('');
    beginRound();
  };

  // ---- 3D scene ------------------------------------------------------------------
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    try {
      sceneRef.current = new DuelScene(el);
    } catch {
      setWebglError(true);
    }
    return () => {
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  // ---- the loop --------------------------------------------------------------------
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let lockCheck = 0;
    let hudIn = 0;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const s = simRef.current;
      const ph = phaseRef.current;

      lockCheck -= dt;
      if (lockCheck <= 0) {
        lockCheck = 1;
        const until = gameLockedUntil();
        setLockedUntil(until);
        if (until && (channelRef.current || botRef.current) && ph !== 'lobby') {
          leaveChannel();
          botRef.current = null;
          setPhase('lobby');
        }
      }

      if (ph === 'countdown') {
        s.countdown -= dt;
        if (s.countdown <= -0.5) setPhase('playing');
      }

      s.shake = Math.max(0, s.shake - dt);
      s.themHit = Math.max(0, s.themHit - dt);
      s.puffs = s.puffs.filter((p) => (p.life -= dt) > 0).map((p) => ({ ...p, x: p.x + p.vx * dt, y: p.y + p.vy * dt }));
      s.them = { x: s.them.x + (s.themTarget.x - s.them.x) * Math.min(1, dt * 12), y: s.them.y + (s.themTarget.y - s.them.y) * Math.min(1, dt * 12) };
      s.theirThrowAnim = Math.max(0, s.theirThrowAnim - dt);

      // Simulated in steps of at most 1/60 s: on a slow school PC drawing
      // the 3D field can drop to 10 fps, and one 0.1 s step would carry a
      // snowball (760 units/s) straight through a wall or a player.
      if (ph === 'playing') {
        const steps = Math.max(1, Math.ceil(dt * 60));
        const sdt = dt / steps;
        for (let step = 0; step < steps && phaseRef.current === 'playing'; step++) {
          // The AI hears what I sent last frame and answers.
          const bot = botRef.current;
          if (bot) {
            const inbox = botInbox.current;
            botInbox.current = [];
            inbox.forEach((m) => botReceive(bot, m));
            botStep(bot, sdt).forEach(onMessage);
          }

          const kx = (s.keys.r ? 1 : 0) - (s.keys.l ? 1 : 0);
          const ky = (s.keys.d ? 1 : 0) - (s.keys.u ? 1 : 0);
          if (kx || ky) {
            const len = Math.hypot(kx, ky);
            s.me = clampToHalf({ x: s.me.x + (kx / len) * DUEL_SPEED * sdt, y: s.me.y + (ky / len) * DUEL_SPEED * sdt });
            s.moveTo = null;
          } else if (s.moveTo) {
            const dx = s.moveTo.x - s.me.x;
            const dy = s.moveTo.y - s.me.y;
            const d = Math.hypot(dx, dy);
            const stepLen = Math.min(d, DUEL_SPEED * sdt);
            s.me = clampToHalf(d < 1 ? s.moveTo : { x: s.me.x + (dx / d) * stepLen, y: s.me.y + (dy / d) * stepLen });
          }
          s.invulnerable = Math.max(0, s.invulnerable - sdt);
          s.throwAnim = Math.max(0, s.throwAnim - sdt);
          if (s.ammo < DUEL_AMMO) {
            s.regen += sdt;
            if (s.regen >= DUEL_AMMO_REGEN) {
              s.regen = 0;
              s.ammo += 1;
            }
          }

          // My balls fly; the other side says when they land.
          s.myBalls = s.myBalls.map((b) => moveBall(b, sdt)).filter((b) => !offField(b));

          // Theirs: judged here.
          const keep: DuelBall[] = [];
          let changed = false;
          for (const raw of s.theirBalls) {
            const b = moveBall(raw, sdt);
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
              burst(s, s.me.x, s.me.y, 18);
              s.sounds.push('hurt');
              send({ t: 'hitMe', id: b.id, h: s.hearts });
              changed = true;
              continue;
            }
            keep.push(b);
          }
          s.theirBalls = keep;

          // Tell the other side where I am: on a change, else once a second.
          s.sentAt += sdt;
          const moved = Math.abs(s.me.x - s.sentPos.x) + Math.abs(s.me.y - s.sentPos.y) > 1;
          if (changed || (moved && s.sentAt >= 1 / STATE_HZ) || s.sentAt >= 1) {
            s.sentAt = 0;
            s.sentPos = { ...s.me };
            send({ t: 'state', x: Math.round(s.me.x), y: Math.round(s.me.y), h: s.hearts, w: s.walls });
          }

          if (s.hearts <= 0) {
            send({ t: 'dead' });
            finish('lose');
          } else if (phaseRef.current === 'playing') {
            s.timeLeft -= sdt;
            if (s.timeLeft <= 0) {
              // The host's screen calls a timeout so both agree; the friend
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
      }

      if (s.sounds.length) {
        if (!mutedRef.current) for (const snd of new Set(s.sounds)) sfxRef.current?.play(snd);
        s.sounds.length = 0;
      }
      sceneRef.current?.render(
        {
          me: s.me,
          them: s.them,
          walls: s.walls,
          theirWalls: s.theirWalls,
          balls: [...s.myBalls, ...s.theirBalls],
          meHurt: s.invulnerable > 0,
          themHit: s.themHit,
          meThrow: s.throwAnim,
          themThrow: s.theirThrowAnim,
          shake: s.shake,
          showThem: phaseRef.current !== 'left' && phaseRef.current !== 'hosting',
          puffs: s.puffs,
        },
        dt
      );
      // The HUD is HTML; refresh it ten times a second, not every frame.
      hudIn -= dt;
      if (hudIn <= 0) {
        hudIn = 0.1;
        setHud({ hearts: s.hearts, theirHearts: s.theirHearts, ammo: s.ammo, time: Math.max(0, Math.ceil(s.timeLeft)), countdown: s.countdown });
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [finish, leaveChannel, onMessage, send]);

  const throwAt = useCallback((target: Point) => {
    const s = simRef.current;
    if (phaseRef.current !== 'playing' || s.ammo <= 0) return;
    s.ammo -= 1;
    s.seq += 1;
    const b = throwToward(s.me, target, `${myId}-${s.seq}`);
    s.myBalls.push(b);
    s.throwAnim = 0.25;
    s.sounds.push('throw');
    send({ t: 'throw', b: { ...b, x: Math.round(b.x), y: Math.round(b.y), vx: Math.round(b.vx), vy: Math.round(b.vy) } });
  }, [myId, send]);

  // Keyboard: WASD / arrows move, Space throws straight ahead. e.code, so
  // the Korean IME doesn't turn A into 'ㅁ'.
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

  // Pointer: on my half it walks there, past the middle it throws there.
  const dragging = useRef(false);
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (phaseRef.current !== 'playing') return;
    const p = sceneRef.current?.pick(e.clientX, e.clientY);
    if (!p) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    if (p.y >= HALF_TOP - 20) {
      dragging.current = true;
      simRef.current.moveTo = clampToHalf(p);
    } else {
      throwAt(p);
    }
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const p = sceneRef.current?.pick(e.clientX, e.clientY);
    if (p) simRef.current.moveTo = clampToHalf(p);
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
    botRef.current = null;
    setBotLevel(null);
    setFriend(null);
    friendRef.current = null;
    setPhase('lobby');
  };
  const askAgain = () => {
    if (botRef.current) {
      beginRound();
      return;
    }
    again.current.mine = true;
    setAgainSent(true);
    send({ t: 'again' });
    startIfBothReady();
  };

  const overlay = lockedUntil || webglError || !['playing', 'countdown'].includes(phase);
  const inGame = ['countdown', 'playing', 'judging', 'over'].includes(phase);
  const theirName = friend?.name ?? '친구';
  const hearts = (n: number) => '❤️'.repeat(Math.max(n, 0)) + '🤍'.repeat(Math.max(DUEL_HEARTS - n, 0));

  return (
    <div className="snowball-game" role="dialog" aria-modal="true" aria-label="눈싸움 대결" onClick={onClose}>
      <div className="snowball-game-panel snowball-duel-panel" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button onClick={() => { backToLobby(); onBack(); }} aria-label="혼자 하기로 돌아가기" title="혼자 하기로" style={{ background: 'transparent', border: '1px solid var(--border-subtle)', padding: '0.35rem', cursor: 'pointer', display: 'flex' }}>
              <ArrowLeft size={16} />
            </button>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1a1a1a' }}>⛄ 눈싸움 대결</span>
            {inGame && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                {code ? `방 ${code} · ` : ''}{tally.me} : {tally.them}
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

        <div className="snowball-game-stage snowball-duel-stage" style={{ position: 'relative', width: '100%', background: '#bcd6ee' }}>
          <div
            ref={stageRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{ position: 'absolute', inset: 0, touchAction: 'none', cursor: phase === 'playing' ? 'crosshair' : 'default' }}
          />

          {inGame && (
            <>
              <div className="duel-hud duel-hud-top">
                <span style={{ color: '#1f6feb' }}>{theirName}</span>
                <span>{hearts(hud.theirHearts)}</span>
                <span className="duel-hud-time" style={{ color: hud.time <= 10 ? '#c0262d' : '#1a1a1a' }}>{hud.time}</span>
              </div>
              <div className="duel-hud duel-hud-bottom">
                <span style={{ color: '#c0262d' }}>{myName}</span>
                <span>{hearts(hud.hearts)}</span>
                <span aria-label={`눈덩이 ${hud.ammo}개`}>
                  {'●'.repeat(hud.ammo)}
                  <span style={{ opacity: 0.25 }}>{'●'.repeat(DUEL_AMMO - hud.ammo)}</span>
                </span>
              </div>
            </>
          )}
          {phase === 'countdown' && !lockedUntil && (
            <div className="duel-countdown">{hud.countdown > 0 ? Math.ceil(hud.countdown) : '시작!'}</div>
          )}

          {overlay && (
            <div className="snowball-game-overlay">
              {lockedUntil ? (
                <>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>📚 지금은 수업 시간이에요</div>
                  <div style={{ fontSize: '0.9rem' }}>눈싸움은 <b>{lockedUntil}</b>부터 다시 할 수 있어요.</div>
                  <button className="btn-primary" onClick={onClose}>닫기</button>
                </>
              ) : webglError ? (
                <>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>이 브라우저에서는 3D 화면을 띄울 수 없어요</div>
                  <button className="btn-primary" onClick={onBack}>혼자 하기로</button>
                </>
              ) : phase === 'lobby' ? (
                <>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>⛄ 눈싸움 대결</div>
                  <div style={{ fontSize: '0.85rem', textAlign: 'center', lineHeight: 1.7 }}>
                    하트 {DUEL_HEARTS}개를 먼저 다 잃으면 져요. {DUEL_SECONDS}초가 지나면 하트가 많은 쪽이 이겨요.
                  </div>
                  {error && <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffd1d1' }}>{error}</div>}
                  <div className="duel-lobby-row">
                    <span>👥 친구랑</span>
                    <button className="btn-primary" onClick={host}>방 만들기</button>
                    <button className="btn-secondary" onClick={() => { setError(''); setInput(''); setPhase('joining'); }}>방 번호 넣기</button>
                  </div>
                  <div className="duel-lobby-row">
                    <span>🤖 컴퓨터랑</span>
                    {(Object.keys(BOT_LEVELS) as BotLevel[]).map((lv) => (
                      <button key={lv} className="btn-secondary" onClick={() => playBot(lv)}>{BOT_LEVELS[lv].label}</button>
                    ))}
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
                  <div style={{ fontSize: '0.9rem' }}>{myName} {tally.me} : {tally.them} {theirName}</div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button className="btn-primary" onClick={askAgain} disabled={againSent}>{againSent ? '친구를 기다리는 중…' : '한 판 더'}</button>
                    {botLevel && botLevel !== 'hard' && outcome === 'win' && (
                      <button className="btn-secondary" onClick={() => playBot(botLevel === 'easy' ? 'normal' : 'hard')}>더 어렵게</button>
                    )}
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
          이동: WASD·방향키 또는 내 쪽 눈밭을 끌기 · 던지기: 상대 쪽을 클릭·탭, 스페이스는 앞으로 · 눈 벽 뒤에 숨으세요 · Esc 닫기
        </div>
      </div>
    </div>
  );
}
