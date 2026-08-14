const fs = require('fs');
const path = require('path');

const logDir = 'c:\\Users\\smhrd\\Desktop\\바이브';
const jsonPath = path.join(logDir, 'diag_line_281.json');
const outputPath = 'c:\\Users\\smhrd\\Desktop\\바이브\\src\\data\\problems.ts';

function run() {
  console.log('Reading diag_line_281.json...');
  if (!fs.existsSync(jsonPath)) {
    console.error('diag_line_281.json not found!');
    return;
  }

  const jsonContent = fs.readFileSync(jsonPath, 'utf8');
  const obj = JSON.parse(jsonContent);
  const rawText = obj.content || '';
  
  if (!rawText) {
    console.error('No content field in JSON!');
    return;
  }

  const rawLines = rawText.split('\n');
  console.log('Total raw lines in content:', rawLines.length);

  // Extract clean markdown text lines (remove diff markers if any)
  const cleanLines = [];
  let inDiffBlock = false;
  for (const line of rawLines) {
    if (line.includes('[diff_block_start]')) {
      inDiffBlock = true;
      continue;
    }
    if (line.includes('[diff_block_end]')) {
      inDiffBlock = false;
      continue;
    }
    if (inDiffBlock) {
      if (line.startsWith('+') && !line.startsWith('+++')) {
        cleanLines.push(line.substring(1));
      }
    } else {
      cleanLines.push(line);
    }
  }

  // If no lines extracted from diff, fall back to parsing directly
  let linesToUse = cleanLines.length > 50 ? cleanLines : rawLines.map(l => l.startsWith('+') ? l.substring(1) : l);
  const fullText = linesToUse.join('\n');

  // Split by parts starting with "# " followed by a number
  const parts = fullText.split(/(?=# \d+\.\s+)/);
  console.log(`Found ${parts.length} top-level segments.`);

  const problems = [];

  for (const partContent of parts) {
    if (!partContent.trim()) continue;
    const headerLines = partContent.split('\n');
    const partTitleLine = headerLines[0].trim(); // e.g., "# 1. 변수 문제 10개"
    const titleMatch = partTitleLine.match(/#\s*(\d+)\.\s*(.*?)\s*문제\s*\d+개/);
    if (!titleMatch) {
      console.log('Skipping segment (header match failed):', partTitleLine);
      continue;
    }
    
    const partNum = parseInt(titleMatch[1], 10);
    const category = titleMatch[2].trim(); // e.g., "변수"

    // Set difficulty based on category/part number:
    // 1~3 (변수, 문자열, 연산자): basic
    // 4~6 (조건문, 리스트, 튜플): intermediate
    // 7~9 (반복문, 함수, 딕셔너리): advanced
    let difficulty = 'basic';
    if (partNum >= 4 && partNum <= 6) {
      difficulty = 'intermediate';
    } else if (partNum >= 7) {
      difficulty = 'advanced';
    }

    // Split into individual problems using "## 문제 "
    const problemBlocks = partContent.split(/(?=## 문제\s+\d+\.\s+)/);
    console.log(`Processing Category "${category}" (Part ${partNum}), found ${problemBlocks.length - 1} problems.`);

    let qIdx = 0;
    for (const block of problemBlocks) {
      if (block.startsWith('# ')) continue; // Skip header block
      const blockLines = block.split('\n');
      const problemTitleLine = blockLines[0].trim(); // e.g. "## 문제 1. 이름 저장하기"
      
      const probTitleMatch = problemTitleLine.match(/## 문제\s*(\d+)\.\s*(.*)/);
      if (!probTitleMatch) {
        console.log('Skipping block (problem title match failed):', problemTitleLine);
        continue;
      }

      qIdx++;
      const probNum = parseInt(probTitleMatch[1], 10);
      const title = probTitleMatch[2].trim(); // e.g. "이름 저장하기"

      const contentText = blockLines.slice(1).join('\n');
      
      // Parse description: text before "**조건**"
      const descMatch = contentText.split('**조건**');
      const description = descMatch[0].trim();

      // Parse constraints: list under "**조건**"
      let constraints = [];
      const condSection = descMatch[1] ? descMatch[1].split('**실행 예시**')[0] : '';
      if (condSection) {
        constraints = condSection
          .split('\n')
          .map(l => l.trim())
          .filter(l => l.startsWith('-') || l.startsWith('*'))
          .map(l => l.substring(1).trim());
      }

      // Parse examples: text under "**실행 예시**" inside code block
      let outputExample = '';
      const examSection = contentText.split('**실행 예시**')[1];
      if (examSection) {
        const codeBlockMatch = examSection.match(/```(?:text)?\s*([\s\S]*?)```/);
        if (codeBlockMatch) {
          outputExample = codeBlockMatch[1].trim();
        }
      }

      const id = `${difficulty}_part${partNum}_q${probNum}`;
      
      // Set initial code templates
      let initialCode = '# 코드를 작성하세요\n';
      if (category === '변수' && probNum === 5) {
        initialCode = 'number = 10\n# 코드를 이어서 작성하세요\n';
      } else if (category === '변수' && probNum === 8) {
        initialCode = 'first = 100\n# 코드를 이어서 작성하세요\n';
      } else if (category === '조건문') {
        if (probNum === 1) initialCode = 'age = 20\n# 코드를 이어서 작성하세요\n';
        if (probNum === 2) initialCode = 'number = 10\n# 코드를 이어서 작성하세요\n';
        if (probNum === 3) initialCode = 'number = 7\n# 코드를 이어서 작성하세요\n';
        if (probNum === 4) initialCode = 'score = 75\n# 코드를 이어서 작성하세요\n';
        if (probNum === 5) initialCode = 'saved_password = "python123"\ninput_password = "python123"\n# 코드를 이어서 작성하세요\n';
        if (probNum === 6) initialCode = 'number = -5\n# 코드를 이어서 작성하세요\n';
        if (probNum === 7) initialCode = 'score = 85\n# 코드를 이어서 작성하세요\n';
        if (probNum === 8) initialCode = 'age = 13\n# 코드를 이어서 작성하세요\n';
        if (probNum === 9) initialCode = 'price = 65000\n# 코드를 이어서 작성하세요\n';
        if (probNum === 10) initialCode = 'is_login = True\nis_admin = True\n# 코드를 이어서 작성하세요\n';
      } else if (category === '리스트') {
        if (probNum === 2) initialCode = 'fruits = ["사과", "바나나", "포도"]\n# 코드를 이어서 작성하세요\n';
        if (probNum === 3) initialCode = 'numbers = [10, 20, 30, 40]\n# 코드를 이어서 작성하세요\n';
        if (probNum === 4) initialCode = 'numbers = [10, 20, 30, 40, 50]\n# 코드를 이어서 작성하세요\n';
        if (probNum === 5) initialCode = 'fruits = ["사과", "바나나"]\n# 코드를 이어서 작성하세요\n';
        if (probNum === 6) initialCode = 'fruits = ["사과", "바나나", "포도"]\n# 코드를 이어서 작성하세요\n';
        if (probNum === 7) initialCode = 'numbers = [10, 20, 30]\n# 코드를 이어서 작성하세요\n';
        if (probNum === 8) initialCode = 'numbers = [10, 20, 30, 40, 50]\n# 코드를 이어서 작성하세요\n';
        if (probNum === 9) initialCode = 'numbers = [5, 2, 4, 1, 3]\n# 코드를 이어서 작성하세요\n';
        if (probNum === 10) initialCode = 'fruits = ["사과", "바나나", "포도"]\n# 코드를 이어서 작성하세요\n';
      } else if (category === '튜플') {
        if (probNum === 2) initialCode = 'numbers = (10, 20, 30)\n# 코드를 이어서 작성하세요\n';
        if (probNum === 3) initialCode = 'numbers = (10, 20, 30, 40)\n# 코드를 이어서 작성하세요\n';
        if (probNum === 4) initialCode = 'numbers = (10, 20, 30, 40, 50)\n# 코드를 이어서 작성하세요\n';
        if (probNum === 5) initialCode = 'numbers = (1, 2, 3, 4, 5)\n# 코드를 이어서 작성하세요\n';
        if (probNum === 6) initialCode = 'cities = ("서울", "부산", "광주")\n# 코드를 이어서 작성하세요\n';
        if (probNum === 7) initialCode = 'tuple1 = (1, 2, 3)\ntuple2 = (4, 5, 6)\n# 코드를 이어서 작성하세요\n';
        if (probNum === 8) initialCode = 't = ("안녕",)\n# 코드를 이어서 작성하세요\n';
        if (probNum === 9) initialCode = 'data = ("민수", 25)\n# 코드를 이어서 작성하세요\n';
        if (probNum === 10) initialCode = 'point = (10, 20)\n# 코드를 이어서 작성하세요\n';
      } else if (category === '반복문') {
        if (probNum === 2) initialCode = 'fruits = ["사과", "바나나", "포도"]\n# 코드를 이어서 작성하세요\n';
        if (probNum === 10) initialCode = 'numbers = [10, 20, 30, 40]\n# 코드를 이어서 작성하세요\n';
      } else if (category === '함수') {
        if (probNum === 1) {
          initialCode = 'def hello():\n    # 여기에 코드를 작성하세요\n    pass\n\n# 함수를 호출하여 확인하는 코드를 아래 작성하세요\nhello()';
        } else if (probNum === 2) {
          initialCode = 'def hello(name):\n    # 여기에 코드를 작성하세요\n    pass\n\n# 함수를 호출하여 확인하는 코드를 아래 작성하세요\nhello("민수")';
        } else if (probNum === 3) {
          initialCode = 'def add(a, b):\n    # 여기에 코드를 작성하세요\n    pass\n\n# 함수를 호출하여 출력하는 코드를 아래 작성하세요\nprint(add(10, 20))';
        } else if (probNum === 4) {
          initialCode = 'def square(n):\n    # 여기에 코드를 작성하세요\n    pass\n\n# 함수를 호출하여 출력하는 코드를 아래 작성하세요\nprint(square(5))';
        } else if (probNum === 5) {
          initialCode = 'def check_age(age):\n    # 여기에 코드를 작성하세요\n    pass\n\n# 함수를 호출하여 출력하는 코드를 아래 작성하세요\nprint(check_age(20))';
        } else if (probNum === 6) {
          initialCode = 'def check_number(n):\n    # 여기에 코드를 작성하세요\n    pass\n\n# 함수를 호출하여 출력하는 코드를 아래 작성하세요\nprint(check_number(8))';
        } else if (probNum === 7) {
          initialCode = 'def find_max(a, b):\n    # 여기에 코드를 작성하세요\n    pass\n\n# 함수를 호출하여 출력하는 코드를 아래 작성하세요\nprint(find_max(10, 20))';
        } else if (probNum === 8) {
          initialCode = 'def discount(price):\n    # 여기에 코드를 작성하세요\n    pass\n\n# 함수를 호출하여 출력하는 코드를 아래 작성하세요\nprint(discount(10000))';
        } else if (probNum === 9) {
          initialCode = 'def print_items(items):\n    # 여기에 코드를 작성하세요\n    pass\n\n# 함수를 호출하는 코드를 아래 작성하세요\nprint_items(["사과", "바나나", "포도"])';
        } else if (probNum === 10) {
          initialCode = 'def get_grade(score):\n    # 여기에 코드를 작성하세요\n    pass\n\n# 함수를 호출하여 출력하는 코드를 아래 작성하세요\nprint(get_grade(85))';
        }
      } else if (category === '딕셔너리') {
        if (probNum === 2) initialCode = 'student = {"name": "민수", "age": 20}\n# 코드를 이어서 작성하세요\n';
        if (probNum === 3) initialCode = 'student = {"name": "민수", "age": 20}\n# 코드를 이어서 작성하세요\n';
        if (probNum === 4) initialCode = 'student = {"name": "민수", "age": 20}\n# 코드를 이어서 작성하세요\n';
        if (probNum === 5) initialCode = 'student = {"name": "민수", "age": 20}\n# 코드를 이어서 작성하세요\n';
        if (probNum === 6) initialCode = 'student = {"name": "민수", "age": 20, "city": "광주"}\n# 코드를 이어서 작성하세요\n';
        if (probNum === 7) initialCode = 'student = {"name": "민수", "age": 20, "city": "광주"}\n# 코드를 이어서 작성하세요\n';
        if (probNum === 8) initialCode = 'student = {"name": "민수", "age": 20}\n# 코드를 이어서 작성하세요\n';
        if (probNum === 9) initialCode = 'prices = {"키보드": 30000, "마우스": 15000, "모니터": 200000}\n# 코드를 이어서 작성하세요\n';
        if (probNum === 10) initialCode = 'scores = {"민수": 90, "철수": 70, "영희": 85}\n# 코드를 이어서 작성하세요\n';
      }

      problems.push({
        id,
        title: `${category} 문제 ${probNum}. ${title}`,
        category,
        difficulty,
        type: 'coding',
        description,
        constraints,
        examples: [
          {
            input: '코드 출력 예시',
            output: outputExample
          }
        ],
        initialCode,
        testCases: [
          {
            input: '코드 실행',
            expected: outputExample
          }
        ],
        testRunnerCode: 'stdout_match'
      });
    }
  }

  console.log(`Parsed total of ${problems.length} problems.`);

  if (problems.length === 0) {
    console.error('Failed to parse any problems. Formatting check needed.');
    return;
  }

  // Generate output file
  const tsContent = `// Auto-generated problems file from 문제.txt
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

export const problems: Problem[] = ${JSON.stringify(problems, null, 2)};
`;

  fs.writeFileSync(outputPath, tsContent, 'utf8');
  console.log(`Problems written successfully to ${outputPath}`);
}

run();
