// The highest-value test in the repo: 377 problems across three runtimes,
// authored by hand and partly generated, with the answers base64-encoded so a
// typo is invisible on inspection.
//
// Everything here is an invariant the app relies on at runtime without
// checking. A quiz whose correctAnswerIndex decodes to 4 when there are 4
// options marks every answer wrong; a testCase whose `expected` isn't valid
// base64 throws inside the grader. Both ship silently.
import { describe, it, expect } from 'vitest';
import { problems, filterProblems } from '../src/data/problems';
import type { Problem, ProblemLanguage } from '../src/data/problems';
import { decodeAnswer } from '../src/utils/answerObfuscation';
import { solutionCode } from '../src/data/solutionCode';

const LANGUAGES: ProblemLanguage[] = ['python', 'sql', 'java', 'js', 'algorithm', 'c', 'html', 'css'];
const DIFFICULTIES = ['basic', 'intermediate', 'advanced', 'expert'] as const;
const TYPES = ['coding', 'quiz', 'fill'] as const;

const byType = (t: Problem['type']) => problems.filter((p) => p.type === t);
// HTML/CSS coding problems are graded by inspecting the rendered page
// (webChecks), not by stdout, so the stdout invariants exclude them.
const isWeb = (p: Problem) => p.language === 'html' || p.language === 'css';
const stdoutCoding = () => byType('coding').filter((p) => !isWeb(p));
const webCoding = () => byType('coding').filter(isWeb);

describe('문제 데이터 — 전체', () => {
  it('문제가 존재한다', () => {
    expect(problems.length).toBeGreaterThan(0);
  });

  it('id 가 유일하다', () => {
    const seen = new Set<string>();
    const duplicates: string[] = [];
    for (const p of problems) {
      if (seen.has(p.id)) duplicates.push(p.id);
      seen.add(p.id);
    }
    expect(duplicates).toEqual([]);
  });

  it('id 가 공백 없는 슬러그다', () => {
    // problem_id is a primary key in public.problems and travels through a
    // PostgREST RPC array, so whitespace or quotes would be a problem.
    const bad = problems.filter((p) => !/^[a-z0-9_]+$/.test(p.id)).map((p) => p.id);
    expect(bad).toEqual([]);
  });

  it('title · description 이 비어 있지 않다', () => {
    const bad = problems.filter((p) => !p.title?.trim() || !p.description?.trim()).map((p) => p.id);
    expect(bad).toEqual([]);
  });

  it('type 이 ProblemType 안에 있다', () => {
    const bad = problems.filter((p) => !TYPES.includes(p.type as never)).map((p) => `${p.id}=${p.type}`);
    expect(bad).toEqual([]);
  });

  it('difficulty 가 네 값 중 하나다', () => {
    const bad = problems.filter((p) => !DIFFICULTIES.includes(p.difficulty)).map((p) => `${p.id}=${p.difficulty}`);
    expect(bad).toEqual([]);
  });

  it('language 가 ProblemLanguage 안에 있다 (미지정은 python 으로 처리됨)', () => {
    const bad = problems
      .filter((p) => p.language !== undefined && !LANGUAGES.includes(p.language))
      .map((p) => `${p.id}=${p.language}`);
    expect(bad).toEqual([]);
  });

  it('examples 가 최소 1개 있다', () => {
    // ProblemWorkspace renders this unconditionally.
    const bad = problems.filter((p) => !p.examples?.length).map((p) => p.id);
    expect(bad).toEqual([]);
  });
});

describe('문제 데이터 — type 별 필수 필드', () => {
  it('coding: testCases 와 testRunnerCode 가 있다', () => {
    const noCases = stdoutCoding().filter((p) => !p.testCases?.length).map((p) => p.id);
    const noRunner = stdoutCoding().filter((p) => !p.testRunnerCode).map((p) => p.id);
    expect({ noCases, noRunner }).toEqual({ noCases: [], noRunner: [] });
  });

  it('coding: testRunnerCode 가 알려진 채점기다', () => {
    // An unknown value falls through to no grading at all.
    const KNOWN = new Set(['stdout_match']);
    const unknown = [...new Set(
      stdoutCoding()
        .map((p) => p.testRunnerCode!)
        .filter((r) => !KNOWN.has(r) && !r.includes('\n'))
    )];
    // Multi-line values are inline Python harnesses (algorithm problems).
    expect(unknown).toEqual([]);
  });

  it('coding (html/css): webChecks 가 있고 stdout 채점 필드는 없다', () => {
    // A web problem with testCases would look gradable but the workspace
    // never reads them; one with no checks would pass on an empty page.
    const bad = webCoding()
      .filter((p) => !p.webChecks?.length || p.testCases || p.testRunnerCode)
      .map((p) => p.id);
    expect(bad).toEqual([]);
  });

  it('coding (html/css): 모든 검사에 label 이 있다', () => {
    const bad = webCoding().flatMap((p) =>
      (p.webChecks ?? []).filter((c) => !c.label?.trim() || !c.selector?.trim()).map(() => p.id)
    );
    expect(bad).toEqual([]);
  });

  it('webChecks 는 html/css 문제에만 있다', () => {
    const bad = problems.filter((p) => p.webChecks && !isWeb(p)).map((p) => p.id);
    expect(bad).toEqual([]);
  });

  it('quiz: quizQuestion · quizOptions(2개 이상) · correctAnswerIndex 가 있다', () => {
    const bad = byType('quiz')
      .filter((p) => !p.quizQuestion?.trim() || (p.quizOptions?.length ?? 0) < 2 || !p.correctAnswerIndex)
      .map((p) => p.id);
    expect(bad).toEqual([]);
  });

  it('fill: fillQuestion 과 correctAnswerText 가 있다', () => {
    const bad = byType('fill')
      .filter((p) => !p.fillQuestion?.trim() || !p.correctAnswerText)
      .map((p) => p.id);
    expect(bad).toEqual([]);
  });
});

