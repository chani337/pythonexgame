// CSV files available to every Python run at data/<file>, so the NumPy /
// Pandas / Matplotlib problems can read real files the way analysis code
// does (pd.read_csv('data/students.csv')) instead of retyping literals.
//
// They are written into Pyodide's in-memory filesystem before each run
// (src/lib/pythonRuntime.ts), so a student who overwrites or deletes one
// gets it back on the next run. The rows are what every library problem's
// expected output was computed from -- changing them invalidates answer
// keys. Re-run `npm run verify:pylibs` after any edit.

export interface PyDataset {
  id: string;
  /** Path relative to the Python working directory. */
  path: string;
  title: string;
  description: string;
  csv: string;
}

const students = `이름,반,성별,국어,영어,수학
김철수,1반,남,85,78,92
이영희,1반,여,92,88,79
박민수,1반,남,76,95,88
최수민,1반,여,88,82,95
정찬희,1반,남,64,70,58
강지은,2반,여,95,91,87
조현우,2반,남,72,65,81
윤서연,2반,여,81,94,90
장도윤,2반,남,90,77,73
임하은,2반,여,68,85,66
한지호,3반,남,79,83,97
오유진,3반,여,87,90,84
서준혁,3반,남,58,62,71
신예린,3반,여,93,96,89
권민재,3반,남,82,74,100
황수아,4반,여,77,89,62
안태양,4반,남,91,80,85
송다인,4반,여,84,87,78
류건우,4반,남,69,72,94
문채원,4반,여,96,93,91
`;

const sales = `날짜,지점,메뉴,수량,단가
2026-01-05,강남,아메리카노,42,4500
2026-01-05,홍대,카페라떼,35,5000
2026-01-12,잠실,케이크,12,6500
2026-01-12,강남,카페라떼,28,5000
2026-01-19,홍대,아메리카노,51,4500
2026-01-19,잠실,아메리카노,33,4500
2026-01-26,강남,케이크,15,6500
2026-01-26,홍대,케이크,9,6500
2026-01-26,잠실,카페라떼,24,5000
2026-02-02,강남,아메리카노,47,4500
2026-02-02,홍대,카페라떼,38,5000
2026-02-09,잠실,케이크,18,6500
2026-02-09,강남,카페라떼,31,5000
2026-02-16,홍대,아메리카노,44,4500
2026-02-16,잠실,아메리카노,29,4500
2026-02-23,강남,케이크,20,6500
2026-02-23,홍대,케이크,11,6500
2026-02-23,잠실,카페라떼,27,5000
2026-03-02,강남,아메리카노,53,4500
2026-03-02,홍대,카페라떼,41,5000
2026-03-09,잠실,케이크,22,6500
2026-03-09,강남,카페라떼,36,5000
2026-03-16,홍대,아메리카노,49,4500
2026-03-16,잠실,아메리카노,38,4500
2026-03-23,강남,케이크,17,6500
2026-03-23,홍대,케이크,14,6500
2026-03-23,잠실,카페라떼,32,5000
2026-03-30,강남,아메리카노,58,4500
2026-03-30,홍대,카페라떼,45,5000
2026-03-30,잠실,케이크,25,6500
`;

// Two blanks in 강수량 on purpose: the missing-value problems need real NaN.
const weather = `날짜,도시,최고기온,최저기온,강수량
2026-07-01,서울,29,21,0
2026-07-02,서울,31,23,0
2026-07-03,서울,27,22,15.5
2026-07-04,서울,25,21,32
2026-07-05,서울,28,22,
2026-07-06,서울,32,24,0
2026-07-07,서울,33,25,0
2026-07-01,부산,27,22,0
2026-07-02,부산,28,23,4
2026-07-03,부산,26,22,21
2026-07-04,부산,25,22,40.5
2026-07-05,부산,27,23,8
2026-07-06,부산,29,24,0
2026-07-07,부산,30,25,
2026-07-01,제주,28,24,2
2026-07-02,제주,29,25,0
2026-07-03,제주,27,24,12
2026-07-04,제주,26,23,28
2026-07-05,제주,28,24,5.5
2026-07-06,제주,30,26,0
2026-07-07,제주,31,26,0
`;

export const PY_DATASETS: PyDataset[] = [
  {
    id: 'students',
    path: 'data/students.csv',
    title: '학생 성적',
    description: '네 반 학생 20명의 국어·영어·수학 점수',
    csv: students,
  },
  {
    id: 'sales',
    path: 'data/sales.csv',
    title: '카페 매출',
    description: '1~3월 세 지점의 주간 메뉴별 판매량과 단가',
    csv: sales,
  },
  {
    id: 'weather',
    path: 'data/weather.csv',
    title: '7월 첫 주 날씨',
    description: '서울·부산·제주의 일별 기온과 강수량 (강수량 일부가 비어 있음)',
    csv: weather,
  },
];

export const pyDatasetById = (id: string) => PY_DATASETS.find((d) => d.id === id);
