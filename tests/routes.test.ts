// The routing table. Worth testing directly because every one of these cases
// is a URL someone can type, paste or arrive at from a search result, and the
// failure mode for a bad parse is a blank or wrong screen with no error.
import { describe, it, expect } from 'vitest';
import { parsePath, buildPath, staticPaths, routeForState, nextHistoryAction } from '../src/lib/routes';
import type { Route, ViewName } from '../src/lib/routes';
import { problems } from '../src/data/problems';

const VIEWS: ViewName[] = ['dashboard', 'problems', 'sandbox', 'docs', 'board', 'changelog'];

describe('parsePath', () => {
  it('루트는 대시보드다', () => {
    expect(parsePath('/')).toEqual({ view: 'dashboard' });
    expect(parsePath('')).toEqual({ view: 'dashboard' });
  });

  it('각 화면의 경로를 읽는다', () => {
    expect(parsePath('/problems')).toEqual({ view: 'problems' });
    expect(parsePath('/sandbox')).toEqual({ view: 'sandbox' });
    expect(parsePath('/docs')).toEqual({ view: 'docs' });
    expect(parsePath('/board')).toEqual({ view: 'board' });
    expect(parsePath('/changelog')).toEqual({ view: 'changelog' });
  });

  it('개별 문제 경로에서 id 를 뽑는다', () => {
    expect(parsePath('/problems/basic_part1_q3')).toEqual({
      view: 'problems',
      problemId: 'basic_part1_q3',
    });
  });

  it('학습가이드 카테고리를 읽는다', () => {
    expect(parsePath('/docs/css')).toEqual({ view: 'docs', docCategory: 'css' });
    expect(parsePath('/docs/python')).toEqual({ view: 'docs', docCategory: 'python' });
  });

  it('모르는 카테고리는 카테고리 없는 학습가이드로 떨어진다', () => {
    // Not the dashboard: the reader clearly wanted the guide.
    expect(parsePath('/docs/klingon')).toEqual({ view: 'docs' });
  });

  it('끝 슬래시와 앞 슬래시 누락을 허용한다', () => {
    expect(parsePath('/problems/')).toEqual({ view: 'problems' });
    expect(parsePath('problems')).toEqual({ view: 'problems' });
    expect(parsePath('//problems//')).toEqual({ view: 'problems' });
  });

  it('퍼센트 인코딩을 디코딩한다', () => {
    expect(parsePath('/problems/basic%5Fpart1%5Fq3')).toEqual({
      view: 'problems',
      problemId: 'basic_part1_q3',
    });
  });

  it('깨진 인코딩에서 throw 하지 않는다', () => {
    // decodeURIComponent('%E0%A4%A') throws; a malformed URL must not take
    // the app down on first render.
    expect(() => parsePath('/problems/%E0%A4%A')).not.toThrow();
  });

  it('모르는 경로는 대시보드다', () => {
    for (const p of ['/nope', '/admin', '/problems2', '/a/b/c/d', '/.well-known/x']) {
      expect(parsePath(p), p).toEqual({ view: 'dashboard' });
    }
  });

  it('뷰 이름과 겹치는 프로토타입 속성에 속지 않는다', () => {
    // A plain `segment in VIEW_SEGMENTS` check would accept these.
    for (const p of ['/constructor', '/toString', '/__proto__', '/hasOwnProperty']) {
      expect(parsePath(p), p).toEqual({ view: 'dashboard' });
    }
  });

  it('문제 경로의 세 번째 세그먼트는 무시한다', () => {
    expect(parsePath('/problems/basic_part1_q3/extra')).toEqual({
      view: 'problems',
      problemId: 'basic_part1_q3',
    });
  });
});

describe('buildPath', () => {
  it('각 화면의 경로를 만든다', () => {
    expect(buildPath({ view: 'dashboard' })).toBe('/');
    expect(buildPath({ view: 'problems' })).toBe('/problems');
    expect(buildPath({ view: 'docs' })).toBe('/docs');
    expect(buildPath({ view: 'sandbox' })).toBe('/sandbox');
  });

  it('문제와 카테고리를 붙인다', () => {
    expect(buildPath({ view: 'problems', problemId: 'sql_q1' })).toBe('/problems/sql_q1');
    expect(buildPath({ view: 'docs', docCategory: 'css' })).toBe('/docs/css');
  });

  it('화면과 맞지 않는 추가 정보는 무시한다', () => {
    // A stale problemId left on the route must not produce /dashboard/sql_q1.
    expect(buildPath({ view: 'dashboard', problemId: 'sql_q1' })).toBe('/');
    expect(buildPath({ view: 'sandbox', docCategory: 'css' })).toBe('/sandbox');
  });
});

