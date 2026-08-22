import { Megaphone } from 'lucide-react';
import { changelogEntries } from '../data/changelog';

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function Changelog() {
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
          </div>
        ))}
      </div>
    </div>
  );
}
