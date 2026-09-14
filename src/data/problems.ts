// Auto-generated problems file from 문제.txt
export interface TestCase {
  input: string;
  // base64-encoded (see src/utils/answerObfuscation.ts), decode before
  // comparing against actual program output.
  expected: string;
}

export type ProblemType = 'coding' | 'quiz' | 'fill';
export type ProblemLanguage = 'python' | 'sql' | 'java' | 'js' | 'algorithm' | 'c';

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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
    "difficulty": "advanced",
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
  }
];
