import React, { useState, useEffect, useRef } from 'react';
import { docChapters } from '../data/docs';
import type { DocChapter } from '../data/docs';
import type { RunResponse } from '../hooks/usePyodide';
import { BookOpen, Play, Share2, AlertCircle, RefreshCw, PanelLeftClose, PanelLeftOpen, Maximize2, Minimize2, Sparkles, CheckCircle2, Circle, HelpCircle, X, Search, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { chapterQuizzes } from '../data/chapterQuizzes';
import type { Problem } from '../data/problems';

interface DocsViewerProps {
  runPythonCode: (code: string) => Promise<RunResponse>;
  isPyodideLoading: boolean;
  onExportToSandbox: (code: string) => void;
  problems: Problem[];
  onSelectProblem: (problem: Problem) => void;
}

// Suggests practice problems related to a chapter by matching keywords extracted
// from the chapter title against each problem's category/title, scoped to the
// same language. Best-effort: chapters with no matching problems (e.g. the
// NumPy/Pandas/ML chapters) simply show no related-problems section.
function getRelatedProblems(chapter: DocChapter, allProblems: Problem[]): Problem[] {
  const lang = chapter.category === 'sql' ? 'sql' : chapter.category === 'java' ? 'java' : chapter.category === 'js' ? 'js' : 'python';

  const cleanTitle = chapter.title
    .replace(/^(SQL|Java|JS)\s*\d+\.\s*/i, '')
    .replace(/^\d+[.\-]\s*/, '')
    .replace(/[()&/,]/g, ' ')
    .replace(/(정리|기초|입문|마스터|핵심)/g, '')
    .trim();

  const keywords = Array.from(new Set(cleanTitle.split(/[\s_]+/).filter((w) => w.length >= 2)));
  if (keywords.length === 0) return [];

  return allProblems
    .filter((p) => (p.language || 'python') === lang)
    .filter((p) => keywords.some((kw) => p.category.includes(kw) || p.title.includes(kw) || kw.includes(p.category)))
    .slice(0, 4);
}

export default function DocsViewer({
  runPythonCode,
  isPyodideLoading,
  onExportToSandbox,
  problems,
  onSelectProblem,
}: DocsViewerProps) {
  // Remember the last-viewed category/chapter so returning here (e.g. via a
  // related-problem's "back" button, which unmounts this component) restores
  // where the reader left off instead of resetting to Python chapter 1.
  const [selectedCategory, setSelectedCategory] = useState<'python' | 'sql' | 'java' | 'js'>(() => {
    const saved = localStorage.getItem('pyquests_docs_last_category');
    return saved === 'sql' || saved === 'java' || saved === 'js' || saved === 'python' ? saved : 'python';
  });
  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number>(() => {
    const saved = localStorage.getItem('pyquests_docs_last_chapter_idx');
    return saved !== null ? JSON.parse(saved) : 0;
  });
  const [codeOutputs, setCodeOutputs] = useState<Record<string, { stdout: string; error: string | null; isRunning: boolean }>>({});
  const [isTocOpen, setIsTocOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem('pyquests_docs_toc_open');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [fontSizeScale, setFontSizeScale] = useState<number>(100);
  const [chapterSearchQuery, setChapterSearchQuery] = useState<string>('');

  const { user, syncReadChapterToSupabase, fetchUserReadChapterIds, syncQuizAnswerToSupabase, fetchUserQuizAnswers } = useAuth();

  const [readChapterIds, setReadChapterIds] = useState<string[]>(() => {
    const lastId = localStorage.getItem('pyquests_last_user_id') || 'guest';
    const saved = localStorage.getItem(`pyquests_read_chapters_${lastId}`);
    return saved ? JSON.parse(saved) : [];
  });

  // Reload read-chapter progress when the logged-in user changes (login/logout/guest),
  // merging any local guest progress with what's already saved in Supabase for this account.
  useEffect(() => {
    const activeUserId = user?.id || 'guest';
    const localKey = `pyquests_read_chapters_${activeUserId}`;
    const localSaved = localStorage.getItem(localKey);
    const localIds: string[] = localSaved ? JSON.parse(localSaved) : [];

    if (user) {
      fetchUserReadChapterIds().then((remoteIds) => {
        const merged = Array.from(new Set([...localIds, ...remoteIds]));
        setReadChapterIds(merged);
        localStorage.setItem(localKey, JSON.stringify(merged));
      });
    } else {
      setReadChapterIds(localIds);
    }
  }, [user]);

  const toggleChapterRead = (chapterId: string) => {
    setReadChapterIds((prev) => {
      const willBeRead = !prev.includes(chapterId);
      const next = willBeRead
        ? [...prev, chapterId]
        : prev.filter((id) => id !== chapterId);
      const activeUserId = user?.id || 'guest';
      localStorage.setItem(`pyquests_read_chapters_${activeUserId}`, JSON.stringify(next));
      syncReadChapterToSupabase(chapterId, willBeRead);
      return next;
    });
  };

  const markChapterRead = (chapterId: string) => {
    setReadChapterIds((prev) => {
      if (prev.includes(chapterId)) return prev;
      const next = [...prev, chapterId];
      const activeUserId = user?.id || 'guest';
      localStorage.setItem(`pyquests_read_chapters_${activeUserId}`, JSON.stringify(next));
      syncReadChapterToSupabase(chapterId, true);
      return next;
    });
  };

  // Chapter comprehension-check quiz: answers keyed by `${chapterId}_${questionIndex}`
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>(() => {
    const lastId = localStorage.getItem('pyquests_last_user_id') || 'guest';
    const saved = localStorage.getItem(`pyquests_docs_quiz_answers_${lastId}`) || localStorage.getItem('pyquests_docs_quiz_answers');
    return saved ? JSON.parse(saved) : {};
  });

  // Reload quiz-answer progress when the logged-in user changes (login/logout/guest),
  // merging any local guest progress with what's already saved in Supabase for this account.
  useEffect(() => {
    const activeUserId = user?.id || 'guest';
    const localKey = `pyquests_docs_quiz_answers_${activeUserId}`;
    const localSaved = localStorage.getItem(localKey) || localStorage.getItem('pyquests_docs_quiz_answers');
    const localAnswers: Record<string, number> = localSaved ? JSON.parse(localSaved) : {};

    if (user) {
      fetchUserQuizAnswers().then((remoteAnswers) => {
        const merged = { ...remoteAnswers, ...localAnswers };
        setQuizAnswers(merged);
        localStorage.setItem(localKey, JSON.stringify(merged));
      });
    } else {
      setQuizAnswers(localAnswers);
    }
  }, [user]);

  const selectQuizAnswer = (chapterId: string, qIndex: number, optionIndex: number) => {
    setQuizAnswers((prev) => {
      const key = `${chapterId}_${qIndex}`;
      if (prev[key] !== undefined) return prev; // already answered, keep first answer
      const next = { ...prev, [key]: optionIndex };
      const activeUserId = user?.id || 'guest';
      localStorage.setItem(`pyquests_docs_quiz_answers_${activeUserId}`, JSON.stringify(next));
      return next;
    });
    syncQuizAnswerToSupabase(chapterId, qIndex, optionIndex);
  };

  const viewerRef = useRef<HTMLDivElement>(null);
  const focusViewerRef = useRef<HTMLDivElement>(null);

  const filteredChapters = docChapters.filter((ch) => {
    if (selectedCategory === 'sql') {
      return ch.category === 'sql';
    }
    if (selectedCategory === 'java') {
      return ch.category === 'java';
    }
    if (selectedCategory === 'js') {
      return ch.category === 'js';
    }
    return ch.category !== 'sql' && ch.category !== 'java' && ch.category !== 'js';
  });

  // Chapter TOC search: matches by title or cell content, but keeps each entry's
  // original index within filteredChapters so selection stays correct after filtering.
  const chapterEntries = filteredChapters.map((chapter, idx) => ({ chapter, idx }));
  const searchedChapterEntries = (() => {
    const q = chapterSearchQuery.trim().toLowerCase();
    if (!q) return chapterEntries;
    return chapterEntries.filter(({ chapter }) => {
      if (chapter.title.toLowerCase().includes(q)) return true;
      return chapter.cells.some((cell) => cell.content.toLowerCase().includes(q));
    });
  })();

  const activeChapter = filteredChapters[selectedChapterIdx] || filteredChapters[0] || docChapters[0];
  const readCountInCategory = filteredChapters.filter((ch) => readChapterIds.includes(ch.id)).length;
  const isActiveChapterRead = readChapterIds.includes(activeChapter.id);
  const activeQuiz = chapterQuizzes.find((q) => q.chapterId === activeChapter.id);
  const relatedProblems = getRelatedProblems(activeChapter, problems);

  // Auto-mark the chapter as read once every quiz question is answered correctly
  useEffect(() => {
    if (!activeQuiz) return;
    const allCorrect = activeQuiz.questions.every((q, qIdx) => {
      const key = `${activeChapter.id}_${qIdx}`;
      return quizAnswers[key] === q.correctIndex;
    });
    if (allCorrect) {
      markChapterRead(activeChapter.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizAnswers, activeChapter.id]);

  const renderChapterQuiz = () => {
    if (!activeQuiz) return null;
    return (
      <div style={{ marginTop: '2.5rem', paddingTop: '1.75rem', borderTop: '2px solid #1a1a1a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <HelpCircle size={18} color="#1a1a1a" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1a1a1a' }}>이해도 체크</h3>
        </div>
        {activeQuiz.questions.map((q, qIdx) => {
          const key = `${activeChapter.id}_${qIdx}`;
          const answered = quizAnswers[key];
          return (
            <div key={key} style={{ marginBottom: '1.5rem', padding: '1.1rem 1.25rem', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '0.85rem' }}>
                Q{qIdx + 1}. {q.question}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {q.options.map((opt, optIdx) => {
                  const isSelected = answered === optIdx;
                  const isCorrectOption = optIdx === q.correctIndex;
                  let bg = '#ffffff';
                  let border = '1px solid var(--border-subtle)';
                  let color = 'var(--text-secondary)';
                  if (answered !== undefined) {
                    if (isCorrectOption) {
                      bg = '#dcfce7';
                      border = '1px solid #16a34a';
                      color = '#15803d';
                    } else if (isSelected && !isCorrectOption) {
                      bg = '#fee2e2';
                      border = '1px solid #dc2626';
                      color = '#b91c1c';
                    }
                  }
                  return (
                    <button
                      key={optIdx}
                      onClick={() => selectQuizAnswer(activeChapter.id, qIdx, optIdx)}
                      disabled={answered !== undefined}
                      style={{
                        textAlign: 'left',
                        padding: '0.6rem 0.9rem',
                        fontSize: '0.8rem',
                        fontWeight: isSelected || (answered !== undefined && isCorrectOption) ? '700' : '500',
                        background: bg,
                        border,
                        color,
                        cursor: answered !== undefined ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      {answered !== undefined && isCorrectOption && <CheckCircle2 size={14} color="#16a34a" style={{ flexShrink: 0 }} />}
                      {answered !== undefined && isSelected && !isCorrectOption && <X size={14} color="#dc2626" style={{ flexShrink: 0 }} />}
                      {opt}
                    </button>
                  );
                })}
              </div>
              {answered !== undefined && (
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.75rem', lineHeight: '1.5' }}>
                  {answered === q.correctIndex ? '✅ 정답입니다! ' : '❌ 오답입니다. '}
                  {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Shared cell renderer for both focus mode and the normal split-view layout.
  // 'focus' uses the dark terminal-style output console; 'normal' uses the light card style.
  const renderChapterCells = (variant: 'focus' | 'normal') => {
    const codeFontSize = variant === 'focus' ? '0.88rem' : '0.82rem';
    const handleExport = (code: string) => {
      if (variant === 'focus') toggleFocusMode();
      onExportToSandbox(code);
    };

    return (
      <>
        {activeChapter.cells.map((cell) => {
          if (!cell.content.trim()) return null;
          if (cell.type === 'markdown') {
            return (
              <div key={cell.id} style={{ marginBottom: '1.5rem' }}>
                {renderMarkdownBlock(cell.content)}
              </div>
            );
          } else if (cell.type === 'code') {
            const outputState = codeOutputs[cell.id] || { stdout: '', error: null, isRunning: false };
            return (
              <div key={cell.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
                <div className="editor-frame">
                  <div className="editor-tabs" style={{ height: '36px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8' }}>Python 예제 코드</span>
                  </div>
                  <pre
                    className="docs-code-block"
                    style={{
                      padding: '1.25rem',
                      margin: 0,
                      background: 'transparent',
                      fontFamily: 'var(--font-mono)',
                      fontSize: codeFontSize,
                      lineHeight: '1.6',
                      color: '#f8fafc',
                      overflowX: 'auto',
                    }}
                  >
                    {cell.content}
                  </pre>
                  <div style={{ padding: '0.6rem 1rem', background: '#0a080f', borderTop: '1px solid #1e1b2e', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button
                      className="btn-secondary"
                      onClick={() => handleExport(cell.content)}
                      style={{
                        padding: '0.45rem 1rem',
                        fontSize: '0.72rem',
                        background: 'transparent',
                        color: '#cbd5e1',
                        borderColor: '#2e2d3d',
                        textTransform: variant === 'normal' ? 'uppercase' : undefined,
                      }}
                    >
                      <Share2 size={12} /> 샌드박스 전송
                    </button>
                    <button
                      className="btn-primary"
                      onClick={() => handleRunCellCode(cell.id, cell.content)}
                      disabled={outputState.isRunning || isPyodideLoading}
                      style={{
                        padding: '0.45rem 1rem',
                        fontSize: '0.72rem',
                        background: '#ffffff',
                        color: '#000000',
                        borderColor: '#ffffff',
                        textTransform: variant === 'normal' ? 'uppercase' : undefined,
                      }}
                    >
                      {outputState.isRunning ? (
                        <RefreshCw size={11} className="pulse-glow" style={{ animation: 'spin 2s linear infinite' }} />
                      ) : (
                        <Play size={12} />
                      )}
                      실행하기
                    </button>
                  </div>
                </div>
                {(outputState.stdout || outputState.error) && (
                  variant === 'focus' ? (
                    <div style={{ padding: '1rem', background: '#0a080f', border: '1px solid #1e1b2e', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: outputState.error ? '#ef4444' : '#10b981' }}>
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{outputState.error || outputState.stdout}</pre>
                    </div>
                  ) : (
                    <div className="terminal-frame" style={{ borderRadius: '0px', padding: '1rem', background: '#fafafa', border: '1px solid #eaeaea' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                        실행 결과 출력 (Stdout)
                      </span>
                      <pre
                        style={{
                          margin: 0,
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.78rem',
                          color: outputState.error ? '#cf222e' : '#1a1a1a',
                          whiteSpace: 'pre-wrap',
                          lineHeight: '1.5',
                        }}
                      >
                        {outputState.error ? (
                          <span>
                            <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                            {outputState.error}
                          </span>
                        ) : (
                          outputState.stdout
                        )}
                      </pre>
                    </div>
                  )
                )}
              </div>
            );
          }
          return null;
        })}
        {renderChapterQuiz()}
        {relatedProblems.length > 0 && (
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              🎯 관련 문제 풀어보기
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {relatedProblems.map((problem) => (
                <button
                  key={problem.id}
                  onClick={() => onSelectProblem(problem)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    background: variant === 'focus' ? '#161520' : '#ffffff',
                    border: variant === 'focus' ? '1px solid #2e2d3d' : '1px solid var(--border-subtle)',
                    color: variant === 'focus' ? '#e2e8f0' : '#1a1a1a',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    width: '100%',
                  }}
                >
                  <span>{problem.title}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: variant === 'focus' ? '#94a3b8' : 'var(--text-secondary)', flexShrink: 0 }}>
                    {problem.difficulty === 'basic' ? '기초' : problem.difficulty === 'intermediate' ? '중급' : '고급'}
                    <ChevronRight size={14} />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.scrollTop = 0;
    }
    if (focusViewerRef.current) {
      focusViewerRef.current.scrollTop = 0;
    }
  }, [selectedChapterIdx, selectedCategory]);

  useEffect(() => {
    localStorage.setItem('pyquests_docs_toc_open', JSON.stringify(isTocOpen));
  }, [isTocOpen]);

  useEffect(() => {
    localStorage.setItem('pyquests_docs_last_category', selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    localStorage.setItem('pyquests_docs_last_chapter_idx', JSON.stringify(selectedChapterIdx));
  }, [selectedChapterIdx]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocusMode) {
        setIsFocusMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode]);

  // Ctrl + Mouse Wheel Zoom Handler (like VS Code / Chrome)
  useEffect(() => {
    const handleGlobalWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          setFontSizeScale((prev) => Math.min(180, prev + 5));
        } else if (e.deltaY > 0) {
          setFontSizeScale((prev) => Math.max(70, prev - 5));
        }
      }
    };

    window.addEventListener('wheel', handleGlobalWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleGlobalWheel);
  }, []);

  const toggleFocusMode = () => {
    const nextMode = !isFocusMode;
    setIsFocusMode(nextMode);
    if (nextMode) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleRunCellCode = async (cellId: string, rawCode: string) => {
    if (isPyodideLoading) return;
    
    // Set running state
    setCodeOutputs(prev => ({
      ...prev,
      [cellId]: { stdout: '실행 중...', error: null, isRunning: true }
    }));

    try {
      // Raw SQL is auto-detected and routed through an in-memory sqlite3 harness
      // inside usePyodide's runCode, so it can just be passed through as-is here.
      const res = await runPythonCode(rawCode);
      setCodeOutputs(prev => ({
        ...prev,
        [cellId]: {
          stdout: res.stdout || '실행 성공 (출력 결과 없음)',
          error: res.error || null,
          isRunning: false
        }
      }));
    } catch (err: any) {
      setCodeOutputs(prev => ({
        ...prev,
        [cellId]: { stdout: '', error: String(err), isRunning: false }
      }));
    }
  };

  // Helper to parse inline styles (**bold**, `code`)
  const parseInline = (text: string): React.ReactNode => {
    const regex = /(\*\*.*?\*\*|`.*?`)/g;
    const splitParts = text.split(regex);
    
    return splitParts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: '#1a1a1a', fontWeight: '700' }}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={i}
            style={{
              fontFamily: 'var(--font-mono)',
              background: 'var(--bg-dark)',
              padding: '0.15rem 0.35rem',
              fontSize: '0.78rem',
              color: '#cf222e',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  // Helper to parse structured Markdown block elements (Headings, Tables, Lists, Codeblocks)
  const renderMarkdownBlock = (markdownText: string) => {
    const lines = markdownText.split('\n');
    const elements: React.ReactNode[] = [];
    
    let tableRows: string[][] = [];
    let inTable = false;
    let listItems: string[] = [];
    let inList = false;
    
    let codeBlockLines: string[] = [];
    let inCodeBlock = false;
    let codeLanguage = 'python';

    const flushList = (key: string | number) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${key}`} style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            {listItems.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '0.35rem' }}>{parseInline(item)}</li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    const flushTable = (key: string | number) => {
      if (tableRows.length > 0) {
        const headers = tableRows[0].map(h => h.trim());
        const bodyRows = tableRows.slice(2);

        elements.push(
          <div key={`table-wrapper-${key}`} style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left', border: '1px solid var(--border-subtle)' }}>
              <thead>
                <tr style={{ background: '#f4f4f6', borderBottom: '1px solid #1a1a1a' }}>
                  {headers.map((header, idx) => (
                    <th key={idx} style={{ padding: '0.75rem 1rem', fontWeight: '700', color: '#1a1a1a' }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, rowIdx) => (
                  <tr key={rowIdx} style={{ borderBottom: '1px solid var(--border-subtle)', background: rowIdx % 2 === 1 ? '#fafafa' : '#ffffff' }}>
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>
                        {parseInline(cell.trim())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    const flushCodeBlock = (key: string | number) => {
      if (codeBlockLines.length > 0) {
        elements.push(
          <div key={`embedded-code-${key}`} className="editor-frame" style={{ margin: '1rem 0 1.5rem 0' }}>
            <div className="editor-tabs" style={{ height: '32px', background: '#161520' }}>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600' }}>
                {codeLanguage} 예제
              </span>
            </div>
            <pre
              className="docs-code-block"
              style={{
                padding: '1.25rem',
                margin: 0,
                background: '#0f0e15',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: '#f8fafc',
                overflowX: 'auto',
                lineHeight: '1.6',
              }}
            >
              {codeBlockLines.join('\n')}
            </pre>
          </div>
        );
        codeBlockLines = [];
        inCodeBlock = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Handle Markdown Code Block Toggle
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          flushCodeBlock(i);
        } else {
          flushList(i);
          flushTable(i);
          inCodeBlock = true;
          codeLanguage = line.trim().substring(3) || 'python';
        }
        continue;
      }

      if (inCodeBlock) {
        codeBlockLines.push(line);
        continue;
      }

      // Handle table
      if (line.trim().startsWith('|')) {
        flushList(i);
        inTable = true;
        const cells = line.split('|').slice(1, -1);
        tableRows.push(cells);
        continue;
      } else if (inTable) {
        flushTable(i);
      }

      // Handle list
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        flushTable(i);
        inList = true;
        listItems.push(line.replace(/^[\-\*]\s+/, ''));
        continue;
      } else if (inList) {
        if (line.trim() === '' || (!line.trim().startsWith('- ') && !line.trim().startsWith('* '))) {
          flushList(i);
        }
      }

      // Skip empty lines (unless inside table/list)
      if (line.trim() === '') {
        continue;
      }

      // Handle Headings
      if (line.startsWith('# ')) {
        elements.push(
          <h2 key={i} style={{ fontSize: '1.4rem', fontWeight: '700', borderBottom: '2px solid #1a1a1a', paddingBottom: '0.5rem', marginTop: '2.5rem', marginBottom: '1.25rem', color: '#1a1a1a' }}>
            {line.replace('# ', '')}
          </h2>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h3 key={i} style={{ fontSize: '1.15rem', fontWeight: '700', marginTop: '2rem', marginBottom: '0.85rem', color: '#1a1a1a' }}>
            {line.replace('## ', '')}
          </h3>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h4 key={i} style={{ fontSize: '0.95rem', fontWeight: '700', marginTop: '1.5rem', marginBottom: '0.65rem', color: '#1a1a1a' }}>
            {line.replace('### ', '')}
          </h4>
        );
      }
      // Handle Blockquotes
      else if (line.startsWith('> ')) {
        elements.push(
          <div key={i} style={{ borderLeft: '3px solid #1a1a1a', padding: '0.5rem 1rem', background: '#f4f4f6', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', fontStyle: 'normal' }}>
            {parseInline(line.replace('> ', ''))}
          </div>
        );
      }
      // Horizontal Line
      else if (line.trim() === '---') {
        elements.push(
          <hr key={i} style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '2rem 0' }} />
        );
      }
      // Standard Paragraph
      else {
        elements.push(
          <p key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
            {parseInline(line)}
          </p>
        );
      }
    }

    // Flush any remaining elements
    flushList('final');
    flushTable('final');
    flushCodeBlock('final');

    return elements;
  };

  if (isFocusMode) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 999999,
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Fullscreen Focus Mode Top Bar */}
        <div
          style={{
            padding: '0.85rem 2rem',
            background: '#1a1a1a',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #2e2d3d',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="#38bdf8" />
              <span style={{ fontWeight: '700', fontSize: '0.95rem', letterSpacing: '0.03em' }}>집중 학습 모드</span>
            </div>

            {/* Category Selector */}
            <div style={{ display: 'flex', gap: '0.25rem', background: '#0a080f', padding: '0.2rem', border: '1px solid #334155' }}>
              <button
                onClick={() => {
                  setSelectedCategory('python');
                  setSelectedChapterIdx(0);
                  setCodeOutputs({});
                  setChapterSearchQuery('');
                }}
                style={{
                  background: selectedCategory === 'python' ? '#38bdf8' : 'transparent',
                  color: selectedCategory === 'python' ? '#000000' : '#cbd5e1',
                  border: 'none',
                  padding: '0.3rem 0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                파이썬
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('sql');
                  setSelectedChapterIdx(0);
                  setCodeOutputs({});
                  setChapterSearchQuery('');
                }}
                style={{
                  background: selectedCategory === 'sql' ? '#38bdf8' : 'transparent',
                  color: selectedCategory === 'sql' ? '#000000' : '#cbd5e1',
                  border: 'none',
                  padding: '0.3rem 0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                SQL
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('java');
                  setSelectedChapterIdx(0);
                  setCodeOutputs({});
                  setChapterSearchQuery('');
                }}
                style={{
                  background: selectedCategory === 'java' ? '#38bdf8' : 'transparent',
                  color: selectedCategory === 'java' ? '#000000' : '#cbd5e1',
                  border: 'none',
                  padding: '0.3rem 0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                JAVA
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('js');
                  setSelectedChapterIdx(0);
                  setCodeOutputs({});
                  setChapterSearchQuery('');
                }}
                style={{
                  background: selectedCategory === 'js' ? '#38bdf8' : 'transparent',
                  color: selectedCategory === 'js' ? '#000000' : '#cbd5e1',
                  border: 'none',
                  padding: '0.3rem 0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                JS
              </button>
            </div>

            {/* Chapter Selection Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>목차:</span>
              <select
                value={selectedChapterIdx}
                onChange={(e) => {
                  setSelectedChapterIdx(Number(e.target.value));
                  setCodeOutputs({});
                }}
                style={{
                  background: '#0a080f',
                  color: '#ffffff',
                  border: '1px solid #334155',
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  borderRadius: '0px',
                }}
              >
                {filteredChapters.map((ch, idx) => (
                  <option key={ch.id} value={idx}>
                    {readChapterIds.includes(ch.id) ? '✓ ' : ''}{idx + 1}. {ch.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Font Size Zoom Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#0a080f', padding: '0.25rem 0.65rem', border: '1px solid #334155' }}>
              <button
                onClick={() => setFontSizeScale((prev) => Math.max(80, prev - 10))}
                title="글자 크기 축소"
                style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontWeight: '700', fontSize: '0.75rem', padding: '0 0.3rem' }}
              >
                가-
              </button>
              <button
                onClick={() => setFontSizeScale(100)}
                title="글자 크기 초기화 (100%)"
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.72rem', minWidth: '42px', textAlign: 'center' }}
              >
                {fontSizeScale}%
              </button>
              <button
                onClick={() => setFontSizeScale((prev) => Math.min(150, prev + 10))}
                title="글자 크기 확대"
                style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontWeight: '700', fontSize: '0.75rem', padding: '0 0.3rem' }}
              >
                가+
              </button>
            </div>

            <button
              onClick={toggleFocusMode}
              style={{
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                padding: '0.45rem 1rem',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Minimize2 size={15} />
              집중 모드 종료 (ESC)
            </button>
          </div>
        </div>

        {/* Fullscreen Reading Area */}
        <div
          ref={focusViewerRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '3rem 18%',
            zoom: fontSizeScale / 100,
            fontSize: `${0.9 * (fontSizeScale / 100)}rem`,
            background: '#ffffff',
            transition: 'zoom 0.2s ease, font-size 0.2s ease',
          }}
        >
          <div style={{ marginBottom: '2.5rem', borderBottom: '2px solid #1a1a1a', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#0969da', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                제 {selectedChapterIdx + 1} 장 / 총 {docChapters.length} 장
              </span>
              <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1a1a1a', marginTop: '0.2rem' }}>
                {activeChapter.title}
              </h1>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => toggleChapterRead(activeChapter.id)}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  border: isActiveChapterRead ? '1px solid #16a34a' : '1px solid #334155',
                  background: isActiveChapterRead ? '#16a34a' : 'transparent',
                  color: isActiveChapterRead ? '#ffffff' : '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                {isActiveChapterRead ? <CheckCircle2 size={15} /> : <Circle size={15} />}
                {isActiveChapterRead ? '완료됨' : '완료로 표시'}
              </button>
              <button
                disabled={selectedChapterIdx === 0}
                onClick={() => {
                  setSelectedChapterIdx((prev) => prev - 1);
                  setCodeOutputs({});
                }}
                className="btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
              >
                ◀ 이전 챕터
              </button>
              <button
                disabled={selectedChapterIdx === docChapters.length - 1}
                onClick={() => {
                  setSelectedChapterIdx((prev) => prev + 1);
                  setCodeOutputs({});
                }}
                className="btn-primary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
              >
                다음 챕터 ▶
              </button>
            </div>
          </div>

          {renderChapterCells('focus')}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, height: '100%' }}>
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'var(--font-display)', marginBottom: '0.25rem', color: '#1a1a1a' }}>
            {selectedCategory === 'python' ? '파이썬 학습 가이드' : selectedCategory === 'sql' ? 'SQL 데이터베이스 학습 가이드' : selectedCategory === 'js' ? '자바스크립트 학습 가이드' : 'Java 학습 가이드'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            {selectedCategory === 'java'
              ? '자바 기초 문법부터 객체지향까지 핵심 파트별 문서를 열람해 보세요. (자바는 예제 코드 실행 없이 읽기 전용으로 제공됩니다.)'
              : selectedCategory === 'js'
              ? '변수부터 비동기까지 핵심 파트별 문서를 열람해 보세요. (자바스크립트도 "문제 학습" 페이지에서 실제로 실행 및 채점할 수 있어요!)'
              : 'Jupyter Notebook 기반 핵심 파트별 문서를 열람하고 파이썬 & SQL 예제 코드를 즉석에서 실행해 보세요.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            onClick={toggleFocusMode}
            style={{
              background: '#1a1a1a',
              color: '#ffffff',
              border: '1px solid #1a1a1a',
              padding: '0.55rem 0.95rem',
              fontSize: '0.78rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.2s ease',
            }}
            title="전체 보기 집중 모드 (ESC로 해제)"
          >
            <Maximize2 size={15} />
            전체 보기 (집중 모드)
          </button>
          <button
            onClick={() => setIsTocOpen(!isTocOpen)}
            style={{
              background: isTocOpen ? '#ffffff' : '#1a1a1a',
              color: isTocOpen ? '#1a1a1a' : '#ffffff',
              border: '1px solid #1a1a1a',
              padding: '0.55rem 0.95rem',
              fontSize: '0.78rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.2s ease',
            }}
          >
            {isTocOpen ? <PanelLeftClose size={15} /> : <PanelLeftOpen size={15} />}
            {isTocOpen ? '학습 목차 접기' : '학습 목차 열기'}
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="docs-category-tabs" style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => {
            setSelectedCategory('python');
            setSelectedChapterIdx(0);
            setCodeOutputs({});
            setChapterSearchQuery('');
          }}
          style={{
            padding: '0.65rem 1.4rem',
            fontSize: '0.85rem',
            fontWeight: '700',
            background: selectedCategory === 'python' ? '#1a1a1a' : '#ffffff',
            color: selectedCategory === 'python' ? '#ffffff' : 'var(--text-secondary)',
            border: '1px solid #1a1a1a',
            borderRadius: '0px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            boxShadow: selectedCategory === 'python' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          파이썬 (Python)
        </button>
        <button
          onClick={() => {
            setSelectedCategory('sql');
            setSelectedChapterIdx(0);
            setCodeOutputs({});
            setChapterSearchQuery('');
          }}
          style={{
            padding: '0.65rem 1.4rem',
            fontSize: '0.85rem',
            fontWeight: '700',
            background: selectedCategory === 'sql' ? '#0969da' : '#ffffff',
            color: selectedCategory === 'sql' ? '#ffffff' : 'var(--text-secondary)',
            border: '1px solid #0969da',
            borderRadius: '0px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            boxShadow: selectedCategory === 'sql' ? '0 2px 8px rgba(9,105,218,0.2)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          SQL 데이터베이스 (Database)
        </button>
        <button
          onClick={() => {
            setSelectedCategory('java');
            setSelectedChapterIdx(0);
            setCodeOutputs({});
            setChapterSearchQuery('');
          }}
          style={{
            padding: '0.65rem 1.4rem',
            fontSize: '0.85rem',
            fontWeight: '700',
            background: selectedCategory === 'java' ? '#b07219' : '#ffffff',
            color: selectedCategory === 'java' ? '#ffffff' : 'var(--text-secondary)',
            border: '1px solid #b07219',
            borderRadius: '0px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            boxShadow: selectedCategory === 'java' ? '0 2px 8px rgba(176,114,25,0.2)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          자바 (Java)
        </button>
        <button
          onClick={() => {
            setSelectedCategory('js');
            setSelectedChapterIdx(0);
            setCodeOutputs({});
            setChapterSearchQuery('');
          }}
          style={{
            padding: '0.65rem 1.4rem',
            fontSize: '0.85rem',
            fontWeight: '700',
            background: selectedCategory === 'js' ? '#f0db4f' : '#ffffff',
            color: selectedCategory === 'js' ? '#1a1a1a' : 'var(--text-secondary)',
            border: '1px solid #d4b83a',
            borderRadius: '0px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            boxShadow: selectedCategory === 'js' ? '0 2px 8px rgba(212,184,58,0.3)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          자바스크립트 (JS)
        </button>
      </div>

      {/* Main split layout */}
      <div className="docs-main-split" style={{ display: 'flex', gap: '1.25rem', flex: 1, height: 'calc(100vh - 180px)', minHeight: '500px', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        {/* Left Side: Chapter Navigation (Fixed Independent Pane) */}
        {isTocOpen && (
          <div
            className="glass-card docs-chapter-nav"
            style={{
              width: '260px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              flexShrink: 0,
              borderRadius: '0px',
              height: '100%',
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: '700', letterSpacing: '0.05em' }}>
                {selectedCategory === 'python' ? '파이썬' : selectedCategory === 'sql' ? 'SQL' : selectedCategory === 'js' ? 'JS' : 'Java'} 학습 목차
              </h3>
              <button
                onClick={() => setIsTocOpen(false)}
                title="목차 접기"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '0.2rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <PanelLeftClose size={16} />
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <Search
                size={13}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="text"
                value={chapterSearchQuery}
                onChange={(e) => setChapterSearchQuery(e.target.value)}
                placeholder="목차/내용 검색..."
                className="glass-input"
                style={{
                  width: '100%',
                  paddingLeft: '1.9rem',
                  fontSize: '0.75rem',
                  boxSizing: 'border-box',
                  height: '32px',
                }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                <span>진행률</span>
                <span style={{ fontWeight: '700', color: '#1a1a1a' }}>{readCountInCategory} / {filteredChapters.length}</span>
              </div>
              <div style={{ height: '4px', background: '#eaeaea', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${filteredChapters.length ? Math.round((readCountInCategory / filteredChapters.length) * 100) : 0}%`,
                    background: '#1a1a1a',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
              {searchedChapterEntries.length === 0 && (
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', padding: '0.75rem 0.25rem' }}>
                  "{chapterSearchQuery}"에 대한 검색 결과가 없습니다.
                </p>
              )}
              {searchedChapterEntries.map(({ chapter, idx }) => (
                <button
                  key={chapter.id}
                  onClick={() => {
                    setSelectedChapterIdx(idx);
                    setCodeOutputs({});
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.8rem 1rem',
                    textAlign: 'left',
                    borderRadius: '0px',
                    background: selectedChapterIdx === idx ? '#1a1a1a' : 'transparent',
                    border: 'none',
                    color: selectedChapterIdx === idx ? '#ffffff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: selectedChapterIdx === idx ? '700' : '500',
                    transition: 'all 0.2s ease',
                    width: '100%',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedChapterIdx !== idx) {
                      e.currentTarget.style.background = 'var(--bg-dark)';
                      e.currentTarget.style.color = '#1a1a1a';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedChapterIdx !== idx) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  {readChapterIds.includes(chapter.id) ? (
                    <CheckCircle2
                      size={15}
                      style={{ flexShrink: 0, width: '15px', height: '15px', minWidth: '15px', minHeight: '15px', color: selectedChapterIdx === idx ? '#4ade80' : '#16a34a' }}
                    />
                  ) : (
                    <BookOpen size={15} style={{ flexShrink: 0, width: '15px', height: '15px', minWidth: '15px', minHeight: '15px' }} />
                  )}
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>
                    {chapter.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Right Side: Chapter Document Viewer (Independent Internal Scroll) */}
        <div
          ref={viewerRef}
          className="glass-card docs-content-viewer"
          style={{
            flex: 1,
            padding: isTocOpen ? '2.5rem 3rem' : '2.5rem 4rem',
            height: '100%',
            overflowY: 'auto',
            borderRadius: '0px',
            background: '#ffffff',
            minWidth: 0,
            zoom: fontSizeScale / 100,
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1), zoom 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button
              onClick={() => toggleChapterRead(activeChapter.id)}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer',
                border: isActiveChapterRead ? '1px solid #16a34a' : '1px solid #1a1a1a',
                background: isActiveChapterRead ? '#16a34a' : '#ffffff',
                color: isActiveChapterRead ? '#ffffff' : '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease',
              }}
            >
              {isActiveChapterRead ? <CheckCircle2 size={15} /> : <Circle size={15} />}
              {isActiveChapterRead ? '완료됨' : '완료로 표시'}
            </button>
          </div>
          {renderChapterCells('normal')}
        </div>
      </div>
    </div>
  );
}
