import { useState, useEffect } from 'react';
import { Award, Zap, CheckCircle2, TrendingUp, BookOpen, ChevronRight, Edit3, Shuffle, Lightbulb, Megaphone, Users, Activity } from 'lucide-react';
import type { Problem } from '../data/problems';
import { useAuth, EXCLUDED_LEADERBOARD_IDS, ADMIN_EMAIL } from '../contexts/AuthContext';
import type { LeaderboardUser } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import ProfileEditModal from './ProfileEditModal';
import LearningRoadmap from './LearningRoadmap';
import { triviaItems } from '../data/trivia';
import { changelogEntries } from '../data/changelog';

type RankingMode = 'all' | 'week' | 'python' | 'sql' | 'java' | 'js' | 'algorithm';

const RANKING_TABS: { id: RankingMode; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'week', label: '이번 주' },
  { id: 'python', label: 'Python' },
  { id: 'sql', label: 'SQL' },
  { id: 'java', label: 'Java' },
  { id: 'js', label: 'JS' },
  { id: 'algorithm', label: '알고리즘' },
];

// Solved-problem counts for the "이번 주"/per-language tabs -- computed
// on demand (only when that tab is selected) since the default "전체" view
// already has realtime updates handled by AuthContext's refreshLeaderboard.
//
// Language isn't stored server-side (only in the bundled problems.ts), so
// this can't just read an aggregate view like the "전체" tab does -- it
// still needs every raw (user_id, problem_id) row to join against the local
// language map. PostgREST caps a single response at 1000 rows, so this
// pages through with .range() until a short page signals the end, instead
// of doing one unbounded select that would silently truncate once the
// table passed 1000 rows.
const PAGE_SIZE = 1000;
async function fetchAllSolvedRows(mode: RankingMode): Promise<{ user_id: string; problem_id: string }[]> {
  const rows: { user_id: string; problem_id: string }[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    let query = supabase
      .from('user_solved_problems')
      .select('user_id, problem_id, solved_at')
      .order('id', { ascending: true })
      .range(from, from + PAGE_SIZE - 1);
    if (mode === 'week') {
      const now = new Date();
      const daysSinceMonday = (now.getDay() + 6) % 7;
      const monday = new Date(now);
      monday.setDate(now.getDate() - daysSinceMonday);
      monday.setHours(0, 0, 0, 0);
      query = query.gte('solved_at', monday.toISOString());
    }
    const { data, error } = await query;
    if (error || !data) break;
    rows.push(...data);
    if (data.length < PAGE_SIZE) break;
  }
  return rows;
}

async function fetchFilteredLeaderboard(mode: RankingMode, problems: Problem[]): Promise<LeaderboardUser[]> {
  if (mode === 'all') return [];

  const langById = new Map(problems.map((p) => [p.id, p.language || 'python']));
  const data = await fetchAllSolvedRows(mode);

  const counts: Record<string, number> = {};
  data.forEach((row: { user_id: string; problem_id: string }) => {
    if (mode !== 'week' && langById.get(row.problem_id) !== mode) return;
    counts[row.user_id] = (counts[row.user_id] || 0) + 1;
  });

  const userIds = Object.keys(counts).filter((uid) => !EXCLUDED_LEADERBOARD_IDS.includes(uid));
  if (userIds.length === 0) return [];

  const { data: profs } = await supabase.from('leaderboard_public').select('id, display_name, streak').in('id', userIds);
  const profMap = new Map((profs || []).map((p: any) => [p.id, p]));

  return userIds
    .map((uid) => ({
      id: uid,
      display_name: profMap.get(uid)?.display_name || '러너_' + uid.slice(0, 5),
      email: '',
      streak: profMap.get(uid)?.streak || 0,
      solved_count: counts[uid],
    }))
    .sort((a, b) => b.solved_count - a.solved_count || b.streak - a.streak)
    .slice(0, 10);
}


// Member-count and solved-count-distribution stats for the admin-only
// dashboard section. leaderboard_public returns exactly one row per profile
// (see the view's own comment in supabase_schema.sql), so a plain unfiltered
// select is a safe, unbounded-free total -- no pagination needed at this scale.
interface AdminStats {
  total: number;
  active: number;
  avgSolved: number;
  buckets: { label: string; count: number }[];
}