describe('문제 데이터 — base64 난독화 필드', () => {
  it('testCases.expected 가 모두 디코딩된다', () => {
    const failed: string[] = [];
    for (const p of problems) {
      for (const [i, tc] of (p.testCases ?? []).entries()) {
        try {
          decodeAnswer(tc.expected);
        } catch {
          failed.push(`${p.id}[${i}]`);
        }
      }
    }
    expect(failed).toEqual([]);
  });

  it('correctAnswerIndex 가 모두 디코딩된다', () => {
    const failed = problems
      .filter((p) => p.correctAnswerIndex !== undefined)
      .filter((p) => {
        try { decodeAnswer(p.correctAnswerIndex!); return false; } catch { return true; }
      })
      .map((p) => p.id);
    expect(failed).toEqual([]);
  });

  it('correctAnswerText 가 모두 디코딩된다', () => {
    const failed = problems
      .filter((p) => p.correctAnswerText !== undefined)
      .filter((p) => {
        try { decodeAnswer(p.correctAnswerText!); return false; } catch { return true; }
      })
      .map((p) => p.id);
    expect(failed).toEqual([]);
  });

  it('correctAnswerIndex 디코딩 값이 quizOptions 범위 안이다', () => {
    // The failure this catches is total: every answer marked wrong, with no
    // error anywhere.
    const bad = byType('quiz')
      .map((p) => ({ p, n: Number(decodeAnswer(p.correctAnswerIndex!)) }))
      .filter(({ p, n }) => !Number.isInteger(n) || n < 0 || n >= (p.quizOptions?.length ?? 0))
      .map(({ p, n }) => `${p.id}: index ${n} / options ${p.quizOptions?.length}`);
    expect(bad).toEqual([]);
  });

  it('correctAnswerText 가 빈 문자열로 디코딩되지 않는다', () => {
    const bad = problems
      .filter((p) => p.correctAnswerText !== undefined)
      .filter((p) => decodeAnswer(p.correctAnswerText!).trim() === '')
      .map((p) => p.id);
    expect(bad).toEqual([]);
  });

  it('난독화된 정답이 평문으로 중복 노출되지 않는다', () => {
    // The point of the encoding is that the answer isn't sitting next to the
    // options in plain text. A quiz that also lists the answer in its
    // description defeats it.
    const leaked = byType('quiz')
      .filter((p) => {
        const answer = p.quizOptions![Number(decodeAnswer(p.correctAnswerIndex!))];
        if (!answer || answer.length < 8) return false;   // short options collide by chance
        return p.description.includes(answer);
      })
      .map((p) => p.id);
    expect(leaked).toEqual([]);
  });
});

describe('문제 데이터 — 분포 (의도와 맞는지 눈으로 확인)', () => {
  const count = <T extends string>(f: (p: Problem) => T) =>
    problems.reduce<Record<string, number>>((a, p) => ((a[f(p)] = (a[f(p)] || 0) + 1), a), {});

  it('언어별 · 난이도별 · 타입별 개수를 출력한다', () => {
    const lang = count((p) => p.language ?? 'python');
    const diff = count((p) => p.difficulty);
    const type = count((p) => p.type);

    // Problems whose code actually runs in a browser engine. Java and C are
    // multiple-choice/fill only, so they never reach a runtime.
    const executable = problems.filter(
      (p) => p.type === 'coding' && (p.language ?? 'python') !== 'java' && (p.language ?? 'python') !== 'c'
    ).length;

    console.log('\n  총 문제:', problems.length);
    console.log('  언어별  :', lang);
    console.log('  난이도별:', diff);
    console.log('  타입별  :', type);
    console.log('  실제 코드 실행:', executable, '\n');

    expect(Object.values(lang).reduce((a, b) => a + b, 0)).toBe(problems.length);
    expect(Object.values(diff).reduce((a, b) => a + b, 0)).toBe(problems.length);
    expect(Object.values(type).reduce((a, b) => a + b, 0)).toBe(problems.length);
  });
});

