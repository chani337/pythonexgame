// Auto-generated problems file from 문제.txt
export interface TestCase {
  input: string;
  expected: string;
}

export type ProblemType = 'coding' | 'quiz' | 'fill';

export interface Problem {
  id: string;
  title: string;
  category: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  type: ProblemType;
  description: string;
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  initialCode?: string;
  testCases?: TestCase[];
  testRunnerCode?: string;
  quizQuestion?: string;
  quizOptions?: string[];
  correctAnswerIndex?: number;
  fillQuestion?: string;
  fillPrefix?: string;
  fillSuffix?: string;
  correctAnswerText?: string;
  placeholderText?: string;
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
        "expected": "김철수"
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
        "expected": "20"
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
        "expected": "김철수\n20\n치킨"
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
        "expected": "한국대학교\n2"
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
        "expected": "20"
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
        "expected": "키보드\n35000"
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
        "expected": "175.5\n68.2"
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
        "expected": "100\n100"
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
        "expected": "용사\n10\n100"
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
        "expected": "민수\n25\n광주\n게임"
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
        "expected": "Hello Python"
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
        "expected": "안녕하세요 민수"
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
        "expected": "파이썬!파이썬!파이썬!"
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
        "expected": "6"
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
        "expected": "P"
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
        "expected": "o"
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
        "expected": "Pyt"
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
        "expected": "HELLO PYTHON"
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
        "expected": "I like Python"
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
        "expected": "['사과', '바나나', '포도']"
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
        "expected": "15"
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
        "expected": "24\n16\n80\n5.0"
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
        "expected": "3"
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
        "expected": "2"
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
        "expected": "25"
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
        "expected": "True"
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
        "expected": "True"
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
        "expected": "True"
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
        "expected": "True"
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
        "expected": "False"
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
        "expected": "성인입니다."
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
        "expected": "양수입니다."
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
        "expected": "홀수입니다."
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
        "expected": "합격"
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
        "expected": "로그인 성공"
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
        "expected": "음수입니다."
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
        "expected": "B"
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
        "expected": "입장 불가"
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
        "expected": "무료 배송"
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
        "expected": "관리자 페이지 접속 가능"
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
        "expected": "['사과', '바나나', '포도']"
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
        "expected": "사과"
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
        "expected": "40"
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
        "expected": "[20, 30, 40]"
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
        "expected": "['사과', '바나나', '딸기']"
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
        "expected": "['사과', '포도']"
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
        "expected": "[10, 200, 30]"
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
        "expected": "5"
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
        "expected": "[1, 2, 3, 4, 5]"
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
        "expected": "True"
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
        "expected": "('월요일', '화요일', '수요일')"
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
        "expected": "10"
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
        "expected": "40"
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
        "expected": "(20, 30, 40)"
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
        "expected": "5"
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
        "expected": "True"
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
        "expected": "(1, 2, 3, 4, 5, 6)"
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
        "expected": "('안녕', '안녕', '안녕')"
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
        "expected": "민수\n25"
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
        "expected": "10\n20"
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
        "expected": "1\n2\n3\n4\n5"
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
        "expected": "사과\n바나나\n포도"
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
        "expected": "2\n4\n6\n8\n10"
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
        "expected": "15"
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
        "expected": "파이썬\n파이썬\n파이썬\n파이썬\n파이썬"
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
        "expected": "5\n4\n3\n2\n1"
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
        "expected": "2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n2 x 4 = 8\n2 x 5 = 10\n2 x 6 = 12\n2 x 7 = 14\n2 x 8 = 16\n2 x 9 = 18"
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
        "expected": "3\n6\n9\n12\n15\n18"
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
        "expected": "1\n2\n3\n4\n5"
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
        "expected": "100"
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
        "expected": "안녕하세요"
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
        "expected": "안녕하세요 민수"
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
        "expected": "30"
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
        "expected": "25"
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
        "expected": "성인"
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
        "expected": "짝수"
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
        "expected": "20"
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
        "expected": "9000.0"
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
        "expected": "사과\n바나나\n포도"
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
        "expected": "B"
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
        "expected": "{'name': '민수', 'age': 20}"
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
        "expected": "민수"
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
        "expected": "{'name': '민수', 'age': 20, 'major': '컴퓨터공학'}"
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
        "expected": "{'name': '민수', 'age': 21}"
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
        "expected": "{'name': '민수'}"
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
        "expected": "dict_keys(['name', 'age', 'city'])"
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
        "expected": "dict_values(['민수', 20, '광주'])"
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
        "expected": "name 민수\nage 20"
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
        "expected": "30000"
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
        "expected": "민수\n영희"
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
        "expected": "88.0"
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
        "expected": "[20 25 30]"
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
        "expected": "86.0"
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
        "expected": "['김철수', '박민수']"
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
        "expected": "[1, 4, 9, 16, 25]"
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
        "expected": "True\nFalse"
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
        "expected": "55"
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
        "expected": "120"
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
        "expected": "[1, 2, 4, 8, 9]"
      }
    ],
    "testRunnerCode": "stdout_match"
  }
];
