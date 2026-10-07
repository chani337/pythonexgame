// Unit tests for the small pure functions the app leans on everywhere. None
// of them have a test today, and two of them (the Oracle translator and the
// profanity filter) are string-munging code where a regex tweak has
// non-obvious reach.
import { describe, it, expect } from 'vitest';
import { decodeAnswer } from '../src/utils/answerObfuscation';
import { checkKeywords } from '../src/utils/checkKeywords';
import { isProfaneOrForbidden } from '../src/utils/profanityFilter';
import { translateOracleSqlToSqlite, translateOracleOuterJoinToAnsi } from '../src/utils/oracleToSqlite';

describe('decodeAnswer', () => {
  const b64 = (s: string) => Buffer.from(s, 'utf8').toString('base64');

  it('ASCII 를 왕복한다', () => {
    expect(decodeAnswer(b64('hello world'))).toBe('hello world');
  });

  it('한글을 왕복한다', () => {
    // The reason this isn't plain atob(): atob returns bytes, and Korean is
    // multi-byte UTF-8. Decoding without the TextDecoder step produces mojibake.
    expect(decodeAnswer(b64('김철수'))).toBe('김철수');
    expect(decodeAnswer(b64('정답은 42입니다'))).toBe('정답은 42입니다');
  });

  it('이모지와 개행을 왕복한다', () => {
    expect(decodeAnswer(b64('a\nb\tc'))).toBe('a\nb\tc');
    expect(decodeAnswer(b64('🔥 통과'))).toBe('🔥 통과');
  });

  it('빈 문자열을 처리한다', () => {
    expect(decodeAnswer('')).toBe('');
  });

  it('base64 가 아니면 throw 한다', () => {
    // Callers in the grader don't guard, so this has to be loud rather than
    // silently returning garbage.
    expect(() => decodeAnswer('!!!not base64!!!')).toThrow();
  });
});

describe('checkKeywords', () => {
  it('아무 조건도 없으면 통과다', () => {
    expect(checkKeywords('print(1)')).toEqual({ ok: true, missingRequired: [], presentForbidden: [] });
  });

  it('필수 키워드를 찾는다', () => {
    expect(checkKeywords('for i in range(3): print(i)', ['for']).ok).toBe(true);
    expect(checkKeywords('print(1)', ['for']).missingRequired).toEqual(['for']);
  });

  it('금지 키워드를 잡는다', () => {
    expect(checkKeywords('import os', [], ['import']).presentForbidden).toEqual(['import']);
  });

  it('bare word 는 단어 경계로 찾는다 — 이게 이 모듈의 존재 이유다', () => {
    // A plain substring check would find 'in' inside 'print' and 'or' inside
    // 'for', which makes the required-keyword check pass for almost anything.
    expect(checkKeywords('print(1)', ['in']).missingRequired).toEqual(['in']);
    expect(checkKeywords('for i in x: pass', ['in']).ok).toBe(true);
    expect(checkKeywords('for x in y: pass', ['or']).missingRequired).toEqual(['or']);
    expect(checkKeywords('a or b', ['or']).ok).toBe(true);
    expect(checkKeywords('joined = 1', ['in']).missingRequired).toEqual(['in']);
  });

  it('bare word 가 아닌 토큰은 부분 문자열로 찾는다', () => {
    // Method and operator tokens have no word boundary to anchor on.
    expect(checkKeywords('x.append(1)', ['.append']).ok).toBe(true);
    expect(checkKeywords('[i*2 for i in x]', ['[', ']']).ok).toBe(true);
  });

  it('대소문자를 구분하지 않는다 (SQL 때문)', () => {
    expect(checkKeywords('select * from t where x=1', ['WHERE']).ok).toBe(true);
    expect(checkKeywords('SELECT DISTINCT a FROM t', ['distinct']).ok).toBe(true);
  });

  it('정규식 특수문자가 들어간 토큰이 깨지지 않는다', () => {
    expect(checkKeywords('a + b', ['+']).ok).toBe(true);
    expect(checkKeywords('f(x)', ['(']).ok).toBe(true);
    expect(checkKeywords('a.b', ['.']).ok).toBe(true);
  });

  it('필수와 금지를 동시에 평가한다', () => {
    const r = checkKeywords('print(sum(x))', ['for'], ['sum']);
    expect(r).toEqual({ ok: false, missingRequired: ['for'], presentForbidden: ['sum'] });
  });
});