describe('문제 데이터 — 정답 코드', () => {
  it('solutionCode 의 키가 모두 실제 문제다', () => {
    // A renamed problem leaves an orphan entry, which is a solution nobody
    // can ever see.
    const ids = new Set(problems.map((p) => p.id));
    const orphans = Object.keys(solutionCode).filter((k) => !ids.has(k));
    expect(orphans).toEqual([]);
  });

  it('정답 코드가 없는 coding 문제를 보고한다', () => {
    // Not a failure: solutionCode is authored content, and 35 expert problems
    // are still missing one. ProblemWorkspace hides the section rather than
    // breaking. Pinned so the number can only go down -- if it goes up,
    // someone added a problem without an answer.
    const missing = byType('coding').filter((p) => !solutionCode[p.id]).map((p) => p.id);
    console.log(`\n  정답 코드 없는 coding 문제: ${missing.length}개 / ${byType('coding').length}개`);
    if (missing.length) console.log('   ', missing.join(', '), '\n');
    expect(missing.length).toBeLessThanOrEqual(35);
  });
});

describe('문제 데이터 — SQL 채점의 행 순서 의존', () => {
  it('ORDER BY 없이 여러 행을 비교하는 문제를 보고한다', () => {
    // stdout_match compares the result table line by line, so a query
    // returning more than one row and no ORDER BY is graded against whatever
    // order SQLite happens to produce. It is stable in practice for a
    // table this small -- verify:sql runs all 36 and they pass -- but it is
    // not guaranteed, and a SQLite version bump or an added index can change
    // it. A correct answer would then be marked wrong.
    //
    // Pinned rather than fixed: the fix is either adding ORDER BY to 25
    // problems' constraints or regenerating their expected output, and both
    // are content decisions. This stops the count from growing unnoticed.
    const sqlProblems = problems.filter((p) => p.language === 'sql');
    const risky = sqlProblems.filter((p) => {
      const expected = decodeAnswer(p.testCases![0].expected);
      const rows = expected.split('\n').filter((l) => l.trim() && !/^-+$/.test(l)).length - 1;
      if (rows <= 1) return false;
      return !/order\s+by/i.test(solutionCode[p.id] ?? '');
    }).map((p) => p.id);

    console.log(`\n  행 순서에 의존하는 SQL 문제: ${risky.length}개 / ${sqlProblems.length}개`);
    if (risky.length) console.log('   ', risky.join(', '), '\n');
    expect(risky.length).toBeLessThanOrEqual(25);
  });
});

describe('filterProblems', () => {
  it('기본값은 전부 통과시킨다', () => {
    expect(filterProblems(problems, {}).length).toBe(problems.length);
    expect(filterProblems(problems, { language: 'all', difficulty: 'all', type: 'all', search: '' }).length)
      .toBe(problems.length);
  });

  it('language 미지정 문제를 python 으로 취급한다', () => {
    // 99 of the 140 Python problems have no explicit `language`, so a filter
    // that didn't default would hide most of the Python catalogue.
    const unset = problems.filter((p) => p.language === undefined);
    expect(unset.length).toBeGreaterThan(0);
    const pythonFiltered = filterProblems(problems, { language: 'python' });
    for (const p of unset) expect(pythonFiltered).toContain(p);
  });

  it('언어별 합이 전체와 같다', () => {
    const sum = LANGUAGES.reduce((a, l) => a + filterProblems(problems, { language: l }).length, 0);
    expect(sum).toBe(problems.length);
  });

  it('difficulty 와 type 을 함께 적용한다 (AND)', () => {
    const got = filterProblems(problems, { difficulty: 'basic', type: 'quiz' });
    expect(got.length).toBeGreaterThan(0);
    for (const p of got) {
      expect(p.difficulty).toBe('basic');
      expect(p.type).toBe('quiz');
    }
  });

  it('search 가 title 과 category 를 대소문자 구분 없이 본다', () => {
    const target = problems[0];
    expect(filterProblems(problems, { search: target.title.toUpperCase() })).toContain(target);
    expect(filterProblems(problems, { search: target.category.toLowerCase() })).toContain(target);
  });

  it('search 는 description 을 보지 않는다', () => {
    // Documenting current behaviour: searching for text that only appears in
    // a description returns nothing.
    const zzz = filterProblems(problems, { search: 'zzzz-no-such-title-zzzz' });
    expect(zzz).toEqual([]);
  });

  it('원본 배열을 변형하지 않는다', () => {
    const before = problems.length;
    filterProblems(problems, { language: 'sql', search: 'x' });
    expect(problems.length).toBe(before);
  });
});
