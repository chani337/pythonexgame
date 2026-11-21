import type { Problem } from '../data/problems';
import { CHOICE_XP, CODING_XP, TIERS, levelFor, levelStartXp, nextTier, tierFor, totalXp } from '../utils/levels';

interface LevelCardProps {
  problems: Problem[];
  solvedIds: string[];
}

// The dashboard's tier, level and XP. Computed from solvedIds with the same
// weights the ranking views use, so it matches the number in the ranking.
export default function LevelCard({ problems, solvedIds }: LevelCardProps) {
  const xp = totalXp(problems, solvedIds);
  const tier = tierFor(xp);
  const next = nextTier(tier);
  const level = levelFor(xp);
  const levelFrom = levelStartXp(level);
  const levelTo = levelStartXp(level + 1);
  const levelPct = ((xp - levelFrom) / (levelTo - levelFrom)) * 100;
  const tierPct = next ? ((xp - tier.minXp) / (next.minXp - tier.minXp)) * 100 : 100;

  return (
    <div
      className="glass-card"
      style={{ padding: '1.75rem', borderRadius: '0px', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderLeft: `4px solid ${tier.color}` }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            background: '#f4f4f6',
            border: '1px solid var(--border-subtle)',
            flexShrink: 0,
          }}
        >
          {tier.icon}
        </div>
        <div style={{ flex: '1 1 240px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: tier.color }}>{tier.name}</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1a1a1a', fontFamily: 'var(--font-mono)' }}>Lv.{level}</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{xp.toLocaleString()} XP</span>
          </div>
          <div style={{ marginTop: '0.6rem' }}>
            <div style={{ height: '8px', background: '#ececee' }}>
              <div style={{ height: '100%', width: `${tierPct}%`, background: tier.color, transition: 'width 0.4s ease' }} />
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.35rem', fontWeight: 600 }}>
              {next
                ? `다음 등급 ${next.icon} ${next.name}까지 ${(next.minXp - xp).toLocaleString()} XP`
                : '최고 등급이에요!'}
              <span style={{ marginLeft: '0.75rem', color: 'var(--text-muted)' }}>
                Lv.{level + 1}까지 {(levelTo - xp).toLocaleString()} XP ({Math.floor(levelPct)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tier ladder */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(92px, 1fr))', gap: '0.4rem' }}>
        {TIERS.map((t) => {
          const reached = xp >= t.minXp;
          const current = t.id === tier.id;
          return (
            <div
              key={t.id}
              style={{
                padding: '0.45rem 0.5rem',
                border: current ? `2px solid ${t.color}` : '1px solid var(--border-subtle)',
                background: current ? '#ffffff' : reached ? '#f6f8fa' : '#ffffff',
                opacity: reached ? 1 : 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: reached ? '#1a1a1a' : 'var(--text-secondary)',
              }}
            >
              <span style={{ fontSize: '0.95rem', filter: reached ? 'none' : 'grayscale(1)' }}>{t.icon}</span>
              <span>
                {t.name}
                <span style={{ display: 'block', fontSize: '0.62rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {t.minXp.toLocaleString()} XP
                </span>
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        XP: 코딩 문제 기초 {CODING_XP.basic} · 중급 {CODING_XP.intermediate} · 고급 {CODING_XP.advanced} · 챌린지 {CODING_XP.expert}, 퀴즈 · 빈칸 {CHOICE_XP}. 랭킹도 XP 순이에요.
      </div>
    </div>
  );
}
