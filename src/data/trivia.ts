export interface TriviaItem {
  id: string;
  emoji: string;
  text: string;
}

export const triviaItems: TriviaItem[] = [
  { id: 'py_1', emoji: '🐍', text: '파이썬(Python)이라는 이름은 뱀이 아니라 코미디 그룹 "몬티 파이썬"에서 따온 거예요.' },
  { id: 'py_2', emoji: '🥚', text: '파이썬 인터프리터에 import this를 입력하면 "파이썬의 선(Zen of Python)"이라는 히든 문구가 나와요.' },
  { id: 'py_3', emoji: '➕', text: '파이썬에서 True + True는 2예요. bool이 int의 서브클래스이기 때문이에요.' },
  { id: 'py_4', emoji: '🔒', text: '파이썬(CPython)은 GIL(Global Interpreter Lock) 때문에 한 프로세스 안에서 스레드가 진짜 동시에 실행되지는 않아요.' },
  { id: 'py_5', emoji: '👑', text: '파이썬 창시자 귀도 반 로섬은 2018년까지 "종신 자비로운 독재자(BDFL)"라는 칭호로 불렸어요.' },
  { id: 'py_6', emoji: '🔢', text: '파이썬에서 0.1 + 0.2 == 0.3은 False예요. 부동소수점 표현 오차 때문이에요.' },
  { id: 'py_7', emoji: '📦', text: '파이썬 딕셔너리는 3.7 버전부터 입력한 순서를 그대로 유지한다는 게 공식 사양으로 보장됐어요.' },
  { id: 'py_8', emoji: '✨', text: '파이썬의 f-string(f"...")은 3.6 버전에서 처음 도입된 비교적 최근 기능이에요.' },
  { id: 'py_9', emoji: '🔁', text: '파이썬에는 for-else, while-else처럼 반복문에도 else절을 쓸 수 있는 독특한 문법이 있어요.' },
  { id: 'py_10', emoji: '🧩', text: '리스트 컴프리헨션은 같은 결과를 만드는 for 반복문보다 대체로 더 빠르게 동작해요.' },
  { id: 'sql_1', emoji: '🗣️', text: 'SQL은 원래 "SEQUEL"이라는 이름이었는데, 상표권 문제로 지금의 SQL로 바뀌었어요.' },
  { id: 'sql_2', emoji: '❓', text: 'SQL에서 NULL = NULL은 TRUE가 아니라 UNKNOWN이에요. NULL끼리도 "같다"고 비교할 수 없어요.' },
  { id: 'sql_3', emoji: '🔀', text: 'SQL 쿼리는 SELECT부터 실행되는 게 아니라, 사실은 FROM과 WHERE가 먼저 처리돼요.' },
  { id: 'sql_4', emoji: '📜', text: '관계형 데이터베이스의 개념은 1970년 IBM의 에드거 커드(Edgar F. Codd)가 처음 발표한 논문에서 시작됐어요.' },
  { id: 'sql_5', emoji: '🐌', text: '인덱스는 조회를 빠르게 해주지만 너무 많이 걸면 오히려 INSERT/UPDATE 속도가 느려질 수 있어요.' },
  { id: 'sql_6', emoji: '⚠️', text: 'LEFT JOIN을 쓰고 오른쪽 테이블 컬럼에 WHERE 조건을 걸면, 의도와 다르게 사실상 INNER JOIN처럼 동작할 수 있어요.' },
  { id: 'sql_7', emoji: '🪟', text: '지금은 흔히 쓰는 윈도우 함수(OVER, PARTITION BY)는 SQL 표준에 비교적 늦은 2003년에 추가됐어요.' },
  { id: 'java_1', emoji: '🌳', text: 'Java는 원래 "Oak"라는 이름이었는데, 이미 상표로 등록돼 있어서 지금의 이름으로 바뀌었어요.' },
  { id: 'java_2', emoji: '☕', text: '자바(Java)라는 이름은 개발자들이 즐겨 마시던 인도네시아 자바 섬 원두 커피에서 따왔다는 설이 있어요.' },
  { id: 'java_3', emoji: '🌍', text: '"Write Once, Run Anywhere"는 Java의 핵심 철학이에요. JVM이 운영체제 차이를 대신 흡수해주기 때문이죠.' },
  { id: 'java_4', emoji: '➗', text: 'Java에서 정수끼리 나누면 소수점이 그냥 버려져요. 7 / 2의 결과는 3.5가 아니라 3이에요.' },
  { id: 'java_5', emoji: '🔒', text: 'Java의 String은 불변(immutable) 객체예요. 문자열을 "수정"하면 사실은 새 객체가 만들어지는 거예요.' },
  { id: 'java_6', emoji: '🧬', text: 'Java는 클래스의 다중 상속을 허용하지 않지만, 인터페이스를 여러 개 구현해서 비슷한 효과를 낼 수 있어요.' },
  { id: 'java_7', emoji: '🌊', text: 'Java 8에서 람다식과 스트림(Stream) API가 추가되면서 함수형 스타일 코드를 쓰기 훨씬 쉬워졌어요.' },
  { id: 'gen_1', emoji: '🐛', text: '"버그(Bug)"라는 용어를 유명하게 만든 사건은 1947년, 실제 나방이 컴퓨터 계전기에 끼어 고장 났던 일화예요.' },
  { id: 'gen_2', emoji: '👩‍💻', text: '세계 최초의 프로그래머는 1840년대에 해석기관을 위한 알고리즘을 작성한 에이다 러브레이스로 알려져 있어요.' },
  { id: 'gen_3', emoji: '🐧', text: 'Git은 리누스 토르발스가 리눅스 커널 소스코드를 관리하기 위해 2005년에 직접 만든 버전 관리 시스템이에요.' },
  { id: 'gen_4', emoji: '👋', text: '"Hello, World!" 예제는 1978년 커니핸과 리치의 C 프로그래밍 언어 책을 통해 전 세계로 널리 퍼졌어요.' },
  { id: 'gen_5', emoji: '0️⃣', text: '많은 프로그래밍 언어에서 배열이 0부터 시작하는 건, 메모리 주소로부터의 "떨어진 거리(offset)"를 나타내기 때문이에요.' },
  { id: 'gen_6', emoji: '🧮', text: '정규표현식(Regex)의 이론적 뿌리는 1950년대 수학자 스티븐 클레이니가 연구한 개념에서 나왔어요.' },
  { id: 'gen_7', emoji: '💬', text: '개발자 커뮤니티 사이트 "스택 오버플로우"의 이름은 재귀 함수가 무한히 반복될 때 나는 바로 그 에러 이름에서 따왔어요.' },
];
