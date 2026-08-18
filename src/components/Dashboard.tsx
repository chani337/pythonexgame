import { Award, Zap, CheckCircle2, TrendingUp, BookOpen, ChevronRight } from 'lucide-react';
import type { Problem } from '../data/problems';
import { useAuth } from '../contexts/AuthContext';


interface DashboardProps {
  problems: Problem[];
  solvedIds: string[];
  streak: number;
  onNavigateToProblems: () => void;
  onSelectProblem: (problem: Problem) => void;
  sandboxRunCount: number;
  onUnlockAll?: () => void;
}

export default function Dashboard({
  problems,
  solvedIds,
  streak,
  onNavigateToProblems,
  onSelectProblem,
  sandboxRunCount,
  onUnlockAll,
}: DashboardProps) {
  const { user } = useAuth();
  const isMasterAdmin = user?.email?.toLowerCase() === 'chani7873@daum.net';

  // Stats calculations
  const totalCount = problems.length;
  const solvedCount = solvedIds.length;
  const completionRate = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  const basicProblems = problems.filter((p) => p.difficulty === 'basic');
  const basicSolved = basicProblems.filter((p) => solvedIds.includes(p.id));

  const interProblems = problems.filter((p) => p.difficulty === 'intermediate');
  const interSolved = interProblems.filter((p) => solvedIds.includes(p.id));

  const advProblems = problems.filter((p) => p.difficulty === 'advanced');
  const advSolved = advProblems.filter((p) => solvedIds.includes(p.id));

  // Determine next recommended problem
  const nextProblem = problems.find((p) => !solvedIds.includes(p.id));

  // Badge data
  const badges = [
    {
      id: 'novice',
      name: '파이썬 스타터',
      description: '첫 번째 문제를 해결하세요.',
      icon: '🌱',
      color: '#1a1a1a',
      shadow: 'none',
      unlocked: solvedCount >= 1,
    },
    {
      id: 'operator_master',
      name: '연산의 귀재',
      description: '연산자 카테고리 문제를 5개 이상 해결하세요.',
      icon: '🔢',
      color: '#1a1a1a',
      shadow: 'none',
      unlocked: solvedIds.filter(id => id.includes('part3')).length >= 5,
    },
    {
      id: 'conditional_master',
      name: '조건의 지배자',
      description: '조건문 카테고리 문제를 5개 이상 해결하세요.',
      icon: '🔄',
      color: '#1a1a1a',
      shadow: 'none',
      unlocked: solvedIds.filter(id => id.includes('part4')).length >= 5,
    },
    {
      id: 'structure_master',
      name: '자료구조 컬렉터',
      description: '리스트/튜플/딕셔너리 문제를 10개 이상 해결하세요.',
      icon: '🔍',
      color: '#1a1a1a',
      shadow: 'none',
      unlocked: solvedIds.filter(id => id.includes('part5') || id.includes('part6') || id.includes('part9')).length >= 10,
    },
    {
      id: 'advanced_wizard',
      name: '파이썬 마스터',
      description: '고급 단계 문제를 5개 이상 해결하세요.',
      icon: '🧙‍♂️',
      color: '#1a1a1a',
      shadow: 'none',
      unlocked: advSolved.length >= 5,
    },
    {
      id: 'sandbox_explorer',
      name: '샌드박스 개척자',
      description: '코드 플레이그라운드에서 코드를 실행해 보세요.',
      icon: '🪐',
      color: '#1a1a1a',
      shadow: 'none',
      unlocked: sandboxRunCount >= 1,
    },
  ];

  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;

  // Simple Helper component for Circular Progress SVG
  const CircularProgress = ({
    solved,
    total,
    color,
    label,
  }: {
    solved: number;
    total: number;
    color: string;
    label: string;
  }) => {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const percentage = total > 0 ? solved / total : 0;
    const strokeDashoffset = circumference - percentage * circumference;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ position: 'relative', width: '85px', height: '85px' }}>
          <svg style={{ transform: 'rotate(-90deg)', width: '85px', height: '85px' }}>
            <circle
              cx="42.5"
              cy="42.5"
              r={radius}
              stroke="#f4f4f6"
              strokeWidth="4"
              fill="transparent"
            />
            <circle
              cx="42.5"
              cy="42.5"
              r={radius}
              stroke={color}
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="square" // Minimal square ends
              style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '0.85rem',
              fontWeight: '700',
              fontFamily: 'var(--font-mono)',
              color: '#1a1a1a',
            }}
          >
            {solved}/{total}
          </div>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', letterSpacing: '0.05em' }}>{label}</span>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1 }}>
      {/* Welcome Banner */}
      <div
        className="glass-card"
        style={{
          padding: '2.5rem',
          borderRadius: '0px',
          background: isMasterAdmin ? 'linear-gradient(135deg, #fffcf0 0%, #f4f4f6 100%)' : '#ffffff',
          border: isMasterAdmin ? '1px solid #a66908' : '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          {isMasterAdmin && (
             <span
              style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#a66908',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              👑 MASTER ADMIN ACCOUNT
            </span>
          )}
          <h2
            style={{
              fontSize: '1.6rem',
              fontWeight: '700',
              fontFamily: 'var(--font-display)',
              marginBottom: '0.5rem',
              color: '#1a1a1a',
              letterSpacing: '0.02em',
            }}
          >
            {isMasterAdmin ? '안녕하세요, 차니 마스터님! 👑' : '안녕하세요, 러너님!'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '580px', lineHeight: '1.6' }}>
            {isMasterAdmin
              ? 'chani7873@daum.net 관리자 전용 모드입니다. 아래 버튼을 눌러 모든 문제 클리어 및 뱃지 전체 해금을 1초 만에 실행하실 수 있습니다.'
              : '기초부터 차근차근 고급 개념까지! PyQuests의 인터랙티브 코딩 플랫폼을 통해 실제 파이썬 런타임을 브라우저에서 실행하며 코딩 실력을 키워 보세요.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {onUnlockAll && (
            <button
              onClick={() => {
                if (window.confirm(isMasterAdmin ? 'chani7873@daum.net 계정에 모든 문제(90개 이상) 해결 완료 및 뱃지 전체 해금을 적용하시겠습니까?' : '모든 문제(90개 이상)를 해결 완료하고 모든 학습 뱃지를 해금하시겠습니까?')) {
                  onUnlockAll();
                }
              }}
              style={{
                background: isMasterAdmin ? '#1a1a1a' : '#ffffff',
                border: '1px solid #1a1a1a',
                color: isMasterAdmin ? '#ffffff' : '#1a1a1a',
                padding: '0.7rem 1rem',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              {isMasterAdmin ? '👑 마스터 모드: 모든 문제 풀기 & 뱃지 해금' : '⚡ 모든 문제 풀기 & 뱃지 전체 해금'}
            </button>
          )}
          <button className="btn-primary" onClick={onNavigateToProblems}>
            <BookOpen size={15} />
            학습 시작하기
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        {/* Stat 1: Total Solved */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderRadius: '0px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '0px',
              background: '#f4f4f6',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle2 style={{ color: '#1a1a1a' }} size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', fontWeight: '600', letterSpacing: '0.05em' }}>해결한 문제</span>
            <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1a1a1a' }}>
              {solvedCount} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ {totalCount}</span>
            </span>
          </div>
        </div>

        {/* Stat 2: Completion Rate */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderRadius: '0px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '0px',
              background: '#f4f4f6',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrendingUp style={{ color: '#1a1a1a' }} size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', fontWeight: '600', letterSpacing: '0.05em' }}>학습 달성률</span>
            <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1a1a1a' }}>{completionRate}%</span>
          </div>
        </div>

        {/* Stat 3: Streak */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderRadius: '0px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '0px',
              background: '#f4f4f6',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Zap style={{ color: '#1a1a1a' }} size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', fontWeight: '600', letterSpacing: '0.05em' }}>학습 스트릭</span>
            <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1a1a1a' }}>{streak}일 연속</span>
          </div>
        </div>

        {/* Stat 4: Unlocked Badges */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderRadius: '0px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '0px',
              background: '#f4f4f6',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Award style={{ color: '#1a1a1a' }} size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', fontWeight: '600', letterSpacing: '0.05em' }}>획득한 뱃지</span>
            <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1a1a1a' }}>
              {unlockedBadgesCount} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ {badges.length}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Dashboard Middle Section: Recommended & Level Progress */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        {/* Recommended Challenge */}
        <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: '0px' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '0.05em' }}>
              🎯 다음 학습 추천
            </h3>
            {nextProblem ? (
              <div
                style={{
                  background: '#fcfcfc',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '0px',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className={`badge badge-${nextProblem.difficulty}`}>{nextProblem.difficulty === 'basic' ? '기초' : nextProblem.difficulty === 'intermediate' ? '중급' : '고급'}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{nextProblem.category}</span>
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1a1a1a' }}>{nextProblem.title}</h4>
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1.5',
                  }}
                >
                  {nextProblem.description}
                </p>
              </div>
            ) : (
              <div
                style={{
                  background: '#fafafa',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '0px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  marginBottom: '1.5rem',
                  color: '#1a1a1a',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  letterSpacing: '0.02em',
                }}
              >
                🎉 모든 문제를 전부 해결하셨습니다! 파이썬 마스터 등극!
              </div>
            )}
          </div>
          {nextProblem && (
            <button
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => onSelectProblem(nextProblem)}
            >
              지금 도전하기
              <ChevronRight size={15} />
            </button>
          )}
        </div>

        {/* Level Breakdown Progress */}
        <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '0px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>📊 파트별 성취도</h3>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              height: 'calc(100% - 3rem)',
              minHeight: '130px',
            }}
          >
            <CircularProgress solved={basicSolved.length} total={basicProblems.length} color="#0f766e" label="기초" />
            <CircularProgress solved={interSolved.length} total={interProblems.length} color="#a66908" label="중급" />
            <CircularProgress solved={advSolved.length} total={advProblems.length} color="#cf222e" label="고급" />
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '0px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '0.05em' }}>
          🏅 학습 뱃지 리스트
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem',
          }}
        >
          {badges.map((badge) => (
            <div
              key={badge.id}
              style={{
                background: badge.unlocked ? '#ffffff' : '#fcfcfc',
                border: badge.unlocked ? '1px solid #1a1a1a' : '1px solid var(--border-subtle)',
                borderRadius: '0px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                opacity: badge.unlocked ? 1 : 0.5,
                transition: 'all 0.3s ease',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '0px', // Stark style
                  background: badge.unlocked ? '#1a1a1a' : '#eaeaea',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  flexShrink: 0,
                }}
              >
                {badge.icon}
              </div>
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1a1a1a', letterSpacing: '0.02em' }}>
                  {badge.name}
                </h4>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.15rem', lineHeight: '1.4' }}>
                  {badge.description}
                </p>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    color: badge.unlocked ? '#0f766e' : 'var(--text-muted)',
                    display: 'block',
                    marginTop: '0.25rem',
                  }}
                >
                  {badge.unlocked ? '획득 완료' : '미획득'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Leaderboard Section */}
      <LeaderboardWidget />
    </div>
  );
}

