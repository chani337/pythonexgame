import { useState, useEffect } from 'react';
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
      <div style={{ display: 'flex', gap: '1.25rem', flex: 1, flexWrap: 'wrap', alignItems: 'stretch', minHeight: 0 }}>
        {/* Left Side: Snippets Manager */}
        <div className="glass-card sandbox-snippets" style={{ width: '280px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flexShrink: 0, borderRadius: '0px' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: '700', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', letterSpacing: '0.05em' }}>
            💡 파이썬 코드 예제
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
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
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0, height: '100%', minHeight: 0, overflowY: 'auto' }}>
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
              {/* Line Numbers */}
              <div
                style={{
                  padding: '1rem 0.5rem 1rem 1rem',
                  textAlign: 'right',
                  color: '#4b5563',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  lineHeight: '1.6',
                  userSelect: 'none',
                  borderRight: '1px solid #1e1b2e',
                }}
              >
                {lineNumbers.map((num) => (
                  <div key={num}>{num}</div>
                ))}
              </div>

              {/* Textarea Code Area */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="여기에 파이썬 코드를 작성해 보세요..."
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
