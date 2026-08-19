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
}

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
    questions: [
      {
        question: '테이블의 모든 열을 조회할 때 사용하는 기호는?',
        options: ['*', '%', '#', '@'],
        correctIndex: 0,
        explanation: 'SELECT * FROM 테이블명; 형태로 모든 열을 조회할 수 있습니다.',
      },
      {
        question: '중복된 값을 제거하고 조회할 때 사용하는 키워드는?',
        options: ['DISTINCT', 'UNIQUE', 'ONLY', 'FILTER'],
        correctIndex: 0,
        explanation: 'SELECT DISTINCT 컬럼명은 중복을 제거한 유일한 값만 조회합니다.',
      },
    ],
  },
  {
    chapterId: 'SQL_2_WHERE',
    questions: [
      {
        question: '여러 조건을 모두 만족해야 조회되는 연산자는?',
        options: ['AND', 'OR', 'NOT', 'IN'],
        correctIndex: 0,
        explanation: 'AND는 나열된 모든 조건이 참일 때만 데이터를 조회합니다.',
      },
      {
        question: '문자열 패턴 검색에 사용하는 키워드는?',
        options: ['LIKE', 'MATCH', 'SEARCH', 'FIND'],
        correctIndex: 0,
        explanation: 'LIKE와 와일드카드(%, _)를 사용해 문자열 패턴을 검색합니다.',
      },
    ],
  },
  {
    chapterId: 'SQL_3_SELECT_NULL',
    questions: [
      {
        question: 'NULL 값인지 확인할 때 사용하는 연산자는?',
        options: ['IS NULL', '= NULL', '== NULL', 'NULL()'],
        correctIndex: 0,
        explanation: 'NULL은 = 로 비교할 수 없으므로 반드시 IS NULL / IS NOT NULL을 사용해야 합니다.',
      },
      {
        question: 'NULL이 아닌 첫 번째 값을 반환하는 표준 SQL 함수는?',
        options: ['COALESCE', 'NVL', 'IFNULL', 'ISNULL'],
        correctIndex: 0,
        explanation: 'COALESCE는 표준 SQL 함수이며, NVL(Oracle)/IFNULL(MySQL)은 특정 DBMS 전용 함수입니다.',
      },
    ],
  },
  {
    chapterId: 'SQL_4_ORDER_BY',
    questions: [
      {
        question: '내림차순 정렬을 나타내는 키워드는?',
        options: ['DESC', 'ASC', 'DOWN', 'REV'],
        correctIndex: 0,
        explanation: 'DESC는 내림차순(큰 값→작은 값), ASC는 오름차순(기본값)입니다.',
      },
      {
        question: '조회 결과의 행 개수를 제한하는 키워드는?',
        options: ['LIMIT', 'TOP', 'MAX', 'COUNT'],
        correctIndex: 0,
        explanation: 'LIMIT은 조회할 최대 행 개수를 제한합니다.',
      },
    ],
  },
  {
    chapterId: 'SQL_5_GROUP_BY',
    questions: [
      {
        question: '그룹별 집계 결과를 다시 필터링하는 절은?',
        options: ['HAVING', 'WHERE', 'FILTER', 'GROUP'],
        correctIndex: 0,
        explanation: 'WHERE는 그룹화 전 행을 필터링하고, HAVING은 GROUP BY 이후의 집계 결과를 필터링합니다.',
      },
      {
        question: '그룹 안 데이터의 개수를 세는 함수는?',
        options: ['COUNT(*)', 'SUM(*)', 'TOTAL(*)', 'LEN(*)'],
        correctIndex: 0,
        explanation: 'COUNT(*)는 조건에 맞는 행의 개수를 셉니다.',
      },
    ],
  },
  {
    chapterId: 'SQL_6_GROUP_FUNCTION',
    questions: [
      {
        question: '계층 구조를 기반으로 소계와 총계를 생성하는 함수는?',
        options: ['ROLLUP', 'CUBE', 'GROUPING SETS', 'UNION'],
        correctIndex: 0,
        explanation: 'ROLLUP(A, B)는 (A,B), (A), () 순으로 계층적인 소계/총계를 생성합니다.',
      },
      {
        question: '가능한 모든 조합의 집계를 생성하는 함수는?',
        options: ['CUBE', 'ROLLUP', 'HAVING', 'DISTINCT'],
        correctIndex: 0,
        explanation: 'CUBE(A, B)는 (A,B), (A), (B), () 모든 조합을 생성합니다.',
      },
    ],
  },
  {
    chapterId: 'SQL_7_JOIN',
    questions: [
      {
        question: '두 테이블 모두 조건에 일치하는 데이터만 조회하는 조인은?',
        options: ['INNER JOIN', 'LEFT JOIN', 'CROSS JOIN', 'FULL OUTER JOIN'],
        correctIndex: 0,
        explanation: 'INNER JOIN은 양쪽 테이블 모두에 일치하는 데이터가 있는 행만 결합합니다.',
      },
      {
        question: '조인 조건 없이 두 테이블의 모든 조합을 만드는 조인은?',
        options: ['CROSS JOIN', 'INNER JOIN', 'SELF JOIN', 'RIGHT JOIN'],
        correctIndex: 0,
        explanation: 'CROSS JOIN은 카티션 곱으로, 두 테이블의 모든 행 조합을 생성합니다.',
      },
    ],
  },
  {
    chapterId: 'SQL_8_SUBQUERY',
    questions: [
      {
        question: '메인 쿼리의 열을 참조하며 행마다 반복 실행되는 서브쿼리는?',
        options: ['연관 서브쿼리', '비연관 서브쿼리', '스칼라 서브쿼리', '인라인 뷰'],
        correctIndex: 0,
        explanation: '연관(Correlated) 서브쿼리는 메인 쿼리의 각 행에 대해 반복 실행됩니다.',
      },
      {
        question: '서브쿼리 결과가 한 건이라도 존재하는지만 확인하는 연산자는?',
        options: ['EXISTS', 'IN', 'ANY', 'ALL'],
        correctIndex: 0,
        explanation: 'EXISTS는 결과의 존재 여부만 확인하며, NULL의 영향을 받지 않아 NOT IN보다 안전합니다.',
      },
    ],
  },
  {
    chapterId: 'SQL_9_SET_OPERATOR',
    questions: [
      {
        question: '중복을 제거하지 않고 두 쿼리 결과를 합치는 연산자는?',
        options: ['UNION ALL', 'UNION', 'INTERSECT', 'EXCEPT'],
        correctIndex: 0,
        explanation: 'UNION ALL은 중복을 제거하지 않아 UNION보다 속도가 빠릅니다.',
      },
      {
        question: '두 쿼리 결과의 교집합을 구하는 연산자는?',
        options: ['INTERSECT', 'UNION', 'EXCEPT', 'MINUS'],
        correctIndex: 0,
        explanation: 'INTERSECT는 두 쿼리 결과에 공통으로 존재하는 데이터만 반환합니다.',
      },
    ],
  },
  {
    chapterId: 'SQL_10_WINDOW_FUNCTION',
    questions: [
      {
        question: '동률이 있어도 무조건 고유한 순번을 부여하는 함수는?',
        options: ['ROW_NUMBER()', 'RANK()', 'DENSE_RANK()', 'NTILE()'],
        correctIndex: 0,
        explanation: 'ROW_NUMBER()는 동률과 상관없이 1부터 유일한 번호를 매깁니다.',
      },
      {
        question: '현재 행 기준 이전 행의 값을 가져오는 함수는?',
        options: ['LAG()', 'LEAD()', 'FIRST_VALUE()', 'RANK()'],
        correctIndex: 0,
        explanation: 'LAG()는 이전 행의 값을, LEAD()는 다음 행의 값을 가져옵니다.',
      },
    ],
  },
  {
    chapterId: 'SQL_11_MODELING',
    questions: [
      {
        question: '부서 하나에 여러 사원이 속하는 것과 같은 관계는?',
        options: ['1:N', '1:1', 'N:M', '0:1'],
        correctIndex: 0,
        explanation: '한쪽의 인스턴스 하나가 다른 쪽 여러 인스턴스와 대응하는 것을 1:N 관계라고 합니다.',
      },
      {
        question: '테이블에서 각 행을 유일하게 식별하는 속성은?',
        options: ['기본키(Primary Key)', '외래키', '일반 속성', '도메인'],
        correctIndex: 0,
        explanation: '기본키는 유일성과 최소성을 만족하며 각 행을 식별하는 대표 속성입니다.',
      },
    ],
  },
  {
    chapterId: 'SQL_12_DDL_DML',
    questions: [
      {
        question: '테이블 구조 자체를 완전히 삭제하는 명령어는?',
        options: ['DROP', 'DELETE', 'TRUNCATE', 'REMOVE'],
        correctIndex: 0,
        explanation: 'DROP TABLE은 테이블 구조와 데이터를 모두 삭제합니다.',
      },
      {
        question: '테이블 구조는 남기고 데이터만 전부 지우며 롤백이 불가능한 명령어는?',
        options: ['TRUNCATE', 'DELETE', 'DROP', 'UPDATE'],
        correctIndex: 0,
        explanation: 'TRUNCATE는 DDL 명령어로, 데이터를 전부 지우지만 테이블 구조는 유지하고 롤백은 불가능합니다.',
      },
    ],
  },
  {
    chapterId: 'SQL_13_CTE_TCL_DCL',
    questions: [
      {
        question: '실제 데이터를 저장하지 않고 SELECT 결과를 테이블처럼 보여주는 것은?',
        options: ['VIEW', 'TABLE', 'INDEX', 'SCHEMA'],
        correctIndex: 0,
        explanation: 'VIEW는 실제 데이터를 저장하지 않는 가상 테이블입니다.',
      },
      {
        question: '변경 사항을 취소하고 이전 상태로 되돌리는 명령어는?',
        options: ['ROLLBACK', 'COMMIT', 'SAVEPOINT', 'GRANT'],
        correctIndex: 0,
        explanation: 'ROLLBACK은 트랜잭션의 변경 사항을 취소하고 이전 상태로 되돌립니다.',
      },
    ],
  },
  {
    chapterId: 'SQL_14_INDEX',
    questions: [
      {
        question: '인덱스를 생성할 때 사용하는 명령어는?',
        options: ['CREATE INDEX', 'ADD INDEX', 'NEW INDEX', 'MAKE INDEX'],
        correctIndex: 0,
        explanation: 'CREATE INDEX 인덱스명 ON 테이블명(열) 형태로 인덱스를 생성합니다.',
      },
      {
        question: '인덱스의 단점으로 옳은 것은?',
        options: ['INSERT/UPDATE/DELETE 시 함께 갱신되어 쓰기 성능이 느려질 수 있다', '조회 성능이 항상 느려진다', '저장 공간을 전혀 차지하지 않는다', '항상 자동으로 사용된다'],
        correctIndex: 0,
        explanation: '인덱스는 조회는 빠르게 하지만, 데이터가 바뀔 때마다 인덱스도 갱신해야 해서 쓰기 성능에는 부담을 줍니다.',
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
];
