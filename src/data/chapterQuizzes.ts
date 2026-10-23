// Chapter comprehension-check quizzes for the 학습 가이드 (DocsViewer)
export interface ChapterQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ChapterQuiz {
  chapterId: string;
  questions: ChapterQuizQuestion[];
  // Bumped when a chapter's questions are rewritten. Answers are stored by
  // (chapter, question index), so without this a student's answer to the old
  // question 1 would show as already chosen on the new question 1.
  revision?: number;
}

/** Key answers are saved under (user_quiz_answers.chapter_id, localStorage). */
export const quizAnswerId = (quiz: ChapterQuiz) =>
  quiz.revision ? `${quiz.chapterId}@v${quiz.revision}` : quiz.chapterId;

export const chapterQuizzes: ChapterQuiz[] = [
  {
    chapterId: '0_________ipynb',
    questions: [
      {
        question: 'word = "PYTHON"일 때 word[0:3]의 결과는?',
        options: ['PYT', 'PY', 'YTH', 'PYTH'],
        correctIndex: 0,
        explanation: '슬라이싱은 시작 위치는 포함하고 끝 위치는 포함하지 않으므로 0, 1, 2번째 글자인 "PYT"가 출력됩니다.',
      },
      {
        question: '변수에 대한 설명으로 옳은 것은?',
        options: ['=는 두 값이 같다는 뜻이다', '변수는 값에 붙이는 이름이다', '문자열은 작은따옴표만 사용 가능하다', 'type()은 변수의 값을 출력한다'],
        correctIndex: 1,
        explanation: '변수는 값에 이름을 붙이는 것이며, =는 "저장"을 의미합니다. type()은 자료형을 확인하는 함수입니다.',
      },
    ],
  },
  {
    chapterId: '1_________ipynb',
    questions: [
      {
        question: '10 // 3의 결과는?',
        options: ['3.333...', '3', '1', '10'],
        correctIndex: 1,
        explanation: '//는 나눗셈의 몫을 구하는 연산자이므로 결과는 3입니다.',
      },
      {
        question: '파이썬 삼항 연산자의 올바른 형태는?',
        options: ['값1 if 조건 else 값2', '조건 ? 값1 : 값2', 'if 조건 then 값1 else 값2', '값1 else 값2 if 조건'],
        correctIndex: 0,
        explanation: '파이썬은 ?: 형태를 지원하지 않고, "값1 if 조건 else 값2" 형태로 작성합니다.',
      },
    ],
  },
  {
    chapterId: '2_________ipynb',
    questions: [
      {
        question: '파이썬에서 코드 블록(범위)을 구분하는 방법은?',
        options: ['중괄호 {}', '들여쓰기', '세미콜론', '괄호 ()'],
        correctIndex: 1,
        explanation: '파이썬은 중괄호 대신 들여쓰기로 코드의 범위를 구분합니다.',
      },
      {
        question: '다음 중 오류가 발생하는 코드는?',
        options: ['if age == 20:', 'if age = 20:', 'if age >= 20:', 'if age != 20:'],
        correctIndex: 1,
        explanation: '=는 대입 연산자이므로 조건식에는 사용할 수 없습니다. 비교에는 ==를 사용해야 합니다.',
      },
    ],
  },
  {
    chapterId: '3_1_________ipynb',
    questions: [
      {
        question: '리스트에 새로운 값을 추가할 때 사용하는 메서드는?',
        options: ['remove()', 'append()', 'pop()', 'len()'],
        correctIndex: 1,
        explanation: 'append()는 리스트의 맨 뒤에 새 값을 추가하는 메서드입니다.',
      },
      {
        question: 'fruits = ["사과", "바나나", "포도"]일 때 fruits[1]의 결과는?',
        options: ['사과', '바나나', '포도', '오류 발생'],
        correctIndex: 1,
        explanation: '인덱스는 0부터 시작하므로 fruits[1]은 두 번째 값인 "바나나"입니다.',
      },
    ],
  },
  {
    chapterId: '3_2________ipynb',
    questions: [
      {
        question: '튜플에 대한 설명으로 옳은 것은?',
        options: ['소괄호()를 사용하며 값 수정이 불가능하다', '대괄호[]를 사용한다', '값을 자유롭게 추가할 수 있다', '리스트와 차이가 없다'],
        correctIndex: 0,
        explanation: '튜플은 ()로 만들며, 한 번 생성하면 값을 수정/추가/삭제할 수 없습니다.',
      },
      {
        question: '값이 하나뿐인 튜플을 올바르게 만든 것은?',
        options: ['(10)', '(10,)', '[10]', '{10}'],
        correctIndex: 1,
        explanation: '쉼표가 없으면 튜플이 아니라 그냥 숫자로 인식되므로 (10,)처럼 쉼표를 붙여야 합니다.',
      },
    ],
  },
  {
    chapterId: '4_________ipynb',
    questions: [
      {
        question: 'range(1, 6)이 만드는 숫자 범위는?',
        options: ['1~5', '1~6', '0~5', '0~6'],
        correctIndex: 0,
        explanation: 'range(1, 6)은 1부터 5까지를 의미하며, 끝 숫자 6은 포함되지 않습니다.',
      },
      {
        question: '조건이 참인 동안 계속 반복하는 문법은?',
        options: ['for', 'while', 'if', 'def'],
        correctIndex: 1,
        explanation: 'while문은 조건이 True인 동안 반복을 계속합니다.',
      },
    ],
  },
  {
    chapterId: '5__________ipynb',
    questions: [
      {
        question: '딕셔너리에서 키에 해당하는 값을 가져오는 방법은?',
        options: ['dict[key]', 'dict(key)', 'dict->key', 'dict.key()'],
        correctIndex: 0,
        explanation: '딕셔너리는 대괄호 안에 키를 넣어 값을 조회합니다: dict[key]',
      },
      {
        question: '딕셔너리의 모든 키를 확인할 때 사용하는 메서드는?',
        options: ['.values()', '.keys()', '.get()', '.append()'],
        correctIndex: 1,
        explanation: '.keys()는 딕셔너리의 모든 키를 반환합니다. 값 전체는 .values()로 확인합니다.',
      },
    ],
  },
  {
    chapterId: '6________ipynb',
    questions: [
      {
        question: '파이썬에서 함수를 정의할 때 사용하는 키워드는?',
        options: ['func', 'def', 'function', 'method'],
        correctIndex: 1,
        explanation: '파이썬 함수는 def 키워드로 정의합니다.',
      },
      {
        question: '함수가 값을 호출한 곳으로 돌려줄 때 사용하는 키워드는?',
        options: ['return', 'print', 'output', 'give'],
        correctIndex: 0,
        explanation: 'return은 함수의 실행을 끝내고 값을 호출한 곳으로 돌려줍니다.',
      },
    ],
  },
  {
    chapterId: '7_________ipynb',
    questions: [
      {
        question: '예외가 발생했을 때 처리할 코드를 작성하는 블록은?',
        options: ['try', 'except', 'finally', 'catch'],
        correctIndex: 1,
        explanation: 'except 블록에 예외 발생 시 실행할 코드를 작성합니다. (파이썬은 catch가 아니라 except를 사용)',
      },
      {
        question: '예외 발생 여부와 상관없이 항상 실행되는 블록은?',
        options: ['try', 'except', 'finally', 'else'],
        correctIndex: 2,
        explanation: 'finally 블록은 예외가 발생하든 안 하든 항상 실행됩니다.',
      },
    ],
  },
  {
    chapterId: '8_________ipynb',
    questions: [
      {
        question: '클래스에서 객체 자기 자신을 가리키는 매개변수 관례 이름은?',
        options: ['self', 'this', 'me', 'obj'],
        correctIndex: 0,
        explanation: '파이썬에서는 관례적으로 self를 사용해 인스턴스 자기 자신을 가리킵니다.',
      },
      {
        question: '객체를 생성할 때 자동으로 호출되는 메서드는?',
        options: ['__init__', '__new__', '__call__', '__str__'],
        correctIndex: 0,
        explanation: '__init__은 객체가 생성될 때 자동으로 호출되어 초기값을 설정하는 생성자 메서드입니다.',
      },
    ],
  },
  {
    chapterId: '9_________ipynb',
    questions: [
      {
        question: '파이썬에서 클래스 상속을 나타내는 올바른 문법은?',
        options: ['class Dog(Animal):', 'class Dog extends Animal', 'class Dog : Animal', 'class Dog -> Animal'],
        correctIndex: 0,
        explanation: '파이썬은 class 자식클래스(부모클래스): 형태로 상속을 나타냅니다.',
      },
      {
        question: '부모 클래스의 메서드를 호출할 때 사용하는 함수는?',
        options: ['super()', 'parent()', 'base()', 'extend()'],
        correctIndex: 0,
        explanation: 'super()를 사용하면 부모 클래스의 생성자나 메서드를 호출할 수 있습니다.',
      },
    ],
  },
  {
    chapterId: 'NumPy_txt',
    questions: [
      {
        question: 'NumPy 배열을 만들 때 사용하는 함수는?',
        options: ['np.array()', 'np.list()', 'np.make()', 'np.create()'],
        correctIndex: 0,
        explanation: 'np.array()로 파이썬 리스트를 NumPy 배열로 변환할 수 있습니다.',
      },
      {
        question: 'NumPy 배열의 평균을 구하는 방법은?',
        options: ['.mean()', '.avg()', '.average_value()', '.middle()'],
        correctIndex: 0,
        explanation: '배열.mean()으로 평균값을 계산할 수 있습니다.',
      },
    ],
  },
  {
    chapterId: 'Pandas_txt',
    questions: [
      {
        question: 'Pandas에서 표(행/열) 형태의 데이터를 다루는 자료구조는?',
        options: ['DataFrame', 'Series', 'Array', 'Table'],
        correctIndex: 0,
        explanation: 'DataFrame은 행과 열로 이루어진 2차원 표 형태의 자료구조입니다.',
      },
      {
        question: '조건에 맞는 행만 필터링하는 방식으로 올바른 것은?',
        options: ["df[df['col'] > 90]", "df.filter(90)", "df.where(90)", "df.select(90)"],
        correctIndex: 0,
        explanation: '불리언 인덱싱으로 조건을 만족하는 행만 골라낼 수 있습니다.',
      },
    ],
  },
  {
    chapterId: 'Matplotlib_txt',
    questions: [
      {
        question: 'Matplotlib에서 선 그래프를 그리는 함수는?',
        options: ['plt.plot()', 'plt.bar()', 'plt.scatter()', 'plt.pie()'],
        correctIndex: 0,
        explanation: 'plt.plot()은 선 그래프를 그리는 기본 함수입니다.',
      },
      {
        question: '그래프를 화면에 표시하는 함수는?',
        options: ['plt.show()', 'plt.display()', 'plt.render()', 'plt.print()'],
        correctIndex: 0,
        explanation: 'plt.show()를 호출해야 만든 그래프가 화면에 출력됩니다.',
      },
    ],
  },
  {
    chapterId: 'SQL_1_SELECT',
    revision: 2,
    questions: [
      {
        question: "회원 표에서 '어떤 부서들이 있는지' 종류만 한 번씩 보고 싶어요. 알맞은 쿼리는?",
        options: ["SELECT dept FROM users;", "SELECT DISTINCT dept FROM users;", "SELECT UNIQUE dept FROM users;", "SELECT * FROM users GROUP;"],
        correctIndex: 1,
        explanation: "DISTINCT는 중복을 없애고 종류만 한 번씩 보여 줘요. 그냥 SELECT dept면 개발팀이 세 번 나와요.",
      },
      {
        question: "SELECT name score FROM users; 를 실행하면 어떻게 될까요?",
        options: ["오류가 난다", "name과 score 두 열이 나온다", "score라는 이름의 열에 이름들이 나온다", "아무것도 안 나온다"],
        correctIndex: 2,
        explanation: "쉼표가 없으면 score가 name의 별명(AS)이 돼요. 오류 없이 이상한 결과가 나와서 더 찾기 어려운 실수예요.",
      },
    ],
  },
  {
    chapterId: 'SQL_2_WHERE',
    revision: 2,
    questions: [
      {
        question: "'개발팀이나 기획팀 중에서 95점 이상'을 찾으려면?",
        options: ["WHERE dept = '개발팀' OR dept = '기획팀' AND score >= 95", "WHERE (dept = '개발팀' OR dept = '기획팀') AND score >= 95", "WHERE dept = '개발팀' AND dept = '기획팀' AND score >= 95", "WHERE dept IN 개발팀, 기획팀 AND score >= 95"],
        correctIndex: 1,
        explanation: "AND가 OR보다 먼저 계산돼요. 괄호가 없으면 '개발팀 전원 + 기획팀 95점 이상'이 돼 버려요.",
      },
      {
        question: "점수에 따라 '우수/보통'을 옆 칸에 표시만 하고, 줄은 하나도 빼지 않으려면?",
        options: ["WHERE", "HAVING", "CASE WHEN", "LIKE"],
        correctIndex: 2,
        explanation: "WHERE는 줄을 걸러 내요. 줄은 그대로 두고 값만 조건에 따라 바꿔 보여 줄 때는 CASE WHEN이에요.",
      },
    ],
  },
  {
    chapterId: 'SQL_4_ORDER_BY',
    revision: 2,
    questions: [
      {
        question: "'점수 상위 3명'을 바르게 구하는 쿼리는?",
        options: ["SELECT name FROM users LIMIT 3;", "SELECT name FROM users ORDER BY score LIMIT 3;", "SELECT name FROM users ORDER BY score DESC LIMIT 3;", "SELECT TOP name FROM users;"],
        correctIndex: 2,
        explanation: "높은 순(DESC)으로 정렬한 뒤 잘라야 상위예요. ORDER BY 없이 LIMIT만 쓰면 '아무거나 3명'이에요.",
      },
      {
        question: "한 페이지에 10개씩 보여 주는 게시판의 3페이지를 가져오려면?",
        options: ["LIMIT 10 OFFSET 30", "LIMIT 10 OFFSET 20", "LIMIT 30 OFFSET 10", "LIMIT 3 OFFSET 10"],
        correctIndex: 1,
        explanation: "앞의 1·2페이지(20개)를 건너뛰고 10개를 가져와요. N페이지는 OFFSET (N-1)×10이에요.",
      },
    ],
  },
  {
    chapterId: 'SQL_3_SELECT_NULL',
    revision: 2,
    questions: [
      {
        question: "점수가 비어 있는 회원을 찾는 올바른 조건은?",
        options: ["WHERE score = NULL", "WHERE score == NULL", "WHERE score = ''", "WHERE score IS NULL"],
        correctIndex: 3,
        explanation: "NULL은 '모름'이라 =로 비교하면 결과도 '모름'이 되어 아무도 안 나와요. 전용 문법 IS NULL을 써요.",
      },
      {
        question: "6명 중 1명의 점수가 NULL일 때, COUNT(*)와 COUNT(score)의 결과는?",
        options: ["6, 6", "6, 5", "5, 5", "5, 6"],
        correctIndex: 1,
        explanation: "COUNT(*)는 줄 수(6), COUNT(열)은 그 열이 비어 있지 않은 줄 수(5)예요. AVG도 NULL을 빼고 계산해요.",
      },
    ],
  },
  {
    chapterId: 'SQL_5_GROUP_BY',
    revision: 2,
    questions: [
      {
        question: "'부서 평균 점수가 80점 넘는 부서만' 보려면 조건을 어디에 쓰나요?",
        options: ["WHERE AVG(score) > 80", "HAVING AVG(score) > 80", "ORDER BY AVG(score) > 80", "SELECT AVG(score) > 80"],
        correctIndex: 1,
        explanation: "WHERE는 묶기 전에 한 줄씩 걸러서, 그때는 아직 부서 평균이 없어요. 묶은 뒤의 값으로 거르는 건 HAVING이에요.",
      },
      {
        question: "SELECT dept, name, COUNT(*) FROM users GROUP BY dept; 가 문제인 이유는?",
        options: ["COUNT(*)는 GROUP BY와 같이 못 써서", "dept를 두 번 써서", "한 부서로 뭉친 줄에 여러 사람 중 누구의 name을 보여 줄지 정할 수 없어서", "ORDER BY가 없어서"],
        correctIndex: 2,
        explanation: "뭉친 줄에는 묶은 기준이나 집계값만 올 수 있어요. 대부분의 DB는 오류를, SQLite는 아무나 한 명을 보여 줘요.",
      },
    ],
  },
  {
    chapterId: 'SQL_7_JOIN',
    revision: 2,
    questions: [
      {
        question: "'한 번도 주문하지 않은 회원'을 찾는 방법으로 알맞은 것은?",
        options: ["users INNER JOIN orders 후 전부 보기", "users LEFT JOIN orders 후 WHERE o.order_id IS NULL", "users CROSS JOIN orders", "orders만 조회하기"],
        correctIndex: 1,
        explanation: "LEFT JOIN은 짝이 없는 회원도 남기고 주문 쪽을 NULL로 채워요. 그 NULL인 줄이 바로 주문 안 한 회원이에요.",
      },
      {
        question: "회원 5명, 주문 4건인데 JOIN 결과가 20줄 나왔어요. 가장 의심되는 원인은?",
        options: ["데이터가 중복 저장돼서", "ON 조인 조건을 빠뜨려서", "LEFT JOIN을 써서", "ORDER BY를 안 써서"],
        correctIndex: 1,
        explanation: "조건 없이 붙이면 모든 조합(5×4=20)이 나와요. 행 수가 갑자기 늘면 조인 조건부터 확인하세요.",
      },
    ],
  },
  {
    chapterId: 'SQL_8_SUBQUERY',
    revision: 2,
    questions: [
      {
        question: "주문표 user_id에 NULL이 하나 섞여 있을 때, '주문한 적 없는 회원'을 안전하게 찾는 방법은?",
        options: ["WHERE id NOT IN (SELECT user_id FROM orders)", "WHERE id != (SELECT user_id FROM orders)", "WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id)", "WHERE id IN (SELECT NULL FROM orders)"],
        correctIndex: 2,
        explanation: "NOT IN 목록에 NULL이 있으면 결과가 0명이 돼요. NOT EXISTS는 짝이 있는지만 봐서 NULL 영향을 안 받아요.",
      },
      {
        question: "'자기 부서 평균보다 점수가 높은 사람'처럼, 서브쿼리가 바깥 줄마다 다시 계산돼야 하는 경우를 뭐라고 하나요?",
        options: ["스칼라 서브쿼리", "연관 서브쿼리", "인라인 뷰", "집합 연산"],
        correctIndex: 1,
        explanation: "서브쿼리 안에서 바깥 쿼리의 열(u.dept)을 쓰면, 바깥 줄마다 다시 실행되는 연관 서브쿼리가 돼요.",
      },
    ],
  },
  {
    chapterId: 'SQL_9_SET_OPERATOR',
    revision: 2,
    questions: [
      {
        question: "두 지점의 판매 기록을 그대로 이어 붙이려고 해요(같은 기록이 있어도 둘 다 남겨야 함). 알맞은 것은?",
        options: ["UNION", "UNION ALL", "INTERSECT", "EXCEPT"],
        correctIndex: 1,
        explanation: "UNION은 중복을 하나로 합쳐서 같은 판매 기록이 사라질 수 있어요. 그대로 이어 붙이는 건 UNION ALL이고, 더 빠르기도 해요.",
      },
      {
        question: "집합 연산자로 두 쿼리를 합칠 때 반드시 지켜야 하는 것은?",
        options: ["두 쿼리가 같은 표를 조회해야 한다", "두 쿼리의 열 개수가 같아야 한다", "두 쿼리 모두 ORDER BY가 있어야 한다", "WHERE를 쓰면 안 된다"],
        correctIndex: 1,
        explanation: "위아래 열 개수와 종류가 맞아야 해요. 다른 표끼리도 합칠 수 있고, ORDER BY는 맨 끝에 한 번만 써요.",
      },
    ],
  },
  {
    chapterId: 'SQL_10_WINDOW_FUNCTION',
    revision: 2,
    questions: [
      {
        question: "100, 95, 95, 90점일 때 RANK()로 매긴 90점의 순위는?",
        options: ["2", "3", "4", "5"],
        correctIndex: 2,
        explanation: "95점 두 명이 공동 2등이라 3등을 건너뛰고 90점은 4등이에요. DENSE_RANK()라면 3등이에요.",
      },
      {
        question: "'부서별 1등'만 뽑으려면 어떤 조합이 알맞나요?",
        options: ["GROUP BY dept + MAX(name)", "ROW_NUMBER() OVER (PARTITION BY dept ORDER BY score DESC) 후 바깥에서 = 1", "ORDER BY score DESC LIMIT 1", "DISTINCT dept"],
        correctIndex: 1,
        explanation: "PARTITION BY로 부서마다 순번을 매기고, 서브쿼리 바깥에서 1번만 고르면 돼요. LIMIT 1은 전체 1등 한 명뿐이에요.",
      },
    ],
  },
  {
    chapterId: 'SQL_6_GROUP_FUNCTION',
    revision: 2,
    questions: [
      {
        question: "ROLLUP(dept)를 쓰면 GROUP BY dept 결과에 무엇이 더해지나요?",
        options: ["부서별 순위", "전체 합계 한 줄", "부서마다 빈 줄", "중복 제거"],
        correctIndex: 1,
        explanation: "ROLLUP은 소계와 총계를 붙여 줘요. 기준이 하나면 '전체' 한 줄이 추가돼요.",
      },
      {
        question: "ROLLUP이 없는 SQLite에서 '부서별 합계 + 전체 합계'를 한 결과로 만들려면?",
        options: ["GROUP BY 두 번 쓰기", "부서별 합계 쿼리와 전체 합계 쿼리를 UNION ALL로 잇기", "HAVING SUM(score)", "WINDOW 함수만 쓰기"],
        correctIndex: 1,
        explanation: "ROLLUP의 결과는 결국 두 쿼리를 이어 붙인 것과 같아서, UNION ALL로 똑같이 만들 수 있어요.",
      },
    ],
  },
  {
    chapterId: 'SQL_12_DDL_DML',
    revision: 2,
    questions: [
      {
        question: "UPDATE users SET score = 0; 을 실행하면?",
        options: ["오류가 난다", "첫 번째 회원만 0점이 된다", "모든 회원의 점수가 0점이 된다", "아무 일도 없다"],
        correctIndex: 2,
        explanation: "WHERE가 없으면 모든 줄이 바뀌어요. UPDATE·DELETE 전에는 같은 WHERE로 SELECT를 먼저 해서 대상을 확인하세요.",
      },
      {
        question: "나이에 음수가 들어오지 않도록 DB에서 막으려면 어떤 제약조건을 쓰나요?",
        options: ["DEFAULT", "UNIQUE", "CHECK (age > 0)", "PRIMARY KEY"],
        correctIndex: 2,
        explanation: "CHECK는 조건에 안 맞는 값을 아예 못 넣게 막아요. 프로그램에서 실수해도 DB가 한 번 더 지켜 줘요.",
      },
    ],
  },
  {
    chapterId: 'SQL_13_CTE_TCL_DCL',
    revision: 2,
    questions: [
      {
        question: "계좌 이체에서 '출금은 됐는데 입금이 실패'하는 일을 막으려면?",
        options: ["두 작업을 트랜잭션으로 묶고, 실패하면 ROLLBACK", "UPDATE를 두 번 쓴다", "VIEW를 만든다", "인덱스를 만든다"],
        correctIndex: 0,
        explanation: "트랜잭션은 전부 성공하면 COMMIT, 하나라도 실패하면 ROLLBACK으로 전부 취소해요(원자성).",
      },
      {
        question: "이 쿼리 안에서만 잠깐 쓸 중간 결과에 이름을 붙여, 읽기 쉽게 만드는 문법은?",
        options: ["CREATE VIEW", "WITH (CTE)", "CREATE TABLE", "GRANT"],
        correctIndex: 1,
        explanation: "WITH는 쿼리 한 번 동안만 존재하는 이름표예요. 여러 쿼리에서 계속 쓸 거면 VIEW로 저장해요.",
      },
    ],
  },
  {
    chapterId: 'SQL_14_INDEX',
    revision: 2,
    questions: [
      {
        question: "score에 인덱스가 있을 때, 인덱스를 쓰지 못하는 조건은?",
        options: ["WHERE score = 90", "WHERE score > 80", "WHERE score + 1 = 91", "WHERE score BETWEEN 80 AND 90"],
        correctIndex: 2,
        explanation: "열을 가공하면(score + 1) 찾아보기에 그 값이 없어서 전부 훑어봐요. 열은 그대로 두고 반대쪽을 계산하세요(score = 90).",
      },
      {
        question: "모든 열에 인덱스를 만들지 않는 가장 큰 이유는?",
        options: ["조회가 느려져서", "데이터를 넣고·고치고·지울 때마다 인덱스도 고쳐야 해서 쓰기가 느려지고 공간도 차지해서", "SQL 문법 오류가 나서", "PRIMARY KEY가 사라져서"],
        correctIndex: 1,
        explanation: "인덱스는 읽기를 빠르게 하는 대신 쓰기 비용과 공간을 써요. 자주 찾고 잘 안 바뀌는 열에만 만들어요.",
      },
    ],
  },
  {
    chapterId: 'SQL_11_MODELING',
    revision: 2,
    questions: [
      {
        question: "주문표에 회원 이름과 전화번호를 매번 같이 적었더니, 회원이 번호를 바꿀 때 문제가 생겼어요. 이걸 뭐라고 하나요?",
        options: ["삽입 이상", "수정 이상", "삭제 이상", "정규화"],
        correctIndex: 1,
        explanation: "같은 정보가 여러 줄에 반복돼서, 바꿀 때 일부만 고치면 서로 달라지는 문제가 수정 이상이에요. 그래서 회원 정보를 따로 나눠요.",
      },
      {
        question: "학생과 수업처럼 서로 여러 개씩 연결되는(N:M) 관계는 어떻게 표로 만드나요?",
        options: ["학생 표에 수업1, 수업2 칸을 만든다", "수업 표에 학생 이름을 쉼표로 적는다", "학생 번호와 수업 번호만 담은 연결 표를 따로 만든다", "한 표로 합친다"],
        correctIndex: 2,
        explanation: "N:M은 두 표만으로는 표현할 수 없어서, '누가 무엇을 듣는다'만 적는 연결 표를 가운데 둬요.",
      },
    ],
  },
  {
    chapterId: 'JAVA_1_INTRO_VARIABLE',
    questions: [
      {
        question: '자바에서 정수를 저장하는 기본 자료형은?',
        options: ['int', 'String', 'boolean', 'void'],
        correctIndex: 0,
        explanation: 'int는 정수를 저장하는 기본 자료형입니다.',
      },
      {
        question: '자바 프로그램이 실행을 시작하는 메서드는?',
        options: ['main', 'start', 'run', 'init'],
        correctIndex: 0,
        explanation: 'public static void main(String[] args)가 프로그램의 시작점입니다.',
      },
    ],
  },
  {
    chapterId: 'JAVA_2_OPERATOR',
    questions: [
      {
        question: '자바에서 5 / 2 (둘 다 int)의 결과는?',
        options: ['2', '2.5', '3', '2.0'],
        correctIndex: 0,
        explanation: 'int끼리 나눗셈은 소수점이 버려진 정수 결과를 반환하므로 2입니다.',
      },
      {
        question: '문자열의 내용이 같은지 비교할 때 사용해야 하는 것은?',
        options: ['.equals()', '==', '.compare()', '.same()'],
        correctIndex: 0,
        explanation: '==는 객체가 같은지 비교하고, 내용 비교는 .equals()를 사용해야 합니다.',
      },
    ],
  },
  {
    chapterId: 'JAVA_3_CONDITIONAL',
    questions: [
      {
        question: '자바에서 조건식을 감싸는 기호는?',
        options: ['()', '{}', '[]', '<>'],
        correctIndex: 0,
        explanation: 'if 조건식은 반드시 소괄호 ()로 감싸야 합니다.',
      },
      {
        question: 'switch문에서 다음 case로 넘어가지 않도록 막는 키워드는?',
        options: ['break', 'continue', 'stop', 'return'],
        correctIndex: 0,
        explanation: 'break가 없으면 다음 case까지 그대로 실행되는 폴스루가 발생합니다.',
      },
    ],
  },
  {
    chapterId: 'JAVA_4_ARRAY',
    questions: [
      {
        question: '배열의 길이를 확인하는 올바른 방법은?',
        options: ['.length', '.length()', '.size()', '.count()'],
        correctIndex: 0,
        explanation: '배열은 length가 메서드가 아니라 속성이므로 괄호 없이 사용합니다.',
      },
      {
        question: '자바 배열의 특징으로 옳은 것은?',
        options: ['크기가 고정되어 있다', '크기가 자유롭게 변한다', '여러 자료형을 섞어 담을 수 있다', '인덱스가 1부터 시작한다'],
        correctIndex: 0,
        explanation: '자바 배열은 한 번 생성하면 크기를 바꿀 수 없습니다.',
      },
    ],
  },
  {
    chapterId: 'JAVA_5_LOOP',
    questions: [
      {
        question: '조건을 나중에 검사해서 최소 1번은 실행이 보장되는 반복문은?',
        options: ['do-while', 'while', 'for', 'for-each'],
        correctIndex: 0,
        explanation: 'do-while은 코드를 먼저 실행한 뒤 조건을 검사합니다.',
      },
      {
        question: '배열을 인덱스 없이 순회할 때 사용하는 문법은?',
        options: ['향상된 for문 (for-each)', 'while', 'switch', 'do-while'],
        correctIndex: 0,
        explanation: 'for (자료형 변수 : 배열) 형태의 향상된 for문으로 인덱스 없이 순회할 수 있습니다.',
      },
    ],
  },
  {
    chapterId: 'JAVA_6_METHOD',
    questions: [
      {
        question: '값을 반환하지 않는 메서드의 반환타입은?',
        options: ['void', 'null', 'none', 'empty'],
        correctIndex: 0,
        explanation: '값을 반환하지 않는 메서드는 반환타입을 void로 지정합니다.',
      },
      {
        question: '같은 이름의 메서드를 매개변수만 다르게 여러 개 정의하는 것은?',
        options: ['오버로딩', '오버라이딩', '상속', '캡슐화'],
        correctIndex: 0,
        explanation: '오버로딩(Overloading)은 같은 이름, 다른 매개변수로 메서드를 여러 개 만드는 것입니다.',
      },
    ],
  },
  {
    chapterId: 'JAVA_7_COLLECTION',
    questions: [
      {
        question: '크기가 자유롭게 변하는 리스트를 제공하는 클래스는?',
        options: ['ArrayList', 'Array', 'List[]', 'Vector[]'],
        correctIndex: 0,
        explanation: 'ArrayList는 배열과 달리 크기를 자유롭게 늘리고 줄일 수 있습니다.',
      },
      {
        question: '키-값(Key-Value) 쌍으로 데이터를 저장하는 컬렉션은?',
        options: ['HashMap', 'ArrayList', 'HashSet', 'LinkedList'],
        correctIndex: 0,
        explanation: 'HashMap은 파이썬의 딕셔너리처럼 키와 값을 짝지어 저장합니다.',
      },
    ],
  },
  {
    chapterId: 'JAVA_8_EXCEPTION',
    questions: [
      {
        question: '예외가 발생했을 때 처리할 코드를 작성하는 블록은?',
        options: ['catch', 'try', 'finally', 'throw'],
        correctIndex: 0,
        explanation: 'catch 블록에서 발생한 예외를 잡아 처리합니다.',
      },
      {
        question: '예외 발생 여부와 상관없이 항상 실행되는 블록은?',
        options: ['finally', 'try', 'catch', 'throws'],
        correctIndex: 0,
        explanation: 'finally는 예외가 발생하든 안 하든 항상 실행되는 블록입니다.',
      },
    ],
  },
  {
    chapterId: 'JAVA_9_CLASS_OBJECT',
    questions: [
      {
        question: '클래스로부터 객체를 생성할 때 사용하는 키워드는?',
        options: ['new', 'create', 'make', 'object'],
        correctIndex: 0,
        explanation: 'new 키워드로 클래스의 생성자를 호출해 객체를 생성합니다.',
      },
      {
        question: '필드를 외부에서 직접 접근하지 못하게 막는 접근 제어자는?',
        options: ['private', 'public', 'protected', 'final'],
        correctIndex: 0,
        explanation: 'private 필드는 같은 클래스 내부에서만 접근할 수 있습니다.',
      },
    ],
  },
  {
    chapterId: 'JAVA_10_INHERITANCE',
    questions: [
      {
        question: '클래스 상속을 나타낼 때 사용하는 키워드는?',
        options: ['extends', 'implements', 'inherits', 'super'],
        correctIndex: 0,
        explanation: 'class 자식클래스 extends 부모클래스 형태로 상속을 나타냅니다.',
      },
      {
        question: '부모의 메서드를 자식 클래스가 같은 형태로 재정의하는 것은?',
        options: ['오버라이딩', '오버로딩', '캡슐화', '인터페이스'],
        correctIndex: 0,
        explanation: '오버라이딩(Overriding)은 부모 클래스의 메서드를 자식이 재정의하는 것입니다.',
      },
    ],
  },
  {
    chapterId: 'JAVA_11_INTERFACE_ABSTRACT',
    questions: [
      {
        question: '클래스가 인터페이스를 구현할 때 사용하는 키워드는?',
        options: ['implements', 'extends', 'interface', 'abstract'],
        correctIndex: 0,
        explanation: '클래스는 implements 키워드로 인터페이스를 구현합니다.',
      },
      {
        question: '자바 클래스가 동시에 여러 개를 가질 수 있는 것은?',
        options: ['구현하는 인터페이스', '상속받는 부모 클래스', '생성자', '패키지'],
        correctIndex: 0,
        explanation: '부모 클래스는 하나만 상속 가능하지만, 인터페이스는 여러 개를 동시에 구현할 수 있습니다.',
      },
    ],
  },
  {
    chapterId: 'JAVA_12_STRING_UTIL',
    questions: [
      {
        question: '반복적인 문자열 조합에 효율적인 클래스는?',
        options: ['StringBuilder', 'String', 'Integer', 'Object'],
        correctIndex: 0,
        explanation: 'String은 불변 객체라서 반복 결합에 비효율적이며, StringBuilder를 사용하는 것이 효율적입니다.',
      },
      {
        question: '문자열을 정수로 변환하는 메서드는?',
        options: ['Integer.parseInt()', 'String.toInt()', '(int) str', 'str.toInteger()'],
        correctIndex: 0,
        explanation: 'Integer.parseInt(문자열)로 문자열을 정수로 변환할 수 있습니다.',
      },
    ],
  },
  {
    chapterId: 'C_1_INTRO_VARIABLE',
    questions: [
      {
        question: 'C 프로그램이 실행을 시작하는 함수는?',
        options: ['main', 'start', 'run', 'init'],
        correctIndex: 0,
        explanation: 'C 프로그램은 항상 int main(void) 함수에서 시작합니다.',
      },
      {
        question: 'printf에서 정수를 출력할 때 사용하는 서식 지정자는?',
        options: ['%d', '%f', '%c', '%s'],
        correctIndex: 0,
        explanation: '%d는 int, %f는 실수, %c는 문자, %s는 문자열을 출력할 때 사용합니다.',
      },
    ],
  },
  {
    chapterId: 'C_2_OPERATOR',
    questions: [
      {
        question: 'int a = 7, b = 2;일 때 a / b의 결과는?',
        options: ['3', '3.5', '4', '오류'],
        correctIndex: 0,
        explanation: '정수끼리의 나눗셈은 소수점이 버려지므로 3이 됩니다.',
      },
      {
        question: '값을 비교할 때 =가 아니라 사용해야 하는 연산자는?',
        options: ['==', ':=', '=?', '<>'],
        correctIndex: 0,
        explanation: '=는 대입 연산자이고, 두 값이 같은지 비교할 때는 ==를 사용해야 합니다.',
      },
    ],
  },
  {
    chapterId: 'C_3_CONDITIONAL',
    questions: [
      {
        question: 'switch문에서 각 case 처리 후 다음 case로 넘어가지 않게 막는 키워드는?',
        options: ['break', 'continue', 'return', 'stop'],
        correctIndex: 0,
        explanation: 'break가 없으면 다음 case로 실행이 계속 흘러 내려갑니다(fall-through).',
      },
      {
        question: 'C의 switch문 조건으로 사용할 수 없는 자료형은?',
        options: ['double', 'int', 'char', '모두 사용 가능'],
        correctIndex: 0,
        explanation: 'switch문은 정수(또는 정수로 변환 가능한 char 등)만 비교할 수 있고, 실수는 사용할 수 없습니다.',
      },
    ],
  },
  {
    chapterId: 'C_4_ARRAY',
    questions: [
      {
        question: 'int arr[5];로 선언했을 때 유효한 인덱스 범위는?',
        options: ['0 ~ 4', '1 ~ 5', '0 ~ 5', '-1 ~ 4'],
        correctIndex: 0,
        explanation: 'C 배열의 인덱스는 0부터 시작해서 (크기-1)까지가 유효한 범위입니다.',
      },
      {
        question: '배열의 요소 개수를 구하는 올바른 방법은?',
        options: ['sizeof(arr) / sizeof(arr[0])', 'len(arr)', 'arr.length', 'sizeof(arr)'],
        correctIndex: 0,
        explanation: 'C 배열은 len() 같은 기능이 없어서, 전체 크기를 요소 하나의 크기로 나눠서 개수를 구합니다.',
      },
    ],
  },
  {
    chapterId: 'C_5_LOOP',
    questions: [
      {
        question: '조건과 상관없이 최소 한 번은 실행되는 반복문은?',
        options: ['do-while', 'while', 'for', 'switch'],
        correctIndex: 0,
        explanation: 'do-while은 코드를 먼저 실행한 뒤에 조건을 검사하므로 최소 한 번은 실행됩니다.',
      },
      {
        question: '반복문에서 이번 반복만 건너뛰고 다음 반복으로 넘어갈 때 사용하는 키워드는?',
        options: ['continue', 'break', 'pass', 'skip'],
        correctIndex: 0,
        explanation: 'continue는 현재 반복의 나머지를 건너뛰고 다음 반복으로 넘어갑니다.',
      },
    ],
  },
  {
    chapterId: 'C_6_FUNCTION',
    questions: [
      {
        question: 'C에서 함수에 인자를 전달하는 기본 방식은?',
        options: ['값에 의한 전달(call by value)', '참조에 의한 전달(call by reference)', '이름에 의한 전달', '전달 방식이 없음'],
        correctIndex: 0,
        explanation: 'C는 기본적으로 인자의 값을 복사해서 전달하므로, 함수 안에서 매개변수를 바꿔도 원본은 그대로입니다.',
      },
      {
        question: '함수를 정의보다 먼저 호출하려면 무엇이 필요한가?',
        options: ['함수 원형(prototype) 선언', '매크로 정의', '헤더 가드', '전역 변수 선언'],
        correctIndex: 0,
        explanation: '함수 원형을 미리 선언해두면 실제 정의가 코드 아래쪽에 있어도 컴파일러가 함수를 인식할 수 있습니다.',
      },
    ],
  },
  {
    chapterId: 'C_7_POINTER',
    questions: [
      {
        question: '변수의 메모리 주소를 얻을 때 사용하는 연산자는?',
        options: ['&', '*', '#', '@'],
        correctIndex: 0,
        explanation: '&(주소 연산자)는 변수의 메모리 주소를 얻을 때 사용합니다.',
      },
      {
        question: '함수 안에서 포인터를 이용해 원본 변수의 값을 바꾸는 방식을 무엇이라 하는가?',
        options: ['call by reference', 'call by value', 'call by name', 'call by copy'],
        correctIndex: 0,
        explanation: '포인터로 주소를 전달하면 함수 안에서 그 주소의 값을 직접 수정할 수 있어 원본이 바뀝니다 (call by reference).',
      },
    ],
  },
  {
    chapterId: 'C_8_STRUCT',
    questions: [
      {
        question: '서로 다른 자료형을 하나로 묶어 새로운 자료형을 정의할 때 사용하는 키워드는?',
        options: ['struct', 'array', 'class', 'union'],
        correctIndex: 0,
        explanation: 'struct는 서로 다른 자료형의 변수들을 묶어 새로운 자료형을 정의합니다.',
      },
      {
        question: '구조체 포인터를 통해 멤버에 접근할 때 사용하는 연산자는?',
        options: ['->', '.', '::', '&'],
        correctIndex: 0,
        explanation: '포인터로 구조체 멤버에 접근할 때는 -> 연산자를 사용합니다 (일반 변수는 . 사용).',
      },
    ],
  },
  {
    chapterId: 'C_9_STRING',
    questions: [
      {
        question: 'C에서 문자열의 끝을 표시하는 특수 문자는?',
        options: ['\\0', '\\n', 'EOF', 'NULL'],
        correctIndex: 0,
        explanation: 'C 문자열은 끝에 널 문자(\\0)가 자동으로 붙습니다.',
      },
      {
        question: '두 문자열의 내용이 같은지 비교할 때 사용해야 하는 함수는?',
        options: ['strcmp()', '==', 'strcat()', 'strcpy()'],
        correctIndex: 0,
        explanation: '문자열을 ==로 비교하면 주소를 비교하게 되므로, 내용 비교는 strcmp()를 사용해야 합니다.',
      },
    ],
  },
  {
    chapterId: 'C_10_MEMORY',
    questions: [
      {
        question: '힙 영역에 메모리를 동적으로 할당할 때 사용하는 함수는?',
        options: ['malloc', 'free', 'sizeof', 'new'],
        correctIndex: 0,
        explanation: 'malloc(바이트 수)로 힙 영역에서 메모리를 할당받을 수 있습니다.',
      },
      {
        question: 'malloc으로 할당한 메모리를 다 쓰고 난 후 반드시 호출해야 하는 함수는?',
        options: ['free', 'delete', 'clear', 'release'],
        correctIndex: 0,
        explanation: 'free()를 호출하지 않으면 메모리 누수(memory leak)가 발생합니다.',
      },
    ],
  },
  {
    chapterId: 'C_11_PREPROCESSOR',
    questions: [
      {
        question: '다른 파일의 내용을 현재 파일에 포함시킬 때 사용하는 전처리 지시문은?',
        options: ['#include', '#define', 'import', 'using'],
        correctIndex: 0,
        explanation: '#include는 지정한 파일의 내용을 그 위치에 포함시킵니다.',
      },
      {
        question: '헤더 파일의 중복 포함을 막기 위한 패턴(헤더 가드)에 사용되지 않는 것은?',
        options: ['#endwhile', '#ifndef', '#define', '#endif'],
        correctIndex: 0,
        explanation: '헤더 가드는 #ifndef, #define, #endif 세 가지 지시문으로 구성됩니다. #endwhile은 존재하지 않는 지시문입니다.',
      },
    ],
  },
  {
    chapterId: 'C_12_FILE_IO',
    questions: [
      {
        question: '파일을 열 때 사용하는 표준 라이브러리 함수는?',
        options: ['fopen', 'open', 'fread', 'new File'],
        correctIndex: 0,
        explanation: 'fopen(파일이름, 모드)으로 파일을 열고 FILE* 포인터를 받습니다.',
      },
      {
        question: '파일에서 한 줄씩 문자열을 읽어올 때 사용하는 함수는?',
        options: ['fgets', 'fputs', 'fopen', 'fclose'],
        correctIndex: 0,
        explanation: 'fgets(저장할곳, 최대크기, 파일)은 파일에서 한 줄을 읽어옵니다.',
      },
    ],
  },
  {
    chapterId: 'HTML_1_BASIC_STRUCTURE',
    questions: [
      {
        question: '한글이 깨지지 않게 하려면 head에 반드시 넣어야 하는 태그는?',
        options: ['<meta charset="UTF-8">', '<meta name="viewport">', '<title>', '<!DOCTYPE html>'],
        correctIndex: 0,
        explanation: 'charset으로 문자 인코딩을 UTF-8로 지정해야 한글이 정상적으로 표시됩니다.',
      },
      {
        question: '닫는 태그가 없는 "빈 요소"가 아닌 것은?',
        options: ['<div>', '<br>', '<img>', '<input>'],
        correctIndex: 0,
        explanation: 'div는 내용을 담는 태그이므로 </div>로 닫아야 합니다. br, img, input은 빈 요소입니다.',
      },
    ],
  },
  {
    chapterId: 'HTML_2_TEXT_TAG',
    questions: [
      {
        question: '여러 줄 코드의 공백과 줄바꿈을 그대로 보존해서 보여주는 태그는?',
        options: ['pre', 'p', 'span', 'blockquote'],
        correctIndex: 0,
        explanation: 'pre는 preformatted text로, 공백과 줄바꿈을 그대로 유지합니다. 보통 code와 함께 씁니다.',
      },
      {
        question: 'strong과 b의 차이에 대한 설명으로 옳은 것은?',
        options: [
          'strong은 중요성을 나타내고 b는 모양만 굵게 한다',
          'strong은 기울임, b는 굵게 표시한다',
          'b는 HTML5에서 삭제되었다',
          '둘은 완전히 동일하다',
        ],
        correctIndex: 0,
        explanation: '화면 모양은 같지만 strong은 "중요하다"는 의미를 전달하고 b는 의미 없이 굵게만 표시합니다.',
      },
    ],
  },
  {
    chapterId: 'HTML_3_LIST_TABLE',
    questions: [
      {
        question: '표에서 가로로 2칸을 합칠 때 사용하는 속성은?',
        options: ['colspan', 'rowspan', 'colgroup', 'align'],
        correctIndex: 0,
        explanation: 'colspan은 가로(열) 방향으로, rowspan은 세로(행) 방향으로 칸을 합칩니다.',
      },
      {
        question: '목록을 중첩할 때 안쪽 ul이 들어가야 하는 위치는?',
        options: ['바깥 li 안쪽', '바깥 ul 바로 아래', 'li와 li 사이', 'ol 안쪽에만 가능'],
        correctIndex: 0,
        explanation: 'ul 바로 아래에는 li만 올 수 있으므로, 중첩 목록은 바깥 li 안쪽에 넣어야 합니다.',
      },
    ],
  },
  {
    chapterId: 'HTML_4_LINK_MEDIA',
    questions: [
      {
        question: 'target="_blank"로 새 탭을 열 때 보안을 위해 함께 쓰는 속성은?',
        options: ['rel="noopener noreferrer"', 'download', 'referrerpolicy="origin"', 'loading="lazy"'],
        correctIndex: 0,
        explanation: 'noopener는 새 탭이 원래 페이지를 조작하지 못하게 막고, noreferrer는 출처 정보를 보내지 않습니다.',
      },
      {
        question: 'img 태그의 alt 속성에 대한 설명으로 옳은 것은?',
        options: [
          '장식용 이미지라면 alt=""처럼 빈 값이라도 적어야 한다',
          '이미지가 보이면 필요 없으므로 생략해도 된다',
          '마우스를 올렸을 때 표시되는 설명이다',
          '이미지 크기를 지정하는 속성이다',
        ],
        correctIndex: 0,
        explanation: 'alt는 필수 속성입니다. 장식용이면 alt=""로 비워 두어 스크린 리더가 건너뛰게 합니다.',
      },
    ],
  },
  {
    chapterId: 'HTML_5_FORM',
    questions: [
      {
        question: '입력값이 서버로 전송되기 위해 input에 반드시 필요한 속성은?',
        options: ['name', 'id', 'class', 'placeholder'],
        correctIndex: 0,
        explanation: 'name이 전송되는 키가 됩니다. id는 label 연결이나 CSS/JS용이며 전송과는 무관합니다.',
      },
      {
        question: 'form 안의 button에서 type을 생략하면 어떻게 되나요?',
        options: [
          'type="submit"으로 동작해서 폼이 전송된다',
          'type="button"으로 동작해서 아무 일도 없다',
          '오류가 발생해 버튼이 표시되지 않는다',
          'type="reset"으로 동작해 입력값이 초기화된다',
        ],
        correctIndex: 0,
        explanation: 'button의 기본 type은 submit입니다. JS 처리용 버튼에는 type="button"을 반드시 명시해야 합니다.',
      },
    ],
  },
  {
    chapterId: 'HTML_6_SEMANTIC',
    questions: [
      {
        question: '한 페이지에 하나만 쓰는 것이 원칙인 시맨틱 태그는?',
        options: ['main', 'section', 'article', 'aside'],
        correctIndex: 0,
        explanation: 'main은 페이지의 핵심 본문을 나타내므로 페이지당 하나만 사용합니다.',
      },
      {
        question: 'article과 section의 차이로 가장 적절한 설명은?',
        options: [
          'article은 떼어내도 의미가 통하는 독립 콘텐츠, section은 제목이 있는 주제 구역이다',
          'article은 블록, section은 인라인 요소다',
          'section은 article 안에 들어갈 수 없다',
          '둘은 완전히 동일하며 이름만 다르다',
        ],
        correctIndex: 0,
        explanation: '블로그 글이나 상품 카드처럼 독립적인 콘텐츠는 article, 제목이 있는 주제 구역은 section입니다.',
      },
    ],
  },
  {
    chapterId: 'HTML_7_ATTRIBUTE_A11Y',
    questions: [
      {
        question: '화면에 코드를 글자로 보여주기 위해 꺾쇠 여는 기호를 대체하는 엔티티는?',
        options: ['&lt;', '&gt;', '&amp;', '&nbsp;'],
        correctIndex: 0,
        explanation: '&lt;는 less than으로 여는 꺾쇠를, &gt;는 닫는 꺾쇠를 표시합니다.',
      },
      {
        question: '접근성을 위해 가장 먼저 지켜야 할 원칙은?',
        options: [
          '의미에 맞는 태그를 쓰는 것 (div 대신 button)',
          '모든 요소에 role 속성을 붙이는 것',
          'tabindex를 높은 숫자로 지정하는 것',
          'outline: none으로 포커스 표시를 지우는 것',
        ],
        correctIndex: 0,
        explanation: '올바른 태그를 쓰는 것이 접근성의 대부분을 해결합니다. ARIA는 기본 태그로 표현할 수 없을 때만 보조로 씁니다.',
      },
    ],
  },
  {
    chapterId: 'HTML_8_TAG_CHEATSHEET',
    questions: [
      {
        question: '기본 display가 inline이어서 width와 height가 적용되지 않는 태그는?',
        options: ['span', 'div', 'p', 'section'],
        correctIndex: 0,
        explanation: 'span은 인라인 요소라 width/height가 무시됩니다. inline-block이나 block으로 바꿔야 적용됩니다.',
      },
      {
        question: '지금은 쓰지 않는(deprecated) 태그는?',
        options: ['center', 'section', 'details', 'figure'],
        correctIndex: 0,
        explanation: 'center는 폐기되었고, 가운데 정렬은 CSS의 text-align이나 margin: auto로 처리합니다.',
      },
    ],
  },
  {
    chapterId: 'CSS_1_SELECTOR',
    questions: [
      {
        question: '.card > p와 .card p의 차이는?',
        options: [
          '>는 바로 아래 자식만, 공백은 안쪽 모든 자손을 선택한다',
          '>는 형제를, 공백은 자식을 선택한다',
          '두 선택자는 완전히 동일하다',
          '>는 클래스에만, 공백은 태그에만 쓸 수 있다',
        ],
        correctIndex: 0,
        explanation: '>는 자식 조합자로 한 단계 아래만 선택하고, 공백은 자손 조합자로 깊이에 상관없이 모두 선택합니다.',
      },
      {
        question: '명시도(우선순위)가 가장 높은 것은?',
        options: ['#아이디 선택자', '.클래스 선택자', '태그 선택자', '전체 선택자(*)'],
        correctIndex: 0,
        explanation: '인라인 스타일(1000) > id(100) > class(10) > 태그(1) > 전체 선택자(0) 순입니다.',
      },
    ],
  },
  {
    chapterId: 'CSS_2_BOX_MODEL',
    questions: [
      {
        question: 'width에 padding과 border를 포함시키려면 어떤 속성을 써야 하나요?',
        options: ['box-sizing: border-box', 'box-sizing: content-box', 'overflow: hidden', 'display: block'],
        correctIndex: 0,
        explanation: 'border-box는 padding과 border를 width 안쪽에 포함시켜 크기 계산을 편하게 만들어 줍니다.',
      },
      {
        question: 'calc()를 올바르게 쓴 것은?',
        options: ['calc(100% - 40px)', 'calc(100%-40px)', 'calc(100% -40px)', 'calc(100%- 40px)'],
        correctIndex: 0,
        explanation: 'calc()의 연산자 앞뒤에는 반드시 공백이 있어야 합니다.',
      },
    ],
  },
  {
    chapterId: 'CSS_3_TEXT_BACKGROUND',
    questions: [
      {
        question: 'line-height를 단위 없는 숫자(예: 1.6)로 쓰는 이유는?',
        options: [
          '글자 크기에 대한 비율로 상속되어 크기가 달라도 자연스럽기 때문',
          'px보다 성능이 좋기 때문',
          '단위를 쓰면 문법 오류가 나기 때문',
          '브라우저가 px을 지원하지 않기 때문',
        ],
        correctIndex: 0,
        explanation: '단위 없는 숫자는 비율로 상속되므로, 자식의 글자 크기가 달라도 줄간격이 함께 조정됩니다.',
      },
      {
        question: '배경만 반투명하게 하고 글자는 선명하게 유지하려면?',
        options: [
          'background: rgba(0, 0, 0, 0.5)를 쓴다',
          'opacity: 0.5를 쓴다',
          'visibility: hidden을 쓴다',
          'filter: blur()를 쓴다',
        ],
        correctIndex: 0,
        explanation: 'opacity는 자식 요소까지 전부 투명하게 만들므로, 배경색에 직접 투명도를 주어야 합니다.',
      },
    ],
  },
  {
    chapterId: 'CSS_4_FLEXBOX',
    questions: [
      {
        question: 'flex-direction이 row일 때 주축(main axis) 정렬을 담당하는 속성은?',
        options: ['justify-content', 'align-items', 'align-content', 'place-items'],
        correctIndex: 0,
        explanation: 'justify-content는 주축을, align-items는 교차축을 담당합니다. column이면 둘의 역할이 바뀝니다.',
      },
      {
        question: 'flex 아이템이 많아져도 줄바꿈이 되지 않고 찌그러지는 이유는?',
        options: [
          'flex-wrap의 기본값이 nowrap이기 때문',
          'gap을 지정하지 않았기 때문',
          'flex-grow가 0이기 때문',
          'align-items가 stretch이기 때문',
        ],
        correctIndex: 0,
        explanation: '기본값이 nowrap이라 한 줄에 억지로 넣습니다. flex-wrap: wrap을 명시해야 줄바꿈됩니다.',
      },
    ],
  },
  {
    chapterId: 'CSS_5_GRID',
    questions: [
      {
        question: '미디어 쿼리 없이 반응형 카드 그리드를 만드는 대표적인 코드는?',
        options: [
          'grid-template-columns: repeat(auto-fit, minmax(260px, 1fr))',
          'grid-template-columns: repeat(3, 1fr)',
          'grid-template-columns: 33.33% 33.33% 33.33%',
          'grid-auto-flow: column',
        ],
        correctIndex: 0,
        explanation: 'auto-fit과 minmax를 조합하면 화면 너비에 따라 열 개수가 자동으로 조절됩니다.',
      },
      {
        question: 'grid 아이템이 전체 너비를 차지하게 만드는 값은?',
        options: ['grid-column: 1 / -1', 'grid-column: 1 / 2', 'width: 100%', 'grid-row: span 1'],
        correctIndex: 0,
        explanation: '-1은 마지막 선을 뜻하므로, 1 / -1은 열 개수와 상관없이 처음부터 끝까지 차지합니다.',
      },
    ],
  },
  {
    chapterId: 'CSS_6_POSITION_RESPONSIVE',
    questions: [
      {
        question: '자식을 position: absolute로 배치할 때 부모에 필요한 설정은?',
        options: ['position: relative', 'display: flex', 'overflow: hidden', 'z-index: 1'],
        correctIndex: 0,
        explanation: 'absolute는 가장 가까운 non-static 조상을 기준으로 배치되므로, 기준 부모에 relative를 줘야 합니다.',
      },
      {
        question: 'position: sticky가 동작하지 않는 가장 흔한 원인은?',
        options: [
          'top 값이 없거나 조상에 overflow: hidden이 있어서',
          'z-index를 지정하지 않아서',
          'display: flex를 쓰지 않아서',
          'margin이 0이어서',
        ],
        correctIndex: 0,
        explanation: 'sticky는 top 등의 위치 값이 반드시 필요하고, 조상의 overflow가 hidden/auto면 동작하지 않습니다.',
      },
    ],
  },
  {
    chapterId: 'CSS_7_TRANSITION_ANIMATION',
    questions: [
      {
        question: '애니메이션 성능을 위해 주로 사용하도록 권장되는 속성 조합은?',
        options: ['transform과 opacity', 'width와 height', 'top과 left', 'margin과 padding'],
        correctIndex: 0,
        explanation: 'transform과 opacity는 레이아웃 재계산 없이 GPU가 처리하므로 가장 부드럽습니다.',
      },
      {
        question: '애니메이션이 끝난 뒤 마지막 상태를 유지하게 하는 속성은?',
        options: [
          'animation-fill-mode: forwards',
          'animation-iteration-count: infinite',
          'animation-direction: alternate',
          'animation-play-state: paused',
        ],
        correctIndex: 0,
        explanation: 'forwards가 없으면 애니메이션이 끝나는 순간 원래 상태로 되돌아갑니다.',
      },
    ],
  },
  {
    chapterId: 'CSS_8_VARIABLE_MODERN',
    questions: [
      {
        question: 'CSS 변수를 올바르게 선언하고 사용한 것은?',
        options: [
          '--main: red; 선언 후 color: var(--main);',
          'main: red; 선언 후 color: var(main);',
          '$main: red; 선언 후 color: $main;',
          '@main: red; 선언 후 color: @main;',
        ],
        correctIndex: 0,
        explanation: 'CSS 변수는 --로 시작하고 var()로 사용합니다. $는 Sass, @는 Less 문법입니다.',
      },
      {
        question: '자식의 상태를 보고 부모를 선택할 수 있게 해주는 가상 클래스는?',
        options: [':has()', ':is()', ':where()', ':not()'],
        correctIndex: 0,
        explanation: ':has()는 조건에 맞는 자손을 가진 부모를 선택합니다. 예: .card:has(img)',
      },
    ],
  },
  {
    chapterId: 'CSS_9_CSS_KINDS',
    questions: [
      {
        question: 'BEM 네이밍 규칙을 올바르게 적용한 것은?',
        options: ['card__title--large', 'card-title-large', 'cardTitleLarge', 'card.title.large'],
        correctIndex: 0,
        explanation: 'BEM은 블록__요소--변형 형태로, 요소는 밑줄 2개, 변형은 하이픈 2개로 구분합니다.',
      },
      {
        question: 'CSS Modules가 해결해 주는 가장 큰 문제는?',
        options: [
          '클래스 이름이 전역에서 충돌하는 문제',
          'CSS 파일 용량이 큰 문제',
          '브라우저 호환성 문제',
          '애니메이션 성능 문제',
        ],
        correctIndex: 0,
        explanation: '빌드 도구가 클래스 이름을 고유하게 바꿔주어 다른 파일의 같은 클래스명과 충돌하지 않습니다.',
      },
    ],
  },
  {
    chapterId: 'CSS_10_TAILWIND',
    questions: [
      {
        question: 'Tailwind에서 "모바일은 1열, 768px 이상은 3열"을 올바르게 쓴 것은?',
        options: [
          'grid-cols-1 md:grid-cols-3',
          'md:grid-cols-1 grid-cols-3',
          'grid-cols-1 max-md:grid-cols-3',
          'sm:grid-cols-1 grid-cols-3',
        ],
        correctIndex: 0,
        explanation: 'Tailwind는 모바일 퍼스트입니다. 접두사 없는 값이 기본(모바일)이고 md:가 768px 이상을 덮어씁니다.',
      },
      {
        question: '부모에 마우스를 올렸을 때 자식 스타일을 바꾸려면?',
        options: [
          '부모에 group, 자식에 group-hover: 를 쓴다',
          '자식에 peer-hover: 를 쓴다',
          '부모와 자식 모두에 hover: 를 쓴다',
          '자식에 parent-hover: 를 쓴다',
        ],
        correctIndex: 0,
        explanation: 'group/group-hover는 부모 호버에, peer/peer-checked는 형제 상태에 반응할 때 씁니다.',
      },
    ],
  },
  {
    chapterId: 'CSS_11_SASS_MODULES',
    questions: [
      {
        question: 'SCSS에서 &__title은 무엇으로 컴파일되나요? (부모가 .card일 때)',
        options: ['.card__title', '.card .title', '.card > .title', '.card, .title'],
        correctIndex: 0,
        explanation: '&는 현재 선택자를 문자열로 이어 붙이므로 .card__title이 됩니다. BEM과 궁합이 좋습니다.',
      },
      {
        question: '다크 모드 테마 전환에 Sass 변수($) 대신 CSS 변수(--)를 써야 하는 이유는?',
        options: [
          'Sass 변수는 빌드할 때 값으로 고정되어 런타임에 바꿀 수 없기 때문',
          'Sass 변수는 색상을 저장할 수 없기 때문',
          'CSS 변수가 더 짧게 쓸 수 있기 때문',
          'Sass 변수는 브라우저가 지원하지 않기 때문',
        ],
        correctIndex: 0,
        explanation: 'Sass 변수는 컴파일 시점에 치환되고, CSS 변수는 브라우저에서 실시간으로 동작해 JS로도 바꿀 수 있습니다.',
      },
    ],
  },
  {
    chapterId: 'CSS_12_FRAMEWORKS',
    questions: [
      {
        question: 'Bootstrap의 그리드 시스템은 화면을 몇 칸으로 나누나요?',
        options: ['12칸', '10칸', '16칸', '24칸'],
        correctIndex: 0,
        explanation: '12열 그리드를 사용하며, col-md-6은 768px 이상에서 12칸 중 6칸(절반)을 차지합니다.',
      },
      {
        question: 'Bootstrap과 Tailwind를 한 프로젝트에 함께 쓰지 않는 것이 좋은 이유는?',
        options: [
          '리셋 CSS가 충돌하고 간격 체계가 달라 혼동되며 용량도 커지기 때문',
          '라이선스가 서로 충돌하기 때문',
          '둘 다 jQuery를 필요로 하기 때문',
          '브라우저가 CSS 파일을 두 개 이상 못 읽기 때문',
        ],
        correctIndex: 0,
        explanation: '기본 스타일 초기화가 겹치고 p-3(Bootstrap)과 p-4(Tailwind)처럼 간격 숫자 체계도 달라 혼란스럽습니다.',
      },
    ],
  },
];
