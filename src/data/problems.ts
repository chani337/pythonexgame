// Auto-generated problems file from 문제.txt
export interface TestCase {
  input: string;
  expected: string;
}

export type ProblemType = 'coding' | 'quiz' | 'fill';
export type ProblemLanguage = 'python' | 'sql' | 'java' | 'js';

export interface Problem {
  id: string;
  title: string;
  category: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  type: ProblemType;
  language?: ProblemLanguage;
  description: string;
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  initialCode?: string;
  testCases?: TestCase[];
  testRunnerCode?: string;
  solutionExplanation?: string;
  quizQuestion?: string;
  quizOptions?: string[];
  correctAnswerIndex?: number;
  fillQuestion?: string;
  fillPrefix?: string;
  fillSuffix?: string;
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
        "expected": "김철수"
      }
    ],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "변수는 값에 이름을 붙여 저장하는 공간입니다. name = \"값\"처럼 = 기호로 오른쪽 값을 왼쪽 변수에 저장하고, print()로 그 값을 출력할 수 있습니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "문자열뿐 아니라 숫자도 변수에 그대로 저장할 수 있습니다. age = 20처럼 따옴표 없이 쓰면 정수(int)로 저장됩니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "여러 정보를 각각 다른 변수에 저장해두면, 필요할 때 원하는 변수만 따로 출력하거나 계산에 활용할 수 있습니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "변수 이름은 저장하는 값의 의미를 잘 나타내도록 짓는 것이 좋습니다. school, grade처럼 이름만 봐도 어떤 값인지 알 수 있게 짓는 습관을 들이면 코드가 읽기 쉬워집니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "같은 변수에 새 값을 다시 저장하면 이전 값은 사라지고 새 값으로 덮어씌워집니다. 변수는 \"고정된 값\"이 아니라 \"지금 어떤 값을 담고 있는 상자\"라고 생각하면 이해하기 쉽습니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "이름(문자열)과 가격(숫자)처럼 서로 다른 자료형의 값도 각각 변수에 자유롭게 저장할 수 있습니다. 파이썬은 저장하는 값에 따라 자료형이 자동으로 정해집니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "숫자로 이루어진 값(키, 몸무게)도 변수에 저장해두면 이후 계산(BMI 등)에 그대로 활용할 수 있습니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "second = first처럼 쓰면 first에 들어있는 \"값\"이 second에 복사되어 저장됩니다. 이후 두 변수는 서로 다른 저장 공간에 같은 값을 각각 가지게 됩니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "연관된 여러 값(이름, 레벨, 체력)을 각각의 변수로 관리하면, 나중에 레벨업 등으로 특정 값만 바꾸고 싶을 때 그 변수만 수정하면 됩니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "자기소개처럼 여러 항목을 다룰 때도 변수 하나당 값 하나씩 저장하는 원칙은 동일합니다. print()에 콤마로 여러 변수를 나열하면 한 줄에 이어서 출력할 수 있습니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "문자열은 따옴표(\" \" 또는 '')로 감싼 텍스트입니다. 변수에 저장한 뒤 print()로 출력하면 따옴표 없이 텍스트 내용만 화면에 나타납니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "문자열끼리는 + 연산자로 이어붙일 수 있습니다. 다만 이름과 인사말 사이에 공백이 필요하다면 \" \"처럼 공백 문자열도 함께 더해줘야 합니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "문자열에 * 숫자를 곱하면 그 문자열이 숫자만큼 반복된 새 문자열이 만들어집니다. 리스트에도 똑같이 적용되는 파이썬의 특징적인 문법입니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "len(문자열)은 문자열에 포함된 글자 수를 반환하는 내장 함수입니다. 리스트나 튜플의 길이를 구할 때도 똑같이 len()을 사용합니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "문자열은 인덱싱을 지원해서 word[0]처럼 대괄호와 번호로 특정 위치의 글자 하나를 꺼낼 수 있습니다. 첫 번째 글자의 인덱스는 0부터 시작합니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "인덱스로 -1을 사용하면 \"뒤에서 첫 번째\", 즉 마지막 글자를 바로 꺼낼 수 있습니다. 문자열의 길이를 몰라도 word[-1]로 항상 마지막 글자에 접근할 수 있어 편리합니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "슬라이싱 word[시작:끝]을 사용하면 문자열의 일부 구간을 잘라낼 수 있습니다. 끝 인덱스는 결과에 포함되지 않는다는 점에 주의해야 합니다 (예: word[0:3]은 0,1,2번째 글자)."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "문자열.upper()는 모든 알파벳을 대문자로 바꾼 새로운 문자열을 반환합니다. 원본 문자열은 바뀌지 않고, 결과를 변수에 저장하거나 바로 출력해서 사용합니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "문자열.replace(찾을문자열, 바꿀문자열)은 문자열 안에서 특정 부분을 다른 문자열로 바꾼 새 문자열을 반환합니다. 원본에서 \"Java\"라는 부분만 정확히 찾아서 바꿔줍니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "문자열.split(구분자)는 지정한 구분자를 기준으로 문자열을 나누어 리스트로 만들어줍니다. 콤마(,)로 구분된 데이터를 다룰 때 자주 사용하는 방법입니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "+ 연산자는 두 숫자를 더한 결과를 계산합니다. print() 안에 직접 계산식을 넣으면 그 결과가 바로 출력됩니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "파이썬의 기본 산술 연산자는 +(덧셈), -(뺄셈), *(곱셈), /(나눗셈)입니다. /로 나눈 결과는 나누어떨어지더라도 항상 실수(float)로 반환됩니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "// 연산자는 나눗셈의 몫만 정수로 구합니다. 일반 나눗셈(/)과 달리 소수점 이하를 버린 정수 결과를 얻고 싶을 때 사용합니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "% 연산자는 나눗셈의 나머지를 구합니다. 어떤 수가 짝수/홀수인지 판별하거나, 특정 주기로 반복되는 상황을 다룰 때 자주 활용됩니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "** 연산자는 거듭제곱을 계산합니다. 5 ** 2는 5의 2제곱, 즉 5 * 5와 같은 결과입니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "> 연산자는 왼쪽 값이 오른쪽 값보다 큰지 비교해서 True 또는 False를 반환합니다. 이런 비교 연산자의 결과는 항상 불리언(bool) 값입니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "== 연산자는 두 값이 같은지 비교합니다. 값을 저장하는 대입 연산자 =와 헷갈리기 쉬우니 \"비교\"에는 반드시 등호 두 개(==)를 써야 합니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "and 연산자는 앞뒤 두 조건이 모두 참일 때만 전체 결과가 True가 됩니다. \"20살 이상 그리고 30살 이하\"처럼 범위를 확인할 때 두 비교식을 and로 연결합니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "or 연산자는 앞뒤 조건 중 하나라도 참이면 전체 결과가 True가 됩니다. \"둘 중 하나\"라는 상황을 표현할 때 사용합니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "not 연산자는 True와 False를 서로 반대로 뒤집습니다. not True는 False가 되고, not False는 True가 됩니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "if 조건: 형태는 조건이 True일 때만 그 아래 들여쓴 코드를 실행합니다. 나이 >= 19처럼 비교 결과가 True인 경우에만 문자열이 출력됩니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "조건식 number > 0은 숫자가 0보다 큰지 판단합니다. if문의 조건 자리에는 이렇게 True/False로 판단되는 비교식이 들어갑니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "if와 else를 함께 쓰면 조건이 참일 때와 거짓일 때 각각 다른 코드를 실행할 수 있습니다. number % 2 == 0으로 짝수 여부를 판단합니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "if score >= 60: ... else: ...처럼 조건 하나로 두 가지 경우를 모두 처리할 수 있습니다. else는 앞의 if 조건이 거짓일 때 실행됩니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "문자열끼리도 ==로 비교할 수 있습니다. 입력값과 저장된 값이 정확히 같은 문자열인지 확인해서 로그인 성공 여부를 판단하는 방식입니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "if-elif-else를 사용하면 세 가지 이상의 경우를 순서대로 검사할 수 있습니다. 위에서부터 조건을 확인하다가 처음 참이 되는 조건의 코드만 실행됩니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "여러 점수 구간을 나눌 때는 elif를 연속으로 사용합니다. 조건은 위에서부터 순서대로 검사되므로, 높은 점수 조건을 먼저 써야 올바르게 등급이 나뉩니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "조건문은 나이 제한처럼 실제 서비스에서 흔히 쓰이는 \"자격 확인\" 로직을 표현하는 데 자주 사용됩니다. age >= 15라는 조건 하나로 입장 가능 여부를 판단할 수 있습니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "숫자 비교 조건(amount >= 50000)의 결과에 따라 서로 다른 안내 메시지를 출력하는 전형적인 if-else 활용 문제입니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "and 연산자로 여러 조건(로그인 상태, 관리자 여부)을 동시에 만족하는지 확인하고, 그 결과를 if문의 조건으로 사용해 여러 상태를 함께 판단할 수 있습니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "리스트는 [값1, 값2, 값3]처럼 대괄호로 여러 값을 순서대로 묶어 저장하는 자료구조입니다. 변수 하나로 여러 데이터를 함께 관리할 수 있습니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "리스트도 문자열처럼 인덱싱을 지원해서 리스트[0]으로 첫 번째 요소에 접근할 수 있습니다. 인덱스는 0부터 시작합니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "리스트[-1]은 마지막 요소를 가리킵니다. 리스트의 길이를 몰라도 음수 인덱스로 뒤에서부터 요소에 접근할 수 있는 파이썬의 편리한 기능입니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "리스트도 슬라이싱 리스트[시작:끝]으로 일부 구간만 잘라낼 수 있습니다. 끝 인덱스에 해당하는 값은 결과에 포함되지 않습니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "리스트.append(값)은 리스트의 맨 뒤에 새로운 값을 추가합니다. 리스트는 처음 만든 뒤에도 이렇게 계속 값을 추가할 수 있는 가변(mutable) 자료구조입니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "리스트.remove(값)은 리스트에서 지정한 값과 처음 일치하는 요소를 찾아 삭제합니다. 인덱스가 아니라 값 자체로 삭제하고 싶을 때 사용합니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "리스트[인덱스] = 새값 형태로 특정 위치의 값을 직접 바꿀 수 있습니다. 리스트는 인덱스로 값을 읽는 것뿐 아니라 수정도 자유롭게 가능합니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "len(리스트)는 리스트에 담긴 요소의 개수를 반환합니다. 문자열의 길이를 구할 때와 똑같은 함수를 사용합니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "리스트.sort()는 리스트 자체를 오름차순으로 정렬합니다. 원본 리스트가 직접 바뀐다는 점에서, 정렬된 새 리스트를 반환하는 sorted()와 차이가 있습니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "in 연산자는 특정 값이 리스트 안에 존재하는지 확인해서 True 또는 False를 반환합니다. \"바나나\" in 리스트처럼 직관적으로 포함 여부를 검사할 수 있습니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "튜플은 리스트와 비슷하지만 소괄호 (값1, 값2, 값3)로 만들며, 한 번 만들면 값을 변경할 수 없는(immutable) 자료구조입니다. 요일처럼 바뀌지 않는 고정된 데이터를 담기에 적합합니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "튜플도 리스트처럼 인덱싱을 지원해서 튜플[0]으로 첫 번째 값을 꺼낼 수 있습니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "튜플[-1]로 마지막 값을 바로 꺼낼 수 있습니다. 인덱싱과 슬라이싱 문법은 리스트, 문자열, 튜플 모두 동일하게 동작합니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "튜플도 슬라이싱 튜플[시작:끝]을 지원합니다. 리스트와 사용법이 완전히 같지만, 결과로 나오는 것도 튜플이라는 점이 다릅니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "len(튜플)로 튜플에 담긴 값의 개수를 구할 수 있습니다. 리스트, 문자열, 튜플 모두 len()으로 길이를 구하는 방식이 통일되어 있습니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "in 연산자는 튜플에도 똑같이 사용할 수 있어서, 특정 값이 튜플 안에 있는지 True/False로 확인할 수 있습니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "튜플끼리는 + 연산자로 이어붙여 새로운 튜플을 만들 수 있습니다. 문자열이나 리스트를 +로 합칠 때와 같은 원리입니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "튜플에 * 숫자를 곱하면 그 튜플이 반복된 새 튜플이 만들어집니다. 요소가 하나뿐인 튜플을 만들 때는 (\"안녕\",)처럼 값 뒤에 콤마를 꼭 붙여야 튜플로 인식됩니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "튜플 언패킹(unpacking)을 사용하면 name, age = 튜플처럼 튜플 안의 값들을 한 번에 여러 변수에 나눠 담을 수 있습니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "좌표처럼 두 값이 항상 세트로 다뤄지는 데이터는 튜플로 묶어 저장하는 경우가 많습니다. x, y = point처럼 언패킹해서 각 값을 따로 활용할 수 있습니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "for i in range(1, 6):은 1부터 5까지(6은 포함되지 않음) i에 순서대로 값을 대입하며 반복합니다. range(시작, 끝)의 끝 숫자는 결과에 포함되지 않는다는 점이 핵심입니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "for 변수 in 리스트:를 사용하면 리스트의 각 요소를 처음부터 끝까지 하나씩 변수에 대입하며 반복할 수 있습니다. 인덱스 없이 값 자체를 바로 다룰 수 있어 편리합니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "range(1, 11)로 반복하면서 if number % 2 == 0으로 짝수인 경우만 걸러 출력합니다. 반복문과 조건문을 함께 쓰는 대표적인 패턴입니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "반복문 밖에서 합계를 담을 변수(total = 0)를 미리 만들고, 반복할 때마다 total += i로 값을 누적하는 것이 \"합계 구하기\"의 기본 패턴입니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "range(5)처럼 시작값을 생략하면 0부터 시작해서 5번(0~4) 반복합니다. 반복 횟수만 필요하고 숫자 자체는 안 쓸 때 자주 쓰는 형태입니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "range(5, 0, -1)처럼 range에 세 번째 인자로 음수를 주면 감소하는 방향으로 반복합니다. (시작, 끝, 증감폭) 순서이며 끝 값은 포함되지 않습니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "중첩되지 않은 단순 반복으로도 구구단 한 단을 출력할 수 있습니다. range(1, 10)으로 1~9를 반복하며 2 * i를 계산해 출력합니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "number % 3 == 0 조건으로 3으로 나누어떨어지는(배수인) 숫자만 골라낼 수 있습니다. 나머지가 0이라는 것은 그 수로 나누어떨어진다는 뜻입니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "while 조건:은 조건이 True인 동안 계속 반복합니다. for문과 달리 반복 횟수를 직접 세면서(count += 1 등) 언제 멈출지 조건으로 제어해야 합니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "리스트를 for문으로 순회하며 total += number처럼 누적하면 합계를 구할 수 있습니다. 내장 함수 sum()으로도 같은 결과를 구할 수 있지만, 반복문으로 원리를 이해하는 것이 이 문제의 핵심입니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "def 함수이름(): 으로 함수를 정의하고, 함수이름()으로 호출하면 그 안의 코드가 실행됩니다. 함수는 반복해서 쓸 코드를 이름 붙여 저장해두는 것과 같습니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "함수는 def 함수이름(매개변수):처럼 괄호 안에 매개변수를 받을 수 있습니다. 호출할 때 넘긴 값이 매개변수에 저장되어 함수 안에서 사용됩니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "return 값은 함수를 호출한 곳으로 결과값을 돌려줍니다. print()로 함수 안에서 직접 출력하는 것과 달리, return한 값은 변수에 저장하거나 다른 계산에 재활용할 수 있습니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "매개변수로 받은 값을 함수 안에서 계산(number ** 2)한 뒤 return으로 결과를 돌려주는 구조입니다. 함수를 호출한 코드에서 print(square(5))처럼 바로 결과를 출력할 수 있습니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "함수 안에 if문을 넣으면, 조건에 따라 다른 값을 return할 수 있습니다. 나이를 받아 성인 여부를 \"판단해서 알려주는\" 역할을 함수가 대신합니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "함수는 여러 개의 return을 가질 수 있고, 조건에 따라 그중 하나만 실행되어 함수가 끝납니다. if 블록에서 return하면 그 아래 else는 실행되지 않고 바로 함수가 종료됩니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "두 값을 비교하는 조건문을 함수 안에 넣으면, 매번 다른 두 숫자를 넘겨도 같은 로직으로 큰 값을 구할 수 있습니다. 이것이 함수를 \"재사용 가능한 코드 뭉치\"라고 부르는 이유입니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "매개변수로 받은 값에 계산식(price * 0.9)을 적용해 새로운 값을 만들고 return합니다. 원래 값을 바꾸는 게 아니라, 계산된 새로운 결과를 돌려준다는 점에 주의하세요."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "함수의 매개변수로 리스트를 통째로 넘길 수도 있습니다. 함수 안에서 for문으로 그 리스트를 순회하며 각 값을 출력하는 방식입니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "함수 안에 if-elif-else로 여러 등급을 나누는 로직을 넣고, 각 조건에 맞는 등급 문자열을 return하도록 만듭니다. 조건문과 함수를 함께 활용하는 문제입니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "lambda 매개변수: 식은 이름 없이 간단한 계산 하나만 수행하는 함수를 즉석에서 만드는 문법입니다. map(함수, 리스트)는 리스트의 모든 요소에 그 함수를 적용한 결과를 반환하며, list()로 감싸야 실제 리스트로 변환됩니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "문자열을 거꾸로 뒤집는 가장 간단한 방법은 슬라이싱 word[::-1]입니다. 원본과 뒤집은 문자열이 완전히 같으면 회문(palindrome)이라고 판단할 수 있습니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "피보나치 수열은 바로 앞 두 항을 더해 다음 항을 만듭니다. 반복문을 돌며 두 변수(a, b)에 현재 값과 다음 값을 계속 갱신해 나가면 n번째 항까지 구할 수 있습니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "팩토리얼(n!)은 1부터 n까지 모든 숫자를 곱한 값입니다. result = 1에서 시작해 반복문으로 result *= i를 누적하면 곱셈 결과를 구할 수 있습니다."
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
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "set(리스트)로 감싸면 중복된 값이 자동으로 제거됩니다. 이후 sorted()로 감싸면 그 결과를 오름차순으로 정렬한 리스트로 만들 수 있습니다."
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
    "testCases": [{"input":"코드 실행","expected":"0으로 나눌 수 없습니다."}],
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
    "testCases": [{"input":"코드 실행","expected":"5.0"}],
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
    "testCases": [{"input":"코드 실행","expected":"인덱스 범위를 벗어났습니다.\n작업을 종료합니다."}],
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
    "testCases": [{"input":"코드 실행","expected":"숫자로 변환할 수 없습니다."}],
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
    "testCases": [{"input":"코드 실행","expected":"나이는 음수일 수 없습니다."}],
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
    "testCases": [{"input":"코드 실행","expected":"음수는 허용되지 않습니다."}],
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
    "testCases": [{"input":"코드 실행","expected":"민수\n20"}],
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
    "testCases": [{"input":"코드 실행","expected":"안녕하세요, 저는 찬희입니다."}],
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
    "testCases": [{"input":"코드 실행","expected":"초코\n개"}],
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
    "testCases": [{"input":"코드 실행","expected":"민수"}],
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
    "testCases": [{"input":"코드 실행","expected":"80"}],
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
    "testCases": [{"input":"코드 실행","expected":"사과: 1000\n바나나: 2000\n포도: 3000"}],
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
    "testCases": [{"input":"코드 실행","expected":"초코"}],
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
    "testCases": [{"input":"코드 실행","expected":"멍멍!"}],
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
    "testCases": [{"input":"코드 실행","expected":"초코\n말티즈"}],
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
    "testCases": [{"input":"코드 실행","expected":"멍멍!\n야옹!"}],
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
    "testCases": [{"input":"코드 실행","expected":"먹이를 먹습니다.\n꼬리를 흔듭니다."}],
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
    "testCases": [{"input":"코드 실행","expected":"True\nTrue"}],
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
    "testCases": [{"input":"코드 실행","expected":"[2, 4, 6, 8, 10]"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "리스트 컴프리헨션 [식 for 변수 in range(...) if 조건]은 반복문과 조건문을 한 줄로 압축해서 새 리스트를 만드는 파이썬만의 문법입니다. for문 + if문 + append()를 한 줄로 표현한 것과 같습니다."
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
    "testCases": [{"input":"코드 실행","expected":"{1: 1, 2: 4, 3: 9, 4: 16, 5: 25}"}],
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
    "testCases": [{"input":"코드 실행","expected":"6"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "2차원 리스트는 리스트 안에 리스트가 들어있는 구조입니다. 리스트[행][열]처럼 대괄호를 두 번 사용해 원하는 위치의 값에 접근합니다."
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
    "testCases": [{"input":"코드 실행","expected":"87.5"}],
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
    "testCases": [{"input":"코드 실행","expected":"[('민수', 90), ('영희', 85), ('철수', 70)]"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "sorted(리스트, key=함수)를 사용하면 리스트의 각 요소 중 어떤 기준으로 정렬할지 직접 지정할 수 있습니다. key=lambda x: x[1]은 \"각 튜플의 두 번째 값을 기준으로 정렬하라\"는 뜻이고, reverse=True를 추가하면 내림차순이 됩니다."
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
    "testCases": [{"input":"코드 실행","expected":"[3, 4]"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "집합(set)끼리 &연산자를 사용하면 두 집합에 공통으로 들어있는 값, 즉 교집합을 구할 수 있습니다. 결과는 순서가 없는 set이라 sorted()로 감싸 정렬된 리스트로 바꿔줍니다."
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
    "testCases": [{"input":"코드 실행","expected":"3.14"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "f-string 안에서 {값:.2f}처럼 쓰면 소수점 아래 자릿수를 지정해서 반올림된 형태로 출력할 수 있습니다. .2f는 \"소수점 둘째 자리까지의 실수(float)\"라는 뜻입니다."
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
    "testCases": [{"input":"코드 실행","expected":"007"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "f-string에서 {값:03d}처럼 쓰면 정수를 3자리로 만들면서 부족한 자리를 0으로 채워줍니다. zfill()이라는 문자열 메서드로도 같은 결과를 만들 수 있습니다."
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
    "testCases": [{"input":"코드 실행","expected":"사과, 바나나, 포도"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "\"구분자\".join(리스트)는 리스트의 각 요소를 지정한 구분자로 이어붙여 하나의 문자열로 합쳐줍니다. split()과 정반대의 역할을 하는 메서드라고 생각하면 기억하기 쉽습니다."
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
    "testCases": [{"input":"코드 실행","expected":"120"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "재귀함수는 함수가 자기 자신을 다시 호출하는 함수입니다. factorial(n)은 n * factorial(n-1)로 정의되며, n이 1(또는 0)이 되면 더 이상 호출하지 않고 값을 반환하는 \"기저 조건\"이 반드시 필요합니다."
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
    "testCases": [{"input":"코드 실행","expected":"4"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "이진 탐색은 정렬된 리스트에서 중간값과 찾는 값을 비교해가며 검색 범위를 절반씩 줄여나가는 알고리즘입니다. 중간값보다 찾는 값이 크면 오른쪽 절반만, 작으면 왼쪽 절반만 다시 탐색합니다."
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
    "testCases": [{"input":"코드 실행","expected":"[1, 2, 3, 4, 5]"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "버블 정렬은 인접한 두 값을 비교해서 순서가 잘못됐으면 서로 교환하는 과정을 리스트 전체에 반복하는 정렬 알고리즘입니다. 한 바퀴를 돌 때마다 가장 큰 값이 뒤쪽으로 \"떠오르듯\" 이동합니다."
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
    "testCases": [{"input":"코드 실행","expected":"9"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "최댓값을 직접 구하려면, 첫 번째 값을 \"지금까지의 최댓값\"으로 임시 저장한 뒤 나머지 값들과 하나씩 비교하며 더 큰 값이 나올 때마다 최댓값을 갱신하면 됩니다."
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
    "testCases": [{"input":"코드 실행","expected":"12"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "유클리드 호제법은 \"두 수의 최대공약수는, 큰 수를 작은 수로 나눈 나머지와 작은 수의 최대공약수와 같다\"는 원리를 이용합니다. 나머지가 0이 될 때까지 (b, a % b)로 계속 바꿔가며 재귀 또는 반복으로 구합니다."
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
    "testCases": [{"input":"코드 실행","expected":"2\n3\n5\n7\n11\n13\n17\n19"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "소수는 1과 자기 자신으로만 나누어떨어지는 2 이상의 자연수입니다. 2부터 n-1까지(또는 효율을 위해 제곱근까지)의 숫자로 나누어봐서 하나라도 나누어떨어지면 소수가 아니라고 판단합니다."
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
    "testCases": [{"input":"코드 실행","expected":"name | dept\n----------------------------------------\n김철수 | 개발팀\n이영희 | 기획팀\n박민수 | 개발팀\n최수민 | 디자인팀\n정찬희 | 개발팀"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "SELECT 뒤에 원하는 열 이름을 콤마로 나열하면 그 열들만 조회됩니다. *을 쓰면 모든 열이 나오지만, 필요한 열만 지정하면 결과가 더 명확하고 성능에도 유리합니다."
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
    "testCases": [{"input":"코드 실행","expected":"name | score\n----------------------------------------\n김철수 | 90\n박민수 | 100\n정찬희 | 95"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "WHERE절은 FROM에서 가져온 행 중 조건을 만족하는 행만 걸러냅니다. score >= 90처럼 비교 연산자로 숫자 조건을 표현할 수 있습니다."
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
    "testCases": [{"input":"코드 실행","expected":"name\n----------------------------------------\n김철수\n박민수\n정찬희"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "AND는 여러 조건을 모두 만족해야 참이 되는 연산자입니다. \"개발팀이면서 점수 90 이상\"처럼 두 조건을 동시에 만족하는 행만 남기고 싶을 때 사용합니다."
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
    "testCases": [{"input":"코드 실행","expected":"name\n----------------------------------------\n이영희\n최수민"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "OR는 여러 조건 중 하나라도 만족하면 참이 되는 연산자입니다. AND와 헷갈리기 쉬운데, \"둘 중 하나\"를 원할 땐 OR, \"둘 다\"를 원할 땐 AND를 씁니다."
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
    "testCases": [{"input":"코드 실행","expected":"name\n----------------------------------------\n김철수"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "LIKE는 문자열 패턴 매칭에 사용하며, %는 길이에 상관없이 아무 문자열이나 대응하는 와일드카드입니다. \"김%\"는 \"김\"으로 시작하는 모든 문자열과 일치합니다."
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
    "testCases": [{"input":"코드 실행","expected":"name | age\n----------------------------------------\n김철수 | 20\n이영희 | 25\n박민수 | 22\n정찬희 | 24"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "BETWEEN A AND B는 age >= A AND age <= B와 같은 뜻으로, 두 값을 포함한 범위를 조회할 때 씁니다. 부등호를 두 번 쓰는 것보다 간결합니다."
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
    "testCases": [{"input":"코드 실행","expected":"name | dept\n----------------------------------------\n김철수 | 개발팀\n이영희 | 기획팀\n박민수 | 개발팀\n정찬희 | 개발팀"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "IN은 여러 값 중 하나와 일치하는지 확인할 때 사용하며, dept = '개발팀' OR dept = '기획팀'을 IN ('개발팀', '기획팀')로 더 간결하게 표현할 수 있습니다."
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
    "testCases": [{"input":"코드 실행","expected":"name | score\n----------------------------------------\n박민수 | 100\n정찬희 | 95\n김철수 | 90\n이영희 | 85\n최수민 | 70"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "ORDER BY 열 DESC는 해당 열을 기준으로 내림차순(큰 값부터) 정렬합니다. 오름차순은 ASC이며, 기본값이라 생략할 수 있습니다."
  },
  {
    "id": "sql_q9",
    "title": "SQL 9. 정렬 후 상위 N개 조회하기",
    "category": "ORDER BY/LIMIT",
    "difficulty": "basic",
    "type": "coding",
    "language": "sql",
    "description": "점수가 가장 높은 상위 3명의 이름과 점수를 조회하세요.",
    "constraints": ["ORDER BY와 LIMIT을 함께 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"name | score\n----------------------------------------\n박민수 | 100\n정찬희 | 95\n김철수 | 90"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected":"name | score\n----------------------------------------\n박민수 | 100\n정찬희 | 95\n김철수 | 90"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "LIMIT은 조회 결과 중 앞에서부터 지정한 개수만 반환합니다. ORDER BY로 먼저 정렬한 뒤 LIMIT을 적용해야 \"상위 N개\"라는 의미가 성립합니다."
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
    "testCases": [{"input":"코드 실행","expected":"dept\n----------------------------------------\n개발팀\n기획팀\n디자인팀"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "DISTINCT는 조회 결과에서 완전히 같은 행(또는 지정한 열의 같은 값)을 하나로 합쳐 중복을 제거합니다. 부서 목록처럼 \"어떤 종류가 있는지\"를 볼 때 유용합니다."
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
    "testCases": [{"input":"코드 실행","expected":"cnt\n----------------------------------------\n5"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "COUNT(*)는 조건을 만족하는 행의 개수를 셉니다. AS로 결과 열에 별칭을 지정하면 결과가 더 읽기 쉬워집니다."
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
    "testCases": [{"input":"코드 실행","expected":"avg_score\n----------------------------------------\n88.0"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "AVG()는 지정한 열의 평균값을 계산하는 집계 함수입니다. COUNT, SUM, MAX, MIN과 함께 자주 쓰이는 대표적인 집계 함수 중 하나입니다."
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
    "testCases": [{"input":"코드 실행","expected":"dept | cnt\n----------------------------------------\n개발팀 | 3\n기획팀 | 1\n디자인팀 | 1"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "GROUP BY는 지정한 열의 같은 값끼리 행을 묶어줍니다. 이렇게 묶인 그룹마다 COUNT(*) 같은 집계 함수를 적용하면 그룹별 통계를 구할 수 있습니다."
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
    "testCases": [{"input":"코드 실행","expected":"dept | avg_score\n----------------------------------------\n개발팀 | 95.0\n기획팀 | 85.0"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "HAVING은 GROUP BY로 만들어진 그룹에 대해 조건을 거는 절입니다. WHERE는 그룹화 전 개별 행을 거르지만, 그룹 자체(예: 그룹 평균)를 거르려면 HAVING을 사용해야 합니다."
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
    "testCases": [{"input":"코드 실행","expected":"max_score | min_score\n----------------------------------------\n100 | 70"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "MAX()와 MIN()은 각각 지정한 열에서 가장 큰 값과 가장 작은 값을 구하는 집계 함수입니다. 한 SELECT문에서 여러 집계 함수를 동시에 사용할 수 있습니다."
  },
  {
    "id": "sql_q16",
    "title": "SQL 16. INNER JOIN으로 두 테이블 연결하기",
    "category": "JOIN",
    "difficulty": "advanced",
    "type": "coding",
    "language": "sql",
    "description": "users와 orders 테이블을 이름과 상품이 함께 보이도록 내부 조인하여 조회하세요.",
    "constraints": ["INNER JOIN ... ON u.id = o.user_id 형태를 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"name | product\n----------------------------------------\n김철수 | 노트북\n김철수 | 마우스\n박민수 | 키보드\n정찬희 | 모니터"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected":"name | product\n----------------------------------------\n김철수 | 노트북\n김철수 | 마우스\n박민수 | 키보드\n정찬희 | 모니터"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "INNER JOIN은 두 테이블에서 ON 조건이 일치하는 행끼리만 연결해서 보여줍니다. users.id = orders.user_id처럼 관계를 맺어주는 열을 ON에 명시해야 합니다."
  },
  {
    "id": "sql_q17",
    "title": "SQL 17. LEFT JOIN으로 전체 사용자 조회하기",
    "category": "JOIN",
    "difficulty": "advanced",
    "type": "coding",
    "language": "sql",
    "description": "주문이 없는 사용자도 포함하여 모든 사용자의 이름과 상품을 조회하세요. (주문이 없으면 NULL)",
    "constraints": ["LEFT JOIN을 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"name | product\n----------------------------------------\n김철수 | 노트북\n김철수 | 마우스\n이영희 | NULL\n박민수 | 키보드\n최수민 | NULL\n정찬희 | 모니터"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected":"name | product\n----------------------------------------\n김철수 | 노트북\n김철수 | 마우스\n이영희 | NULL\n박민수 | 키보드\n최수민 | NULL\n정찬희 | 모니터"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "LEFT JOIN은 왼쪽 테이블(users)의 모든 행을 기준으로, 오른쪽 테이블(orders)에 일치하는 값이 없으면 그 자리를 NULL로 채워서 보여줍니다. INNER JOIN과 달리 \"주문이 없는 사용자\"도 결과에서 사라지지 않습니다."
  },
  {
    "id": "sql_q18",
    "title": "SQL 18. JOIN + WHERE로 조건 필터링하기",
    "category": "JOIN",
    "difficulty": "advanced",
    "type": "coding",
    "language": "sql",
    "description": "주문 가격이 10만원 이상인 주문의 사용자 이름, 상품, 가격을 조회하세요.",
    "constraints": ["JOIN 이후 WHERE로 가격 조건을 추가하세요."],
    "examples": [{"input":"코드 출력 예시","output":"name | product | price\n----------------------------------------\n김철수 | 노트북 | 1500000\n박민수 | 키보드 | 120000\n정찬희 | 모니터 | 450000"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected":"name | product | price\n----------------------------------------\n김철수 | 노트북 | 1500000\n박민수 | 키보드 | 120000\n정찬희 | 모니터 | 450000"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "JOIN으로 두 테이블을 연결한 뒤에도 WHERE로 추가 조건을 걸 수 있습니다. JOIN이 먼저 두 테이블을 합치고, 그 결과에 WHERE 조건이 적용된다고 생각하면 이해하기 쉽습니다."
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
    "testCases": [{"input":"코드 실행","expected":"name | score\n----------------------------------------\n김철수 | 90\n박민수 | 100\n정찬희 | 95"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "서브쿼리(괄호 안의 SELECT문)는 먼저 실행되어 하나의 값(여기서는 전체 평균)을 만들고, 바깥 쿼리는 그 값을 조건으로 활용합니다. AVG(score)를 조건에 직접 쓸 수 없기 때문에 서브쿼리로 감싸야 합니다."
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
    "testCases": [{"input":"코드 실행","expected":"name\n----------------------------------------\n김철수\n박민수\n정찬희"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "IN 뒤에 서브쿼리를 쓰면, 그 서브쿼리가 만든 목록에 포함되는 값만 걸러낼 수 있습니다. \"주문 테이블에 등장하는 user_id 목록에 속하는 사용자\"를 찾는 전형적인 패턴입니다."
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
    "testCases": [{"input":"코드 실행","expected":"name\n----------------------------------------\n김철수\n박민수\n정찬희"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "EXISTS는 서브쿼리 결과가 하나라도 있으면 TRUE를 반환합니다. IN과 결과는 비슷하지만, EXISTS는 값 자체가 아니라 \"존재 여부\"만 확인하기 때문에 대량 데이터에서 더 효율적일 수 있습니다."
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
    "testCases": [{"input":"코드 실행","expected":"name\n----------------------------------------\n김철수\n박민수\n정찬희"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "UNION은 두 SELECT 결과를 세로로 합치면서 완전히 같은 행은 자동으로 제거합니다. 두 쿼리의 열 개수와 순서가 같아야 합니다."
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
    "testCases": [{"input":"코드 실행","expected":"dept\n----------------------------------------\n개발팀\n개발팀\n개발팀\n개발팀\n개발팀\n개발팀"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "UNION ALL은 UNION과 달리 중복 제거 없이 두 결과를 그대로 이어 붙입니다. 중복 제거 연산이 없어 UNION보다 처리 속도가 더 빠릅니다."
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
    "testCases": [{"input":"코드 실행","expected":"name | score | rnk\n----------------------------------------\n박민수 | 100 | 1\n정찬희 | 95 | 2\n김철수 | 90 | 3\n이영희 | 85 | 4\n최수민 | 70 | 5"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "RANK()는 OVER절과 함께 사용하는 윈도우 함수로, ORDER BY 기준으로 순위를 매깁니다. 동점이 있으면 같은 순위를 부여하고 다음 순위를 건너뜁니다(1, 1, 3 방식)."
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
    "testCases": [{"input":"코드 실행","expected":"name | score | rn\n----------------------------------------\n박민수 | 100 | 1\n정찬희 | 95 | 2\n김철수 | 90 | 3\n이영희 | 85 | 4\n최수민 | 70 | 5"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "ROW_NUMBER()도 윈도우 함수지만 RANK()와 달리 동점이어도 절대 겹치지 않는 고유한 순번을 1부터 매깁니다."
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
    "testCases": [{"input":"코드 실행","expected":"name | dept | score | dept_avg\n----------------------------------------\n김철수 | 개발팀 | 90 | 95.0\n박민수 | 개발팀 | 100 | 95.0\n정찬희 | 개발팀 | 95 | 95.0\n이영희 | 기획팀 | 85 | 85.0\n최수민 | 디자인팀 | 70 | 70.0"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "PARTITION BY는 윈도우 함수를 적용할 때 데이터를 그룹으로 나누는 역할을 합니다. GROUP BY와 달리 원본 행을 그대로 유지하면서, 각 행에 \"자신이 속한 그룹의 집계값\"을 함께 보여줄 수 있습니다."
  },
  {
    "id": "sql_q27",
    "title": "SQL 27. LEFT JOIN + IS NULL로 미주문 고객 찾기",
    "category": "NULL 처리",
    "difficulty": "advanced",
    "type": "coding",
    "language": "sql",
    "description": "주문 내역이 하나도 없는 사용자의 이름을 조회하세요.",
    "constraints": ["LEFT JOIN 후 주문 쪽 컬럼이 NULL인 행만 WHERE로 필터링하세요."],
    "examples": [{"input":"코드 출력 예시","output":"name\n----------------------------------------\n이영희\n최수민"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected":"name\n----------------------------------------\n이영희\n최수민"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "LEFT JOIN 결과에서 오른쪽 테이블 값이 NULL인 행만 걸러내면 \"왼쪽에는 있지만 오른쪽과 연결되지 않은\" 데이터를 찾을 수 있습니다. 미주문 고객을 찾는 대표적인 패턴입니다."
  },
  {
    "id": "sql_q28",
    "title": "SQL 28. COALESCE로 NULL 대체하기",
    "category": "NULL 처리",
    "difficulty": "intermediate",
    "type": "coding",
    "language": "sql",
    "description": "모든 사용자의 이름과 주문 상품을 조회하되, 주문이 없는 경우 \"주문없음\"으로 표시하세요.",
    "constraints": ["LEFT JOIN과 COALESCE를 함께 사용하세요."],
    "examples": [{"input":"코드 출력 예시","output":"name | product\n----------------------------------------\n김철수 | 노트북\n김철수 | 마우스\n이영희 | 주문없음\n박민수 | 키보드\n최수민 | 주문없음\n정찬희 | 모니터"}],
    "initialCode": "",
    "testCases": [{"input":"코드 실행","expected":"name | product\n----------------------------------------\n김철수 | 노트북\n김철수 | 마우스\n이영희 | 주문없음\n박민수 | 키보드\n최수민 | 주문없음\n정찬희 | 모니터"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "COALESCE(값, 대체값)는 첫 번째 값이 NULL일 때 지정한 대체값을 대신 반환합니다. LEFT JOIN으로 생긴 NULL을 사람이 읽기 좋은 문구로 바꿀 때 자주 사용합니다."
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
    "testCases": [{"input":"코드 실행","expected":"name | grade\n----------------------------------------\n김철수 | A\n이영희 | B\n박민수 | A\n최수민 | C\n정찬희 | A"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "CASE WHEN 조건1 THEN 값1 WHEN 조건2 THEN 값2 ELSE 값3 END은 조건에 따라 다른 값을 반환하는 SQL의 조건문입니다. 위에서부터 순서대로 검사하다가 처음 참이 되는 조건의 값을 사용합니다."
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
    "testCases": [{"input":"코드 실행","expected":"dept | avg_score\n----------------------------------------\n개발팀 | 95.0\n기획팀 | 85.0\n디자인팀 | 70.0"}],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "ROUND(값, 자릿수)는 숫자를 지정한 소수 자릿수로 반올림합니다. AVG()의 결과가 소수점 아래로 길게 나올 때 보기 좋게 다듬는 용도로 자주 함께 쓰입니다."
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
    "correctAnswerIndex": 1
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
    "correctAnswerIndex": 2
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
    "correctAnswerText": "main",
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
    "correctAnswerIndex": 3
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
    "correctAnswerIndex": 0
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
    "correctAnswerText": "equals",
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
    "correctAnswerIndex": 3
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
    "correctAnswerIndex": 0
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
    "correctAnswerText": "break",
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
    "correctAnswerIndex": 2
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
    "correctAnswerIndex": 3
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
    "correctAnswerText": "new",
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
    "correctAnswerIndex": 3
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
    "correctAnswerIndex": 0
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
    "correctAnswerText": "continue",
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
    "correctAnswerIndex": 0
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
    "correctAnswerIndex": 1
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
    "correctAnswerText": "return",
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
    "correctAnswerIndex": 1
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
    "correctAnswerIndex": 2
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
    "correctAnswerText": "add",
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
    "correctAnswerIndex": 0
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
    "correctAnswerIndex": 1
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
    "correctAnswerText": "throw",
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
    "correctAnswerIndex": 1
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
    "correctAnswerIndex": 2
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
    "correctAnswerText": "this",
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
    "correctAnswerIndex": 0
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
    "correctAnswerIndex": 1
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
    "correctAnswerText": "super",
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
    "correctAnswerIndex": 2
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
    "correctAnswerIndex": 3
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
    "correctAnswerText": "interface",
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
    "correctAnswerIndex": 0
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
    "correctAnswerIndex": 1
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
    "correctAnswerText": "+",
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
        "expected": "김철수"
      }
    ],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "const는 재할당하지 않을 값을 저장할 때 쓰는 변수 선언 키워드입니다. console.log()는 괄호 안의 값을 콘솔에 출력하는 함수로, 파이썬의 print()와 같은 역할을 합니다."
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
        "expected": "12"
      }
    ],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "변수에 저장된 값끼리도 + 연산자로 계산할 수 있습니다. 숫자형 변수라면 문자열이 아닌 실제 덧셈이 수행됩니다."
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
        "expected": "파이팅! 파이팅! 파이팅! "
      }
    ],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "문자열.repeat(n)은 그 문자열을 n번 이어붙인 새 문자열을 반환합니다. 반복문 없이 문자열을 여러 번 출력하고 싶을 때 유용합니다."
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
        "expected": "홀수"
      }
    ],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "삼항 연산자(조건 ? 참일때값 : 거짓일때값)를 쓰면 if/else를 한 줄로 줄일 수 있습니다. number % 2 === 0은 2로 나눈 나머지가 0인지, 즉 짝수인지를 확인하는 조건입니다."
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
        "expected": "3"
      }
    ],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "배열.length는 배열에 들어있는 요소의 개수를 나타내는 속성입니다. 함수처럼 괄호를 붙이지 않고 값 그대로 사용합니다."
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
        "expected": "40"
      }
    ],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "자바스크립트 배열은 파이썬과 달리 음수 인덱스(arr[-1])를 지원하지 않습니다. 그래서 마지막 요소는 배열의 길이에서 1을 뺀 인덱스, 즉 numbers[numbers.length - 1]로 접근해야 합니다."
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
        "expected": "찬희님의 점수는 95점입니다."
      }
    ],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "템플릿 리터럴은 백틱(`)으로 문자열을 감싸고, 그 안에 ${변수}를 넣으면 변수의 값이 문자열 중간에 그대로 삽입됩니다. 문자열을 +로 이어붙이는 것보다 훨씬 읽기 좋습니다."
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
        "expected": "HELLO WORLD"
      }
    ],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "문자열.toUpperCase()는 문자열의 모든 알파벳을 대문자로 바꾼 새 문자열을 반환합니다. 원본 문자열 자체는 바뀌지 않고, 새 문자열이 만들어집니다."
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
        "expected": "Hello World"
      }
    ],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "템플릿 리터럴 안에서는 여러 변수를 동시에 넣을 수 있습니다. `${first} ${second}`처럼 사이에 원하는 문자(공백 등)를 그대로 넣어 자연스럽게 문장을 만들 수 있습니다."
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
        "expected": "미성년자"
      }
    ],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "삼항 연산자로 조건에 따라 다른 문자열을 즉시 계산해서 사용할 수 있습니다. age >= 18은 age가 18 이상인지 비교하는 조건식입니다."
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
        "expected": "55"
      }
    ],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "for (let i = 시작; 조건; i++) 형태의 for문은 초기값부터 조건을 만족하는 동안 반복하며 i를 하나씩 증가시킵니다. 반복마다 total += i로 누적해서 합계를 구합니다."
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
        "expected": "1, 4, 9, 16, 25"
      }
    ],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "배열.map(콜백함수)는 배열의 각 요소에 콜백함수를 적용한 결과로 이루어진 새 배열을 반환합니다. join(\", \")은 배열의 각 요소를 지정한 구분자로 이어붙여 하나의 문자열로 만듭니다."
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
        "expected": "2, 4, 6, 8, 10"
      }
    ],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "배열.filter(조건함수)는 조건함수가 true를 반환하는 요소만 모아서 새 배열을 반환합니다. n % 2 === 0으로 짝수만 골라낼 수 있습니다."
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
        "expected": "150"
      }
    ],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "배열.reduce((누적값, 현재값) => 계산, 초기값)은 배열의 모든 요소를 순서대로 계산해 하나의 값으로 합칩니다. 여기서는 누적값에 현재값을 계속 더해 총합을 구합니다."
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
        "expected": "9"
      }
    ],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "for...of문으로 배열의 모든 요소를 순회하면서, 지금까지 찾은 최댓값(max)보다 큰 값이 나올 때마다 max를 갱신하는 방식입니다. 함수는 마지막에 return으로 결과를 돌려줍니다."
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
        "expected": "0으로 나눌 수 없습니다."
      }
    ],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "throw new Error(\"메시지\")로 의도적으로 에러를 발생시키고, 이를 호출하는 쪽에서 try/catch로 감싸면 프로그램이 멈추지 않고 catch 블록에서 error.message로 에러 내용을 확인할 수 있습니다."
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
        "expected": "12000"
      }
    ],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "class의 constructor는 new로 객체를 만들 때 자동으로 실행되며, this.속성 = 값으로 그 객체만의 데이터를 저장합니다. 메서드 안에서도 this로 객체 자신의 속성에 접근하고 수정할 수 있습니다."
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
        "expected": "완료"
      }
    ],
    "testRunnerCode": "stdout_match",
    "solutionExplanation": "await는 Promise가 끝날 때까지 그 줄에서 기다렸다가 다음 줄로 진행합니다. wait(100)이 100ms 뒤에 resolve되는 Promise를 반환하므로, await wait(100) 다음 줄은 100ms 후에야 실행됩니다."
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
    "correctAnswerIndex": 1
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
    "correctAnswerIndex": 2
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
    "correctAnswerIndex": 3
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
    "correctAnswerIndex": 0
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
    "correctAnswerIndex": 1
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
    "correctAnswerIndex": 2
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
    "correctAnswerIndex": 3
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
    "correctAnswerIndex": 0
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
    "correctAnswerText": "function",
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
    "correctAnswerText": "constructor",
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
    "correctAnswerText": "push",
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
    "correctAnswerText": "async",
    "placeholderText": "정답 입력..."
  },

];
