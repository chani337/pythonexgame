import { useEffect, useMemo, useState } from 'react';
import { Gift, Lock, CheckCircle2 } from 'lucide-react';
import { useAuth, SOLVED_SAVED_EVENT } from '../contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { problems } from '../data/problems';
import type { Problem } from '../data/problems';
import { kstDate, readSolveDays, SOLVE_DAYS_CHANGE_EVENT } from '../utils/winterEvent';
import { GIFT_PROBLEM_IDS, ornamentCount, TREE_DAYS, TREE_GOAL, treeYear } from '../utils/christmasTree';

// 모두의 트리 (Dec 21–25): every account that solves a new problem that day
// hangs one ornament on the site's tree; TREE_GOAL of them lights the star.
// Counts come from daily_solvers_public (migration 005) -- names never.

const ORNAMENT_COLORS = ['#c0262d', '#e8b923', '#1f6feb', '#d0d7de', '#8250df'];

// Spots on the tree. Hung in a scattered order (every 7th spot, wrapping)
// so a quiet day still dresses the whole tree, not just the tip.
const SPOTS: [number, number][] = (() => {
  const rows = [
    { y: 52, xs: [100] },
    { y: 68, xs: [88, 112] },
    { y: 84, xs: [78, 100, 122] },
    { y: 104, xs: [74, 94, 114, 132] },
    { y: 122, xs: [64, 84, 104, 124, 140] },
    { y: 140, xs: [58, 76, 96, 116, 134, 150] },
    { y: 160, xs: [52, 70, 88, 106, 124, 142, 156] },
    { y: 176, xs: [60, 80, 100, 120, 140] },
  ];
  const all = rows.flatMap((r) => r.xs.map((x) => [x, r.y] as [number, number]));
  return all.map((_, i) => all[(i * 7) % all.length]);
})();

interface ChristmasTreeProps {
  solvedIds: string[];
  onSelectProblem: (problem: Problem) => void;
  onNavigateToProblems: () => void;
}

