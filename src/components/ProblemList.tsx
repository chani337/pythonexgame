import { useLayoutEffect, useEffect, useState } from 'react';
import { Search, CheckCircle2, ChevronRight, FileCode, CheckSquare, HelpCircle, ArrowUp } from 'lucide-react';
import type { Problem } from '../data/problems';
import { filterProblems } from '../data/problems';

interface ProblemListProps {
  problems: Problem[];
  solvedIds: string[];
  onSelectProblem: (problem: Problem) => void;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (difficulty: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  initialScrollPos?: number;
}

export default function ProblemList({
  problems,
  solvedIds,
  onSelectProblem,
  selectedLanguage,
  setSelectedLanguage,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedType,
  setSelectedType,
  searchQuery,
  setSearchQuery,
  initialScrollPos,
}: ProblemListProps) {
  // Restore scroll position when returning to problem list
  useLayoutEffect(() => {
    if (initialScrollPos && initialScrollPos > 0) {
      const mainEl = document.querySelector('.main-content');
      if (mainEl) {
        mainEl.scrollTop = initialScrollPos;
      }
    }
  }, [initialScrollPos]);

  // Show a "scroll to top" button once the long problem list has been scrolled past
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const mainEl = document.querySelector('.main-content');
    if (!mainEl) return;
    const handleScroll = () => setShowScrollTop(mainEl.scrollTop > 400);
    handleScroll();
    mainEl.addEventListener('scroll', handleScroll);
    return () => mainEl.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    document.querySelector('.main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter logic (shared with App.tsx's next/prev navigation via filterProblems)
  const filteredProblems = filterProblems(problems, {
    language: selectedLanguage,
    difficulty: selectedDifficulty,
    type: selectedType,
    search: searchQuery,
  });

  const getProblemTypeLabel = (type: string) => {
    switch (type) {
      case 'coding':
        return { text: '코딩 실습', icon: FileCode, color: '#0969da' };
      case 'quiz':
        return { text: '객관식 퀴즈', icon: HelpCircle, color: '#8250df' };
      case 'fill':
        return { text: '빈칸 채우기', icon: CheckSquare, color: '#9a6700' };
      default:
        return { text: '실습', icon: FileCode, color: '#57606a' };
    }
  };

  const getLanguageLabel = (language?: string) => {
    switch (language) {
      case 'sql':
        return { text: 'SQL', color: '#0969da', bg: '#ddf4ff' };
      case 'java':
        return { text: 'Java', color: '#b07219', bg: '#fbf1e0' };
      default:
        return { text: 'Python', color: '#1a7f37', bg: '#dafbe1' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
      {/* Title Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'var(--font-display)', marginBottom: '0.25rem', color: '#1a1a1a' }}>
          코딩 문제 학습
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Python · SQL · Java, 기초부터 고급까지 다양한 문제를 해결하고 실전 역량을 강화하세요.
        </p>
      </div>

      {/* Filter and Search Panel */}
      <div
        className="glass-card"
        style={{
          padding: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          borderRadius: '0px',
        }}
      >
        {/* Left Side: Buttons Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Language Group */}
          <div style={{ display: 'flex', background: '#f4f4f6', padding: '3px', borderRadius: '0px', border: '1px solid var(--border-subtle)' }}>
            {[
              { id: 'all', name: '전체 언어' },
              { id: 'python', name: 'Python' },
              { id: 'sql', name: 'SQL' },
              { id: 'java', name: 'Java' },
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                style={{
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  borderRadius: '0px',
                  border: 'none',
                  cursor: 'pointer',
                  background: selectedLanguage === lang.id ? '#1a1a1a' : 'transparent',
                  color: selectedLanguage === lang.id ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                }}
              >
                {lang.name}
              </button>
            ))}
          </div>

          {/* Difficulty Group */}
          <div style={{ display: 'flex', background: '#f4f4f6', padding: '3px', borderRadius: '0px', border: '1px solid var(--border-subtle)' }}>
            {[
              { id: 'all', name: '전체 난이도' },
              { id: 'basic', name: '기초' },
              { id: 'intermediate', name: '중급' },
              { id: 'advanced', name: '고급' },
            ].map((diff) => (
              <button
                key={diff.id}
                onClick={() => setSelectedDifficulty(diff.id)}
                style={{
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  borderRadius: '0px',
                  border: 'none',
                  cursor: 'pointer',
                  background: selectedDifficulty === diff.id ? '#1a1a1a' : 'transparent',
                  color: selectedDifficulty === diff.id ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                }}
              >
                {diff.name}
              </button>
            ))}
          </div>

          {/* Type Group */}
          <div style={{ display: 'flex', background: '#f4f4f6', padding: '3px', borderRadius: '0px', border: '1px solid var(--border-subtle)' }}>
            {[
              { id: 'all', name: '전체 형태' },
              { id: 'coding', name: '코딩 실습' },
              { id: 'quiz', name: '퀴즈' },
              { id: 'fill', name: '빈칸 채우기' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                style={{
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  borderRadius: '0px',
                  border: 'none',
                  cursor: 'pointer',
                  background: selectedType === t.id ? '#1a1a1a' : 'transparent',
                  color: selectedType === t.id ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                }}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Search Input */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search
            size={15}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            placeholder="제목 또는 키워드 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input"
            style={{
              width: '100%',
              paddingLeft: '2.25rem',
              fontSize: '0.82rem',
              boxSizing: 'border-box',
              height: '38px',
            }}
          />
        </div>
      </div>

      {/* Problems Count */}
      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', fontWeight: '500' }}>
        <span>검색 결과:</span>
        <span style={{ color: '#1a1a1a', fontWeight: '700' }}>{filteredProblems.length}개</span>
        <span>/ 전체 {problems.length}개</span>
      </div>

      {/* Problem Cards Grid */}
      {filteredProblems.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
            gap: '1rem',
          }}
        >
          {filteredProblems.map((problem) => {
            const isSolved = solvedIds.includes(problem.id);
            const typeInfo = getProblemTypeLabel(problem.type);
            const TypeIcon = typeInfo.icon;
            const langInfo = getLanguageLabel(problem.language);

            // Set left border color based on difficulty
            let diffBorderColor = 'var(--border-subtle)';
            if (isSolved) {
              diffBorderColor = '#1a1a1a';
            } else {
              if (problem.difficulty === 'basic') diffBorderColor = '#0f766e';
              else if (problem.difficulty === 'intermediate') diffBorderColor = '#a66908';
              else if (problem.difficulty === 'advanced') diffBorderColor = '#cf222e';
            }

            return (
              <div
                key={problem.id}
                className="glass-card"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.25rem',
                  position: 'relative',
                  borderRadius: '0px',
                  borderLeft: `4px solid ${diffBorderColor}`,
                }}
              >
                {/* Solved Stamp */}
                {isSolved && (
                  <div
                    style={{
                      position: 'absolute',
                      right: '1.5rem',
                      top: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.7rem',
                      color: '#1a1a1a',
                      fontWeight: '700',
                      background: '#f4f4f6',
                      border: '1px solid #1a1a1a',
                      padding: '0.25rem 0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    <CheckCircle2 size={12} />
                    Clear
                  </div>
                )}

                {/* Problem Info */}
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: '700',
                        color: langInfo.color,
                        background: langInfo.bg,
                        padding: '0.15rem 0.45rem',
                        letterSpacing: '0.03em',
                      }}
                    >
                      {langInfo.text}
                    </span>
                    <span className={`badge badge-${problem.difficulty}`}>
                      {problem.difficulty === 'basic' ? '기초' : problem.difficulty === 'intermediate' ? '중급' : '고급'}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                      {problem.category}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: '700',
                      color: '#1a1a1a',
                      marginBottom: '0.5rem',
                      paddingRight: isSolved ? '4.5rem' : '0px',
                      lineHeight: '1.4',
                    }}
                  >
                    {problem.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.5',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {problem.description}
                  </p>
                </div>

                {/* Button Action */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '0.85rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: typeInfo.color, fontSize: '0.75rem', fontWeight: '600' }}>
                    <TypeIcon size={14} />
                    <span>{typeInfo.text}</span>
                  </div>

                  <button
                    onClick={() => onSelectProblem(problem)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#1a1a1a',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.1rem',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.textDecoration = 'none';
                    }}
                  >
                    Solve
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="glass-card"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            borderRadius: '0px',
          }}
        >
          검색 및 필터 조건에 부합하는 문제가 없습니다.
        </div>
      )}

      {showScrollTop && (
        <button onClick={scrollToTop} className="scroll-top-btn" title="맨 위로">
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
