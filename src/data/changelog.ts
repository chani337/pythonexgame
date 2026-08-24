export interface ChangelogEntry {
  date: string; // YYYY-MM-DD
  title: string;
  items: string[];
}

// Newest first. Ship this alongside the release that made the change --
// there's no admin UI for this, it's just a static list like trivia.ts.
export const changelogEntries: ChangelogEntry[] = [
  {
    date: '2026-08-25',
    title: 'SQL 문제를 오라클 문법으로 전환',
    items: [
      'SQL 문제 중 LIMIT, COALESCE, JOIN...ON 같은 표준 SQL 문법을 오라클 문법(FETCH FIRST, NVL, WHERE절 (+) 외부 조인)으로 바꿨어요.',
      '조인 문제(16, 17, 18, 27, 28번)는 오라클 수업에서 배우는 방식대로 FROM절에 테이블을 나열하고 WHERE절에서 연결하도록 정답과 힌트를 모두 수정했어요.',
    ],
  },
  {
    date: '2026-08-24',
    title: 'SQL 문제에 테이블 구조 표시',
    items: [
      'SQL 문제 화면에 users/orders 테이블의 컬럼과 실제 데이터를 바로 볼 수 있는 표를 추가했어요.',
    ],
  },
  {
    date: '2026-08-23',
    title: '정답 코드 보기 기능 추가',
    items: [
      '문제 화면에 "정답 코드 보기" 버튼을 추가했어요. 테스트를 안 해봐도 바로 정답 코드를 확인할 수 있어요.',
      '정답 코드를 확인한 문제는 해결 기록/스트릭/랭킹에는 반영되지 않아요.',
    ],
  },
  {
    date: '2026-08-22',
    title: '실시간 랭킹 정확도 개선',
    items: [
      '새로고침할 때마다 랭킹 순위/문제 수가 흔들리던 문제를 고쳤어요.',
      '대시보드에 "방금 누가 문제를 풀었어요!" 실시간 피드를 추가했어요.',
      '로그인/로그아웃 시 공용 컴퓨터에 남는 계정 흔적을 자동으로 정리하도록 개선했어요.',
    ],
  },
  {
    date: '2026-08-21',
    title: '고객센터 게시판 추가',
    items: [
      '1:1 비공개 문의를 남길 수 있는 고객센터 게시판을 새로 만들었어요.',
    ],
  },
];
