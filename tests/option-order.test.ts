import { describe, it, expect } from 'vitest';
import { optionOrder } from '../src/utils/optionOrder';
import { chapterQuizzes, quizAnswerId } from '../src/data/chapterQuizzes';
import { problems } from '../src/data/problems';
import { decodeAnswer } from '../src/utils/answerObfuscation';

describe('보기 순서 섞기', () => {
  it('모든 보기를 한 번씩 담은 순서다', () => {
    for (const n of [2, 3, 4, 5]) {
      expect([...optionOrder(n, 'seed')].sort()).toEqual(Array.from({ length: n }, (_, i) => i));
    }
  });

  it('같은 문제는 항상 같은 순서 (새로고침해도 그대로)', () => {
    expect(optionOrder(4, 'SQL_1_SELECT@v2:0')).toEqual(optionOrder(4, 'SQL_1_SELECT@v2:0'));
  });

  it('정답이 화면 첫 번째에 몰리지 않는다 — 학습 가이드 퀴즈', () => {
    // Before shuffling, 132 of 144 answers were the first option.
    const firsts = chapterQuizzes.flatMap((quiz) =>
      quiz.questions.map((q, i) => optionOrder(q.options.length, `${quizAnswerId(quiz)}:${i}`)[0] === q.correctIndex)
    );
    expect(firsts.filter(Boolean).length / firsts.length).toBeLessThan(0.4);
  });

  it('정답이 화면 첫 번째에 몰리지 않는다 — 객관식 문제', () => {
    const quiz = problems.filter((p) => p.type === 'quiz' && p.quizOptions);
    const firsts = quiz.map((p) => optionOrder(p.quizOptions!.length, p.id)[0] === Number(decodeAnswer(p.correctAnswerIndex!)));
    expect(firsts.filter(Boolean).length / firsts.length).toBeLessThan(0.4);
  });
});

describe('SQL 학습 가이드 퀴즈', () => {
  it('정답 위치가 한쪽에 몰려 있지 않다 (원본 데이터 기준)', () => {
    const sql = chapterQuizzes.filter((q) => q.chapterId.startsWith('SQL_')).flatMap((q) => q.questions);
    const atZero = sql.filter((q) => q.correctIndex === 0).length;
    expect(atZero / sql.length).toBeLessThan(0.4);
  });
});