describe('parsePath ∘ buildPath', () => {
  it('모든 화면에서 왕복한다', () => {
    for (const view of VIEWS) {
      const route: Route = { view };
      expect(parsePath(buildPath(route))).toEqual(route);
    }
  });

  it('모든 학습가이드 카테고리에서 왕복한다', () => {
    for (const c of ['python', 'sql', 'java', 'js', 'c', 'html', 'css'] as const) {
      const route: Route = { view: 'docs', docCategory: c };
      expect(parsePath(buildPath(route))).toEqual(route);
    }
  });

  it('377개 문제 id 전부에서 왕복한다', () => {
    // problems.test.ts asserts ids are [a-z0-9_]+; this asserts that holding
    // means every one of them survives a URL round trip.
    const broken = problems.filter((p) => {
      const parsed = parsePath(buildPath({ view: 'problems', problemId: p.id }));
      return parsed.view !== 'problems' || parsed.problemId !== p.id;
    }).map((p) => p.id);
    expect(broken).toEqual([]);
  });
});

describe('staticPaths', () => {
  it('중복이 없고 모두 parsePath 로 해석된다', () => {
    const paths = staticPaths();
    expect(new Set(paths).size).toBe(paths.length);
    for (const p of paths) {
      // Every advertised path must resolve to something other than the
      // fallback -- except '/', which legitimately is the dashboard.
      const r = parsePath(p);
      if (p !== '/') expect(r.view, p).not.toBe('dashboard');
    }
  });
});

describe('routeForState', () => {
  it('선택된 문제는 어느 화면에서 열었든 /problems/<id> 다', () => {
    // Opened from the guide: the view stays 'docs' so closing it returns
    // there, but the problem still needs its own address.
    expect(routeForState('docs', 'sql_q1', 'sql')).toEqual({
      view: 'problems',
      problemId: 'sql_q1',
    });
    expect(routeForState('problems', 'sql_q1', undefined)).toEqual({
      view: 'problems',
      problemId: 'sql_q1',
    });
  });

  it('문제가 없으면 화면과 카테고리를 쓴다', () => {
    expect(routeForState('docs', undefined, 'css')).toEqual({ view: 'docs', docCategory: 'css' });
    expect(routeForState('dashboard', undefined, undefined)).toEqual({
      view: 'dashboard',
      docCategory: undefined,
    });
  });

  it('카테고리가 남아 있어도 다른 화면 경로를 오염시키지 않는다', () => {
    // Leaving /docs/css for the sandbox must not produce /sandbox/css.
    expect(buildPath(routeForState('sandbox', undefined, 'css'))).toBe('/sandbox');
  });
});

describe('nextHistoryAction', () => {
  it('이미 맞으면 아무것도 하지 않는다', () => {
    // This is what stops the two sync directions from ping-ponging.
    expect(nextHistoryAction('/problems', { view: 'problems' }, false)).toEqual({ kind: 'none' });
    expect(nextHistoryAction('/', { view: 'dashboard' }, true)).toEqual({ kind: 'none' });
  });

  it('평소에는 push 한다 (뒤로가기가 동작하도록)', () => {
    expect(nextHistoryAction('/problems', { view: 'docs' }, false)).toEqual({
      kind: 'push',
      path: '/docs',
    });
  });

  it('첫 실행에서 경로가 정규형이 아니면 replace 한다', () => {
    // Entering on /nope or /problems/<deleted-id>: pushing would leave Back
    // pointing at a URL that resolves nowhere.
    expect(nextHistoryAction('/nope', { view: 'dashboard' }, true)).toEqual({
      kind: 'replace',
      path: '/',
    });
    expect(nextHistoryAction('/problems/gone', { view: 'problems' }, true)).toEqual({
      kind: 'replace',
      path: '/problems',
    });
  });

  it('정규 경로로 진입하면 첫 실행에도 아무 기록을 남기지 않는다', () => {
    for (const p of ['/', '/problems', '/docs/css', '/problems/sql_q1']) {
      const route = parsePath(p);
      expect(nextHistoryAction(p, route, true), p).toEqual({ kind: 'none' });
    }
  });

  it('문제 사이를 이동하면 각각 기록을 남긴다', () => {
    expect(
      nextHistoryAction('/problems/sql_q1', { view: 'problems', problemId: 'sql_q2' }, false)
    ).toEqual({ kind: 'push', path: '/problems/sql_q2' });
  });
});
