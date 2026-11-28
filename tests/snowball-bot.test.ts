import { describe, expect, it } from 'vitest';
import { BOT_LEVELS, botReceive, botStep, newBot } from '../src/utils/snowballBot';
import { DUEL_HEARTS, HALF_BOTTOM, HALF_TOP, mirror, throwToward } from '../src/utils/snowballDuel';
import type { DuelMsg } from '../src/utils/snowballDuel';

// A fixed sequence instead of Math.random, so a run is repeatable.
function seeded(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const run = (bot: ReturnType<typeof newBot>, seconds: number) => {
  const out: DuelMsg[] = [];
  for (let t = 0; t < seconds; t += 1 / 60) out.push(...botStep(bot, 1 / 60));
  return out;
};

describe('AI 눈사람', () => {
  it('자기 진영 안에서만 움직인다', () => {
    const bot = newBot('hard', seeded(3));
    for (let t = 0; t < 20; t += 1 / 60) {
      botStep(bot, 1 / 60);
      expect(bot.me.y).toBeGreaterThanOrEqual(HALF_TOP);
      expect(bot.me.y).toBeLessThanOrEqual(HALF_BOTTOM);
    }
  });

  it('던지고, 위치를 알린다', () => {
    const out = run(newBot('normal', seeded(5)), 10);
    expect(out.filter((m) => m.t === 'throw').length).toBeGreaterThan(3);
    expect(out.some((m) => m.t === 'state')).toBe(true);
  });

  it('어려울수록 더 자주 던진다', () => {
    const count = (lv: 'easy' | 'hard') => run(newBot(lv, seeded(7)), 30).filter((m) => m.t === 'throw').length;
    expect(count('hard')).toBeGreaterThan(count('easy'));
  });

  it('플레이어를 겨눈다 (쉬움도 대체로 그쪽으로)', () => {
    const bot = newBot('hard', seeded(9));
    // Player stands at x=300 on their screen.
    botReceive(bot, { t: 'state', x: 300, y: 880, h: DUEL_HEARTS, w: [6, 6, 6, 6, 6] });
    const target = mirror({ x: 300, y: 880 });
    const throws = run(bot, 8).filter((m): m is Extract<DuelMsg, { t: 'throw' }> => m.t === 'throw');
    for (const { b } of throws) {
      // Heading toward the player's side and roughly at them.
      expect(b.vy).toBeLessThan(0);
      const tHit = (target.y - b.y) / b.vy;
      expect(Math.abs(b.x + b.vx * tHit - target.x)).toBeLessThan(BOT_LEVELS.hard.spread + 40);
    }
  });

  it('맞으면 하트가 줄고, 다 잃으면 dead', () => {
    const bot = newBot('easy', seeded(11));
    bot.goal = bot.me; // stand still
    bot.thinkIn = 999;
    const out: DuelMsg[] = [];
    for (let i = 0; i < DUEL_HEARTS; i++) {
      // A ball from straight in front of the bot, in the player's coordinates.
      const botOnPlayerScreen = mirror(bot.me);
      const ball = throwToward({ x: botOnPlayerScreen.x, y: botOnPlayerScreen.y + 300 }, botOnPlayerScreen, `p${i}`);
      // Fired from behind the bot's walls so none of them gets in the way.
      botReceive(bot, { t: 'throw', b: { ...ball, x: botOnPlayerScreen.x, y: botOnPlayerScreen.y + 60 } });
      out.push(...run(bot, 1.2));
    }
    expect(out.filter((m) => m.t === 'hitMe').length).toBe(DUEL_HEARTS);
    expect(out.some((m) => m.t === 'dead')).toBe(true);
    expect(bot.dead).toBe(true);
    expect(botStep(bot, 0.1)).toEqual([]);
  });
});
