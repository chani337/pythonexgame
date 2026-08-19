import { CheckCircle2, ChevronRight, Circle } from 'lucide-react';
import type { Problem } from '../data/problems';

interface LearningRoadmapProps {
  problems: Problem[];
  solvedIds: string[];
  onNavigate: (language?: string, difficulty?: string) => void;
}

interface RoadmapStage {
  title: string;
  description: string;
  target: number;
  current: number;
  language?: string;
  difficulty?: string;
}

function countSolved(problems: Problem[], solvedIds: string[], language?: string, difficulty?: string) {
  return problems.filter((p) => {
    const lang = p.language || 'python';
    const matchesLang = !language || lang === language || (language === 'java_or_js' && (lang === 'java' || lang === 'js'));
    const matchesDiff = !difficulty || p.difficulty === difficulty;
    return matchesLang && matchesDiff && solvedIds.includes(p.id);
  }).length;
}

export default function LearningRoadmap({ problems, solvedIds, onNavigate }: LearningRoadmapProps) {
  const stages: RoadmapStage[] = [
    {
      title: '1단계 · Python 기초 다지기',
      description: '변수, 조건문, 반복문 같은 기본 문법 문제로 감을 잡아보세요.',
      target: 15,
      current: countSolved(problems, solvedIds, 'python', 'basic'),
      language: 'python',
      difficulty: 'basic',
    },
    {
      title: '2단계 · Python 중급 문제 도전',
      description: '함수, 리스트, 딕셔너리 등을 활용하는 문제로 실력을 넓혀보세요.',
      target: 15,
      current: countSolved(problems, solvedIds, 'python', 'intermediate'),
      language: 'python',
      difficulty: 'intermediate',
    },
    {
      title: '3단계 · SQL로 데이터베이스 배우기',
      description: 'SELECT부터 JOIN까지, 데이터를 다루는 기본기를 쌓아보세요.',
      target: 10,
      current: countSolved(problems, solvedIds, 'sql'),
      language: 'sql',
    },
    {
      title: '4단계 · Java 또는 JavaScript 시작하기',
      description: '둘 중 관심 있는 언어 하나를 골라 기초 문제부터 풀어보세요.',
      target: 10,
      current: countSolved(problems, solvedIds, 'java_or_js'),
    },
    {
      title: '5단계 · 고급 문제로 완성하기',
      description: '언어 상관없이, 고급 난이도 문제로 마무리 실력을 다져보세요.',
      target: 15,
      current: countSolved(problems, solvedIds, undefined, 'advanced'),
      difficulty: 'advanced',
    },
  ];

  return (
    <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '0px' }}>
      <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.35rem', letterSpacing: '0.05em' }}>
        🗺️ 학습 로드맵
      </h3>
      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        처음이라면 이 순서대로 진행해 보세요. 순서를 꼭 지킬 필요는 없어요.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {stages.map((stage, idx) => {
          const isComplete = stage.current >= stage.target;
          const percent = Math.min(100, Math.round((stage.current / stage.target) * 100));
          const isLast = idx === stages.length - 1;
          return (
            <div key={stage.title} style={{ display: 'flex', gap: '1rem' }}>
              {/* Timeline rail */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                {isComplete ? (
                  <CheckCircle2 size={20} style={{ color: '#1a1a1a' }} />
                ) : (
                  <Circle size={20} style={{ color: 'var(--border-subtle)' }} />
                )}
                {!isLast && <div style={{ width: '1px', flex: 1, minHeight: '2rem', background: 'var(--border-subtle)', marginTop: '0.25rem' }} />}
              </div>

              {/* Stage content */}
              <button
                onClick={() => onNavigate(stage.language, stage.difficulty)}
                style={{
                  flex: 1,
                  textAlign: 'left',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  paddingBottom: isLast ? '0' : '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: isComplete ? 'var(--text-secondary)' : '#1a1a1a', textDecoration: isComplete ? 'line-through' : 'none' }}>
                    {stage.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: '1.5' }}>
                    {stage.description}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <div style={{ flex: 1, maxWidth: '160px', height: '4px', background: '#eaeaea', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${percent}%`, background: '#1a1a1a', transition: 'width 0.4s ease' }} />
                    </div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                      {stage.current} / {stage.target}
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '0.15rem' }} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
