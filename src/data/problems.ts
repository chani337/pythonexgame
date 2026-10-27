// Auto-generated problems file from 문제.txt
import type { WebCheck } from '../utils/webChecks';

export interface TestCase {
  input: string;
  // base64-encoded (see src/utils/answerObfuscation.ts), decode before
  // comparing against actual program output.
  expected: string;
}

export type ProblemType = 'coding' | 'quiz' | 'fill';
export type ProblemLanguage = 'python' | 'sql' | 'java' | 'js' | 'algorithm' | 'c' | 'html' | 'css';

export interface Problem {
  id: string;
  title: string;
  category: string;
  difficulty: 'basic' | 'intermediate' | 'advanced' | 'expert';
  type: ProblemType;
  language?: ProblemLanguage;
  description: string;
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  initialCode?: string;
  testCases?: TestCase[];
  testRunnerCode?: string;
  // html/css coding problems only: graded by inspecting the rendered preview
  // instead of comparing stdout (see src/utils/webChecks.ts).
  webChecks?: WebCheck[];
  // python problems: CSV files from src/data/pyDatasets.ts this problem
  // reads. Every file is available to every run; this only decides which
  // ones the workspace previews.
  datasets?: string[];
  // python/algorithm problems: call expressions with large inputs, run after
  // every testCase passes. Graded against the reference solution in
  // solutionCode.ts, timed on the student's own device (PERF_HARNESS).
  perfTests?: string[];
  // sql problems: which seed dataset to run on (src/data/sqlSeed.ts,
  // default 'default' = users/orders), and for DDL/DML problems a query run
  // after the student's code whose output is what gets graded.
  sqlDataset?: string;
  sqlCheck?: string;
  quizQuestion?: string;
  quizOptions?: string[];
  // base64-encoded (see src/utils/answerObfuscation.ts) so it isn't plainly
  // readable by scanning the bundled source next to the option list.
  correctAnswerIndex?: string;
  fillQuestion?: string;
  fillPrefix?: string;
  fillSuffix?: string;
  // base64-encoded, same reason as correctAnswerIndex above.
  correctAnswerText?: string;
  placeholderText?: string;
}

export interface ProblemFilters {
  language?: string;
  difficulty?: string;
  type?: string;
  search?: string;
}

// Shared filter predicate used by ProblemList and App.tsx's next/prev navigation,
// so all three call sites stay in sync when a new filter dimension is added.
export function filterProblems(list: Problem[], filters: ProblemFilters): Problem[] {
  const { language = 'all', difficulty = 'all', type = 'all', search = '' } = filters;
  const searchLower = search.toLowerCase();
  return list.filter((problem) => {
    const problemLanguage = problem.language || 'python';
    const matchesLanguage = language === 'all' || problemLanguage === language;
    const matchesDifficulty = difficulty === 'all' || problem.difficulty === difficulty;
    const matchesType = type === 'all' || problem.type === type;
    const matchesSearch =
      !searchLower ||
      problem.title.toLowerCase().includes(searchLower) ||
      problem.category.toLowerCase().includes(searchLower);
    return matchesLanguage && matchesDifficulty && matchesType && matchesSearch;
  });
}

export const problems: Problem[] = [
  {
    "id": "basic_part1_q1",
    "title": "변수 문제 1. 이름 저장하기",
    "category": "변수",
    "difficulty": "basic",
    "type": "coding",
    "description": "자신의 이름을 변수에 저장하고 출력하세요.",
    "constraints": [
      "변수 이름은 `name`으로 작성하세요.",
      "`\"김철수\"`를 저장하세요.",
      "저장된 값을 출력하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "김철수"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "6rmA7LKg7IiY"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "basic_part1_q2",
    "title": "변수 문제 2. 나이 저장하기",
    "category": "변수",
    "difficulty": "basic",
    "type": "coding",
    "description": "나이를 변수에 저장하고 출력하세요.",
    "constraints": [
      "변수 이름은 `age`로 작성하세요.",
      "숫자 `20`을 저장하세요.",
      "저장된 값을 출력하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "20"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "MjA="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "basic_part1_q3",
    "title": "변수 문제 3. 여러 정보 저장하기",
    "category": "변수",
    "difficulty": "basic",
    "type": "coding",
    "description": "이름, 나이, 좋아하는 음식을 각각 변수에 저장하고 출력하세요.",
    "constraints": [
      "이름은 `name`",
      "나이는 `age`",
      "음식은 `food`",
      "각각 한 줄씩 출력하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "김철수\n20\n치킨"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "6rmA7LKg7IiYCjIwCuy5mO2CqA=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "basic_part1_q4",
    "title": "변수 문제 4. 학교 정보 저장하기",
    "category": "변수",
    "difficulty": "basic",
    "type": "coding",
    "description": "학교 이름과 학년을 변수에 저장하고 출력하세요.",
    "constraints": [
      "학교 이름은 `school`",
      "학년은 `grade`",
      "학교 이름은 `\"한국대학교\"`",
      "학년은 `2`"
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "한국대학교\n2"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "7ZWc6rWt64yA7ZWZ6rWQCjI="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "basic_part1_q5",
    "title": "변수 문제 5. 변수 값 변경하기",
    "category": "변수",
    "difficulty": "basic",
    "type": "coding",
    "description": "변수에 처음에는 `10`을 저장한 뒤, 값을 `20`으로 변경하여 출력하세요.",
    "constraints": [
      "변수 이름은 `number`",
      "처음에는 `10`을 저장하세요.",
      "이후 `20`으로 변경하세요.",
      "마지막 값만 출력하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "20"
      }
    ],
    "initialCode": "number = 10\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "MjA="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "basic_part1_q6",
    "title": "변수 문제 6. 상품 정보 저장하기",
    "category": "변수",
    "difficulty": "basic",
    "type": "coding",
    "description": "상품 이름과 가격을 변수에 저장하고 출력하세요.",
    "constraints": [
      "상품 이름은 `product`",
      "가격은 `price`",
      "`\"키보드\"`와 `35000`을 저장하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "키보드\n35000"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "7YKk67O065OcCjM1MDAw"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "basic_part1_q7",
    "title": "변수 문제 7. 키와 몸무게 저장하기",
    "category": "변수",
    "difficulty": "basic",
    "type": "coding",
    "description": "키와 몸무게를 각각 변수에 저장하세요.",
    "constraints": [
      "키는 `height`에 `175.5`",
      "몸무게는 `weight`에 `68.2`",
      "각각 출력하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "175.5\n68.2"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "MTc1LjUKNjguMg=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "basic_part1_q8",
    "title": "변수 문제 8. 변수끼리 값 복사하기",
    "category": "변수",
    "difficulty": "basic",
    "type": "coding",
    "description": "`first` 변수의 값을 `second` 변수에 저장하고 두 변수를 출력하세요.",
    "constraints": [
      "`first`에 `100`을 저장하세요.",
      "`second`에는 `first`를 이용하여 값을 저장하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "100\n100"
      }
    ],
    "initialCode": "first = 100\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "MTAwCjEwMA=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "basic_part1_q9",
    "title": "변수 문제 9. 게임 캐릭터 정보 저장하기",
    "category": "변수",
    "difficulty": "basic",
    "type": "coding",
    "description": "게임 캐릭터의 이름, 레벨, 체력을 변수로 저장하고 출력하세요.",
    "constraints": [
      "이름: `\"용사\"`",
      "레벨: `10`",
      "체력: `100`",
      "각각 별도의 변수에 저장하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "용사\n10\n100"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "7Jqp7IKsCjEwCjEwMA=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "basic_part1_q10",
    "title": "변수 문제 10. 자기소개 정보 저장하기",
    "category": "변수",
    "difficulty": "basic",
    "type": "coding",
    "description": "이름, 나이, 지역, 취미를 각각 변수에 저장하고 출력하세요.",
    "constraints": [
      "이름: `\"민수\"`",
      "나이: `25`",
      "지역: `\"광주\"`",
      "취미: `\"게임\"`"
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "민수\n25\n광주\n게임"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "66+87IiYCjI1Cuq0keyjvArqsozsnoQ="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "basic_part2_q1",
    "title": "문자열 문제 1. 문자열 출력하기",
    "category": "문자열",
    "difficulty": "basic",
    "type": "coding",
    "description": "문자열 `\"Hello Python\"`을 변수에 저장하고 출력하세요.",
    "constraints": [
      "변수 이름은 `message`",
      "문자열을 그대로 출력하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "Hello Python"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "SGVsbG8gUHl0aG9u"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "basic_part2_q2",
    "title": "문자열 문제 2. 문자열 연결하기",
    "category": "문자열",
    "difficulty": "basic",
    "type": "coding",
    "description": "이름과 인사말을 문자열 연결 연산자를 사용하여 출력하세요.",
    "constraints": [
      "`name`에는 `\"민수\"`",
      "`\"안녕하세요 \"`와 `name`을 연결하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "안녕하세요 민수"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "7JWI64WV7ZWY7IS47JqUIOuvvOyImA=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "basic_part2_q3",
    "title": "문자열 문제 3. 문자열 반복하기",
    "category": "문자열",
    "difficulty": "basic",
    "type": "coding",
    "description": "문자열 `\"파이썬!\"`을 3번 반복하여 출력하세요.",
    "constraints": [
      "문자열 반복 연산자를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "파이썬!파이썬!파이썬!"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "7YyM7J207I2sIe2MjOydtOyNrCHtjIzsnbTsjawh"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "basic_part2_q4",
    "title": "문자열 문제 4. 문자열 길이 확인하기",
    "category": "문자열",
    "difficulty": "basic",
    "type": "coding",
    "description": "문자열 `\"Python\"`의 글자 수를 출력하세요.",
    "constraints": [
      "변수 이름은 `text`",
      "`len()`을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "6"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "Ng=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "basic_part2_q5",
    "title": "문자열 문제 5. 첫 번째 문자 출력하기",
    "category": "문자열",
    "difficulty": "basic",
    "type": "coding",
    "description": "문자열 `\"Python\"`에서 첫 번째 글자를 출력하세요.",
    "constraints": [
      "인덱싱을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "P"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "UA=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "basic_part2_q6",
    "title": "문자열 문제 6. 마지막 문자 출력하기",
    "category": "문자열",
    "difficulty": "basic",
    "type": "coding",
    "description": "문자열 `\"Hello\"`에서 마지막 글자를 출력하세요.",
    "constraints": [
      "음수 인덱스를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "o"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "bw=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "basic_part2_q7",
    "title": "문자열 문제 7. 문자열 일부 가져오기",
    "category": "문자열",
    "difficulty": "basic",
    "type": "coding",
    "description": "문자열 `\"Python\"`에서 `\"Pyt\"`만 출력하세요.",
    "constraints": [
      "슬라이싱을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "Pyt"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "UHl0"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "basic_part2_q8",
    "title": "문자열 문제 8. 대문자로 변경하기",
    "category": "문자열",
    "difficulty": "basic",
    "type": "coding",
    "description": "문자열 `\"hello python\"`을 모두 대문자로 변경하여 출력하세요.",
    "constraints": [
      "`upper()`를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "HELLO PYTHON"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "SEVMTE8gUFlUSE9O"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "basic_part2_q9",
    "title": "문자열 문제 9. 문자 바꾸기",
    "category": "문자열",
    "difficulty": "basic",
    "type": "coding",
    "description": "문자열 `\"I like Java\"`에서 `\"Java\"`를 `\"Python\"`으로 바꾸세요.",
    "constraints": [
      "`replace()`를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "I like Python"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "SSBsaWtlIFB5dGhvbg=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "basic_part2_q10",
    "title": "문자열 문제 10. 문자열 나누기",
    "category": "문자열",
    "difficulty": "basic",
    "type": "coding",
    "description": "문자열 `\"사과,바나나,포도\"`를 쉼표를 기준으로 나누어 출력하세요.",
    "constraints": [
      "`split()`을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "['사과', '바나나', '포도']"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "Wyfsgqzqs7wnLCAn67CU64KY64KYJywgJ+2PrOuPhCdd"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "basic_part3_q1",
    "title": "연산자 문제 1. 두 수 더하기",
    "category": "연산자",
    "difficulty": "basic",
    "type": "coding",
    "description": "두 숫자 `10`과 `5`의 합을 출력하세요.",
    "constraints": [
      "`+` 연산자를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "15"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "MTU="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "basic_part3_q2",
    "title": "연산자 문제 2. 사칙연산하기",
    "category": "연산자",
    "difficulty": "basic",
    "type": "coding",
    "description": "`20`과 `4`를 이용하여 덧셈, 뺄셈, 곱셈, 나눗셈 결과를 출력하세요.",
    "constraints": [
      "`+`, `-`, `*`, `/`를 사용하세요.",
      "결과를 각각 한 줄씩 출력하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "24\n16\n80\n5.0"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "MjQKMTYKODAKNS4w"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "basic_part3_q3",
    "title": "연산자 문제 3. 몫 구하기",
    "category": "연산자",
    "difficulty": "basic",
    "type": "coding",
    "description": "`17`을 `5`로 나눈 몫을 출력하세요.",
    "constraints": [
      "몫 연산자를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "3"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "Mw=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "basic_part3_q4",
    "title": "연산자 문제 4. 나머지 구하기",
    "category": "연산자",
    "difficulty": "basic",
    "type": "coding",
    "description": "`17`을 `5`로 나눈 나머지를 출력하세요.",
    "constraints": [
      "나머지 연산자를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "2"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "Mg=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "basic_part3_q5",
    "title": "연산자 문제 5. 제곱 계산하기",
    "category": "연산자",
    "difficulty": "basic",
    "type": "coding",
    "description": "숫자 `5`의 제곱을 출력하세요.",
    "constraints": [
      "거듭제곱 연산자를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "25"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "MjU="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "basic_part3_q6",
    "title": "연산자 문제 6. 비교하기",
    "category": "연산자",
    "difficulty": "basic",
    "type": "coding",
    "description": "`10`이 `5`보다 큰지 확인하여 결과를 출력하세요.",
    "constraints": [
      "비교 연산자를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "True"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "VHJ1ZQ=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "basic_part3_q7",
    "title": "연산자 문제 7. 같은 값인지 확인하기",
    "category": "연산자",
    "difficulty": "basic",
    "type": "coding",
    "description": "두 변수에 저장된 값이 같은지 확인하세요.",
    "constraints": [
      "`a = 10`",
      "`b = 10`",
      "동등 비교 연산자를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "True"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "VHJ1ZQ=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "basic_part3_q8",
    "title": "연산자 문제 8. 범위 확인하기",
    "category": "연산자",
    "difficulty": "basic",
    "type": "coding",
    "description": "나이가 20살 이상이고 30살 이하인지 확인하세요.",
    "constraints": [
      "`age = 25`",
      "논리 연산자 `and`를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "True"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "VHJ1ZQ=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "basic_part3_q9",
    "title": "연산자 문제 9. 둘 중 하나 확인하기",
    "category": "연산자",
    "difficulty": "basic",
    "type": "coding",
    "description": "오늘이 주말이거나 공휴일인지 확인하세요.",
    "constraints": [
      "`weekend = False`",
      "`holiday = True`",
      "`or` 연산자를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "True"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "VHJ1ZQ=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "basic_part3_q10",
    "title": "연산자 문제 10. 값 반대로 만들기",
    "category": "연산자",
    "difficulty": "basic",
    "type": "coding",
    "description": "`is_raining`에 `True`를 저장하고 `not`을 사용한 결과를 출력하세요.",
    "constraints": [
      "`not` 연산자를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "False"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "RmFsc2U="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "intermediate_part4_q1",
    "title": "조건문 문제 1. 성인 확인하기",
    "category": "조건문",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "나이가 19세 이상이면 `\"성인입니다.\"`를 출력하세요.",
    "constraints": [
      "`age = 20`",
      "`if`문을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "성인입니다."
      }
    ],
    "initialCode": "age = 20\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "7ISx7J247J6F64uI64ukLg=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "intermediate_part4_q2",
    "title": "조건문 문제 2. 양수 확인하기",
    "category": "조건문",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "숫자가 0보다 크면 `\"양수입니다.\"`를 출력하세요.",
    "constraints": [
      "`number = 10`"
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "양수입니다."
      }
    ],
    "initialCode": "number = 10\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "7JaR7IiY7J6F64uI64ukLg=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "intermediate_part4_q3",
    "title": "조건문 문제 3. 홀수와 짝수 구분하기",
    "category": "조건문",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "숫자가 짝수인지 홀수인지 판단하세요.",
    "constraints": [
      "`number = 7`",
      "`%` 연산자를 사용하세요.",
      "`if`, `else`를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "홀수입니다."
      }
    ],
    "initialCode": "number = 7\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "7ZmA7IiY7J6F64uI64ukLg=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "intermediate_part4_q4",
    "title": "조건문 문제 4. 합격 여부 확인하기",
    "category": "조건문",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "점수가 60점 이상이면 `\"합격\"`, 그렇지 않으면 `\"불합격\"`을 출력하세요.",
    "constraints": [
      "`score = 75`"
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "합격"
      }
    ],
    "initialCode": "score = 75\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "7ZWp6rKp"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "intermediate_part4_q5",
    "title": "조건문 문제 5. 비밀번호 확인하기",
    "category": "조건문",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "입력된 비밀번호가 저장된 비밀번호와 같은지 확인하세요.",
    "constraints": [
      "저장된 비밀번호는 `\"python123\"`",
      "입력된 비밀번호도 `\"python123\"`으로 설정하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "로그인 성공"
      }
    ],
    "initialCode": "saved_password = \"python123\"\ninput_password = \"python123\"\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "66Gc6re47J24IOyEseqztQ=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "intermediate_part4_q6",
    "title": "조건문 문제 6. 숫자 크기 구분하기",
    "category": "조건문",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "숫자가 양수, 음수, 0 중 무엇인지 출력하세요.",
    "constraints": [
      "`number = -5`",
      "`if`, `elif`, `else`를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "음수입니다."
      }
    ],
    "initialCode": "number = -5\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "7J2M7IiY7J6F64uI64ukLg=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "intermediate_part4_q7",
    "title": "조건문 문제 7. 성적 등급 출력하기",
    "category": "조건문",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "점수에 따라 등급을 출력하세요.",
    "constraints": [
      "90점 이상: A",
      "80점 이상: B",
      "70점 이상: C",
      "그 외: D",
      "`score = 85`"
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "B"
      }
    ],
    "initialCode": "score = 85\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "Qg=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "intermediate_part4_q8",
    "title": "조건문 문제 8. 영화 입장 확인하기",
    "category": "조건문",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "나이가 15세 이상이면 영화에 입장할 수 있도록 만드세요.",
    "constraints": [
      "`age = 13`",
      "입장 가능하면 `\"입장 가능\"`",
      "그렇지 않으면 `\"입장 불가\"`"
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "입장 불가"
      }
    ],
    "initialCode": "age = 13\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "7J6F7J6lIOu2iOqwgA=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "intermediate_part4_q9",
    "title": "조건문 문제 9. 무료 배송 확인하기",
    "category": "조건문",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "구매 금액이 50000원 이상이면 무료 배송 여부를 출력하세요.",
    "constraints": [
      "`price = 65000`",
      "50000원 이상: `\"무료 배송\"`",
      "그 외: `\"배송비 3000원\"`"
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "무료 배송"
      }
    ],
    "initialCode": "price = 65000\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "66y066OMIOuwsOyGoQ=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "intermediate_part4_q10",
    "title": "조건문 문제 10. 로그인과 관리자 확인하기",
    "category": "조건문",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "로그인 상태와 관리자 여부를 이용해 결과를 출력하세요.",
    "constraints": [
      "`is_login = True`",
      "`is_admin = True`",
      "둘 다 참이면 `\"관리자 페이지 접속 가능\"`",
      "그렇지 않으면 `\"접속 불가\"`"
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "관리자 페이지 접속 가능"
      }
    ],
    "initialCode": "is_login = True\nis_admin = True\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "6rSA66as7J6QIO2OmOydtOyngCDsoJHsho0g6rCA64ql"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "intermediate_part5_q1",
    "title": "리스트 문제 1. 과일 리스트 만들기",
    "category": "리스트",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "사과, 바나나, 포도를 리스트에 저장하고 출력하세요.",
    "constraints": [
      "변수 이름은 `fruits`"
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "['사과', '바나나', '포도']"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "Wyfsgqzqs7wnLCAn67CU64KY64KYJywgJ+2PrOuPhCdd"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "intermediate_part5_q2",
    "title": "리스트 문제 2. 첫 번째 값 출력하기",
    "category": "리스트",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "과일 리스트에서 첫 번째 과일을 출력하세요.",
    "constraints": [
      "`['사과', '바나나', '포도']`",
      "인덱싱을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "사과"
      }
    ],
    "initialCode": "fruits = [\"사과\", \"바나나\", \"포도\"]\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "7IKs6rO8"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "intermediate_part5_q3",
    "title": "리스트 문제 3. 마지막 값 출력하기",
    "category": "리스트",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "리스트의 마지막 값을 출력하세요.",
    "constraints": [
      "`[10, 20, 30, 40]`",
      "음수 인덱스를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "40"
      }
    ],
    "initialCode": "numbers = [10, 20, 30, 40]\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "NDA="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "intermediate_part5_q4",
    "title": "리스트 문제 4. 일부 값 가져오기",
    "category": "리스트",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "리스트 `[10, 20, 30, 40, 50]`에서 `20, 30, 40`만 가져오세요.",
    "constraints": [
      "슬라이싱을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "[20, 30, 40]"
      }
    ],
    "initialCode": "numbers = [10, 20, 30, 40, 50]\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "WzIwLCAzMCwgNDBd"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "intermediate_part5_q5",
    "title": "리스트 문제 5. 새로운 값 추가하기",
    "category": "리스트",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "과일 리스트에 `\"딸기\"`를 추가하세요.",
    "constraints": [
      "기존 리스트는 `['사과', '바나나']`",
      "`append()`를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "['사과', '바나나', '딸기']"
      }
    ],
    "initialCode": "fruits = [\"사과\", \"바나나\"]\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "Wyfsgqzqs7wnLCAn67CU64KY64KYJywgJ+uUuOq4sCdd"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "intermediate_part5_q6",
    "title": "리스트 문제 6. 값 삭제하기",
    "category": "리스트",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "리스트에서 `\"바나나\"`를 삭제하세요.",
    "constraints": [
      "`['사과', '바나나', '포도']`",
      "`remove()`를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "['사과', '포도']"
      }
    ],
    "initialCode": "fruits = [\"사과\", \"바나나\", \"포도\"]\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "Wyfsgqzqs7wnLCAn7Y+s64+EJ10="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "intermediate_part5_q7",
    "title": "리스트 문제 7. 값 변경하기",
    "category": "리스트",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "리스트의 두 번째 값을 `200`으로 변경하세요.",
    "constraints": [
      "기존 리스트는 `[10, 20, 30]`"
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "[10, 200, 30]"
      }
    ],
    "initialCode": "numbers = [10, 20, 30]\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "WzEwLCAyMDAsIDMwXQ=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "intermediate_part5_q8",
    "title": "리스트 문제 8. 리스트 길이 구하기",
    "category": "리스트",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "리스트에 저장된 값의 개수를 출력하세요.",
    "constraints": [
      "리스트는 `[10, 20, 30, 40, 50]`",
      "`len()`을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "5"
      }
    ],
    "initialCode": "numbers = [10, 20, 30, 40, 50]\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "NQ=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "intermediate_part5_q9",
    "title": "리스트 문제 9. 리스트 정렬하기",
    "category": "리스트",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "숫자 리스트를 작은 숫자부터 정렬하세요.",
    "constraints": [
      "`[5, 2, 4, 1, 3]`",
      "`sort()`를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "[1, 2, 3, 4, 5]"
      }
    ],
    "initialCode": "numbers = [5, 2, 4, 1, 3]\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "WzEsIDIsIDMsIDQsIDVd"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "intermediate_part5_q10",
    "title": "리스트 문제 10. 리스트 안에 값 확인하기",
    "category": "리스트",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "과일 리스트에 `\"바나나\"`가 있는지 확인하세요.",
    "constraints": [
      "`['사과', '바나나', '포도']`",
      "`in`을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "True"
      }
    ],
    "initialCode": "fruits = [\"사과\", \"바나나\", \"포도\"]\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "VHJ1ZQ=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "intermediate_part6_q1",
    "title": "튜플 문제 1. 튜플 만들기",
    "category": "튜플",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "월요일, 화요일, 수요일을 튜플에 저장하고 출력하세요.",
    "constraints": [
      "변수 이름은 `days`"
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "('월요일', '화요일', '수요일')"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "KCfsm5TsmpTsnbwnLCAn7ZmU7JqU7J28JywgJ+yImOyalOydvCcp"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "intermediate_part6_q2",
    "title": "튜플 문제 2. 첫 번째 값 출력하기",
    "category": "튜플",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "튜플의 첫 번째 값을 출력하세요.",
    "constraints": [
      "`(10, 20, 30)`"
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "10"
      }
    ],
    "initialCode": "numbers = (10, 20, 30)\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "MTA="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "intermediate_part6_q3",
    "title": "튜플 문제 3. 마지막 값 출력하기",
    "category": "튜플",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "튜플에서 마지막 값을 출력하세요.",
    "constraints": [
      "`(10, 20, 30, 40)`"
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "40"
      }
    ],
    "initialCode": "numbers = (10, 20, 30, 40)\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "NDA="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "intermediate_part6_q4",
    "title": "튜플 문제 4. 튜플 슬라이싱하기",
    "category": "튜플",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "튜플 `(10, 20, 30, 40, 50)`에서 `20, 30, 40`만 출력하세요.",
    "constraints": [
      "슬라이싱을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "(20, 30, 40)"
      }
    ],
    "initialCode": "numbers = (10, 20, 30, 40, 50)\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "KDIwLCAzMCwgNDAp"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "intermediate_part6_q5",
    "title": "튜플 문제 5. 튜플 길이 구하기",
    "category": "튜플",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "튜플에 저장된 값의 개수를 출력하세요.",
    "constraints": [
      "`(1, 2, 3, 4, 5)`",
      "`len()`을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "5"
      }
    ],
    "initialCode": "numbers = (1, 2, 3, 4, 5)\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "NQ=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "intermediate_part6_q6",
    "title": "튜플 문제 6. 값 존재 여부 확인하기",
    "category": "튜플",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "튜플에 `\"서울\"`이 들어 있는지 확인하세요.",
    "constraints": [
      "`('서울', '부산', '광주')`",
      "`in`을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "True"
      }
    ],
    "initialCode": "cities = (\"서울\", \"부산\", \"광주\")\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "VHJ1ZQ=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "intermediate_part6_q7",
    "title": "튜플 문제 7. 튜플 연결하기",
    "category": "튜플",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "두 개의 튜플을 하나로 연결하세요.",
    "constraints": [
      "첫 번째 튜플: `(1, 2, 3)`",
      "두 번째 튜플: `(4, 5, 6)`"
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "(1, 2, 3, 4, 5, 6)"
      }
    ],
    "initialCode": "tuple1 = (1, 2, 3)\ntuple2 = (4, 5, 6)\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "KDEsIDIsIDMsIDQsIDUsIDYp"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "intermediate_part6_q8",
    "title": "튜플 문제 8. 튜플 반복하기",
    "category": "튜플",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "튜플 `('안녕',)`을 3번 반복하세요.",
    "constraints": [
      "튜플 반복 연산자를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "('안녕', '안녕', '안녕')"
      }
    ],
    "initialCode": "t = (\"안녕\",)\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "KCfslYjrhZUnLCAn7JWI64WVJywgJ+yViOuFlScp"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "intermediate_part6_q9",
    "title": "튜플 문제 9. 튜플 값 각각 저장하기",
    "category": "튜플",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "튜플에 저장된 이름과 나이를 각각 다른 변수에 저장하세요.",
    "constraints": [
      "튜플은 `('민수', 25)`",
      "각각 `name`, `age`에 저장하세요.",
      "두 값을 출력하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "민수\n25"
      }
    ],
    "initialCode": "data = (\"민수\", 25)\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "66+87IiYCjI1"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "intermediate_part6_q10",
    "title": "튜플 문제 10. 좌표 저장하기",
    "category": "튜플",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "x좌표와 y좌표를 튜플에 저장한 뒤 각각 출력하세요.",
    "constraints": [
      "좌표는 `(10, 20)`",
      "`x`, `y` 변수에 각각 저장하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "10\n20"
      }
    ],
    "initialCode": "point = (10, 20)\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "MTAKMjA="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "advanced_part7_q1",
    "title": "반복문 문제 1. 1부터 5까지 출력하기",
    "category": "반복문",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "`for`문을 사용하여 1부터 5까지 출력하세요.",
    "constraints": [
      "`range()`를 사용하세요.",
      "한 줄에 하나씩 출력하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "1\n2\n3\n4\n5"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "MQoyCjMKNAo1"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "advanced_part7_q2",
    "title": "반복문 문제 2. 과일 출력하기",
    "category": "반복문",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "리스트의 과일을 하나씩 출력하세요.",
    "constraints": [
      "리스트는 `['사과', '바나나', '포도']`",
      "`for`문을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "사과\n바나나\n포도"
      }
    ],
    "initialCode": "fruits = [\"사과\", \"바나나\", \"포도\"]\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "7IKs6rO8CuuwlOuCmOuCmArtj6zrj4Q="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "advanced_part7_q3",
    "title": "반복문 문제 3. 1부터 10까지 짝수 출력하기",
    "category": "반복문",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "1부터 10까지 숫자 중 짝수만 출력하세요.",
    "constraints": [
      "`for`문과 조건문을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "2\n4\n6\n8\n10"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "Mgo0CjYKOAoxMA=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "advanced_part7_q4",
    "title": "반복문 문제 4. 1부터 5까지 합 구하기",
    "category": "반복문",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "1부터 5까지 모든 숫자의 합을 구하세요.",
    "constraints": [
      "반복문을 사용하세요.",
      "합계를 저장할 변수를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "15"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "MTU="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "advanced_part7_q5",
    "title": "반복문 문제 5. 문자열 반복 출력하기",
    "category": "반복문",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "`\"파이썬\"`이라는 문자열을 5번 출력하세요.",
    "constraints": [
      "`for`문을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "파이썬\n파이썬\n파이썬\n파이썬\n파이썬"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "7YyM7J207I2sCu2MjOydtOyNrArtjIzsnbTsjawK7YyM7J207I2sCu2MjOydtOyNrA=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "advanced_part7_q6",
    "title": "반복문 문제 6. 5부터 1까지 출력하기",
    "category": "반복문",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "숫자를 5부터 1까지 역순으로 출력하세요.",
    "constraints": [
      "`range()`를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "5\n4\n3\n2\n1"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "NQo0CjMKMgox"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "advanced_part7_q7",
    "title": "반복문 문제 7. 구구단 2단 출력하기",
    "category": "반복문",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "반복문을 사용하여 구구단 2단을 출력하세요.",
    "constraints": [
      "2 × 1부터 2 × 9까지 출력하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n2 x 4 = 8\n2 x 5 = 10\n2 x 6 = 12\n2 x 7 = 14\n2 x 8 = 16\n2 x 9 = 18"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "MiB4IDEgPSAyCjIgeCAyID0gNAoyIHggMyA9IDYKMiB4IDQgPSA4CjIgeCA1ID0gMTAKMiB4IDYgPSAxMgoyIHggNyA9IDE0CjIgeCA4ID0gMTYKMiB4IDkgPSAxOA=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "advanced_part7_q8",
    "title": "반복문 문제 8. 3의 배수 출력하기",
    "category": "반복문",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "1부터 20까지 숫자 중 3의 배수만 출력하세요.",
    "constraints": [
      "반복문과 `%`를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "3\n6\n9\n12\n15\n18"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "Mwo2CjkKMTIKMTUKMTg="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "advanced_part7_q9",
    "title": "반복문 문제 9. while문으로 숫자 출력하기",
    "category": "반복문",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "`while`문을 사용하여 1부터 5까지 출력하세요.",
    "constraints": [
      "시작값은 `1`",
      "반복할 때마다 값을 1 증가시키세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "1\n2\n3\n4\n5"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "MQoyCjMKNAo1"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "advanced_part7_q10",
    "title": "반복문 문제 10. 리스트 숫자의 합 구하기",
    "category": "반복문",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "리스트에 들어 있는 모든 숫자의 합을 반복문으로 구하세요.",
    "constraints": [
      "리스트는 `[10, 20, 30, 40]`",
      "`sum()`을 사용하지 마세요.",
      "`for`문을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "100"
      }
    ],
    "initialCode": "numbers = [10, 20, 30, 40]\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "MTAw"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "advanced_part8_q1",
    "title": "함수 문제 1. 인사 함수 만들기",
    "category": "함수",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "호출하면 `\"안녕하세요\"`를 출력하는 함수를 만드세요.",
    "constraints": [
      "함수 이름은 `hello`",
      "매개변수는 사용하지 않습니다."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "안녕하세요"
      }
    ],
    "initialCode": "def hello():\n    # 여기에 코드를 작성하세요\n    pass\n\n# 함수를 호출하여 확인하는 코드를 아래 작성하세요\nhello()",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "7JWI64WV7ZWY7IS47JqU"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "advanced_part8_q2",
    "title": "함수 문제 2. 이름을 받아 인사하기",
    "category": "함수",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "이름을 전달받아 인사하는 함수를 만드세요.",
    "constraints": [
      "함수 이름은 `hello`",
      "매개변수 이름은 `name`",
      "`\"안녕하세요 민수\"` 형태로 출력하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "안녕하세요 민수"
      }
    ],
    "initialCode": "def hello(name):\n    # 여기에 코드를 작성하세요\n    pass\n\n# 함수를 호출하여 확인하는 코드를 아래 작성하세요\nhello(\"민수\")",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "7JWI64WV7ZWY7IS47JqUIOuvvOyImA=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "advanced_part8_q3",
    "title": "함수 문제 3. 두 숫자 더하기",
    "category": "함수",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "두 숫자를 전달받아 더한 결과를 반환하는 함수를 만드세요.",
    "constraints": [
      "함수 이름은 `add`",
      "두 개의 매개변수를 사용하세요.",
      "`return`을 사용하세요.",
      "`10`, `20`을 전달하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "30"
      }
    ],
    "initialCode": "def add(a, b):\n    # 여기에 코드를 작성하세요\n    pass\n\n# 함수를 호출하여 출력하는 코드를 아래 작성하세요\nprint(add(10, 20))",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "MzA="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "advanced_part8_q4",
    "title": "함수 문제 4. 숫자 제곱하기",
    "category": "함수",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "숫자 하나를 받아 제곱한 값을 반환하는 함수를 만드세요.",
    "constraints": [
      "함수 이름은 `square`",
      "숫자 `5`를 전달하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "25"
      }
    ],
    "initialCode": "def square(n):\n    # 여기에 코드를 작성하세요\n    pass\n\n# 함수를 호출하여 출력하는 코드를 아래 작성하세요\nprint(square(5))",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "MjU="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "advanced_part8_q5",
    "title": "함수 문제 5. 성인 여부 확인하기",
    "category": "함수",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "나이를 전달받아 성인인지 확인하는 함수를 만드세요.",
    "constraints": [
      "함수 이름은 `check_age`",
      "19세 이상이면 `\"성인\"`",
      "그렇지 않으면 `\"미성년자\"`",
      "나이 `20`을 전달하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "성인"
      }
    ],
    "initialCode": "def check_age(age):\n    # 여기에 코드를 작성하세요\n    pass\n\n# 함수를 호출하여 출력하는 코드를 아래 작성하세요\nprint(check_age(20))",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "7ISx7J24"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "advanced_part8_q6",
    "title": "함수 문제 6. 홀짝 확인 함수 만들기",
    "category": "함수",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "숫자를 전달받아 홀수인지 짝수인지 반환하세요.",
    "constraints": [
      "함수 이름은 `check_number`",
      "숫자 `8`을 전달하세요.",
      "짝수이면 `\"짝수\"`",
      "홀수이면 `\"홀수\"`"
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "짝수"
      }
    ],
    "initialCode": "def check_number(n):\n    # 여기에 코드를 작성하세요\n    pass\n\n# 함수를 호출하여 출력하는 코드를 아래 작성하세요\nprint(check_number(8))",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "7Ked7IiY"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "advanced_part8_q7",
    "title": "함수 문제 7. 두 숫자 중 큰 값 찾기",
    "category": "함수",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "두 숫자를 전달받아 더 큰 값을 반환하는 함수를 만드세요.",
    "constraints": [
      "함수 이름은 `find_max`",
      "숫자 `10`, `20`을 전달하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "20"
      }
    ],
    "initialCode": "def find_max(a, b):\n    # 여기에 코드를 작성하세요\n    pass\n\n# 함수를 호출하여 출력하는 코드를 아래 작성하세요\nprint(find_max(10, 20))",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "MjA="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "advanced_part8_q8",
    "title": "함수 문제 8. 가격 할인 함수 만들기",
    "category": "함수",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "상품 가격을 전달받아 10% 할인된 가격을 반환하세요.",
    "constraints": [
      "함수 이름은 `discount`",
      "가격 `10000`을 전달하세요.",
      "할인율은 10%입니다."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "9000.0"
      }
    ],
    "initialCode": "def discount(price):\n    # 여기에 코드를 작성하세요\n    pass\n\n# 함수를 호출하여 출력하는 코드를 아래 작성하세요\nprint(discount(10000))",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "OTAwMC4w"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "advanced_part8_q9",
    "title": "함수 문제 9. 리스트 값 출력 함수 만들기",
    "category": "함수",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "리스트를 전달받아 리스트의 값을 하나씩 출력하는 함수를 만드세요.",
    "constraints": [
      "함수 이름은 `print_items`",
      "`['사과', '바나나', '포도']`를 전달하세요.",
      "반복문을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "사과\n바나나\n포도"
      }
    ],
    "initialCode": "def print_items(items):\n    # 여기에 코드를 작성하세요\n    pass\n\n# 함수를 호출하는 코드를 아래 작성하세요\nprint_items([\"사과\", \"바나나\", \"포도\"])",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "7IKs6rO8CuuwlOuCmOuCmArtj6zrj4Q="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "advanced_part8_q10",
    "title": "함수 문제 10. 점수 등급 함수 만들기",
    "category": "함수",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "점수를 전달받아 등급을 반환하는 함수를 만드세요.",
    "constraints": [
      "함수 이름은 `get_grade`",
      "90점 이상: `\"A\"`",
      "80점 이상: `\"B\"`",
      "70점 이상: `\"C\"`",
      "그 외: `\"D\"`",
      "`85`를 전달하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "B"
      }
    ],
    "initialCode": "def get_grade(score):\n    # 여기에 코드를 작성하세요\n    pass\n\n# 함수를 호출하여 출력하는 코드를 아래 작성하세요\nprint(get_grade(85))",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "Qg=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "advanced_part9_q1",
    "title": "딕셔너리 문제 1. 학생 정보 만들기",
    "category": "딕셔너리",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "이름과 나이를 딕셔너리에 저장하고 출력하세요.",
    "constraints": [
      "이름: `\"민수\"`",
      "나이: `20`",
      "키는 `\"name\"`, `\"age\"`를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "{'name': '민수', 'age': 20}"
      }
    ],
    "initialCode": "# 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "eyduYW1lJzogJ+uvvOyImCcsICdhZ2UnOiAyMH0="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "advanced_part9_q2",
    "title": "딕셔너리 문제 2. 특정 값 출력하기",
    "category": "딕셔너리",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "학생 딕셔너리에서 이름만 출력하세요.",
    "constraints": [
      "딕셔너리는 `{'name': '민수', 'age': 20}`",
      "키를 이용해 값을 가져오세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "민수"
      }
    ],
    "initialCode": "student = {\"name\": \"민수\", \"age\": 20}\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "66+87IiY"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "advanced_part9_q3",
    "title": "딕셔너리 문제 3. 새로운 값 추가하기",
    "category": "딕셔너리",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "학생 딕셔너리에 `\"major\"` 정보를 추가하세요.",
    "constraints": [
      "기존 딕셔너리: `{'name': '민수', 'age': 20}`",
      "전공은 `\"컴퓨터공학\"`"
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "{'name': '민수', 'age': 20, 'major': '컴퓨터공학'}"
      }
    ],
    "initialCode": "student = {\"name\": \"민수\", \"age\": 20}\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "eyduYW1lJzogJ+uvvOyImCcsICdhZ2UnOiAyMCwgJ21ham9yJzogJ+y7tO2TqO2EsOqzte2VmSd9"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "advanced_part9_q4",
    "title": "딕셔너리 문제 4. 값 변경하기",
    "category": "딕셔너리",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "학생의 나이를 `20`에서 `21`로 변경하세요.",
    "constraints": [
      "딕셔너리는 `{'name': '민수', 'age': 20}`"
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "{'name': '민수', 'age': 21}"
      }
    ],
    "initialCode": "student = {\"name\": \"민수\", \"age\": 20}\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "eyduYW1lJzogJ+uvvOyImCcsICdhZ2UnOiAyMX0="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "advanced_part9_q5",
    "title": "딕셔너리 문제 5. 값 삭제하기",
    "category": "딕셔너리",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "딕셔너리에서 나이 정보를 삭제하세요.",
    "constraints": [
      "딕셔너리는 `{'name': '민수', 'age': 20}`",
      "`del`을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "{'name': '민수'}"
      }
    ],
    "initialCode": "student = {\"name\": \"민수\", \"age\": 20}\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "eyduYW1lJzogJ+uvvOyImCd9"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "advanced_part9_q6",
    "title": "딕셔너리 문제 6. 모든 키 출력하기",
    "category": "딕셔너리",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "학생 정보 딕셔너리의 모든 키를 출력하세요.",
    "constraints": [
      "`{'name': '민수', 'age': 20, 'city': '광주'}`",
      "`keys()`를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "dict_keys(['name', 'age', 'city'])"
      }
    ],
    "initialCode": "student = {\"name\": \"민수\", \"age\": 20, \"city\": \"광주\"}\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "ZGljdF9rZXlzKFsnbmFtZScsICdhZ2UnLCAnY2l0eSddKQ=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "advanced_part9_q7",
    "title": "딕셔너리 문제 7. 모든 값 출력하기",
    "category": "딕셔너리",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "학생 정보 딕셔너리의 모든 값을 출력하세요.",
    "constraints": [
      "`{'name': '민수', 'age': 20, 'city': '광주'}`",
      "`values()`를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "dict_values(['민수', 20, '광주'])"
      }
    ],
    "initialCode": "student = {\"name\": \"민수\", \"age\": 20, \"city\": \"광주\"}\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "ZGljdF92YWx1ZXMoWyfrr7zsiJgnLCAyMCwgJ+q0keyjvCddKQ=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "advanced_part9_q8",
    "title": "딕셔너리 문제 8. 키와 값 함께 출력하기",
    "category": "딕셔너리",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "딕셔너리의 키와 값을 하나씩 출력하세요.",
    "constraints": [
      "`{'name': '민수', 'age': 20}`",
      "반복문과 `items()`를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "name 민수\nage 20"
      }
    ],
    "initialCode": "student = {\"name\": \"민수\", \"age\": 20}\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "bmFtZSDrr7zsiJgKYWdlIDIw"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "advanced_part9_q9",
    "title": "딕셔너리 문제 9. 상품 가격 조회하기",
    "category": "딕셔너리",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "상품 이름을 키로, 가격을 값으로 저장한 딕셔너리에서 `\"키보드\"`의 가격을 출력하세요.",
    "constraints": [
      "키보드: `30000`",
      "마우스: `15000`",
      "모니터: `200000`"
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "30000"
      }
    ],
    "initialCode": "prices = {\"키보드\": 30000, \"마우스\": 15000, \"모니터\": 200000}\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "MzAwMDA="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "advanced_part9_q10",
    "title": "딕셔너리 문제 10. 학생 점수 확인하기",
    "category": "딕셔너리",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "학생별 점수를 딕셔너리에 저장하고, 80점 이상인 학생의 이름만 출력하세요.",
    "constraints": [
      "민수: `90`",
      "철수: `70`",
      "영희: `85`",
      "딕셔너리와 반복문, 조건문을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "민수\n영희"
      }
    ],
    "initialCode": "scores = {\"민수\": 90, \"철수\": 70, \"영희\": 85}\n# 코드를 이어서 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "66+87IiYCuyYge2drA=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "numpy_q1",
    "title": "NumPy 실전 1. 점수 평균 계산하기",
    "category": "NumPy",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "NumPy 라이브러리를 사용하여 점수 리스트 `[80, 90, 75, 95, 100]`의 배열을 만들고 평균을 출력하세요.",
    "constraints": [
      "`import numpy as np`를 사용하세요.",
      "`np.array()`로 배열을 생성하세요.",
      "`.mean()` 메서드를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "88.0"
      }
    ],
    "initialCode": "import numpy as np\n\nscores = np.array([80, 90, 75, 95, 100])\n# 평균을 출력하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "ODguMA=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "numpy_q2",
    "title": "NumPy 실전 2. 20 이상 조건 필터링",
    "category": "NumPy",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "NumPy 배열 `[10, 15, 20, 25, 30]`에서 20 이상인 값들만 조건 필터링하여 출력하세요.",
    "constraints": [
      "`import numpy as np`를 사용하세요.",
      "조건식 `arr[arr >= 20]`을 활용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "[20 25 30]"
      }
    ],
    "initialCode": "import numpy as np\n\narr = np.array([10, 15, 20, 25, 30])\n# 20 이상인 값만 출력하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "WzIwIDI1IDMwXQ=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "pandas_q1",
    "title": "Pandas 실전 1. 데이터프레임 평균 구하기",
    "category": "Pandas",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "Pandas `DataFrame`에서 `\"점수\"` 열의 평균을 계산하여 출력하세요.",
    "constraints": [
      "`import pandas as pd`를 사용하세요.",
      "`df[\"점수\"].mean()`을 활용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "86.0"
      }
    ],
    "initialCode": "import pandas as pd\n\ndata = {\"점수\": [80, 95, 70, 100, 85]}\ndf = pd.DataFrame(data)\n# 점수 열의 평균을 출력하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "ODYuMA=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "pandas_q2",
    "title": "Pandas 실전 2. 90점 이상 필터링",
    "category": "Pandas",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "학생 데이터프레임에서 점수가 90점 이상인 데이터의 `\"이름\"` 열을 리스트로 출력하세요.",
    "constraints": [
      "`import pandas as pd`를 사용하세요.",
      "`df[df[\"점수\"] >= 90][\"이름\"]` 형태를 활용하세요.",
      "`.tolist()`를 사용해 리스트로 변환한 뒤 출력하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "['김철수', '박민수']"
      }
    ],
    "initialCode": "import pandas as pd\n\ndata = {\n    \"이름\": [\"김철수\", \"이영희\", \"박민수\"],\n    \"점수\": [90, 85, 100]\n}\ndf = pd.DataFrame(data)\n# 90점 이상인 학생의 이름만 리스트로 출력하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "WyfquYDssqDsiJgnLCAn67CV66+87IiYJ10="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "np_b1",
    "title": "NumPy 연습 1. 배열 합계 구하기",
    "category": "NumPy",
    "difficulty": "basic",
    "type": "coding",
    "description": "하루 동안 마신 물의 양(잔)을 기록한 배열이 있습니다. 전체 합계를 출력하세요.",
    "constraints": [
      "`cups` 배열은 이미 만들어져 있습니다.",
      "`.sum()`을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "25"
      }
    ],
    "initialCode": "import numpy as np\n\ncups = np.array([3, 7, 2, 9, 4])\n# 합계를 출력하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "MjU="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "np_b2",
    "title": "NumPy 연습 2. 모든 값 두 배로",
    "category": "NumPy",
    "difficulty": "basic",
    "type": "coding",
    "description": "가격 배열의 모든 값을 두 배로 만든 배열을 출력하세요. 반복문 없이 해결합니다.",
    "constraints": [
      "`for` 문을 쓰지 마세요.",
      "배열에 바로 `* 2`를 하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "[2400 7000 1600 8200]"
      }
    ],
    "initialCode": "import numpy as np\n\nprices = np.array([1200, 3500, 800, 4100])\n# 모든 가격을 두 배로 만든 배열을 출력하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "WzI0MDAgNzAwMCAxNjAwIDgyMDBd"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "np_b3",
    "title": "NumPy 연습 3. 배열의 모양 확인",
    "category": "NumPy",
    "difficulty": "basic",
    "type": "coding",
    "description": "2행 3열 배열의 모양(shape)과 전체 원소 개수(size)를 차례로 출력하세요.",
    "constraints": [
      "`.shape`와 `.size`를 사용하세요.",
      "한 줄에 하나씩 출력하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "(2, 3)\n6"
      }
    ],
    "initialCode": "import numpy as np\n\ntable = np.array([[1, 2, 3], [4, 5, 6]])\n# shape 과 size 를 출력하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "KDIsIDMpCjY="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "np_b4",
    "title": "NumPy 연습 4. 짝수 배열 만들기",
    "category": "NumPy",
    "difficulty": "basic",
    "type": "coding",
    "description": "`np.arange`로 2부터 10까지의 짝수 배열을 만들어 출력하세요.",
    "constraints": [
      "`np.arange(시작, 끝, 간격)`을 사용하세요.",
      "끝 값은 포함되지 않는다는 점에 주의하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "[ 2  4  6  8 10]"
      }
    ],
    "initialCode": "import numpy as np\n\n# 2, 4, 6, 8, 10 을 담은 배열을 만들어 출력하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "WyAyICA0ICA2ICA4IDEwXQ=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "np_i1",
    "title": "NumPy 연습 5. 가장 더운 날 찾기",
    "category": "NumPy",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "일주일 최고기온 배열에서 가장 높은 기온과, 그날이 몇 번째 날인지(0부터 시작하는 위치)를 차례로 출력하세요.",
    "constraints": [
      "`.max()`와 `.argmax()`를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "33\n6"
      }
    ],
    "initialCode": "import numpy as np\n\ntemps = np.array([29, 31, 27, 25, 28, 32, 33])\n# 최고 기온과 그 위치를 출력하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "MzMKNg=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "np_i2",
    "title": "NumPy 연습 6. 행별 합계",
    "category": "NumPy",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "0부터 11까지를 3행 4열로 바꾼 뒤, 각 행의 합계를 출력하세요.",
    "constraints": [
      "`np.arange`와 `.reshape`을 사용하세요.",
      "행별 합계는 `axis=1`입니다."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "[ 6 22 38]"
      }
    ],
    "initialCode": "import numpy as np\n\n# 0~11 을 3행 4열로 만들고, 행별 합계를 출력하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "WyA2IDIyIDM4XQ=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "np_i3",
    "title": "NumPy 연습 7. 80점 이상 인원 세기",
    "category": "NumPy",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "점수 배열에서 80점 이상인 학생이 몇 명인지 출력하세요.",
    "constraints": [
      "조건식(`scores >= 80`)으로 만든 True/False 배열을 활용하세요.",
      "`for` 문을 쓰지 마세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "6"
      }
    ],
    "initialCode": "import numpy as np\n\nscores = np.array([92, 79, 88, 95, 58, 87, 81, 90, 73, 66])\n# 80점 이상 인원을 출력하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "Ng=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "np_a1",
    "title": "NumPy 연습 8. 과목별 평균",
    "category": "NumPy",
    "difficulty": "advanced",
    "type": "coding",
    "description": "학생 4명의 국어·영어·수학 점수가 2차원 배열로 있습니다. 과목별(열별) 평균을 소수 첫째 자리까지 반올림해 출력하세요.",
    "constraints": [
      "행은 학생, 열은 과목(국어, 영어, 수학)입니다.",
      "`axis`와 `np.round`를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "[85.2 85.8 88.5]"
      }
    ],
    "initialCode": "import numpy as np\n\nscores = np.array([\n    [85, 78, 92],\n    [92, 88, 79],\n    [76, 95, 88],\n    [88, 82, 95],\n])\n# 과목별 평균을 소수 첫째 자리까지 출력하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "Wzg1LjIgODUuOCA4OC41XQ=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "np_a2",
    "title": "NumPy 연습 9. 점수 표준화",
    "category": "NumPy",
    "difficulty": "advanced",
    "type": "coding",
    "description": "점수를 표준화(z-score)하세요. 각 점수에서 평균을 빼고 표준편차로 나눈 값을 소수 둘째 자리까지 반올림해 출력합니다.",
    "constraints": [
      "`.mean()`과 `.std()`를 사용하세요.",
      "`np.round(값, 2)`로 반올림하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "[-1.34 -0.45  0.45  1.34]"
      }
    ],
    "initialCode": "import numpy as np\n\nscores = np.array([70, 80, 90, 100])\n# 표준화한 점수를 출력하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "Wy0xLjM0IC0wLjQ1ICAwLjQ1ICAxLjM0XQ=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "np_e1",
    "title": "NumPy 연습 10. 할인가 표 만들기",
    "category": "NumPy",
    "difficulty": "expert",
    "type": "coding",
    "description": "상품 3개의 가격과 할인율 3가지가 있습니다. 브로드캐스팅으로 '상품 × 할인율' 할인가 표(3행 3열)를 만들어 정수로 출력하세요.",
    "constraints": [
      "행은 상품, 열은 할인율입니다.",
      "가격 배열을 세로(3행 1열)로 바꾸면 브로드캐스팅됩니다.",
      "`for` 문을 쓰지 마세요.",
      "결과는 `.astype(int)`로 정수로 바꾸세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "[[ 9000  8000  7000]\n [22500 20000 17500]\n [36000 32000 28000]]"
      }
    ],
    "initialCode": "import numpy as np\n\nprices = np.array([10000, 25000, 40000])\nrates = np.array([0.1, 0.2, 0.3])\n# 할인가 = 가격 * (1 - 할인율)\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "W1sgOTAwMCAgODAwMCAgNzAwMF0KIFsyMjUwMCAyMDAwMCAxNzUwMF0KIFszNjAwMCAzMjAwMCAyODAwMF1d"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "np_e2",
    "title": "NumPy 연습 11. 합격/불합격 표시",
    "category": "NumPy",
    "difficulty": "expert",
    "type": "coding",
    "description": "점수 배열을 보고 60점 이상이면 `'P'`, 미만이면 `'F'`인 배열을 만들어 출력하세요.",
    "constraints": [
      "`np.where(조건, 참일 때, 거짓일 때)`를 사용하세요.",
      "`for` 문을 쓰지 마세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "['P' 'F' 'P' 'F' 'P' 'P']"
      }
    ],
    "initialCode": "import numpy as np\n\nscores = np.array([85, 58, 72, 45, 90, 60])\n# P/F 배열을 출력하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "WydQJyAnRicgJ1AnICdGJyAnUCcgJ1AnXQ=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "pd_b1",
    "title": "Pandas 연습 1. CSV 파일 읽기",
    "category": "Pandas",
    "difficulty": "basic",
    "type": "coding",
    "description": "`data/students.csv` 파일을 읽어 데이터프레임의 크기(행, 열)를 출력하세요.",
    "constraints": [
      "`pd.read_csv`로 파일을 읽으세요.",
      "`.shape`을 출력하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "(20, 6)"
      }
    ],
    "initialCode": "import pandas as pd\n\n# data/students.csv 를 읽고 shape 을 출력하세요\n",
    "datasets": [
      "students"
    ],
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "KDIwLCA2KQ=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "pd_b2",
    "title": "Pandas 연습 2. 열 이름 확인",
    "category": "Pandas",
    "difficulty": "basic",
    "type": "coding",
    "description": "학생 성적 데이터의 열 이름을 리스트로 출력하세요.",
    "constraints": [
      "`df.columns`를 `.tolist()`로 바꿔 출력하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "['이름', '반', '성별', '국어', '영어', '수학']"
      }
    ],
    "initialCode": "import pandas as pd\n\ndf = pd.read_csv('data/students.csv')\n# 열 이름을 리스트로 출력하세요\n",
    "datasets": [
      "students"
    ],
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "WyfsnbTrpoQnLCAn67CYJywgJ+yEseuzhCcsICfqta3slrQnLCAn7JiB7Ja0JywgJ+yImO2VmSdd"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "pd_b3",
    "title": "Pandas 연습 3. 수학 평균",
    "category": "Pandas",
    "difficulty": "basic",
    "type": "coding",
    "description": "전체 학생의 수학 평균을 출력하세요.",
    "constraints": [
      "`df['수학']`으로 열을 꺼낸 뒤 `.mean()`을 쓰세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "83.0"
      }
    ],
    "initialCode": "import pandas as pd\n\ndf = pd.read_csv('data/students.csv')\n# 수학 평균을 출력하세요\n",
    "datasets": [
      "students"
    ],
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "ODMuMA=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "pd_b4",
    "title": "Pandas 연습 4. 앞부분 미리보기",
    "category": "Pandas",
    "difficulty": "basic",
    "type": "coding",
    "description": "데이터의 앞 3행에서 이름과 국어 열만 출력하세요.",
    "constraints": [
      "열 여러 개는 `df[['이름', '국어']]`처럼 리스트로 고르세요.",
      "`.head(3)`을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "이름  국어\n0  김철수  85\n1  이영희  92\n2  박민수  76"
      }
    ],
    "initialCode": "import pandas as pd\n\ndf = pd.read_csv('data/students.csv')\n# 이름, 국어 열의 앞 3행을 출력하세요\n",
    "datasets": [
      "students"
    ],
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "7J2066aEICDqta3slrQKMCAg6rmA7LKg7IiYICA4NQoxICDsnbTsmIHtnawgIDkyCjIgIOuwleuvvOyImCAgNzY="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "pd_i1",
    "title": "Pandas 연습 5. 수학 90점 이상",
    "category": "Pandas",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "수학 점수가 90점 이상인 학생의 이름을 리스트로 출력하세요.",
    "constraints": [
      "조건으로 행을 고르는 불리언 인덱싱을 사용하세요.",
      "`.tolist()`로 리스트로 바꾸세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "['김철수', '최수민', '윤서연', '한지호', '권민재', '류건우', '문채원']"
      }
    ],
    "initialCode": "import pandas as pd\n\ndf = pd.read_csv('data/students.csv')\n# 수학 90점 이상인 학생 이름을 리스트로 출력하세요\n",
    "datasets": [
      "students"
    ],
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "WyfquYDssqDsiJgnLCAn7LWc7IiY66+8JywgJ+ycpOyEnOyXsCcsICftlZzsp4DtmLgnLCAn6raM66+87J6sJywgJ+ulmOqxtOyasCcsICfrrLjssYTsm5AnXQ=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "pd_i2",
    "title": "Pandas 연습 6. 국어 상위 3명",
    "category": "Pandas",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "국어 점수가 높은 순서로 정렬해 상위 3명의 이름을 리스트로 출력하세요.",
    "constraints": [
      "`sort_values`의 `ascending=False`를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "['문채원', '강지은', '신예린']"
      }
    ],
    "initialCode": "import pandas as pd\n\ndf = pd.read_csv('data/students.csv')\n# 국어 상위 3명의 이름을 출력하세요\n",
    "datasets": [
      "students"
    ],
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "WyfrrLjssYTsm5AnLCAn6rCV7KeA7J2AJywgJ+yLoOyYiOumsCdd"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "pd_i3",
    "title": "Pandas 연습 7. 총점 1등 찾기",
    "category": "Pandas",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "국어·영어·수학을 더한 `총점` 열을 새로 만들고, 총점이 가장 높은 학생의 이름과 총점을 차례로 출력하세요.",
    "constraints": [
      "`df['총점'] = ...`으로 새 열을 만드세요.",
      "`idxmax()`나 정렬을 활용하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "문채원\n280"
      }
    ],
    "initialCode": "import pandas as pd\n\ndf = pd.read_csv('data/students.csv')\n# 총점 열을 만들고, 1등의 이름과 총점을 출력하세요\n",
    "datasets": [
      "students"
    ],
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "66y47LGE7JuQCjI4MA=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "pd_i4",
    "title": "Pandas 연습 8. 반별 인원",
    "category": "Pandas",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "반별 학생 수를 반 이름 순서로 출력하세요.",
    "constraints": [
      "`value_counts()`를 쓰고 `sort_index()`로 반 이름 순으로 정렬하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "반\n1반    5\n2반    5\n3반    5\n4반    5\nName: count, dtype: int64"
      }
    ],
    "initialCode": "import pandas as pd\n\ndf = pd.read_csv('data/students.csv')\n# 반별 인원을 출력하세요\n",
    "datasets": [
      "students"
    ],
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "67CYCjHrsJggICAgNQoy67CYICAgIDUKM+uwmCAgICA1CjTrsJggICAgNQpOYW1lOiBjb3VudCwgZHR5cGU6IGludDY0"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "pd_a1",
    "title": "Pandas 연습 9. 반별 수학 평균",
    "category": "Pandas",
    "difficulty": "advanced",
    "type": "coding",
    "description": "반별 수학 평균을 소수 첫째 자리까지 반올림해 출력하세요.",
    "constraints": [
      "`groupby('반')`을 사용하세요.",
      "`.round(1)`로 반올림하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "반\n1반    82.4\n2반    79.4\n3반    88.2\n4반    82.0\nName: 수학, dtype: float64"
      }
    ],
    "initialCode": "import pandas as pd\n\ndf = pd.read_csv('data/students.csv')\n# 반별 수학 평균을 출력하세요\n",
    "datasets": [
      "students"
    ],
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "67CYCjHrsJggICAgODIuNAoy67CYICAgIDc5LjQKM+uwmCAgICA4OC4yCjTrsJggICAgODIuMApOYW1lOiDsiJjtlZksIGR0eXBlOiBmbG9hdDY0"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "pd_a2",
    "title": "Pandas 연습 10. 지점별 매출 순위",
    "category": "Pandas",
    "difficulty": "advanced",
    "type": "coding",
    "description": "카페 매출 데이터에서 매출(`수량 × 단가`)을 계산해 지점별 매출 합계를 큰 순서대로 출력하세요.",
    "constraints": [
      "`df['매출'] = df['수량'] * df['단가']`로 열을 만드세요.",
      "`groupby`와 `sort_values(ascending=False)`를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "지점\n강남    1713000\n홍대    1664000\n잠실    1365500\nName: 매출, dtype: int64"
      }
    ],
    "initialCode": "import pandas as pd\n\ndf = pd.read_csv('data/sales.csv')\n# 지점별 매출 합계를 큰 순서대로 출력하세요\n",
    "datasets": [
      "sales"
    ],
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "7KeA7KCQCuqwleuCqCAgICAxNzEzMDAwCu2ZjeuMgCAgICAxNjY0MDAwCuyeoOyLpCAgICAxMzY1NTAwCk5hbWU6IOunpOy2nCwgZHR5cGU6IGludDY0"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "pd_a3",
    "title": "Pandas 연습 11. 빈 강수량 채우기",
    "category": "Pandas",
    "difficulty": "advanced",
    "type": "coding",
    "description": "날씨 데이터의 강수량에 빈칸이 있습니다. 빈칸 개수를 먼저 출력하고, 빈칸을 0으로 채운 뒤 도시별 평균 강수량을 소수 둘째 자리까지 반올림해 출력하세요.",
    "constraints": [
      "`isna().sum()`으로 빈칸을 세세요.",
      "`fillna(0)`으로 채우세요.",
      "도시별 평균은 `groupby`와 `.round(2)`를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "2\n도시\n부산    10.50\n서울     6.79\n제주     6.79\nName: 강수량, dtype: float64"
      }
    ],
    "initialCode": "import pandas as pd\n\ndf = pd.read_csv('data/weather.csv')\n# 1) 강수량 빈칸 개수  2) 0으로 채운 뒤 도시별 평균 강수량\n",
    "datasets": [
      "weather"
    ],
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "Mgrrj4Tsi5wK67aA7IKwICAgIDEwLjUwCuyEnOyauCAgICAgNi43OQrsoJzso7wgICAgIDYuNzkKTmFtZTog6rCV7IiY65+JLCBkdHlwZTogZmxvYXQ2NA=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "pd_e1",
    "title": "Pandas 연습 12. 월별·지점별 매출표",
    "category": "Pandas",
    "difficulty": "expert",
    "type": "coding",
    "description": "카페 매출 데이터로 행은 월(1~3), 열은 지점인 매출 합계표를 만들어 출력하세요.",
    "constraints": [
      "`pd.to_datetime`으로 날짜를 바꾸고 `.dt.month`로 월을 꺼내세요.",
      "`pivot_table(index='월', columns='지점', values='매출', aggfunc='sum')`을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "지점      강남      잠실      홍대\n월                         \n1   426500  346500  463000\n2   496500  382500  459500\n3   790000  636500  741500"
      }
    ],
    "initialCode": "import pandas as pd\n\ndf = pd.read_csv('data/sales.csv')\n# 월별·지점별 매출 합계표를 출력하세요\n",
    "datasets": [
      "sales"
    ],
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "7KeA7KCQICAgICAg6rCV64KoICAgICAg7J6g7IukICAgICAg7ZmN64yACuyblCAgICAgICAgICAgICAgICAgICAgICAgICAKMSAgIDQyNjUwMCAgMzQ2NTAwICA0NjMwMDAKMiAgIDQ5NjUwMCAgMzgyNTAwICA0NTk1MDAKMyAgIDc5MDAwMCAgNjM2NTAwICA3NDE1MDA="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "pd_e2",
    "title": "Pandas 연습 13. 일교차가 큰 도시",
    "category": "Pandas",
    "difficulty": "expert",
    "type": "coding",
    "description": "날씨 데이터에서 일교차(`최고기온 - 최저기온`)의 도시별 평균을 구해, 평균 일교차가 가장 큰 도시 이름과 그 값(소수 둘째 자리 반올림)을 차례로 출력하세요.",
    "constraints": [
      "일교차 열을 만든 뒤 `groupby`로 평균을 구하세요.",
      "`idxmax()`와 `max()`를 활용하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "서울\n6.71"
      }
    ],
    "initialCode": "import pandas as pd\n\ndf = pd.read_csv('data/weather.csv')\n# 평균 일교차가 가장 큰 도시와 그 값을 출력하세요\n",
    "datasets": [
      "weather"
    ],
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "7ISc7Jq4CjYuNzE="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "plt_b1",
    "title": "Matplotlib 연습 1. 첫 선 그래프",
    "category": "Matplotlib",
    "difficulty": "basic",
    "type": "coding",
    "description": "1~5일 동안의 방문자 수를 선 그래프로 그리세요. 실행하면 아래 콘솔에 그래프가 나타납니다.",
    "constraints": [
      "`plt.plot(x, y)`를 사용하세요.",
      "x는 `days`, y는 `visitors`입니다."
    ],
    "examples": [
      {
        "input": "그래프 확인",
        "output": "선이 하나 있다: 1\nx 값이 1~5일이다: [1, 2, 3, 4, 5]\ny 값이 방문자 수다: [120, 150, 90, 180, 210]"
      }
    ],
    "initialCode": "import matplotlib.pyplot as plt\n\ndays = [1, 2, 3, 4, 5]\nvisitors = [120, 150, 90, 180, 210]\n# 선 그래프를 그리세요\n",
    "testCases": [
      {
        "input": "선이 하나 있다|len(_ax.get_lines())",
        "expected": "MQ=="
      },
      {
        "input": "x 값이 1~5일이다|list(_ax.get_lines()[0].get_xdata())",
        "expected": "WzEsIDIsIDMsIDQsIDVd"
      },
      {
        "input": "y 값이 방문자 수다|list(_ax.get_lines()[0].get_ydata())",
        "expected": "WzEyMCwgMTUwLCA5MCwgMTgwLCAyMTBd"
      }
    ],
    "testRunnerCode": "figure_check"
  },
  {
    "id": "plt_b2",
    "title": "Matplotlib 연습 2. 제목과 축 이름",
    "category": "Matplotlib",
    "difficulty": "basic",
    "type": "coding",
    "description": "그래프에 제목과 축 이름을 붙이세요.",
    "constraints": [
      "제목: `월별 방문자`",
      "x축 이름: `월`, y축 이름: `방문자 수`"
    ],
    "examples": [
      {
        "input": "그래프 확인",
        "output": "제목이 월별 방문자다: 월별 방문자\nx축 이름이 월이다: 월\ny축 이름이 방문자 수다: 방문자 수"
      }
    ],
    "initialCode": "import matplotlib.pyplot as plt\n\nmonths = [1, 2, 3, 4]\nvisitors = [320, 410, 380, 520]\nplt.plot(months, visitors)\n# 제목과 축 이름을 붙이세요\n",
    "testCases": [
      {
        "input": "제목이 `월별 방문자`다|_ax.get_title()",
        "expected": "7JuU67OEIOuwqeusuOyekA=="
      },
      {
        "input": "x축 이름이 `월`이다|_ax.get_xlabel()",
        "expected": "7JuU"
      },
      {
        "input": "y축 이름이 `방문자 수`다|_ax.get_ylabel()",
        "expected": "67Cp66y47J6QIOyImA=="
      }
    ],
    "testRunnerCode": "figure_check"
  },
  {
    "id": "plt_b3",
    "title": "Matplotlib 연습 3. 막대그래프",
    "category": "Matplotlib",
    "difficulty": "basic",
    "type": "coding",
    "description": "과일별 판매량을 막대그래프로 그리세요.",
    "constraints": [
      "`plt.bar(이름, 값)`을 사용하세요."
    ],
    "examples": [
      {
        "input": "그래프 확인",
        "output": "막대가 4개다: 4\n막대 높이가 판매량이다: [30, 45, 22, 38]\nx축 이름표가 과일 이름이다: [사과, 바나나, 포도, 딸기]"
      }
    ],
    "initialCode": "import matplotlib.pyplot as plt\n\nfruits = ['사과', '바나나', '포도', '딸기']\nsold = [30, 45, 22, 38]\n# 막대그래프를 그리세요\n",
    "testCases": [
      {
        "input": "막대가 4개다|len(_ax.patches)",
        "expected": "NA=="
      },
      {
        "input": "막대 높이가 판매량이다|[p.get_height() for p in _ax.patches]",
        "expected": "WzMwLCA0NSwgMjIsIDM4XQ=="
      },
      {
        "input": "x축 이름표가 과일 이름이다|[t.get_text() for t in _ax.get_xticklabels()]",
        "expected": "W+yCrOqzvCwg67CU64KY64KYLCDtj6zrj4QsIOuUuOq4sF0="
      }
    ],
    "testRunnerCode": "figure_check"
  },
  {
    "id": "plt_i1",
    "title": "Matplotlib 연습 4. 반별 평균 막대그래프",
    "category": "Matplotlib",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "학생 성적 데이터로 반별 수학 평균을 막대그래프로 그리고, 제목을 `반별 수학 평균`으로 붙이세요.",
    "constraints": [
      "`groupby('반')['수학'].mean()`으로 평균을 구하세요.",
      "결과의 `index`와 `values`로 `plt.bar`를 그리세요."
    ],
    "examples": [
      {
        "input": "그래프 확인",
        "output": "막대가 반 개수(4개)만큼 있다: 4\n막대 높이가 반별 수학 평균이다: [82.4, 79.4, 88.2, 82.0]\n제목이 반별 수학 평균이다: 반별 수학 평균"
      }
    ],
    "initialCode": "import pandas as pd\nimport matplotlib.pyplot as plt\n\ndf = pd.read_csv('data/students.csv')\n# 반별 수학 평균 막대그래프를 그리세요\n",
    "datasets": [
      "students"
    ],
    "testCases": [
      {
        "input": "막대가 반 개수(4개)만큼 있다|len(_ax.patches)",
        "expected": "NA=="
      },
      {
        "input": "막대 높이가 반별 수학 평균이다|[p.get_height() for p in _ax.patches]",
        "expected": "WzgyLjQsIDc5LjQsIDg4LjIsIDgyLjBd"
      },
      {
        "input": "제목이 `반별 수학 평균`이다|_ax.get_title()",
        "expected": "67CY67OEIOyImO2VmSDtj4nqt6A="
      }
    ],
    "testRunnerCode": "figure_check"
  },
  {
    "id": "plt_i2",
    "title": "Matplotlib 연습 5. 두 도시 기온 비교",
    "category": "Matplotlib",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "날씨 데이터로 서울과 부산의 최고기온을 한 그래프에 선 두 개로 그리고, 범례를 표시하세요.",
    "constraints": [
      "도시별로 행을 골라 `plt.plot`을 두 번 호출하세요.",
      "`label='서울'`, `label='부산'`을 주고 `plt.legend()`를 호출하세요.",
      "x축은 `날짜` 열을 그대로 쓰세요."
    ],
    "examples": [
      {
        "input": "그래프 확인",
        "output": "선이 두 개다: 2\n범례가 있다: True\n범례가 서울, 부산이다: [서울, 부산]\n서울 선의 값이 서울 최고기온이다: [29, 31, 27, 25, 28, 32, 33]"
      }
    ],
    "initialCode": "import pandas as pd\nimport matplotlib.pyplot as plt\n\ndf = pd.read_csv('data/weather.csv')\n# 서울과 부산의 최고기온 선 그래프를 그리세요\n",
    "datasets": [
      "weather"
    ],
    "testCases": [
      {
        "input": "선이 두 개다|len(_ax.get_lines())",
        "expected": "Mg=="
      },
      {
        "input": "범례가 있다|_ax.get_legend() is not None",
        "expected": "VHJ1ZQ=="
      },
      {
        "input": "범례가 `서울`, `부산`이다|[t.get_text() for t in _ax.get_legend().get_texts()]",
        "expected": "W+yEnOyauCwg67aA7IKwXQ=="
      },
      {
        "input": "서울 선의 값이 서울 최고기온이다|list(_ax.get_lines()[0].get_ydata())",
        "expected": "WzI5LCAzMSwgMjcsIDI1LCAyOCwgMzIsIDMzXQ=="
      }
    ],
    "testRunnerCode": "figure_check"
  },
  {
    "id": "plt_i3",
    "title": "Matplotlib 연습 6. 국어와 수학 산점도",
    "category": "Matplotlib",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "학생 성적 데이터로 x축은 국어, y축은 수학인 산점도를 그리세요.",
    "constraints": [
      "`plt.scatter(x, y)`를 사용하세요.",
      "x축 이름 `국어`, y축 이름 `수학`을 붙이세요."
    ],
    "examples": [
      {
        "input": "그래프 확인",
        "output": "점이 학생 수(20개)만큼 있다: 20\nx 값이 국어 점수다: [85.0, 92.0, 76.0, 88.0, 64.0]\nx축·y축 이름이 국어, 수학이다: [국어, 수학]"
      }
    ],
    "initialCode": "import pandas as pd\nimport matplotlib.pyplot as plt\n\ndf = pd.read_csv('data/students.csv')\n# 국어-수학 산점도를 그리세요\n",
    "datasets": [
      "students"
    ],
    "testCases": [
      {
        "input": "점이 학생 수(20개)만큼 있다|len(_ax.collections[0].get_offsets())",
        "expected": "MjA="
      },
      {
        "input": "x 값이 국어 점수다|[float(p[0]) for p in _ax.collections[0].get_offsets()][:5]",
        "expected": "Wzg1LjAsIDkyLjAsIDc2LjAsIDg4LjAsIDY0LjBd"
      },
      {
        "input": "x축·y축 이름이 `국어`, `수학`이다|[_ax.get_xlabel(), _ax.get_ylabel()]",
        "expected": "W+q1reyWtCwg7IiY7ZWZXQ=="
      }
    ],
    "testRunnerCode": "figure_check"
  },
  {
    "id": "plt_a1",
    "title": "Matplotlib 연습 7. 수학 점수 분포",
    "category": "Matplotlib",
    "difficulty": "advanced",
    "type": "coding",
    "description": "학생 성적 데이터의 수학 점수 분포를 히스토그램으로 그리세요. 구간은 5개로 나눕니다.",
    "constraints": [
      "`plt.hist(값, bins=5)`를 사용하세요.",
      "제목을 `수학 점수 분포`로 붙이세요."
    ],
    "examples": [
      {
        "input": "그래프 확인",
        "output": "구간(막대)이 5개다: 5\n구간별 인원이 맞다: [3.0, 2.0, 3.0, 7.0, 5.0]\n제목이 수학 점수 분포다: 수학 점수 분포"
      }
    ],
    "initialCode": "import pandas as pd\nimport matplotlib.pyplot as plt\n\ndf = pd.read_csv('data/students.csv')\n# 수학 점수 히스토그램을 그리세요\n",
    "datasets": [
      "students"
    ],
    "testCases": [
      {
        "input": "구간(막대)이 5개다|len(_ax.patches)",
        "expected": "NQ=="
      },
      {
        "input": "구간별 인원이 맞다|[p.get_height() for p in _ax.patches]",
        "expected": "WzMuMCwgMi4wLCAzLjAsIDcuMCwgNS4wXQ=="
      },
      {
        "input": "제목이 `수학 점수 분포`다|_ax.get_title()",
        "expected": "7IiY7ZWZIOygkOyImCDrtoTtj6w="
      }
    ],
    "testRunnerCode": "figure_check"
  },
  {
    "id": "plt_a2",
    "title": "Matplotlib 연습 8. 그래프 두 개 나란히",
    "category": "Matplotlib",
    "difficulty": "advanced",
    "type": "coding",
    "description": "카페 매출 데이터로 그래프 두 개를 나란히 그리세요. 왼쪽은 지점별 매출 합계 막대그래프, 오른쪽은 메뉴별 판매 수량 합계 막대그래프입니다.",
    "constraints": [
      "`fig, (ax1, ax2) = plt.subplots(1, 2)`를 사용하세요.",
      "매출은 `수량 × 단가`입니다.",
      "왼쪽 제목 `지점별 매출`, 오른쪽 제목 `메뉴별 판매량`"
    ],
    "examples": [
      {
        "input": "그래프 확인",
        "output": "그래프가 두 개다: 2\n제목이 지점별 매출, 메뉴별 판매량이다: [지점별 매출, 메뉴별 판매량]\n왼쪽 막대 높이가 지점별 매출이다: [1713000, 1365500, 1664000]\n오른쪽 막대 높이가 메뉴별 판매량이다: [444, 337, 163]"
      }
    ],
    "initialCode": "import pandas as pd\nimport matplotlib.pyplot as plt\n\ndf = pd.read_csv('data/sales.csv')\n# 1행 2열 그래프를 그리세요\n",
    "datasets": [
      "sales"
    ],
    "testCases": [
      {
        "input": "그래프가 두 개다|len(_axes)",
        "expected": "Mg=="
      },
      {
        "input": "제목이 `지점별 매출`, `메뉴별 판매량`이다|[a.get_title() for a in _axes]",
        "expected": "W+yngOygkOuzhCDrp6TstpwsIOuplOuJtOuzhCDtjJDrp6Trn4ld"
      },
      {
        "input": "왼쪽 막대 높이가 지점별 매출이다|[p.get_height() for p in _axes[0].patches]",
        "expected": "WzE3MTMwMDAsIDEzNjU1MDAsIDE2NjQwMDBd"
      },
      {
        "input": "오른쪽 막대 높이가 메뉴별 판매량이다|[p.get_height() for p in _axes[1].patches]",
        "expected": "WzQ0NCwgMzM3LCAxNjNd"
      }
    ],
    "testRunnerCode": "figure_check"
  },
  {
    "id": "plt_e1",
    "title": "Matplotlib 연습 9. 최고 지점만 강조하기",
    "category": "Matplotlib",
    "difficulty": "expert",
    "type": "coding",
    "description": "지점별 매출 막대그래프에서 매출이 가장 큰 지점만 빨간색(`red`), 나머지는 회색(`gray`)으로 칠하고, 평균 매출 위치에 가로 점선을 그리세요.",
    "constraints": [
      "`color`에 막대마다 색 리스트를 넘기세요.",
      "평균선은 `plt.axhline(평균, linestyle='--')`입니다.",
      "매출은 `수량 × 단가`입니다."
    ],
    "examples": [
      {
        "input": "그래프 확인",
        "output": "막대가 3개다: 3\n최고 매출 막대만 빨간색이다: [True, False, False]\n가로 평균선이 점선이다: [--]\n평균선 위치가 평균 매출이다: 1580833.33"
      }
    ],
    "initialCode": "import pandas as pd\nimport matplotlib.pyplot as plt\n\ndf = pd.read_csv('data/sales.csv')\ndf['매출'] = df['수량'] * df['단가']\nby_store = df.groupby('지점')['매출'].sum()\n# 최고 지점만 빨간색, 평균 점선을 그리세요\n",
    "datasets": [
      "sales"
    ],
    "testCases": [
      {
        "input": "막대가 3개다|len(_ax.patches)",
        "expected": "Mw=="
      },
      {
        "input": "최고 매출 막대만 빨간색이다|[tuple(round(c, 2) for c in p.get_facecolor()[:3]) == (1.0, 0.0, 0.0) for p in _ax.patches]",
        "expected": "W1RydWUsIEZhbHNlLCBGYWxzZV0="
      },
      {
        "input": "가로 평균선이 점선이다|[l.get_linestyle() for l in _ax.get_lines()]",
        "expected": "Wy0tXQ=="
      },
      {
        "input": "평균선 위치가 평균 매출이다|float(_ax.get_lines()[0].get_ydata()[0])",
        "expected": "MTU4MDgzMy4zMw=="
      }
    ],
    "testRunnerCode": "figure_check"
  },
  {
    "id": "lambda_q1",
    "title": "응용 1. lambda와 map으로 리스트 제곱하기",
    "category": "함수",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "리스트 `[1, 2, 3, 4, 5]`의 각 숫자를 `map()`과 `lambda` 함수를 이용해 제곱한 새 리스트를 출력하세요.",
    "constraints": [
      "`lambda x: x ** 2`를 활용하세요.",
      "`list(map(...))` 형태로 리스트로 변환하여 출력하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "[1, 4, 9, 16, 25]"
      }
    ],
    "initialCode": "numbers = [1, 2, 3, 4, 5]\n# map과 lambda를 사용해 제곱 리스트를 만들어 출력하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "WzEsIDQsIDksIDE2LCAyNV0="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "algorithm_q1",
    "title": "알고리즘 1. 회문(Palindrome) 판별하기",
    "category": "문자열",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "단어가 거꾸로 읽어도 같은 회문(Palindrome)인지 판별하는 함수 `is_palindrome(word)`를 작성하고, `\"kayak\"`과 `\"python\"`에 대해 실행한 결과를 각각 출력하세요.",
    "constraints": [
      "슬라이싱 `word[::-1]`을 활용하세요.",
      "`True` 또는 `False`를 출력하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "True\nFalse"
      }
    ],
    "initialCode": "def is_palindrome(word):\n    return word == word[::-1]\n\nprint(is_palindrome(\"kayak\"))\nprint(is_palindrome(\"python\"))\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "VHJ1ZQpGYWxzZQ=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "algorithm_q2",
    "title": "알고리즘 2. 피보나치 수열 10번째 항 구하기",
    "category": "함수",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "피보나치 수열(1, 1, 2, 3, 5, 8, 13, 21, 34, 55...)의 10번째 항의 값을 출력하는 코드를 작성하세요.",
    "constraints": [
      "반복문 또는 재귀함수를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "55"
      }
    ],
    "initialCode": "def fibonacci(n):\n    a, b = 1, 1\n    for _ in range(n - 1):\n        a, b = b, a + b\n    return a\n\nprint(fibonacci(10))\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "NTU="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "algorithm_q3",
    "title": "알고리즘 3. 팩토리얼(Factorial) 구하기",
    "category": "반복문",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "5! (5 × 4 × 3 × 2 × 1)의 값을 계산하여 출력하세요.",
    "constraints": [
      "`math.factorial` 또는 반복문을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "120"
      }
    ],
    "initialCode": "import math\nprint(math.factorial(5))\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "MTIw"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "algorithm_q4",
    "title": "응용 2. 리스트 중복 제거 후 오름차순 정렬",
    "category": "리스트",
    "difficulty": "intermediate",
    "type": "coding",
    "description": "리스트 `[4, 2, 8, 2, 4, 9, 1, 8]`에서 중복된 원소를 제거하고 오름차순으로 정렬한 리스트를 출력하세요.",
    "constraints": [
      "`set()`과 `sorted()`를 활용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "[1, 2, 4, 8, 9]"
      }
    ],
    "initialCode": "numbers = [4, 2, 8, 2, 4, 9, 1, 8]\n# 중복을 제거하고 정렬하여 출력하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "WzEsIDIsIDQsIDgsIDld"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_exc_1",
    "title": "예외 처리 1. ZeroDivisionError 처리하기",
    "category": "예외처리",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "python",
    "description": "10을 0으로 나누려고 할 때 발생하는 예외를 처리하여 결과 문구를 출력하세요.",
    "constraints": ["try-except를 사용하세요.","ZeroDivisionError를 처리하세요."],
    "examples": [{"input":"코드 출력 예시","output":"0으로 나눌 수 없습니다."}],
    "initialCode": "try:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    # 여기에 코드를 작성하세요\n    pass\n",
    "testCases": [{"input":"코드 실행","expected": "MOycvOuhnCDrgpjriIwg7IiYIOyXhuyKteuLiOuLpC4="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_exc_2",
    "title": "예외 처리 2. try-except-else 활용하기",
    "category": "예외처리",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "python",
    "description": "10을 2로 나누는 코드를 try-except-else 구조로 작성하여, 예외가 없을 때 else 블록에서 결과를 출력하세요.",
    "constraints": ["try, except ZeroDivisionError, else를 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"5.0"}],
    "initialCode": "try:\n    result = 10 / 2\nexcept ZeroDivisionError:\n    print(\"0으로 나눌 수 없습니다.\")\n# else 블록을 이어서 작성하세요\n",
    "testCases": [{"input":"코드 실행","expected": "NS4w"}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_exc_3",
    "title": "예외 처리 3. finally로 마무리하기",
    "category": "예외처리",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "python",
    "description": "리스트에서 없는 인덱스에 접근하는 예외를 처리하고, finally 블록에서 \"작업을 종료합니다.\"를 출력하세요.",
    "constraints": ["numbers = [1, 2, 3]","인덱스 5에 접근을 시도하세요.","IndexError를 처리하고 \"인덱스 범위를 벗어났습니다.\"를 출력하세요."],
    "examples": [{"input":"코드 출력 예시","output":"인덱스 범위를 벗어났습니다.\n작업을 종료합니다."}],
    "initialCode": "numbers = [1, 2, 3]\ntry:\n    print(numbers[5])\nexcept IndexError:\n    # 여기에 코드를 작성하세요\n    pass\nfinally:\n    # 여기에 코드를 작성하세요\n    pass\n",
    "testCases": [{"input":"코드 실행","expected": "7J24642x7IqkIOuylOychOulvCDrspfslrTrgqzsirXri4jri6QuCuyekeyXheydhCDsooXro4ztlanri4jri6Qu"}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_exc_4",
    "title": "예외 처리 4. ValueError 처리하기",
    "category": "예외처리",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "python",
    "description": "문자열 \"abc\"를 정수로 변환하려고 할 때 발생하는 예외를 처리하여 \"숫자로 변환할 수 없습니다.\"를 출력하세요.",
    "constraints": ["int()를 사용하세요.","ValueError를 처리하세요."],
    "examples": [{"input":"코드 출력 예시","output":"숫자로 변환할 수 없습니다."}],
    "initialCode": "try:\n    number = int(\"abc\")\nexcept ValueError:\n    # 여기에 코드를 작성하세요\n    pass\n",
    "testCases": [{"input":"코드 실행","expected": "7Iir7J6Q66GcIOuzgO2ZmO2VoCDsiJgg7JeG7Iq164uI64ukLg=="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_exc_5",
    "title": "예외 처리 5. raise로 예외 발생시키기",
    "category": "예외처리",
    "difficulty": "advanced",
    "type": "coding",
    "language": "python",
    "description": "나이가 음수이면 ValueError를 직접 발생시키는 함수 check_age(age)를 작성하고, check_age(-5)를 호출했을 때 예외를 처리하여 예외 메시지를 출력하세요.",
    "constraints": ["함수 이름은 check_age","raise ValueError(\"나이는 음수일 수 없습니다.\")를 사용하세요.","except ValueError as e: print(e) 형태로 처리하세요."],
    "examples": [{"input":"코드 출력 예시","output":"나이는 음수일 수 없습니다."}],
    "initialCode": "def check_age(age):\n    # 여기에 코드를 작성하세요\n    pass\n\ntry:\n    check_age(-5)\nexcept ValueError as e:\n    print(e)\n",
    "testCases": [{"input":"코드 실행","expected": "64KY7J2064qUIOydjOyImOydvCDsiJgg7JeG7Iq164uI64ukLg=="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_exc_6",
    "title": "예외 처리 6. 커스텀 예외 클래스 만들기",
    "category": "예외처리",
    "difficulty": "advanced",
    "type": "coding",
    "language": "python",
    "description": "Exception을 상속받은 사용자 정의 예외 클래스 NegativeNumberError를 만들고, 숫자가 음수일 때 이 예외를 발생시켜 메시지를 출력하세요.",
    "constraints": ["class NegativeNumberError(Exception): 형태로 정의하세요.","음수(-3)를 전달하면 \"음수는 허용되지 않습니다.\"를 예외 메시지로 발생시키세요."],
    "examples": [{"input":"코드 출력 예시","output":"음수는 허용되지 않습니다."}],
    "initialCode": "class NegativeNumberError(Exception):\n    pass\n\ndef check_number(n):\n    # 여기에 코드를 작성하세요\n    pass\n\ntry:\n    check_number(-3)\nexcept NegativeNumberError as e:\n    print(e)\n",
    "testCases": [{"input":"코드 실행","expected": "7J2M7IiY64qUIO2XiOyaqeuQmOyngCDslYrsirXri4jri6Qu"}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_cls_1",
    "title": "클래스 1. 클래스 정의와 객체 생성",
    "category": "클래스와 객체",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "python",
    "description": "이름과 나이를 가지는 Person 클래스를 만들고, 생성자를 통해 \"민수\", 20으로 객체를 생성한 뒤 이름과 나이를 출력하세요.",
    "constraints": ["클래스 이름은 Person","__init__(self, name, age)로 생성자를 정의하세요."],
    "examples": [{"input":"코드 출력 예시","output":"민수\n20"}],
    "initialCode": "class Person:\n    def __init__(self, name, age):\n        # 여기에 코드를 작성하세요\n        pass\n\np = Person(\"민수\", 20)\nprint(p.name)\nprint(p.age)\n",
    "testCases": [{"input":"코드 실행","expected": "66+87IiYCjIw"}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_cls_2",
    "title": "클래스 2. 메서드 정의하기",
    "category": "클래스와 객체",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "python",
    "description": "Person 클래스에 자기소개를 출력하는 introduce() 메서드를 추가하고, \"찬희\", 25로 객체를 만들어 introduce()를 호출하세요.",
    "constraints": ["introduce() 메서드에서 f-string을 사용하세요.","출력 형식: \"안녕하세요, 저는 이름입니다.\""],
    "examples": [{"input":"코드 출력 예시","output":"안녕하세요, 저는 찬희입니다."}],
    "initialCode": "class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\n    def introduce(self):\n        # 여기에 코드를 작성하세요\n        pass\n\np = Person(\"찬희\", 25)\np.introduce()\n",
    "testCases": [{"input":"코드 실행","expected": "7JWI64WV7ZWY7IS47JqULCDsoIDripQg7LCs7Z2s7J6F64uI64ukLg=="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_cls_3",
    "title": "클래스 3. 클래스 변수와 인스턴스 변수",
    "category": "클래스와 객체",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "python",
    "description": "모든 Dog 객체가 공유하는 클래스 변수 species = \"개\"를 정의하고, 이름은 인스턴스 변수로 저장하는 Dog 클래스를 만든 뒤, \"초코\"로 객체를 만들어 이름과 species를 출력하세요.",
    "constraints": ["클래스 변수 species를 클래스 바로 아래에 선언하세요."],
    "examples": [{"input":"코드 출력 예시","output":"초코\n개"}],
    "initialCode": "class Dog:\n    # 여기에 클래스 변수를 작성하세요\n\n    def __init__(self, name):\n        self.name = name\n\nd = Dog(\"초코\")\nprint(d.name)\nprint(d.species)\n",
    "testCases": [{"input":"코드 실행","expected": "7LSI7L2UCuqwnA=="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_cls_4",
    "title": "클래스 4. 여러 객체 비교하기",
    "category": "클래스와 객체",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "python",
    "description": "Student 클래스(이름, 점수)를 만들고, \"민수\"(90점)와 \"철수\"(85점) 두 학생을 생성한 뒤, 점수가 더 높은 학생의 이름을 출력하세요.",
    "constraints": ["클래스 이름은 Student","__init__(self, name, score)를 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"민수"}],
    "initialCode": "class Student:\n    def __init__(self, name, score):\n        self.name = name\n        self.score = score\n\ns1 = Student(\"민수\", 90)\ns2 = Student(\"철수\", 85)\n\n# 점수가 더 높은 학생의 이름을 출력하세요\n",
    "testCases": [{"input":"코드 실행","expected": "66+87IiY"}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_cls_5",
    "title": "클래스 5. 메서드로 상태 변경하기",
    "category": "클래스와 객체",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "python",
    "description": "체력(hp=100)을 가진 Character 클래스를 만들고, 데미지를 입으면 체력을 깎는 take_damage(amount) 메서드를 작성하세요. 20의 데미지를 입힌 뒤 남은 체력을 출력하세요.",
    "constraints": ["생성자에서 self.hp = 100으로 초기화하세요.","take_damage(self, amount) 메서드를 작성하세요."],
    "examples": [{"input":"코드 출력 예시","output":"80"}],
    "initialCode": "class Character:\n    def __init__(self):\n        self.hp = 100\n\n    def take_damage(self, amount):\n        # 여기에 코드를 작성하세요\n        pass\n\nc = Character()\nc.take_damage(20)\nprint(c.hp)\n",
    "testCases": [{"input":"코드 실행","expected": "ODA="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_cls_6",
    "title": "클래스 6. 객체 리스트 다루기",
    "category": "클래스와 객체",
    "difficulty": "advanced",
    "type": "coding",
    "language": "python",
    "description": "Product 클래스(이름, 가격)로 만든 객체 3개를 리스트에 담고, 반복문으로 모든 상품의 이름과 가격을 \"이름: 가격\" 형태로 출력하세요. (사과 1000, 바나나 2000, 포도 3000)",
    "constraints": ["Product 클래스를 만들고 리스트에 3개의 객체를 담으세요.","for문으로 반복하며 f-string으로 출력하세요."],
    "examples": [{"input":"코드 출력 예시","output":"사과: 1000\n바나나: 2000\n포도: 3000"}],
    "initialCode": "class Product:\n    def __init__(self, name, price):\n        self.name = name\n        self.price = price\n\n# 리스트를 만들고 반복문으로 출력하세요\n",
    "testCases": [{"input":"코드 실행","expected": "7IKs6rO8OiAxMDAwCuuwlOuCmOuCmDogMjAwMArtj6zrj4Q6IDMwMDA="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_inh_1",
    "title": "상속 1. 기본 상속",
    "category": "상속",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "python",
    "description": "Animal 클래스(이름)를 상속받는 Dog 클래스를 만들고, \"초코\"라는 이름의 Dog 객체를 생성해 이름을 출력하세요.",
    "constraints": ["class Dog(Animal): 형태로 상속하세요."],
    "examples": [{"input":"코드 출력 예시","output":"초코"}],
    "initialCode": "class Animal:\n    def __init__(self, name):\n        self.name = name\n\n# Dog 클래스를 작성하세요\n\nd = Dog(\"초코\")\nprint(d.name)\n",
    "testCases": [{"input":"코드 실행","expected": "7LSI7L2U"}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_inh_2",
    "title": "상속 2. 메서드 오버라이딩",
    "category": "상속",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "python",
    "description": "Animal 클래스에 make_sound() 메서드(\"동물이 소리를 냅니다.\")를 정의하고, Dog 클래스에서 이를 재정의하여 \"멍멍!\"을 출력하도록 만드세요.",
    "constraints": ["Dog 클래스에서 make_sound()를 다시 정의(오버라이딩)하세요."],
    "examples": [{"input":"코드 출력 예시","output":"멍멍!"}],
    "initialCode": "class Animal:\n    def make_sound(self):\n        print(\"동물이 소리를 냅니다.\")\n\n# Dog 클래스에서 make_sound를 오버라이딩하세요\n\nd = Dog()\nd.make_sound()\n",
    "testCases": [{"input":"코드 실행","expected": "66mN66mNIQ=="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_inh_3",
    "title": "상속 3. super()로 부모 생성자 호출하기",
    "category": "상속",
    "difficulty": "advanced",
    "type": "coding",
    "language": "python",
    "description": "Animal 클래스(이름)를 상속받는 Dog 클래스에서 super().__init__()을 사용해 부모의 생성자를 호출하고, 품종(breed) 정보를 추가로 저장하세요. \"초코\", \"말티즈\"로 객체를 만들어 이름과 품종을 출력하세요.",
    "constraints": ["super().__init__(name)을 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"초코\n말티즈"}],
    "initialCode": "class Animal:\n    def __init__(self, name):\n        self.name = name\n\nclass Dog(Animal):\n    def __init__(self, name, breed):\n        # 여기에 코드를 작성하세요\n        pass\n\nd = Dog(\"초코\", \"말티즈\")\nprint(d.name)\nprint(d.breed)\n",
    "testCases": [{"input":"코드 실행","expected": "7LSI7L2UCuunkO2LsOymiA=="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_inh_4",
    "title": "상속 4. 다형성 활용하기",
    "category": "상속",
    "difficulty": "advanced",
    "type": "coding",
    "language": "python",
    "description": "Animal을 상속받는 Dog(\"멍멍!\")와 Cat(\"야옹!\") 클래스를 만들고, 두 객체를 리스트에 담아 반복문으로 각각의 make_sound()를 호출하세요.",
    "constraints": ["Dog, Cat 모두 Animal을 상속받아 make_sound()를 오버라이딩하세요."],
    "examples": [{"input":"코드 출력 예시","output":"멍멍!\n야옹!"}],
    "initialCode": "class Animal:\n    def make_sound(self):\n        pass\n\n# Dog, Cat 클래스를 작성하세요\n\nanimals = [Dog(), Cat()]\nfor a in animals:\n    a.make_sound()\n",
    "testCases": [{"input":"코드 실행","expected": "66mN66mNIQrslbzsmLkh"}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_inh_5",
    "title": "상속 5. super()로 메서드 확장하기",
    "category": "상속",
    "difficulty": "advanced",
    "type": "coding",
    "language": "python",
    "description": "Animal 클래스에 eat() 메서드(\"먹이를 먹습니다.\")를 정의하고, Dog 클래스에서 super().eat()을 호출한 뒤 추가로 \"꼬리를 흔듭니다.\"를 출력하도록 오버라이딩하세요.",
    "constraints": ["super().eat()으로 부모 메서드를 먼저 호출하세요."],
    "examples": [{"input":"코드 출력 예시","output":"먹이를 먹습니다.\n꼬리를 흔듭니다."}],
    "initialCode": "class Animal:\n    def eat(self):\n        print(\"먹이를 먹습니다.\")\n\n# Dog 클래스에서 eat()을 오버라이딩하세요\n\nd = Dog()\nd.eat()\n",
    "testCases": [{"input":"코드 실행","expected": "66i57J2066W8IOuoueyKteuLiOuLpC4K6rys66as66W8IO2dlOuTreuLiOuLpC4="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_inh_6",
    "title": "상속 6. isinstance()로 타입 확인하기",
    "category": "상속",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "python",
    "description": "Animal을 상속받는 Dog 클래스의 객체를 만들고, isinstance(d, Animal)과 isinstance(d, Dog)의 결과를 각각 출력하세요.",
    "constraints": ["isinstance(객체, 클래스)를 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"True\nTrue"}],
    "initialCode": "class Animal:\n    pass\n\nclass Dog(Animal):\n    pass\n\nd = Dog()\n# isinstance 결과를 각각 출력하세요\n",
    "testCases": [{"input":"코드 실행","expected": "VHJ1ZQpUcnVl"}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_ds_1",
    "title": "고급 자료구조 1. 리스트 컴프리헨션",
    "category": "리스트",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "python",
    "description": "1부터 10까지 숫자 중 짝수만 리스트 컴프리헨션으로 만들어 출력하세요.",
    "constraints": ["[x for x in ... if ...] 형태를 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"[2, 4, 6, 8, 10]"}],
    "initialCode": "# 리스트 컴프리헨션으로 작성하세요\n",
    "testCases": [{"input":"코드 실행","expected": "WzIsIDQsIDYsIDgsIDEwXQ=="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_ds_2",
    "title": "고급 자료구조 2. 딕셔너리 컴프리헨션",
    "category": "딕셔너리",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "python",
    "description": "1부터 5까지 숫자를 key로, 그 제곱을 value로 하는 딕셔너리를 컴프리헨션으로 만들어 출력하세요.",
    "constraints": ["{x: x**2 for x in ...} 형태를 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"{1: 1, 2: 4, 3: 9, 4: 16, 5: 25}"}],
    "initialCode": "# 딕셔너리 컴프리헨션으로 작성하세요\n",
    "testCases": [{"input":"코드 실행","expected": "ezE6IDEsIDI6IDQsIDM6IDksIDQ6IDE2LCA1OiAyNX0="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_ds_3",
    "title": "고급 자료구조 3. 2차원 리스트 다루기",
    "category": "리스트",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "python",
    "description": "2차원 리스트 [[1,2,3],[4,5,6],[7,8,9]]에서 두 번째 행의 세 번째 값을 출력하세요.",
    "constraints": ["matrix[행][열] 형태로 접근하세요."],
    "examples": [{"input":"코드 출력 예시","output":"6"}],
    "initialCode": "matrix = [[1,2,3],[4,5,6],[7,8,9]]\n# 두 번째 행의 세 번째 값을 출력하세요\n",
    "testCases": [{"input":"코드 실행","expected": "Ng=="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_ds_4",
    "title": "고급 자료구조 4. 딕셔너리 안의 리스트",
    "category": "딕셔너리",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "python",
    "description": "학생별 점수 리스트를 담은 딕셔너리에서 \"민수\"의 점수 평균을 출력하세요.",
    "constraints": ["scores = {\"민수\": [90, 85], \"철수\": [70, 80]}","sum()과 len()을 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"87.5"}],
    "initialCode": "scores = {\"민수\": [90, 85], \"철수\": [70, 80]}\n# 민수의 점수 평균을 출력하세요\n",
    "testCases": [{"input":"코드 실행","expected": "ODcuNQ=="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_ds_5",
    "title": "고급 자료구조 5. sorted()와 key로 정렬하기",
    "category": "리스트",
    "difficulty": "advanced",
    "type": "coding",
    "language": "python",
    "description": "학생 정보 리스트 [(\"민수\", 90), (\"철수\", 70), (\"영희\", 85)]를 점수(두 번째 값) 기준으로 내림차순 정렬하여 출력하세요.",
    "constraints": ["sorted(리스트, key=lambda x: x[1], reverse=True)를 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"[('민수', 90), ('영희', 85), ('철수', 70)]"}],
    "initialCode": "students = [(\"민수\", 90), (\"철수\", 70), (\"영희\", 85)]\n# 점수 기준 내림차순으로 정렬하여 출력하세요\n",
    "testCases": [{"input":"코드 실행","expected": "Wygn66+87IiYJywgOTApLCAoJ+yYge2drCcsIDg1KSwgKCfssqDsiJgnLCA3MCld"}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_ds_6",
    "title": "고급 자료구조 6. set으로 교집합 구하기",
    "category": "리스트",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "python",
    "description": "두 집합 {1,2,3,4}와 {3,4,5,6}의 교집합을 구해 정렬된 리스트로 출력하세요.",
    "constraints": ["& 연산자로 교집합을 구하세요.","sorted()로 정렬하세요."],
    "examples": [{"input":"코드 출력 예시","output":"[3, 4]"}],
    "initialCode": "a = {1, 2, 3, 4}\nb = {3, 4, 5, 6}\n# 교집합을 정렬된 리스트로 출력하세요\n",
    "testCases": [{"input":"코드 실행","expected": "WzMsIDRd"}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_str_1",
    "title": "문자열 심화 1. 소수점 자리수 지정하기",
    "category": "문자열",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "python",
    "description": "원주율 3.14159265를 소수점 둘째 자리까지 반올림하여 f-string으로 출력하세요.",
    "constraints": ["f\"{변수:.2f}\" 형식을 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"3.14"}],
    "initialCode": "pi = 3.14159265\n# 소수점 둘째 자리까지 출력하세요\n",
    "testCases": [{"input":"코드 실행","expected": "My4xNA=="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_str_2",
    "title": "문자열 심화 2. 0으로 채우기",
    "category": "문자열",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "python",
    "description": "숫자 7을 3자리 문자열로 만들어 앞을 0으로 채워 출력하세요. (예: \"007\")",
    "constraints": ["zfill()을 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"007"}],
    "initialCode": "num = 7\n# 3자리로 0을 채워 출력하세요\n",
    "testCases": [{"input":"코드 실행","expected": "MDA3"}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_str_3",
    "title": "문자열 심화 3. join으로 리스트 합치기",
    "category": "문자열",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "python",
    "description": "리스트 [\"사과\", \"바나나\", \"포도\"]를 쉼표와 공백으로 연결한 하나의 문자열로 출력하세요.",
    "constraints": ["join()을 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"사과, 바나나, 포도"}],
    "initialCode": "fruits = [\"사과\", \"바나나\", \"포도\"]\n# join으로 연결하여 출력하세요\n",
    "testCases": [{"input":"코드 실행","expected": "7IKs6rO8LCDrsJTrgpjrgpgsIO2PrOuPhA=="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_algo_1",
    "title": "알고리즘 심화 1. 재귀함수로 팩토리얼 구하기",
    "category": "반복문",
    "difficulty": "advanced",
    "type": "coding",
    "language": "python",
    "description": "재귀함수를 사용해 5의 팩토리얼(5!)을 구하는 factorial(n) 함수를 작성하고 결과를 출력하세요.",
    "constraints": ["재귀 호출을 사용하세요.","factorial(5)를 호출해 출력하세요."],
    "examples": [{"input":"코드 출력 예시","output":"120"}],
    "initialCode": "def factorial(n):\n    # 여기에 코드를 작성하세요\n    pass\n\nprint(factorial(5))\n",
    "testCases": [{"input":"코드 실행","expected": "MTIw"}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_algo_2",
    "title": "알고리즘 심화 2. 이진 탐색",
    "category": "반복문",
    "difficulty": "advanced",
    "type": "coding",
    "language": "python",
    "description": "정렬된 리스트 [1,3,5,7,9,11,13]에서 이진 탐색으로 숫자 9의 인덱스를 찾아 출력하세요.",
    "constraints": ["low, high, mid 를 이용한 이진 탐색을 구현하세요."],
    "examples": [{"input":"코드 출력 예시","output":"4"}],
    "initialCode": "def binary_search(arr, target):\n    # 여기에 코드를 작성하세요\n    pass\n\nnumbers = [1, 3, 5, 7, 9, 11, 13]\nprint(binary_search(numbers, 9))\n",
    "testCases": [{"input":"코드 실행","expected": "NA=="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_algo_3",
    "title": "알고리즘 심화 3. 버블 정렬 직접 구현하기",
    "category": "반복문",
    "difficulty": "advanced",
    "type": "coding",
    "language": "python",
    "description": "sort()를 사용하지 않고 버블 정렬 알고리즘을 직접 구현하여 리스트 [5,2,4,1,3]을 오름차순으로 정렬해 출력하세요.",
    "constraints": ["이중 for문을 사용하세요.","sort()나 sorted()를 사용하지 마세요."],
    "examples": [{"input":"코드 출력 예시","output":"[1, 2, 3, 4, 5]"}],
    "initialCode": "numbers = [5, 2, 4, 1, 3]\n# 버블 정렬로 오름차순 정렬하여 출력하세요\n",
    "testCases": [{"input":"코드 실행","expected": "WzEsIDIsIDMsIDQsIDVd"}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_algo_4",
    "title": "알고리즘 심화 4. 최댓값 직접 구현하기",
    "category": "반복문",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "python",
    "description": "리스트 [4, 8, 2, 9, 5]에서 내장 함수 max()를 사용하지 않고 반복문으로 최댓값을 찾아 출력하세요.",
    "constraints": ["max()를 사용하지 마세요.","for문으로 비교하며 찾으세요."],
    "examples": [{"input":"코드 출력 예시","output":"9"}],
    "initialCode": "numbers = [4, 8, 2, 9, 5]\n# max()를 사용하지 않고 최댓값을 찾아 출력하세요\n",
    "testCases": [{"input":"코드 실행","expected": "OQ=="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_algo_5",
    "title": "알고리즘 심화 5. 최대공약수 구하기",
    "category": "함수",
    "difficulty": "advanced",
    "type": "coding",
    "language": "python",
    "description": "유클리드 호제법을 이용해 24와 36의 최대공약수를 구하는 함수 gcd(a, b)를 작성하고 결과를 출력하세요.",
    "constraints": ["while b: a, b = b, a % b 형태를 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"12"}],
    "initialCode": "def gcd(a, b):\n    # 여기에 코드를 작성하세요\n    pass\n\nprint(gcd(24, 36))\n",
    "testCases": [{"input":"코드 실행","expected": "MTI="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "py_algo_6",
    "title": "알고리즘 심화 6. 소수 판별하기",
    "category": "반복문",
    "difficulty": "advanced",
    "type": "coding",
    "language": "python",
    "description": "숫자가 소수인지 판별하는 함수 is_prime(n)을 작성하고, 1부터 20까지 숫자 중 소수만 출력하세요.",
    "constraints": ["함수 이름은 is_prime","2부터 n-1까지 나누어떨어지는지 확인하세요."],
    "examples": [{"input":"코드 출력 예시","output":"2\n3\n5\n7\n11\n13\n17\n19"}],
    "initialCode": "def is_prime(n):\n    # 여기에 코드를 작성하세요\n    pass\n\nfor i in range(1, 21):\n    if is_prime(i):\n        print(i)\n",
    "testCases": [{"input":"코드 실행","expected": "MgozCjUKNwoxMQoxMwoxNwoxOQ=="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "sql_q1",
    "title": "SQL 1. 특정 열 조회하기",
    "category": "SELECT",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "users 테이블에서 이름과 부서만 조회하세요.",
    "constraints": ["SELECT와 FROM을 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"name | dept\n----------------------------------------\n김철수 | 개발팀\n이영희 | 기획팀\n박민수 | 개발팀\n최수민 | 디자인팀\n정찬희 | 개발팀"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected": "bmFtZSB8IGRlcHQKLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQrquYDssqDsiJggfCDqsJzrsJztjIAK7J207JiB7Z2sIHwg6riw7ZqN7YyACuuwleuvvOyImCB8IOqwnOuwnO2MgArstZzsiJjrr7wgfCDrlJTsnpDsnbjtjIAK7KCV7LCs7Z2sIHwg6rCc67Cc7YyA"}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "sql_q2",
    "title": "SQL 2. 조건으로 필터링하기",
    "category": "WHERE",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "점수가 90점 이상인 사용자의 이름과 점수를 조회하세요.",
    "constraints": ["WHERE score >= 90 조건을 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"name | score\n----------------------------------------\n김철수 | 90\n박민수 | 100\n정찬희 | 95"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected": "bmFtZSB8IHNjb3JlCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0K6rmA7LKg7IiYIHwgOTAK67CV66+87IiYIHwgMTAwCuygleywrO2drCB8IDk1"}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "sql_q3",
    "title": "SQL 3. AND로 조건 조합하기",
    "category": "WHERE",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "개발팀이면서 점수가 90점 이상인 사용자의 이름을 조회하세요.",
    "constraints": ["AND 연산자를 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"name\n----------------------------------------\n김철수\n박민수\n정찬희"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected": "bmFtZQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuq5gOyyoOyImArrsJXrr7zsiJgK7KCV7LCs7Z2s"}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "sql_q4",
    "title": "SQL 4. OR로 조건 조합하기",
    "category": "WHERE",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "기획팀 또는 디자인팀에 속한 사용자의 이름을 조회하세요.",
    "constraints": ["OR 연산자를 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"name\n----------------------------------------\n이영희\n최수민"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected": "bmFtZQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuydtOyYge2drArstZzsiJjrr7w="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "sql_q5",
    "title": "SQL 5. LIKE로 패턴 검색하기",
    "category": "WHERE",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "이름이 \"김\"으로 시작하는 사용자의 이름을 조회하세요.",
    "constraints": ["LIKE와 % 와일드카드를 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"name\n----------------------------------------\n김철수"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected": "bmFtZQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuq5gOyyoOyImA=="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "sql_q6",
    "title": "SQL 6. BETWEEN으로 범위 조회하기",
    "category": "WHERE",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "나이가 20세 이상 25세 이하인 사용자의 이름과 나이를 조회하세요.",
    "constraints": ["BETWEEN을 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"name | age\n----------------------------------------\n김철수 | 20\n이영희 | 25\n박민수 | 22\n정찬희 | 24"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected": "bmFtZSB8IGFnZQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuq5gOyyoOyImCB8IDIwCuydtOyYge2drCB8IDI1CuuwleuvvOyImCB8IDIyCuygleywrO2drCB8IDI0"}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "sql_q7",
    "title": "SQL 7. IN으로 목록 조회하기",
    "category": "WHERE",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "개발팀 또는 기획팀에 속한 사용자의 이름과 부서를 조회하세요.",
    "constraints": ["IN 을 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"name | dept\n----------------------------------------\n김철수 | 개발팀\n이영희 | 기획팀\n박민수 | 개발팀\n정찬희 | 개발팀"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected": "bmFtZSB8IGRlcHQKLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQrquYDssqDsiJggfCDqsJzrsJztjIAK7J207JiB7Z2sIHwg6riw7ZqN7YyACuuwleuvvOyImCB8IOqwnOuwnO2MgArsoJXssKztnawgfCDqsJzrsJztjIA="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "sql_q8",
    "title": "SQL 8. 점수 내림차순 정렬하기",
    "category": "ORDER BY",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "모든 사용자를 점수가 높은 순으로 이름과 점수를 조회하세요.",
    "constraints": ["ORDER BY score DESC를 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"name | score\n----------------------------------------\n박민수 | 100\n정찬희 | 95\n김철수 | 90\n이영희 | 85\n최수민 | 70"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected": "bmFtZSB8IHNjb3JlCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0K67CV66+87IiYIHwgMTAwCuygleywrO2drCB8IDk1Cuq5gOyyoOyImCB8IDkwCuydtOyYge2drCB8IDg1Cuy1nOyImOuvvCB8IDcw"}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "sql_q9",
    "title": "SQL 9. 정렬 후 상위 N개 조회하기",
    "category": "ORDER BY/FETCH FIRST",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "점수가 가장 높은 상위 3명의 이름과 점수를 조회하세요.",
    "constraints": ["ORDER BY와 FETCH FIRST를 함께 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"name | score\n----------------------------------------\n박민수 | 100\n정찬희 | 95\n김철수 | 90"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected": "bmFtZSB8IHNjb3JlCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0K67CV66+87IiYIHwgMTAwCuygleywrO2drCB8IDk1Cuq5gOyyoOyImCB8IDkw"}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "sql_q10",
    "title": "SQL 10. 중복 제거하여 조회하기",
    "category": "SELECT",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "users 테이블에 존재하는 부서 목록을 중복 없이 조회하세요.",
    "constraints": ["DISTINCT를 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"dept\n----------------------------------------\n개발팀\n기획팀\n디자인팀"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected": "ZGVwdAotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuqwnOuwnO2MgArquLDtmo3tjIAK65SU7J6Q7J247YyA"}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "sql_q11",
    "title": "SQL 11. 전체 행 개수 구하기",
    "category": "집계함수",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "users 테이블의 전체 사용자 수를 cnt라는 별칭으로 조회하세요.",
    "constraints": ["COUNT(*)를 사용하고 AS cnt로 별칭을 지정하세요."],
    "examples": [{"input":"코드 출력 예시","output":"cnt\n----------------------------------------\n5"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected": "Y250Ci0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0KNQ=="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "sql_q12",
    "title": "SQL 12. 평균 구하기",
    "category": "집계함수",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "전체 사용자의 평균 점수를 avg_score라는 별칭으로 조회하세요.",
    "constraints": ["AVG()를 사용하고 AS avg_score로 별칭을 지정하세요."],
    "examples": [{"input":"코드 출력 예시","output":"avg_score\n----------------------------------------\n88.0"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected": "YXZnX3Njb3JlCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0KODguMA=="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "sql_q13",
    "title": "SQL 13. 부서별 인원수 구하기",
    "category": "GROUP BY",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "부서별 인원수를 cnt라는 별칭으로 조회하세요.",
    "constraints": ["GROUP BY dept를 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"dept | cnt\n----------------------------------------\n개발팀 | 3\n기획팀 | 1\n디자인팀 | 1"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected": "ZGVwdCB8IGNudAotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuqwnOuwnO2MgCB8IDMK6riw7ZqN7YyAIHwgMQrrlJTsnpDsnbjtjIAgfCAx"}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "sql_q14",
    "title": "SQL 14. HAVING으로 그룹 필터링하기",
    "category": "GROUP BY",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "부서별 평균 점수가 85점 이상인 부서와 평균 점수를 조회하세요.",
    "constraints": ["GROUP BY와 HAVING을 함께 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"dept | avg_score\n----------------------------------------\n개발팀 | 95.0\n기획팀 | 85.0"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected": "ZGVwdCB8IGF2Z19zY29yZQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuqwnOuwnO2MgCB8IDk1LjAK6riw7ZqN7YyAIHwgODUuMA=="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "sql_q15",
    "title": "SQL 15. 최댓값과 최솟값 구하기",
    "category": "집계함수",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "전체 사용자 중 최고 점수와 최저 점수를 각각 max_score, min_score라는 별칭으로 조회하세요.",
    "constraints": ["MAX(), MIN()을 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"max_score | min_score\n----------------------------------------\n100 | 70"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected": "bWF4X3Njb3JlIHwgbWluX3Njb3JlCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0KMTAwIHwgNzA="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "sql_q16",
    "title": "SQL 16. WHERE절로 두 테이블 연결하기 (등가 조인)",
    "category": "JOIN",
    "difficulty": "advanced",
    "type": "coding",
    "language": "sql",
    "description": "users와 orders 테이블을 이름과 상품이 함께 보이도록 조인하여 조회하세요.",
    "constraints": ["FROM users u, orders o 처럼 콤마로 나열하고 WHERE u.id = o.user_id 조건으로 연결하세요."],
    "examples": [{"input":"코드 출력 예시","output":"name | product\n----------------------------------------\n김철수 | 노트북\n김철수 | 마우스\n박민수 | 키보드\n정찬희 | 모니터"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected": "bmFtZSB8IHByb2R1Y3QKLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQrquYDssqDsiJggfCDrhbjtirjrtoEK6rmA7LKg7IiYIHwg66eI7Jqw7IqkCuuwleuvvOyImCB8IO2CpOuztOuTnArsoJXssKztnawgfCDrqqjri4jthLA="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "sql_q17",
    "title": "SQL 17. (+) 외부 조인으로 전체 사용자 조회하기",
    "category": "JOIN",
    "difficulty": "advanced",
    "type": "coding",
    "language": "sql",
    "description": "주문이 없는 사용자도 포함하여 모든 사용자의 이름과 상품을 조회하세요. (주문이 없으면 NULL)",
    "constraints": ["WHERE절 조인 조건에 오라클 외부 조인 연산자 (+)를 사용하세요. (예: u.id = o.user_id(+))"],
    "examples": [{"input":"코드 출력 예시","output":"name | product\n----------------------------------------\n김철수 | 노트북\n김철수 | 마우스\n이영희 | NULL\n박민수 | 키보드\n최수민 | NULL\n정찬희 | 모니터"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected": "bmFtZSB8IHByb2R1Y3QKLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQrquYDssqDsiJggfCDrhbjtirjrtoEK6rmA7LKg7IiYIHwg66eI7Jqw7IqkCuydtOyYge2drCB8IE5VTEwK67CV66+87IiYIHwg7YKk67O065OcCuy1nOyImOuvvCB8IE5VTEwK7KCV7LCs7Z2sIHwg66qo64uI7YSw"}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "sql_q18",
    "title": "SQL 18. WHERE절 조인 + 조건 필터링하기",
    "category": "JOIN",
    "difficulty": "advanced",
    "type": "coding",
    "language": "sql",
    "description": "주문 가격이 10만원 이상인 주문의 사용자 이름, 상품, 가격을 조회하세요.",
    "constraints": ["WHERE절에 조인 조건과 가격 조건을 AND로 함께 작성하세요."],
    "examples": [{"input":"코드 출력 예시","output":"name | product | price\n----------------------------------------\n김철수 | 노트북 | 1500000\n박민수 | 키보드 | 120000\n정찬희 | 모니터 | 450000"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected": "bmFtZSB8IHByb2R1Y3QgfCBwcmljZQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuq5gOyyoOyImCB8IOuFuO2KuOu2gSB8IDE1MDAwMDAK67CV66+87IiYIHwg7YKk67O065OcIHwgMTIwMDAwCuygleywrO2drCB8IOuqqOuLiO2EsCB8IDQ1MDAwMA=="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "sql_q19",
    "title": "SQL 19. 평균보다 높은 사람 찾기 (서브쿼리)",
    "category": "서브쿼리",
    "difficulty": "advanced",
    "type": "coding",
    "language": "sql",
    "description": "전체 평균 점수보다 높은 점수를 받은 사용자의 이름과 점수를 조회하세요.",
    "constraints": ["서브쿼리로 AVG(score)를 구해 WHERE 조건에 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"name | score\n----------------------------------------\n김철수 | 90\n박민수 | 100\n정찬희 | 95"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected": "bmFtZSB8IHNjb3JlCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0K6rmA7LKg7IiYIHwgOTAK67CV66+87IiYIHwgMTAwCuygleywrO2drCB8IDk1"}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "sql_q20",
    "title": "SQL 20. IN 서브쿼리로 조회하기",
    "category": "서브쿼리",
    "difficulty": "advanced",
    "type": "coding",
    "language": "sql",
    "description": "주문을 한 적이 있는 사용자의 이름을 조회하세요.",
    "constraints": ["WHERE id IN (SELECT user_id FROM orders) 형태를 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"name\n----------------------------------------\n김철수\n박민수\n정찬희"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected": "bmFtZQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuq5gOyyoOyImArrsJXrr7zsiJgK7KCV7LCs7Z2s"}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "sql_q21",
    "title": "SQL 21. EXISTS로 존재 여부 확인하기",
    "category": "서브쿼리",
    "difficulty": "advanced",
    "type": "coding",
    "language": "sql",
    "description": "주문 내역이 존재하는 사용자의 이름을 EXISTS를 사용하여 조회하세요.",
    "constraints": ["상관 서브쿼리와 EXISTS를 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"name\n----------------------------------------\n김철수\n박민수\n정찬희"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected": "bmFtZQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuq5gOyyoOyImArrsJXrr7zsiJgK7KCV7LCs7Z2s"}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "sql_q22",
    "title": "SQL 22. UNION으로 결과 합치기",
    "category": "집합연산자",
    "difficulty": "advanced",
    "type": "coding",
    "language": "sql",
    "description": "개발팀 사용자 이름과 점수 95점 이상인 사용자 이름을 UNION으로 합쳐 중복 없이 조회하세요.",
    "constraints": ["UNION을 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"name\n----------------------------------------\n김철수\n박민수\n정찬희"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected": "bmFtZQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuq5gOyyoOyImArrsJXrr7zsiJgK7KCV7LCs7Z2s"}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "sql_q23",
    "title": "SQL 23. UNION ALL로 중복 포함 합치기",
    "category": "집합연산자",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "개발팀 부서를 두 번 조회하는 쿼리를 UNION ALL로 합쳐서 중복을 포함해 조회하세요.",
    "constraints": ["UNION ALL을 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"dept\n----------------------------------------\n개발팀\n개발팀\n개발팀\n개발팀\n개발팀\n개발팀"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected": "ZGVwdAotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuqwnOuwnO2MgArqsJzrsJztjIAK6rCc67Cc7YyACuqwnOuwnO2MgArqsJzrsJztjIAK6rCc67Cc7YyA"}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "sql_q24",
    "title": "SQL 24. RANK()로 순위 매기기",
    "category": "윈도우함수",
    "difficulty": "advanced",
    "type": "coding",
    "language": "sql",
    "description": "점수를 기준으로 내림차순 순위를 매겨 이름, 점수, 순위(rnk)를 조회하세요.",
    "constraints": ["RANK() OVER (ORDER BY score DESC)를 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"name | score | rnk\n----------------------------------------\n박민수 | 100 | 1\n정찬희 | 95 | 2\n김철수 | 90 | 3\n이영희 | 85 | 4\n최수민 | 70 | 5"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected": "bmFtZSB8IHNjb3JlIHwgcm5rCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0K67CV66+87IiYIHwgMTAwIHwgMQrsoJXssKztnawgfCA5NSB8IDIK6rmA7LKg7IiYIHwgOTAgfCAzCuydtOyYge2drCB8IDg1IHwgNArstZzsiJjrr7wgfCA3MCB8IDU="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "sql_q25",
    "title": "SQL 25. ROW_NUMBER()로 고유 번호 매기기",
    "category": "윈도우함수",
    "difficulty": "advanced",
    "type": "coding",
    "language": "sql",
    "description": "점수를 기준으로 내림차순 고유 번호를 매겨 이름, 점수, 번호(rn)를 조회하세요.",
    "constraints": ["ROW_NUMBER() OVER (ORDER BY score DESC)를 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"name | score | rn\n----------------------------------------\n박민수 | 100 | 1\n정찬희 | 95 | 2\n김철수 | 90 | 3\n이영희 | 85 | 4\n최수민 | 70 | 5"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected": "bmFtZSB8IHNjb3JlIHwgcm4KLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQrrsJXrr7zsiJggfCAxMDAgfCAxCuygleywrO2drCB8IDk1IHwgMgrquYDssqDsiJggfCA5MCB8IDMK7J207JiB7Z2sIHwgODUgfCA0Cuy1nOyImOuvvCB8IDcwIHwgNQ=="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "sql_q26",
    "title": "SQL 26. PARTITION BY로 그룹별 평균 구하기",
    "category": "윈도우함수",
    "difficulty": "advanced",
    "type": "coding",
    "language": "sql",
    "description": "각 사용자의 이름, 부서, 점수와 함께 같은 부서의 평균 점수(dept_avg)를 함께 조회하세요.",
    "constraints": ["AVG(score) OVER (PARTITION BY dept)를 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"name | dept | score | dept_avg\n----------------------------------------\n김철수 | 개발팀 | 90 | 95.0\n박민수 | 개발팀 | 100 | 95.0\n정찬희 | 개발팀 | 95 | 95.0\n이영희 | 기획팀 | 85 | 85.0\n최수민 | 디자인팀 | 70 | 70.0"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected": "bmFtZSB8IGRlcHQgfCBzY29yZSB8IGRlcHRfYXZnCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0K6rmA7LKg7IiYIHwg6rCc67Cc7YyAIHwgOTAgfCA5NS4wCuuwleuvvOyImCB8IOqwnOuwnO2MgCB8IDEwMCB8IDk1LjAK7KCV7LCs7Z2sIHwg6rCc67Cc7YyAIHwgOTUgfCA5NS4wCuydtOyYge2drCB8IOq4sO2aje2MgCB8IDg1IHwgODUuMArstZzsiJjrr7wgfCDrlJTsnpDsnbjtjIAgfCA3MCB8IDcwLjA="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "sql_q27",
    "title": "SQL 27. (+) 외부 조인 + IS NULL로 미주문 고객 찾기",
    "category": "NULL 처리",
    "difficulty": "advanced",
    "type": "coding",
    "language": "sql",
    "description": "주문 내역이 하나도 없는 사용자의 이름을 조회하세요.",
    "constraints": ["WHERE절에 (+) 외부 조인 조건을 쓰고, 주문 쪽 컬럼이 NULL인 행만 AND로 필터링하세요."],
    "examples": [{"input":"코드 출력 예시","output":"name\n----------------------------------------\n이영희\n최수민"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected": "bmFtZQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuydtOyYge2drArstZzsiJjrr7w="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "sql_q28",
    "title": "SQL 28. NVL로 NULL 대체하기",
    "category": "NULL 처리",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "모든 사용자의 이름과 주문 상품을 조회하되, 주문이 없는 경우 \"주문없음\"으로 표시하세요.",
    "constraints": ["WHERE절의 (+) 외부 조인과 NVL을 함께 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"name | product\n----------------------------------------\n김철수 | 노트북\n김철수 | 마우스\n이영희 | 주문없음\n박민수 | 키보드\n최수민 | 주문없음\n정찬희 | 모니터"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected": "bmFtZSB8IHByb2R1Y3QKLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQrquYDssqDsiJggfCDrhbjtirjrtoEK6rmA7LKg7IiYIHwg66eI7Jqw7IqkCuydtOyYge2drCB8IOyjvOusuOyXhuydjArrsJXrr7zsiJggfCDtgqTrs7Trk5wK7LWc7IiY66+8IHwg7KO866y47JeG7J2MCuygleywrO2drCB8IOuqqOuLiO2EsA=="}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "sql_q29",
    "title": "SQL 29. CASE WHEN으로 등급 매기기",
    "category": "CASE WHEN",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "점수에 따라 90점 이상은 A, 80점 이상은 B, 그 외는 C 등급을 grade라는 별칭으로 이름과 함께 조회하세요.",
    "constraints": ["CASE WHEN ... THEN ... ELSE ... END를 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"name | grade\n----------------------------------------\n김철수 | A\n이영희 | B\n박민수 | A\n최수민 | C\n정찬희 | A"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected": "bmFtZSB8IGdyYWRlCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0K6rmA7LKg7IiYIHwgQQrsnbTsmIHtnawgfCBCCuuwleuvvOyImCB8IEEK7LWc7IiY66+8IHwgQwrsoJXssKztnawgfCBB"}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "sql_q30",
    "title": "SQL 30. 부서별 평균 점수 반올림하기",
    "category": "GROUP BY",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "부서별 평균 점수를 소수 첫째 자리까지 반올림하여 부서 이름 순으로 조회하세요.",
    "constraints": ["ROUND(AVG(score), 1)과 ORDER BY dept를 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"dept | avg_score\n----------------------------------------\n개발팀 | 95.0\n기획팀 | 85.0\n디자인팀 | 70.0"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected": "ZGVwdCB8IGF2Z19zY29yZQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuqwnOuwnO2MgCB8IDk1LjAK6riw7ZqN7YyAIHwgODUuMArrlJTsnpDsnbjtjIAgfCA3MC4w"}],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "java_quiz_intro_1",
    "title": "Java 퀴즈 1. 변수와 자료형",
    "category": "변수와 자료형",
    "difficulty": "basic",
    "type": "quiz",
    "language": "java",
    "description": "자바에서 정수를 저장하는 기본 자료형은?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "자바에서 정수를 저장하는 기본 자료형은?",
    "quizOptions": ["String","int","boolean","void"],
    "correctAnswerIndex": "MQ=="
  },
  {
    "id": "java_quiz_intro_2",
    "title": "Java 퀴즈 2. 변수와 자료형",
    "category": "변수와 자료형",
    "difficulty": "basic",
    "type": "quiz",
    "language": "java",
    "description": "문자열을 저장하는 참조 자료형은?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "문자열을 저장하는 참조 자료형은?",
    "quizOptions": ["str","char","String","text"],
    "correctAnswerIndex": "Mg=="
  },
  {
    "id": "java_fill_intro_1",
    "title": "Java 빈칸 채우기 3. 변수와 자료형",
    "category": "변수와 자료형",
    "difficulty": "basic",
    "type": "fill",
    "language": "java",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["대소문자를 정확히 입력하세요."],
    "examples": [{"input":"빈칸 입력","output":"입력 즉시 정답/오답 확인"}],
    "fillQuestion": "자바 프로그램이 시작되는 메서드 이름은 _____이다.",
    "correctAnswerText": "bWFpbg==",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "java_quiz_operator_1",
    "title": "Java 퀴즈 4. 연산자",
    "category": "연산자",
    "difficulty": "basic",
    "type": "quiz",
    "language": "java",
    "description": "자바에서 5 / 2 (둘 다 int)의 결과는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "자바에서 5 / 2 (둘 다 int)의 결과는?",
    "quizOptions": ["2.5","3","2.0","2"],
    "correctAnswerIndex": "Mw=="
  },
  {
    "id": "java_quiz_operator_2",
    "title": "Java 퀴즈 5. 연산자",
    "category": "연산자",
    "difficulty": "basic",
    "type": "quiz",
    "language": "java",
    "description": "값을 1 증가시키는 연산자는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "값을 1 증가시키는 연산자는?",
    "quizOptions": ["++","--","**","//"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "java_fill_operator_1",
    "title": "Java 빈칸 채우기 6. 연산자",
    "category": "연산자",
    "difficulty": "basic",
    "type": "fill",
    "language": "java",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["대소문자를 정확히 입력하세요."],
    "examples": [{"input":"빈칸 입력","output":"입력 즉시 정답/오답 확인"}],
    "fillQuestion": "문자열 내용을 비교할 때 사용해야 하는 메서드는 _____()이다.",
    "correctAnswerText": "ZXF1YWxz",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "java_quiz_conditional_1",
    "title": "Java 퀴즈 7. 조건문",
    "category": "조건문",
    "difficulty": "basic",
    "type": "quiz",
    "language": "java",
    "description": "switch문에서 일치하는 case가 없을 때 실행되는 키워드는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "switch문에서 일치하는 case가 없을 때 실행되는 키워드는?",
    "quizOptions": ["else","break","case","default"],
    "correctAnswerIndex": "Mw=="
  },
  {
    "id": "java_quiz_conditional_2",
    "title": "Java 퀴즈 8. 조건문",
    "category": "조건문",
    "difficulty": "basic",
    "type": "quiz",
    "language": "java",
    "description": "조건식을 감싸는 기호는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "조건식을 감싸는 기호는?",
    "quizOptions": ["()","[]","{}","<>"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "java_fill_conditional_1",
    "title": "Java 빈칸 채우기 9. 조건문",
    "category": "조건문",
    "difficulty": "basic",
    "type": "fill",
    "language": "java",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["대소문자를 정확히 입력하세요."],
    "examples": [{"input":"빈칸 입력","output":"입력 즉시 정답/오답 확인"}],
    "fillQuestion": "switch문의 각 case를 끝낼 때 사용하는 키워드는 _____이다.",
    "correctAnswerText": "YnJlYWs=",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "java_quiz_array_1",
    "title": "Java 퀴즈 10. 배열",
    "category": "배열",
    "difficulty": "basic",
    "type": "quiz",
    "language": "java",
    "description": "배열의 길이를 구할 때 사용하는 것은?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "배열의 길이를 구할 때 사용하는 것은?",
    "quizOptions": [".length()",".size()",".length",".count()"],
    "correctAnswerIndex": "Mg=="
  },
  {
    "id": "java_quiz_array_2",
    "title": "Java 퀴즈 11. 배열",
    "category": "배열",
    "difficulty": "basic",
    "type": "quiz",
    "language": "java",
    "description": "배열의 인덱스는 몇 번부터 시작하는가?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "배열의 인덱스는 몇 번부터 시작하는가?",
    "quizOptions": ["1","-1","2","0"],
    "correctAnswerIndex": "Mw=="
  },
  {
    "id": "java_fill_array_1",
    "title": "Java 빈칸 채우기 12. 배열",
    "category": "배열",
    "difficulty": "basic",
    "type": "fill",
    "language": "java",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["대소문자를 정확히 입력하세요."],
    "examples": [{"input":"빈칸 입력","output":"입력 즉시 정답/오답 확인"}],
    "fillQuestion": "자바에서 배열 객체를 생성할 때 사용하는 키워드는 _____이다.",
    "correctAnswerText": "bmV3",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "java_quiz_loop_1",
    "title": "Java 퀴즈 13. 반복문",
    "category": "반복문",
    "difficulty": "intermediate",
    "type": "quiz",
    "language": "java",
    "description": "조건을 나중에 검사해 최소 1번 실행이 보장되는 반복문은?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "조건을 나중에 검사해 최소 1번 실행이 보장되는 반복문은?",
    "quizOptions": ["while","for","switch","do-while"],
    "correctAnswerIndex": "Mw=="
  },
  {
    "id": "java_quiz_loop_2",
    "title": "Java 퀴즈 14. 반복문",
    "category": "반복문",
    "difficulty": "intermediate",
    "type": "quiz",
    "language": "java",
    "description": "반복문을 즉시 종료하는 키워드는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "반복문을 즉시 종료하는 키워드는?",
    "quizOptions": ["break","continue","return","stop"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "java_fill_loop_1",
    "title": "Java 빈칸 채우기 15. 반복문",
    "category": "반복문",
    "difficulty": "intermediate",
    "type": "fill",
    "language": "java",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["대소문자를 정확히 입력하세요."],
    "examples": [{"input":"빈칸 입력","output":"입력 즉시 정답/오답 확인"}],
    "fillQuestion": "반복문에서 이번 반복만 건너뛰고 다음 반복으로 넘어갈 때 사용하는 키워드는 _____이다.",
    "correctAnswerText": "Y29udGludWU=",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "java_quiz_method_1",
    "title": "Java 퀴즈 16. 메서드",
    "category": "메서드",
    "difficulty": "intermediate",
    "type": "quiz",
    "language": "java",
    "description": "값을 반환하지 않는 메서드의 반환타입은?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "값을 반환하지 않는 메서드의 반환타입은?",
    "quizOptions": ["void","null","none","empty"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "java_quiz_method_2",
    "title": "Java 퀴즈 17. 메서드",
    "category": "메서드",
    "difficulty": "intermediate",
    "type": "quiz",
    "language": "java",
    "description": "같은 이름, 다른 매개변수로 메서드를 여러 개 정의하는 것은?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "같은 이름, 다른 매개변수로 메서드를 여러 개 정의하는 것은?",
    "quizOptions": ["오버라이딩","오버로딩","상속","캡슐화"],
    "correctAnswerIndex": "MQ=="
  },
  {
    "id": "java_fill_method_1",
    "title": "Java 빈칸 채우기 18. 메서드",
    "category": "메서드",
    "difficulty": "intermediate",
    "type": "fill",
    "language": "java",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["대소문자를 정확히 입력하세요."],
    "examples": [{"input":"빈칸 입력","output":"입력 즉시 정답/오답 확인"}],
    "fillQuestion": "메서드가 값을 호출한 곳으로 돌려줄 때 사용하는 키워드는 _____이다.",
    "correctAnswerText": "cmV0dXJu",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "java_quiz_collection_1",
    "title": "Java 퀴즈 19. 컬렉션",
    "category": "컬렉션",
    "difficulty": "intermediate",
    "type": "quiz",
    "language": "java",
    "description": "크기가 자유롭게 변하는 리스트를 제공하는 클래스는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "크기가 자유롭게 변하는 리스트를 제공하는 클래스는?",
    "quizOptions": ["Array","ArrayList","List[]","Vector[]"],
    "correctAnswerIndex": "MQ=="
  },
  {
    "id": "java_quiz_collection_2",
    "title": "Java 퀴즈 20. 컬렉션",
    "category": "컬렉션",
    "difficulty": "intermediate",
    "type": "quiz",
    "language": "java",
    "description": "키-값 쌍으로 저장하는 컬렉션은?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "키-값 쌍으로 저장하는 컬렉션은?",
    "quizOptions": ["ArrayList","HashSet","HashMap","LinkedList"],
    "correctAnswerIndex": "Mg=="
  },
  {
    "id": "java_fill_collection_1",
    "title": "Java 빈칸 채우기 21. 컬렉션",
    "category": "컬렉션",
    "difficulty": "intermediate",
    "type": "fill",
    "language": "java",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["대소문자를 정확히 입력하세요."],
    "examples": [{"input":"빈칸 입력","output":"입력 즉시 정답/오답 확인"}],
    "fillQuestion": "ArrayList에 값을 추가할 때 사용하는 메서드는 _____()이다.",
    "correctAnswerText": "YWRk",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "java_quiz_exception_1",
    "title": "Java 퀴즈 22. 예외처리",
    "category": "예외처리",
    "difficulty": "intermediate",
    "type": "quiz",
    "language": "java",
    "description": "예외가 발생했을 때 처리할 코드를 작성하는 블록은?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "예외가 발생했을 때 처리할 코드를 작성하는 블록은?",
    "quizOptions": ["catch","try","finally","throw"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "java_quiz_exception_2",
    "title": "Java 퀴즈 23. 예외처리",
    "category": "예외처리",
    "difficulty": "intermediate",
    "type": "quiz",
    "language": "java",
    "description": "예외 발생 여부와 상관없이 항상 실행되는 블록은?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "예외 발생 여부와 상관없이 항상 실행되는 블록은?",
    "quizOptions": ["try","finally","catch","throws"],
    "correctAnswerIndex": "MQ=="
  },
  {
    "id": "java_fill_exception_1",
    "title": "Java 빈칸 채우기 24. 예외처리",
    "category": "예외처리",
    "difficulty": "intermediate",
    "type": "fill",
    "language": "java",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["대소문자를 정확히 입력하세요."],
    "examples": [{"input":"빈칸 입력","output":"입력 즉시 정답/오답 확인"}],
    "fillQuestion": "예외를 직접 발생시킬 때 사용하는 키워드는 _____이다.",
    "correctAnswerText": "dGhyb3c=",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "java_quiz_class_1",
    "title": "Java 퀴즈 25. 클래스와 객체",
    "category": "클래스와 객체",
    "difficulty": "advanced",
    "type": "quiz",
    "language": "java",
    "description": "객체를 생성할 때 사용하는 키워드는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "객체를 생성할 때 사용하는 키워드는?",
    "quizOptions": ["create","new","make","object"],
    "correctAnswerIndex": "MQ=="
  },
  {
    "id": "java_quiz_class_2",
    "title": "Java 퀴즈 26. 클래스와 객체",
    "category": "클래스와 객체",
    "difficulty": "advanced",
    "type": "quiz",
    "language": "java",
    "description": "필드를 외부에서 직접 접근하지 못하게 막는 접근제어자는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "필드를 외부에서 직접 접근하지 못하게 막는 접근제어자는?",
    "quizOptions": ["public","protected","private","final"],
    "correctAnswerIndex": "Mg=="
  },
  {
    "id": "java_fill_class_1",
    "title": "Java 빈칸 채우기 27. 클래스와 객체",
    "category": "클래스와 객체",
    "difficulty": "advanced",
    "type": "fill",
    "language": "java",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["대소문자를 정확히 입력하세요."],
    "examples": [{"input":"빈칸 입력","output":"입력 즉시 정답/오답 확인"}],
    "fillQuestion": "현재 객체 자기 자신을 가리키는 키워드는 _____이다.",
    "correctAnswerText": "dGhpcw==",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "java_quiz_inherit_1",
    "title": "Java 퀴즈 28. 상속",
    "category": "상속",
    "difficulty": "advanced",
    "type": "quiz",
    "language": "java",
    "description": "클래스 상속을 나타낼 때 사용하는 키워드는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "클래스 상속을 나타낼 때 사용하는 키워드는?",
    "quizOptions": ["extends","implements","inherits","super"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "java_quiz_inherit_2",
    "title": "Java 퀴즈 29. 상속",
    "category": "상속",
    "difficulty": "advanced",
    "type": "quiz",
    "language": "java",
    "description": "부모의 메서드를 자식이 같은 형태로 재정의하는 것은?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "부모의 메서드를 자식이 같은 형태로 재정의하는 것은?",
    "quizOptions": ["오버로딩","오버라이딩","캡슐화","인터페이스"],
    "correctAnswerIndex": "MQ=="
  },
  {
    "id": "java_fill_inherit_1",
    "title": "Java 빈칸 채우기 30. 상속",
    "category": "상속",
    "difficulty": "advanced",
    "type": "fill",
    "language": "java",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["대소문자를 정확히 입력하세요."],
    "examples": [{"input":"빈칸 입력","output":"입력 즉시 정답/오답 확인"}],
    "fillQuestion": "부모 클래스의 생성자를 호출할 때 사용하는 키워드는 _____이다.",
    "correctAnswerText": "c3VwZXI=",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "java_quiz_interface_1",
    "title": "Java 퀴즈 31. 인터페이스",
    "category": "인터페이스",
    "difficulty": "advanced",
    "type": "quiz",
    "language": "java",
    "description": "클래스가 인터페이스를 구현할 때 사용하는 키워드는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "클래스가 인터페이스를 구현할 때 사용하는 키워드는?",
    "quizOptions": ["extends","interface","implements","abstract"],
    "correctAnswerIndex": "Mg=="
  },
  {
    "id": "java_quiz_interface_2",
    "title": "Java 퀴즈 32. 인터페이스",
    "category": "인터페이스",
    "difficulty": "advanced",
    "type": "quiz",
    "language": "java",
    "description": "미완성 메서드를 포함할 수 있는 클래스를 선언하는 키워드는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "미완성 메서드를 포함할 수 있는 클래스를 선언하는 키워드는?",
    "quizOptions": ["interface","final","static","abstract"],
    "correctAnswerIndex": "Mw=="
  },
  {
    "id": "java_fill_interface_1",
    "title": "Java 빈칸 채우기 33. 인터페이스",
    "category": "인터페이스",
    "difficulty": "advanced",
    "type": "fill",
    "language": "java",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["대소문자를 정확히 입력하세요."],
    "examples": [{"input":"빈칸 입력","output":"입력 즉시 정답/오답 확인"}],
    "fillQuestion": "인터페이스를 정의할 때 사용하는 키워드는 _____이다.",
    "correctAnswerText": "aW50ZXJmYWNl",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "java_quiz_string_1",
    "title": "Java 퀴즈 34. 문자열",
    "category": "문자열",
    "difficulty": "advanced",
    "type": "quiz",
    "language": "java",
    "description": "반복적인 문자열 조합에 효율적인 클래스는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "반복적인 문자열 조합에 효율적인 클래스는?",
    "quizOptions": ["StringBuilder","String","Integer","Object"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "java_quiz_string_2",
    "title": "Java 퀴즈 35. 문자열",
    "category": "문자열",
    "difficulty": "advanced",
    "type": "quiz",
    "language": "java",
    "description": "문자열을 정수로 변환하는 메서드는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "문자열을 정수로 변환하는 메서드는?",
    "quizOptions": ["String.toInt()","Integer.parseInt()","(int)str","Integer.valueOf()"],
    "correctAnswerIndex": "MQ=="
  },
  {
    "id": "java_fill_string_1",
    "title": "Java 빈칸 채우기 36. 문자열",
    "category": "문자열",
    "difficulty": "advanced",
    "type": "fill",
    "language": "java",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["대소문자를 정확히 입력하세요."],
    "examples": [{"input":"빈칸 입력","output":"입력 즉시 정답/오답 확인"}],
    "fillQuestion": "문자열에 문자를 이어 붙일 때 사용하는 연산자는 _____이다.",
    "correctAnswerText": "Kw==",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "c_quiz_intro_1",
    "title": "C 퀴즈 1. 변수와 자료형",
    "category": "변수와 자료형",
    "difficulty": "basic",
    "type": "quiz",
    "language": "c",
    "description": "C에서 정수를 저장하는 기본 자료형은?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "C에서 정수를 저장하는 기본 자료형은?",
    "quizOptions": ["char","int","float","void"],
    "correctAnswerIndex": "MQ=="
  },
  {
    "id": "c_quiz_intro_2",
    "title": "C 퀴즈 2. 변수와 자료형",
    "category": "변수와 자료형",
    "difficulty": "basic",
    "type": "quiz",
    "language": "c",
    "description": "실수를 저장하는 자료형은?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "실수를 저장하는 자료형은?",
    "quizOptions": ["int","char","float","void"],
    "correctAnswerIndex": "Mg=="
  },
  {
    "id": "c_fill_intro_1",
    "title": "C 빈칸 채우기 3. 변수와 자료형",
    "category": "변수와 자료형",
    "difficulty": "basic",
    "type": "fill",
    "language": "c",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["대소문자를 정확히 입력하세요."],
    "examples": [{"input":"빈칸 입력","output":"입력 즉시 정답/오답 확인"}],
    "fillQuestion": "C 프로그램이 시작되는 함수 이름은 _____이다.",
    "correctAnswerText": "bWFpbg==",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "c_quiz_operator_1",
    "title": "C 퀴즈 4. 연산자",
    "category": "연산자",
    "difficulty": "basic",
    "type": "quiz",
    "language": "c",
    "description": "C에서 5 / 2 (둘 다 int)의 결과는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "C에서 5 / 2 (둘 다 int)의 결과는?",
    "quizOptions": ["2.5","3","2.0","2"],
    "correctAnswerIndex": "Mw=="
  },
  {
    "id": "c_quiz_operator_2",
    "title": "C 퀴즈 5. 연산자",
    "category": "연산자",
    "difficulty": "basic",
    "type": "quiz",
    "language": "c",
    "description": "값을 1 증가시키는 연산자는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "값을 1 증가시키는 연산자는?",
    "quizOptions": ["++","--","+=2","**"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "c_fill_operator_1",
    "title": "C 빈칸 채우기 6. 연산자",
    "category": "연산자",
    "difficulty": "basic",
    "type": "fill",
    "language": "c",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["기호를 정확히 입력하세요."],
    "examples": [{"input":"빈칸 입력","output":"입력 즉시 정답/오답 확인"}],
    "fillQuestion": "두 값이 같은지 비교할 때 사용하는 연산자는 _____이다.",
    "correctAnswerText": "PT0=",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "c_quiz_conditional_1",
    "title": "C 퀴즈 7. 조건문",
    "category": "조건문",
    "difficulty": "basic",
    "type": "quiz",
    "language": "c",
    "description": "정수 값에 따라 여러 분기를 처리할 때 사용하는 문법은?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "정수 값에 따라 여러 분기를 처리할 때 사용하는 문법은?",
    "quizOptions": ["switch","while","for","struct"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "c_quiz_conditional_2",
    "title": "C 퀴즈 8. 조건문",
    "category": "조건문",
    "difficulty": "basic",
    "type": "quiz",
    "language": "c",
    "description": "switch문에서 각 case 처리 후 다음 case로 넘어가지 않게 막는 키워드는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "switch문에서 각 case 처리 후 다음 case로 넘어가지 않게 막는 키워드는?",
    "quizOptions": ["break","continue","return","goto"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "c_fill_conditional_1",
    "title": "C 빈칸 채우기 9. 조건문",
    "category": "조건문",
    "difficulty": "basic",
    "type": "fill",
    "language": "c",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["대소문자를 정확히 입력하세요."],
    "examples": [{"input":"빈칸 입력","output":"입력 즉시 정답/오답 확인"}],
    "fillQuestion": "조건이 거짓일 때 실행할 코드를 지정하는 키워드는 _____이다.",
    "correctAnswerText": "ZWxzZQ==",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "c_quiz_array_1",
    "title": "C 퀴즈 10. 배열",
    "category": "배열",
    "difficulty": "basic",
    "type": "quiz",
    "language": "c",
    "description": "C에서 배열의 첫 번째 요소의 인덱스는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "C에서 배열의 첫 번째 요소의 인덱스는?",
    "quizOptions": ["1","0","-1","선언마다 다름"],
    "correctAnswerIndex": "MQ=="
  },
  {
    "id": "c_quiz_array_2",
    "title": "C 퀴즈 11. 배열",
    "category": "배열",
    "difficulty": "basic",
    "type": "quiz",
    "language": "c",
    "description": "int arr[5]; 로 선언했을 때 배열의 요소 개수는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "int arr[5]; 로 선언했을 때 배열의 요소 개수는?",
    "quizOptions": ["4","5","6","알 수 없음"],
    "correctAnswerIndex": "MQ=="
  },
  {
    "id": "c_fill_array_1",
    "title": "C 빈칸 채우기 12. 배열",
    "category": "배열",
    "difficulty": "basic",
    "type": "fill",
    "language": "c",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["대소문자를 정확히 입력하세요."],
    "examples": [{"input":"빈칸 입력","output":"입력 즉시 정답/오답 확인"}],
    "fillQuestion": "변수나 배열이 차지하는 바이트 크기를 구하는 연산자는 _____이다.",
    "correctAnswerText": "c2l6ZW9m",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "c_quiz_loop_1",
    "title": "C 퀴즈 13. 반복문",
    "category": "반복문",
    "difficulty": "intermediate",
    "type": "quiz",
    "language": "c",
    "description": "실행을 최소 한 번은 보장하는 반복문은?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "실행을 최소 한 번은 보장하는 반복문은?",
    "quizOptions": ["while","for","do-while","switch"],
    "correctAnswerIndex": "Mg=="
  },
  {
    "id": "c_quiz_loop_2",
    "title": "C 퀴즈 14. 반복문",
    "category": "반복문",
    "difficulty": "intermediate",
    "type": "quiz",
    "language": "c",
    "description": "반복문을 즉시 종료하고 빠져나가는 키워드는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "반복문을 즉시 종료하고 빠져나가는 키워드는?",
    "quizOptions": ["break","continue","return","exit"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "c_fill_loop_1",
    "title": "C 빈칸 채우기 15. 반복문",
    "category": "반복문",
    "difficulty": "intermediate",
    "type": "fill",
    "language": "c",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["대소문자를 정확히 입력하세요."],
    "examples": [{"input":"빈칸 입력","output":"입력 즉시 정답/오답 확인"}],
    "fillQuestion": "현재 반복을 건너뛰고 다음 반복으로 넘어가는 키워드는 _____이다.",
    "correctAnswerText": "Y29udGludWU=",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "c_quiz_function_1",
    "title": "C 퀴즈 16. 함수",
    "category": "함수",
    "difficulty": "intermediate",
    "type": "quiz",
    "language": "c",
    "description": "값을 반환하지 않는 함수의 반환형으로 사용하는 키워드는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "값을 반환하지 않는 함수의 반환형으로 사용하는 키워드는?",
    "quizOptions": ["int","void","null","none"],
    "correctAnswerIndex": "MQ=="
  },
  {
    "id": "c_quiz_function_2",
    "title": "C 퀴즈 17. 함수",
    "category": "함수",
    "difficulty": "intermediate",
    "type": "quiz",
    "language": "c",
    "description": "함수를 사용하기 전에 컴파일러에게 함수의 이름, 매개변수, 반환형을 미리 알려주는 것을 무엇이라 하는가?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "함수를 사용하기 전에 컴파일러에게 함수의 이름, 매개변수, 반환형을 미리 알려주는 것을 무엇이라 하는가?",
    "quizOptions": ["함수 원형(prototype)","매크로","헤더 가드","형변환"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "c_fill_function_1",
    "title": "C 빈칸 채우기 18. 함수",
    "category": "함수",
    "difficulty": "intermediate",
    "type": "fill",
    "language": "c",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["대소문자를 정확히 입력하세요."],
    "examples": [{"input":"빈칸 입력","output":"입력 즉시 정답/오답 확인"}],
    "fillQuestion": "함수가 값을 호출한 곳으로 돌려줄 때 사용하는 키워드는 _____이다.",
    "correctAnswerText": "cmV0dXJu",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "c_quiz_pointer_1",
    "title": "C 퀴즈 19. 포인터",
    "category": "포인터",
    "difficulty": "intermediate",
    "type": "quiz",
    "language": "c",
    "description": "변수의 메모리 주소를 얻을 때 사용하는 연산자는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "변수의 메모리 주소를 얻을 때 사용하는 연산자는?",
    "quizOptions": ["*","&","%","->"],
    "correctAnswerIndex": "MQ=="
  },
  {
    "id": "c_quiz_pointer_2",
    "title": "C 퀴즈 20. 포인터",
    "category": "포인터",
    "difficulty": "intermediate",
    "type": "quiz",
    "language": "c",
    "description": "포인터가 가리키는 주소에 저장된 값을 읽을 때 사용하는 연산자는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "포인터가 가리키는 주소에 저장된 값을 읽을 때 사용하는 연산자는?",
    "quizOptions": ["&","*","#","::"],
    "correctAnswerIndex": "MQ=="
  },
  {
    "id": "c_fill_pointer_1",
    "title": "C 빈칸 채우기 21. 포인터",
    "category": "포인터",
    "difficulty": "intermediate",
    "type": "fill",
    "language": "c",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["대문자로 정확히 입력하세요."],
    "examples": [{"input":"빈칸 입력","output":"입력 즉시 정답/오답 확인"}],
    "fillQuestion": "아무것도 가리키지 않는 포인터를 초기화할 때 흔히 대입하는 값은 _____이다.",
    "correctAnswerText": "TlVMTA==",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "c_quiz_struct_1",
    "title": "C 퀴즈 22. 구조체",
    "category": "구조체",
    "difficulty": "intermediate",
    "type": "quiz",
    "language": "c",
    "description": "서로 다른 자료형의 변수들을 하나로 묶어 새로운 자료형을 정의할 때 사용하는 키워드는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "서로 다른 자료형의 변수들을 하나로 묶어 새로운 자료형을 정의할 때 사용하는 키워드는?",
    "quizOptions": ["struct","class","array","union"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "c_quiz_struct_2",
    "title": "C 퀴즈 23. 구조체",
    "category": "구조체",
    "difficulty": "intermediate",
    "type": "quiz",
    "language": "c",
    "description": "구조체 포인터를 통해 멤버에 접근할 때 사용하는 연산자는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "구조체 포인터를 통해 멤버에 접근할 때 사용하는 연산자는?",
    "quizOptions": [".","->","::","&"],
    "correctAnswerIndex": "MQ=="
  },
  {
    "id": "c_fill_struct_1",
    "title": "C 빈칸 채우기 24. 구조체",
    "category": "구조체",
    "difficulty": "intermediate",
    "type": "fill",
    "language": "c",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["대소문자를 정확히 입력하세요."],
    "examples": [{"input":"빈칸 입력","output":"입력 즉시 정답/오답 확인"}],
    "fillQuestion": "긴 구조체 타입 이름에 별칭을 붙일 때 사용하는 키워드는 _____이다.",
    "correctAnswerText": "dHlwZWRlZg==",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "c_quiz_string_1",
    "title": "C 퀴즈 25. 문자열",
    "category": "문자열",
    "difficulty": "advanced",
    "type": "quiz",
    "language": "c",
    "description": "C에서 문자열의 끝을 표시하는 특수 문자는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "C에서 문자열의 끝을 표시하는 특수 문자는?",
    "quizOptions": ["EOF","\\n","\\0","NULL"],
    "correctAnswerIndex": "Mg=="
  },
  {
    "id": "c_quiz_string_2",
    "title": "C 퀴즈 26. 문자열",
    "category": "문자열",
    "difficulty": "advanced",
    "type": "quiz",
    "language": "c",
    "description": "두 문자열을 이어 붙일 때 사용하는 표준 라이브러리 함수는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "두 문자열을 이어 붙일 때 사용하는 표준 라이브러리 함수는?",
    "quizOptions": ["strcat","strlen","strcmp","strcpy"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "c_fill_string_1",
    "title": "C 빈칸 채우기 27. 문자열",
    "category": "문자열",
    "difficulty": "advanced",
    "type": "fill",
    "language": "c",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["소문자로 정확히 입력하세요."],
    "examples": [{"input":"빈칸 입력","output":"입력 즉시 정답/오답 확인"}],
    "fillQuestion": "두 문자열이 같은지 비교하는 표준 라이브러리 함수는 _____()이다.",
    "correctAnswerText": "c3RyY21w",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "c_quiz_memory_1",
    "title": "C 퀴즈 28. 동적 메모리 할당",
    "category": "동적 메모리 할당",
    "difficulty": "advanced",
    "type": "quiz",
    "language": "c",
    "description": "힙(heap) 영역에 메모리를 동적으로 할당할 때 사용하는 함수는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "힙(heap) 영역에 메모리를 동적으로 할당할 때 사용하는 함수는?",
    "quizOptions": ["malloc","free","sizeof","new"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "c_quiz_memory_2",
    "title": "C 퀴즈 29. 동적 메모리 할당",
    "category": "동적 메모리 할당",
    "difficulty": "advanced",
    "type": "quiz",
    "language": "c",
    "description": "동적으로 할당한 메모리를 더 이상 사용하지 않을 때 반드시 호출해야 하는 함수는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "동적으로 할당한 메모리를 더 이상 사용하지 않을 때 반드시 호출해야 하는 함수는?",
    "quizOptions": ["malloc","free","delete","clear"],
    "correctAnswerIndex": "MQ=="
  },
  {
    "id": "c_fill_memory_1",
    "title": "C 빈칸 채우기 30. 동적 메모리 할당",
    "category": "동적 메모리 할당",
    "difficulty": "advanced",
    "type": "fill",
    "language": "c",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["소문자로 정확히 입력하세요."],
    "examples": [{"input":"빈칸 입력","output":"입력 즉시 정답/오답 확인"}],
    "fillQuestion": "배열처럼 연속된 메모리를 할당하면서 0으로 초기화까지 해주는 함수는 _____()이다.",
    "correctAnswerText": "Y2FsbG9j",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "c_quiz_preprocessor_1",
    "title": "C 퀴즈 31. 전처리기",
    "category": "전처리기",
    "difficulty": "advanced",
    "type": "quiz",
    "language": "c",
    "description": "다른 파일의 내용을 현재 파일에 포함시킬 때 사용하는 전처리 지시문은?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "다른 파일의 내용을 현재 파일에 포함시킬 때 사용하는 전처리 지시문은?",
    "quizOptions": ["#include","#define","import","using"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "c_quiz_preprocessor_2",
    "title": "C 퀴즈 32. 전처리기",
    "category": "전처리기",
    "difficulty": "advanced",
    "type": "quiz",
    "language": "c",
    "description": "코드에서 상수나 매크로를 정의할 때 사용하는 전처리 지시문은?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "코드에서 상수나 매크로를 정의할 때 사용하는 전처리 지시문은?",
    "quizOptions": ["#include","#define","#pragma","#ifdef"],
    "correctAnswerIndex": "MQ=="
  },
  {
    "id": "c_fill_preprocessor_1",
    "title": "C 빈칸 채우기 33. 전처리기",
    "category": "전처리기",
    "difficulty": "advanced",
    "type": "fill",
    "language": "c",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["#을 포함해 정확히 입력하세요."],
    "examples": [{"input":"빈칸 입력","output":"입력 즉시 정답/오답 확인"}],
    "fillQuestion": "헤더 가드에서 특정 매크로가 아직 정의되지 않았는지 검사하는 전처리 지시문은 _____이다.",
    "correctAnswerText": "I2lmbmRlZg==",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "c_quiz_file_1",
    "title": "C 퀴즈 34. 파일 입출력",
    "category": "파일 입출력",
    "difficulty": "advanced",
    "type": "quiz",
    "language": "c",
    "description": "파일을 열 때 사용하는 표준 라이브러리 함수는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "파일을 열 때 사용하는 표준 라이브러리 함수는?",
    "quizOptions": ["fopen","open","fread","fwrite"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "c_quiz_file_2",
    "title": "C 퀴즈 35. 파일 입출력",
    "category": "파일 입출력",
    "difficulty": "advanced",
    "type": "quiz",
    "language": "c",
    "description": "파일 작업이 끝난 후 반드시 호출해서 자원을 해제해야 하는 함수는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input":"보기 중 선택","output":"선택 즉시 정답/오답 확인"}],
    "quizQuestion": "파일 작업이 끝난 후 반드시 호출해서 자원을 해제해야 하는 함수는?",
    "quizOptions": ["fopen","fclose","fread","fflush"],
    "correctAnswerIndex": "MQ=="
  },
  {
    "id": "c_fill_file_1",
    "title": "C 빈칸 채우기 36. 파일 입출력",
    "category": "파일 입출력",
    "difficulty": "advanced",
    "type": "fill",
    "language": "c",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["소문자로 정확히 입력하세요."],
    "examples": [{"input":"빈칸 입력","output":"입력 즉시 정답/오답 확인"}],
    "fillQuestion": "파일에서 한 줄씩 문자열을 읽어올 때 사용하는 함수는 _____()이다.",
    "correctAnswerText": "ZmdldHM=",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "js_q1",
    "title": "JS 변수 문제 1. 이름 저장하기",
    "category": "변수",
    "difficulty": "basic",
    "type": "coding",
    "language": "js",
    "description": "변수 name에 \"김철수\"를 저장하고 출력하세요.",
    "constraints": [
      "변수 이름은 name으로 작성하세요.",
      "\"김철수\"를 저장하세요.",
      "console.log로 출력하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "김철수"
      }
    ],
    "initialCode": "// 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "6rmA7LKg7IiY"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "js_q2",
    "title": "JS 연산자 문제 1. 두 수 더하기",
    "category": "연산자",
    "difficulty": "basic",
    "type": "coding",
    "language": "js",
    "description": "변수 a(7)와 b(5)를 더한 결과를 출력하세요.",
    "constraints": [
      "변수 이름은 a, b로 작성하세요.",
      "a + b의 결과를 출력하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "12"
      }
    ],
    "initialCode": "// 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "MTI="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "js_q3",
    "title": "JS 문자열 문제 1. 문자열 반복하기",
    "category": "문자열",
    "difficulty": "basic",
    "type": "coding",
    "language": "js",
    "description": "\"파이팅! \"을 3번 반복하여 출력하세요. (repeat 메서드 사용)",
    "constraints": [
      "repeat() 메서드를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "파이팅! 파이팅! 파이팅! "
      }
    ],
    "initialCode": "// 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "7YyM7J207YyFISDtjIzsnbTtjIUhIO2MjOydtO2MhSEg"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "js_q4",
    "title": "JS 조건문 문제 1. 짝수/홀수 판별하기",
    "category": "조건문",
    "difficulty": "basic",
    "type": "coding",
    "language": "js",
    "description": "숫자 7이 짝수면 \"짝수\", 홀수면 \"홀수\"를 출력하세요.",
    "constraints": [
      "삼항 연산자 또는 if문을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "홀수"
      }
    ],
    "initialCode": "const number = 7;\n// 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "7ZmA7IiY"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "js_q5",
    "title": "JS 배열 문제 1. 배열 길이 구하기",
    "category": "배열",
    "difficulty": "basic",
    "type": "coding",
    "language": "js",
    "description": "배열 [\"사과\", \"바나나\", \"포도\"]의 길이를 출력하세요.",
    "constraints": [
      "length 속성을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "3"
      }
    ],
    "initialCode": "const fruits = [\"사과\", \"바나나\", \"포도\"];\n// 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "Mw=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "js_q6",
    "title": "JS 배열 문제 2. 마지막 요소 가져오기",
    "category": "배열",
    "difficulty": "basic",
    "type": "coding",
    "language": "js",
    "description": "배열 [10, 20, 30, 40]의 마지막 요소를 출력하세요. (음수 인덱스는 지원되지 않습니다)",
    "constraints": [
      "numbers[numbers.length - 1] 형태를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "40"
      }
    ],
    "initialCode": "const numbers = [10, 20, 30, 40];\n// 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "NDA="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "js_q7",
    "title": "JS 문자열 문제 2. 템플릿 리터럴로 문장 만들기",
    "category": "문자열",
    "difficulty": "basic",
    "type": "coding",
    "language": "js",
    "description": "템플릿 리터럴을 사용해 \"찬희님의 점수는 95점입니다.\"를 출력하세요.",
    "constraints": [
      "name=\"찬희\", score=95 변수를 사용하세요.",
      "백틱(``)과 ${}를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "찬희님의 점수는 95점입니다."
      }
    ],
    "initialCode": "const name = \"찬희\";\nconst score = 95;\n// 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "7LCs7Z2s64uY7J2YIOygkOyImOuKlCA5NeygkOyeheuLiOuLpC4="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "js_q8",
    "title": "JS 문자열 문제 3. 대문자로 변환하기",
    "category": "문자열",
    "difficulty": "basic",
    "type": "coding",
    "language": "js",
    "description": "\"hello world\"를 모두 대문자로 변환하여 출력하세요.",
    "constraints": [
      "toUpperCase() 메서드를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "HELLO WORLD"
      }
    ],
    "initialCode": "const text = \"hello world\";\n// 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "SEVMTE8gV09STEQ="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "js_q9",
    "title": "JS 문자열 문제 4. 문자열 합치기",
    "category": "문자열",
    "difficulty": "basic",
    "type": "coding",
    "language": "js",
    "description": "\"Hello\"와 \"World\"를 공백으로 이어서 \"Hello World\"를 출력하세요.",
    "constraints": [
      "템플릿 리터럴을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "Hello World"
      }
    ],
    "initialCode": "const first = \"Hello\";\nconst second = \"World\";\n// 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "SGVsbG8gV29ybGQ="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "js_q10",
    "title": "JS 조건문 문제 2. 성인 여부 판단하기",
    "category": "조건문",
    "difficulty": "basic",
    "type": "coding",
    "language": "js",
    "description": "나이(15)가 18 이상이면 \"성인\", 아니면 \"미성년자\"를 출력하세요.",
    "constraints": [
      "삼항 연산자 또는 if문을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "미성년자"
      }
    ],
    "initialCode": "const age = 15;\n// 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "66+47ISx64WE7J6Q"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "js_q11",
    "title": "JS 반복문 문제 1. 1부터 10까지 합 구하기",
    "category": "반복문",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "js",
    "description": "for문을 사용해 1부터 10까지의 합을 구해 출력하세요.",
    "constraints": [
      "for문을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "55"
      }
    ],
    "initialCode": "let total = 0;\n// 코드를 작성하세요\nconsole.log(total);\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "NTU="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "js_q12",
    "title": "JS 배열 고차함수 문제 1. map으로 제곱 배열 만들기",
    "category": "배열 고차함수",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "js",
    "description": "배열 [1,2,3,4,5]의 각 요소를 제곱한 뒤, \", \"로 이어서 출력하세요. (예: \"1, 4, 9, 16, 25\")",
    "constraints": [
      "map()과 join(\", \")을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "1, 4, 9, 16, 25"
      }
    ],
    "initialCode": "const numbers = [1, 2, 3, 4, 5];\n// 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "MSwgNCwgOSwgMTYsIDI1"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "js_q13",
    "title": "JS 배열 고차함수 문제 2. filter로 짝수만 걸러내기",
    "category": "배열 고차함수",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "js",
    "description": "배열 [1~10]에서 짝수만 걸러내어 \", \"로 이어서 출력하세요.",
    "constraints": [
      "filter()와 join(\", \")을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "2, 4, 6, 8, 10"
      }
    ],
    "initialCode": "const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\n// 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "MiwgNCwgNiwgOCwgMTA="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "js_q14",
    "title": "JS 배열 고차함수 문제 3. reduce로 합계 구하기",
    "category": "배열 고차함수",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "js",
    "description": "배열 [10,20,30,40,50]의 합계를 reduce()로 구해 출력하세요.",
    "constraints": [
      "reduce()를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "150"
      }
    ],
    "initialCode": "const numbers = [10, 20, 30, 40, 50];\n// 코드를 작성하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "MTUw"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "js_q15",
    "title": "JS 함수 문제 1. 최댓값 구하는 함수",
    "category": "함수",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "js",
    "description": "배열을 받아 최댓값을 반환하는 함수 getMax를 작성하고, [3,7,2,9,4]로 호출한 결과를 출력하세요.",
    "constraints": [
      "함수 이름은 getMax로 작성하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "9"
      }
    ],
    "initialCode": "function getMax(numbers) {\n  // 코드를 작성하세요\n}\n\nconsole.log(getMax([3, 7, 2, 9, 4]));\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "OQ=="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "js_q16",
    "title": "JS 예외 처리 문제 1. try/catch로 에러 처리하기",
    "category": "예외 처리",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "js",
    "description": "divide(10, 0)을 호출했을 때 0으로 나누면 \"0으로 나눌 수 없습니다.\"라는 에러를 던지고, try/catch로 잡아서 에러 메시지를 출력하세요.",
    "constraints": [
      "throw new Error(\"0으로 나눌 수 없습니다.\")를 사용하세요.",
      "try/catch로 감싸고 error.message를 출력하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "0으로 나눌 수 없습니다."
      }
    ],
    "initialCode": "function divide(a, b) {\n  // b가 0이면 에러를 던지세요\n  return a / b;\n}\n\n// try/catch로 divide(10, 0)을 호출하고 에러 메시지를 출력하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "MOycvOuhnCDrgpjriIwg7IiYIOyXhuyKteuLiOuLpC4="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "js_q17",
    "title": "JS 클래스 문제 1. 계좌 클래스 만들기",
    "category": "클래스",
    "difficulty": "advanced",
    "type": "coding",
    "language": "js",
    "description": "Account 클래스를 만들어 owner, balance를 저장하고, deposit(입금)/withdraw(출금) 메서드를 구현하세요. \"찬희\" 계정을 10000으로 시작해 5000을 입금하고 3000을 출금한 후 잔액을 출력하세요.",
    "constraints": [
      "클래스 이름은 Account로 작성하세요.",
      "deposit(amount), withdraw(amount) 메서드를 구현하세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "12000"
      }
    ],
    "initialCode": "class Account {\n  constructor(owner, balance) {\n    this.owner = owner;\n    this.balance = balance;\n  }\n  // deposit, withdraw 메서드를 작성하세요\n}\n\nconst acc = new Account(\"찬희\", 10000);\nacc.deposit(5000);\nacc.withdraw(3000);\nconsole.log(acc.balance);\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "MTIwMDA="
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "js_q18",
    "title": "JS 비동기 문제 1. async/await로 대기 후 출력하기",
    "category": "비동기",
    "difficulty": "advanced",
    "type": "coding",
    "language": "js",
    "description": "주어진 wait 함수로 100ms를 기다린 뒤 \"완료\"를 출력하세요.",
    "constraints": [
      "await를 사용해 wait(100)이 끝날 때까지 기다리세요."
    ],
    "examples": [
      {
        "input": "코드 실행",
        "output": "완료"
      }
    ],
    "initialCode": "function wait(ms) {\n  return new Promise((resolve) => setTimeout(resolve, ms));\n}\n\n// await로 100ms를 기다린 후 \"완료\"를 출력하세요\n",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "7JmE66OM"
      }
    ],
    "testRunnerCode": "stdout_match"
  },
  {
    "id": "js_quiz_1",
    "title": "JS 퀴즈 1. 변수",
    "category": "변수",
    "difficulty": "basic",
    "type": "quiz",
    "language": "js",
    "description": "자바스크립트에서 재할당이 불가능한 변수를 선언하는 키워드는?",
    "constraints": [
      "보기 중 정답 하나를 선택하세요."
    ],
    "examples": [
      {
        "input": "보기 중 선택",
        "output": "선택 즉시 정답/오답 확인"
      }
    ],
    "quizQuestion": "자바스크립트에서 재할당이 불가능한 변수를 선언하는 키워드는?",
    "quizOptions": ["let","const","var","static"],
    "correctAnswerIndex": "MQ=="
  },
  {
    "id": "js_quiz_2",
    "title": "JS 퀴즈 2. 비교 연산자",
    "category": "연산자",
    "difficulty": "basic",
    "type": "quiz",
    "language": "js",
    "description": "자료형까지 정확히 같아야 true가 되는 비교 연산자는?",
    "constraints": [
      "보기 중 정답 하나를 선택하세요."
    ],
    "examples": [
      {
        "input": "보기 중 선택",
        "output": "선택 즉시 정답/오답 확인"
      }
    ],
    "quizQuestion": "자료형까지 정확히 같아야 true가 되는 비교 연산자는?",
    "quizOptions": ["==","=","===","!="],
    "correctAnswerIndex": "Mg=="
  },
  {
    "id": "js_quiz_3",
    "title": "JS 퀴즈 3. typeof",
    "category": "자료형",
    "difficulty": "basic",
    "type": "quiz",
    "language": "js",
    "description": "typeof \"안녕\"의 결과는?",
    "constraints": [
      "보기 중 정답 하나를 선택하세요."
    ],
    "examples": [
      {
        "input": "보기 중 선택",
        "output": "선택 즉시 정답/오답 확인"
      }
    ],
    "quizQuestion": "typeof \"안녕\"의 결과는?",
    "quizOptions": ["\"str\"","\"text\"","\"object\"","\"string\""],
    "correctAnswerIndex": "Mw=="
  },
  {
    "id": "js_quiz_4",
    "title": "JS 퀴즈 4. 배열 메서드",
    "category": "배열",
    "difficulty": "basic",
    "type": "quiz",
    "language": "js",
    "description": "배열의 맨 뒤에 값을 추가하는 메서드는?",
    "constraints": [
      "보기 중 정답 하나를 선택하세요."
    ],
    "examples": [
      {
        "input": "보기 중 선택",
        "output": "선택 즉시 정답/오답 확인"
      }
    ],
    "quizQuestion": "배열의 맨 뒤에 값을 추가하는 메서드는?",
    "quizOptions": ["push()","pop()","shift()","unshift()"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "js_quiz_5",
    "title": "JS 퀴즈 5. 삼항 연산자",
    "category": "연산자",
    "difficulty": "intermediate",
    "type": "quiz",
    "language": "js",
    "description": "자바스크립트 삼항 연산자의 올바른 형태는?",
    "constraints": [
      "보기 중 정답 하나를 선택하세요."
    ],
    "examples": [
      {
        "input": "보기 중 선택",
        "output": "선택 즉시 정답/오답 확인"
      }
    ],
    "quizQuestion": "자바스크립트 삼항 연산자의 올바른 형태는?",
    "quizOptions": ["값1 if 조건 else 값2","조건 ? 값1 : 값2","조건 ? 값1 , 값2","if 조건 then 값1 else 값2"],
    "correctAnswerIndex": "MQ=="
  },
  {
    "id": "js_quiz_6",
    "title": "JS 퀴즈 6. falsy 값",
    "category": "조건문",
    "difficulty": "intermediate",
    "type": "quiz",
    "language": "js",
    "description": "다음 중 falsy(거짓 취급) 값이 아닌 것은?",
    "constraints": [
      "보기 중 정답 하나를 선택하세요."
    ],
    "examples": [
      {
        "input": "보기 중 선택",
        "output": "선택 즉시 정답/오답 확인"
      }
    ],
    "quizQuestion": "다음 중 falsy(거짓 취급) 값이 아닌 것은?",
    "quizOptions": ["0","\"\"","\"0\" (문자열)","null"],
    "correctAnswerIndex": "Mg=="
  },
  {
    "id": "js_quiz_7",
    "title": "JS 퀴즈 7. JSON",
    "category": "문자열",
    "difficulty": "intermediate",
    "type": "quiz",
    "language": "js",
    "description": "객체를 JSON 문자열로 변환하는 메서드는?",
    "constraints": [
      "보기 중 정답 하나를 선택하세요."
    ],
    "examples": [
      {
        "input": "보기 중 선택",
        "output": "선택 즉시 정답/오답 확인"
      }
    ],
    "quizQuestion": "객체를 JSON 문자열로 변환하는 메서드는?",
    "quizOptions": ["JSON.parse()","JSON.toText()","Object.toString()","JSON.stringify()"],
    "correctAnswerIndex": "Mw=="
  },
  {
    "id": "js_quiz_8",
    "title": "JS 퀴즈 8. 배열 고차함수",
    "category": "배열 고차함수",
    "difficulty": "intermediate",
    "type": "quiz",
    "language": "js",
    "description": "배열의 모든 요소를 순서대로 계산해 하나의 값으로 합칠 때 사용하는 메서드는?",
    "constraints": [
      "보기 중 정답 하나를 선택하세요."
    ],
    "examples": [
      {
        "input": "보기 중 선택",
        "output": "선택 즉시 정답/오답 확인"
      }
    ],
    "quizQuestion": "배열의 모든 요소를 순서대로 계산해 하나의 값으로 합칠 때 사용하는 메서드는?",
    "quizOptions": ["reduce()","map()","filter()","find()"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "js_fill_1",
    "title": "JS 빈칸 채우기 1. 함수 선언",
    "category": "함수",
    "difficulty": "basic",
    "type": "fill",
    "language": "js",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": [
      "대소문자를 정확히 입력하세요."
    ],
    "examples": [
      {
        "input": "빈칸 입력",
        "output": "입력 즉시 정답/오답 확인"
      }
    ],
    "fillQuestion": "자바스크립트에서 함수를 선언할 때 사용하는 키워드는 _____이다. (예: _____ add(a, b) {...})",
    "correctAnswerText": "ZnVuY3Rpb24=",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "js_fill_2",
    "title": "JS 빈칸 채우기 2. 클래스 생성자",
    "category": "클래스",
    "difficulty": "basic",
    "type": "fill",
    "language": "js",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": [
      "대소문자를 정확히 입력하세요."
    ],
    "examples": [
      {
        "input": "빈칸 입력",
        "output": "입력 즉시 정답/오답 확인"
      }
    ],
    "fillQuestion": "클래스에서 객체가 생성될 때 자동으로 실행되는 특별한 메서드의 이름은 _____이다.",
    "correctAnswerText": "Y29uc3RydWN0b3I=",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "js_fill_3",
    "title": "JS 빈칸 채우기 3. 배열 메서드",
    "category": "배열",
    "difficulty": "basic",
    "type": "fill",
    "language": "js",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": [
      "대소문자를 정확히 입력하세요."
    ],
    "examples": [
      {
        "input": "빈칸 입력",
        "output": "입력 즉시 정답/오답 확인"
      }
    ],
    "fillQuestion": "배열의 맨 뒤에 값을 추가하는 메서드 이름은 _____이다. (예: arr._____(4))",
    "correctAnswerText": "cHVzaA==",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "js_fill_4",
    "title": "JS 빈칸 채우기 4. 비동기 함수",
    "category": "비동기",
    "difficulty": "intermediate",
    "type": "fill",
    "language": "js",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": [
      "대소문자를 정확히 입력하세요."
    ],
    "examples": [
      {
        "input": "빈칸 입력",
        "output": "입력 즉시 정답/오답 확인"
      }
    ],
    "fillQuestion": "함수 안에서 await를 사용하려면 함수 선언 앞에 _____ 키워드를 붙여야 한다.",
    "correctAnswerText": "YXN5bmM=",
    "placeholderText": "정답 입력..."
  },

  {
  "id": "algo_array_two_sum",
  "title": "알고리즘 1. Two Sum (두 수의 합)",
  "category": "배열",
  "difficulty": "basic",
  "type": "coding",
  "language": "algorithm",
  "description": "정수 리스트 nums와 목표값 target이 주어질 때, 두 수를 더해 target이 되는 두 원소의 인덱스를 리스트로 반환하는 solution 함수를 작성하세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(nums, target)`으로 작성하세요.",
    "정답은 항상 하나만 존재한다고 가정합니다.",
    "같은 원소를 두 번 사용할 수 없습니다."
  ],
  "examples": [
    {
      "input": "solution([2, 7, 11, 15], 9)",
      "output": "[0, 1]"
    }
  ],
  "initialCode": "def solution(nums, target):\n    # nums 리스트 안에서 두 수를 더해 target이 되는 두 인덱스를 리스트로 반환하세요.\n    pass\n",
  "testCases": [
    {
      "input": "solution([2, 7, 11, 15], 9)",
      "expected": "WzAsIDFd"
    },
    {
      "input": "solution([3, 2, 4], 6)",
      "expected": "WzEsIDJd"
    },
    {
      "input": "solution([3, 3], 6)",
      "expected": "WzAsIDFd"
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_array_max",
  "title": "알고리즘 2. 배열 최댓값",
  "category": "배열",
  "difficulty": "basic",
  "type": "coding",
  "language": "algorithm",
  "description": "정수 리스트 nums에서 가장 큰 값을 반환하는 solution 함수를 작성하세요. 내장 함수 max()는 사용하지 마세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(nums)`으로 작성하세요.",
    "nums는 최소 1개 이상의 원소를 가집니다.",
    "내장 함수 max()를 사용하지 마세요."
  ],
  "examples": [
    {
      "input": "solution([3, 7, 2, 9, 4])",
      "output": "9"
    }
  ],
  "initialCode": "def solution(nums):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([3, 7, 2, 9, 4])",
      "expected": "OQ=="
    },
    {
      "input": "solution([-5, -1, -10])",
      "expected": "LTE="
    },
    {
      "input": "solution([42])",
      "expected": "NDI="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_array_second_max",
  "title": "알고리즘 3. 두 번째로 큰 수",
  "category": "배열",
  "difficulty": "intermediate",
  "type": "coding",
  "language": "algorithm",
  "description": "정수 리스트 nums에서 두 번째로 큰 값을 반환하는 solution 함수를 작성하세요. (중복 값이 있으면 서로 다른 값 기준으로 두 번째)",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(nums)`으로 작성하세요.",
    "nums는 서로 다른 값이 최소 2개 이상 존재합니다."
  ],
  "examples": [
    {
      "input": "solution([3, 7, 2, 9, 4])",
      "output": "7"
    }
  ],
  "initialCode": "def solution(nums):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([3, 7, 2, 9, 4])",
      "expected": "Nw=="
    },
    {
      "input": "solution([5, 5, 4])",
      "expected": "NA=="
    },
    {
      "input": "solution([10, 20])",
      "expected": "MTA="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_string_reverse",
  "title": "알고리즘 4. 문자열 뒤집기",
  "category": "문자열",
  "difficulty": "basic",
  "type": "coding",
  "language": "algorithm",
  "description": "문자열 s를 뒤집어서 반환하는 solution 함수를 작성하세요. 슬라이싱을 사용하지 말고 반복문으로 구현하세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(s)`으로 작성하세요.",
    "슬라이싱(`[::-1]`)을 사용하지 마세요."
  ],
  "examples": [
    {
      "input": "solution('hello')",
      "output": "olleh"
    }
  ],
  "initialCode": "def solution(s):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution('hello')",
      "expected": "b2xsZWg="
    },
    {
      "input": "solution('python')",
      "expected": "bm9odHlw"
    },
    {
      "input": "solution('a')",
      "expected": "YQ=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_string_palindrome",
  "title": "알고리즘 5. 팰린드롬 판별",
  "category": "문자열",
  "difficulty": "basic",
  "type": "coding",
  "language": "algorithm",
  "description": "문자열 s가 앞으로 읽으나 뒤로 읽으나 같은 팰린드롬인지 판별하는 solution 함수를 작성하세요. True/False를 반환합니다.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(s)`으로 작성하세요.",
    "대소문자를 구분합니다."
  ],
  "examples": [
    {
      "input": "solution('level')",
      "output": "True"
    }
  ],
  "initialCode": "def solution(s):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution('level')",
      "expected": "VHJ1ZQ=="
    },
    {
      "input": "solution('hello')",
      "expected": "RmFsc2U="
    },
    {
      "input": "solution('a')",
      "expected": "VHJ1ZQ=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_string_anagram",
  "title": "알고리즘 6. 애너그램 판별",
  "category": "문자열",
  "difficulty": "intermediate",
  "type": "coding",
  "language": "algorithm",
  "description": "두 문자열 a, b가 서로 애너그램(같은 글자를 재배열해서 만들 수 있는 관계)인지 판별하는 solution 함수를 작성하세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(a, b)`으로 작성하세요.",
    "공백은 무시하지 않습니다."
  ],
  "examples": [
    {
      "input": "solution('listen', 'silent')",
      "output": "True"
    }
  ],
  "initialCode": "def solution(a, b):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution('listen', 'silent')",
      "expected": "VHJ1ZQ=="
    },
    {
      "input": "solution('hello', 'world')",
      "expected": "RmFsc2U="
    },
    {
      "input": "solution('abc', 'cab')",
      "expected": "VHJ1ZQ=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_array_remove_dup",
  "title": "알고리즘 7. 중복 제거하고 정렬",
  "category": "배열",
  "difficulty": "basic",
  "type": "coding",
  "language": "algorithm",
  "description": "정수 리스트 nums에서 중복을 제거하고 오름차순으로 정렬한 리스트를 반환하는 solution 함수를 작성하세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(nums)`으로 작성하세요."
  ],
  "examples": [
    {
      "input": "solution([4, 2, 4, 1, 2, 3])",
      "output": "[1, 2, 3, 4]"
    }
  ],
  "initialCode": "def solution(nums):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([4, 2, 4, 1, 2, 3])",
      "expected": "WzEsIDIsIDMsIDRd"
    },
    {
      "input": "solution([5, 5, 5])",
      "expected": "WzVd"
    },
    {
      "input": "solution([])",
      "expected": "W10="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_array_rotate",
  "title": "알고리즘 8. 배열 회전",
  "category": "배열",
  "difficulty": "intermediate",
  "type": "coding",
  "language": "algorithm",
  "description": "정수 리스트 nums를 오른쪽으로 k칸 회전시킨 리스트를 반환하는 solution 함수를 작성하세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(nums, k)`으로 작성하세요.",
    "k는 nums의 길이보다 작거나 같습니다."
  ],
  "examples": [
    {
      "input": "solution([1, 2, 3, 4, 5], 2)",
      "output": "[4, 5, 1, 2, 3]"
    }
  ],
  "initialCode": "def solution(nums, k):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([1, 2, 3, 4, 5], 2)",
      "expected": "WzQsIDUsIDEsIDIsIDNd"
    },
    {
      "input": "solution([1, 2, 3], 0)",
      "expected": "WzEsIDIsIDNd"
    },
    {
      "input": "solution([1, 2], 3)",
      "expected": "WzIsIDFd"
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_string_count_vowels",
  "title": "알고리즘 9. 모음 개수 세기",
  "category": "문자열",
  "difficulty": "basic",
  "type": "coding",
  "language": "algorithm",
  "description": "문자열 s에 포함된 모음(a, e, i, o, u, 대소문자 무관)의 개수를 반환하는 solution 함수를 작성하세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(s)`으로 작성하세요."
  ],
  "examples": [
    {
      "input": "solution('Hello World')",
      "output": "3"
    }
  ],
  "initialCode": "def solution(s):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution('Hello World')",
      "expected": "Mw=="
    },
    {
      "input": "solution('PYTHON')",
      "expected": "MQ=="
    },
    {
      "input": "solution('bcdfg')",
      "expected": "MA=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_array_flatten_sum",
  "title": "알고리즘 10. 중첩 리스트 합",
  "category": "배열",
  "difficulty": "intermediate",
  "type": "coding",
  "language": "algorithm",
  "description": "2차원 리스트 matrix의 모든 원소의 합을 반환하는 solution 함수를 작성하세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(matrix)`으로 작성하세요."
  ],
  "examples": [
    {
      "input": "solution([[1, 2], [3, 4], [5]])",
      "output": "15"
    }
  ],
  "initialCode": "def solution(matrix):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([[1, 2], [3, 4], [5]])",
      "expected": "MTU="
    },
    {
      "input": "solution([[10]])",
      "expected": "MTA="
    },
    {
      "input": "solution([[1, 1], [1, 1]])",
      "expected": "NA=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_string_most_frequent",
  "title": "알고리즘 11. 가장 많이 등장한 문자",
  "category": "문자열",
  "difficulty": "intermediate",
  "type": "coding",
  "language": "algorithm",
  "description": "문자열 s에서 가장 많이 등장한 문자를 반환하는 solution 함수를 작성하세요. (동점이면 알파벳 순으로 먼저 오는 문자)",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(s)`으로 작성하세요.",
    "공백은 제외하고 셉니다."
  ],
  "examples": [
    {
      "input": "solution('banana')",
      "output": "a"
    }
  ],
  "initialCode": "def solution(s):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution('banana')",
      "expected": "YQ=="
    },
    {
      "input": "solution('aabbcc')",
      "expected": "YQ=="
    },
    {
      "input": "solution('x')",
      "expected": "eA=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_sort_bubble",
  "title": "알고리즘 12. 버블 정렬 구현",
  "category": "정렬",
  "difficulty": "intermediate",
  "type": "coding",
  "language": "algorithm",
  "description": "정수 리스트 nums를 버블 정렬 알고리즘으로 직접 구현하여 오름차순 정렬한 리스트를 반환하는 solution 함수를 작성하세요. 내장 함수 sorted()/sort()는 사용하지 마세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(nums)`으로 작성하세요.",
    "sorted()나 .sort()를 사용하지 마세요."
  ],
  "examples": [
    {
      "input": "solution([5, 2, 4, 1, 3])",
      "output": "[1, 2, 3, 4, 5]"
    }
  ],
  "initialCode": "def solution(nums):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([5, 2, 4, 1, 3])",
      "expected": "WzEsIDIsIDMsIDQsIDVd"
    },
    {
      "input": "solution([1])",
      "expected": "WzFd"
    },
    {
      "input": "solution([3, 3, 2])",
      "expected": "WzIsIDMsIDNd"
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_sort_by_length",
  "title": "알고리즘 13. 길이순 정렬",
  "category": "정렬",
  "difficulty": "basic",
  "type": "coding",
  "language": "algorithm",
  "description": "문자열 리스트 words를 글자 길이가 짧은 순서대로 정렬한 리스트를 반환하는 solution 함수를 작성하세요. (길이가 같으면 원래 순서 유지)",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(words)`으로 작성하세요."
  ],
  "examples": [
    {
      "input": "solution(['apple', 'kiwi', 'fig', 'banana'])",
      "output": "['fig', 'kiwi', 'apple', 'banana']"
    }
  ],
  "initialCode": "def solution(words):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution(['apple', 'kiwi', 'fig', 'banana'])",
      "expected": "WydmaWcnLCAna2l3aScsICdhcHBsZScsICdiYW5hbmEnXQ=="
    },
    {
      "input": "solution(['a', 'bb', 'c'])",
      "expected": "WydhJywgJ2MnLCAnYmInXQ=="
    },
    {
      "input": "solution([])",
      "expected": "W10="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_sort_merge_two",
  "title": "알고리즘 14. 정렬된 두 리스트 합치기",
  "category": "정렬",
  "difficulty": "intermediate",
  "type": "coding",
  "language": "algorithm",
  "description": "이미 오름차순 정렬된 두 리스트 a, b를 합쳐서 하나의 오름차순 정렬된 리스트로 반환하는 solution 함수를 작성하세요. sorted()는 사용하지 마세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(a, b)`으로 작성하세요.",
    "sorted()를 사용하지 마세요."
  ],
  "examples": [
    {
      "input": "solution([1, 3, 5], [2, 4, 6])",
      "output": "[1, 2, 3, 4, 5, 6]"
    }
  ],
  "initialCode": "def solution(a, b):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([1, 3, 5], [2, 4, 6])",
      "expected": "WzEsIDIsIDMsIDQsIDUsIDZd"
    },
    {
      "input": "solution([], [1, 2])",
      "expected": "WzEsIDJd"
    },
    {
      "input": "solution([1, 1], [1, 1])",
      "expected": "WzEsIDEsIDEsIDFd"
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_sort_kth_largest",
  "title": "알고리즘 15. K번째로 큰 수",
  "category": "정렬",
  "difficulty": "intermediate",
  "type": "coding",
  "language": "algorithm",
  "description": "정수 리스트 nums에서 k번째로 큰 값을 반환하는 solution 함수를 작성하세요. (1번째가 가장 큰 값)",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(nums, k)`으로 작성하세요.",
    "k는 nums의 길이 이하입니다."
  ],
  "examples": [
    {
      "input": "solution([3, 1, 5, 4, 2], 2)",
      "output": "4"
    }
  ],
  "initialCode": "def solution(nums, k):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([3, 1, 5, 4, 2], 2)",
      "expected": "NA=="
    },
    {
      "input": "solution([1], 1)",
      "expected": "MQ=="
    },
    {
      "input": "solution([7, 7, 7], 3)",
      "expected": "Nw=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_sort_custom_dict",
  "title": "알고리즘 16. 점수 기준 정렬",
  "category": "정렬",
  "difficulty": "intermediate",
  "type": "coding",
  "language": "algorithm",
  "description": "(이름, 점수) 튜플 리스트 students를 점수가 높은 순서로 정렬한 이름 리스트를 반환하는 solution 함수를 작성하세요. 점수가 같으면 이름 오름차순입니다.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(students)`으로 작성하세요."
  ],
  "examples": [
    {
      "input": "solution([('철수', 80), ('영희', 95), ('민수', 80)])",
      "output": "['영희', '민수', '철수']"
    }
  ],
  "initialCode": "def solution(students):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([('철수', 80), ('영희', 95), ('민수', 80)])",
      "expected": "WyfsmIHtnawnLCAn66+87IiYJywgJ+yyoOyImCdd"
    },
    {
      "input": "solution([('a', 1), ('b', 1)])",
      "expected": "WydhJywgJ2InXQ=="
    },
    {
      "input": "solution([('solo', 100)])",
      "expected": "Wydzb2xvJ10="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_binary_search",
  "title": "알고리즘 17. 이진 탐색",
  "category": "이분탐색",
  "difficulty": "intermediate",
  "type": "coding",
  "language": "algorithm",
  "description": "오름차순으로 정렬된 리스트 nums에서 target의 인덱스를 이진 탐색으로 찾아 반환하는 solution 함수를 작성하세요. 없으면 -1을 반환합니다.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(nums, target)`으로 작성하세요.",
    "반드시 이진 탐색(반씩 좁혀가는 방식)으로 구현하세요."
  ],
  "examples": [
    {
      "input": "solution([1, 3, 5, 7, 9, 11], 7)",
      "output": "3"
    }
  ],
  "initialCode": "def solution(nums, target):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([1, 3, 5, 7, 9, 11], 7)",
      "expected": "Mw=="
    },
    {
      "input": "solution([1, 3, 5, 7, 9, 11], 4)",
      "expected": "LTE="
    },
    {
      "input": "solution([2, 4, 6], 2)",
      "expected": "MA=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_binary_search_insert",
  "title": "알고리즘 18. 삽입 위치 찾기",
  "category": "이분탐색",
  "difficulty": "intermediate",
  "type": "coding",
  "language": "algorithm",
  "description": "오름차순 정렬된 리스트 nums에 target을 삽입했을 때 정렬 상태를 유지하는 인덱스를 반환하는 solution 함수를 작성하세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(nums, target)`으로 작성하세요.",
    "이진 탐색으로 구현하세요."
  ],
  "examples": [
    {
      "input": "solution([1, 3, 5, 6], 5)",
      "output": "2"
    }
  ],
  "initialCode": "def solution(nums, target):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([1, 3, 5, 6], 5)",
      "expected": "Mg=="
    },
    {
      "input": "solution([1, 3, 5, 6], 2)",
      "expected": "MQ=="
    },
    {
      "input": "solution([1, 3, 5, 6], 7)",
      "expected": "NA=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_binary_search_sqrt",
  "title": "알고리즘 19. 정수 제곱근",
  "category": "이분탐색",
  "difficulty": "intermediate",
  "type": "coding",
  "language": "algorithm",
  "description": "음이 아닌 정수 n의 제곱근을 내림한 정수를 이진 탐색으로 구하는 solution 함수를 작성하세요. (예: 8의 제곱근은 약 2.83이므로 2를 반환)",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(n)`으로 작성하세요.",
    "`n ** 0.5`나 `math.sqrt`를 사용하지 말고 이진 탐색으로 구현하세요."
  ],
  "examples": [
    {
      "input": "solution(8)",
      "output": "2"
    }
  ],
  "initialCode": "def solution(n):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution(8)",
      "expected": "Mg=="
    },
    {
      "input": "solution(16)",
      "expected": "NA=="
    },
    {
      "input": "solution(1)",
      "expected": "MQ=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_binary_search_first_occurrence",
  "title": "알고리즘 20. 첫 등장 위치 찾기",
  "category": "이분탐색",
  "difficulty": "advanced",
  "type": "coding",
  "language": "algorithm",
  "description": "오름차순 정렬된 리스트 nums에서 target이 처음 등장하는 인덱스를 이진 탐색으로 찾는 solution 함수를 작성하세요. 없으면 -1을 반환합니다.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(nums, target)`으로 작성하세요.",
    "중복된 값이 있을 수 있습니다."
  ],
  "examples": [
    {
      "input": "solution([1, 2, 2, 2, 3], 2)",
      "output": "1"
    }
  ],
  "initialCode": "def solution(nums, target):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([1, 2, 2, 2, 3], 2)",
      "expected": "MQ=="
    },
    {
      "input": "solution([1, 2, 3], 5)",
      "expected": "LTE="
    },
    {
      "input": "solution([1, 1, 1], 1)",
      "expected": "MA=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_binary_search_peak",
  "title": "알고리즘 21. 봉우리 원소 찾기",
  "category": "이분탐색",
  "difficulty": "advanced",
  "type": "coding",
  "language": "algorithm",
  "description": "리스트 nums에서 양옆 원소보다 큰 봉우리(peak) 원소의 인덱스 하나를 이진 탐색으로 찾는 solution 함수를 작성하세요. (양 끝은 바깥쪽이 -무한대라고 가정)",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(nums)`으로 작성하세요.",
    "항상 봉우리가 하나 이상 존재합니다."
  ],
  "examples": [
    {
      "input": "solution([1, 2, 3, 1])",
      "output": "2"
    }
  ],
  "initialCode": "def solution(nums):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([1, 2, 3, 1])",
      "expected": "Mg=="
    },
    {
      "input": "solution([1, 2, 1, 3, 5, 6, 4])",
      "expected": "NQ=="
    },
    {
      "input": "solution([5])",
      "expected": "MA=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_greedy_coin_change",
  "title": "알고리즘 22. 동전 개수 최소화",
  "category": "그리디",
  "difficulty": "basic",
  "type": "coding",
  "language": "algorithm",
  "description": "동전 종류 리스트 coins(내림차순 정렬됨)와 금액 amount가 주어질 때, 그리디하게 큰 동전부터 사용해서 amount를 만드는 데 필요한 최소 동전 개수를 반환하는 solution 함수를 작성하세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(coins, amount)`으로 작성하세요.",
    "coins는 내림차순 정렬되어 있고, 그리디하게 항상 정답이 나온다고 가정합니다 (예: [500, 100, 50, 10])."
  ],
  "examples": [
    {
      "input": "solution([500, 100, 50, 10], 1260)",
      "output": "6"
    }
  ],
  "initialCode": "def solution(coins, amount):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([500, 100, 50, 10], 1260)",
      "expected": "Ng=="
    },
    {
      "input": "solution([500, 100, 50, 10], 500)",
      "expected": "MQ=="
    },
    {
      "input": "solution([100, 10, 1], 234)",
      "expected": "OQ=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_greedy_activity_selection",
  "title": "알고리즘 23. 최대 회의실 사용",
  "category": "그리디",
  "difficulty": "intermediate",
  "type": "coding",
  "language": "algorithm",
  "description": "회의 시작/종료 시간 튜플 리스트 meetings가 주어질 때, 겹치지 않게 진행할 수 있는 최대 회의 개수를 반환하는 solution 함수를 작성하세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(meetings)`으로 작성하세요.",
    "meetings의 각 원소는 (시작시간, 종료시간) 튜플입니다."
  ],
  "examples": [
    {
      "input": "solution([(1, 3), (2, 4), (3, 5), (0, 6)])",
      "output": "2"
    }
  ],
  "initialCode": "def solution(meetings):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([(1, 3), (2, 4), (3, 5), (0, 6)])",
      "expected": "Mg=="
    },
    {
      "input": "solution([(1, 2), (2, 3), (3, 4)])",
      "expected": "Mw=="
    },
    {
      "input": "solution([(1, 10)])",
      "expected": "MQ=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_greedy_max_profit",
  "title": "알고리즘 24. 최대 이익 (주식)",
  "category": "그리디",
  "difficulty": "intermediate",
  "type": "coding",
  "language": "algorithm",
  "description": "일별 주가 리스트 prices가 주어질 때, 한 번만 사고팔아서 얻을 수 있는 최대 이익을 반환하는 solution 함수를 작성하세요. 이익이 없으면 0을 반환합니다.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(prices)`으로 작성하세요.",
    "매수는 매도보다 앞선 날짜여야 합니다."
  ],
  "examples": [
    {
      "input": "solution([7, 1, 5, 3, 6, 4])",
      "output": "5"
    }
  ],
  "initialCode": "def solution(prices):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([7, 1, 5, 3, 6, 4])",
      "expected": "NQ=="
    },
    {
      "input": "solution([7, 6, 4, 3, 1])",
      "expected": "MA=="
    },
    {
      "input": "solution([1, 2])",
      "expected": "MQ=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_greedy_jump_game",
  "title": "알고리즘 25. 점프 게임",
  "category": "그리디",
  "difficulty": "advanced",
  "type": "coding",
  "language": "algorithm",
  "description": "각 칸에서 최대로 뛸 수 있는 거리가 적힌 리스트 nums가 주어질 때, 0번 칸에서 시작해 마지막 칸까지 도달할 수 있는지 True/False로 반환하는 solution 함수를 작성하세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(nums)`으로 작성하세요."
  ],
  "examples": [
    {
      "input": "solution([2, 3, 1, 1, 4])",
      "output": "True"
    }
  ],
  "initialCode": "def solution(nums):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([2, 3, 1, 1, 4])",
      "expected": "VHJ1ZQ=="
    },
    {
      "input": "solution([3, 2, 1, 0, 4])",
      "expected": "RmFsc2U="
    },
    {
      "input": "solution([0])",
      "expected": "VHJ1ZQ=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_greedy_min_coins_change",
  "title": "알고리즘 26. 거스름돈 동전 목록",
  "category": "그리디",
  "difficulty": "basic",
  "type": "coding",
  "language": "algorithm",
  "description": "동전 종류 리스트 coins(내림차순)와 금액 amount가 주어질 때, 그리디하게 사용한 동전들을 큰 단위부터 나열한 리스트로 반환하는 solution 함수를 작성하세요. (사용하지 않은 동전은 제외)",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(coins, amount)`으로 작성하세요."
  ],
  "examples": [
    {
      "input": "solution([500, 100, 50, 10], 680)",
      "output": "[500, 100, 50, 10, 10, 10]"
    }
  ],
  "initialCode": "def solution(coins, amount):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([500, 100, 50, 10], 680)",
      "expected": "WzUwMCwgMTAwLCA1MCwgMTAsIDEwLCAxMF0="
    },
    {
      "input": "solution([500, 100, 50, 10], 50)",
      "expected": "WzUwXQ=="
    },
    {
      "input": "solution([100, 10], 0)",
      "expected": "W10="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_two_pointer_sum_sorted",
  "title": "알고리즘 27. 정렬된 배열의 두 수 합 (투 포인터)",
  "category": "투포인터",
  "difficulty": "intermediate",
  "type": "coding",
  "language": "algorithm",
  "description": "오름차순 정렬된 리스트 nums에서 두 수를 더해 target이 되는 두 인덱스를 투 포인터로 찾아 반환하는 solution 함수를 작성하세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(nums, target)`으로 작성하세요.",
    "양쪽 끝에서 좁혀오는 투 포인터 방식으로 구현하세요."
  ],
  "examples": [
    {
      "input": "solution([1, 2, 4, 6, 8], 10)",
      "output": "[1, 4]"
    }
  ],
  "initialCode": "def solution(nums, target):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([1, 2, 4, 6, 8], 10)",
      "expected": "WzEsIDRd"
    },
    {
      "input": "solution([1, 2, 3], 100)",
      "expected": "W10="
    },
    {
      "input": "solution([-3, 0, 3, 5], 2)",
      "expected": "WzAsIDNd"
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_two_pointer_remove_dup_sorted",
  "title": "알고리즘 28. 정렬된 배열 중복 제거 (투 포인터)",
  "category": "투포인터",
  "difficulty": "intermediate",
  "type": "coding",
  "language": "algorithm",
  "description": "오름차순 정렬된 리스트 nums에서 중복을 제거한 리스트를 순서를 유지한 채 반환하는 solution 함수를 작성하세요. set()은 사용하지 마세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(nums)`으로 작성하세요.",
    "set()을 사용하지 마세요."
  ],
  "examples": [
    {
      "input": "solution([1, 1, 2, 2, 2, 3])",
      "output": "[1, 2, 3]"
    }
  ],
  "initialCode": "def solution(nums):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([1, 1, 2, 2, 2, 3])",
      "expected": "WzEsIDIsIDNd"
    },
    {
      "input": "solution([5])",
      "expected": "WzVd"
    },
    {
      "input": "solution([1, 2, 3])",
      "expected": "WzEsIDIsIDNd"
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_sliding_window_max_sum",
  "title": "알고리즘 29. 슬라이딩 윈도우 최대합",
  "category": "슬라이딩윈도우",
  "difficulty": "intermediate",
  "type": "coding",
  "language": "algorithm",
  "description": "정수 리스트 nums와 윈도우 크기 k가 주어질 때, 연속된 k개 원소의 합 중 최댓값을 반환하는 solution 함수를 작성하세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(nums, k)`으로 작성하세요.",
    "k는 nums의 길이 이하입니다."
  ],
  "examples": [
    {
      "input": "solution([2, 1, 5, 1, 3, 2], 3)",
      "output": "9"
    }
  ],
  "initialCode": "def solution(nums, k):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([2, 1, 5, 1, 3, 2], 3)",
      "expected": "OQ=="
    },
    {
      "input": "solution([1, 1, 1, 1], 2)",
      "expected": "Mg=="
    },
    {
      "input": "solution([5], 1)",
      "expected": "NQ=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_sliding_window_longest_unique",
  "title": "알고리즘 30. 중복 없는 가장 긴 부분 문자열",
  "category": "슬라이딩윈도우",
  "difficulty": "advanced",
  "type": "coding",
  "language": "algorithm",
  "description": "문자열 s에서 같은 문자가 반복되지 않는 가장 긴 부분 문자열의 길이를 반환하는 solution 함수를 작성하세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(s)`으로 작성하세요."
  ],
  "examples": [
    {
      "input": "solution('abcabcbb')",
      "output": "3"
    }
  ],
  "initialCode": "def solution(s):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution('abcabcbb')",
      "expected": "Mw=="
    },
    {
      "input": "solution('bbbbb')",
      "expected": "MQ=="
    },
    {
      "input": "solution('pwwkew')",
      "expected": "Mw=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_two_pointer_container",
  "title": "알고리즘 31. 최대 물통 용량",
  "category": "투포인터",
  "difficulty": "advanced",
  "type": "coding",
  "language": "algorithm",
  "description": "각 지점의 벽 높이가 담긴 리스트 height가 주어질 때, 두 벽 사이에 담을 수 있는 최대 물의 양(높이 × 거리)을 반환하는 solution 함수를 작성하세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(height)`으로 작성하세요.",
    "투 포인터로 구현하세요."
  ],
  "examples": [
    {
      "input": "solution([1, 8, 6, 2, 5, 4, 8, 3, 7])",
      "output": "49"
    }
  ],
  "initialCode": "def solution(height):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([1, 8, 6, 2, 5, 4, 8, 3, 7])",
      "expected": "NDk="
    },
    {
      "input": "solution([1, 1])",
      "expected": "MQ=="
    },
    {
      "input": "solution([4, 3, 2, 1, 4])",
      "expected": "MTY="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_sliding_window_min_len",
  "title": "알고리즘 32. 합이 target 이상인 최소 길이 부분배열",
  "category": "슬라이딩윈도우",
  "difficulty": "advanced",
  "type": "coding",
  "language": "algorithm",
  "description": "양의 정수 리스트 nums와 목표값 target이 주어질 때, 합이 target 이상이 되는 가장 짧은 연속 부분 배열의 길이를 반환하는 solution 함수를 작성하세요. 없으면 0을 반환합니다.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(nums, target)`으로 작성하세요."
  ],
  "examples": [
    {
      "input": "solution([2, 3, 1, 2, 4, 3], 7)",
      "output": "2"
    }
  ],
  "initialCode": "def solution(nums, target):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([2, 3, 1, 2, 4, 3], 7)",
      "expected": "Mg=="
    },
    {
      "input": "solution([1, 1, 1, 1], 10)",
      "expected": "MA=="
    },
    {
      "input": "solution([10], 5)",
      "expected": "MQ=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_stack_valid_parens",
  "title": "알고리즘 33. 올바른 괄호 판별",
  "category": "스택",
  "difficulty": "intermediate",
  "type": "coding",
  "language": "algorithm",
  "description": "괄호 문자열 s가 짝이 올바르게 맞는지 스택을 이용해 판별하는 solution 함수를 작성하세요. (, ), {, }, [, ] 만 포함됩니다.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(s)`으로 작성하세요.",
    "리스트를 스택처럼 사용하세요 (append/pop)."
  ],
  "examples": [
    {
      "input": "solution('({[]})')",
      "output": "True"
    }
  ],
  "initialCode": "def solution(s):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution('({[]})')",
      "expected": "VHJ1ZQ=="
    },
    {
      "input": "solution('(]')",
      "expected": "RmFsc2U="
    },
    {
      "input": "solution('(()')",
      "expected": "RmFsc2U="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_stack_eval_rpn",
  "title": "알고리즘 34. 후위 표기식 계산",
  "category": "스택",
  "difficulty": "advanced",
  "type": "coding",
  "language": "algorithm",
  "description": "공백으로 구분된 후위 표기식(RPN) 문자열 expr을 스택으로 계산해 정수 결과를 반환하는 solution 함수를 작성하세요. 연산자는 +, -, *, / 이며 정수 나눗셈입니다.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(expr)`으로 작성하세요.",
    "나눗셈은 int()로 변환한 정수 나눗셈으로 처리하세요."
  ],
  "examples": [
    {
      "input": "solution('2 1 + 3 *')",
      "output": "9"
    }
  ],
  "initialCode": "def solution(expr):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution('2 1 + 3 *')",
      "expected": "OQ=="
    },
    {
      "input": "solution('4 13 5 / +')",
      "expected": "Ng=="
    },
    {
      "input": "solution('10 2 /')",
      "expected": "NQ=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_queue_via_stacks",
  "title": "알고리즘 35. 큐 시뮬레이션",
  "category": "큐",
  "difficulty": "intermediate",
  "type": "coding",
  "language": "algorithm",
  "description": "정수 리스트 nums를 큐(선입선출)에 순서대로 넣었다가 하나씩 뺄 때의 순서를 리스트로 반환하는 solution 함수를 작성하세요. (즉, nums를 그대로 반환하되 큐 자료구조로 직접 구현하세요)",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(nums)`으로 작성하세요.",
    "collections.deque를 사용해 큐를 구현하세요."
  ],
  "examples": [
    {
      "input": "solution([1, 2, 3])",
      "output": "[1, 2, 3]"
    }
  ],
  "initialCode": "from collections import deque\n\ndef solution(nums):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([1, 2, 3])",
      "expected": "WzEsIDIsIDNd"
    },
    {
      "input": "solution([])",
      "expected": "W10="
    },
    {
      "input": "solution([9])",
      "expected": "Wzld"
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_stack_daily_temperatures",
  "title": "알고리즘 36. 더 따뜻한 날까지 며칠",
  "category": "스택",
  "difficulty": "advanced",
  "type": "coding",
  "language": "algorithm",
  "description": "일별 기온 리스트 temps가 주어질 때, 각 날짜에서 자신보다 기온이 높은 날이 나올 때까지 며칠을 기다려야 하는지 리스트로 반환하는 solution 함수를 작성하세요. 없으면 0입니다.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(temps)`으로 작성하세요.",
    "스택(인덱스를 저장하는 리스트)을 사용해 구현하세요."
  ],
  "examples": [
    {
      "input": "solution([73, 74, 75, 71, 69, 72, 76, 73])",
      "output": "[1, 1, 4, 2, 1, 1, 0, 0]"
    }
  ],
  "initialCode": "def solution(temps):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([73, 74, 75, 71, 69, 72, 76, 73])",
      "expected": "WzEsIDEsIDQsIDIsIDEsIDEsIDAsIDBd"
    },
    {
      "input": "solution([30, 40, 50, 60])",
      "expected": "WzEsIDEsIDEsIDBd"
    },
    {
      "input": "solution([30, 60, 90])",
      "expected": "WzEsIDEsIDBd"
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_stack_min_stack_check",
  "title": "알고리즘 37. 스택 최솟값 추적",
  "category": "스택",
  "difficulty": "advanced",
  "type": "coding",
  "language": "algorithm",
  "description": "연산 리스트 ops가 주어질 때, 각 연산을 순서대로 처리하며 \"min\" 연산이 나올 때마다 그 시점 스택의 최솟값을 기록한 리스트를 반환하는 solution 함수를 작성하세요. 연산은 (\"push\", 값), (\"pop\",), (\"min\",) 형태입니다.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(ops)`으로 작성하세요."
  ],
  "examples": [
    {
      "input": "solution([('push', 3), ('push', 1), ('min',), ('pop',), ('min',)])",
      "output": "[1, 3]"
    }
  ],
  "initialCode": "def solution(ops):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([('push', 3), ('push', 1), ('min',), ('pop',), ('min',)])",
      "expected": "WzEsIDNd"
    },
    {
      "input": "solution([('push', 5), ('min',)])",
      "expected": "WzVd"
    },
    {
      "input": "solution([('push', 2), ('push', 2), ('pop',), ('min',)])",
      "expected": "WzJd"
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_hash_first_unique",
  "title": "알고리즘 38. 첫 번째 고유 문자",
  "category": "해시맵",
  "difficulty": "intermediate",
  "type": "coding",
  "language": "algorithm",
  "description": "문자열 s에서 딱 한 번만 등장하는 첫 번째 문자를 반환하는 solution 함수를 작성하세요. 없으면 빈 문자열을 반환합니다.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(s)`으로 작성하세요."
  ],
  "examples": [
    {
      "input": "solution('leetcode')",
      "output": "l"
    }
  ],
  "initialCode": "def solution(s):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution('leetcode')",
      "expected": "bA=="
    },
    {
      "input": "solution('aabb')",
      "expected": ""
    },
    {
      "input": "solution('z')",
      "expected": "eg=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_hash_contains_dup",
  "title": "알고리즘 39. 중복 원소 존재 확인",
  "category": "해시맵",
  "difficulty": "basic",
  "type": "coding",
  "language": "algorithm",
  "description": "정수 리스트 nums에 중복된 값이 하나라도 있는지 True/False로 반환하는 solution 함수를 작성하세요. 이중 반복문은 사용하지 마세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(nums)`으로 작성하세요.",
    "이중 for문(O(n²))을 사용하지 마세요."
  ],
  "examples": [
    {
      "input": "solution([1, 2, 3, 1])",
      "output": "True"
    }
  ],
  "initialCode": "def solution(nums):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([1, 2, 3, 1])",
      "expected": "VHJ1ZQ=="
    },
    {
      "input": "solution([1, 2, 3, 4])",
      "expected": "RmFsc2U="
    },
    {
      "input": "solution([])",
      "expected": "RmFsc2U="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_hash_intersection",
  "title": "알고리즘 40. 두 배열의 교집합",
  "category": "해시맵",
  "difficulty": "basic",
  "type": "coding",
  "language": "algorithm",
  "description": "두 정수 리스트 a, b의 교집합(공통으로 들어있는 값들, 중복 없이)을 오름차순 정렬된 리스트로 반환하는 solution 함수를 작성하세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(a, b)`으로 작성하세요."
  ],
  "examples": [
    {
      "input": "solution([1, 2, 2, 3], [2, 3, 4])",
      "output": "[2, 3]"
    }
  ],
  "initialCode": "def solution(a, b):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([1, 2, 2, 3], [2, 3, 4])",
      "expected": "WzIsIDNd"
    },
    {
      "input": "solution([1, 2], [3, 4])",
      "expected": "W10="
    },
    {
      "input": "solution([5], [5])",
      "expected": "WzVd"
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_hash_group_anagrams_count",
  "title": "알고리즘 41. 애너그램 그룹 개수",
  "category": "해시맵",
  "difficulty": "advanced",
  "type": "coding",
  "language": "algorithm",
  "description": "문자열 리스트 words가 주어질 때, 서로 애너그램인 단어끼리 묶었을 때 생기는 그룹의 개수를 반환하는 solution 함수를 작성하세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(words)`으로 작성하세요."
  ],
  "examples": [
    {
      "input": "solution(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'])",
      "output": "3"
    }
  ],
  "initialCode": "def solution(words):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'])",
      "expected": "Mw=="
    },
    {
      "input": "solution(['abc', 'cab', 'bca'])",
      "expected": "MQ=="
    },
    {
      "input": "solution(['x', 'y'])",
      "expected": "Mg=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_hash_two_sum_count_pairs",
  "title": "알고리즘 42. 합이 target인 쌍의 개수",
  "category": "해시맵",
  "difficulty": "intermediate",
  "type": "coding",
  "language": "algorithm",
  "description": "정수 리스트 nums와 target이 주어질 때, 더해서 target이 되는 서로 다른 인덱스 쌍의 개수를 반환하는 solution 함수를 작성하세요. (같은 값 쌍도 인덱스가 다르면 별개로 셉니다)",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(nums, target)`으로 작성하세요."
  ],
  "examples": [
    {
      "input": "solution([1, 5, 3, 3, 2], 6)",
      "output": "2"
    }
  ],
  "initialCode": "def solution(nums, target):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([1, 5, 3, 3, 2], 6)",
      "expected": "Mg=="
    },
    {
      "input": "solution([1, 1, 1], 2)",
      "expected": "Mw=="
    },
    {
      "input": "solution([1, 2, 3], 100)",
      "expected": "MA=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_recursion_factorial",
  "title": "알고리즘 43. 재귀로 팩토리얼",
  "category": "재귀",
  "difficulty": "basic",
  "type": "coding",
  "language": "algorithm",
  "description": "음이 아닌 정수 n의 팩토리얼(n!)을 재귀 함수로 구하는 solution 함수를 작성하세요. 반복문(for/while)은 사용하지 마세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(n)`으로 작성하세요.",
    "반드시 재귀 호출로 구현하세요 (for/while 금지)."
  ],
  "examples": [
    {
      "input": "solution(5)",
      "output": "120"
    }
  ],
  "initialCode": "def solution(n):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution(5)",
      "expected": "MTIw"
    },
    {
      "input": "solution(0)",
      "expected": "MQ=="
    },
    {
      "input": "solution(1)",
      "expected": "MQ=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_recursion_fibonacci",
  "title": "알고리즘 44. 재귀로 피보나치",
  "category": "재귀",
  "difficulty": "basic",
  "type": "coding",
  "language": "algorithm",
  "description": "n번째 피보나치 수를 재귀 함수로 구하는 solution 함수를 작성하세요. (0번째=0, 1번째=1, 이후 앞 두 수의 합)",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(n)`으로 작성하세요.",
    "재귀 호출로 구현하세요."
  ],
  "examples": [
    {
      "input": "solution(6)",
      "output": "8"
    }
  ],
  "initialCode": "def solution(n):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution(6)",
      "expected": "OA=="
    },
    {
      "input": "solution(0)",
      "expected": "MA=="
    },
    {
      "input": "solution(1)",
      "expected": "MQ=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_recursion_power",
  "title": "알고리즘 45. 재귀로 거듭제곱",
  "category": "재귀",
  "difficulty": "intermediate",
  "type": "coding",
  "language": "algorithm",
  "description": "밑 base와 지수 exp(0 이상의 정수)가 주어질 때 base의 exp제곱을 재귀로 구하는 solution 함수를 작성하세요. `**` 연산자는 사용하지 마세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(base, exp)`으로 작성하세요.",
    "`**` 연산자를 사용하지 마세요."
  ],
  "examples": [
    {
      "input": "solution(2, 10)",
      "output": "1024"
    }
  ],
  "initialCode": "def solution(base, exp):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution(2, 10)",
      "expected": "MTAyNA=="
    },
    {
      "input": "solution(5, 0)",
      "expected": "MQ=="
    },
    {
      "input": "solution(3, 3)",
      "expected": "Mjc="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_recursion_digit_sum",
  "title": "알고리즘 46. 재귀로 각 자리 숫자 합",
  "category": "재귀",
  "difficulty": "basic",
  "type": "coding",
  "language": "algorithm",
  "description": "음이 아닌 정수 n의 각 자리 숫자를 모두 더한 값을 재귀로 구하는 solution 함수를 작성하세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(n)`으로 작성하세요.",
    "재귀 호출로 구현하세요."
  ],
  "examples": [
    {
      "input": "solution(12345)",
      "output": "15"
    }
  ],
  "initialCode": "def solution(n):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution(12345)",
      "expected": "MTU="
    },
    {
      "input": "solution(7)",
      "expected": "Nw=="
    },
    {
      "input": "solution(100)",
      "expected": "MQ=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_graph_bfs_reachable",
  "title": "알고리즘 47. BFS로 도달 가능한 노드 개수",
  "category": "그래프",
  "difficulty": "advanced",
  "type": "coding",
  "language": "algorithm",
  "description": "인접 리스트로 주어진 그래프 graph(딕셔너리, {노드: [연결된 노드들]})와 시작 노드 start에서 BFS로 도달 가능한 노드의 개수(자기 자신 포함)를 반환하는 solution 함수를 작성하세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(graph, start)`으로 작성하세요.",
    "collections.deque로 BFS를 구현하세요."
  ],
  "examples": [
    {
      "input": "solution({1: [2, 3], 2: [1, 4], 3: [1], 4: [2], 5: []}, 1)",
      "output": "4"
    }
  ],
  "initialCode": "from collections import deque\n\ndef solution(graph, start):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution({1: [2, 3], 2: [1, 4], 3: [1], 4: [2], 5: []}, 1)",
      "expected": "NA=="
    },
    {
      "input": "solution({1: [2], 2: [1], 3: [4], 4: [3]}, 1)",
      "expected": "Mg=="
    },
    {
      "input": "solution({1: []}, 1)",
      "expected": "MQ=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_graph_dfs_components",
  "title": "알고리즘 48. 연결 요소 개수 (DFS)",
  "category": "그래프",
  "difficulty": "advanced",
  "type": "coding",
  "language": "algorithm",
  "description": "인접 리스트로 주어진 무방향 그래프 graph(딕셔너리)에서 서로 연결된 노드들의 묶음(연결 요소)이 몇 개인지 DFS로 세는 solution 함수를 작성하세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(graph)`으로 작성하세요.",
    "재귀 DFS로 구현하세요."
  ],
  "examples": [
    {
      "input": "solution({1: [2], 2: [1], 3: [4], 4: [3], 5: []})",
      "output": "3"
    }
  ],
  "initialCode": "def solution(graph):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution({1: [2], 2: [1], 3: [4], 4: [3], 5: []})",
      "expected": "Mw=="
    },
    {
      "input": "solution({1: [2, 3], 2: [1], 3: [1]})",
      "expected": "MQ=="
    },
    {
      "input": "solution({1: [], 2: [], 3: []})",
      "expected": "Mw=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_graph_grid_islands",
  "title": "알고리즘 49. 섬의 개수 (그리드 DFS)",
  "category": "그래프",
  "difficulty": "advanced",
  "type": "coding",
  "language": "algorithm",
  "description": "0(바다)과 1(육지)로 이루어진 2차원 그리드 grid가 주어질 때, 상하좌우로 붙어있는 육지 덩어리(섬)의 개수를 DFS로 세는 solution 함수를 작성하세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(grid)`으로 작성하세요.",
    "대각선은 연결로 취급하지 않습니다."
  ],
  "examples": [
    {
      "input": "solution([[1, 1, 0], [0, 1, 0], [0, 0, 1]])",
      "output": "2"
    }
  ],
  "initialCode": "def solution(grid):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([[1, 1, 0], [0, 1, 0], [0, 0, 1]])",
      "expected": "Mg=="
    },
    {
      "input": "solution([[1, 0], [0, 1]])",
      "expected": "Mg=="
    },
    {
      "input": "solution([[0, 0], [0, 0]])",
      "expected": "MA=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_graph_bfs_shortest_path",
  "title": "알고리즘 50. BFS 최단 거리",
  "category": "그래프",
  "difficulty": "advanced",
  "type": "coding",
  "language": "algorithm",
  "description": "가중치 없는 그래프 graph(딕셔너리)에서 start부터 end까지 최소 몇 번의 간선을 거쳐야 하는지 BFS로 구하는 solution 함수를 작성하세요. 도달 불가능하면 -1을 반환합니다.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(graph, start, end)`으로 작성하세요."
  ],
  "examples": [
    {
      "input": "solution({1: [2, 3], 2: [4], 3: [4], 4: [5], 5: []}, 1, 5)",
      "output": "3"
    }
  ],
  "initialCode": "from collections import deque\n\ndef solution(graph, start, end):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution({1: [2, 3], 2: [4], 3: [4], 4: [5], 5: []}, 1, 5)",
      "expected": "Mw=="
    },
    {
      "input": "solution({1: [2], 2: [1]}, 1, 3)",
      "expected": "LTE="
    },
    {
      "input": "solution({1: [2], 2: [3], 3: []}, 1, 3)",
      "expected": "Mg=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_dp_climbing_stairs",
  "title": "알고리즘 51. 계단 오르기 경우의 수",
  "category": "DP",
  "difficulty": "intermediate",
  "type": "coding",
  "language": "algorithm",
  "description": "한 번에 1칸 또는 2칸씩 오를 수 있을 때, n칸짜리 계단을 오르는 방법의 수를 동적계획법으로 구하는 solution 함수를 작성하세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(n)`으로 작성하세요.",
    "n은 1 이상입니다."
  ],
  "examples": [
    {
      "input": "solution(5)",
      "output": "8"
    }
  ],
  "initialCode": "def solution(n):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution(5)",
      "expected": "OA=="
    },
    {
      "input": "solution(1)",
      "expected": "MQ=="
    },
    {
      "input": "solution(2)",
      "expected": "Mg=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_dp_fibonacci_memo",
  "title": "알고리즘 52. DP로 피보나치 (메모이제이션)",
  "category": "DP",
  "difficulty": "intermediate",
  "type": "coding",
  "language": "algorithm",
  "description": "n번째 피보나치 수를 DP(리스트를 이용한 메모이제이션)로 구하는 solution 함수를 작성하세요. 단순 재귀(중복 계산 있는 방식)는 사용하지 마세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(n)`으로 작성하세요.",
    "리스트에 계산 결과를 저장해가며 구현하세요."
  ],
  "examples": [
    {
      "input": "solution(10)",
      "output": "55"
    }
  ],
  "initialCode": "def solution(n):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution(10)",
      "expected": "NTU="
    },
    {
      "input": "solution(0)",
      "expected": "MA=="
    },
    {
      "input": "solution(1)",
      "expected": "MQ=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_dp_coin_change_min",
  "title": "알고리즘 53. 최소 동전 개수 (DP)",
  "category": "DP",
  "difficulty": "advanced",
  "type": "coding",
  "language": "algorithm",
  "description": "동전 종류 리스트 coins와 금액 amount가 주어질 때, amount를 만드는 데 필요한 최소 동전 개수를 DP로 구하는 solution 함수를 작성하세요. 만들 수 없으면 -1을 반환합니다. (coins가 서로의 배수가 아니어도 항상 정확해야 합니다)",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(coins, amount)`으로 작성하세요."
  ],
  "examples": [
    {
      "input": "solution([1, 3, 4], 6)",
      "output": "2"
    }
  ],
  "initialCode": "def solution(coins, amount):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([1, 3, 4], 6)",
      "expected": "Mg=="
    },
    {
      "input": "solution([2], 3)",
      "expected": "LTE="
    },
    {
      "input": "solution([1, 5, 10], 12)",
      "expected": "Mw=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_dp_house_robber",
  "title": "알고리즘 54. 최대 도둑 (인접한 집 제외)",
  "category": "DP",
  "difficulty": "advanced",
  "type": "coding",
  "language": "algorithm",
  "description": "일렬로 늘어선 집들의 금액 리스트 houses가 주어질 때, 바로 옆집은 훔칠 수 없다는 조건 하에 훔칠 수 있는 최대 금액을 DP로 구하는 solution 함수를 작성하세요.",
  "constraints": [
    "함수 이름은 `solution`, 매개변수는 `(houses)`으로 작성하세요."
  ],
  "examples": [
    {
      "input": "solution([2, 7, 9, 3, 1])",
      "output": "12"
    }
  ],
  "initialCode": "def solution(houses):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
    {
      "input": "solution([2, 7, 9, 3, 1])",
      "expected": "MTI="
    },
    {
      "input": "solution([5])",
      "expected": "NQ=="
    },
    {
      "input": "solution([1, 2])",
      "expected": "Mg=="
    }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},

  {
  "id": "algo_expert_backtrack_n_queens",
  "title": "챌린지 1. N-Queens 해의 개수",
  "category": "백트래킹",
  "difficulty": "expert",
  "type": "coding",
  "language": "algorithm",
  "description": "정수 n이 주어질 때, n x n 체스판에 n개의 퀸을 서로 공격하지 않도록 배치하는 방법의 개수를 백트래킹으로 구하는 solution 함수를 작성하세요. (퀸은 같은 행, 같은 열, 대각선에 있으면 서로 공격합니다.)",
  "constraints": [
      "함수 이름은 `solution`, 매개변수는 `(n)`으로 작성하세요.",
      "백트래킹(가지치기)으로 모든 배치를 탐색하세요."
],
  "examples": [{"input": "solution(4)", "output": "2"}],
  "initialCode": "def solution(n):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
      {
          "input": "solution(4)",
          "expected": "Mg=="
      },
      {
          "input": "solution(1)",
          "expected": "MQ=="
      },
      {
          "input": "solution(6)",
          "expected": "NA=="
      }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},
  {
  "id": "algo_expert_backtrack_combination_sum",
  "title": "챌린지 2. 조합의 합 개수 세기",
  "category": "백트래킹",
  "difficulty": "expert",
  "type": "coding",
  "language": "algorithm",
  "description": "양의 정수 리스트 candidates와 정수 target이 주어질 때, candidates의 숫자를 중복해서 여러 번 사용해 합이 target이 되는 서로 다른 조합의 개수를 구하는 solution 함수를 작성하세요. (숫자를 고르는 순서만 다른 조합은 같은 조합으로 취급합니다. 예: [2,2,3]과 [2,3,2]는 같은 조합입니다.)",
  "constraints": [
      "함수 이름은 `solution`, 매개변수는 `(candidates, target)`으로 작성하세요.",
      "같은 숫자를 여러 번 사용할 수 있습니다.",
      "백트래킹으로 탐색하며, 조합 내에서 숫자를 오름차순으로만 선택하면 중복 조합을 자연스럽게 피할 수 있습니다."
],
  "examples": [{"input": "solution([2, 3, 6, 7], 7)", "output": "2"}],
  "initialCode": "def solution(candidates, target):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
      {
          "input": "solution([2, 3, 6, 7], 7)",
          "expected": "Mg=="
      },
      {
          "input": "solution([2, 3, 5], 8)",
          "expected": "Mw=="
      },
      {
          "input": "solution([2], 1)",
          "expected": "MA=="
      }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},
  {
  "id": "algo_expert_dp_lcs",
  "title": "챌린지 3. 최장 공통 부분 수열 (LCS)",
  "category": "DP",
  "difficulty": "expert",
  "type": "coding",
  "language": "algorithm",
  "description": "두 문자열 text1, text2가 주어질 때, 두 문자열에 공통으로 등장하는 부분 수열(순서는 유지하되 연속하지 않아도 됨) 중 가장 긴 것의 길이를 DP로 구하는 solution 함수를 작성하세요.",
  "constraints": [
      "함수 이름은 `solution`, 매개변수는 `(text1, text2)`으로 작성하세요.",
      "2차원 DP 테이블을 사용하세요."
],
  "examples": [{"input": "solution(\"abcde\", \"ace\")", "output": "3"}],
  "initialCode": "def solution(text1, text2):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
      {
          "input": "solution(\"abcde\", \"ace\")",
          "expected": "Mw=="
      },
      {
          "input": "solution(\"abc\", \"abc\")",
          "expected": "Mw=="
      },
      {
          "input": "solution(\"abc\", \"def\")",
          "expected": "MA=="
      }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},
  {
  "id": "algo_expert_dp_edit_distance",
  "title": "챌린지 4. 편집 거리 (Edit Distance)",
  "category": "DP",
  "difficulty": "expert",
  "type": "coding",
  "language": "algorithm",
  "description": "두 문자열 word1, word2가 주어질 때, word1을 word2로 바꾸는 데 필요한 최소 연산(삽입, 삭제, 교체) 횟수를 DP로 구하는 solution 함수를 작성하세요.",
  "constraints": [
      "함수 이름은 `solution`, 매개변수는 `(word1, word2)`으로 작성하세요.",
      "삽입/삭제/교체 연산은 각각 1번의 연산으로 취급합니다."
],
  "examples": [{"input": "solution(\"horse\", \"ros\")", "output": "3"}],
  "initialCode": "def solution(word1, word2):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
      {
          "input": "solution(\"horse\", \"ros\")",
          "expected": "Mw=="
      },
      {
          "input": "solution(\"intention\", \"execution\")",
          "expected": "NQ=="
      },
      {
          "input": "solution(\"abc\", \"abc\")",
          "expected": "MA=="
      }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},
  {
  "id": "algo_expert_dp_knapsack",
  "title": "챌린지 5. 0/1 배낭 문제",
  "category": "DP",
  "difficulty": "expert",
  "type": "coding",
  "language": "algorithm",
  "description": "물건들의 무게 리스트 weights, 가치 리스트 values와 배낭의 최대 무게 capacity가 주어질 때, 배낭에 담을 수 있는 물건 가치의 최댓값을 DP로 구하는 solution 함수를 작성하세요. (각 물건은 한 번씩만 담을 수 있습니다.)",
  "constraints": [
      "함수 이름은 `solution`, 매개변수는 `(weights, values, capacity)`으로 작성하세요.",
      "각 물건은 담거나 안 담거나 둘 중 하나입니다 (쪼갤 수 없음)."
],
  "examples": [{"input": "solution([1, 3, 4, 5], [1, 4, 5, 7], 7)", "output": "9"}],
  "initialCode": "def solution(weights, values, capacity):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
      {
          "input": "solution([1, 3, 4, 5], [1, 4, 5, 7], 7)",
          "expected": "OQ=="
      },
      {
          "input": "solution([2, 3, 4], [3, 4, 5], 5)",
          "expected": "Nw=="
      },
      {
          "input": "solution([5], [10], 3)",
          "expected": "MA=="
      }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},
  {
  "id": "algo_expert_dp_lis",
  "title": "챌린지 6. 최장 증가 부분 수열 (LIS)",
  "category": "DP",
  "difficulty": "expert",
  "type": "coding",
  "language": "algorithm",
  "description": "정수 리스트 nums가 주어질 때, 엄격하게 증가하는 부분 수열(연속하지 않아도 됨) 중 가장 긴 것의 길이를 구하는 solution 함수를 작성하세요.",
  "constraints": [
      "함수 이름은 `solution`, 매개변수는 `(nums)`으로 작성하세요.",
      "부분 수열은 반드시 엄격하게 증가해야 합니다 (같은 값은 이어질 수 없음)."
],
  "examples": [{"input": "solution([10, 9, 2, 5, 3, 7, 101, 18])", "output": "4"}],
  "initialCode": "def solution(nums):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
      {
          "input": "solution([10, 9, 2, 5, 3, 7, 101, 18])",
          "expected": "NA=="
      },
      {
          "input": "solution([0, 1, 0, 3, 2, 3])",
          "expected": "NA=="
      },
      {
          "input": "solution([7, 7, 7, 7])",
          "expected": "MQ=="
      }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},
  {
  "id": "algo_expert_graph_dijkstra",
  "title": "챌린지 7. 다익스트라 최단 거리",
  "category": "그래프",
  "difficulty": "expert",
  "type": "coding",
  "language": "algorithm",
  "description": "노드 개수 n, 간선 리스트 edges(각 원소는 (u, v, w) 형태의 튜플로 u-v를 잇는 가중치 w의 무방향 간선), 시작 노드 start, 도착 노드 end가 주어질 때, start에서 end까지의 최단 거리를 다익스트라 알고리즘으로 구하는 solution 함수를 작성하세요. 도달할 수 없다면 -1을 반환하세요.",
  "constraints": [
      "함수 이름은 `solution`, 매개변수는 `(n, edges, start, end)`으로 작성하세요.",
      "노드 번호는 0부터 n-1까지입니다.",
      "간선은 무방향(양방향)이며 가중치는 모두 양수입니다."
],
  "examples": [{"input": "solution(5, [(0,1,2),(0,2,4),(1,2,1),(1,3,7),(2,4,3),(3,4,1)], 0, 4)", "output": "6"}],
  "initialCode": "def solution(n, edges, start, end):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
      {
          "input": "solution(5, [(0,1,2),(0,2,4),(1,2,1),(1,3,7),(2,4,3),(3,4,1)], 0, 4)",
          "expected": "Ng=="
      },
      {
          "input": "solution(3, [(0,1,5)], 0, 2)",
          "expected": "LTE="
      },
      {
          "input": "solution(4, [(0,1,1),(1,2,1),(2,3,1),(0,3,10)], 0, 3)",
          "expected": "Mw=="
      }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},
  {
  "id": "algo_expert_graph_course_schedule",
  "title": "챌린지 8. 수강 신청 가능 여부 (사이클 탐지)",
  "category": "그래프",
  "difficulty": "expert",
  "type": "coding",
  "language": "algorithm",
  "description": "전체 과목 수 numCourses와 선수과목 목록 prerequisites(각 원소는 (a, b) 형태로 'b를 먼저 들어야 a를 들을 수 있음'을 의미)가 주어질 때, 모든 과목을 수강할 수 있는지(선수 관계에 사이클이 없는지) 판별하는 solution 함수를 작성하세요.",
  "constraints": [
      "함수 이름은 `solution`, 매개변수는 `(numCourses, prerequisites)`으로 작성하세요.",
      "과목 번호는 0부터 numCourses-1까지입니다.",
      "그래프 순회(DFS)로 사이클이 있는지 탐지하세요."
],
  "examples": [{"input": "solution(2, [(1, 0)])", "output": "True"}],
  "initialCode": "def solution(numCourses, prerequisites):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
      {
          "input": "solution(2, [(1, 0)])",
          "expected": "VHJ1ZQ=="
      },
      {
          "input": "solution(2, [(1, 0), (0, 1)])",
          "expected": "RmFsc2U="
      },
      {
          "input": "solution(4, [(1, 0), (2, 1), (3, 2)])",
          "expected": "VHJ1ZQ=="
      }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},
  {
  "id": "algo_expert_graph_provinces",
  "title": "챌린지 9. 도시 그룹 개수 (Union-Find)",
  "category": "그래프",
  "difficulty": "expert",
  "type": "coding",
  "language": "algorithm",
  "description": "n개의 도시에 대한 n x n 연결 행렬 isConnected가 주어집니다 (isConnected[i][j] == 1이면 i와 j가 직접 연결됨). 직접 또는 간접적으로 연결된 도시들을 하나의 그룹으로 볼 때, 전체 그룹(province)의 개수를 구하는 solution 함수를 작성하세요.",
  "constraints": [
      "함수 이름은 `solution`, 매개변수는 `(isConnected)`으로 작성하세요.",
      "DFS/BFS 또는 Union-Find로 연결 요소의 개수를 구하세요."
],
  "examples": [{"input": "solution([[1,1,0],[1,1,0],[0,0,1]])", "output": "2"}],
  "initialCode": "def solution(isConnected):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
      {
          "input": "solution([[1,1,0],[1,1,0],[0,0,1]])",
          "expected": "Mg=="
      },
      {
          "input": "solution([[1,0,0],[0,1,0],[0,0,1]])",
          "expected": "Mw=="
      },
      {
          "input": "solution([[1,1,0,0],[1,1,1,0],[0,1,1,0],[0,0,0,1]])",
          "expected": "Mg=="
      }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},
  {
  "id": "algo_expert_graph_mst_kruskal",
  "title": "챌린지 10. 최소 신장 트리 (Kruskal)",
  "category": "그래프",
  "difficulty": "expert",
  "type": "coding",
  "language": "algorithm",
  "description": "노드 개수 n과 간선 리스트 edges((u, v, w) 형태, 무방향 가중치 간선)가 주어질 때, 모든 노드를 최소 비용으로 연결하는 최소 신장 트리(MST)의 총 가중치를 크루스칼 알고리즘으로 구하는 solution 함수를 작성하세요. 모든 노드를 연결할 수 없다면 -1을 반환하세요.",
  "constraints": [
      "함수 이름은 `solution`, 매개변수는 `(n, edges)`으로 작성하세요.",
      "Union-Find(서로소 집합)를 이용해 사이클을 판별하세요.",
      "간선을 가중치 오름차순으로 정렬한 뒤 그리디하게 선택하세요."
],
  "examples": [{"input": "solution(4, [(0,1,1),(0,2,4),(1,2,2),(1,3,5),(2,3,1)])", "output": "4"}],
  "initialCode": "def solution(n, edges):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
      {
          "input": "solution(4, [(0,1,1),(0,2,4),(1,2,2),(1,3,5),(2,3,1)])",
          "expected": "NA=="
      },
      {
          "input": "solution(3, [(0,1,3),(1,2,1),(0,2,2)])",
          "expected": "Mw=="
      },
      {
          "input": "solution(4, [(0,1,1),(2,3,1)])",
          "expected": "LTE="
      }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},
  {
  "id": "algo_expert_trie_prefix_count",
  "title": "챌린지 11. 접두사로 시작하는 단어 개수 (Trie)",
  "category": "트라이",
  "difficulty": "expert",
  "type": "coding",
  "language": "algorithm",
  "description": "문자열 리스트 words와 문자열 prefix가 주어질 때, words 중 prefix로 시작하는 단어의 개수를 구하는 solution 함수를 작성하세요. 트라이(Trie) 자료구조를 직접 구성해서 접두사를 검색하는 방식으로 구현해 보세요.",
  "constraints": [
      "함수 이름은 `solution`, 매개변수는 `(words, prefix)`으로 작성하세요.",
      "트라이를 구성해 접두사 탐색 방식으로 구현하는 것을 권장합니다 (단순 반복문으로도 정답은 통과합니다)."
],
  "examples": [{"input": "solution([\"apple\", \"app\", \"application\", \"banana\"], \"app\")", "output": "3"}],
  "initialCode": "def solution(words, prefix):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
      {
          "input": "solution([\"apple\", \"app\", \"application\", \"banana\"], \"app\")",
          "expected": "Mw=="
      },
      {
          "input": "solution([\"cat\", \"car\", \"dog\"], \"ca\")",
          "expected": "Mg=="
      },
      {
          "input": "solution([\"hello\", \"world\"], \"z\")",
          "expected": "MA=="
      }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},
  {
  "id": "algo_expert_string_longest_palindrome",
  "title": "챌린지 12. 가장 긴 회문 부분 문자열",
  "category": "문자열",
  "difficulty": "expert",
  "type": "coding",
  "language": "algorithm",
  "description": "문자열 s가 주어질 때, s의 부분 문자열 중 회문(앞뒤로 읽어도 같은 문자열)이면서 가장 긴 것을 구하는 solution 함수를 작성하세요. 정답이 여러 개라면 그중 아무거나 반환해도 되지만, 테스트는 유일한 최장 회문이 존재하는 경우로만 구성되어 있습니다.",
  "constraints": [
      "함수 이름은 `solution`, 매개변수는 `(s)`으로 작성하세요.",
      "중심 확장(expand around center) 또는 DP로 구현하세요."
],
  "examples": [{"input": "solution(\"cbbd\")", "output": "bb"}],
  "initialCode": "def solution(s):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
      {
          "input": "solution(\"cbbd\")",
          "expected": "YmI="
      },
      {
          "input": "solution(\"racecar\")",
          "expected": "cmFjZWNhcg=="
      },
      {
          "input": "solution(\"forgeeksskeegfor\")",
          "expected": "Z2Vla3Nza2VlZw=="
      }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},
  {
  "id": "algo_expert_greedy_interval_scheduling",
  "title": "챌린지 13. 최대 겹치지 않는 구간 개수",
  "category": "그리디",
  "difficulty": "expert",
  "type": "coding",
  "language": "algorithm",
  "description": "구간(시작, 끝)들의 리스트 intervals가 주어질 때, 서로 겹치지 않게 선택할 수 있는 구간의 최대 개수를 그리디 알고리즘으로 구하는 solution 함수를 작성하세요. 끝나는 시각과 다음 시작 시각이 같은 경우는 겹치지 않는 것으로 취급합니다.",
  "constraints": [
      "함수 이름은 `solution`, 매개변수는 `(intervals)`으로 작성하세요.",
      "구간을 끝나는 시각 기준으로 정렬한 뒤 그리디하게 선택하세요."
],
  "examples": [{"input": "solution([(1,3),(2,4),(3,5),(7,9)])", "output": "3"}],
  "initialCode": "def solution(intervals):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
      {
          "input": "solution([(1,3),(2,4),(3,5),(7,9)])",
          "expected": "Mw=="
      },
      {
          "input": "solution([(1,2),(2,3),(3,4),(1,3)])",
          "expected": "Mw=="
      },
      {
          "input": "solution([(1,10),(2,3),(4,5),(6,7)])",
          "expected": "Mw=="
      }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},
  {
  "id": "algo_expert_prefix_sum_range_queries",
  "title": "챌린지 14. 구간 합 쿼리 (Prefix Sum)",
  "category": "누적합",
  "difficulty": "expert",
  "type": "coding",
  "language": "algorithm",
  "description": "정수 리스트 nums와 구간 쿼리 리스트 queries(각 원소는 (l, r) 형태, l부터 r까지 inclusive 구간)가 주어질 때, 각 쿼리에 대한 구간 합을 리스트로 반환하는 solution 함수를 작성하세요. 접두사 합(prefix sum)을 미리 계산해서 각 쿼리를 O(1)에 처리하세요.",
  "constraints": [
      "함수 이름은 `solution`, 매개변수는 `(nums, queries)`으로 작성하세요.",
      "각 쿼리마다 nums를 처음부터 다시 더하지 말고, 미리 계산한 누적합 배열을 활용하세요."
],
  "examples": [{"input": "solution([1, 2, 3, 4, 5], [(0, 2), (1, 3), (0, 4)])", "output": "[6, 9, 15]"}],
  "initialCode": "def solution(nums, queries):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
      {
          "input": "solution([1, 2, 3, 4, 5], [(0, 2), (1, 3), (0, 4)])",
          "expected": "WzYsIDksIDE1XQ=="
      },
      {
          "input": "solution([4, 4, 4, 4], [(0, 0), (0, 3)])",
          "expected": "WzQsIDE2XQ=="
      },
      {
          "input": "solution([10, -2, 3, 5], [(1, 2), (0, 3)])",
          "expected": "WzEsIDE2XQ=="
      }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},
  {
  "id": "algo_expert_bit_single_number",
  "title": "챌린지 15. 딱 한 번 등장하는 수 (비트 조작)",
  "category": "비트조작",
  "difficulty": "expert",
  "type": "coding",
  "language": "algorithm",
  "description": "정수 리스트 nums에서 하나의 숫자만 딱 한 번 등장하고 나머지 숫자는 모두 정확히 3번씩 등장합니다. 딱 한 번 등장하는 숫자를 비트 연산만으로 구하는 solution 함수를 작성하세요. (추가 메모리 없이, 리스트를 정렬하거나 딕셔너리로 개수를 세지 않고 비트 연산으로 구현해 보세요.)",
  "constraints": [
      "함수 이름은 `solution`, 매개변수는 `(nums)`으로 작성하세요.",
      "가능하다면 딕셔너리/Counter 없이 비트 연산자(&, |, ^, ~)만으로 구현해 보세요 (딕셔너리로 풀어도 정답은 통과합니다)."
],
  "examples": [{"input": "solution([2, 2, 3, 2])", "output": "3"}],
  "initialCode": "def solution(nums):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [
      {
          "input": "solution([2, 2, 3, 2])",
          "expected": "Mw=="
      },
      {
          "input": "solution([0, 1, 0, 1, 0, 1, 99])",
          "expected": "OTk="
      },
      {
          "input": "solution([-2, -2, 1, -2])",
          "expected": "MQ=="
      }
  ],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},
  {
  "id": "js_expert_closure_counter",
  "title": "챌린지 1. 클로저로 카운터 만들기",
  "category": "클로저",
  "difficulty": "expert",
  "type": "coding",
  "language": "js",
  "description": "makeCounter 함수를 완성하세요. 이 함수는 호출할 때마다 1씩 증가한 값을 반환하는 함수(카운터)를 반환해야 합니다. 클로저를 이용해 카운터 상태를 함수 안에 안전하게 감춰야 합니다.",
  "constraints": ["makeCounter() 는 함수를 반환해야 합니다.", "반환된 함수는 호출될 때마다 1, 2, 3, ... 순서로 값을 반환해야 합니다.", "외부에서 카운트 값을 직접 수정할 수 없어야 합니다 (클로저로 감출 것)."],
  "examples": [{"input": "counter(); counter(); counter();", "output": "1\n2\n3"}],
  "initialCode": "function makeCounter() {\n  // 코드를 작성하세요\n}\n\nconst counter = makeCounter();\nconsole.log(counter());\nconsole.log(counter());\nconsole.log(counter());\n",
  "testCases": [{"input":"코드 실행","expected": "MQoyCjM="}],
  "testRunnerCode": "stdout_match"
},
  {
  "id": "js_expert_memo_fib",
  "title": "챌린지 2. 메모이제이션으로 피보나치 40번째 항 구하기",
  "category": "재귀",
  "difficulty": "expert",
  "type": "coding",
  "language": "js",
  "description": "fib 함수를 완성하세요. n번째 피보나치 수를 반환해야 하며(fib(0)=0, fib(1)=1), 메모이제이션 없이 순수 재귀로 구현하면 fib(40)은 실행 시간이 매우 오래 걸립니다. memo 객체를 활용해 이미 계산한 값을 재사용하도록 구현하세요.",
  "constraints": ["함수 이름은 `fib`, 매개변수는 `(n, memo = {})`으로 작성하세요.", "memo에 이미 계산된 값이 있으면 그 값을 즉시 반환하세요.", "재귀 호출 시 memo를 계속 전달해야 캐시가 유지됩니다."],
  "examples": [{"input": "fib(10)", "output": "55"}],
  "initialCode": "function fib(n, memo = {}) {\n  // 코드를 작성하세요 (메모이제이션을 사용하세요)\n}\n\nconsole.log(fib(40));\n",
  "testCases": [{"input":"코드 실행","expected": "MTAyMzM0MTU1"}],
  "testRunnerCode": "stdout_match"
},
  {
  "id": "js_expert_hof_pipeline",
  "title": "챌린지 3. 고차함수 파이프라인",
  "category": "배열 고차함수",
  "difficulty": "expert",
  "type": "coding",
  "language": "js",
  "description": "정수 배열 nums가 주어질 때, 짝수만 골라서 각 값을 제곱한 뒤 그 합을 구하는 solution 함수를 filter, map, reduce를 체이닝해서 작성하세요.",
  "constraints": ["함수 이름은 `solution`, 매개변수는 `(nums)`으로 작성하세요.", "for문 대신 filter().map().reduce() 체이닝으로 구현하세요."],
  "examples": [{"input": "solution([1, 2, 3, 4, 5, 6])", "output": "56"}],
  "initialCode": "function solution(nums) {\n  // 코드를 작성하세요 (filter, map, reduce 체이닝)\n}\n\nconsole.log(solution([1, 2, 3, 4, 5, 6]));\n",
  "testCases": [{"input":"코드 실행","expected": "NTY="}],
  "testRunnerCode": "stdout_match"
},
  {
  "id": "js_expert_generator_fib",
  "title": "챌린지 4. 제너레이터로 피보나치 생성기 만들기",
  "category": "제너레이터",
  "difficulty": "expert",
  "type": "coding",
  "language": "js",
  "description": "제너레이터 함수 fibGen을 완성하세요. 호출할 때마다 무한히 다음 피보나치 수를 반환하는 무한 제너레이터여야 합니다 (0, 1, 1, 2, 3, 5, ...).",
  "constraints": ["function* fibGen() { ... } 형태의 제너레이터 함수로 작성하세요.", "yield로 값을 하나씩 내보내야 합니다.", "무한 루프(while (true))를 사용하되, 반드시 yield로 멈춰야 합니다."],
  "examples": [{"input": "gen.next().value 8번 호출", "output": "[0,1,1,2,3,5,8,13]"}],
  "initialCode": "function* fibGen() {\n  // 코드를 작성하세요\n}\n\nconst gen = fibGen();\nconst result = [];\nfor (let i = 0; i < 8; i++) {\n  result.push(gen.next().value);\n}\nconsole.log(result);\n",
  "testCases": [{"input":"코드 실행","expected": "WzAsMSwxLDIsMyw1LDgsMTNd"}],
  "testRunnerCode": "stdout_match"
},
  {
  "id": "js_expert_class_inheritance",
  "title": "챌린지 5. 클래스 상속과 다형성",
  "category": "클래스",
  "difficulty": "expert",
  "type": "coding",
  "language": "js",
  "description": "Animal 클래스를 상속받는 Dog, Cat 클래스를 완성하세요. 각 클래스는 speak() 메서드를 오버라이드해서 서로 다른 문자열을 반환해야 합니다 (Dog는 \"멍멍!\", Cat은 \"야옹!\"). 배열에 담긴 동물들을 순회하며 다형성을 이용해 각자의 speak()를 호출하세요.",
  "constraints": ["class Dog extends Animal, class Cat extends Animal로 작성하세요.", "Dog.speak()는 \"멍멍!\"을, Cat.speak()는 \"야옹!\"을 반환해야 합니다."],
  "examples": [{"input": "new Dog().speak()", "output": "멍멍!"}],
  "initialCode": "class Animal {\n  speak() {\n    return \"...\";\n  }\n}\n\nclass Dog extends Animal {\n  // 코드를 작성하세요 (speak()가 \"멍멍!\"을 반환하도록)\n}\n\nclass Cat extends Animal {\n  // 코드를 작성하세요 (speak()가 \"야옹!\"을 반환하도록)\n}\n\nconst animals = [new Dog(), new Cat()];\nanimals.forEach((a) => console.log(a.speak()));\n",
  "testCases": [{"input":"코드 실행","expected": "66mN66mNIQrslbzsmLkh"}],
  "testRunnerCode": "stdout_match"
},
  {
  "id": "js_expert_promise_all_sum",
  "title": "챌린지 6. Promise.all로 병렬 처리 후 합계 구하기",
  "category": "비동기",
  "difficulty": "expert",
  "type": "coding",
  "language": "js",
  "description": "solution 함수를 완성하세요. delayedValue(10, 50), delayedValue(20, 30), delayedValue(30, 10)을 Promise.all로 동시에 실행해서 세 값을 배열로 받은 뒤, 그 합계를 반환해야 합니다. 하나씩 순서대로 await하면 시간이 더 오래 걸리므로 반드시 Promise.all로 동시에 실행하세요.",
  "constraints": ["함수 이름은 `solution`, 매개변수는 없습니다.", "Promise.all([...])로 세 Promise를 동시에 실행하세요.", "async/await 문법을 사용하세요."],
  "examples": [{"input": "await solution()", "output": "60"}],
  "initialCode": "function delayedValue(value, ms) {\n  return new Promise((resolve) => setTimeout(() => resolve(value), ms));\n}\n\nasync function solution() {\n  // 코드를 작성하세요 (Promise.all로 세 값을 동시에 받아 합계를 반환)\n}\n\nconsole.log(await solution());\n",
  "testCases": [{"input":"코드 실행","expected": "NjA="}],
  "testRunnerCode": "stdout_match"
},
  {
  "id": "py_expert_decorator_uppercase",
  "title": "챌린지 1. 데코레이터로 반환값 가공하기",
  "category": "데코레이터",
  "difficulty": "expert",
  "type": "coding",
  "language": "python",
  "description": "데코레이터 upper_decorator를 작성하고, 이를 solution 함수에 적용해서 solution이 원래 반환하는 문자열을 항상 대문자로 바꿔서 반환하도록 만드세요.",
  "constraints": ["upper_decorator(func) 함수를 정의해서 solution에 @upper_decorator로 적용하세요.", "solution(word)는 원래 word를 그대로 반환하되, 데코레이터가 결과를 대문자로 바꿔야 합니다."],
  "examples": [{"input": "solution(\"hello\")", "output": "HELLO"}],
  "initialCode": "def upper_decorator(func):\n    # 코드를 작성하세요\n    pass\n\n@upper_decorator\ndef solution(word):\n    return word\n",
  "testCases": [{"input": "solution(\"hello\")", "expected": "SEVMTE8="}, {"input": "solution(\"python\")", "expected": "UFlUSE9O"}, {"input": "solution(\"Chani\")", "expected": "Q0hBTkk="}],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},
  {
  "id": "py_expert_closure_counter",
  "title": "챌린지 2. 클로저로 카운터 만들기",
  "category": "클로저",
  "difficulty": "expert",
  "type": "coding",
  "language": "python",
  "description": "make_counter 함수를 완성하세요. 호출할 때마다 1씩 증가한 값을 반환하는 함수(카운터)를 반환해야 합니다. solution 함수는 make_counter로 카운터를 만든 뒤 3번 호출한 결과를 리스트로 반환합니다.",
  "constraints": ["make_counter()는 함수를 반환해야 합니다.", "nonlocal 키워드로 클로저 내부 상태를 변경하세요.", "solution() 함수는 매개변수 없이 [1, 2, 3]을 반환해야 합니다."],
  "examples": [{"input": "solution()", "output": "[1, 2, 3]"}],
  "initialCode": "def make_counter():\n    # 코드를 작성하세요\n    pass\n\ndef solution():\n    counter = make_counter()\n    return [counter(), counter(), counter()]\n",
  "testCases": [{"input": "solution()", "expected": "WzEsIDIsIDNd"}],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},
  {
  "id": "py_expert_args_kwargs",
  "title": "챌린지 3. 가변 인자로 합계 구하기",
  "category": "함수",
  "difficulty": "expert",
  "type": "coding",
  "language": "python",
  "description": "solution 함수는 위치 인자(*args)와 키워드 인자(**kwargs)를 몇 개든 받을 수 있어야 하며, 모든 args 값의 합과 모든 kwargs 값의 합을 더해서 반환해야 합니다.",
  "constraints": ["함수 이름은 `solution`, 매개변수는 `(*args, **kwargs)`으로 작성하세요.", "args와 kwargs.values()를 각각 합산한 뒤 더하세요."],
  "examples": [{"input": "solution(1, 2, 3, a=4, b=5)", "output": "15"}],
  "initialCode": "def solution(*args, **kwargs):\n    # 코드를 작성하세요\n    pass\n",
  "testCases": [{"input": "solution(1, 2, 3, a=4, b=5)", "expected": "MTU="}, {"input": "solution(10, x=1, y=2, z=3)", "expected": "MTY="}, {"input": "solution()", "expected": "MA=="}],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},
  {
  "id": "py_expert_nested_comprehension",
  "title": "챌린지 4. 중첩 리스트 컴프리헨션으로 평탄화 + 필터링",
  "category": "리스트",
  "difficulty": "expert",
  "type": "coding",
  "language": "python",
  "description": "2차원 리스트 matrix가 주어질 때, 모든 원소를 평탄화하면서 짝수만 골라 제곱한 값들을 리스트로 반환하는 solution 함수를, 반복문 없이 중첩 리스트 컴프리헨션 한 줄로 작성하세요.",
  "constraints": ["함수 이름은 `solution`, 매개변수는 `(matrix)`으로 작성하세요.", "for문을 명시적으로 사용하지 말고, `[... for row in matrix for x in row if ...]` 형태의 중첩 컴프리헨션을 사용하세요."],
  "examples": [{"input": "solution([[1, 2, 3], [4, 5, 6]])", "output": "[4, 16, 36]"}],
  "initialCode": "def solution(matrix):\n    # 코드를 작성하세요 (중첩 리스트 컴프리헨션 한 줄로)\n    pass\n",
  "testCases": [{"input": "solution([[1, 2, 3], [4, 5, 6]])", "expected": "WzQsIDE2LCAzNl0="}, {"input": "solution([[1, 3, 5]])", "expected": "W10="}, {"input": "solution([[2, 4], [6, 8]])", "expected": "WzQsIDE2LCAzNiwgNjRd"}],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},
  {
  "id": "py_expert_generator_primes",
  "title": "챌린지 5. 제너레이터로 소수 생성기 만들기",
  "category": "제너레이터",
  "difficulty": "expert",
  "type": "coding",
  "language": "python",
  "description": "무한히 소수를 하나씩 만들어내는 제너레이터 prime_gen을 작성하고, solution(n) 함수에서 이를 이용해 처음 n개의 소수를 리스트로 반환하세요.",
  "constraints": ["prime_gen은 yield를 사용하는 무한 제너레이터여야 합니다.", "함수 이름은 `solution`, 매개변수는 `(n)`으로 작성하세요.", "next()를 n번 호출해서 리스트로 모으세요."],
  "examples": [{"input": "solution(5)", "output": "[2, 3, 5, 7, 11]"}],
  "initialCode": "def solution(n):\n    def is_prime(x):\n        if x < 2:\n            return False\n        for d in range(2, int(x ** 0.5) + 1):\n            if x % d == 0:\n                return False\n        return True\n\n    def prime_gen():\n        # 코드를 작성하세요 (무한 제너레이터)\n        pass\n\n    gen = prime_gen()\n    return [next(gen) for _ in range(n)]\n",
  "testCases": [{"input": "solution(5)", "expected": "WzIsIDMsIDUsIDcsIDExXQ=="}, {"input": "solution(1)", "expected": "WzJd"}, {"input": "solution(10)", "expected": "WzIsIDMsIDUsIDcsIDExLCAxMywgMTcsIDE5LCAyMywgMjld"}],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},
  {
  "id": "py_expert_memo_fib",
  "title": "챌린지 6. 메모이제이션으로 큰 피보나치 빠르게 계산하기",
  "category": "재귀",
  "difficulty": "expert",
  "type": "coding",
  "language": "python",
  "description": "solution(n) 함수는 n번째 피보나치 수를 반환해야 합니다 (fib(0)=0, fib(1)=1). 메모이제이션 없이 순수 재귀로 fib(50)을 계산하면 사실상 끝나지 않을 정도로 느립니다. 딕셔너리를 이용한 메모이제이션으로 이미 계산한 값을 재사용하도록 구현하세요.",
  "constraints": ["함수 이름은 `solution`, 매개변수는 `(n)`으로 작성하세요.", "내부에 memo 딕셔너리를 두고, 이미 계산된 값이 있으면 재사용하세요."],
  "examples": [{"input": "solution(10)", "output": "55"}],
  "initialCode": "def solution(n):\n    memo = {}\n    def fib(k):\n        # 코드를 작성하세요 (memo를 활용한 메모이제이션)\n        pass\n    return fib(n)\n",
  "testCases": [{"input": "solution(50)", "expected": "MTI1ODYyNjkwMjU="}, {"input": "solution(10)", "expected": "NTU="}, {"input": "solution(1)", "expected": "MQ=="}],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},
  {
  "id": "py_expert_context_manager",
  "title": "챌린지 7. 커스텀 컨텍스트 매니저 구현하기",
  "category": "컨텍스트매니저",
  "difficulty": "expert",
  "type": "coding",
  "language": "python",
  "description": "Resource 클래스에 __enter__와 __exit__ 메서드를 구현해서, with문으로 사용할 수 있는 컨텍스트 매니저로 만드세요. __enter__가 호출되면 log에 \"enter\"를, __exit__이 호출되면 log에 \"exit\"를 추가해야 합니다. solution() 함수는 with Resource(): 블록 안에서 log에 \"using\"을 추가한 뒤, 최종 log 리스트를 반환합니다.",
  "constraints": ["Resource 클래스에 __enter__(self)와 __exit__(self, exc_type, exc_val, exc_tb)를 구현하세요.", "__enter__는 log.append(\"enter\")를 하고 self를 반환해야 합니다.", "__exit__는 log.append(\"exit\")를 하고 False를 반환해야 합니다.", "최종 log는 [\"enter\", \"using\", \"exit\"]가 되어야 합니다."],
  "examples": [{"input": "solution()", "output": "['enter', 'using', 'exit']"}],
  "initialCode": "def solution():\n    log = []\n\n    class Resource:\n        def __enter__(self):\n            # 코드를 작성하세요\n            pass\n\n        def __exit__(self, exc_type, exc_val, exc_tb):\n            # 코드를 작성하세요\n            pass\n\n    with Resource():\n        log.append(\"using\")\n    return log\n",
  "testCases": [{"input": "solution()", "expected": "WydlbnRlcicsICd1c2luZycsICdleGl0J10="}],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},
  {
  "id": "py_expert_custom_iterator",
  "title": "챌린지 8. 이터레이터 프로토콜 직접 구현하기",
  "category": "이터레이터",
  "difficulty": "expert",
  "type": "coding",
  "language": "python",
  "description": "EvenRange 클래스에 __iter__와 __next__를 구현해서, start 이상 end 미만의 짝수만 순서대로 순회하는 이터레이터로 만드세요. solution(start, end)는 이 이터레이터를 리스트로 변환해 반환합니다.",
  "constraints": ["EvenRange 클래스에 __iter__(self)와 __next__(self)를 구현하세요.", "__next__는 더 순회할 값이 없으면 StopIteration을 발생시켜야 합니다.", "start가 홀수면 start+1부터 시작하도록 처리하세요."],
  "examples": [{"input": "solution(1, 10)", "output": "[2, 4, 6, 8]"}],
  "initialCode": "def solution(start, end):\n    class EvenRange:\n        def __init__(self, start, end):\n            self.current = start if start % 2 == 0 else start + 1\n            self.end = end\n\n        def __iter__(self):\n            # 코드를 작성하세요\n            pass\n\n        def __next__(self):\n            # 코드를 작성하세요\n            pass\n\n    return list(EvenRange(start, end))\n",
  "testCases": [{"input": "solution(1, 10)", "expected": "WzIsIDQsIDYsIDhd"}, {"input": "solution(0, 6)", "expected": "WzAsIDIsIDRd"}, {"input": "solution(5, 5)", "expected": "W10="}],
  "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n"
},
  {
  "id": "sql_expert_recursive_cte",
  "title": "챌린지 1. 재귀 CTE로 숫자 시퀀스 생성하기",
  "category": "재귀CTE",
  "difficulty": "expert",
  "type": "coding",
  "language": "sql",
  "description": "재귀 CTE(WITH RECURSIVE)를 사용해서 1부터 10까지의 숫자를 한 줄씩 조회하는 쿼리를 작성하세요.",
  "constraints": ["WITH RECURSIVE seq(n) AS (...) 형태로 작성하세요.", "시작값 1에서 시작해서, n < 10인 동안 n+1을 UNION ALL로 이어 붙이세요."],
  "examples": [{"input":"코드 출력 예시","output": "n\n----------------------------------------\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10"}],
  "initialCode": "",
  "testCases": [{"input":"코드 실행","expected": "bgotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCjEKMgozCjQKNQo2CjcKOAo5CjEw"}],
  "testRunnerCode": "stdout_match"
},
  {
  "id": "sql_expert_rank_window",
  "title": "챌린지 2. RANK()로 점수 순위 매기기",
  "category": "윈도우함수",
  "difficulty": "expert",
  "type": "coding",
  "language": "sql",
  "description": "모든 사용자의 이름, 점수와 함께 점수가 높은 순서대로 순위(rnk)를 매겨서 조회하세요. 점수가 높은 순으로 정렬하세요.",
  "constraints": ["RANK() OVER (ORDER BY score DESC)를 사용하세요."],
  "examples": [{"input":"코드 출력 예시","output": "name | score | rnk\n----------------------------------------\n박민수 | 100 | 1\n정찬희 | 95 | 2\n김철수 | 90 | 3\n이영희 | 85 | 4\n최수민 | 70 | 5"}],
  "initialCode": "",
  "testCases": [{"input":"코드 실행","expected": "bmFtZSB8IHNjb3JlIHwgcm5rCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0K67CV66+87IiYIHwgMTAwIHwgMQrsoJXssKztnawgfCA5NSB8IDIK6rmA7LKg7IiYIHwgOTAgfCAzCuydtOyYge2drCB8IDg1IHwgNArstZzsiJjrr7wgfCA3MCB8IDU="}],
  "testRunnerCode": "stdout_match"
},
  {
  "id": "sql_expert_correlated_subquery",
  "title": "챌린지 3. 상관 서브쿼리로 부서 평균 이상 찾기",
  "category": "서브쿼리",
  "difficulty": "expert",
  "type": "coding",
  "language": "sql",
  "description": "각 사용자 중 자신이 속한 부서의 평균 점수보다 점수가 높은 사용자의 이름과 점수를 조회하세요. 이름 오름차순으로 정렬하세요.",
  "constraints": ["메인 쿼리의 행마다 다시 계산되는 상관 서브쿼리(correlated subquery)를 사용하세요.", "WHERE score > (SELECT AVG(score) FROM users u2 WHERE u2.dept = u1.dept) 형태를 사용하세요."],
  "examples": [{"input":"코드 출력 예시","output": "name | score\n----------------------------------------\n박민수 | 100"}],
  "initialCode": "",
  "testCases": [{"input":"코드 실행","expected": "bmFtZSB8IHNjb3JlCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0K67CV66+87IiYIHwgMTAw"}],
  "testRunnerCode": "stdout_match"
},
  {
  "id": "sql_expert_join_having",
  "title": "챌린지 4. JOIN + GROUP BY + HAVING으로 우수 고객 찾기",
  "category": "집계함수",
  "difficulty": "expert",
  "type": "coding",
  "language": "sql",
  "description": "사용자와 주문 내역을 JOIN해서, 총 주문 금액이 200000 이상인 고객의 이름과 총 주문 금액(total_price)을 총 주문 금액이 큰 순서로 조회하세요.",
  "constraints": ["users와 orders를 JOIN하세요.", "GROUP BY로 고객별로 묶고, HAVING SUM(price) >= 200000으로 필터링하세요."],
  "examples": [{"input":"코드 출력 예시","output": "name | total_price\n----------------------------------------\n김철수 | 1530000\n정찬희 | 450000"}],
  "initialCode": "",
  "testCases": [{"input":"코드 실행","expected": "bmFtZSB8IHRvdGFsX3ByaWNlCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0K6rmA7LKg7IiYIHwgMTUzMDAwMArsoJXssKztnawgfCA0NTAwMDA="}],
  "testRunnerCode": "stdout_match"
},
  {
  "id": "sql_expert_top_n_per_group",
  "title": "챌린지 5. 부서별 최고 점수자 찾기 (Top-N per Group)",
  "category": "서브쿼리",
  "difficulty": "expert",
  "type": "coding",
  "language": "sql",
  "description": "부서(dept)별로 점수가 가장 높은 사용자 한 명씩의 부서, 이름, 점수를 조회하세요. 부서 이름 오름차순으로 정렬하세요.",
  "constraints": ["서브쿼리로 부서별 최고 점수를 구한 뒤, 그 점수와 일치하는 행만 조회하세요.", "WHERE score = (SELECT MAX(score) FROM users u2 WHERE u2.dept = u1.dept) 형태를 사용하세요."],
  "examples": [{"input":"코드 출력 예시","output": "dept | name | score\n----------------------------------------\n개발팀 | 박민수 | 100\n기획팀 | 이영희 | 85\n디자인팀 | 최수민 | 70"}],
  "initialCode": "",
  "testCases": [{"input":"코드 실행","expected": "ZGVwdCB8IG5hbWUgfCBzY29yZQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuqwnOuwnO2MgCB8IOuwleuvvOyImCB8IDEwMArquLDtmo3tjIAgfCDsnbTsmIHtnawgfCA4NQrrlJTsnpDsnbjtjIAgfCDstZzsiJjrr7wgfCA3MA=="}],
  "testRunnerCode": "stdout_match"
},
  {
  "id": "sql_expert_lag_window",
  "title": "챌린지 6. LAG()로 이전 순위와의 점수 차이 구하기",
  "category": "윈도우함수",
  "difficulty": "expert",
  "type": "coding",
  "language": "sql",
  "description": "모든 사용자의 이름, 점수와 함께, 점수 내림차순으로 정렬했을 때 바로 앞 순위 사용자와의 점수 차이(diff = 내 점수 - 바로 앞 순위 점수)를 조회하세요. 1등은 비교 대상이 없으므로 NULL이 나와야 합니다.",
  "constraints": ["LAG(score) OVER (ORDER BY score DESC)를 사용하세요.", "score - LAG(score) OVER (...)로 diff 컬럼을 만드세요."],
  "examples": [{"input":"코드 출력 예시","output": "name | score | diff\n----------------------------------------\n박민수 | 100 | NULL\n정찬희 | 95 | -5\n김철수 | 90 | -5\n이영희 | 85 | -5\n최수민 | 70 | -15"}],
  "initialCode": "",
  "testCases": [{"input":"코드 실행","expected": "bmFtZSB8IHNjb3JlIHwgZGlmZgotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuuwleuvvOyImCB8IDEwMCB8IE5VTEwK7KCV7LCs7Z2sIHwgOTUgfCAtNQrquYDssqDsiJggfCA5MCB8IC01CuydtOyYge2drCB8IDg1IHwgLTUK7LWc7IiY66+8IHwgNzAgfCAtMTU="}],
  "testRunnerCode": "stdout_match"
},
  {
    "id": "java_expert_generics_1",
    "title": "Java 챌린지 1. 제네릭",
    "category": "제네릭",
    "difficulty": "expert",
    "type": "quiz",
    "language": "java",
    "description": "제네릭 타입 매개변수를 선언할 때 사용하는 기호는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input": "보기 중 선택", "output": "선택 즉시 정답/오답 확인"}],
    "quizQuestion": "제네릭 타입 매개변수를 선언할 때 사용하는 기호는?",
    "quizOptions": ["<>", "[]", "()", "::"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "java_expert_generics_2",
    "title": "Java 챌린지 2. 제네릭",
    "category": "제네릭",
    "difficulty": "expert",
    "type": "quiz",
    "language": "java",
    "description": "제네릭에서 특정 타입의 하위 타입만 허용하도록 제한할 때 사용하는 키워드는? (`<T ___ Number>`)",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input": "보기 중 선택", "output": "선택 즉시 정답/오답 확인"}],
    "quizQuestion": "제네릭에서 특정 타입의 하위 타입만 허용하도록 제한할 때 사용하는 키워드는? (`<T ___ Number>`)",
    "quizOptions": ["extends", "implements", "super", "instanceof"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "java_expert_generics_fill_1",
    "title": "Java 챌린지 3. 제네릭",
    "category": "제네릭",
    "difficulty": "expert",
    "type": "fill",
    "language": "java",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["대소문자를 정확히 입력하세요."],
    "examples": [{"input": "빈칸 입력", "output": "입력 즉시 정답/오답 확인"}],
    "fillQuestion": "와일드카드 제네릭에서 특정 타입 또는 그 상위 타입만 허용할 때는 `<? _____ Number>`처럼 사용하며, 빈칸에 들어갈 키워드는 _____이다.",
    "correctAnswerText": "c3VwZXI=",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "java_expert_stream_1",
    "title": "Java 챌린지 4. 스트림 API",
    "category": "스트림API",
    "difficulty": "expert",
    "type": "quiz",
    "language": "java",
    "description": "리스트의 각 요소를 다른 값으로 변환할 때 사용하는 스트림 메서드는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input": "보기 중 선택", "output": "선택 즉시 정답/오답 확인"}],
    "quizQuestion": "리스트의 각 요소를 다른 값으로 변환할 때 사용하는 스트림 메서드는?",
    "quizOptions": ["map", "filter", "reduce", "forEach"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "java_expert_stream_2",
    "title": "Java 챌린지 5. 스트림 API",
    "category": "스트림API",
    "difficulty": "expert",
    "type": "quiz",
    "language": "java",
    "description": "스트림에서 조건에 맞는 요소만 걸러낼 때 사용하는 메서드는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input": "보기 중 선택", "output": "선택 즉시 정답/오답 확인"}],
    "quizQuestion": "스트림에서 조건에 맞는 요소만 걸러낼 때 사용하는 메서드는?",
    "quizOptions": ["filter", "map", "sorted", "distinct"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "java_expert_stream_fill_1",
    "title": "Java 챌린지 6. 스트림 API",
    "category": "스트림API",
    "difficulty": "expert",
    "type": "fill",
    "language": "java",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["대소문자를 정확히 입력하세요."],
    "examples": [{"input": "빈칸 입력", "output": "입력 즉시 정답/오답 확인"}],
    "fillQuestion": "스트림의 처리 결과를 List나 Set 같은 컬렉션으로 모을 때 사용하는 메서드는 _____()이다.",
    "correctAnswerText": "Y29sbGVjdA==",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "java_expert_exception_1",
    "title": "Java 챌린지 7. 예외처리 심화",
    "category": "예외처리심화",
    "difficulty": "expert",
    "type": "quiz",
    "language": "java",
    "description": "사용자 정의 예외 클래스를 만들 때 일반적으로 상속받는 클래스는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input": "보기 중 선택", "output": "선택 즉시 정답/오답 확인"}],
    "quizQuestion": "사용자 정의 예외 클래스를 만들 때 일반적으로 상속받는 클래스는?",
    "quizOptions": ["Exception", "Object", "Thread", "Error"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "java_expert_exception_2",
    "title": "Java 챌린지 8. 예외처리 심화",
    "category": "예외처리심화",
    "difficulty": "expert",
    "type": "quiz",
    "language": "java",
    "description": "try-with-resources 구문에서 자원이 자동으로 해제되려면 그 자원의 클래스가 구현해야 하는 인터페이스는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input": "보기 중 선택", "output": "선택 즉시 정답/오답 확인"}],
    "quizQuestion": "try-with-resources 구문에서 자원이 자동으로 해제되려면 그 자원의 클래스가 구현해야 하는 인터페이스는?",
    "quizOptions": ["AutoCloseable", "Runnable", "Serializable", "Comparable"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "java_expert_exception_fill_1",
    "title": "Java 챌린지 9. 예외처리 심화",
    "category": "예외처리심화",
    "difficulty": "expert",
    "type": "fill",
    "language": "java",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["대소문자를 정확히 입력하세요."],
    "examples": [{"input": "빈칸 입력", "output": "입력 즉시 정답/오답 확인"}],
    "fillQuestion": "예외가 발생하든 안 하든 항상 실행되어야 하는 코드 블록을 작성할 때 사용하는 키워드는 _____이다.",
    "correctAnswerText": "ZmluYWxseQ==",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "java_expert_concurrency_1",
    "title": "Java 챌린지 10. 동시성 기초",
    "category": "동시성기초",
    "difficulty": "expert",
    "type": "quiz",
    "language": "java",
    "description": "Thread 클래스를 상속하지 않고 스레드가 실행할 작업을 정의하려면 구현해야 하는 인터페이스는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input": "보기 중 선택", "output": "선택 즉시 정답/오답 확인"}],
    "quizQuestion": "Thread 클래스를 상속하지 않고 스레드가 실행할 작업을 정의하려면 구현해야 하는 인터페이스는?",
    "quizOptions": ["Runnable", "Serializable", "Iterable", "Comparable"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "java_expert_concurrency_2",
    "title": "Java 챌린지 11. 동시성 기초",
    "category": "동시성기초",
    "difficulty": "expert",
    "type": "quiz",
    "language": "java",
    "description": "여러 스레드가 동시에 접근하지 못하도록 임계 영역을 보호할 때 사용하는 키워드는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input": "보기 중 선택", "output": "선택 즉시 정답/오답 확인"}],
    "quizQuestion": "여러 스레드가 동시에 접근하지 못하도록 임계 영역을 보호할 때 사용하는 키워드는?",
    "quizOptions": ["synchronized", "volatile", "transient", "static"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "java_expert_concurrency_fill_1",
    "title": "Java 챌린지 12. 동시성 기초",
    "category": "동시성기초",
    "difficulty": "expert",
    "type": "fill",
    "language": "java",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["대소문자를 정확히 입력하세요."],
    "examples": [{"input": "빈칸 입력", "output": "입력 즉시 정답/오답 확인"}],
    "fillQuestion": "스레드를 실제로 새로 실행시키기 위해 Thread 객체에서 호출해야 하는 메서드는 _____()이다 (run()을 직접 호출하면 새 스레드가 생기지 않습니다).",
    "correctAnswerText": "c3RhcnQ=",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "c_expert_funcptr_1",
    "title": "C 챌린지 1. 함수 포인터",
    "category": "함수포인터",
    "difficulty": "expert",
    "type": "quiz",
    "language": "c",
    "description": "int를 반환하고 int 하나를 매개변수로 받는 함수를 가리키는 함수 포인터 fp를 선언하는 문법은?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input": "보기 중 선택", "output": "선택 즉시 정답/오답 확인"}],
    "quizQuestion": "int를 반환하고 int 하나를 매개변수로 받는 함수를 가리키는 함수 포인터 fp를 선언하는 문법은?",
    "quizOptions": ["int (*fp)(int)", "int *fp(int)", "int fp(*int)", "(int*) fp(int)"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "c_expert_funcptr_2",
    "title": "C 챌린지 2. 함수 포인터",
    "category": "함수포인터",
    "difficulty": "expert",
    "type": "quiz",
    "language": "c",
    "description": "함수 포인터를 이용해 실행할 함수를 런타임에 결정하는 대표적인 활용 예는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input": "보기 중 선택", "output": "선택 즉시 정답/오답 확인"}],
    "quizQuestion": "함수 포인터를 이용해 실행할 함수를 런타임에 결정하는 대표적인 활용 예는?",
    "quizOptions": ["콜백 함수 구현", "전처리기 매크로 정의", "비트 필드 선언", "구조체 정렬"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "c_expert_funcptr_fill_1",
    "title": "C 챌린지 3. 함수 포인터",
    "category": "함수포인터",
    "difficulty": "expert",
    "type": "fill",
    "language": "c",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["대소문자를 정확히 입력하세요."],
    "examples": [{"input": "빈칸 입력", "output": "입력 즉시 정답/오답 확인"}],
    "fillQuestion": "복잡한 함수 포인터 타입에 별칭을 붙여 간결하게 사용할 때 사용하는 키워드는 _____이다.",
    "correctAnswerText": "dHlwZWRlZg==",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "c_expert_doubleptr_1",
    "title": "C 챌린지 4. 다중 포인터",
    "category": "다중포인터",
    "difficulty": "expert",
    "type": "quiz",
    "language": "c",
    "description": "포인터를 가리키는 포인터(더블 포인터)를 선언하는 문법은?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input": "보기 중 선택", "output": "선택 즉시 정답/오답 확인"}],
    "quizQuestion": "포인터를 가리키는 포인터(더블 포인터)를 선언하는 문법은?",
    "quizOptions": ["int **pp", "int *pp", "int &&pp", "int pp**"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "c_expert_doubleptr_2",
    "title": "C 챌린지 5. 다중 포인터",
    "category": "다중포인터",
    "difficulty": "expert",
    "type": "quiz",
    "language": "c",
    "description": "malloc으로 동적 2차원 배열(행 개수 n)을 만들 때, 가장 먼저 할당해야 하는 것은?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input": "보기 중 선택", "output": "선택 즉시 정답/오답 확인"}],
    "quizQuestion": "malloc으로 동적 2차원 배열(행 개수 n)을 만들 때, 가장 먼저 할당해야 하는 것은?",
    "quizOptions": ["각 행의 시작 주소를 저장할 포인터 배열(int**)", "전체 데이터를 저장할 1차원 배열만", "구조체 배열", "전역 배열"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "c_expert_doubleptr_fill_1",
    "title": "C 챌린지 6. 다중 포인터",
    "category": "다중포인터",
    "difficulty": "expert",
    "type": "fill",
    "language": "c",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["대소문자를 정확히 입력하세요."],
    "examples": [{"input": "빈칸 입력", "output": "입력 즉시 정답/오답 확인"}],
    "fillQuestion": "동적으로 할당한 이중 포인터(2차원 배열)를 완전히 해제하려면, 먼저 각 행을 free한 뒤 마지막으로 포인터 배열 자체도 _____해야 한다.",
    "correctAnswerText": "ZnJlZQ==",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "c_expert_union_1",
    "title": "C 챌린지 7. 공용체와 비트 필드",
    "category": "공용체",
    "difficulty": "expert",
    "type": "quiz",
    "language": "c",
    "description": "구조체와 달리 모든 멤버가 같은 메모리 공간을 공유하는 자료형은?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input": "보기 중 선택", "output": "선택 즉시 정답/오답 확인"}],
    "quizQuestion": "구조체와 달리 모든 멤버가 같은 메모리 공간을 공유하는 자료형은?",
    "quizOptions": ["union", "struct", "enum", "typedef"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "c_expert_union_2",
    "title": "C 챌린지 8. 공용체와 비트 필드",
    "category": "공용체",
    "difficulty": "expert",
    "type": "quiz",
    "language": "c",
    "description": "구조체 멤버가 차지하는 비트 수를 직접 지정할 때 사용하는 문법은?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input": "보기 중 선택", "output": "선택 즉시 정답/오답 확인"}],
    "quizQuestion": "구조체 멤버가 차지하는 비트 수를 직접 지정할 때 사용하는 문법은?",
    "quizOptions": ["멤버 이름 뒤에 `: 비트수`를 붙인다", "멤버 앞에 bit 키워드를 붙인다", "배열로 선언한다", "포인터로 선언한다"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "c_expert_union_fill_1",
    "title": "C 챌린지 9. 공용체와 비트 필드",
    "category": "공용체",
    "difficulty": "expert",
    "type": "fill",
    "language": "c",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["대소문자를 정확히 입력하세요."],
    "examples": [{"input": "빈칸 입력", "output": "입력 즉시 정답/오답 확인"}],
    "fillQuestion": "union의 전체 크기는 가장 큰 멤버 하나의 크기와 같다. 이는 모든 멤버가 같은 메모리를 _____하기 때문이다.",
    "correctAnswerText": "6rO17Jyg",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "c_expert_ub_1",
    "title": "C 챌린지 10. 정의되지 않은 동작",
    "category": "정의되지않은동작",
    "difficulty": "expert",
    "type": "quiz",
    "language": "c",
    "description": "배열의 범위를 벗어난 인덱스에 접근했을 때 C 표준이 정의하는 동작은?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input": "보기 중 선택", "output": "선택 즉시 정답/오답 확인"}],
    "quizQuestion": "배열의 범위를 벗어난 인덱스에 접근했을 때 C 표준이 정의하는 동작은?",
    "quizOptions": ["정의되지 않음 (undefined behavior)", "항상 0을 반환한다", "컴파일 오류가 난다", "항상 프로그램이 즉시 종료된다"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "c_expert_ub_2",
    "title": "C 챌린지 11. 정의되지 않은 동작",
    "category": "정의되지않은동작",
    "difficulty": "expert",
    "type": "quiz",
    "language": "c",
    "description": "개수가 정해지지 않은 인자를 받는 가변 인자 함수를 만들 때 포함해야 하는 헤더는?",
    "constraints": ["보기 중 정답 하나를 선택하세요."],
    "examples": [{"input": "보기 중 선택", "output": "선택 즉시 정답/오답 확인"}],
    "quizQuestion": "개수가 정해지지 않은 인자를 받는 가변 인자 함수를 만들 때 포함해야 하는 헤더는?",
    "quizOptions": ["<stdarg.h>", "<stdio.h>", "<stdlib.h>", "<string.h>"],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "c_expert_ub_fill_1",
    "title": "C 챌린지 12. 정의되지 않은 동작",
    "category": "정의되지않은동작",
    "difficulty": "expert",
    "type": "fill",
    "language": "c",
    "description": "빈칸에 들어갈 정확한 키워드를 입력하세요.",
    "constraints": ["대소문자를 정확히 입력하세요."],
    "examples": [{"input": "빈칸 입력", "output": "입력 즉시 정답/오답 확인"}],
    "fillQuestion": "가변 인자 함수에서 다음 인자를 하나씩 꺼낼 때 사용하는 매크로는 _____이다.",
    "correctAnswerText": "dmFfYXJn",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "html_q1",
    "title": "HTML 1. 첫 웹페이지 만들기",
    "category": "기본 구조",
    "difficulty": "basic",
    "type": "coding",
    "language": "html",
    "description": "제목과 문단이 하나씩 있는 첫 웹페이지를 만드세요. 코드를 입력하면 아래 미리보기에 바로 나타납니다.",
    "constraints": [
      "`<h1>` 태그로 `안녕하세요`라는 제목을 만드세요.",
      "`<p>` 태그로 `첫 번째 웹 페이지입니다.`라는 문단을 만드세요.",
      "`<body>` 안에 작성하세요."
    ],
    "examples": [
      {
        "input": "미리보기",
        "output": "안녕하세요 (큰 제목)\n첫 번째 웹 페이지입니다."
      }
    ],
    "initialCode": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>첫 웹페이지</title>\n</head>\n<body>\n  <!-- 여기에 코드를 작성하세요 -->\n\n</body>\n</html>\n",
    "webChecks": [
      {
        "kind": "exists",
        "selector": "body h1",
        "label": "`<h1>` 제목이 있다"
      },
      {
        "kind": "text",
        "selector": "h1",
        "equals": "안녕하세요",
        "label": "제목 내용이 `안녕하세요`이다"
      },
      {
        "kind": "exists",
        "selector": "body p",
        "label": "`<p>` 문단이 있다"
      },
      {
        "kind": "text",
        "selector": "p",
        "equals": "첫 번째 웹 페이지입니다.",
        "label": "문단 내용이 `첫 번째 웹 페이지입니다.`이다"
      }
    ]
  },
  {
    "id": "html_q3",
    "title": "HTML 2. 제목 단계 나누기",
    "category": "텍스트",
    "difficulty": "basic",
    "type": "coding",
    "language": "html",
    "description": "큰 제목, 중간 제목, 작은 제목을 차례로 만드세요. 제목 태그는 숫자가 작을수록 더 중요한 제목입니다.",
    "constraints": [
      "`<h1>`에 `여행 일기`",
      "`<h2>`에 `첫째 날`",
      "`<h3>`에 `아침`"
    ],
    "examples": [
      {
        "input": "미리보기",
        "output": "여행 일기 (가장 큼)\n첫째 날\n아침 (가장 작음)"
      }
    ],
    "initialCode": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>여행 일기</title>\n</head>\n<body>\n  <!-- 여기에 코드를 작성하세요 -->\n\n</body>\n</html>\n",
    "webChecks": [
      {
        "kind": "text",
        "selector": "h1",
        "equals": "여행 일기",
        "label": "`<h1>`이 `여행 일기`이다"
      },
      {
        "kind": "text",
        "selector": "h2",
        "equals": "첫째 날",
        "label": "`<h2>`가 `첫째 날`이다"
      },
      {
        "kind": "text",
        "selector": "h3",
        "equals": "아침",
        "label": "`<h3>`이 `아침`이다"
      }
    ]
  },
  {
    "id": "html_q4",
    "title": "HTML 3. 글자 강조하기",
    "category": "텍스트",
    "difficulty": "basic",
    "type": "coding",
    "language": "html",
    "description": "문단 안의 일부 단어를 강조하세요.",
    "constraints": [
      "`<p>` 문단에 `이 내용은 중요하니 천천히 읽어 주세요.`라고 쓰세요.",
      "`중요`는 `<strong>`으로 감싸세요.",
      "`천천히`는 `<em>`으로 감싸세요."
    ],
    "examples": [
      {
        "input": "미리보기",
        "output": "이 내용은 **중요**하니 *천천히* 읽어 주세요."
      }
    ],
    "initialCode": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>강조하기</title>\n</head>\n<body>\n  <!-- 여기에 코드를 작성하세요 -->\n\n</body>\n</html>\n",
    "webChecks": [
      {
        "kind": "text",
        "selector": "p",
        "equals": "이 내용은 중요하니 천천히 읽어 주세요.",
        "label": "문단 전체 내용이 맞다"
      },
      {
        "kind": "text",
        "selector": "p strong",
        "equals": "중요",
        "label": "`중요`가 `<strong>` 안에 있다"
      },
      {
        "kind": "text",
        "selector": "p em",
        "equals": "천천히",
        "label": "`천천히`가 `<em>` 안에 있다"
      }
    ]
  },
  {
    "id": "html_q2",
    "title": "HTML 4. 장보기 목록 만들기",
    "category": "목록",
    "difficulty": "basic",
    "type": "coding",
    "language": "html",
    "description": "순서가 없는 목록으로 장보기 목록을 만드세요.",
    "constraints": [
      "`<ul>` 태그로 목록을 만드세요.",
      "`<li>` 항목 세 개에 차례대로 `사과`, `바나나`, `포도`를 넣으세요."
    ],
    "examples": [
      {
        "input": "미리보기",
        "output": "• 사과\n• 바나나\n• 포도"
      }
    ],
    "initialCode": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>장보기 목록</title>\n</head>\n<body>\n  <!-- 여기에 코드를 작성하세요 -->\n\n</body>\n</html>\n",
    "webChecks": [
      {
        "kind": "exists",
        "selector": "ul",
        "label": "`<ul>` 목록이 있다"
      },
      {
        "kind": "exists",
        "selector": "ul > li",
        "min": 3,
        "max": 3,
        "label": "`<ul>` 안에 `<li>` 항목이 세 개 있다"
      },
      {
        "kind": "text",
        "selector": "ul > li:nth-child(1)",
        "equals": "사과",
        "label": "첫 번째 항목이 `사과`이다"
      },
      {
        "kind": "text",
        "selector": "ul > li:nth-child(2)",
        "equals": "바나나",
        "label": "두 번째 항목이 `바나나`이다"
      },
      {
        "kind": "text",
        "selector": "ul > li:nth-child(3)",
        "equals": "포도",
        "label": "세 번째 항목이 `포도`이다"
      }
    ]
  },
  {
    "id": "html_q5",
    "title": "HTML 5. 순서 있는 목록",
    "category": "목록",
    "difficulty": "basic",
    "type": "coding",
    "language": "html",
    "description": "라면 끓이는 순서를 번호가 붙는 목록으로 만드세요.",
    "constraints": [
      "`<ol>` 태그를 사용하세요.",
      "항목은 차례대로 `물을 끓인다`, `면과 스프를 넣는다`, `4분 더 끓인다`입니다."
    ],
    "examples": [
      {
        "input": "미리보기",
        "output": "1. 물을 끓인다\n2. 면과 스프를 넣는다\n3. 4분 더 끓인다"
      }
    ],
    "initialCode": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>라면 끓이기</title>\n</head>\n<body>\n  <!-- 여기에 코드를 작성하세요 -->\n\n</body>\n</html>\n",
    "webChecks": [
      {
        "kind": "exists",
        "selector": "ol > li",
        "min": 3,
        "max": 3,
        "label": "`<ol>` 안에 항목이 세 개 있다"
      },
      {
        "kind": "exists",
        "selector": "ul",
        "negate": true,
        "label": "`<ul>`이 아니라 `<ol>`을 썼다"
      },
      {
        "kind": "text",
        "selector": "ol > li:nth-child(1)",
        "equals": "물을 끓인다",
        "label": "1번이 `물을 끓인다`이다"
      },
      {
        "kind": "text",
        "selector": "ol > li:nth-child(2)",
        "equals": "면과 스프를 넣는다",
        "label": "2번이 `면과 스프를 넣는다`이다"
      },
      {
        "kind": "text",
        "selector": "ol > li:nth-child(3)",
        "equals": "4분 더 끓인다",
        "label": "3번이 `4분 더 끓인다`이다"
      }
    ]
  },
  {
    "id": "html_q6",
    "title": "HTML 6. 링크 만들기",
    "category": "링크",
    "difficulty": "basic",
    "type": "coding",
    "language": "html",
    "description": "클릭하면 새 탭에서 PyQuests가 열리는 링크를 만드세요. (미리보기 안에서는 링크가 열리지 않습니다.)",
    "constraints": [
      "`<a>` 태그의 글자는 `PyQuests 바로가기`입니다.",
      "`href`는 `https://pyquests.vercel.app`입니다.",
      "새 탭에서 열리도록 `target` 속성을 쓰세요."
    ],
    "examples": [
      {
        "input": "미리보기",
        "output": "PyQuests 바로가기 (밑줄 있는 링크)"
      }
    ],
    "initialCode": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>링크</title>\n</head>\n<body>\n  <!-- 여기에 코드를 작성하세요 -->\n\n</body>\n</html>\n",
    "webChecks": [
      {
        "kind": "text",
        "selector": "a",
        "equals": "PyQuests 바로가기",
        "label": "링크 글자가 `PyQuests 바로가기`이다"
      },
      {
        "kind": "attr",
        "selector": "a",
        "attr": "href",
        "equals": "https://pyquests.vercel.app",
        "label": "`href`가 `https://pyquests.vercel.app`이다"
      },
      {
        "kind": "attr",
        "selector": "a",
        "attr": "target",
        "equals": "_blank",
        "label": "`target`이 `_blank`이다"
      }
    ]
  },
  {
    "id": "html_q7",
    "title": "HTML 7. 이미지 넣기",
    "category": "이미지",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "html",
    "description": "고양이 사진을 넣으세요. 실제 사진 파일은 없어서 미리보기에는 대체 텍스트가 보입니다.",
    "constraints": [
      "`src`는 `cat.png`입니다.",
      "대체 텍스트(`alt`)는 `잠자는 고양이`입니다.",
      "너비(`width`)는 `200`입니다."
    ],
    "examples": [
      {
        "input": "미리보기",
        "output": "(이미지 자리) 잠자는 고양이"
      }
    ],
    "initialCode": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>이미지</title>\n</head>\n<body>\n  <!-- 여기에 코드를 작성하세요 -->\n\n</body>\n</html>\n",
    "webChecks": [
      {
        "kind": "attr",
        "selector": "img",
        "attr": "src",
        "equals": "cat.png",
        "label": "`src`가 `cat.png`이다"
      },
      {
        "kind": "attr",
        "selector": "img",
        "attr": "alt",
        "equals": "잠자는 고양이",
        "label": "`alt`가 `잠자는 고양이`이다"
      },
      {
        "kind": "attr",
        "selector": "img",
        "attr": "width",
        "equals": "200",
        "label": "`width`가 `200`이다"
      }
    ]
  },
  {
    "id": "html_q8",
    "title": "HTML 8. 표 만들기",
    "category": "표",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "html",
    "description": "이름과 점수가 있는 성적표를 표로 만드세요.",
    "constraints": [
      "`<thead>`에 제목 칸(`<th>`) `이름`, `점수`를 넣으세요.",
      "`<tbody>`에 두 줄을 넣으세요: `김철수` `90`, `이영희` `85`."
    ],
    "examples": [
      {
        "input": "미리보기",
        "output": "이름 | 점수\n김철수 | 90\n이영희 | 85"
      }
    ],
    "initialCode": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>성적표</title>\n</head>\n<body>\n  <!-- 여기에 코드를 작성하세요 -->\n\n</body>\n</html>\n",
    "webChecks": [
      {
        "kind": "exists",
        "selector": "table thead th",
        "min": 2,
        "max": 2,
        "label": "`<thead>`에 `<th>`가 두 개 있다"
      },
      {
        "kind": "text",
        "selector": "thead th:nth-child(1)",
        "equals": "이름",
        "label": "첫 제목 칸이 `이름`이다"
      },
      {
        "kind": "text",
        "selector": "thead th:nth-child(2)",
        "equals": "점수",
        "label": "둘째 제목 칸이 `점수`이다"
      },
      {
        "kind": "exists",
        "selector": "table tbody tr",
        "min": 2,
        "max": 2,
        "label": "`<tbody>`에 두 줄이 있다"
      },
      {
        "kind": "text",
        "selector": "tbody tr:nth-child(1) td:nth-child(1)",
        "equals": "김철수",
        "label": "첫 줄 이름이 `김철수`이다"
      },
      {
        "kind": "text",
        "selector": "tbody tr:nth-child(2) td:nth-child(2)",
        "equals": "85",
        "label": "둘째 줄 점수가 `85`이다"
      }
    ]
  },
  {
    "id": "html_q9",
    "title": "HTML 9. 칸 합치기",
    "category": "표",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "html",
    "description": "제목 칸 하나가 아래 두 칸 너비를 모두 차지하는 표를 만드세요.",
    "constraints": [
      "첫 줄에 `<th>` 하나만 두고 내용은 `시간표`입니다.",
      "그 칸이 두 칸을 차지하도록 `colspan`을 쓰세요.",
      "둘째 줄에는 `<td>` 두 개: `1교시`, `국어`."
    ],
    "examples": [
      {
        "input": "미리보기",
        "output": "      시간표\n1교시 | 국어"
      }
    ],
    "initialCode": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>시간표</title>\n</head>\n<body>\n  <!-- 여기에 코드를 작성하세요 -->\n\n</body>\n</html>\n",
    "webChecks": [
      {
        "kind": "text",
        "selector": "th",
        "equals": "시간표",
        "label": "제목 칸이 `시간표`이다"
      },
      {
        "kind": "attr",
        "selector": "th",
        "attr": "colspan",
        "equals": "2",
        "label": "제목 칸이 `colspan=\"2\"`이다"
      },
      {
        "kind": "exists",
        "selector": "tr td",
        "min": 2,
        "max": 2,
        "label": "`<td>`가 두 개 있다"
      },
      {
        "kind": "text",
        "selector": "tr td:nth-child(2)",
        "equals": "국어",
        "label": "둘째 칸이 `국어`이다"
      }
    ]
  },
  {
    "id": "html_q10",
    "title": "HTML 10. 로그인 폼",
    "category": "폼",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "html",
    "description": "아이디와 비밀번호를 입력받는 로그인 폼을 만드세요.",
    "constraints": [
      "`<form>` 안에 작성하세요.",
      "아이디 칸: `<input type=\"text\" id=\"user-id\">`, 그리고 `for=\"user-id\"`인 `<label>`",
      "비밀번호 칸: `type=\"password\"`",
      "`로그인`이라고 쓰인 `<button type=\"submit\">`"
    ],
    "examples": [
      {
        "input": "미리보기",
        "output": "아이디 [      ]\n비밀번호 [••••••]\n[로그인]"
      }
    ],
    "initialCode": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>로그인</title>\n</head>\n<body>\n  <!-- 여기에 코드를 작성하세요 -->\n\n</body>\n</html>\n",
    "webChecks": [
      {
        "kind": "attr",
        "selector": "form input#user-id",
        "attr": "type",
        "equals": "text",
        "label": "아이디 칸이 `type=\"text\"`이다"
      },
      {
        "kind": "exists",
        "selector": "form label[for=\"user-id\"]",
        "label": "`for=\"user-id\"`인 `<label>`이 있다"
      },
      {
        "kind": "exists",
        "selector": "form input[type=\"password\"]",
        "label": "비밀번호 칸이 `type=\"password\"`이다"
      },
      {
        "kind": "text",
        "selector": "form button[type=\"submit\"]",
        "equals": "로그인",
        "label": "`로그인` 제출 버튼이 있다"
      }
    ]
  },
  {
    "id": "html_q11",
    "title": "HTML 11. 선택해서 입력받기",
    "category": "폼",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "html",
    "description": "학년을 고르는 목록과, 약관 동의 체크박스를 만드세요.",
    "constraints": [
      "`name=\"grade\"`인 `<select>`에 `<option>` 세 개: `1학년`, `2학년`, `3학년`",
      "`name=\"agree\"`인 체크박스(`type=\"checkbox\"`)"
    ],
    "examples": [
      {
        "input": "미리보기",
        "output": "[1학년 ▾]\n☐ 약관에 동의합니다"
      }
    ],
    "initialCode": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>선택 입력</title>\n</head>\n<body>\n  <!-- 여기에 코드를 작성하세요 -->\n\n</body>\n</html>\n",
    "webChecks": [
      {
        "kind": "exists",
        "selector": "select[name=\"grade\"] > option",
        "min": 3,
        "max": 3,
        "label": "`grade` 목록에 선택지가 세 개 있다"
      },
      {
        "kind": "text",
        "selector": "select[name=\"grade\"] > option:nth-child(3)",
        "equals": "3학년",
        "label": "셋째 선택지가 `3학년`이다"
      },
      {
        "kind": "attr",
        "selector": "input[name=\"agree\"]",
        "attr": "type",
        "equals": "checkbox",
        "label": "`agree`가 체크박스다"
      }
    ]
  },
  {
    "id": "html_q12",
    "title": "HTML 12. 시맨틱 태그로 바꾸기",
    "category": "시맨틱",
    "difficulty": "advanced",
    "type": "coding",
    "language": "html",
    "description": "`<div>`로만 만든 블로그 구조를 의미가 있는 시맨틱 태그로 바꾸세요. 화면은 거의 그대로지만 문서의 구조가 분명해집니다.",
    "constraints": [
      "`div.header` → `<header>`, `div.nav` → `<nav>`",
      "`div.main` → `<main>`, `div.article` → `<article>`",
      "`div.footer` → `<footer>`",
      "안의 내용은 그대로 두세요."
    ],
    "examples": [
      {
        "input": "미리보기",
        "output": "(화면은 그대로, 구조만 바뀜)"
      }
    ],
    "initialCode": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>블로그</title>\n</head>\n<body>\n  <div class=\"header\">\n    <h1>나의 블로그</h1>\n    <div class=\"nav\">\n      <a href=\"#\">홈</a>\n      <a href=\"#\">글 목록</a>\n    </div>\n  </div>\n  <div class=\"main\">\n    <div class=\"article\">\n      <h2>첫 번째 글</h2>\n      <p>오늘 HTML을 배웠다.</p>\n    </div>\n  </div>\n  <div class=\"footer\">\n    <p>© 2026 나의 블로그</p>\n  </div>\n\n</body>\n</html>\n",
    "webChecks": [
      {
        "kind": "exists",
        "selector": "body > header",
        "label": "`<header>`가 있다"
      },
      {
        "kind": "exists",
        "selector": "header nav a",
        "min": 2,
        "label": "`<header>` 안에 `<nav>` 메뉴가 있다"
      },
      {
        "kind": "exists",
        "selector": "body > main",
        "label": "`<main>`이 있다"
      },
      {
        "kind": "exists",
        "selector": "main > article",
        "label": "`<main>` 안에 `<article>`이 있다"
      },
      {
        "kind": "exists",
        "selector": "body > footer",
        "label": "`<footer>`가 있다"
      },
      {
        "kind": "exists",
        "selector": "div",
        "negate": true,
        "label": "`<div>`가 남아 있지 않다"
      },
      {
        "kind": "text",
        "selector": "article h2",
        "equals": "첫 번째 글",
        "label": "글 제목은 그대로다"
      }
    ]
  },
  {
    "id": "html_q13",
    "title": "HTML 13. 모두가 읽을 수 있는 페이지",
    "category": "접근성",
    "difficulty": "advanced",
    "type": "coding",
    "language": "html",
    "description": "화면을 보지 못하는 사용자도 이해할 수 있게 고치세요. 화면 낭독기는 이미지와 아이콘 버튼을 글자로 읽어 줍니다.",
    "constraints": [
      "`<html>`에 이 문서가 한국어라는 `lang=\"ko\"`를 추가하세요.",
      "로고 이미지에 `alt=\"회사 로고\"`를 추가하세요.",
      "☰ 버튼에 `aria-label=\"메뉴 열기\"`를 추가하세요."
    ],
    "examples": [
      {
        "input": "미리보기",
        "output": "(화면은 그대로, 읽어 주는 내용이 바뀜)"
      }
    ],
    "initialCode": "<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"UTF-8\">\n  <title>접근성</title>\n</head>\n<body>\n  <img src=\"logo.png\">\n  <button>☰</button>\n\n</body>\n</html>\n",
    "webChecks": [
      {
        "kind": "attr",
        "selector": "html",
        "attr": "lang",
        "equals": "ko",
        "label": "`<html lang=\"ko\">`이다"
      },
      {
        "kind": "attr",
        "selector": "img",
        "attr": "alt",
        "equals": "회사 로고",
        "label": "로고에 `alt=\"회사 로고\"`가 있다"
      },
      {
        "kind": "attr",
        "selector": "button",
        "attr": "aria-label",
        "equals": "메뉴 열기",
        "label": "버튼에 `aria-label=\"메뉴 열기\"`가 있다"
      }
    ]
  },
  {
    "id": "html_q14",
    "title": "HTML 14. 자기소개 카드",
    "category": "종합",
    "difficulty": "advanced",
    "type": "coding",
    "language": "html",
    "description": "지금까지 배운 태그로 자기소개 카드를 만드세요.",
    "constraints": [
      "`class=\"profile\"`인 `<section>` 안에 작성하세요.",
      "`alt`가 있는 프로필 `<img>`",
      "`<h2>`에 이름 `김철수`, `<p>`에 한 줄 소개",
      "`<ul>` 목록에 링크(`<a href>`) 세 개"
    ],
    "examples": [
      {
        "input": "미리보기",
        "output": "(사진)\n김철수\n한 줄 소개\n• GitHub • PyQuests • 이메일"
      }
    ],
    "initialCode": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>프로필 카드</title>\n</head>\n<body>\n  <!-- 여기에 코드를 작성하세요 -->\n\n</body>\n</html>\n",
    "webChecks": [
      {
        "kind": "exists",
        "selector": "section.profile",
        "label": "`<section class=\"profile\">`이 있다"
      },
      {
        "kind": "attr",
        "selector": "section.profile img",
        "attr": "alt",
        "label": "사진에 `alt`가 있다"
      },
      {
        "kind": "text",
        "selector": "section.profile h2",
        "equals": "김철수",
        "label": "이름이 `김철수`이다"
      },
      {
        "kind": "exists",
        "selector": "section.profile p",
        "label": "소개 문단이 있다"
      },
      {
        "kind": "exists",
        "selector": "section.profile ul > li > a[href]",
        "min": 3,
        "label": "목록에 링크가 세 개 있다"
      }
    ]
  },
  {
    "id": "html_quiz_1",
    "title": "HTML 15. head와 body",
    "category": "기본 구조",
    "difficulty": "basic",
    "type": "quiz",
    "language": "html",
    "description": "다음 중 `<head>` 안에 들어가는 것은?",
    "constraints": [
      "보기 중 정답 하나를 선택하세요."
    ],
    "examples": [
      {
        "input": "보기 중 선택",
        "output": "선택 즉시 정답/오답 확인"
      }
    ],
    "quizQuestion": "다음 중 `<head>` 안에 들어가는 것은?",
    "quizOptions": [
      "<title>내 홈페이지</title>",
      "<h1>환영합니다</h1>",
      "<p>첫 문단</p>",
      "<img src=\"a.png\" alt=\"그림\">"
    ],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "html_fill_1",
    "title": "HTML 16. 새 탭으로 열기",
    "category": "링크",
    "difficulty": "basic",
    "type": "fill",
    "language": "html",
    "description": "빈칸에 들어갈 정확한 코드를 입력하세요.",
    "constraints": [
      "철자를 정확히 입력하세요."
    ],
    "examples": [
      {
        "input": "빈칸 입력",
        "output": "입력 즉시 정답/오답 확인"
      }
    ],
    "fillQuestion": "링크를 새 탭에서 열려면 <a href=\"...\" target=\"_____\">처럼 씁니다.",
    "correctAnswerText": "X2JsYW5r",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "html_fill_2",
    "title": "HTML 17. label 연결하기",
    "category": "폼",
    "difficulty": "intermediate",
    "type": "fill",
    "language": "html",
    "description": "빈칸에 들어갈 정확한 코드를 입력하세요.",
    "constraints": [
      "철자를 정확히 입력하세요."
    ],
    "examples": [
      {
        "input": "빈칸 입력",
        "output": "입력 즉시 정답/오답 확인"
      }
    ],
    "fillQuestion": "<label _____=\"email\">이메일</label>\n<input type=\"email\" id=\"email\">\n\nlabel과 input을 연결하는 속성은?",
    "correctAnswerText": "Zm9y",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "html_quiz_2",
    "title": "HTML 18. 본문 영역",
    "category": "시맨틱",
    "difficulty": "intermediate",
    "type": "quiz",
    "language": "html",
    "description": "페이지에서 핵심 내용을 감싸며, 한 페이지에 하나만 쓰는 시맨틱 태그는?",
    "constraints": [
      "보기 중 정답 하나를 선택하세요."
    ],
    "examples": [
      {
        "input": "보기 중 선택",
        "output": "선택 즉시 정답/오답 확인"
      }
    ],
    "quizQuestion": "페이지에서 핵심 내용을 감싸며, 한 페이지에 하나만 쓰는 시맨틱 태그는?",
    "quizOptions": [
      "<section>",
      "<main>",
      "<article>",
      "<div>"
    ],
    "correctAnswerIndex": "MQ=="
  },
  {
    "id": "css_q1",
    "title": "CSS 1. 제목 꾸미기",
    "category": "선택자",
    "difficulty": "basic",
    "type": "coding",
    "language": "css",
    "description": "HTML은 이미 작성돼 있습니다. `<style>` 안에 CSS를 작성해서 제목과 문단을 꾸미세요.",
    "constraints": [
      "`h1`의 글자 색을 빨간색(`red`)으로 바꾸세요.",
      "`h1`을 가운데 정렬하세요.",
      "`.intro` 문단의 글자 크기를 `20px`로 바꾸세요.",
      "HTML 부분은 고치지 마세요."
    ],
    "examples": [
      {
        "input": "미리보기",
        "output": "빨간색으로 가운데 정렬된 제목\n20px 크기의 문단"
      }
    ],
    "initialCode": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>제목 꾸미기</title>\n  <style>\n    /* 여기에 CSS를 작성하세요 */\n\n  </style>\n</head>\n<body>\n  <h1>나의 블로그</h1>\n  <p class=\"intro\">오늘 배운 내용을 정리합니다.</p>\n\n</body>\n</html>\n",
    "webChecks": [
      {
        "kind": "style",
        "selector": "h1",
        "property": "color",
        "equals": "red",
        "label": "`h1` 글자 색이 빨간색이다"
      },
      {
        "kind": "style",
        "selector": "h1",
        "property": "text-align",
        "equals": "center",
        "label": "`h1`이 가운데 정렬돼 있다"
      },
      {
        "kind": "style",
        "selector": ".intro",
        "property": "font-size",
        "equals": "20px",
        "label": "`.intro` 글자 크기가 `20px`이다"
      },
      {
        "kind": "text",
        "selector": "h1",
        "equals": "나의 블로그",
        "label": "HTML 내용은 그대로다"
      }
    ]
  },
  {
    "id": "css_q17",
    "title": "CSS 2. class와 id 선택자",
    "category": "선택자",
    "difficulty": "basic",
    "type": "coding",
    "language": "css",
    "description": "id와 class로 특정 요소만 골라서 꾸미세요.",
    "constraints": [
      "`id=\"title\"`인 제목의 글자 굵기(`font-weight`)를 `800`으로 바꾸세요.",
      "`class=\"highlight\"`인 글자에 노란색(`yellow`) 배경을 주세요.",
      "HTML 부분은 고치지 마세요."
    ],
    "examples": [
      {
        "input": "미리보기",
        "output": "공지사항 (아주 굵게)\n이번 주 [금요일](노란 배경)은 쉽니다."
      }
    ],
    "initialCode": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>class와 id</title>\n  <style>\n    /* 여기에 CSS를 작성하세요 */\n\n  </style>\n</head>\n<body>\n  <h1 id=\"title\">공지사항</h1>\n  <p>이번 주 <span class=\"highlight\">금요일</span>은 쉽니다.</p>\n\n</body>\n</html>\n",
    "webChecks": [
      {
        "kind": "style",
        "selector": "#title",
        "property": "font-weight",
        "equals": "800",
        "label": "`#title` 굵기가 `800`이다"
      },
      {
        "kind": "style",
        "selector": ".highlight",
        "property": "background-color",
        "equals": "yellow",
        "label": "`.highlight` 배경이 노란색이다"
      },
      {
        "kind": "style",
        "selector": "p",
        "property": "background-color",
        "equals": "yellow",
        "negate": true,
        "label": "문단 전체에는 배경이 없다"
      }
    ]
  },
  {
    "id": "css_q3",
    "title": "CSS 3. 자손 선택자",
    "category": "선택자",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "css",
    "description": "메뉴 안의 링크만 초록색으로 바꾸세요. 메뉴 바깥의 링크는 그대로 두어야 합니다.",
    "constraints": [
      "`.menu` 안에 있는 `a`만 글자 색을 `green`으로 바꾸세요.",
      "`.outside` 링크는 색이 바뀌면 안 됩니다.",
      "`class`를 새로 추가하지 말고 선택자로 해결하세요."
    ],
    "examples": [
      {
        "input": "미리보기",
        "output": "홈 소개 (초록)\n바깥 링크 (원래 색)"
      }
    ],
    "initialCode": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>자손 선택자</title>\n  <style>\n    /* 여기에 CSS를 작성하세요 */\n\n  </style>\n</head>\n<body>\n  <nav class=\"menu\">\n    <a href=\"#\">홈</a>\n    <a href=\"#\">소개</a>\n  </nav>\n  <p><a href=\"#\" class=\"outside\">바깥 링크</a></p>\n\n</body>\n</html>\n",
    "webChecks": [
      {
        "kind": "style",
        "selector": ".menu a:nth-child(1)",
        "property": "color",
        "equals": "green",
        "label": "메뉴 첫 링크가 초록색이다"
      },
      {
        "kind": "style",
        "selector": ".menu a:nth-child(2)",
        "property": "color",
        "equals": "green",
        "label": "메뉴 둘째 링크가 초록색이다"
      },
      {
        "kind": "exists",
        "selector": ".outside",
        "label": "`.outside` 링크가 그대로 있다"
      },
      {
        "kind": "style",
        "selector": ".outside",
        "property": "color",
        "equals": "green",
        "negate": true,
        "label": "`.outside` 링크는 초록색이 아니다"
      }
    ]
  },
  {
    "id": "css_q4",
    "title": "CSS 4. 안쪽 여백과 테두리",
    "category": "박스 모델",
    "difficulty": "basic",
    "type": "coding",
    "language": "css",
    "description": "모든 요소는 상자(박스)입니다. 카드에 안쪽 여백, 테두리, 바깥 여백을 주세요.",
    "constraints": [
      "`.card`의 안쪽 여백(`padding`)을 `20px`로",
      "`2px` 두께의 검은 실선(`solid`) 테두리(`border`)",
      "바깥 여백(`margin`)을 `16px`로"
    ],
    "examples": [
      {
        "input": "미리보기",
        "output": "┌────────────┐\n│  카드 내용  │\n└────────────┘"
      }
    ],
    "initialCode": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>박스 모델</title>\n  <style>\n    /* 여기에 CSS를 작성하세요 */\n\n  </style>\n</head>\n<body>\n  <div class=\"card\">카드 내용</div>\n\n</body>\n</html>\n",
    "webChecks": [
      {
        "kind": "style",
        "selector": ".card",
        "property": "padding-top",
        "equals": "20px",
        "label": "안쪽 여백이 `20px`이다"
      },
      {
        "kind": "style",
        "selector": ".card",
        "property": "border-top-width",
        "equals": "2px",
        "label": "테두리 두께가 `2px`이다"
      },
      {
        "kind": "style",
        "selector": ".card",
        "property": "border-top-style",
        "equals": "solid",
        "label": "테두리가 실선이다"
      },
      {
        "kind": "style",
        "selector": ".card",
        "property": "margin-top",
        "equals": "16px",
        "label": "바깥 여백이 `16px`이다"
      }
    ]
  },
  {
    "id": "css_q5",
    "title": "CSS 5. 정확히 200px 상자",
    "category": "박스 모델",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "css",
    "description": "`width: 200px`를 줬는데 화면에서는 상자가 250px입니다. padding과 border가 바깥에 더해지기 때문입니다. 실제 너비가 정확히 200px이 되게 고치세요.",
    "constraints": [
      "이미 작성된 `.box` 규칙은 고치지 마세요.",
      "`box-sizing` 속성을 사용하세요."
    ],
    "examples": [
      {
        "input": "미리보기",
        "output": "테두리까지 포함해 정확히 200px인 상자"
      }
    ],
    "initialCode": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>box-sizing</title>\n  <style>\n    .box {\n      width: 200px;\n      padding: 20px;\n      border: 5px solid #8b5cf6;\n    }\n\n    /* 여기에 CSS를 작성하세요 */\n\n  </style>\n</head>\n<body>\n  <div class=\"box\">200px 상자</div>\n\n</body>\n</html>\n",
    "webChecks": [
      {
        "kind": "size",
        "selector": ".box",
        "width": 200,
        "label": "상자의 실제 너비가 `200px`이다"
      },
      {
        "kind": "style",
        "selector": ".box",
        "property": "box-sizing",
        "equals": "border-box",
        "label": "`box-sizing: border-box`를 썼다"
      }
    ]
  },
  {
    "id": "css_q6",
    "title": "CSS 6. 글자 꾸미기",
    "category": "텍스트",
    "difficulty": "basic",
    "type": "coding",
    "language": "css",
    "description": "제목과 명언 문장을 꾸미세요.",
    "constraints": [
      "`h2`의 글자 사이 간격(`letter-spacing`)을 `2px`로",
      "`h2`에 밑줄(`text-decoration: underline`)",
      "`.quote`를 기울임꼴(`font-style: italic`)로"
    ],
    "examples": [
      {
        "input": "미리보기",
        "output": "오 늘 의 명 언 (밑줄)\n천 리 길도 한 걸음부터 (기울임)"
      }
    ],
    "initialCode": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>글자 꾸미기</title>\n  <style>\n    /* 여기에 CSS를 작성하세요 */\n\n  </style>\n</head>\n<body>\n  <h2>오늘의 명언</h2>\n  <p class=\"quote\">천 리 길도 한 걸음부터</p>\n\n</body>\n</html>\n",
    "webChecks": [
      {
        "kind": "style",
        "selector": "h2",
        "property": "letter-spacing",
        "equals": "2px",
        "label": "`h2` 글자 간격이 `2px`이다"
      },
      {
        "kind": "style",
        "selector": "h2",
        "property": "text-decoration-line",
        "equals": "underline",
        "label": "`h2`에 밑줄이 있다"
      },
      {
        "kind": "style",
        "selector": ".quote",
        "property": "font-style",
        "equals": "italic",
        "label": "`.quote`가 기울임꼴이다"
      }
    ]
  },
  {
    "id": "css_q7",
    "title": "CSS 7. 둥근 배지",
    "category": "배경",
    "difficulty": "basic",
    "type": "coding",
    "language": "css",
    "description": "보라색 배경에 흰 글자, 모서리가 둥근 배지를 만드세요.",
    "constraints": [
      "배경색은 `#8b5cf6`",
      "글자 색은 `white`",
      "모서리 둥글기(`border-radius`)는 `12px`"
    ],
    "examples": [
      {
        "input": "미리보기",
        "output": "(NEW) ← 보라색 둥근 배지"
      }
    ],
    "initialCode": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>배지</title>\n  <style>\n    .badge {\n      padding: 4px 12px;\n    }\n\n    /* 여기에 CSS를 작성하세요 */\n\n  </style>\n</head>\n<body>\n  <span class=\"badge\">NEW</span>\n\n</body>\n</html>\n",
    "webChecks": [
      {
        "kind": "style",
        "selector": ".badge",
        "property": "background-color",
        "equals": "#8b5cf6",
        "label": "배경색이 `#8b5cf6`이다"
      },
      {
        "kind": "style",
        "selector": ".badge",
        "property": "color",
        "equals": "white",
        "label": "글자 색이 흰색이다"
      },
      {
        "kind": "style",
        "selector": ".badge",
        "property": "border-top-left-radius",
        "equals": "12px",
        "label": "모서리 둥글기가 `12px`이다"
      }
    ]
  },
  {
    "id": "css_q8",
    "title": "CSS 8. 카드에 그림자 주기",
    "category": "그림자",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "css",
    "description": "카드가 살짝 떠 보이도록 그림자를 주세요.",
    "constraints": [
      "`box-shadow`를 사용하세요.",
      "가로 `0`, 세로 `4px`, 흐림 `12px`, 색 `rgba(0, 0, 0, 0.2)`"
    ],
    "examples": [
      {
        "input": "미리보기",
        "output": "아래쪽으로 은은한 그림자가 있는 카드"
      }
    ],
    "initialCode": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>그림자</title>\n  <style>\n    .card {\n      padding: 24px;\n      margin: 24px;\n      background: white;\n    }\n\n    /* 여기에 CSS를 작성하세요 */\n\n  </style>\n</head>\n<body>\n  <div class=\"card\">그림자 카드</div>\n\n</body>\n</html>\n",
    "webChecks": [
      {
        "kind": "style",
        "selector": ".card",
        "property": "box-shadow",
        "equals": "0 4px 12px rgba(0, 0, 0, 0.2)",
        "label": "그림자가 `0 4px 12px rgba(0, 0, 0, 0.2)`이다"
      }
    ]
  },
  {
    "id": "css_q2",
    "title": "CSS 9. 상자 가로로 늘어놓기",
    "category": "Flexbox",
    "difficulty": "basic",
    "type": "coding",
    "language": "css",
    "description": "세로로 쌓여 있는 상자 세 개를 Flexbox로 가로로 늘어놓으세요.",
    "constraints": [
      "`.container`에 `display: flex`를 적용하세요.",
      "상자 사이 간격(`gap`)을 `16px`로 만드세요.",
      "HTML 부분은 고치지 마세요."
    ],
    "examples": [
      {
        "input": "미리보기",
        "output": "[1] [2] [3] 이 한 줄에 16px 간격으로"
      }
    ],
    "initialCode": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>상자 늘어놓기</title>\n  <style>\n    .box {\n      width: 80px;\n      height: 80px;\n      background: #8b5cf6;\n      color: white;\n    }\n\n    /* 여기에 CSS를 작성하세요 */\n\n  </style>\n</head>\n<body>\n  <div class=\"container\">\n    <div class=\"box\">1</div>\n    <div class=\"box\">2</div>\n    <div class=\"box\">3</div>\n  </div>\n\n</body>\n</html>\n",
    "webChecks": [
      {
        "kind": "style",
        "selector": ".container",
        "property": "display",
        "equals": "flex",
        "label": "`.container`가 `display: flex`이다"
      },
      {
        "kind": "layout",
        "selector": ".container > .box",
        "direction": "row",
        "label": "상자 세 개가 한 줄로 늘어섰다"
      },
      {
        "kind": "style",
        "selector": ".container",
        "property": "column-gap",
        "equals": "16px",
        "label": "상자 사이 간격이 `16px`이다"
      }
    ]
  },
  {
    "id": "css_q10",
    "title": "CSS 10. 정가운데 놓기",
    "category": "Flexbox",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "css",
    "description": "상자를 회색 영역의 가로·세로 정가운데에 놓으세요. 웹에서 가장 자주 쓰는 배치입니다.",
    "constraints": [
      "`.stage`에 Flexbox를 적용하세요.",
      "가로 가운데: `justify-content`",
      "세로 가운데: `align-items`"
    ],
    "examples": [
      {
        "input": "미리보기",
        "output": "회색 영역 정가운데에 보라색 상자"
      }
    ],
    "initialCode": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>가운데 정렬</title>\n  <style>\n    .stage {\n      height: 200px;\n      background: #f4f4f6;\n    }\n    .box {\n      padding: 16px;\n      background: #8b5cf6;\n      color: white;\n    }\n\n    /* 여기에 CSS를 작성하세요 */\n\n  </style>\n</head>\n<body>\n  <div class=\"stage\">\n    <div class=\"box\">가운데</div>\n  </div>\n\n</body>\n</html>\n",
    "webChecks": [
      {
        "kind": "style",
        "selector": ".stage",
        "property": "display",
        "equals": "flex",
        "label": "`.stage`가 `display: flex`이다"
      },
      {
        "kind": "style",
        "selector": ".stage",
        "property": "justify-content",
        "equals": "center",
        "label": "가로 가운데 정렬 (`justify-content: center`)"
      },
      {
        "kind": "style",
        "selector": ".stage",
        "property": "align-items",
        "equals": "center",
        "label": "세로 가운데 정렬 (`align-items: center`)"
      }
    ]
  },
  {
    "id": "css_q11",
    "title": "CSS 11. 양 끝으로 벌리기",
    "category": "Flexbox",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "css",
    "description": "로고는 왼쪽 끝, 로그인은 오른쪽 끝에 오도록 상단 메뉴를 만드세요.",
    "constraints": [
      "`.nav`에 Flexbox를 적용하세요.",
      "`justify-content`로 두 링크를 양 끝으로 벌리세요."
    ],
    "examples": [
      {
        "input": "미리보기",
        "output": "로고                         로그인"
      }
    ],
    "initialCode": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>내비게이션</title>\n  <style>\n    .nav {\n      padding: 12px;\n      background: #1a1a1a;\n    }\n    .nav a {\n      color: white;\n    }\n\n    /* 여기에 CSS를 작성하세요 */\n\n  </style>\n</head>\n<body>\n  <nav class=\"nav\">\n    <a href=\"#\">로고</a>\n    <a href=\"#\">로그인</a>\n  </nav>\n\n</body>\n</html>\n",
    "webChecks": [
      {
        "kind": "layout",
        "selector": ".nav > a",
        "direction": "row",
        "label": "두 링크가 한 줄에 있다"
      },
      {
        "kind": "style",
        "selector": ".nav",
        "property": "justify-content",
        "equals": "space-between",
        "label": "양 끝 정렬 (`justify-content: space-between`)"
      }
    ]
  },
  {
    "id": "css_q12",
    "title": "CSS 12. 3열 그리드",
    "category": "Grid",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "css",
    "description": "상자 여섯 개를 3열짜리 바둑판으로 배치하세요.",
    "constraints": [
      "`.grid`에 `display: grid`를 적용하세요.",
      "`grid-template-columns`로 같은 너비의 열 3개를 만드세요. (`repeat(3, 1fr)`)",
      "칸 사이 간격은 `10px`"
    ],
    "examples": [
      {
        "input": "미리보기",
        "output": "[1] [2] [3]\n[4] [5] [6]"
      }
    ],
    "initialCode": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>그리드</title>\n  <style>\n    .item {\n      padding: 20px;\n      background: #8b5cf6;\n      color: white;\n    }\n\n    /* 여기에 CSS를 작성하세요 */\n\n  </style>\n</head>\n<body>\n  <div class=\"grid\">\n    <div class=\"item\">1</div>\n    <div class=\"item\">2</div>\n    <div class=\"item\">3</div>\n    <div class=\"item\">4</div>\n    <div class=\"item\">5</div>\n    <div class=\"item\">6</div>\n  </div>\n\n</body>\n</html>\n",
    "webChecks": [
      {
        "kind": "style",
        "selector": ".grid",
        "property": "display",
        "equals": "grid",
        "label": "`.grid`가 `display: grid`이다"
      },
      {
        "kind": "layout",
        "selector": ".grid > .item:nth-child(-n+3)",
        "direction": "row",
        "label": "1~3번이 첫 줄에 있다"
      },
      {
        "kind": "layout",
        "selector": ".grid > .item:nth-child(n+4)",
        "direction": "row",
        "label": "4~6번이 둘째 줄에 있다"
      },
      {
        "kind": "layout",
        "selector": ".grid > .item:nth-child(3n+1)",
        "direction": "column",
        "label": "1번과 4번이 같은 열에 있다"
      },
      {
        "kind": "style",
        "selector": ".grid",
        "property": "row-gap",
        "equals": "10px",
        "label": "칸 사이 간격이 `10px`이다"
      }
    ]
  },
  {
    "id": "css_q13",
    "title": "CSS 13. 구석에 배지 붙이기",
    "category": "position",
    "difficulty": "advanced",
    "type": "coding",
    "language": "css",
    "description": "`SALE` 배지를 카드의 오른쪽 위 구석에 딱 붙이세요.",
    "constraints": [
      "카드(`.card`)를 기준점으로 만드세요. (`position: relative`)",
      "배지(`.badge`)는 `position: absolute`로 띄우세요.",
      "배지를 위쪽 `0`, 오른쪽 `0`에 놓으세요."
    ],
    "examples": [
      {
        "input": "미리보기",
        "output": "┌──────────[SALE]┐\n│ 상품 카드       │\n└────────────────┘"
      }
    ],
    "initialCode": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>위치 지정</title>\n  <style>\n    .card {\n      width: 200px;\n      height: 120px;\n      background: #f4f4f6;\n    }\n    .badge {\n      background: #cf222e;\n      color: white;\n      padding: 2px 8px;\n    }\n\n    /* 여기에 CSS를 작성하세요 */\n\n  </style>\n</head>\n<body>\n  <div class=\"card\">\n    상품 카드\n    <span class=\"badge\">SALE</span>\n  </div>\n\n</body>\n</html>\n",
    "webChecks": [
      {
        "kind": "style",
        "selector": ".card",
        "property": "position",
        "equals": "relative",
        "label": "카드가 `position: relative`이다"
      },
      {
        "kind": "style",
        "selector": ".badge",
        "property": "position",
        "equals": "absolute",
        "label": "배지가 `position: absolute`이다"
      },
      {
        "kind": "style",
        "selector": ".badge",
        "property": "top",
        "equals": "0px",
        "label": "배지가 위쪽 `0`에 있다"
      },
      {
        "kind": "style",
        "selector": ".badge",
        "property": "right",
        "equals": "0px",
        "label": "배지가 오른쪽 `0`에 있다"
      }
    ]
  },
  {
    "id": "css_q14",
    "title": "CSS 14. 부드럽게 바뀌기",
    "category": "전환",
    "difficulty": "advanced",
    "type": "coding",
    "language": "css",
    "description": "버튼 색이 부드럽게 바뀌도록 전환 효과를 주고, 화살표를 90도 돌리세요.",
    "constraints": [
      "`.btn`의 `transition`을 `background-color 0.3s`로",
      "`.btn:hover`일 때 배경색을 `#8b5cf6`로",
      "`.arrow`를 `transform: rotate(90deg)`로 회전"
    ],
    "examples": [
      {
        "input": "미리보기",
        "output": "버튼에 마우스를 올리면 색이 0.3초 동안 바뀜\n➜ 가 아래를 향함"
      }
    ],
    "initialCode": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>변형과 전환</title>\n  <style>\n    .arrow {\n      width: 40px;\n      font-size: 32px;\n    }\n\n    /* 여기에 CSS를 작성하세요 */\n\n  </style>\n</head>\n<body>\n  <button class=\"btn\">마우스를 올려 보세요</button>\n  <div class=\"arrow\">➜</div>\n\n</body>\n</html>\n",
    "webChecks": [
      {
        "kind": "style",
        "selector": ".btn",
        "property": "transition-duration",
        "equals": "0.3s",
        "label": "전환 시간이 `0.3s`이다"
      },
      {
        "kind": "style",
        "selector": ".btn",
        "property": "transition-property",
        "equals": "background-color",
        "label": "전환 대상이 `background-color`이다"
      },
      {
        "kind": "style",
        "selector": ".arrow",
        "property": "transform",
        "equals": "rotate(90deg)",
        "label": "화살표가 90도 회전했다"
      }
    ]
  },
  {
    "id": "css_q15",
    "title": "CSS 15. CSS 변수로 색 관리하기",
    "category": "모던 CSS",
    "difficulty": "advanced",
    "type": "coding",
    "language": "css",
    "description": "테마 색을 변수 하나로 관리하세요. 변수 값만 바꾸면 사이트 전체 색이 한꺼번에 바뀝니다.",
    "constraints": [
      "`:root`에 `--main-color: #8b5cf6;`를 선언하세요.",
      "`.title`의 글자 색과 `.btn`의 배경색에 `var(--main-color)`를 쓰세요.",
      "색 값을 직접 두 번 쓰지 말고 변수를 쓰세요."
    ],
    "examples": [
      {
        "input": "미리보기",
        "output": "보라색 제목\n보라색 버튼"
      }
    ],
    "initialCode": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>CSS 변수</title>\n  <style>\n    /* 여기에 CSS를 작성하세요 */\n\n  </style>\n</head>\n<body>\n  <h1 class=\"title\">테마 색</h1>\n  <button class=\"btn\">확인</button>\n\n</body>\n</html>\n",
    "webChecks": [
      {
        "kind": "style",
        "selector": ".title",
        "property": "color",
        "equals": "#8b5cf6",
        "label": "제목 글자 색이 `#8b5cf6`이다"
      },
      {
        "kind": "style",
        "selector": ".btn",
        "property": "background-color",
        "equals": "#8b5cf6",
        "label": "버튼 배경색이 `#8b5cf6`이다"
      }
    ]
  },
  {
    "id": "css_q16",
    "title": "CSS 16. 프로필 카드 완성하기",
    "category": "종합",
    "difficulty": "advanced",
    "type": "coding",
    "language": "css",
    "description": "HTML 단원에서 만든 자기소개 카드를 CSS로 완성하세요.",
    "constraints": [
      "`.profile`: Flexbox로 사진과 글을 가로 배치, 세로 가운데 정렬, 간격 `16px`",
      "`.profile`: 안쪽 여백 `24px`, 모서리 `16px`, 그림자는 자유롭게",
      "`.avatar`: `border-radius: 50%`로 동그랗게"
    ],
    "examples": [
      {
        "input": "미리보기",
        "output": "(●) 김철수\n    파이썬과 웹을 공부하는 학생입니다."
      }
    ],
    "initialCode": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>프로필 카드</title>\n  <style>\n    .avatar {\n      width: 64px;\n      height: 64px;\n      background: #ddd6fe;\n    }\n\n    /* 여기에 CSS를 작성하세요 */\n\n  </style>\n</head>\n<body>\n  <section class=\"profile\">\n    <img src=\"me.png\" alt=\"프로필 사진\" class=\"avatar\">\n    <div>\n      <h2>김철수</h2>\n      <p>파이썬과 웹을 공부하는 학생입니다.</p>\n    </div>\n  </section>\n\n</body>\n</html>\n",
    "webChecks": [
      {
        "kind": "layout",
        "selector": ".profile > *",
        "direction": "row",
        "label": "사진과 글이 가로로 놓였다"
      },
      {
        "kind": "style",
        "selector": ".profile",
        "property": "align-items",
        "equals": "center",
        "label": "세로 가운데 정렬이다"
      },
      {
        "kind": "style",
        "selector": ".profile",
        "property": "column-gap",
        "equals": "16px",
        "label": "사진과 글 사이 간격이 `16px`이다"
      },
      {
        "kind": "style",
        "selector": ".profile",
        "property": "padding-left",
        "equals": "24px",
        "label": "안쪽 여백이 `24px`이다"
      },
      {
        "kind": "style",
        "selector": ".profile",
        "property": "border-top-left-radius",
        "equals": "16px",
        "label": "모서리 둥글기가 `16px`이다"
      },
      {
        "kind": "style",
        "selector": ".profile",
        "property": "box-shadow",
        "equals": "none",
        "negate": true,
        "label": "그림자가 있다"
      },
      {
        "kind": "style",
        "selector": ".avatar",
        "property": "border-top-left-radius",
        "equals": "50%",
        "label": "사진이 동그랗다"
      }
    ]
  },
  {
    "id": "css_quiz_1",
    "title": "CSS 17. 누가 이길까",
    "category": "선택자",
    "difficulty": "basic",
    "type": "quiz",
    "language": "css",
    "description": "<p id=\"a\" class=\"b\">글자</p>에 아래 세 규칙이 모두 적용될 때 글자 색은?\n\np { color: red; }\n.b { color: green; }\n#a { color: blue; }",
    "constraints": [
      "보기 중 정답 하나를 선택하세요."
    ],
    "examples": [
      {
        "input": "보기 중 선택",
        "output": "선택 즉시 정답/오답 확인"
      }
    ],
    "quizQuestion": "<p id=\"a\" class=\"b\">글자</p>에 아래 세 규칙이 모두 적용될 때 글자 색은?\n\np { color: red; }\n.b { color: green; }\n#a { color: blue; }",
    "quizOptions": [
      "red",
      "green",
      "blue",
      "세 색이 섞인다"
    ],
    "correctAnswerIndex": "Mg=="
  },
  {
    "id": "css_fill_1",
    "title": "CSS 18. 세로로 쌓기",
    "category": "Flexbox",
    "difficulty": "intermediate",
    "type": "fill",
    "language": "css",
    "description": "빈칸에 들어갈 정확한 코드를 입력하세요.",
    "constraints": [
      "철자를 정확히 입력하세요."
    ],
    "examples": [
      {
        "input": "빈칸 입력",
        "output": "입력 즉시 정답/오답 확인"
      }
    ],
    "fillQuestion": ".container {\n  display: flex;\n  _____: column;\n}\n\nflex 자식들을 세로로 쌓으려면?",
    "correctAnswerText": "ZmxleC1kaXJlY3Rpb24=",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "css_fill_2",
    "title": "CSS 19. 그리드 열 나누기",
    "category": "Grid",
    "difficulty": "intermediate",
    "type": "fill",
    "language": "css",
    "description": "빈칸에 들어갈 정확한 코드를 입력하세요.",
    "constraints": [
      "철자를 정확히 입력하세요."
    ],
    "examples": [
      {
        "input": "빈칸 입력",
        "output": "입력 즉시 정답/오답 확인"
      }
    ],
    "fillQuestion": ".grid {\n  display: grid;\n  grid-template-columns: repeat(4, _____);\n}\n\n같은 너비의 열 4개를 만들려면? (남은 공간의 한 몫을 뜻하는 단위)",
    "correctAnswerText": "MWZy",
    "placeholderText": "정답 입력..."
  },
  {
    "id": "css_quiz_2",
    "title": "CSS 20. 반응형",
    "category": "반응형",
    "difficulty": "intermediate",
    "type": "quiz",
    "language": "css",
    "description": "화면 너비가 600px 이하일 때만 적용되는 CSS를 쓰려면?",
    "constraints": [
      "보기 중 정답 하나를 선택하세요."
    ],
    "examples": [
      {
        "input": "보기 중 선택",
        "output": "선택 즉시 정답/오답 확인"
      }
    ],
    "quizQuestion": "화면 너비가 600px 이하일 때만 적용되는 CSS를 쓰려면?",
    "quizOptions": [
      "@media (max-width: 600px) { ... }",
      "@media (min-width: 600px) { ... }",
      "@screen 600px { ... }",
      "@width (600px) { ... }"
    ],
    "correctAnswerIndex": "MA=="
  },
  {
    "id": "prac_1",
    "title": "실전 1. 출석부 정리",
    "category": "실전",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "algorithm",
    "description": "동아리 회장 민지는 한 달 동안 모임에 온 사람의 이름을 온 순서대로 적어 두었습니다. 같은 사람이 여러 번 적혀 있습니다. 회원 명단을 만들려고 합니다.\n\n기록 `names`가 주어질 때, 처음 온 순서를 유지하면서 각 사람이 **한 번씩만** 들어 있는 리스트를 반환하세요.\n\n(난이도: 프로그래머스 Lv.1 수준)",
    "constraints": [
      "`names`의 길이는 1 이상 100,000 이하입니다.",
      "이름은 1~6글자 문자열입니다.",
      "정확성 테스트를 통과하면, 제한사항의 최대 크기 입력으로 **효율성 테스트**를 합니다."
    ],
    "examples": [
      {
        "input": "solution(['민지', '수호', '민지', '하린', '수호'])",
        "output": "['민지', '수호', '하린']"
      }
    ],
    "initialCode": "def solution(names):\n    answer = None\n    return answer\n",
    "testCases": [
      {
        "input": "solution(['민지', '수호', '민지', '하린', '수호'])",
        "expected": "Wyfrr7zsp4AnLCAn7IiY7Zi4JywgJ+2VmOumsCdd"
      },
      {
        "input": "solution(['도윤'])",
        "expected": "Wyfrj4TsnKQnXQ=="
      },
      {
        "input": "solution(['아영', '아영', '아영'])",
        "expected": "WyfslYTsmIEnXQ=="
      },
      {
        "input": "solution(['c', 'b', 'a', 'b', 'c'])",
        "expected": "WydjJywgJ2InLCAnYSdd"
      }
    ],
    "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n",
    "perfTests": [
      "solution([f'회원{i % 50000}' for i in range(100000)])"
    ]
  },
  {
    "id": "prac_2",
    "title": "실전 2. 가장 많이 팔린 메뉴",
    "category": "실전",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "algorithm",
    "description": "분식집 사장님은 하루 동안 들어온 주문을 메뉴 이름으로 기록합니다. 내일 재료를 넉넉히 준비할 메뉴를 고르려 합니다.\n\n주문 기록 `orders`가 주어질 때, 가장 많이 주문된 메뉴를 반환하세요. 주문 수가 같은 메뉴가 여럿이면 **사전 순으로 가장 앞서는** 메뉴를 반환합니다.\n\n(난이도: 프로그래머스 Lv.1 수준)",
    "constraints": [
      "`orders`의 길이는 1 이상 100,000 이하입니다.",
      "메뉴의 종류는 최대 5,000가지입니다.",
      "정확성 테스트를 통과하면, 제한사항의 최대 크기 입력으로 **효율성 테스트**를 합니다."
    ],
    "examples": [
      {
        "input": "solution(['떡볶이', '순대', '떡볶이', '튀김', '순대', '떡볶이'])",
        "output": "떡볶이"
      }
    ],
    "initialCode": "def solution(orders):\n    answer = None\n    return answer\n",
    "testCases": [
      {
        "input": "solution(['떡볶이', '순대', '떡볶이', '튀김', '순대', '떡볶이'])",
        "expected": "65ah67O27J20"
      },
      {
        "input": "solution(['김밥', '라면', '라면', '김밥'])",
        "expected": "6rmA67Cl"
      },
      {
        "input": "solution(['어묵'])",
        "expected": "7Ja066y1"
      },
      {
        "input": "solution(['b', 'a', 'c'])",
        "expected": "YQ=="
      }
    ],
    "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n",
    "perfTests": [
      "solution([f'메뉴{(i * 7) % 5000}' for i in range(100000)])"
    ]
  },
  {
    "id": "prac_3",
    "title": "실전 3. 연속 휴가 최고 방문객",
    "category": "실전",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "algorithm",
    "description": "놀이공원은 하루 방문객 수를 매일 기록합니다. 직원들에게 k일 연속 휴가를 주는데, 방문객이 가장 많은 k일 동안에는 휴가를 주지 않으려 합니다.\n\n하루 방문객 수 `visitors`와 휴가 일수 `k`가 주어질 때, **연속한 k일** 방문객 합의 최댓값을 반환하세요.\n\n(난이도: 프로그래머스 Lv.2 수준)",
    "constraints": [
      "`visitors`의 길이는 1 이상 100,000 이하입니다.",
      "`k`는 1 이상 `visitors`의 길이 이하입니다.",
      "하루 방문객 수는 0 이상 10,000 이하입니다.",
      "정확성 테스트를 통과하면, 제한사항의 최대 크기 입력으로 **효율성 테스트**를 합니다."
    ],
    "examples": [
      {
        "input": "solution([3, 8, 1, 9, 4, 6], 2)",
        "output": "13"
      }
    ],
    "initialCode": "def solution(visitors, k):\n    answer = None\n    return answer\n",
    "testCases": [
      {
        "input": "solution([3, 8, 1, 9, 4, 6], 2)",
        "expected": "MTM="
      },
      {
        "input": "solution([5, 5, 5], 3)",
        "expected": "MTU="
      },
      {
        "input": "solution([7], 1)",
        "expected": "Nw=="
      },
      {
        "input": "solution([1, 2, 3, 100, 1, 2], 3)",
        "expected": "MTA1"
      },
      {
        "input": "solution([0, 0, 0, 0], 2)",
        "expected": "MA=="
      }
    ],
    "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n",
    "perfTests": [
      "solution([(i * 37) % 10001 for i in range(100000)], 50000)"
    ]
  },
  {
    "id": "prac_4",
    "title": "실전 4. 괄호 검사기",
    "category": "실전",
    "difficulty": "advanced",
    "type": "coding",
    "language": "algorithm",
    "description": "코드 편집기에 괄호가 제대로 짝지어졌는지 검사하는 기능을 넣으려 합니다. 괄호는 `()`, `[]`, `{}` 세 종류이며, 여는 괄호는 같은 종류의 닫는 괄호로, 올바른 순서로 닫혀야 합니다.\n\n괄호로만 이루어진 문자열 `s`가 주어질 때, 올바르게 짝지어졌으면 `True`, 아니면 `False`를 반환하세요.\n\n(난이도: 프로그래머스 Lv.2 수준)",
    "constraints": [
      "`s`의 길이는 1 이상 200,000 이하입니다.",
      "`s`는 `()[]{}` 문자로만 이루어져 있습니다.",
      "정확성 테스트를 통과하면, 제한사항의 최대 크기 입력으로 **효율성 테스트**를 합니다."
    ],
    "examples": [
      {
        "input": "solution('([]{})')",
        "output": "True"
      }
    ],
    "initialCode": "def solution(s):\n    answer = None\n    return answer\n",
    "testCases": [
      {
        "input": "solution('([]{})')",
        "expected": "VHJ1ZQ=="
      },
      {
        "input": "solution('([)]')",
        "expected": "RmFsc2U="
      },
      {
        "input": "solution('((')",
        "expected": "RmFsc2U="
      },
      {
        "input": "solution('}{')",
        "expected": "RmFsc2U="
      },
      {
        "input": "solution('{[()()]}')",
        "expected": "VHJ1ZQ=="
      },
      {
        "input": "solution(')')",
        "expected": "RmFsc2U="
      }
    ],
    "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n",
    "perfTests": [
      "solution('([{' * 33333 + '}])' * 33333)",
      "solution('()' * 100000)"
    ]
  },
  {
    "id": "prac_5",
    "title": "실전 5. 회의실 하나로 최대한",
    "category": "실전",
    "difficulty": "advanced",
    "type": "coding",
    "language": "algorithm",
    "description": "학교에는 빈 회의실이 하나뿐입니다. 여러 동아리가 사용 시간을 신청했고, 시간이 겹치는 신청은 함께 받을 수 없습니다. 한 회의가 끝나는 시각에 다음 회의가 바로 시작하는 것은 괜찮습니다.\n\n신청 목록 `meetings`가 `[시작, 끝]` 형태로 주어질 때, 받아들일 수 있는 회의의 **최대 개수**를 반환하세요.\n\n(난이도: 프로그래머스 Lv.2 수준)",
    "constraints": [
      "`meetings`의 길이는 1 이상 100,000 이하입니다.",
      "0 ≤ 시작 < 끝 ≤ 1,000,000",
      "정확성 테스트를 통과하면, 제한사항의 최대 크기 입력으로 **효율성 테스트**를 합니다."
    ],
    "examples": [
      {
        "input": "solution([[1, 4], [3, 5], [0, 6], [5, 7], [8, 9], [5, 9]])",
        "output": "3"
      }
    ],
    "initialCode": "def solution(meetings):\n    answer = None\n    return answer\n",
    "testCases": [
      {
        "input": "solution([[1, 4], [3, 5], [0, 6], [5, 7], [8, 9], [5, 9]])",
        "expected": "Mw=="
      },
      {
        "input": "solution([[1, 2], [2, 3], [3, 4]])",
        "expected": "Mw=="
      },
      {
        "input": "solution([[0, 10]])",
        "expected": "MQ=="
      },
      {
        "input": "solution([[1, 10], [2, 3], [4, 5]])",
        "expected": "Mg=="
      },
      {
        "input": "solution([[5, 6], [1, 2], [3, 4]])",
        "expected": "Mw=="
      }
    ],
    "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n",
    "perfTests": [
      "solution([[(i * 37) % 900000, (i * 37) % 900000 + (i % 50) + 1] for i in range(100000)])"
    ]
  },
  {
    "id": "prac_6",
    "title": "실전 6. 미로 탈출",
    "category": "실전",
    "difficulty": "advanced",
    "type": "coding",
    "language": "algorithm",
    "description": "방탈출 카페의 미로는 칸으로 나뉘어 있습니다. `.`은 지나갈 수 있는 칸, `#`은 벽입니다. 왼쪽 위 칸에서 출발해 오른쪽 아래 칸으로 나가야 하며, 한 번에 상하좌우로 한 칸씩 움직입니다.\n\n미로 `maze`(문자열 리스트)가 주어질 때, 출구까지 가는 **가장 적은 이동 횟수**를 반환하세요. 갈 수 없으면 `-1`을 반환합니다.\n\n(난이도: 프로그래머스 Lv.2 수준)",
    "constraints": [
      "`maze`의 크기는 1×1 이상 200×200 이하입니다.",
      "출발 칸과 출구 칸은 항상 `.`입니다.",
      "정확성 테스트를 통과하면, 제한사항의 최대 크기 입력으로 **효율성 테스트**를 합니다."
    ],
    "examples": [
      {
        "input": "solution(['..#', '#..', '#..'])",
        "output": "4"
      }
    ],
    "initialCode": "def solution(maze):\n    answer = None\n    return answer\n",
    "testCases": [
      {
        "input": "solution(['..#', '#..', '#..'])",
        "expected": "NA=="
      },
      {
        "input": "solution(['.#', '#.'])",
        "expected": "LTE="
      },
      {
        "input": "solution(['.'])",
        "expected": "MA=="
      },
      {
        "input": "solution(['....', '###.', '....', '.###', '....'])",
        "expected": "MTM="
      }
    ],
    "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n",
    "perfTests": [
      "solution(['.' * 200] * 200)",
      "solution(['.' * 200 if r % 2 == 0 else ('#' * 199 + '.' if r % 4 == 1 else '.' + '#' * 199) for r in range(199)] + ['.' * 200])"
    ]
  },
  {
    "id": "prac_7",
    "title": "실전 7. 따뜻해지는 날까지",
    "category": "실전",
    "difficulty": "expert",
    "type": "coding",
    "language": "algorithm",
    "description": "일기 예보 앱에 '며칠 뒤에 오늘보다 따뜻해지나요?' 기능을 넣으려 합니다.\n\n날짜순 기온 리스트 `temps`가 주어질 때, 각 날짜마다 **처음으로 더 따뜻해지는 날까지 며칠을 기다려야 하는지**를 담은 리스트를 반환하세요. 그런 날이 없으면 0입니다.\n\n(난이도: 프로그래머스 Lv.2 수준)",
    "constraints": [
      "`temps`의 길이는 1 이상 100,000 이하입니다.",
      "기온은 -50 이상 50 이하의 정수입니다.",
      "정확성 테스트를 통과하면, 제한사항의 최대 크기 입력으로 **효율성 테스트**를 합니다."
    ],
    "examples": [
      {
        "input": "solution([23, 24, 25, 21, 19, 22, 26, 23])",
        "output": "[1, 1, 4, 2, 1, 1, 0, 0]"
      }
    ],
    "initialCode": "def solution(temps):\n    answer = None\n    return answer\n",
    "testCases": [
      {
        "input": "solution([23, 24, 25, 21, 19, 22, 26, 23])",
        "expected": "WzEsIDEsIDQsIDIsIDEsIDEsIDAsIDBd"
      },
      {
        "input": "solution([30, 30, 30])",
        "expected": "WzAsIDAsIDBd"
      },
      {
        "input": "solution([10])",
        "expected": "WzBd"
      },
      {
        "input": "solution([1, 2, 3, 4])",
        "expected": "WzEsIDEsIDEsIDBd"
      },
      {
        "input": "solution([4, 3, 2, 1])",
        "expected": "WzAsIDAsIDAsIDBd"
      }
    ],
    "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n",
    "perfTests": [
      "solution([50 - (i * 100 // 100000) for i in range(100000)])",
      "solution([(i % 101) - 50 for i in range(100000)])"
    ]
  },
  {
    "id": "prac_8",
    "title": "실전 8. 계단 오르는 방법",
    "category": "실전",
    "difficulty": "expert",
    "type": "coding",
    "language": "algorithm",
    "description": "한 번에 계단을 1칸 또는 2칸씩 오를 수 있습니다. n칸짜리 계단을 오르는 방법이 몇 가지인지 구하려 합니다. 예를 들어 3칸은 (1,1,1), (1,2), (2,1)의 3가지입니다.\n\n계단 수 `n`이 주어질 때, 오르는 방법의 수를 **1,000,000,007로 나눈 나머지**로 반환하세요.\n\n(난이도: 프로그래머스 Lv.2 수준)",
    "constraints": [
      "`n`은 1 이상 100,000 이하입니다.",
      "정확성 테스트를 통과하면, 제한사항의 최대 크기 입력으로 **효율성 테스트**를 합니다."
    ],
    "examples": [
      {
        "input": "solution(3)",
        "output": "3"
      }
    ],
    "initialCode": "def solution(n):\n    answer = None\n    return answer\n",
    "testCases": [
      {
        "input": "solution(3)",
        "expected": "Mw=="
      },
      {
        "input": "solution(1)",
        "expected": "MQ=="
      },
      {
        "input": "solution(2)",
        "expected": "Mg=="
      },
      {
        "input": "solution(10)",
        "expected": "ODk="
      },
      {
        "input": "solution(25)",
        "expected": "MTIxMzkz"
      }
    ],
    "testRunnerCode": "import json\nresults = []\nfor _call in test_cases:\n    try:\n        _result = eval(_call)\n        results.append(str(_result))\n    except Exception as e:\n        results.append(\"ERROR: \" + str(e))\nprint(\"###TEST_OUT###\")\nprint(json.dumps(results))\n",
    "perfTests": [
      "solution(100000)"
    ]
  },
  {
    "id": "sqlc_b1",
    "title": "SQL 실무 1. 전체 직원 명단 보기",
    "category": "SELECT",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "인사팀에서 회사 전체 직원 명단을 요청했어요. employees 테이블의 모든 열을 조회하세요.",
    "constraints": [
      "`SELECT *`를 사용하세요.",
      "emp_id 순서로 정렬하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "emp_id | name | dept_id | position | salary | hire_date | email\n----------------------------------------\n1 | 김철수 | 10 | 팀장 | 6200 | 2015-03-02 | cs.kim@company.com\n2 | 이영희 | 20 | 대리 | 4300 | 2019-07-15 | yh.lee@company.com\n3 | 박민수 | 10 | 사원 | 3600 | 2022-01-10 | NULL\n4 | 최수민 | 30 | 과장 | 5100 | 2017-11-20 | sm.choi@company.com\n5 | 정찬희 | 10 | 대리 | 4500 | 2020-05-04 | ch.jung@company.com\n6 | 한지민 | 20 | 사원 | 3400 | 2023-02-13 | NULL\n7 | 오세훈 | 30 | 사원 | 3500 | 2022-09-01 | sh.oh@company.com\n8 | 윤서연 | NULL | 인턴 | 2500 | 2024-07-01 | NULL"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "ZW1wX2lkIHwgbmFtZSB8IGRlcHRfaWQgfCBwb3NpdGlvbiB8IHNhbGFyeSB8IGhpcmVfZGF0ZSB8IGVtYWlsCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0KMSB8IOq5gOyyoOyImCB8IDEwIHwg7YyA7J6lIHwgNjIwMCB8IDIwMTUtMDMtMDIgfCBjcy5raW1AY29tcGFueS5jb20KMiB8IOydtOyYge2drCB8IDIwIHwg64yA66asIHwgNDMwMCB8IDIwMTktMDctMTUgfCB5aC5sZWVAY29tcGFueS5jb20KMyB8IOuwleuvvOyImCB8IDEwIHwg7IKs7JuQIHwgMzYwMCB8IDIwMjItMDEtMTAgfCBOVUxMCjQgfCDstZzsiJjrr7wgfCAzMCB8IOqzvOyepSB8IDUxMDAgfCAyMDE3LTExLTIwIHwgc20uY2hvaUBjb21wYW55LmNvbQo1IHwg7KCV7LCs7Z2sIHwgMTAgfCDrjIDrpqwgfCA0NTAwIHwgMjAyMC0wNS0wNCB8IGNoLmp1bmdAY29tcGFueS5jb20KNiB8IO2VnOyngOuvvCB8IDIwIHwg7IKs7JuQIHwgMzQwMCB8IDIwMjMtMDItMTMgfCBOVUxMCjcgfCDsmKTshLjtm4ggfCAzMCB8IOyCrOybkCB8IDM1MDAgfCAyMDIyLTA5LTAxIHwgc2gub2hAY29tcGFueS5jb20KOCB8IOycpOyEnOyXsCB8IE5VTEwgfCDsnbjthLQgfCAyNTAwIHwgMjAyNC0wNy0wMSB8IE5VTEw="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_b2",
    "title": "SQL 실무 2. 이름과 직급만 보기",
    "category": "SELECT",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "사내 연락망에 넣을 명단이 필요해요. 직원의 이름(name)과 직급(position)만 조회하세요.",
    "constraints": [
      "열 순서는 name, position입니다.",
      "emp_id 순서로 정렬하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "name | position\n----------------------------------------\n김철수 | 팀장\n이영희 | 대리\n박민수 | 사원\n최수민 | 과장\n정찬희 | 대리\n한지민 | 사원\n오세훈 | 사원\n윤서연 | 인턴"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "bmFtZSB8IHBvc2l0aW9uCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0K6rmA7LKg7IiYIHwg7YyA7J6lCuydtOyYge2drCB8IOuMgOumrArrsJXrr7zsiJggfCDsgqzsm5AK7LWc7IiY66+8IHwg6rO87J6lCuygleywrO2drCB8IOuMgOumrArtlZzsp4Drr7wgfCDsgqzsm5AK7Jik7IS47ZuIIHwg7IKs7JuQCuycpOyEnOyXsCB8IOyduO2EtA=="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_b3",
    "title": "SQL 실무 3. 연봉 높은 순으로 보기",
    "category": "ORDER BY",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "연봉 협상 자료를 만들고 있어요. 직원의 이름과 연봉(salary)을 연봉이 높은 순서로 조회하세요.",
    "constraints": [
      "열 순서는 name, salary입니다.",
      "`ORDER BY ... DESC`를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "name | salary\n----------------------------------------\n김철수 | 6200\n최수민 | 5100\n정찬희 | 4500\n이영희 | 4300\n박민수 | 3600\n오세훈 | 3500\n한지민 | 3400\n윤서연 | 2500"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "bmFtZSB8IHNhbGFyeQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuq5gOyyoOyImCB8IDYyMDAK7LWc7IiY66+8IHwgNTEwMArsoJXssKztnawgfCA0NTAwCuydtOyYge2drCB8IDQzMDAK67CV66+87IiYIHwgMzYwMArsmKTshLjtm4ggfCAzNTAwCu2VnOyngOuvvCB8IDM0MDAK7Jyk7ISc7JewIHwgMjUwMA=="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_b4",
    "title": "SQL 실무 4. 개발팀 직원만 보기",
    "category": "WHERE",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "개발팀(dept_id가 10) 회식 인원을 파악하려고 해요. 개발팀 직원의 이름과 직급을 조회하세요.",
    "constraints": [
      "열 순서는 name, position입니다.",
      "emp_id 순서로 정렬하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "name | position\n----------------------------------------\n김철수 | 팀장\n박민수 | 사원\n정찬희 | 대리"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "bmFtZSB8IHBvc2l0aW9uCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0K6rmA7LKg7IiYIHwg7YyA7J6lCuuwleuvvOyImCB8IOyCrOybkArsoJXssKztnawgfCDrjIDrpqw="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_b5",
    "title": "SQL 실무 5. 연봉 4000 이상 직원",
    "category": "WHERE",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "연봉이 4000(만 원) 이상인 직원의 이름과 연봉을 조회하세요.",
    "constraints": [
      "열 순서는 name, salary입니다.",
      "`>=` 를 사용하세요.",
      "emp_id 순서로 정렬하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "name | salary\n----------------------------------------\n김철수 | 6200\n이영희 | 4300\n최수민 | 5100\n정찬희 | 4500"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "bmFtZSB8IHNhbGFyeQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuq5gOyyoOyImCB8IDYyMDAK7J207JiB7Z2sIHwgNDMwMArstZzsiJjrr7wgfCA1MTAwCuygleywrO2drCB8IDQ1MDA="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_b6",
    "title": "SQL 실무 6. 사원 직급만 보기",
    "category": "WHERE",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "신입 교육 대상자를 뽑으려고 해요. 직급(position)이 '사원'인 직원의 이름과 입사일(hire_date)을 조회하세요.",
    "constraints": [
      "열 순서는 name, hire_date입니다.",
      "문자 값은 작은따옴표로 감싸세요.",
      "emp_id 순서로 정렬하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "name | hire_date\n----------------------------------------\n박민수 | 2022-01-10\n한지민 | 2023-02-13\n오세훈 | 2022-09-01"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "bmFtZSB8IGhpcmVfZGF0ZQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuuwleuvvOyImCB8IDIwMjItMDEtMTAK7ZWc7KeA66+8IHwgMjAyMy0wMi0xMwrsmKTshLjtm4ggfCAyMDIyLTA5LTAx"
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_b7",
    "title": "SQL 실무 7. 2020년 이후 입사자",
    "category": "WHERE",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "2020년 1월 1일 이후(그날 포함)에 입사한 직원의 이름과 입사일을 입사일 순서로 조회하세요.",
    "constraints": [
      "열 순서는 name, hire_date입니다.",
      "입사일이 빠른 순서로 정렬하세요.",
      "날짜는 'YYYY-MM-DD' 형식 문자열이에요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "name | hire_date\n----------------------------------------\n정찬희 | 2020-05-04\n박민수 | 2022-01-10\n오세훈 | 2022-09-01\n한지민 | 2023-02-13\n윤서연 | 2024-07-01"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "bmFtZSB8IGhpcmVfZGF0ZQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuygleywrO2drCB8IDIwMjAtMDUtMDQK67CV66+87IiYIHwgMjAyMi0wMS0xMArsmKTshLjtm4ggfCAyMDIyLTA5LTAxCu2VnOyngOuvvCB8IDIwMjMtMDItMTMK7Jyk7ISc7JewIHwgMjAyNC0wNy0wMQ=="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_b8",
    "title": "SQL 실무 8. 이메일이 없는 직원 찾기",
    "category": "NULL 처리",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "사내 메일 계정이 아직 없는 직원에게 안내를 보내려고 해요. email이 비어 있는(NULL) 직원의 이름을 조회하세요.",
    "constraints": [
      "`= NULL`이 아니라 `IS NULL`을 사용하세요.",
      "emp_id 순서로 정렬하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "name\n----------------------------------------\n박민수\n한지민\n윤서연"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "bmFtZQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuuwleuvvOyImArtlZzsp4Drr7wK7Jyk7ISc7Jew"
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_b9",
    "title": "SQL 실무 9. 김씨 직원 찾기",
    "category": "WHERE",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "이름이 '김'으로 시작하는 직원의 이름과 직급을 조회하세요.",
    "constraints": [
      "`LIKE`와 `%`를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "name | position\n----------------------------------------\n김철수 | 팀장"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "bmFtZSB8IHBvc2l0aW9uCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0K6rmA7LKg7IiYIHwg7YyA7J6l"
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_b10",
    "title": "SQL 실무 10. 품절 상품 확인",
    "category": "WHERE",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "재고 담당자가 품절 상품을 확인하려고 해요. products에서 재고(stock)가 0인 상품의 이름을 조회하세요.",
    "constraints": [],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "name\n----------------------------------------\n노트북 거치대"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "bmFtZQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuuFuO2KuOu2gSDqsbDsuZjrjIA="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_b11",
    "title": "SQL 실무 11. 5만 원 이하 상품, 싼 순서",
    "category": "ORDER BY",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "가격(price)이 50000원 이하인 상품의 이름과 가격을 가격이 낮은 순서로 조회하세요.",
    "constraints": [
      "열 순서는 name, price입니다."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "name | price\n----------------------------------------\n무선 마우스 | 25000\n노트북 거치대 | 35000\nUSB-C 허브 | 42000"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "bmFtZSB8IHByaWNlCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0K66y07ISgIOuniOyasOyKpCB8IDI1MDAwCuuFuO2KuOu2gSDqsbDsuZjrjIAgfCAzNTAwMApVU0ItQyDtl4jruIwgfCA0MjAwMA=="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_b12",
    "title": "SQL 실무 12. 상품 카테고리 종류",
    "category": "SELECT",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "판매 중인 상품의 카테고리(category) 종류를 중복 없이 조회하세요.",
    "constraints": [
      "`DISTINCT`를 사용하세요.",
      "카테고리 이름 순서로 정렬하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "category\n----------------------------------------\n모니터\n액세서리\n주변기기"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "Y2F0ZWdvcnkKLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQrrqqjri4jthLAK7JWh7IS47ISc66asCuyjvOuzgOq4sOq4sA=="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_b13",
    "title": "SQL 실무 13. 연봉 상위 3명",
    "category": "ORDER BY",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "연봉이 가장 높은 직원 3명의 이름과 연봉을 조회하세요.",
    "constraints": [
      "연봉이 높은 순서로 정렬한 뒤 3명만 가져오세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "name | salary\n----------------------------------------\n김철수 | 6200\n최수민 | 5100\n정찬희 | 4500"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "bmFtZSB8IHNhbGFyeQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuq5gOyyoOyImCB8IDYyMDAK7LWc7IiY66+8IHwgNTEwMArsoJXssKztnawgfCA0NTAw"
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_b14",
    "title": "SQL 실무 14. 전체 직원 수",
    "category": "집계함수",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "회사의 전체 직원 수를 '직원수'라는 이름으로 조회하세요.",
    "constraints": [
      "`COUNT(*)`와 `AS`를 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "직원수\n----------------------------------------\n8"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "7KeB7JuQ7IiYCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0KOA=="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_b15",
    "title": "SQL 실무 15. 상품 평균 가격",
    "category": "집계함수",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "전체 상품의 평균 가격을 원 단위로 반올림해서 '평균가격'이라는 이름으로 조회하세요.",
    "constraints": [
      "`AVG`로 평균을 구하고 `ROUND(값)`으로 반올림하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "평균가격\n----------------------------------------\n94833.0"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "7Y+J6reg6rCA6rKpCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0KOTQ4MzMuMA=="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_b16",
    "title": "SQL 실무 16. 월급 계산해서 보기",
    "category": "SELECT",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "연봉(salary, 만 원)을 12로 나눈 월급을 계산해, 이름과 함께 '월급'이라는 이름으로 조회하세요. 월급은 소수 첫째 자리까지 반올림하세요.",
    "constraints": [
      "열 순서는 name, 월급입니다.",
      "`ROUND(값, 1)`을 사용하세요.",
      "정수끼리 나누면 소수점이 버려지니 `12.0`으로 나누세요.",
      "emp_id 순서로 정렬하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "name | 월급\n----------------------------------------\n김철수 | 516.7\n이영희 | 358.3\n박민수 | 300.0\n최수민 | 425.0\n정찬희 | 375.0\n한지민 | 283.3\n오세훈 | 291.7\n윤서연 | 208.3"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "bmFtZSB8IOyblOq4iQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuq5gOyyoOyImCB8IDUxNi43CuydtOyYge2drCB8IDM1OC4zCuuwleuvvOyImCB8IDMwMC4wCuy1nOyImOuvvCB8IDQyNS4wCuygleywrO2drCB8IDM3NS4wCu2VnOyngOuvvCB8IDI4My4zCuyYpOyEuO2biCB8IDI5MS43CuycpOyEnOyXsCB8IDIwOC4z"
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_b17",
    "title": "SQL 실무 17. 연봉 범위로 찾기",
    "category": "WHERE",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "연봉이 3500 이상 4500 이하인 직원의 이름과 연봉을 조회하세요.",
    "constraints": [
      "`BETWEEN`을 사용하세요.",
      "emp_id 순서로 정렬하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "name | salary\n----------------------------------------\n이영희 | 4300\n박민수 | 3600\n정찬희 | 4500\n오세훈 | 3500"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "bmFtZSB8IHNhbGFyeQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuydtOyYge2drCB8IDQzMDAK67CV66+87IiYIHwgMzYwMArsoJXssKztnawgfCA0NTAwCuyYpOyEuO2biCB8IDM1MDA="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_b18",
    "title": "SQL 실무 18. 대리·과장만 보기",
    "category": "WHERE",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "중간 관리자 교육 대상(직급이 '대리' 또는 '과장')의 이름과 직급을 조회하세요.",
    "constraints": [
      "`IN`을 사용하세요.",
      "emp_id 순서로 정렬하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "name | position\n----------------------------------------\n이영희 | 대리\n최수민 | 과장\n정찬희 | 대리"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "bmFtZSB8IHBvc2l0aW9uCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0K7J207JiB7Z2sIHwg64yA66asCuy1nOyImOuvvCB8IOqzvOyepQrsoJXssKztnawgfCDrjIDrpqw="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_i1",
    "title": "SQL 실무 19. 부서별 직원 수",
    "category": "GROUP BY",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "부서(dept_id)별 직원 수를 '인원'이라는 이름으로 조회하세요. 부서가 없는 직원(NULL)도 한 그룹으로 나와요.",
    "constraints": [
      "열 순서는 dept_id, 인원입니다.",
      "dept_id 순서로 정렬하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "dept_id | 인원\n----------------------------------------\nNULL | 1\n10 | 3\n20 | 2\n30 | 2"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "ZGVwdF9pZCB8IOyduOybkAotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCk5VTEwgfCAxCjEwIHwgMwoyMCB8IDIKMzAgfCAy"
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_i2",
    "title": "SQL 실무 20. 직급별 평균 연봉",
    "category": "GROUP BY",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "직급(position)별 평균 연봉을 '평균연봉'이라는 이름으로, 평균 연봉이 높은 순서로 조회하세요. 평균은 소수 첫째 자리까지 반올림하세요.",
    "constraints": [
      "열 순서는 position, 평균연봉입니다."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "position | 평균연봉\n----------------------------------------\n팀장 | 6200.0\n과장 | 5100.0\n대리 | 4400.0\n사원 | 3500.0\n인턴 | 2500.0"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "cG9zaXRpb24gfCDtj4nqt6Dsl7DrtIkKLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQrtjIDsnqUgfCA2MjAwLjAK6rO87J6lIHwgNTEwMC4wCuuMgOumrCB8IDQ0MDAuMArsgqzsm5AgfCAzNTAwLjAK7J247YS0IHwgMjUwMC4w"
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_i3",
    "title": "SQL 실무 21. 카테고리별 상품 수와 재고",
    "category": "GROUP BY",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "카테고리별로 상품 수('상품수')와 재고 합계('총재고')를 카테고리 이름 순서로 조회하세요.",
    "constraints": [
      "열 순서는 category, 상품수, 총재고입니다."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "category | 상품수 | 총재고\n----------------------------------------\n모니터 | 1 | 8\n액세서리 | 2 | 25\n주변기기 | 3 | 58"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "Y2F0ZWdvcnkgfCDsg4HtkojsiJggfCDstJ3snqzqs6AKLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQrrqqjri4jthLAgfCAxIHwgOArslaHshLjshJzrpqwgfCAyIHwgMjUK7KO867OA6riw6riwIHwgMyB8IDU4"
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_i4",
    "title": "SQL 실무 22. 직원이 2명 이상인 부서",
    "category": "GROUP BY",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "직원이 2명 이상인 부서의 dept_id와 인원('인원')을 조회하세요. 부서가 없는 직원은 빼고 세세요.",
    "constraints": [
      "`WHERE`로 dept_id가 NULL인 행을 먼저 빼고, `HAVING`으로 묶은 결과를 거르세요.",
      "dept_id 순서로 정렬하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "dept_id | 인원\n----------------------------------------\n10 | 3\n20 | 2\n30 | 2"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "ZGVwdF9pZCB8IOyduOybkAotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCjEwIHwgMwoyMCB8IDIKMzAgfCAy"
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_i5",
    "title": "SQL 실무 23. 직원 이름과 부서 이름",
    "category": "JOIN",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "employees에는 부서 번호만 있어요. departments와 연결해서 직원 이름과 부서 이름(dept_name)을 조회하세요. 부서가 없는 직원은 나오지 않아도 돼요.",
    "constraints": [
      "열 순서는 name, dept_name입니다.",
      "emp_id 순서로 정렬하세요.",
      "`INNER JOIN ... ON`을 사용하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "name | dept_name\n----------------------------------------\n김철수 | 개발팀\n이영희 | 기획팀\n박민수 | 개발팀\n최수민 | 디자인팀\n정찬희 | 개발팀\n한지민 | 기획팀\n오세훈 | 디자인팀"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "bmFtZSB8IGRlcHRfbmFtZQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuq5gOyyoOyImCB8IOqwnOuwnO2MgArsnbTsmIHtnawgfCDquLDtmo3tjIAK67CV66+87IiYIHwg6rCc67Cc7YyACuy1nOyImOuvvCB8IOuUlOyekOyduO2MgArsoJXssKztnawgfCDqsJzrsJztjIAK7ZWc7KeA66+8IHwg6riw7ZqN7YyACuyYpOyEuO2biCB8IOuUlOyekOyduO2MgA=="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_i6",
    "title": "SQL 실무 24. 모든 부서의 인원 (0명 포함)",
    "category": "JOIN",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "모든 부서의 이름과 소속 인원('인원')을 조회하세요. 직원이 없는 부서도 0명으로 나와야 해요.",
    "constraints": [
      "열 순서는 dept_name, 인원입니다.",
      "dept_id 순서로 정렬하세요.",
      "`LEFT JOIN`을 쓰고, `COUNT(*)`가 아니라 직원 쪽 열을 세세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "dept_name | 인원\n----------------------------------------\n개발팀 | 3\n기획팀 | 2\n디자인팀 | 2\n인사팀 | 0"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "ZGVwdF9uYW1lIHwg7J247JuQCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0K6rCc67Cc7YyAIHwgMwrquLDtmo3tjIAgfCAyCuuUlOyekOyduO2MgCB8IDIK7J247IKs7YyAIHwgMA=="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_i7",
    "title": "SQL 실무 25. 부서 미배정 직원",
    "category": "NULL 처리",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "아직 부서가 정해지지 않은(dept_id가 NULL) 직원의 이름과 직급을 조회하세요.",
    "constraints": [],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "name | position\n----------------------------------------\n윤서연 | 인턴"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "bmFtZSB8IHBvc2l0aW9uCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0K7Jyk7ISc7JewIHwg7J247YS0"
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_i8",
    "title": "SQL 실무 26. 이메일 없으면 '미등록'으로",
    "category": "NULL 처리",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "직원의 이름과 이메일을 조회하되, 이메일이 없으면 '미등록'으로 보여 주세요. 열 이름은 '이메일'로 하세요.",
    "constraints": [
      "열 순서는 name, 이메일입니다.",
      "`COALESCE`를 사용하세요.",
      "emp_id 순서로 정렬하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "name | 이메일\n----------------------------------------\n김철수 | cs.kim@company.com\n이영희 | yh.lee@company.com\n박민수 | 미등록\n최수민 | sm.choi@company.com\n정찬희 | ch.jung@company.com\n한지민 | 미등록\n오세훈 | sh.oh@company.com\n윤서연 | 미등록"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "bmFtZSB8IOydtOuplOydvAotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuq5gOyyoOyImCB8IGNzLmtpbUBjb21wYW55LmNvbQrsnbTsmIHtnawgfCB5aC5sZWVAY29tcGFueS5jb20K67CV66+87IiYIHwg66+465Ox66GdCuy1nOyImOuvvCB8IHNtLmNob2lAY29tcGFueS5jb20K7KCV7LCs7Z2sIHwgY2guanVuZ0Bjb21wYW55LmNvbQrtlZzsp4Drr7wgfCDrr7jrk7HroZ0K7Jik7IS47ZuIIHwgc2gub2hAY29tcGFueS5jb20K7Jyk7ISc7JewIHwg66+465Ox66Gd"
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_i9",
    "title": "SQL 실무 27. 재고 상태 표시",
    "category": "CASE WHEN",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "상품 이름과 재고 상태('상태')를 조회하세요. 재고가 0이면 '품절', 10개 미만이면 '부족', 그 외는 '충분'이에요.",
    "constraints": [
      "열 순서는 name, 상태입니다.",
      "`CASE WHEN`을 사용하세요.",
      "product_id 순서로 정렬하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "name | 상태\n----------------------------------------\n무선 마우스 | 충분\n기계식 키보드 | 충분\n27인치 모니터 | 부족\n노트북 거치대 | 품절\nUSB-C 허브 | 충분\n웹캠 | 부족"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "bmFtZSB8IOyDge2DnAotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuustOyEoCDrp4jsmrDsiqQgfCDstqnrtoQK6riw6rOE7IudIO2CpOuztOuTnCB8IOy2qeu2hAoyN+yduOy5mCDrqqjri4jthLAgfCDrtoDsobEK64W47Yq467aBIOqxsOy5mOuMgCB8IO2SiOygiApVU0ItQyDtl4jruIwgfCDstqnrtoQK7Ju57LqgIHwg67aA7KGx"
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_i10",
    "title": "SQL 실무 28. 카테고리별 재고 금액",
    "category": "GROUP BY",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "카테고리별로 재고 금액(가격 × 재고)의 합계를 '재고금액'이라는 이름으로, 재고금액이 큰 순서로 조회하세요.",
    "constraints": [
      "열 순서는 category, 재고금액입니다."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "category | 재고금액\n----------------------------------------\n모니터 | 2560000\n주변기기 | 2509000\n액세서리 | 1050000"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "Y2F0ZWdvcnkgfCDsnqzqs6DquIjslaEKLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQrrqqjri4jthLAgfCAyNTYwMDAwCuyjvOuzgOq4sOq4sCB8IDI1MDkwMDAK7JWh7IS47ISc66asIHwgMTA1MDAwMA=="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_i11",
    "title": "SQL 실무 29. 서울 근무 직원",
    "category": "JOIN",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "근무지(location)가 '서울'인 부서에 속한 직원의 이름과 부서 이름을 조회하세요.",
    "constraints": [
      "열 순서는 name, dept_name입니다.",
      "emp_id 순서로 정렬하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "name | dept_name\n----------------------------------------\n김철수 | 개발팀\n이영희 | 기획팀\n박민수 | 개발팀\n정찬희 | 개발팀\n한지민 | 기획팀"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "bmFtZSB8IGRlcHRfbmFtZQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuq5gOyyoOyImCB8IOqwnOuwnO2MgArsnbTsmIHtnawgfCDquLDtmo3tjIAK67CV66+87IiYIHwg6rCc67Cc7YyACuygleywrO2drCB8IOqwnOuwnO2MgArtlZzsp4Drr7wgfCDquLDtmo3tjIA="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_i12",
    "title": "SQL 실무 30. 평균보다 연봉이 높은 직원",
    "category": "서브쿼리",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "전체 평균 연봉보다 연봉이 높은 직원의 이름과 연봉을 연봉이 높은 순서로 조회하세요.",
    "constraints": [
      "평균은 서브쿼리 `(SELECT AVG(salary) FROM employees)`로 구하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "name | salary\n----------------------------------------\n김철수 | 6200\n최수민 | 5100\n정찬희 | 4500\n이영희 | 4300"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "bmFtZSB8IHNhbGFyeQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuq5gOyyoOyImCB8IDYyMDAK7LWc7IiY66+8IHwgNTEwMArsoJXssKztnawgfCA0NTAwCuydtOyYge2drCB8IDQzMDA="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_i13",
    "title": "SQL 실무 31. 입사 연도별 인원",
    "category": "GROUP BY",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "입사 연도별 인원을 조회하세요. 연도는 hire_date의 앞 4글자이고, 열 이름은 '입사연도', '인원'으로 하세요.",
    "constraints": [
      "`SUBSTR(hire_date, 1, 4)`를 사용하세요.",
      "입사연도 순서로 정렬하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "입사연도 | 인원\n----------------------------------------\n2015 | 1\n2017 | 1\n2019 | 1\n2020 | 1\n2022 | 2\n2023 | 1\n2024 | 1"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "7J6F7IKs7Jew64+EIHwg7J247JuQCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0KMjAxNSB8IDEKMjAxNyB8IDEKMjAxOSB8IDEKMjAyMCB8IDEKMjAyMiB8IDIKMjAyMyB8IDEKMjAyNCB8IDE="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_i14",
    "title": "SQL 실무 32. 부서별 최고·최저 연봉",
    "category": "GROUP BY",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "부서별 최고 연봉('최고')과 최저 연봉('최저')을 부서 이름과 함께 조회하세요. 부서가 있는 직원만 대상이에요.",
    "constraints": [
      "열 순서는 dept_name, 최고, 최저입니다.",
      "dept_id 순서로 정렬하세요."
    ],
    "examples": [
      {
        "input": "코드 출력 예시",
        "output": "dept_name | 최고 | 최저\n----------------------------------------\n개발팀 | 6200 | 3600\n기획팀 | 4300 | 3400\n디자인팀 | 5100 | 3500"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "ZGVwdF9uYW1lIHwg7LWc6rOgIHwg7LWc7KCACi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0K6rCc67Cc7YyAIHwgNjIwMCB8IDM2MDAK6riw7ZqN7YyAIHwgNDMwMCB8IDM0MDAK65SU7J6Q7J247YyAIHwgNTEwMCB8IDM1MDA="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company"
  },
  {
    "id": "sqlc_d1",
    "title": "SQL 실무 33. 신규 직원 등록하기 — INSERT",
    "category": "DML",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "오늘 새로 입사한 직원을 등록하세요.\n\n| 열 | 자료형 | 넣을 값 |\n|---|---|---|\n| emp_id | INT | 9 |\n| name | TEXT | '강하늘' |\n| dept_id | INT | 10 (개발팀) |\n| position | TEXT | '사원' |\n| salary | INT | 3600 (만 원) |\n| hire_date | TEXT | '2026-10-01' |\n| email | TEXT | 없음 → NULL |",
    "constraints": [
      "`INSERT INTO employees VALUES (...)`를 사용하세요.",
      "값은 표의 열 순서대로 넣어요.",
      "INT는 따옴표 없이(3600), TEXT는 작은따옴표로('사원') 써요. 값이 없으면 따옴표 없이 NULL이에요."
    ],
    "examples": [
      {
        "input": "확인 쿼리 결과",
        "output": "emp_id | name | dept_id | position | salary | hire_date | email\n----------------------------------------\n8 | 윤서연 | NULL | 인턴 | 2500 | 2024-07-01 | NULL\n9 | 강하늘 | 10 | 사원 | 3600 | 2026-10-01 | NULL"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "ZW1wX2lkIHwgbmFtZSB8IGRlcHRfaWQgfCBwb3NpdGlvbiB8IHNhbGFyeSB8IGhpcmVfZGF0ZSB8IGVtYWlsCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0KOCB8IOycpOyEnOyXsCB8IE5VTEwgfCDsnbjthLQgfCAyNTAwIHwgMjAyNC0wNy0wMSB8IE5VTEwKOSB8IOqwle2VmOuKmCB8IDEwIHwg7IKs7JuQIHwgMzYwMCB8IDIwMjYtMTAtMDEgfCBOVUxM"
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company",
    "sqlCheck": "SELECT * FROM employees WHERE emp_id >= 8 ORDER BY emp_id;"
  },
  {
    "id": "sqlc_d2",
    "title": "SQL 실무 34. 열을 지정해서 상품 등록 — INSERT",
    "category": "DML",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "새 상품을 등록하세요. 실무에서는 표의 열 순서가 바뀌어도 안전하도록 **열 이름을 적어서** 넣어요.\n\n| 열 | 자료형 | 넣을 값 |\n|---|---|---|\n| product_id | INT | 107 |\n| name | TEXT | '노이즈캔슬링 헤드셋' |\n| category | TEXT | '주변기기' |\n| price | INT | 129000 (원) |\n| stock | INT | 10 |",
    "constraints": [
      "`INSERT INTO products (열1, 열2, ...) VALUES (...)` 형태로 쓰세요."
    ],
    "examples": [
      {
        "input": "확인 쿼리 결과",
        "output": "product_id | name | category | price | stock\n----------------------------------------\n101 | 무선 마우스 | 주변기기 | 25000 | 40\n102 | 기계식 키보드 | 주변기기 | 89000 | 15\n103 | 27인치 모니터 | 모니터 | 320000 | 8\n104 | 노트북 거치대 | 액세서리 | 35000 | 0\n105 | USB-C 허브 | 액세서리 | 42000 | 25\n106 | 웹캠 | 주변기기 | 58000 | 3\n107 | 노이즈캔슬링 헤드셋 | 주변기기 | 129000 | 10"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "cHJvZHVjdF9pZCB8IG5hbWUgfCBjYXRlZ29yeSB8IHByaWNlIHwgc3RvY2sKLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQoxMDEgfCDrrLTshKAg66eI7Jqw7IqkIHwg7KO867OA6riw6riwIHwgMjUwMDAgfCA0MAoxMDIgfCDquLDqs4Tsi50g7YKk67O065OcIHwg7KO867OA6riw6riwIHwgODkwMDAgfCAxNQoxMDMgfCAyN+yduOy5mCDrqqjri4jthLAgfCDrqqjri4jthLAgfCAzMjAwMDAgfCA4CjEwNCB8IOuFuO2KuOu2gSDqsbDsuZjrjIAgfCDslaHshLjshJzrpqwgfCAzNTAwMCB8IDAKMTA1IHwgVVNCLUMg7ZeI67iMIHwg7JWh7IS47ISc66asIHwgNDIwMDAgfCAyNQoxMDYgfCDsm7nsuqAgfCDso7zrs4DquLDquLAgfCA1ODAwMCB8IDMKMTA3IHwg64W47J207KaI7LqU7Iqs66eBIO2XpOuTnOyFiyB8IOyjvOuzgOq4sOq4sCB8IDEyOTAwMCB8IDEw"
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company",
    "sqlCheck": "SELECT * FROM products ORDER BY product_id;"
  },
  {
    "id": "sqlc_d3",
    "title": "SQL 실무 35. 부서 두 개 한 번에 추가 — INSERT",
    "category": "DML",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "조직 개편으로 부서 두 개가 새로 생겼어요. 한 번의 INSERT로 둘 다 추가하세요.\n\n| dept_id (INT) | dept_name (TEXT) | location (TEXT) |\n|---|---|---|\n| 50 | '마케팅팀' | '서울' |\n| 60 | '영업팀' | '대전' |",
    "constraints": [
      "`VALUES (...), (...)` 처럼 괄호를 쉼표로 이어 쓰세요."
    ],
    "examples": [
      {
        "input": "확인 쿼리 결과",
        "output": "dept_id | dept_name | location\n----------------------------------------\n10 | 개발팀 | 서울\n20 | 기획팀 | 서울\n30 | 디자인팀 | 부산\n40 | 인사팀 | 서울\n50 | 마케팅팀 | 서울\n60 | 영업팀 | 대전"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "ZGVwdF9pZCB8IGRlcHRfbmFtZSB8IGxvY2F0aW9uCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0KMTAgfCDqsJzrsJztjIAgfCDshJzsmrgKMjAgfCDquLDtmo3tjIAgfCDshJzsmrgKMzAgfCDrlJTsnpDsnbjtjIAgfCDrtoDsgrAKNDAgfCDsnbjsgqztjIAgfCDshJzsmrgKNTAgfCDrp4jsvIDtjIXtjIAgfCDshJzsmrgKNjAgfCDsmIHsl4XtjIAgfCDrjIDsoIQ="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company",
    "sqlCheck": "SELECT * FROM departments ORDER BY dept_id;"
  },
  {
    "id": "sqlc_d4",
    "title": "SQL 실무 36. 품절 상품 입고 처리 — UPDATE",
    "category": "DML",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "품절이던 '노트북 거치대'(product_id 104)에 30개가 입고됐어요. 재고(stock, INT)를 30으로 바꾸세요.",
    "constraints": [
      "`UPDATE ... SET ... WHERE`를 사용하세요.",
      "**WHERE를 빠뜨리면 모든 상품의 재고가 바뀌어요.**"
    ],
    "examples": [
      {
        "input": "확인 쿼리 결과",
        "output": "product_id | name | stock\n----------------------------------------\n101 | 무선 마우스 | 40\n102 | 기계식 키보드 | 15\n103 | 27인치 모니터 | 8\n104 | 노트북 거치대 | 30\n105 | USB-C 허브 | 25\n106 | 웹캠 | 3"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "cHJvZHVjdF9pZCB8IG5hbWUgfCBzdG9jawotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCjEwMSB8IOustOyEoCDrp4jsmrDsiqQgfCA0MAoxMDIgfCDquLDqs4Tsi50g7YKk67O065OcIHwgMTUKMTAzIHwgMjfsnbjsuZgg66qo64uI7YSwIHwgOAoxMDQgfCDrhbjtirjrtoEg6rGw7LmY64yAIHwgMzAKMTA1IHwgVVNCLUMg7ZeI67iMIHwgMjUKMTA2IHwg7Ju57LqgIHwgMw=="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company",
    "sqlCheck": "SELECT product_id, name, stock FROM products ORDER BY product_id;"
  },
  {
    "id": "sqlc_d5",
    "title": "SQL 실무 37. 승진 처리 — 여러 열 UPDATE",
    "category": "DML",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "박민수 씨(emp_id 3)가 대리로 승진했어요. 직급(position, TEXT)을 '대리'로, 연봉(salary, INT)을 4000으로 한 번에 바꾸세요.",
    "constraints": [
      "`SET 열1 = 값1, 열2 = 값2`처럼 쉼표로 이어 쓰세요.",
      "이름이 아니라 사번(emp_id)으로 찾으세요."
    ],
    "examples": [
      {
        "input": "확인 쿼리 결과",
        "output": "emp_id | name | position | salary\n----------------------------------------\n1 | 김철수 | 팀장 | 6200\n2 | 이영희 | 대리 | 4300\n3 | 박민수 | 대리 | 4000\n4 | 최수민 | 과장 | 5100\n5 | 정찬희 | 대리 | 4500\n6 | 한지민 | 사원 | 3400\n7 | 오세훈 | 사원 | 3500\n8 | 윤서연 | 인턴 | 2500"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "ZW1wX2lkIHwgbmFtZSB8IHBvc2l0aW9uIHwgc2FsYXJ5Ci0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0KMSB8IOq5gOyyoOyImCB8IO2MgOyepSB8IDYyMDAKMiB8IOydtOyYge2drCB8IOuMgOumrCB8IDQzMDAKMyB8IOuwleuvvOyImCB8IOuMgOumrCB8IDQwMDAKNCB8IOy1nOyImOuvvCB8IOqzvOyepSB8IDUxMDAKNSB8IOygleywrO2drCB8IOuMgOumrCB8IDQ1MDAKNiB8IO2VnOyngOuvvCB8IOyCrOybkCB8IDM0MDAKNyB8IOyYpOyEuO2biCB8IOyCrOybkCB8IDM1MDAKOCB8IOycpOyEnOyXsCB8IOyduO2EtCB8IDI1MDA="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company",
    "sqlCheck": "SELECT emp_id, name, position, salary FROM employees ORDER BY emp_id;"
  },
  {
    "id": "sqlc_d6",
    "title": "SQL 실무 38. 부서 전체 연봉 인상 — UPDATE",
    "category": "DML",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "개발팀(dept_id 10) 전원의 연봉(salary, INT, 단위 만 원)을 200씩 올리세요.",
    "constraints": [
      "기존 값에 더하려면 `salary = salary + 200`처럼 써요."
    ],
    "examples": [
      {
        "input": "확인 쿼리 결과",
        "output": "emp_id | name | dept_id | salary\n----------------------------------------\n1 | 김철수 | 10 | 6400\n2 | 이영희 | 20 | 4300\n3 | 박민수 | 10 | 3800\n4 | 최수민 | 30 | 5100\n5 | 정찬희 | 10 | 4700\n6 | 한지민 | 20 | 3400\n7 | 오세훈 | 30 | 3500\n8 | 윤서연 | NULL | 2500"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "ZW1wX2lkIHwgbmFtZSB8IGRlcHRfaWQgfCBzYWxhcnkKLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQoxIHwg6rmA7LKg7IiYIHwgMTAgfCA2NDAwCjIgfCDsnbTsmIHtnawgfCAyMCB8IDQzMDAKMyB8IOuwleuvvOyImCB8IDEwIHwgMzgwMAo0IHwg7LWc7IiY66+8IHwgMzAgfCA1MTAwCjUgfCDsoJXssKztnawgfCAxMCB8IDQ3MDAKNiB8IO2VnOyngOuvvCB8IDIwIHwgMzQwMAo3IHwg7Jik7IS47ZuIIHwgMzAgfCAzNTAwCjggfCDsnKTshJzsl7AgfCBOVUxMIHwgMjUwMA=="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company",
    "sqlCheck": "SELECT emp_id, name, dept_id, salary FROM employees ORDER BY emp_id;"
  },
  {
    "id": "sqlc_d7",
    "title": "SQL 실무 39. 주변기기 가격 10% 인상 — UPDATE",
    "category": "DML",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "원자재 가격이 올라서 '주변기기' 카테고리 상품 가격(price, INT, 단위 원)을 10% 올리기로 했어요.",
    "constraints": [
      "가격에 1.1을 곱하세요.",
      "채점할 때는 원 단위 정수로 바꿔서 비교해요."
    ],
    "examples": [
      {
        "input": "확인 쿼리 결과",
        "output": "product_id | name | price\n----------------------------------------\n101 | 무선 마우스 | 27500\n102 | 기계식 키보드 | 97900\n103 | 27인치 모니터 | 320000\n104 | 노트북 거치대 | 35000\n105 | USB-C 허브 | 42000\n106 | 웹캠 | 63800"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "cHJvZHVjdF9pZCB8IG5hbWUgfCBwcmljZQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCjEwMSB8IOustOyEoCDrp4jsmrDsiqQgfCAyNzUwMAoxMDIgfCDquLDqs4Tsi50g7YKk67O065OcIHwgOTc5MDAKMTAzIHwgMjfsnbjsuZgg66qo64uI7YSwIHwgMzIwMDAwCjEwNCB8IOuFuO2KuOu2gSDqsbDsuZjrjIAgfCAzNTAwMAoxMDUgfCBVU0ItQyDtl4jruIwgfCA0MjAwMAoxMDYgfCDsm7nsuqAgfCA2MzgwMA=="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company",
    "sqlCheck": "SELECT product_id, name, CAST(ROUND(price) AS INTEGER) AS price FROM products ORDER BY product_id;"
  },
  {
    "id": "sqlc_d8",
    "title": "SQL 실무 40. 이메일 일괄 등록 — UPDATE",
    "category": "DML",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "이메일(email, TEXT)이 없는(NULL) 직원에게 임시 주소 'temp@company.com'을 넣으세요. 이미 이메일이 있는 직원은 그대로 두어야 해요.",
    "constraints": [
      "`WHERE email IS NULL`로 대상을 정하세요."
    ],
    "examples": [
      {
        "input": "확인 쿼리 결과",
        "output": "emp_id | name | email\n----------------------------------------\n1 | 김철수 | cs.kim@company.com\n2 | 이영희 | yh.lee@company.com\n3 | 박민수 | temp@company.com\n4 | 최수민 | sm.choi@company.com\n5 | 정찬희 | ch.jung@company.com\n6 | 한지민 | temp@company.com\n7 | 오세훈 | sh.oh@company.com\n8 | 윤서연 | temp@company.com"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "ZW1wX2lkIHwgbmFtZSB8IGVtYWlsCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0KMSB8IOq5gOyyoOyImCB8IGNzLmtpbUBjb21wYW55LmNvbQoyIHwg7J207JiB7Z2sIHwgeWgubGVlQGNvbXBhbnkuY29tCjMgfCDrsJXrr7zsiJggfCB0ZW1wQGNvbXBhbnkuY29tCjQgfCDstZzsiJjrr7wgfCBzbS5jaG9pQGNvbXBhbnkuY29tCjUgfCDsoJXssKztnawgfCBjaC5qdW5nQGNvbXBhbnkuY29tCjYgfCDtlZzsp4Drr7wgfCB0ZW1wQGNvbXBhbnkuY29tCjcgfCDsmKTshLjtm4ggfCBzaC5vaEBjb21wYW55LmNvbQo4IHwg7Jyk7ISc7JewIHwgdGVtcEBjb21wYW55LmNvbQ=="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company",
    "sqlCheck": "SELECT emp_id, name, email FROM employees ORDER BY emp_id;"
  },
  {
    "id": "sqlc_d9",
    "title": "SQL 실무 41. 단종 상품 삭제 — DELETE",
    "category": "DML",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "'노트북 거치대'(product_id 104)가 단종됐어요. 상품 목록에서 삭제하세요.",
    "constraints": [
      "`DELETE FROM ... WHERE`를 사용하세요.",
      "**WHERE를 빠뜨리면 모든 상품이 지워져요.**"
    ],
    "examples": [
      {
        "input": "확인 쿼리 결과",
        "output": "product_id | name\n----------------------------------------\n101 | 무선 마우스\n102 | 기계식 키보드\n103 | 27인치 모니터\n105 | USB-C 허브\n106 | 웹캠"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "cHJvZHVjdF9pZCB8IG5hbWUKLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQoxMDEgfCDrrLTshKAg66eI7Jqw7IqkCjEwMiB8IOq4sOqzhOyLnSDtgqTrs7Trk5wKMTAzIHwgMjfsnbjsuZgg66qo64uI7YSwCjEwNSB8IFVTQi1DIO2XiOu4jAoxMDYgfCDsm7nsuqA="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company",
    "sqlCheck": "SELECT product_id, name FROM products ORDER BY product_id;"
  },
  {
    "id": "sqlc_d10",
    "title": "SQL 실무 42. 인턴 계약 종료 — DELETE",
    "category": "DML",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "인턴 계약이 끝나서 직급이 '인턴'인 직원 기록을 삭제하세요.",
    "constraints": [],
    "examples": [
      {
        "input": "확인 쿼리 결과",
        "output": "emp_id | name | position\n----------------------------------------\n1 | 김철수 | 팀장\n2 | 이영희 | 대리\n3 | 박민수 | 사원\n4 | 최수민 | 과장\n5 | 정찬희 | 대리\n6 | 한지민 | 사원\n7 | 오세훈 | 사원"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "ZW1wX2lkIHwgbmFtZSB8IHBvc2l0aW9uCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0KMSB8IOq5gOyyoOyImCB8IO2MgOyepQoyIHwg7J207JiB7Z2sIHwg64yA66asCjMgfCDrsJXrr7zsiJggfCDsgqzsm5AKNCB8IOy1nOyImOuvvCB8IOqzvOyepQo1IHwg7KCV7LCs7Z2sIHwg64yA66asCjYgfCDtlZzsp4Drr7wgfCDsgqzsm5AKNyB8IOyYpOyEuO2biCB8IOyCrOybkA=="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company",
    "sqlCheck": "SELECT emp_id, name, position FROM employees ORDER BY emp_id;"
  },
  {
    "id": "sqlc_t1",
    "title": "SQL 실무 43. 공지사항 테이블 만들기 — CREATE TABLE",
    "category": "DDL",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "사내 게시판에 공지사항 기능을 만들려고 해요. 아래 구조로 notices 테이블을 만드세요.\n\n| 열 | 자료형 | 규칙 |\n|---|---|---|\n| id | INTEGER | PRIMARY KEY |\n| title | TEXT | NOT NULL |\n| content | TEXT | |\n| created_at | TEXT | ('2026-10-27 09:00' 같은 날짜·시간 문자열) |",
    "constraints": [
      "열 순서는 id, title, content, created_at입니다.",
      "자료형은 위에 적힌 대로 쓰세요. (INT와 INTEGER, TEXT와 VARCHAR처럼 같은 뜻의 다른 이름을 써도 정답으로 처리해요.)",
      "채점은 열 이름 · NOT NULL 여부 · 기본키 여부로 해요. 대소문자는 구분하지 않아요."
    ],
    "examples": [
      {
        "input": "확인 쿼리 결과",
        "output": "name | notnull | pk\n----------------------------------------\nid | 0 | 1\ntitle | 1 | 0\ncontent | 0 | 0\ncreated_at | 0 | 0"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "bmFtZSB8IG5vdG51bGwgfCBwawotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCmlkIHwgMCB8IDEKdGl0bGUgfCAxIHwgMApjb250ZW50IHwgMCB8IDAKY3JlYXRlZF9hdCB8IDAgfCAw"
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company",
    "sqlCheck": "SELECT lower(name) AS name, \"notnull\", pk FROM pragma_table_info('notices') ORDER BY cid;"
  },
  {
    "id": "sqlc_t2",
    "title": "SQL 실무 44. 기본값이 있는 회원 테이블 — DEFAULT",
    "category": "DDL",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "쇼핑몰 회원 테이블 members를 만드세요. 가입하면 등급이 자동으로 'BRONZE'가 되어야 해요.\n\n| 열 | 자료형 | 규칙 |\n|---|---|---|\n| id | INTEGER | PRIMARY KEY |\n| name | TEXT | NOT NULL |\n| grade | TEXT | 기본값 'BRONZE' |",
    "constraints": [
      "`DEFAULT 'BRONZE'`를 사용하세요.",
      "자료형은 위에 적힌 대로 쓰세요. (INT와 INTEGER, TEXT와 VARCHAR처럼 같은 뜻의 다른 이름을 써도 정답으로 처리해요.)",
      "채점은 열 이름과 기본값으로 해요."
    ],
    "examples": [
      {
        "input": "확인 쿼리 결과",
        "output": "name | dflt_value\n----------------------------------------\nid | NULL\nname | NULL\ngrade | 'BRONZE'"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "bmFtZSB8IGRmbHRfdmFsdWUKLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQppZCB8IE5VTEwKbmFtZSB8IE5VTEwKZ3JhZGUgfCAnQlJPTlpFJw=="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company",
    "sqlCheck": "SELECT lower(name) AS name, dflt_value FROM pragma_table_info('members') ORDER BY cid;"
  },
  {
    "id": "sqlc_t3",
    "title": "SQL 실무 45. 전화번호 열 추가 — ALTER TABLE",
    "category": "DDL",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "직원 비상 연락망을 만들기 위해 employees 테이블에 phone 열을 추가하세요.\n\n| 열 | 자료형 |\n|---|---|\n| phone | TEXT ('010-1234-5678' 같은 문자열) |",
    "constraints": [
      "`ALTER TABLE ... ADD COLUMN`을 사용하세요.",
      "전화번호는 앞자리 0과 하이픈(-)이 있어서 숫자(INTEGER)가 아니라 문자(TEXT)로 저장해요."
    ],
    "examples": [
      {
        "input": "확인 쿼리 결과",
        "output": "name\n----------------------------------------\nemp_id\nname\ndept_id\nposition\nsalary\nhire_date\nemail\nphone"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "bmFtZQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCmVtcF9pZApuYW1lCmRlcHRfaWQKcG9zaXRpb24Kc2FsYXJ5CmhpcmVfZGF0ZQplbWFpbApwaG9uZQ=="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company",
    "sqlCheck": "SELECT lower(name) AS name FROM pragma_table_info('employees') ORDER BY cid;"
  },
  {
    "id": "sqlc_t4",
    "title": "SQL 실무 46. 개발팀 백업 테이블 — CREATE TABLE AS",
    "category": "DDL",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "개발팀(dept_id 10) 직원 데이터를 작업 전에 백업해 두려고 해요. 개발팀 직원 전체를 담은 dev_backup 테이블을 만드세요.",
    "constraints": [
      "`CREATE TABLE 새테이블 AS SELECT ...`를 사용하세요."
    ],
    "examples": [
      {
        "input": "확인 쿼리 결과",
        "output": "emp_id | name | salary\n----------------------------------------\n1 | 김철수 | 6200\n3 | 박민수 | 3600\n5 | 정찬희 | 4500"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "ZW1wX2lkIHwgbmFtZSB8IHNhbGFyeQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCjEgfCDquYDssqDsiJggfCA2MjAwCjMgfCDrsJXrr7zsiJggfCAzNjAwCjUgfCDsoJXssKztnawgfCA0NTAw"
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company",
    "sqlCheck": "SELECT emp_id, name, salary FROM dev_backup ORDER BY emp_id;"
  },
  {
    "id": "sqlc_t5",
    "title": "SQL 실무 47. 서울 근무자 뷰 만들기 — CREATE VIEW",
    "category": "DDL",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "서울 근무 직원 목록을 여러 화면에서 계속 써야 해요. 매번 JOIN을 쓰지 않도록 뷰 seoul_staff를 만드세요. 뷰에는 직원 이름(name)과 부서 이름(dept_name)이 있어야 해요.",
    "constraints": [
      "`CREATE VIEW 이름 AS SELECT ...`를 사용하세요.",
      "근무지(location)가 '서울'인 부서의 직원만 담으세요."
    ],
    "examples": [
      {
        "input": "확인 쿼리 결과",
        "output": "name | dept_name\n----------------------------------------\n김철수 | 개발팀\n박민수 | 개발팀\n이영희 | 기획팀\n정찬희 | 개발팀\n한지민 | 기획팀"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "bmFtZSB8IGRlcHRfbmFtZQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCuq5gOyyoOyImCB8IOqwnOuwnO2MgArrsJXrr7zsiJggfCDqsJzrsJztjIAK7J207JiB7Z2sIHwg6riw7ZqN7YyACuygleywrO2drCB8IOqwnOuwnO2MgArtlZzsp4Drr7wgfCDquLDtmo3tjIA="
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company",
    "sqlCheck": "SELECT * FROM seoul_staff ORDER BY name;"
  },
  {
    "id": "sqlc_t6",
    "title": "SQL 실무 48. 이름 검색용 인덱스 — CREATE INDEX",
    "category": "DDL",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "직원 이름으로 검색하는 일이 많아졌어요. employees의 name 열에 idx_emp_name이라는 인덱스를 만드세요.",
    "constraints": [
      "`CREATE INDEX 이름 ON 테이블(열)`을 사용하세요."
    ],
    "examples": [
      {
        "input": "확인 쿼리 결과",
        "output": "name | tbl_name\n----------------------------------------\nidx_emp_name | employees"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "bmFtZSB8IHRibF9uYW1lCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0KaWR4X2VtcF9uYW1lIHwgZW1wbG95ZWVz"
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company",
    "sqlCheck": "SELECT lower(name) AS name, lower(tbl_name) AS tbl_name FROM sqlite_master WHERE type = 'index' AND lower(name) = 'idx_emp_name';"
  },
  {
    "id": "sqlc_t7",
    "title": "SQL 실무 49. 주문 기록 테이블 — FOREIGN KEY",
    "category": "DDL",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "상품 주문 기록을 남길 order_logs 테이블을 만드세요. product_id는 반드시 products 테이블에 있는 상품이어야 해요.\n\n| 열 | 자료형 | 규칙 |\n|---|---|---|\n| id | INTEGER | PRIMARY KEY |\n| product_id | INTEGER | products(product_id)를 참조 (FOREIGN KEY) |\n| qty | INTEGER | NOT NULL |",
    "constraints": [
      "`REFERENCES products(product_id)` 또는 `FOREIGN KEY (product_id) REFERENCES products(product_id)`를 쓰세요.",
      "자료형은 위에 적힌 대로 쓰세요. (INT와 INTEGER, TEXT와 VARCHAR처럼 같은 뜻의 다른 이름을 써도 정답으로 처리해요.)",
      "채점은 참조 관계(어느 열이 어느 표의 어느 열을 가리키는지)로 해요."
    ],
    "examples": [
      {
        "input": "확인 쿼리 결과",
        "output": "from | table | to\n----------------------------------------\nproduct_id | products | product_id"
      }
    ],
    "initialCode": "",
    "testCases": [
      {
        "input": "코드 실행",
        "expected": "ZnJvbSB8IHRhYmxlIHwgdG8KLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQpwcm9kdWN0X2lkIHwgcHJvZHVjdHMgfCBwcm9kdWN0X2lk"
      }
    ],
    "testRunnerCode": "stdout_match",
    "sqlDataset": "company",
    "sqlCheck": "SELECT lower(\"from\") AS \"from\", lower(\"table\") AS \"table\", lower(\"to\") AS \"to\" FROM pragma_foreign_key_list('order_logs');"
  }
];
