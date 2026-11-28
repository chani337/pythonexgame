import { useState } from 'react';
import { Flag, ChevronDown, ChevronUp, Star, Trophy, ClipboardList } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useContest } from '../contexts/ContestContext';
import {
  classAverage,
  CLASS_COLORS,
  contestPhase,
  daysBetween,
  finalWinner,
  gaugeShares,
  leadingClass,
} from '../utils/contest';
import type { ContestBoard as Board, ContestClass } from '../utils/contest';
import { kstDate } from '../utils/winterEvent';

// 과정 대항전 현황판: the top of the home screen for everyone, logged in or
// not. Class totals only -- real names stay on the teacher's roster.

const shortDate = (d: string) => `${Number(d.slice(5, 7))}/${Number(d.slice(8, 10))}`;
const fmt = (n: number) => (Math.round(n * 10) / 10).toFixed(1);

// Dec 26–31 with no contest made yet: say one is coming in January.
function isTeaserWindow(now = new Date()) {
  const d = kstDate(now);
  return d.slice(5) >= '12-26';
}

interface ContestBoardProps {
  onOpenClassView: () => void;
}

export default function ContestBoard({ onOpenClassView }: ContestBoardProps) {
  const { board, openJoin } = useContest();

  if (!board) {
    if (!isTeaserWindow()) return null;
    return (
      <div className="glass-card" style={{ padding: '1rem 1.25rem', border: '1px dashed #1a1a1a', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Flag size={18} style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1a1a1a' }}>1월에 과정 대항전이 열려요</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>반끼리 한 사람당 새로 푼 문제 수로 4주 동안 겨뤄요. 참가 코드는 담임 선생님이 알려 주세요.</span>
      </div>
    );
  }

  return <BoardCard board={board} onJoin={() => openJoin()} onOpenClassView={onOpenClassView} />;
}

function BoardCard({ board, onJoin, onOpenClassView }: { board: Board; onJoin: () => void; onOpenClassView: () => void }) {
  const { user, profile } = useAuth();
  const [open, setOpen] = useState(false);
  const { contest, classes, rounds, mine } = board;
  const phase = contestPhase(contest);
  const shares = gaugeShares(classes);
  const leader = leadingClass(classes);
  const champion = phase === 'finished' ? finalWinner(classes) : null;
  const color = (id: string) => CLASS_COLORS[Math.max(classes.findIndex((c) => c.id === id), 0) % CLASS_COLORS.length];
  const myClass = classes.find((c) => c.id === mine?.class_id);
  const isTeacher = (mine?.teacher_class_ids.length ?? 0) > 0 || profile?.is_admin === true;

  const status =
    phase === 'upcoming'
      ? `D-${daysBetween(contest.today, contest.starts_on)} · ${shortDate(contest.starts_on)} 시작`
      : phase === 'running'
        ? `${contest.round_now}라운드 / ${contest.rounds} · ${daysBetween(contest.today, contest.ends_on) === 0 ? '오늘 마지막 날' : `${daysBetween(contest.today, contest.ends_on)}일 남음`}`
        : '최종 결과';

  return (
    <section className="glass-card contest-board" aria-label="과정 대항전 현황" style={{ padding: '1.25rem 1.5rem', border: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#1a1a1a' }}>
          <Flag size={18} /> {contest.name}
        </h3>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: phase === 'running' ? '#cf222e' : 'var(--text-secondary)' }}>
          {phase === 'running' && '● '}{status}
        </span>
      </header>

      {champion && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1rem', background: '#fffbeb', border: '1px solid #d97706', fontWeight: 800, color: '#92400e' }}>
          <Trophy size={18} /> {champion.name} 우승! 한 사람당 {fmt(classAverage(champion))}문제
        </div>
      )}

      {/* The gauge: shares of the per-head averages, 50% marked. */}
      <div>
        <div style={{ position: 'relative', display: 'flex', height: '34px', border: '1px solid #1a1a1a', overflow: 'hidden' }}>
          {classes.map((c, i) => (
            <div
              key={c.id}
              title={`${c.name} ${fmt(shares[i])}%`}
              style={{
                width: `${shares[i]}%`,
                background: color(c.id),
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: i === 0 ? 'flex-start' : 'flex-end',
                padding: '0 0.6rem',
                fontSize: '0.8rem',
                fontWeight: 800,
                whiteSpace: 'nowrap',
                transition: 'width 0.6s ease',
                minWidth: 0,
              }}
            >
              {shares[i] >= 18 && `${c.name} ${fmt(shares[i])}%`}
            </div>
          ))}
          {classes.length === 2 && (
            <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, borderLeft: '2px dashed rgba(255,255,255,0.85)' }} />
          )}
        </div>
        <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
          {phase === 'upcoming'
            ? '시작하면 한 사람당 새로 푼 문제 수로 게이지가 움직여요'
            : leader
              ? `${leader.name}이 앞서고 있어요`
              : '막상막하, 동점이에요'}
        </div>
      </div>

      <div className="contest-class-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(classes.length, 4)}, minmax(0, 1fr))`, gap: '0.75rem' }}>
        {classes.map((c) => (
          <ClassColumn key={c.id} c={c} color={color(c.id)} phase={phase} mine={c.id === mine?.class_id} />
        ))}
      </div>

      {phase !== 'upcoming' && classes.some((c) => c.mvp) && (
        <div style={{ fontSize: '0.8rem', color: '#1a1a1a', display: 'flex', flexDirection: 'column', gap: '0.25rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
          <span style={{ fontWeight: 800 }}>{contest.round_now}라운드 MVP</span>
          {classes.map((c) =>
            c.mvp ? (
              <span key={c.id}>
                <b style={{ color: color(c.id) }}>{c.name}</b> {c.mvp.name} ({c.mvp.solved}문제)
                {c.growth && <span style={{ color: 'var(--text-secondary)' }}> · 성장상 {c.growth.name} (+{c.growth.gain})</span>}
              </span>
            ) : null
          )}
        </div>
      )}

      {/* Me: my share, or the way in. */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
        {myClass ? (
          <span style={{ fontSize: '0.85rem', color: '#1a1a1a' }}>
            <b style={{ color: color(myClass.id) }}>{myClass.name}</b> 참가 중 · 내가 보탠 문제 <b>{mine?.solved ?? 0}</b>개 (오늘 {mine?.solved_today ?? 0}개)
          </span>
        ) : phase !== 'finished' && !isTeacher ? (
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {user ? '참가 코드는 담임 선생님이 알려 주세요.' : '로그인하고 코드를 넣으면 우리 반 점수에 보탤 수 있어요.'}
          </span>
        ) : (
          <span />
        )}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {isTeacher && (
            <button className="btn-secondary" onClick={onOpenClassView} style={{ padding: '0.45rem 0.8rem', fontSize: '0.78rem' }}>
              <ClipboardList size={14} /> {profile?.is_admin ? '대회 관리' : '우리 반 현황'}
            </button>
          )}
          {!myClass && phase !== 'finished' && (
            <button className="btn-primary" onClick={onJoin} style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}>
              대항전 참가하기
            </button>
          )}
          {phase !== 'upcoming' && (
            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              style={{ background: 'transparent', border: '1px solid var(--border-subtle)', padding: '0.45rem 0.7rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#1a1a1a' }}
            >
              자세히 {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
        </div>
      </div>

      {open && phase !== 'upcoming' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TrendChart board={board} color={color} />
          <div style={{ overflowX: 'auto' }}>
            <table className="contest-table">
              <thead>
                <tr>
                  <th>라운드</th>
                  <th>기간</th>
                  {classes.map((c) => <th key={c.id} style={{ color: color(c.id) }}>{c.name}</th>)}
                  <th>승리</th>
                </tr>
              </thead>
              <tbody>
                {rounds.map((r) => (
                  <tr key={r.round}>
                    <td>{r.round}</td>
                    <td>{shortDate(r.start)}~{shortDate(r.end)}</td>
                    {classes.map((c) => <td key={c.id}>{r.start > contest.today ? '—' : fmt(r.avgs[c.id] ?? 0)}</td>)}
                    <td>{r.finished ? (r.winner ? classes.find((c) => c.id === r.winner)?.name : '무승부') : r.start > contest.today ? '' : '진행 중'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            대회 기간(한국 시간)에 처음 푼 문제만 셉니다. 정답 코드를 보고 푼 문제, 객관식을 여러 번 골라 맞힌 문제, 로그인하기 전에 푼 문제는 빠져요. 평균은 수강 정원(없으면 참가 인원)으로 나눠요. ★는 반 전원이 그날 1문제 이상 푼 날이에요.
          </p>
        </div>
      )}
    </section>
  );
}

function ClassColumn({ c, color, phase, mine }: { c: ContestClass; color: string; phase: string; mine: boolean }) {
  return (
    <div style={{ background: mine ? '#f6f8fa' : '#ffffff', border: '1px solid var(--border-subtle)', borderTopWidth: '4px', borderTopColor: color, padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', minWidth: 0 }}>
      <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {c.name}{mine && <span style={{ fontSize: '0.7rem', color, marginLeft: '0.3rem' }}>우리 반</span>}
      </span>
      {c.teacher_name && <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>담임 {c.teacher_name}</span>}
      {phase !== 'upcoming' && (
        <>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, color, fontFamily: 'var(--font-mono)' }}>
            {fmt(classAverage(c))}<span style={{ fontSize: '0.75rem', fontWeight: 700 }}> 문제/인</span>
          </span>
          <span style={{ fontSize: '0.75rem', color: '#374151' }}>총 {c.solved}문제 · 오늘 {c.today_solvers}명 풀었어요</span>
        </>
      )}
      <span style={{ fontSize: '0.75rem', color: '#374151' }}>
        {c.participants}명 참가{c.capacity ? ` / 정원 ${c.capacity}` : ''}
      </span>
      {phase !== 'upcoming' && (
        <span style={{ fontSize: '0.75rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span title="반 전원이 1문제 이상 푼 날" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.15rem', color: '#b08800', fontWeight: 700 }}>
            <Star size={12} fill="#e8b923" color="#b08800" /> {c.stars}
          </span>
          <span>라운드 {c.round_wins}승</span>
        </span>
      )}
      {c.cheer && <span style={{ fontSize: '0.75rem', color, fontWeight: 700, marginTop: '0.15rem' }}>“{c.cheer}”</span>}
    </div>
  );
}

// Cumulative per-head average by day, one line per class.
function TrendChart({ board, color }: { board: Board; color: (id: string) => string }) {
  const { daily, classes, contest } = board;
  if (daily.length === 0) return null;
  const W = 600;
  const H = 180;
  const pad = { l: 34, r: 12, t: 12, b: 24 };
  const totalDays = daysBetween(contest.starts_on, contest.ends_on) + 1;
  const max = Math.max(1, ...daily.flatMap((d) => Object.values(d.avgs)));
  const x = (i: number) => pad.l + (totalDays <= 1 ? 0 : (i / (totalDays - 1)) * (W - pad.l - pad.r));
  const y = (v: number) => H - pad.b - (v / max) * (H - pad.t - pad.b);
  const ticks = [0, max / 2, max];

  return (
    <figure style={{ margin: 0 }}>
      <figcaption style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '0.35rem' }}>한 사람당 누적 문제 수</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="날짜별 반 평균 추이" style={{ display: 'block' }}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="#e5e7eb" />
            <text x={pad.l - 6} y={y(t) + 4} textAnchor="end" fontSize="10" fill="#6b7280">{fmt(t)}</text>
          </g>
        ))}
        {[0, 7, 14, 21, 28].filter((d) => d < totalDays).map((d) => (
          <text key={d} x={x(d)} y={H - 6} textAnchor="middle" fontSize="10" fill="#6b7280">
            {d === 0 ? '시작' : `${d / 7 + 1}R`}
          </text>
        ))}
        {classes.map((c) => (
          <polyline
            key={c.id}
            fill="none"
            stroke={color(c.id)}
            strokeWidth="2.5"
            strokeLinejoin="round"
            points={daily.map((d, i) => `${x(i)},${y(d.avgs[c.id] ?? 0)}`).join(' ')}
          />
        ))}
      </svg>
      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', justifyContent: 'center' }}>
        {classes.map((c) => (
          <span key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: '14px', height: '3px', background: color(c.id), display: 'inline-block' }} /> {c.name}
          </span>
        ))}
      </div>
    </figure>
  );
}