describe('isProfaneOrForbidden', () => {
  it('빈 값은 통과다', () => {
    expect(isProfaneOrForbidden('')).toBe(false);
  });

  it('명백한 욕설을 잡는다', () => {
    for (const w of ['시발', '씨발', '병신', '개새끼', '존나', 'fuck', 'shit'])
      expect(isProfaneOrForbidden(w), w).toBe(true);
  });

  it('공백·기호·숫자 삽입 회피를 잡는다', () => {
    // This is what normalizeText exists for.
    for (const w of ['시 발', '씨1발', '시_발', '씨.발', '노_무_현', 'ㅅ시발'])
      expect(isProfaneOrForbidden(w), w).toBe(true);
  });

  it('정상적인 닉네임을 통과시킨다', () => {
    const fine = [
      'algorithm', 'Python', 'JavaScript', 'SQL', 'TypeScript', 'React',
      '코딩왕', '파이썬', '알고리즘', '개발자', '초보', '학생', '선생님',
      '민수', '영희', '김철수', '데이터', '리스트', '함수', '반복문', '조건문',
      '고수', '뉴비', 'master', 'coder', '자바', '씨언어', '직장인', '예술인',
    ];
    const flagged = fine.filter((w) => isProfaneOrForbidden(w));
    expect(flagged).toEqual([]);
  });

  it('현재 오탐하는 정상 단어들 — 의도된 상태가 아니라 기록이다', () => {
    // FORBIDDEN_WORDS is matched as a plain substring, so short entries hit
    // ordinary Korean. '라도' is the worst: it's a grammatical particle, so
    // any nickname ending in it is rejected. '성인', '재앙', '노무', '틀니',
    // '호구' are all ordinary words too.
    //
    // Left as-is deliberately -- changing the word list is a content decision,
    // not a cleanup. This test pins the list so a future fix shows up here
    // instead of passing unnoticed, and so the count can't quietly grow.
    const knownFalsePositives = [
      '하나라도', '그라도', '너라도', '바라도', '라도',   // ← '라도' (조사)
      '성인', '성인식', '성인용',                        // ← '성인'
      '재앙', '노무사', '틀니', '호구조사',               // ← '재앙' '노무' '틀니' '호구'
      '자살골', '살인마', '미친코딩',
    ];
    const stillFlagged = knownFalsePositives.filter((w) => isProfaneOrForbidden(w));
    expect(stillFlagged).toEqual(knownFalsePositives);
  });
});

describe('translateOracleOuterJoinToAnsi', () => {
  it('Oracle (+) 를 LEFT JOIN 으로 바꾼다', () => {
    const got = translateOracleOuterJoinToAnsi(
      'SELECT u.name, o.amount FROM users u, orders o WHERE u.id = o.user_id(+)'
    );
    expect(got).toMatch(/LEFT JOIN/i);
    expect(got).not.toContain('(+)');
  });

  it('반대쪽 (+) 도 처리한다', () => {
    const got = translateOracleOuterJoinToAnsi(
      'SELECT * FROM users u, orders o WHERE u.id(+) = o.user_id'
    );
    expect(got).toMatch(/LEFT JOIN/i);
    expect(got).not.toContain('(+)');
  });

  it('(+) 가 없으면 건드리지 않는다', () => {
    const sql = 'SELECT * FROM users WHERE id = 1';
    expect(translateOracleOuterJoinToAnsi(sql)).toBe(sql);
  });
});

describe('translateOracleSqlToSqlite', () => {
  it('NVL 을 IFNULL 로 바꾼다', () => {
    expect(translateOracleSqlToSqlite('SELECT NVL(a, 0) FROM t')).toMatch(/IFNULL\(a, 0\)/i);
  });

  it('FETCH FIRST n ROWS ONLY 를 LIMIT 으로 바꾼다', () => {
    const got = translateOracleSqlToSqlite('SELECT * FROM t ORDER BY a FETCH FIRST 5 ROWS ONLY');
    expect(got).toMatch(/LIMIT 5/i);
    expect(got).not.toMatch(/FETCH FIRST/i);
  });

  it('표준 SQL 은 그대로 둔다', () => {
    // Every one of the 36 SQL problems goes through this function, so a
    // translator that rewrites valid SQLite would break problems that never
    // used Oracle syntax at all.
    const sql = 'SELECT name, COUNT(*) AS c FROM users GROUP BY name HAVING COUNT(*) > 1 ORDER BY c DESC';
    expect(translateOracleSqlToSqlite(sql)).toBe(sql);
  });

  it('(+) 외부조인도 함께 처리한다', () => {
    const got = translateOracleSqlToSqlite(
      'SELECT u.name FROM users u, orders o WHERE u.id = o.user_id(+)'
    );
    expect(got).not.toContain('(+)');
  });

  it('빈 입력에서 throw 하지 않는다', () => {
    expect(() => translateOracleSqlToSqlite('')).not.toThrow();
  });
});
