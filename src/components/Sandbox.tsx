import { useState, useEffect, useRef } from 'react';
import { Play, FileCode, RefreshCw } from 'lucide-react';
import type { RunResponse } from '../hooks/usePyodide';

interface SandboxProps {
  runPythonCode: (code: string) => Promise<RunResponse>;
  isPyodideLoading: boolean;
  onIncrementSandboxRuns: () => void;
  code: string;
  setCode: (code: string) => void;
}

interface Snippet {
  name: string;
  desc: string;
  code: string;
}

const SNIPPETS: Snippet[] = [
  {
    name: '리스트 컴프리헨션',
    desc: '조건부 홀수 선별 및 변환',
    code: `# 파이썬 리스트 컴프리헨션 예제
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# 짝수는 제곱하고 홀수는 그대로 유지
result = [x**2 if x % 2 == 0 else x for x in numbers]

print("원본 리스트:", numbers)
print("변환 리스트:", result)
`
  },
  {
    name: '완전 탐색 & 조합 (Brute Force)',
    desc: 'itertools 활용한 순열과 조합',
    code: `# 파이썬 완전 탐색 (itertools) 예제
import itertools

data = ['A', 'B', 'C', 'D']

# 4개 중 2개를 순서대로 선택하는 순열
perms = list(itertools.permutations(data, 2))
print("순열 (Permutations):", perms)

# 4개 중 2개를 순서 없이 선택하는 조합
combs = list(itertools.combinations(data, 2))
print("조합 (Combinations):", combs)
`
  },
  {
    name: '투 포인터 (Two Pointers)',
    desc: '양 끝 인덱스로 목표 합 탐색',
    code: `# 투 포인터 알고리즘 예제
def two_sum(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        curr = arr[left] + arr[right]
        if curr == target:
            return (arr[left], arr[right])
        elif curr < target:
            left += 1
        else:
            right -= 1
    return None

numbers = [1, 3, 5, 7, 9, 11, 15]
target = 16
print(f"합이 {target}이 되는 쌍:", two_sum(numbers, target))
`
  },
  {
    name: '그리디 알고리즘 (Greedy)',
    desc: '거스름돈 최소 동전 개수 계산',
    code: `# 그리디 (탐욕법) 거스름돈 예제
def min_coins(change):
    coins = [500, 100, 50, 10]
    count = 0
    coin_details = {}
    for coin in coins:
        num = change // coin
        if num > 0:
            coin_details[f"{coin}원"] = num
        count += num
        change %= coin
    return count, coin_details

total_change = 1260
count, details = min_coins(total_change)
print(f"{total_change}원 거스름돈 동전 수:", count)
print("동전 구성:", details)
`
  },
  {
    name: '이진 탐색 (Binary Search)',
    desc: 'bisect 모듈 활용한 O(log N) 탐색',
    code: `# 이진 탐색 (Binary Search) 예제
import bisect

arr = [10, 20, 30, 40, 50, 60, 70, 80, 90]
target = 40

# bisect_left: target 이상이 처음 나오는 위치
idx = bisect.bisect_left(arr, target)
print(f"{target}의 인덱스:", idx)
print("원소 포함 여부:", idx < len(arr) and arr[idx] == target)
`
  },
  {
    name: 'BFS 너비 우선 탐색 (Graph)',
    desc: 'collections.deque 활용한 그래프 순회',
    code: `# BFS 너비 우선 탐색 예제
from collections import deque

def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    order = []
    
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order

graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B'],
    'F': ['C']
}

print("BFS 방문 순서:", bfs(graph, 'A'))
`
  },
  {
    name: '동적 계획법 (DP)',
    desc: '바텀업 메모아이제이션 피보나치',
    code: `# 동적 계획법 (Dynamic Programming) 예제
def fibonacci_dp(n):
    if n <= 0: return 0
    if n == 1: return 1
    
    dp = [0] * (n + 1)
    dp[1] = 1
    
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
        
    return dp[n]

n = 50
print(f"{n}번째 피보나치 수:", fibonacci_dp(n))
`
  },
  {
    name: '우선순위 큐 & 힙 (Heap)',
    desc: 'heapq를 이용한 실시간 최소값 정렬',
    code: `# 우선순위 큐 (heapq) 예제
import heapq

heap = []
scores = [45, 12, 89, 32, 67, 5]

for score in scores:
    heapq.heappush(heap, score)

print("원본 점수들:", scores)
print("최소 힙에서 작은 순서대로 추출:")
sorted_result = [heapq.heappop(heap) for _ in range(len(heap))]
print("정렬 결과:", sorted_result)
`
  },
  {
    name: '다중 조건 정렬 (Custom Sort)',
    desc: 'lambda 키를 이용한 다차원 요가 정렬',
    code: `# 다중 조건 정렬 예제
students = [
    ("김철수", 90, 85),
    ("이영희", 90, 95),
    ("박민수", 80, 100),
    ("정수진", 90, 85)
]

# 1순위: 국어 점수 내림차순 (-x[1])
# 2순위: 수학 점수 내림차순 (-x[2])
# 3순위: 이름 오름차순 (x[0])
sorted_students = sorted(students, key=lambda x: (-x[1], -x[2], x[0]))

print("=== 학생 성적 정렬 결과 ===")
for s in sorted_students:
    print(f"이름: {s[0]}, 국어: {s[1]}점, 수학: {s[2]}점")
`
  },
  {
    name: '버블 정렬 (Bubble Sort)',
    desc: '간단한 정렬 알고리즘 구현',
    code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

unordered = [64, 34, 25, 12, 22, 11, 90]
print("정렬 전:", unordered)
print("정렬 후:", bubble_sort(unordered.copy()))
`
  },
  {
    name: '클래스와 상속 (OOP)',
    desc: '객체 지향 프로그래밍 기초',
    code: `class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        return "소리를 냅니다."

class Dog(Animal):
    def speak(self):
        return "멍멍!"

class Cat(Animal):
    def speak(self):
        return "야옹~"

dog = Dog("바둑이")
cat = Cat("나비")

print(f"{dog.name}: {dog.speak()}")
print(f"{cat.name}: {cat.speak()}")
`
  },
  {
    name: '재귀 함수 (피보나치)',
    desc: '메모아이제이션을 활용한 피보나치',
    code: `def fibonacci_memo(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci_memo(n-1, memo) + fibonacci_memo(n-2, memo)
    return memo[n]

# 50번째 피보나치 수 계산
print("50번째 피보나치 수:", fibonacci_memo(50))
`
  }
];


export default function Sandbox({
  runPythonCode,
  isPyodideLoading,
  onIncrementSandboxRuns,
  code,
  setCode,
}: SandboxProps) {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [stdout, setStdout] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [activeSnippetIdx, setActiveSnippetIdx] = useState<number | null>(0);

  // Line numbers scroll sync
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Jupyter/Colab style cell execution shortcut: Ctrl+Enter, Cmd+Enter, or Shift+Enter
    if ((e.ctrlKey || e.metaKey || e.shiftKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
      return;
    }

    // Block paste keyboard shortcuts on Windows (Ctrl+V, Shift+Insert), macOS (Cmd+V), and Korean IME ('ㅍ')
    const key = e.key ? e.key.toLowerCase() : '';
    const codeKey = e.code || '';
    if (
      ((e.ctrlKey || e.metaKey) && (key === 'v' || key === 'ㅍ' || codeKey === 'KeyV' || e.keyCode === 86)) ||
      (e.shiftKey && (key === 'insert' || codeKey === 'Insert'))
    ) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Tab key -> 4 spaces indent
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      if (start === end) {
        // Single cursor
        if (e.shiftKey) {
          // Unindent
          const lineStart = code.lastIndexOf('\n', start - 1) + 1;
          const lineText = code.substring(lineStart, start);
          if (lineText.startsWith('    ')) {
            const newCode = code.substring(0, lineStart) + code.substring(lineStart + 4);
            setCode(newCode);
            setTimeout(() => {
              target.selectionStart = target.selectionEnd = Math.max(lineStart, start - 4);
            }, 0);
          } else {
            const spaceMatch = lineText.match(/^ +/);
            if (spaceMatch) {
              const removeCount = Math.min(spaceMatch[0].length, 4);
              const newCode = code.substring(0, lineStart) + code.substring(lineStart + removeCount);
              setCode(newCode);
              setTimeout(() => {
                target.selectionStart = target.selectionEnd = Math.max(lineStart, start - removeCount);
              }, 0);
            }
          }
        } else {
          // Indent 4 spaces
          const newCode = code.substring(0, start) + '    ' + code.substring(end);
          setCode(newCode);
          setTimeout(() => {
            target.selectionStart = target.selectionEnd = start + 4;
          }, 0);
        }
      } else {
        // Multi-line selection
        const lineStart = code.lastIndexOf('\n', start - 1) + 1;
        const selectedText = code.substring(lineStart, end);
        const lines = selectedText.split('\n');

        if (e.shiftKey) {
          let charsRemoved = 0;
          const unindentedLines = lines.map((line) => {
            if (line.startsWith('    ')) {
              charsRemoved += 4;
              return line.substring(4);
            }
            const spaces = line.match(/^ +/)?.[0].length || 0;
            const toRemove = Math.min(spaces, 4);
            charsRemoved += toRemove;
            return line.substring(toRemove);
          });
          const newCode = code.substring(0, lineStart) + unindentedLines.join('\n') + code.substring(end);
          setCode(newCode);
          setTimeout(() => {
            target.selectionStart = Math.max(lineStart, start - 4);
            target.selectionEnd = Math.max(start, end - charsRemoved);
          }, 0);
        } else {
          const indentedLines = lines.map((line) => '    ' + line);
          const addedLength = lines.length * 4;
          const newCode = code.substring(0, lineStart) + indentedLines.join('\n') + code.substring(end);
          setCode(newCode);
          setTimeout(() => {
            target.selectionStart = start + 4;
            target.selectionEnd = end + addedLength;
          }, 0);
        }
      }
    }
  };

  // Sync active snippet tab highlighting when code changes from external source (like DocsViewer)
  useEffect(() => {
    const matchedIdx = SNIPPETS.findIndex((s) => s.code === code);
    if (matchedIdx !== -1) {
      setActiveSnippetIdx(matchedIdx);
    } else {
      setActiveSnippetIdx(null);
    }
  }, [code]);

  const handleRun = async () => {
    if (isPyodideLoading) return;
    setIsRunning(true);
    setStdout('실행 중...');
    setError(null);

    try {
      const res = await runPythonCode(code);
      setStdout(res.stdout || '실행 성공 (출력 결과 없음)');
      if (res.error) {
        setError(res.error);
      }
      onIncrementSandboxRuns();
    } catch (err: any) {
      setError(err.message || '실행 도중 오류가 발생했습니다.');
    } finally {
      setIsRunning(false);
    }
  };

  const loadSnippet = (index: number) => {
    setCode(SNIPPETS[index].code);
    setActiveSnippetIdx(index);
    setStdout('');
    setError(null);
  };

  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 15) }, (_, i) => i + 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, height: '100%' }}>
      {/* Title Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'var(--font-display)', marginBottom: '0.25rem', color: '#1a1a1a' }}>
          코드 샌드박스 플레이그라운드
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          제약 없이 자유롭게 파이썬 코드를 작성하고 브라우저에서 실행해 보세요.
        </p>
      </div>

      {/* Main Workspace split */}
      <div className="sandbox-main-split" style={{ display: 'flex', gap: '1.25rem', flex: 1, height: 'calc(100vh - 180px)', minHeight: '500px' }}>
        {/* Left Side: Snippets Manager (Fixed Independent Pane) */}
        <div
          className="glass-card sandbox-snippets"
          style={{
            width: '280px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            flexShrink: 0,
            borderRadius: '0px',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <h3 style={{ fontSize: '0.9rem', fontWeight: '700', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', letterSpacing: '0.05em' }}>
            💡 파이썬 코드 예제
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
            {SNIPPETS.map((snippet, idx) => (
              <button
                key={idx}
                onClick={() => loadSnippet(idx)}
                style={{
                  padding: '0.85rem',
                  textAlign: 'left',
                  borderRadius: '0px',
                  background: activeSnippetIdx === idx ? '#1a1a1a' : '#ffffff',
                  border: '1px solid',
                  borderColor: activeSnippetIdx === idx ? '#1a1a1a' : 'var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: activeSnippetIdx === idx ? '#ffffff' : '#1a1a1a' }}>
                  {snippet.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: activeSnippetIdx === idx ? '#d1d5db' : 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: '1.4' }}>
                  {snippet.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Code Editor & Console Output */}
        <div className="sandbox-editor-pane" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0, height: '100%', minHeight: 0, overflowY: 'auto' }}>
          {/* Editor Board */}
          <div className="editor-frame" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            {/* Editor Header */}
            <div className="editor-tabs">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                <FileCode size={14} style={{ color: '#8b5cf6' }} />
                <span style={{ fontWeight: '600', color: '#ffffff' }}>sandbox.py (파이썬 편집기)</span>
              </div>
              <button
                onClick={() => {
                  setCode('');
                  setStdout('');
                  setError(null);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '0.72rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  marginLeft: 'auto',
                }}
              >
                <RefreshCw size={11} />
                비우기
              </button>
            </div>

            {/* Editor Workspace */}
            <div style={{ display: 'flex', flex: 1, minHeight: 0, position: 'relative', background: 'transparent' }}>
              {/* Synchronized Line Numbers */}
              <div
                ref={lineNumbersRef}
                style={{
                  padding: '1rem 0.5rem 1rem 1rem',
                  textAlign: 'right',
                  color: '#4b5563',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  lineHeight: '1.6',
                  userSelect: 'none',
                  borderRight: '1px solid #1e1b2e',
                  overflow: 'hidden',
                  flexShrink: 0,
                  pointerEvents: 'none',
                }}
              >
                {lineNumbers.map((num) => (
                  <div key={num}>{num}</div>
                ))}
              </div>

              {/* Textarea Code Area */}
              <textarea
                ref={textareaRef}
                value={code}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                onChange={(e) => {
                  const nativeEvent = e.nativeEvent as any;
                  if (nativeEvent?.inputType?.toLowerCase().includes('paste')) {
                    return;
                  }
                  setCode(e.target.value);
                }}
                onScroll={handleScroll}
                onKeyDown={handleKeyDown}
                onBeforeInput={(e: any) => {
                  if (e.nativeEvent?.inputType?.toLowerCase().includes('paste')) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                placeholder="여기에 파이썬 코드를 직접 타이핑하여 작성해 보세요..."
                className="code-editor-textarea"
                style={{
                  margin: '0px',
                  height: '100%',
                  flex: 1,
                  minHeight: 'auto',
                  padding: '1rem',
                  background: 'transparent',
                  boxShadow: 'none',
                  overflowY: 'auto',
                  whiteSpace: 'pre',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                }}
                disabled={isPyodideLoading}
              />
            </div>

            {/* Run Button */}
            <div
              style={{
                padding: '0.85rem',
                borderTop: '1px solid #1e1b2e',
                display: 'flex',
                justifyContent: 'flex-end',
                background: '#0a080f',
              }}
            >
              <button
                onClick={handleRun}
                className="btn-primary"
                style={{ padding: '0.6rem 1.6rem', fontSize: '0.78rem', background: '#ffffff', color: '#000000', borderColor: '#ffffff' }}
                disabled={isRunning || isPyodideLoading}
              >
                <Play size={14} />
                코드 실행하기
              </button>
            </div>
          </div>

          {/* Web Console Output */}
          <div className="terminal-frame" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '220px', flexShrink: 0 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>실행 콘솔 결과</span>
            <div className="console-container" style={{ flex: 1, padding: '0.5rem 0' }}>
              {isPyodideLoading && (
                <div style={{ color: 'var(--accent-yellow)', fontSize: '0.8rem' }}>
                  파이썬 WebAssembly 런타임을 로딩 중입니다...
                </div>
              )}
              {!isPyodideLoading && stdout === '' && !error && (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  <span className="console-prompt">&gt;</span> 코드를 실행하면 여기에 결과가 출력됩니다.
                </div>
              )}
              {stdout && (
                <div className="console-stdout" style={{ fontSize: '0.8rem', color: '#1a1a1a' }}>
                  {stdout.split('\n').map((line, idx) => (
                    <div key={idx}><span className="console-prompt">&gt;</span> {line}</div>
                  ))}
                </div>
              )}
              {error && (
                <div className="console-error" style={{ whiteSpace: 'pre-wrap', marginTop: '0.35rem', fontSize: '0.8rem' }}>
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