async function fetchAdminStats(): Promise<AdminStats | null> {
  const { data, error } = await supabase.from('leaderboard_public').select('id, solved_count');
  if (error || !data) return null;

  const counts = data.map((u: any) => u.solved_count || 0);
  const total = counts.length;
  const active = counts.filter((n) => n > 0).length;
  const avgSolved = total > 0 ? counts.reduce((sum, n) => sum + n, 0) / total : 0;

  const bucketDefs: { label: string; test: (n: number) => boolean }[] = [
    { label: '0개', test: (n) => n === 0 },
    { label: '1~5개', test: (n) => n >= 1 && n <= 5 },
    { label: '6~10개', test: (n) => n >= 6 && n <= 10 },
    { label: '11~20개', test: (n) => n >= 11 && n <= 20 },
    { label: '21개+', test: (n) => n >= 21 },
  ];
  const buckets = bucketDefs.map((b) => ({ label: b.label, count: counts.filter(b.test).length }));

  return { total, active, avgSolved, buckets };
}

interface DashboardProps {
  problems: Problem[];
  solvedIds: string[];
  streak: number;
  onNavigateToProblems: (language?: string, difficulty?: string) => void;
  onSelectProblem: (problem: Problem) => void;
  sandboxRunCount: number;
  onUnlockAll?: () => void;
  onNavigateToChangelog?: () => void;
}

