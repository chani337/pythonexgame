import { useState } from 'react';
import type { Problem } from '../data/problems';
import { useAuth } from '../contexts/AuthContext';
import { NAME_COLORS, TITLES, nameStyle, titleById } from '../utils/cosmetics';
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

      <CosmeticsPicker xp={xp} />

      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        XP: 코딩 문제 기초 {CODING_XP.basic} · 중급 {CODING_XP.intermediate} · 고급 {CODING_XP.advanced} · 챌린지 {CODING_XP.expert}, 퀴즈 · 빈칸 {CHOICE_XP}. 랭킹도 XP 순이에요.
      </div>
    </div>
  );
}

const chipBase = {
  padding: '0.4rem 0.55rem',
  fontSize: '0.72rem',
  fontWeight: 700,
  borderRadius: '0px',
  background: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  gap: '0.3rem',
  whiteSpace: 'nowrap' as const,
};

function chipStyle(selected: boolean, unlocked: boolean) {
  return {
    ...chipBase,
    border: selected ? '2px solid #1a1a1a' : '1px solid var(--border-subtle)',
    color: unlocked ? '#1a1a1a' : 'var(--text-muted)',
    cursor: unlocked ? 'pointer' : 'not-allowed',
    opacity: unlocked ? 1 : 0.55,
  };
}

// Equip a title and a name color. Locked ones show the XP they need; the
// server re-checks every equip, so this list is only a convenience.
function CosmeticsPicker({ xp }: { xp: number }) {
  const { user, profile, updateCosmetics, setAuthModalOpen } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const titleId = profile?.title_id ?? null;
  const colorId = profile?.name_color ?? null;
  const title = titleById(titleId);

  const save = async (changes: { title_id?: string | null; name_color?: string | null }) => {
    setSaving(true);
    setError(null);
    const res = await updateCosmetics(changes);
    if (res.error) setError(res.error);
    setSaving(false);
  };

  return (
    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1a1a1a' }}>🎖️ 칭호 · 이름 색</span>
        {user && (
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>랭킹 미리보기</span>
          {title && (
            <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#57606a', background: '#f4f4f6', border: '1px solid var(--border-subtle)', padding: '0.1rem 0.35rem' }}>
              {title.icon} {title.name}
            </span>
          )}
          <span style={{ fontWeight: 800, ...nameStyle(colorId) }}>{profile?.display_name || '러너'}</span>
        </span>
        )}
      </div>

      {!user ? (
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          칭호와 이름 색은 랭킹에 표시돼서 로그인한 회원만 고를 수 있어요.{' '}
          <button onClick={() => setAuthModalOpen(true)} style={{ background: 'none', border: 'none', padding: 0, color: '#0969da', fontWeight: 700, cursor: 'pointer', fontSize: '0.78rem' }}>
            로그인하기
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {TITLES.map((t) => {
              const unlocked = xp >= t.minXp;
              const selected = t.id === titleId;
              return (
                <button
                  key={t.id}
                  disabled={!unlocked || saving}
                  onClick={() => save({ title_id: selected ? null : t.id })}
                  title={unlocked ? (selected ? '클릭하면 해제' : '이 칭호 달기') : `${t.minXp.toLocaleString()} XP에 열려요`}
                  style={chipStyle(selected, unlocked)}
                >
                  <span>{unlocked ? t.icon : '🔒'}</span>
                  {t.name}
                  {!unlocked && <span style={{ fontSize: '0.62rem', fontWeight: 600 }}>{t.minXp.toLocaleString()}</span>}
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            <button disabled={saving} onClick={() => save({ name_color: null })} style={chipStyle(colorId === null, true)}>
              <span style={{ fontWeight: 800, color: '#1a1a1a' }}>Aa</span> 기본
            </button>
            {NAME_COLORS.map((c) => {
              const unlocked = xp >= c.minXp;
              const selected = c.id === colorId;
              return (
                <button
                  key={c.id}
                  disabled={!unlocked || saving}
                  onClick={() => save({ name_color: c.id })}
                  title={unlocked ? '이 색으로 바꾸기' : `${c.minXp.toLocaleString()} XP에 열려요`}
                  style={chipStyle(selected, unlocked)}
                >
                  <span style={{ fontWeight: 800, ...(unlocked ? nameStyle(c.id) : {}) }}>{unlocked ? 'Aa' : '🔒'}</span>
                  {c.name}
                  {!unlocked && <span style={{ fontSize: '0.62rem', fontWeight: 600 }}>{c.minXp.toLocaleString()}</span>}
                </button>
              );
            })}
          </div>
          {error && <div style={{ fontSize: '0.75rem', color: '#cf222e', fontWeight: 600 }}>{error}</div>}
        </>
      )}
    </div>
  );
}
