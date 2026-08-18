import React, { useState } from 'react';
import { docChapters } from '../data/docs';
import type { RunResponse } from '../hooks/usePyodide';
import { BookOpen, Play, Share2, AlertCircle, RefreshCw } from 'lucide-react';

interface DocsViewerProps {
  runPythonCode: (code: string) => Promise<RunResponse>;
  isPyodideLoading: boolean;
  onExportToSandbox: (code: string) => void;
}

export default function DocsViewer({
  runPythonCode,
  isPyodideLoading,
  onExportToSandbox,
}: DocsViewerProps) {
  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number>(0);
  const [codeOutputs, setCodeOutputs] = useState<Record<string, { stdout: string; error: string | null; isRunning: boolean }>>({});

  const activeChapter = docChapters[selectedChapterIdx];

  const handleRunCellCode = async (cellId: string, code: string) => {
    if (isPyodideLoading) return;
    
    // Set running state
    setCodeOutputs(prev => ({
      ...prev,
      [cellId]: { stdout: '실행 중...', error: null, isRunning: true }
    }));

    try {
      const res = await runPythonCode(code);
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
        [cellId]: {
          stdout: '',
          error: err.message || '실행 오류가 발생했습니다.',
          isRunning: false
        }
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, height: '100%' }}>
      {/* Title Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'var(--font-display)', marginBottom: '0.25rem', color: '#1a1a1a' }}>
          파이썬 학습 가이드
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Jupyter Notebook 기반 핵심 파트별 문서를 열람하고 파이썬 예제 코드를 즉석에서 실행해 보세요.
        </p>
      </div>

      {/* Main split layout */}
      <div style={{ display: 'flex', gap: '1.25rem', flex: 1, height: 'calc(100vh - 180px)', minHeight: '500px' }}>
        {/* Left Side: Chapter Navigation (Fixed Independent Pane) */}
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
          }}
        >
          <h3 style={{ fontSize: '0.9rem', fontWeight: '700', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', letterSpacing: '0.05em' }}>
            📚 학습 목차
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
            {docChapters.map((chapter, idx) => (
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
                <BookOpen size={14} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {chapter.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Chapter Document Viewer (Independent Internal Scroll) */}
        <div
          className="glass-card docs-content-viewer"
          style={{
            flex: 1,
            padding: '2.5rem 3rem',
            height: '100%',
            overflowY: 'auto',
            borderRadius: '0px',
            background: '#ffffff',
            minWidth: 0,
          }}
        >
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
                  {/* Code Block Frame */}
                  <div className="editor-frame">
                    <div className="editor-tabs" style={{ height: '36px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8' }}>Python 예제 코드</span>
                    </div>
                    <pre
                      style={{
                        padding: '1.25rem',
                        margin: 0,
                        background: 'transparent',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.82rem',
                        lineHeight: '1.6',
                        color: '#f8fafc',
                        overflowX: 'auto',
                      }}
                    >
                      {cell.content}
                    </pre>
                    {/* Action Bar */}
                    <div
                      style={{
                        padding: '0.6rem 1rem',
                        background: '#0a080f',
                        borderTop: '1px solid #1e1b2e',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '0.5rem',
                      }}
                    >
                      <button
                        className="btn-secondary"
                        onClick={() => onExportToSandbox(cell.content)}
                        style={{
                          padding: '0.45rem 1rem',
                          fontSize: '0.72rem',
                          background: 'transparent',
                          color: '#cbd5e1',
                          borderColor: '#2e2d3d',
                          textTransform: 'uppercase',
                        }}
                      >
                        <Share2 size={12} />
                        샌드박스 전송
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
                          textTransform: 'uppercase',
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

                  {/* Interactive Cell Output Console */}
                  {(outputState.stdout || outputState.error) && (
                    <div
                      className="terminal-frame"
                      style={{
                        borderRadius: '0px',
                        padding: '1rem',
                        background: '#fafafa',
                        border: '1px solid #eaeaea',
                      }}
                    >
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
                  )}
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}