export default function ChristmasTree({ solvedIds, onSelectProblem, onNavigateToProblems }: ChristmasTreeProps) {
  const { user } = useAuth();
  const now = useMemo(() => new Date(), []);
  const year = treeYear(now);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [myDays, setMyDays] = useState<string[]>(() => readSolveDays(user?.id ?? 'guest'));

  useEffect(() => {
    if (year === null || !isSupabaseConfigured) return;
    let cancelled = false;
    const load = () => {
      supabase
        .from('daily_solvers_public')
        .select('day, solvers')
        .gte('day', `${year}-12-21`)
        .then(({ data, error }) => {
          if (cancelled || error || !data) return;
          setCounts(Object.fromEntries(data.map((r: { day: string; solvers: number }) => [r.day, r.solvers])));
        });
    };
    load();
    window.addEventListener(SOLVED_SAVED_EVENT, load);
    return () => {
      cancelled = true;
      window.removeEventListener(SOLVED_SAVED_EVENT, load);
    };
  }, [year]);

  useEffect(() => {
    const sync = () => setMyDays(readSolveDays(user?.id ?? 'guest'));
    sync();
    window.addEventListener(SOLVE_DAYS_CHANGE_EVENT, sync);
    return () => window.removeEventListener(SOLVE_DAYS_CHANGE_EVENT, sync);
  }, [user?.id]);

  if (year === null) return null;

  const today = kstDate(now);
  const todayCount = counts[today] ?? 0;
  const lit = todayCount >= TREE_GOAL;
  const shown = ornamentCount(todayCount, SPOTS.length);
  const hungToday = myDays.includes(today);
  const gifts = GIFT_PROBLEM_IDS.map((id) => problems.find((p) => p.id === id)).filter((p): p is Problem => Boolean(p));
  const allGifts = gifts.length > 0 && gifts.every((g) => solvedIds.includes(g.id));

  return (
    <section className="glass-card" aria-label="모두의 트리" style={{ padding: '1.25rem 1.5rem', border: '1px solid #1a6b3c', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <svg className="xmas-tree-art" viewBox="0 0 200 220" width="170" height="187" role="img" aria-label={`트리 장식 ${todayCount}개${lit ? ', 별이 켜졌어요' : ''}`} style={{ flexShrink: 0, margin: '0 auto' }}>
        <rect x="88" y="186" width="24" height="26" fill="#7a4a24" />
        <polygon points="100,30 150,96 50,96" fill="#1a6b3c" />
        <polygon points="100,62 160,140 40,140" fill="#1f7a45" />
        <polygon points="100,100 172,190 28,190" fill="#22864b" />
        {SPOTS.slice(0, shown).map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="5.5" fill={ORNAMENT_COLORS[i % ORNAMENT_COLORS.length]} stroke="#ffffff" strokeWidth="1" className="xmas-ornament" style={{ animationDelay: `${(i % 7) * 0.3}s` }} />
        ))}
        <polygon
          points="100,8 105.9,22 121,23 109.5,32.6 113.2,47.5 100,39.4 86.8,47.5 90.5,32.6 79,23 94.1,22"
          fill={lit ? '#e8b923' : '#ffffff'}
          stroke={lit ? '#b08800' : '#9ca3af'}
          strokeWidth="1.5"
          className={lit ? 'xmas-star-lit' : undefined}
        />
      </svg>

      <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#1a6b3c' }}>🎄 모두의 트리</h3>
          <p style={{ margin: '0.3rem 0 0', fontSize: '0.88rem', color: '#1a1a1a', lineHeight: 1.6 }}>
            오늘 <b>{todayCount}명</b>이 문제를 풀고 장식을 달았어요.{' '}
            {lit ? <b style={{ color: '#b08800' }}>별이 켜졌어요! ⭐</b> : <>{TREE_GOAL - todayCount}명만 더 풀면 꼭대기 별이 켜져요.</>}
          </p>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {!user
              ? '로그인하고 새 문제를 풀어야 장식이 달려요.'
              : hungToday
                ? '✓ 오늘 내 장식도 달렸어요.'
                : '오늘 새 문제를 하나 풀면 내 장식도 달려요.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {TREE_DAYS.map((d) => {
            const day = `${year}-12-${d}`;
            const n = counts[day] ?? 0;
            const future = day > today;
            return (
              <div key={d} style={{ border: `1px solid ${day === today ? '#1a6b3c' : 'var(--border-subtle)'}`, padding: '0.3rem 0.5rem', minWidth: '52px', textAlign: 'center', fontSize: '0.72rem', background: day === today ? '#f0fbf4' : '#ffffff' }}>
                <div style={{ fontWeight: 700 }}>12/{d}</div>
                <div style={{ color: future ? '#9ca3af' : '#1a1a1a' }}>{future ? '—' : `${n}명${n >= TREE_GOAL ? ' ⭐' : ''}`}</div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {gifts.map((g) => {
            const open = !g.opensOn || today >= g.opensOn;
            const done = solvedIds.includes(g.id);
            return (
              <button
                key={g.id}
                disabled={!open}
                onClick={() => onSelectProblem(g)}
                className={open && !done ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '0.45rem 0.8rem', fontSize: '0.78rem', opacity: open ? 1 : 0.6, cursor: open ? 'pointer' : 'not-allowed' }}
              >
                {done ? <CheckCircle2 size={14} /> : open ? <Gift size={14} /> : <Lock size={14} />}
                {open ? g.title.replace(/^🎁\s*/, '') : `선물 문제 · ${Number(g.opensOn!.slice(8, 10))}일에 열려요`}
              </button>
            );
          })}
          {!hungToday && (
            <button className="btn-secondary" style={{ padding: '0.45rem 0.8rem', fontSize: '0.78rem' }} onClick={onNavigateToProblems}>
              아무 문제나 풀러 가기
            </button>
          )}
        </div>
        {allGifts && (
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#c0262d' }}>🎁 크리스마스 선물 배지를 받았어요! 메리 크리스마스!</div>
        )}
      </div>
    </section>
  );
}