function LeaderboardWidget() {
  const { leaderboard, isConfigured, setAuthModalOpen, user } = useAuth();

  return (
    <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '0px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '0.05em' }}>
          🔥 글로벌 명예의 전당 (실시간 랭킹)
        </h3>
        {!user && (
          <button
            onClick={() => setAuthModalOpen(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#0969da',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            내 순위 등록하기 (로그인)
          </button>
        )}
      </div>

      {!isConfigured ? (
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', padding: '1rem', background: '#f4f4f6' }}>
          Supabase가 연결되면 전체 러너들의 실시간 문제 해결 및 스트릭 랭킹이 여기에 표시됩니다.
        </div>
      ) : leaderboard.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {leaderboard.map((item, index) => (
            <div
              key={item.id || index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                background: item.id === user?.id ? '#f4fbf7' : '#ffffff',
                border: item.id === user?.id ? '1px solid #1a1a1a' : '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: '800',
                    fontSize: '0.9rem',
                    color: index === 0 ? '#a66908' : index === 1 ? '#57606a' : index === 2 ? '#8c959f' : 'var(--text-muted)',
                    minWidth: '24px',
                  }}
                >
                  #{index + 1}
                </span>
                <div>
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1a1a1a' }}>
                    {item.display_name} {item.id === user?.id && <span style={{ fontSize: '0.7rem', color: '#0969da' }}>(나)</span>}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.78rem' }}>
                <span style={{ color: '#a66908', fontWeight: '600' }}>🔥 {item.streak}일 연속</span>
                <span style={{ color: '#1a1a1a', fontWeight: '700' }}>{item.solved_count}문제 클리어</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', padding: '1rem', textAlign: 'center' }}>
          아직 랭킹 정보가 없습니다. 첫 번째로 문제를 풀고 1위에 도전해보세요!
        </div>
      )}
    </div>
  );
}

