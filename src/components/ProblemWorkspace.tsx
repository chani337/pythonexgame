import { useState, useEffect, useRef, Fragment } from 'react';
import { ChevronLeft, ChevronRight, Play, Send, RefreshCw, FileCode, CheckSquare, HelpCircle, AlertCircle, CheckCircle, XCircle, Star } from 'lucide-react';
import type { Problem } from '../data/problems';
import { solutionExplanations } from '../data/solutionExplanations';
import { solutionCode } from '../data/solutionCode';
import { decodeAnswer } from '../utils/answerObfuscation';
import { explainError } from '../utils/explainError';
import type { RunResponse, TestResult } from '../hooks/usePyodide';
import confetti from 'canvas-confetti';
import CodeEditor from './CodeEditor';
import type { EditorLanguage } from './CodeEditor';

interface ProblemWorkspaceProps {
  problem: Problem;
  onBack: () => void;
  onNextProblem?: () => void;
  onPrevProblem?: () => void;
  runPythonCode: (code: string, testCases?: { input: string; expected: string }[], testRunnerCode?: string) => Promise<RunResponse>;
  runJsCode?: (code: string, testCases?: { input: string; expected: string }[], testRunnerCode?: string) => Promise<RunResponse>;
  isPyodideLoading: boolean;
  onMarkSolved: (problemId: string) => void;
  isBookmarked?: boolean;
  onToggleReview?: (problemId: string) => void;
  onWrongAttempt?: (problemId: string) => void;
  backLabel?: string;
}

