import { describe, expect, it } from 'vitest';
import {
  channelName,
  clampToHalf,
  DUEL_BALL_SPEED,
  DUEL_H,
  DUEL_W,
  HALF_BOTTOM,
  HALF_TOP,
  isRoomCode,
  makeRoomCode,
  mirror,
  mirrorBall,
  moveBall,
  offField,
  outcomeAtTime,
  playerHit,
  throwToward,
  WALL_XS,
  WALL_Y,
  wallHit,
} from '../src/utils/snowballDuel';

describe('좌표 뒤집기', () => {
  it('친구 화면의 아래쪽은 내 화면의 위쪽', () => {
    expect(mirror({ x: 100, y: 450 })).toEqual({ x: DUEL_W - 100, y: DUEL_H - 450 });
  });

  it('두 번 뒤집으면 제자리', () => {
    const p = { x: 123, y: 321 };
    expect(mirror(mirror(p))).toEqual(p);
  });

  it('친구가 위로 던진 공은 내 화면에서 아래로 날아온다', () => {
    const b = mirrorBall({ id: 'a', x: 400, y: 420, vx: 10, vy: -600 });
    expect(b).toEqual({ id: 'a', x: 400, y: 80, vx: -10, vy: 600 });
  });

  it('양쪽이 같은 공을 같은 자리에서 본다', () => {
    const mine = throwToward({ x: 300, y: 450 }, { x: 500, y: 100 }, 'b');
    const theirs = mirrorBall(mine);
    const later = (b: typeof mine) => moveBall(b, 0.3);
    expect(mirrorBall(later(mine)).x).toBeCloseTo(later(theirs).x);
    expect(mirrorBall(later(mine)).y).toBeCloseTo(later(theirs).y);
  });
});

describe('던지기', () => {
  it('겨눈 곳으로 일정한 속도', () => {
    const b = throwToward({ x: 400, y: 450 }, { x: 400, y: 0 }, 'x');
    expect(b.vx).toBeCloseTo(0);
    expect(b.vy).toBeCloseTo(-DUEL_BALL_SPEED);
    expect(Math.hypot(throwToward({ x: 100, y: 450 }, { x: 700, y: 50 }, 'y').vx, throwToward({ x: 100, y: 450 }, { x: 700, y: 50 }, 'y').vy)).toBeCloseTo(DUEL_BALL_SPEED);
  });

  it('내 쪽이나 뒤를 겨눠도 앞으로 던진다', () => {
    const b = throwToward({ x: 400, y: 450 }, { x: 600, y: 470 }, 'z');
    expect(b.vx).toBe(0);
    expect(b.vy).toBeLessThan(0);
  });

  it('필드 밖으로 나가면 끝', () => {
    expect(offField({ x: 400, y: -30 })).toBe(true);
    expect(offField({ x: 400, y: 250 })).toBe(false);
  });
});

describe('맞힘 판정', () => {
  it('눈 벽', () => {
    expect(wallHit({ x: WALL_XS[1], y: WALL_Y }, [6, 6, 6])).toBe(1);
    expect(wallHit({ x: WALL_XS[1], y: WALL_Y }, [6, 0, 6])).toBe(-1);
    expect(wallHit({ x: 295, y: WALL_Y }, [6, 6, 6])).toBe(-1);
    expect(wallHit({ x: WALL_XS[0], y: WALL_Y + 60 }, [6, 6, 6])).toBe(-1);
  });

  it('사람은 발이 아니라 몸통', () => {
    expect(playerHit({ x: 400, y: 428 }, { x: 400, y: 450 })).toBe(true);
    expect(playerHit({ x: 440, y: 428 }, { x: 400, y: 450 })).toBe(false);
  });

  it('내 진영 밖으로는 못 나간다', () => {
    expect(clampToHalf({ x: -50, y: 100 })).toEqual({ x: 28, y: HALF_TOP });
    expect(clampToHalf({ x: 900, y: 900 })).toEqual({ x: DUEL_W - 28, y: HALF_BOTTOM });
  });
});

describe('시간이 다 되면', () => {
  it('하트가 많은 쪽, 같으면 남은 벽, 그것도 같으면 무승부', () => {
    expect(outcomeAtTime({ hearts: 3, walls: [0, 0, 0] }, { hearts: 2, walls: [6, 6, 6] })).toBe('win');
    expect(outcomeAtTime({ hearts: 2, walls: [6, 6, 0] }, { hearts: 2, walls: [6, 6, 6] })).toBe('lose');
    expect(outcomeAtTime({ hearts: 2, walls: [1, 2, 3] }, { hearts: 2, walls: [3, 2, 1] })).toBe('draw');
  });
});

describe('방 코드', () => {
  it('네 자리 숫자', () => {
    expect(makeRoomCode(() => 0)).toBe('1000');
    expect(makeRoomCode(() => 0.99999)).toBe('9999');
    expect(isRoomCode('0427')).toBe(true);
    expect(isRoomCode('12a4')).toBe(false);
    expect(isRoomCode('12345')).toBe(false);
  });

  it('채널 이름', () => {
    expect(channelName('1234')).toBe('snowball-duel-1234');
  });
});
