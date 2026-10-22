import { useState } from 'react';
import { Megaphone, ChevronDown, ChevronRight } from 'lucide-react';
import { changelogEntries } from '../data/changelog';
import { problems } from '../data/problems';
import type { Problem } from '../data/problems';

const LANG_LABEL: Record<string, string> = {
  python: 'Python', algorithm: '알고리즘', sql: 'SQL', java: 'Java', c: 'C', js: 'JS', html: 'HTML', css: 'CSS',
};

// "HTML · 목록", "Python · NumPy", "알고리즘 · 실전" -- the same grouping a
// student would filter by, in the order the release added them.
function groupProblems(ids: string[]) {
  const byId = new Map(problems.map((p) => [p.id, p]));
  const groups = new Map<string, Problem[]>();
  for (const id of ids) {
    const p = byId.get(id);
    if (!p) continue;
    const key = `${LANG_LABEL[p.language ?? 'python'] ?? p.language} · ${p.category}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(p);
  }
  return [...groups.entries()];
}

function NewProblems({ ids, defaultOpen, onSelectProblem }: { ids: string[]; defaultOpen: boolean; onSelectProblem: (p: Problem) => void }) {
  const [open, setOpen] = useState(defaultOpen);
  const groups = groupProblems(ids);
  const total = groups.reduce((n, [, ps]) => n + ps.length, 0);
  return (
    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.6rem' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, color: '#1a1a1a' }}
      >
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        이번에 추가된 문제 {total}개
      </button>
      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.6rem' }}>
          {groups.map(([group, ps]) => (
            <div key={group}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>{group}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {ps.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onSelectProblem(p)}
                    title="이 문제 풀러 가기"
                    style={{ fontSize: '0.76rem', padding: '0.3rem 0.6rem', background: '#ffffff', border: '1px solid var(--border-subtle)', color: '#1a1a1a', cursor: 'pointer', textAlign: 'left' }}
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function Changelog({ onSelectProblem }: { onSelectProblem: (problem: Problem) => void }) {
  // Only the newest release with problems starts expanded; older lists
  // (38 HTML/CSS titles, say) would otherwise bury everything below them.
  const firstWithProblems = changelogEntries.find((e) => e.problemIds?.length);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'var(--font-display)', marginBottom: '0.25rem', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Megaphone size={22} />
          업데이트
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          PyQuests에 새로 추가되거나 고쳐진 내용을 여기서 확인할 수 있어요.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {changelogEntries.map((entry) => (
          <div
            key={entry.date + entry.title}
            className="glass-card"
            style={{ padding: '1.25rem 1.5rem', borderRadius: '0px', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
                {formatDate(entry.date)}
              </span>
              <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1a1a1a' }}>{entry.title}</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {entry.items.map((item, idx) => (
                <li key={idx} style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
                  {item}
                </li>
              ))}
            </ul>
            {entry.problemIds && entry.problemIds.length > 0 && (
              <NewProblems ids={entry.problemIds} defaultOpen={entry === firstWithProblems} onSelectProblem={onSelectProblem} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