export default function ProblemWorkspace({
  problem,
  onBack,
  onNextProblem,
  onPrevProblem,
  runPythonCode,
  runJsCode,
  isPyodideLoading,
  onMarkSolved,
  isBookmarked,
  onToggleReview,
  onWrongAttempt,
  backLabel = '목록으로 돌아가기',
}: ProblemWorkspaceProps) {
  const problemLanguage = problem.language || 'python';
  const editorFileLabel =
    problemLanguage === 'sql' ? 'query.sql (SQL 편집기)' :
    problemLanguage === 'java' ? 'Main.java (자바 편집기)' :
    problemLanguage === 'js' ? 'main.js (자바스크립트 편집기)' :
    'main.py (파이썬 편집기)';
  const editorPlaceholder =
    problemLanguage === 'sql' ? '여기에 SQL 쿼리를 직접 타이핑하여 작성하세요...' :
    problemLanguage === 'java' ? '여기에 자바 코드를 직접 타이핑하여 작성하세요...' :
    problemLanguage === 'js' ? '여기에 자바스크립트 코드를 직접 타이핑하여 작성하세요...' :
    '여기에 파이썬 코드를 직접 타이핑하여 작성하세요...';
  // JS runs natively in the browser (Web Worker), so unlike Pyodide it has no loading phase
  const isRuntimeLoading = problemLanguage === 'js' ? false : isPyodideLoading;
  const executeCode = problemLanguage === 'js' && runJsCode ? runJsCode : runPythonCode;

  const [code, setCode] = useState<string>(problem.initialCode || '');
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number | null>(null);
  const [fillText, setFillText] = useState<string>('');
  
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const [consoleError, setConsoleError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [hasTested, setHasTested] = useState<boolean>(false);
  const [workspaceSuccess, setWorkspaceSuccess] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'desc' | 'editor'>('desc');
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  // Sticks once true for this problem-workspace session (doesn't reset on
  // toggling the panel closed) -- viewing the answer disqualifies this
  // attempt from counting toward solved/streak/leaderboard, so passing
  // afterward should still work as practice but not credit progress.
  const [viewedAnswer, setViewedAnswer] = useState<boolean>(false);

  // Auto-scroll the console to the bottom whenever a run finishes, so the
  // error explanation (rendered last) is visible without the user having to
  // notice the box is scrollable and drag it down themselves.
  const consoleContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (consoleContainerRef.current) {
      consoleContainerRef.current.scrollTop = consoleContainerRef.current.scrollHeight;
    }
  }, [consoleOutput, consoleError, testResults]);

  // Helper to safely render inline code backticks & operators
  const renderFormattedText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={i}
            style={{
              fontFamily: 'var(--font-mono)',
              background: '#eef2ff',
              padding: '0.15rem 0.4rem',
              borderRadius: '2px',
              fontSize: '0.84em',
              color: '#0969da',
              fontWeight: '600',
              border: '1px solid #d0d7de',
              fontVariantLigatures: 'none',
              fontFeatureSettings: '"calt" 0, "liga" 0',
            }}
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ fontWeight: '700', color: '#1a1a1a' }}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  // Reset workspace state when problem changes
  useEffect(() => {
    setCode(problem.initialCode || '');
    setSelectedQuizIndex(null);
    setFillText('');
    setConsoleOutput('');
    setConsoleError(null);
    setTestResults([]);
    setHasTested(false);
    setWorkspaceSuccess(false);
    setShowExplanation(false);
  }, [problem]);

  // Auto-dismiss the success toast after a few seconds so it doesn't sit on
  // top of the "해설 보기" button (and other lower controls) indefinitely --
  // previously the only way to clear it was to navigate away entirely.
  useEffect(() => {
    if (!workspaceSuccess) return;
    const timer = setTimeout(() => setWorkspaceSuccess(false), 4500);
    return () => clearTimeout(timer);
  }, [workspaceSuccess]);

  // Handle run/test action
  const handleRun = async () => {
    if (isRuntimeLoading) return;
    setIsRunning(true);
    setConsoleOutput(problemLanguage === 'js' ? '자바스크립트 코드를 실행 중...' : '파이썬 코드를 컴파일하고 실행 중...');
    setConsoleError(null);
    setWorkspaceSuccess(false);

    try {
      let codeToExecute = code;

      const decodedTestCases = problem.testCases?.map((tc) => ({
        ...tc,
        expected: decodeAnswer(tc.expected),
      }));
      const res = await executeCode(codeToExecute, decodedTestCases, problem.testRunnerCode);

      setConsoleOutput(res.stdout || (res.success ? '실행 완료 (출력값 없음)' : ''));
      if (res.error) {
        setConsoleError(res.error);
        setTestResults([]);
        onWrongAttempt?.(problem.id);
      } else if (res.testResults) {
        setTestResults(res.testResults);
        setHasTested(true);

        if (res.success) {
          setWorkspaceSuccess(true);
          if (!viewedAnswer) {
            onMarkSolved(problem.id);
          }
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } else {
          onWrongAttempt?.(problem.id);
        }
      }
    } catch (err: any) {
      setConsoleError(err.message || '실행 중 오류가 발생했습니다.');
      onWrongAttempt?.(problem.id);
    } finally {
      setIsRunning(false);
    }
  };

  // Handle quiz submission
  const handleSubmitQuiz = () => {
    if (selectedQuizIndex === null) return;
    setHasTested(true);
    
    const correctIndex = problem.correctAnswerIndex ? parseInt(decodeAnswer(problem.correctAnswerIndex), 10) : NaN;
    if (selectedQuizIndex === correctIndex) {
      setWorkspaceSuccess(true);
      setConsoleOutput('정답입니다! 올바른 이론적 추론입니다. 🎉');
      setConsoleError(null);
      onMarkSolved(problem.id);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } else {
      setWorkspaceSuccess(false);
      setConsoleError('오답입니다. 다시 한번 생각해 보세요!');
      onWrongAttempt?.(problem.id);
    }
  };

  // Handle fill-in-the-blank submission
  const handleSubmitFill = () => {
    if (!fillText.trim()) return;
    setHasTested(true);
    
    const decodedAnswerText = problem.correctAnswerText ? decodeAnswer(problem.correctAnswerText) : undefined;
    const isCorrect = fillText.trim().toLowerCase() === decodedAnswerText?.trim().toLowerCase();

    if (isCorrect) {
      setWorkspaceSuccess(true);
      setConsoleOutput(`정답입니다! 빈칸에 들어갈 코드는 '${decodedAnswerText}' 입니다. 🎉`);
      setConsoleError(null);
      onMarkSolved(problem.id);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } else {
      setWorkspaceSuccess(false);
      setConsoleError(`오답입니다. '${fillText}'은(는) 올바른 식별자가 아닙니다. 제약 조건을 확인하세요.`);
      onWrongAttempt?.(problem.id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1, height: '100%' }}>
      {/* Workspace Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <button
          onClick={onBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            transition: 'color 0.2s',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#1a1a1a')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <ChevronLeft size={15} />
          {backLabel}
        </button>

        {/* Quick Prev / Next Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {onToggleReview && (
            <button
              onClick={() => onToggleReview(problem.id)}
              title={isBookmarked ? '오답노트에서 제거' : '오답노트에 추가'}
              style={{
                background: isBookmarked ? '#fff8e6' : '#ffffff',
                border: '1px solid',
                borderColor: isBookmarked ? '#e8a90c' : 'var(--border-subtle)',
                color: isBookmarked ? '#a66908' : 'var(--text-secondary)',
                padding: '0.35rem 0.6rem',
                fontSize: '0.78rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <Star size={14} fill={isBookmarked ? '#e8a90c' : 'none'} />
              {isBookmarked ? '복습 표시됨' : '복습 표시'}
            </button>
          )}
          {onPrevProblem && (
            <button
              onClick={onPrevProblem}
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                color: '#1a1a1a',
                padding: '0.35rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
              }}
            >
              <ChevronLeft size={14} /> 이전 문제
            </button>
          )}
          {onNextProblem && (
            <button
              onClick={onNextProblem}
              style={{
                background: '#1a1a1a',
                border: '1px solid #1a1a1a',
                color: '#ffffff',
                padding: '0.35rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
              }}
            >
              다음 문제 <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="mobile-workspace-tabs" style={{ display: 'none', marginBottom: '0.75rem', gap: '0.5rem' }}>
        <button
          onClick={() => setMobileTab('desc')}
          style={{
            flex: 1,
            padding: '0.65rem',
            fontSize: '0.8rem',
            fontWeight: '700',
            background: mobileTab === 'desc' ? '#1a1a1a' : '#ffffff',
            color: mobileTab === 'desc' ? '#ffffff' : '#1a1a1a',
            border: '1px solid #1a1a1a',
            borderRadius: '0px',
            cursor: 'pointer',
          }}
        >
          📖 문제 설명
        </button>
        <button
          onClick={() => setMobileTab('editor')}
          style={{
            flex: 1,
            padding: '0.65rem',
            fontSize: '0.8rem',
            fontWeight: '700',
            background: mobileTab === 'editor' ? '#1a1a1a' : '#ffffff',
            color: mobileTab === 'editor' ? '#ffffff' : '#1a1a1a',
            border: '1px solid #1a1a1a',
            borderRadius: '0px',
            cursor: 'pointer',
          }}
        >
          💻 코드 작성 & 실행
        </button>
      </div>

      {/* Main Grid: Description | Editor */}
      <div
        className="problem-workspace-split"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
          gap: '1.25rem',
          flex: 1,
          alignItems: 'stretch',
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        {/* Left Side: Description Panel */}
        <div
          className={`glass-card ${mobileTab === 'editor' ? 'mobile-tab-desc-hidden' : ''}`}
          style={{
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem',
            overflowY: 'auto',
            height: '100%',
            borderRadius: '0px',
          }}
        >
          {/* Header */}
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className={`badge badge-${problem.difficulty}`}>
                {problem.difficulty === 'basic' ? '기초' : problem.difficulty === 'intermediate' ? '중급' : '고급'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                {problem.category}
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1a1a1a' }}>{problem.title}</h2>
          </div>

          {/* Problem Description */}
          <div>
            <h3 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1a1a1a', letterSpacing: '0.05em' }}>
              문제 설명
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
              {renderFormattedText(problem.description)}
            </div>
          </div>

          {/* SQL Table Schema Reference -- every SQL problem runs against this
              same fixed users/orders seed data (see usePyodide.ts), but
              nothing showed students the columns or rows, so writing a query
              meant guessing or remembering it from elsewhere. */}
          {problemLanguage === 'sql' && (
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1a1a1a', letterSpacing: '0.05em' }}>
                테이블 구조
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  {
                    name: 'users',
                    columns: 'id, name, age, score, dept',
                    rows: [
                      ['1', '김철수', '20', '90', '개발팀'],
                      ['2', '이영희', '25', '85', '기획팀'],
                      ['3', '박민수', '22', '100', '개발팀'],
                      ['4', '최수민', '28', '70', '디자인팀'],
                      ['5', '정찬희', '24', '95', '개발팀'],
                    ],
                  },
                  {
                    name: 'orders',
                    columns: 'order_id, user_id, product, price',
                    rows: [
                      ['101', '1', '노트북', '1500000'],
                      ['102', '1', '마우스', '30000'],
                      ['103', '3', '키보드', '120000'],
                      ['104', '5', '모니터', '450000'],
                    ],
                  },
                ].map((table) => (
                  <div key={table.name} style={{ border: '1px solid var(--border-subtle)', overflowX: 'auto' }}>
                    <div style={{ padding: '0.4rem 0.75rem', background: '#f4f4f6', fontSize: '0.75rem', fontWeight: '700', color: '#1a1a1a', fontFamily: 'var(--font-mono)' }}>
                      {table.name} ({table.columns})
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                      <thead>
                        <tr>
                          {table.columns.split(', ').map((col) => (
                            <th key={col} style={{ textAlign: 'left', padding: '0.35rem 0.75rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', fontWeight: '600' }}>
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {table.rows.map((row, i) => (
                          <tr key={i}>
                            {row.map((cell, j) => (
                              <td key={j} style={{ padding: '0.3rem 0.75rem', color: '#1a1a1a', borderBottom: i === table.rows.length - 1 ? 'none' : '1px solid var(--border-subtle)' }}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Constraints/Conditions */}
          <div>
            <h3 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1a1a1a', letterSpacing: '0.05em' }}>
              제약 조건 (Constraints)
            </h3>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {problem.constraints.map((c, i) => (
                <li key={i}>{renderFormattedText(c)}</li>
              ))}
            </ul>
          </div>

          {/* Input/Output Examples */}
          {problem.examples && problem.examples.length > 0 && (
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.75rem', color: '#1a1a1a', letterSpacing: '0.05em' }}>
                입출력 예시
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {problem.examples.map((example, i) => (
                  <div
                    key={i}
                    style={{
                      background: '#f4f4f6',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '0px',
                      padding: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', fontSize: '0.78rem' }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ color: 'var(--text-muted)', fontWeight: '700' }}>예시 입력:</span>
                        <pre style={{ fontFamily: 'var(--font-mono)', color: '#1a1a1a', marginTop: '0.25rem', whiteSpace: 'pre-wrap' }}>
                          {example.input}
                        </pre>
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ color: 'var(--text-muted)', fontWeight: '700' }}>예시 출력:</span>
                        <pre style={{ fontFamily: 'var(--font-mono)', color: '#0969da', marginTop: '0.25rem', whiteSpace: 'pre-wrap', fontWeight: '600' }}>
                          {example.output}
                        </pre>
                      </div>
                    </div>
                    {example.explanation && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                        <strong style={{ color: '#1a1a1a' }}>설명: </strong>
                        {example.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Action Area */}
        <div className={`problem-workspace-right ${mobileTab === 'desc' ? 'mobile-tab-editor-hidden' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', minHeight: 0, overflowY: 'auto' }}>
          {/* Coding Challenge View */}
          {problem.type === 'coding' && (
            <div className="editor-frame" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              {/* Editor Header */}
              <div className="editor-tabs">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <FileCode size={14} style={{ color: '#8b5cf6' }} />
                  <span style={{ fontWeight: '600', color: '#ffffff' }}>{editorFileLabel}</span>
                </div>
                <button
                  onClick={() => setCode(problem.initialCode || '')}
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
                  초기화
                </button>
              </div>

              {/* Editor Workspace */}
              <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative', background: 'transparent' }}>
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  language={problemLanguage as EditorLanguage}
                  placeholder={editorPlaceholder}
                  disabled={isRuntimeLoading}
                  onSubmitShortcut={handleRun}
                />
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  padding: '0.85rem',
                  borderTop: '1px solid #1e1b2e',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.5rem',
                  background: '#0a080f',
                  flexShrink: 0,
                }}
              >
                <button
                  onClick={() => handleRun()}
                  className="btn-secondary"
                  style={{ padding: '0.6rem 1.2rem', fontSize: '0.78rem', background: '#0a080f', color: '#cbd5e1', borderColor: '#2e2d3d' }}
                  disabled={isRunning || isRuntimeLoading}
                  title="코드 실행 (Ctrl + Enter 또는 Shift + Enter)"
                >
                  <Play size={14} />
                  코드 실행 <span style={{ fontSize: '0.68rem', opacity: 0.65, marginLeft: '0.2rem' }}>(Ctrl+Enter)</span>
                </button>
                <button
                  onClick={() => handleRun()}
                  className="btn-primary"
                  style={{ padding: '0.6rem 1.4rem', fontSize: '0.78rem', background: '#ffffff', color: '#000000', borderColor: '#ffffff' }}
                  disabled={isRunning || isRuntimeLoading}
                  title="제출하기 (Ctrl + Enter 또는 Shift + Enter)"
                >
                  <Send size={14} />
                  제출하기
                </button>
              </div>
            </div>
          )}

          {/* Multiple Choice Quiz View */}
          {problem.type === 'quiz' && (
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, borderRadius: '0px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <HelpCircle size={16} style={{ color: '#1a1a1a' }} />
                <span style={{ fontWeight: '700' }}>이론 퀴즈</span>
              </div>

              <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#1a1a1a', whiteSpace: 'pre-line', lineHeight: '1.5' }}>
                {problem.quizQuestion}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {problem.quizOptions?.map((option, index) => {
                  const isSelected = selectedQuizIndex === index;
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedQuizIndex(index);
                        setHasTested(false);
                      }}
                      style={{
                        padding: '0.85rem 1rem',
                        textAlign: 'left',
                        fontSize: '0.82rem',
                        background: isSelected ? '#1a1a1a' : '#ffffff',
                        border: '1px solid',
                        borderColor: isSelected ? '#1a1a1a' : '#d9d9d9',
                        borderRadius: '0px',
                        color: isSelected ? '#ffffff' : '#1a1a1a',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <strong style={{ color: isSelected ? '#ffffff' : 'var(--text-secondary)', marginRight: '0.5rem' }}>
                        {index + 1}.
                      </strong>
                      {option}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
                <button
                  className="btn-primary"
                  onClick={handleSubmitQuiz}
                  disabled={selectedQuizIndex === null}
                >
                  <Send size={15} />
                  정답 확인
                </button>
              </div>
            </div>
          )}

          {/* Fill in the Blank View */}
          {problem.type === 'fill' && (
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, borderRadius: '0px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <CheckSquare size={16} style={{ color: '#1a1a1a' }} />
                <span style={{ fontWeight: '700' }}>빈칸 완성하기</span>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                아래 코드 블록의 빈칸에 적절한 코드를 입력하여 전체 프로그램이 정상 동작하도록 하세요.
              </div>

              <pre
                style={{
                  background: '#f4f4f6',
                  padding: '1rem',
                  borderRadius: '0px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.88rem',
                  lineHeight: '1.6',
                  color: '#1a1a1a',
                  border: '1px solid var(--border-subtle)',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {problem.fillQuestion?.split('_____').map((part, i, arr) => (
                  <Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span
                        style={{
                          background: 'rgba(0, 0, 0, 0.08)',
                          borderBottom: '2px solid #1a1a1a',
                          padding: '0 0.4rem',
                          color: '#1a1a1a',
                          fontWeight: '700',
                        }}
                      >
                        {fillText || '_____'}
                      </span>
                    )}
                  </Fragment>
                ))}
              </pre>

              {/* Blank input form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>빈칸 입력</label>
                <input
                  type="text"
                  placeholder={problem.placeholderText || '답안 입력...'}
                  value={fillText}
                  onChange={(e) => {
                    setFillText(e.target.value);
                    setHasTested(false);
                  }}
                  className="glass-input"
                  style={{ width: '100%', fontFamily: 'var(--font-mono)', height: '38px', padding: '0 0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
                <button
                  className="btn-primary"
                  onClick={handleSubmitFill}
                  disabled={!fillText.trim()}
                >
                  <Send size={15} />
                  정답 확인
                </button>
              </div>
            </div>
          )}

          {/* Test Case Outputs & Web Console */}
          <div className="terminal-frame" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: '120px', maxHeight: '240px', flexShrink: 0, overflowY: 'auto' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>실행 콘솔 & 테스트 검증 결과</span>
            
            {/* Terminal Panel */}
            <div ref={consoleContainerRef} className="console-container" style={{ flex: 1, padding: '0.5rem 0' }}>
              {isRuntimeLoading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-yellow)', fontSize: '0.8rem' }}>
                  <RefreshCw size={12} className="pulse-glow" style={{ animation: 'spin 2s linear infinite' }} />
                  파이썬 WebAssembly 런타임을 로딩 중입니다...
                </div>
              )}
              {!isRuntimeLoading && !hasTested && consoleOutput === '' && (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  <span className="console-prompt">&gt;</span> 코드를 실행하면 여기에 출력 및 채점 로그가 나타납니다.
                </div>
              )}
              {consoleOutput && (
                <div className="console-stdout" style={{ fontSize: '0.8rem', color: '#1a1a1a' }}>
                  {consoleOutput.split('\n').map((line, idx) => (
                    <div key={idx}><span className="console-prompt">&gt;</span> {line}</div>
                  ))}
                </div>
              )}
              {consoleError && (
                <div className="console-error" style={{ whiteSpace: 'pre-wrap', marginTop: '0.35rem', fontSize: '0.8rem' }}>
                  <AlertCircle size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                  {consoleError}
                </div>
              )}
              {consoleError && explainError(consoleError) && (
                <div
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.7rem 0.9rem',
                    background: '#fffbeb',
                    border: '1px solid #fde68a',
                    fontSize: '0.78rem',
                    color: '#1a1a1a',
                    lineHeight: '1.55',
                  }}
                >
                  💡 {explainError(consoleError)}
                </div>
              )}
            </div>

            {/* Test Cases Table (only for coding challenges) */}
            {problem.type === 'coding' && testResults.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                  gap: '0.4rem',
                  fontSize: '0.72rem',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '0.5rem',
                }}
              >
                {testResults.map((tr, i) => (
                  <div
                    key={i}
                    style={{
                      background: tr.passed ? '#f4fbf7' : '#fff5f5',
                      border: tr.passed ? '1px solid #1a1a1a' : '1px solid #cf222e',
                      padding: '0.35rem 0.5rem',
                      borderRadius: '0px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem' }}>TEST {i + 1}</span>
                      <span style={{ fontWeight: '700', color: '#1a1a1a' }}>결과: {tr.passed ? 'PASS' : 'FAIL'}</span>
                    </div>
                    {tr.passed ? (
                      <CheckCircle size={13} style={{ color: '#1a1a1a' }} />
                    ) : (
                      <XCircle size={13} style={{ color: '#cf222e' }} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {(solutionExplanations[problem.id] || solutionCode[problem.id]) && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {solutionExplanations[problem.id] && (
                    <button
                      onClick={() => setShowExplanation((prev) => !prev)}
                      style={{
                        background: 'transparent',
                        border: '1px solid #8250df',
                        color: '#8250df',
                        padding: '0.4rem 0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      💡 {showExplanation ? '해설 접기' : '해설 보기'}
                    </button>
                  )}
                  {solutionCode[problem.id] && (
                    <button
                      onClick={() => {
                        setShowAnswer((prev) => !prev);
                        setViewedAnswer(true);
                      }}
                      style={{
                        background: 'transparent',
                        border: '1px solid #1a7f37',
                        color: '#1a7f37',
                        padding: '0.4rem 0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      📄 {showAnswer ? '정답 코드 접기' : '정답 코드 보기'}
                    </button>
                  )}
                </div>
                {showExplanation && solutionExplanations[problem.id] && (
                  <div
                    style={{
                      padding: '0.85rem 1rem',
                      background: '#faf5ff',
                      border: '1px solid #e2d4fb',
                      fontSize: '0.8rem',
                      color: '#1a1a1a',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {solutionExplanations[problem.id]}
                  </div>
                )}
                {showAnswer && solutionCode[problem.id] && (
                  <pre
                    style={{
                      margin: 0,
                      padding: '0.85rem 1rem',
                      background: '#f0fbf4',
                      border: '1px solid #c8e9d3',
                      fontSize: '0.78rem',
                      color: '#1a1a1a',
                      lineHeight: '1.6',
                      overflowX: 'auto',
                      fontFamily: 'var(--font-mono, monospace)',
                      whiteSpace: 'pre',
                    }}
                  >
                    {solutionCode[problem.id]}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal / Banner */}
      {workspaceSuccess && (
        <div className="slide-up-toast">
          <span style={{ fontSize: '1.25rem' }}>✨</span>
          <div style={{ color: '#1a1a1a' }}>
            <strong style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.02em', textTransform: 'uppercase' }}>Congratulations! Clear!</strong>
            <span style={{ fontSize: '0.75rem', opacity: 0.8, color: 'var(--text-secondary)' }}>
              {viewedAnswer
                ? '정답 코드를 확인한 문제라 해결 기록에는 반영되지 않아요.'
                : '해당 문제가 성공적으로 해결되었습니다.'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {onNextProblem && (
              <button
                onClick={onNextProblem}
                className="btn-primary"
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.75rem',
                }}
              >
                다음 문제 풀기
              </button>
            )}
            <button
              onClick={onBack}
              className="btn-secondary"
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.75rem',
                background: '#ffffff',
                color: '#1a1a1a',
                borderColor: '#1a1a1a',
              }}
            >
              목록으로
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