export default function Dashboard({
  problems,
  solvedIds,
  streak,
  onNavigateToProblems,
  onSelectProblem,
  sandboxRunCount,
  onUnlockAll,
  onNavigateToChangelog,
}: DashboardProps) {
  const { user, recentActivity } = useAuth();
  const isMasterAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL;

  // 관리자 전용 통계 (전체 회원수 / 활동 회원 / 해결 분포)
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  useEffect(() => {
    if (!isMasterAdmin) return;
    let cancelled = false;
    fetchAdminStats().then((stats) => {
      if (!cancelled) setAdminStats(stats);
    });
    return () => {
      cancelled = true;
    };
  }, [isMasterAdmin]);

  // 실시간 풀이 피드: 가장 최근 1건만 표시
  const currentActivity = recentActivity[0];

  // 코딩 트리비아: 방문할 때마다 무작위로 하나 뽑고, 버튼으로 다시 뽑을 수 있음
  const [triviaIndex, setTriviaIndex] = useState<number>(() => Math.floor(Math.random() * triviaItems.length));
  const currentTrivia = triviaItems[triviaIndex];
  const rerollTrivia = () => {
    setTriviaIndex((prev) => {
      if (triviaItems.length <= 1) return prev;
      let next = Math.floor(Math.random() * triviaItems.length);
      while (next === prev) next = Math.floor(Math.random() * triviaItems.length);
      return next;
    });
  };

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

  // Scope badge counting to a single language so adding SQL/Java problems doesn't
  // silently inflate Python-named badges (or vice versa). Problems without an
  // explicit `language` field are treated as Python (the original 99 problems).
  const problemsByLanguage = (lang: 'python' | 'sql' | 'java' | 'js') =>
    problems.filter((p) => (p.language || 'python') === lang);
  const solvedIdsByLanguage = (lang: 'python' | 'sql' | 'java' | 'js') => {
    const ids = new Set(problemsByLanguage(lang).map((p) => p.id));
    return solvedIds.filter((id) => ids.has(id));
  };

  const pythonSolvedIds = solvedIdsByLanguage('python');
  const pythonAdvSolved = problemsByLanguage('python').filter(
    (p) => p.difficulty === 'advanced' && solvedIds.includes(p.id)
  );
  const sqlSolvedCount = solvedIdsByLanguage('sql').length;
  const javaSolvedCount = solvedIdsByLanguage('java').length;
  const jsSolvedCount = solvedIdsByLanguage('js').length;

  // Badge data
  const badges = [
    {
      id: 'novice',
      name: '파이썬 스타터',
      description: '파이썬 문제를 첫 번째로 해결하세요.',
      icon: '🌱',
      color: '#1a1a1a',
      shadow: 'none',
      unlocked: pythonSolvedIds.length >= 1,
    },
    {
      id: 'operator_master',
      name: '연산의 귀재',
      description: '연산자 카테고리 문제를 5개 이상 해결하세요.',
      icon: '🔢',
      color: '#1a1a1a',
      shadow: 'none',
      unlocked: pythonSolvedIds.filter(id => id.includes('part3')).length >= 5,
    },
    {
      id: 'conditional_master',
      name: '조건의 지배자',
      description: '조건문 카테고리 문제를 5개 이상 해결하세요.',
      icon: '🔄',
      color: '#1a1a1a',
      shadow: 'none',
      unlocked: pythonSolvedIds.filter(id => id.includes('part4')).length >= 5,
    },
    {
      id: 'structure_master',
      name: '자료구조 컬렉터',
      description: '리스트/튜플/딕셔너리 문제를 10개 이상 해결하세요.',
      icon: '🔍',
      color: '#1a1a1a',
      shadow: 'none',
      unlocked: pythonSolvedIds.filter(id => id.includes('part5') || id.includes('part6') || id.includes('part9')).length >= 10,
    },
    {
      id: 'advanced_wizard',
      name: '파이썬 마스터',
      description: '파이썬 고급 단계 문제를 5개 이상 해결하세요.',
      icon: '🧙‍♂️',
      color: '#1a1a1a',
      shadow: 'none',
      unlocked: pythonAdvSolved.length >= 5,
    },
    {
      id: 'sql_explorer',
      name: 'SQL 탐험가',
      description: 'SQL 문제를 5개 이상 해결하세요.',
      icon: '🗄️',
      color: '#1a1a1a',
      shadow: 'none',
      unlocked: sqlSolvedCount >= 5,
    },
    {
      id: 'java_starter',
      name: '자바 입문자',
      description: 'Java 문제를 5개 이상 해결하세요.',
      icon: '☕',
      color: '#1a1a1a',
      shadow: 'none',
      unlocked: javaSolvedCount >= 5,
    },
    {
      id: 'js_coder',
      name: '자바스크립트 코더',
      description: 'JavaScript 문제를 5개 이상 해결하세요.',
      icon: '⚡',
      color: '#1a1a1a',
      shadow: 'none',
      unlocked: jsSolvedCount >= 5,
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

  const latestChangelogEntry = changelogEntries[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1 }}>
      {/* Changelog Callout -- first thing on the dashboard so users landing
          on the home screen know an update log exists at all, not just
          people who happen to open the 더보기 panel. */}
      {latestChangelogEntry && onNavigateToChangelog && (
        <button
          onClick={onNavigateToChangelog}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            width: '100%',
            padding: '0.65rem 1rem',
            background: '#1a1a1a',
            border: 'none',
            borderRadius: '0px',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <Megaphone size={15} style={{ color: '#ffffff', flexShrink: 0 }} />
          <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#ffffff', flexShrink: 0 }}>업데이트 소식</span>
          <span
            style={{
              fontSize: '0.78rem',
              color: 'rgba(255,255,255,0.75)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
              minWidth: 0,
            }}
          >
            {latestChangelogEntry.title}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)', flexShrink: 0 }}>자세히 보기 →</span>
        </button>
      )}

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
              ? `${ADMIN_EMAIL} 관리자 전용 모드입니다. 아래 버튼을 눌러 모든 문제 클리어 및 뱃지 전체 해금을 1초 만에 실행하실 수 있습니다.`
              : '기초부터 차근차근 고급 개념까지! PyQuests와 함께 다양한 프로그래밍 언어를 브라우저에서 직접 실행하며 코딩 마스터 지름길을 걸어보세요.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {isMasterAdmin && onUnlockAll && (
            <button
              onClick={() => {
                if (window.confirm(isMasterAdmin ? `${ADMIN_EMAIL} 계정에 모든 문제(${totalCount}개) 해결 완료 및 뱃지 전체 해금을 적용하시겠습니까?` : `모든 문제(${totalCount}개)를 해결 완료하고 모든 학습 뱃지를 해금하시겠습니까?`)) {
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
          <button className="btn-primary" onClick={() => onNavigateToProblems()}>
            <BookOpen size={15} />
            학습 시작하기
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Admin Stats (관리자 전용) */}
      {isMasterAdmin && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.05em', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={15} /> 관리자 통계
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderRadius: '0px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '0px', background: '#f4f4f6', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users style={{ color: '#1a1a1a' }} size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', fontWeight: '600', letterSpacing: '0.05em' }}>전체 회원수</span>
                <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1a1a1a' }}>
                  {adminStats ? adminStats.total : '···'} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>명</span>
                </span>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderRadius: '0px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '0px', background: '#f4f4f6', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity style={{ color: '#1a1a1a' }} size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', fontWeight: '600', letterSpacing: '0.05em' }}>활동 회원 (1문제+)</span>
                <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1a1a1a' }}>
                  {adminStats ? adminStats.active : '···'} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>명</span>
                </span>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderRadius: '0px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '0px', background: '#f4f4f6', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp style={{ color: '#1a1a1a' }} size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', fontWeight: '600', letterSpacing: '0.05em' }}>평균 해결 문제 수</span>
                <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1a1a1a' }}>
                  {adminStats ? adminStats.avgSolved.toFixed(1) : '···'} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>개</span>
                </span>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '0px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '1.25rem', letterSpacing: '0.02em' }}>
              회원별 문제 해결 분포
            </h4>
            {adminStats ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {(() => {
                  const max = Math.max(...adminStats.buckets.map((b) => b.count), 1);
                  const colors = ['#86b6ef', '#5598e7', '#2a78d6', '#1c5cab', '#104281'];
                  return adminStats.buckets.map((b, i) => (
                    <div key={b.label} title={`${b.label}: ${b.count}명`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', width: '56px', flexShrink: 0, fontWeight: '600' }}>{b.label}</span>
                      <div style={{ flex: 1, height: '20px', background: 'var(--bg-dark)' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${(b.count / max) * 100}%`,
                            background: colors[i],
                            borderRadius: '0 4px 4px 0',
                            transition: 'width 0.4s ease-out',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#1a1a1a', width: '28px', textAlign: 'right', flexShrink: 0 }}>{b.count}</span>
                    </div>
                  ));
                })()}
              </div>
            ) : (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>불러오는 중...</span>
            )}
          </div>
        </div>
      )}

      {/* Coding Trivia Card */}
      <div
        className="glass-card"
        style={{
          padding: '1.5rem 1.75rem',
          borderRadius: '0px',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          flexWrap: 'wrap',
          background: '#fffcf0',
          border: '1px solid #f0e4b8',
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            flexShrink: 0,
            background: '#fff3d1',
            border: '1px solid #e8c766',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Lightbulb size={20} style={{ color: '#a66908' }} />
        </div>
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: '700', color: '#a66908', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
            💡 코딩 트리비아
          </div>
          <p style={{ fontSize: '0.88rem', color: '#1a1a1a', lineHeight: '1.5' }}>
            <span style={{ marginRight: '0.4rem' }}>{currentTrivia.emoji}</span>
            {currentTrivia.text}
          </p>
        </div>
        <button
          onClick={rerollTrivia}
          style={{
            background: '#ffffff',
            border: '1px solid #e8c766',
            color: '#a66908',
            padding: '0.5rem 0.9rem',
            fontSize: '0.78rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            flexShrink: 0,
          }}
        >
          <Shuffle size={14} />
          다른 상식 보기
        </button>
      </div>

      {/* Live Solve Activity Feed -- always mounted (not just while there's
          something to show), so it reads as a permanent fixture rather than
          a transient toast that flashes and disappears. Rotates through the
          last few solves when there's more than one. */}
      <div
        className="glass-card"
        style={{
          padding: '0.85rem 1.25rem',
          borderRadius: '0px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: '#f0fff4',
          border: '1px solid #b8e6c8',
        }}
      >
        <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>🎉</span>
        <p
          style={{
            fontSize: '0.84rem',
            color: '#1a1a1a',
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {currentActivity ? (
            <>
              <strong>{currentActivity.displayName}</strong>님이 방금{' '}
              <strong>'{currentActivity.problemTitle}'</strong> 문제를 풀었어요!
            </>
          ) : (
            <span style={{ color: 'var(--text-secondary)' }}>아직 오늘의 풀이 소식이 없어요. 첫 번째로 풀어보세요!</span>
          )}
        </p>
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

      {/* Learning Roadmap */}
      <LearningRoadmap problems={problems} solvedIds={solvedIds} onNavigate={onNavigateToProblems} />

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
      <LeaderboardWidget problems={problems} />
    </div>
  );
}

function LeaderboardWidget({ problems }: { problems: Problem[] }) {
  const { leaderboard, isConfigured, setAuthModalOpen, user } = useAuth();
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [mode, setMode] = useState<RankingMode>('all');
  const [filteredList, setFilteredList] = useState<LeaderboardUser[]>([]);
  const [isLoadingFiltered, setIsLoadingFiltered] = useState(false);

  useEffect(() => {
    if (mode === 'all') return;
    let cancelled = false;
    setIsLoadingFiltered(true);
    fetchFilteredLeaderboard(mode, problems).then((result) => {
      if (!cancelled) {
        setFilteredList(result);
        setIsLoadingFiltered(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [mode, problems]);

  const displayList = mode === 'all' ? leaderboard : filteredList;

  const isSelfUser = (item: any) => {
    if (user && item.id === user.id) return true;
    const lastId = localStorage.getItem('pyquests_last_user_id') || 'local_runner';
    const lastEmail = localStorage.getItem('pyquests_last_user_email');
    if (item.id === lastId) return true;
    if (lastEmail && item.email === lastEmail) return true;
    if (!user && (item.id === 'local_runner' || item.display_name === '나 (게스트 러너)' || item.display_name === '나')) return true;
    return false;
  };

  return (
    <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '0px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '0.05em' }}>
          🔥 글로벌 명예의 전당 (실시간 랭킹)
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <button
              onClick={() => setProfileEditOpen(true)}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: '#1a1a1a',
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '0.3rem 0.6rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <Edit3 size={12} />
              닉네임 변경
            </button>
          ) : (
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
      </div>

      {isConfigured && (
        <div className="docs-category-tabs" style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', overflowX: 'auto' }}>
          {RANKING_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id)}
              style={{
                flexShrink: 0,
                padding: '0.4rem 0.85rem',
                fontSize: '0.75rem',
                fontWeight: '700',
                background: mode === tab.id ? '#1a1a1a' : '#ffffff',
                color: mode === tab.id ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid #1a1a1a',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {!isConfigured ? (
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', padding: '1rem', background: '#f4f4f6' }}>
          클라우드 데이터베이스 연동 시 전체 러너들의 실시간 문제 해결 및 스트릭 랭킹이 여기에 표시됩니다.
        </div>
      ) : isLoadingFiltered ? (
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', padding: '1rem', textAlign: 'center' }}>
          불러오는 중...
        </div>
      ) : displayList.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {displayList.map((item, index) => {
            const isSelf = isSelfUser(item);
            return (
              <div
                key={item.id || index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: isSelf ? '#f4fbf7' : '#ffffff',
                  border: isSelf ? '1px solid #1a1a1a' : '1px solid var(--border-subtle)',
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1a1a1a' }}>
                      {item.display_name} {isSelf && <span style={{ fontSize: '0.7rem', color: '#0969da' }}>(나)</span>}
                    </span>
                    {isSelf && (
                      <button
                        onClick={() => setProfileEditOpen(true)}
                        title="닉네임 수정"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#6b7280',
                          cursor: 'pointer',
                          padding: '2px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Edit3 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.78rem' }}>
                  <span style={{ color: '#a66908', fontWeight: '600' }}>🔥 {item.streak}일 연속</span>
                  <span style={{ color: '#1a1a1a', fontWeight: '700' }}>{item.solved_count}문제 클리어</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', padding: '1rem', textAlign: 'center' }}>
          {mode === 'all'
            ? '아직 랭킹 정보가 없습니다. 첫 번째로 문제를 풀고 1위에 도전해보세요!'
            : mode === 'week'
            ? '이번 주에 문제를 푼 러너가 아직 없습니다. 첫 번째로 도전해보세요!'
            : `${RANKING_TABS.find((t) => t.id === mode)?.label} 문제를 푼 러너가 아직 없습니다. 첫 번째로 도전해보세요!`}
        </div>
      )}

      <ProfileEditModal
        isOpen={profileEditOpen}
        onClose={() => setProfileEditOpen(false)}
      />
    </div>
  );
}

