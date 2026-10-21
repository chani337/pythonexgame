import { diffOutput, visibleLines } from '../utils/outputDiff';
import type { TestResult } from '../hooks/usePyodide';

// Shown under a failed output-graded run: expected and actual output side by
// side with line numbers, the first differing line marked, and a one-line
// guess at the cause (src/utils/outputDiff.ts).
//
// Revealing the expected output is fine here -- it is what the problem's
// 입출력 예시 already shows, and it is output, not the answer code.

const mono = { fontFamily: 'var(--font-mono)', fontSize: '0.75rem', lineHeight: 1.55 } as const;

function Column({ title, lines, side, firstDiff }: {
  title: string;
  lines: ReturnType<typeof visibleLines>['lines'];
  side: 'expected' | 'actual';
  firstDiff: number | null;
}) {
  return (
    <div style={{ minWidth: 0, border: '1px solid var(--border-subtle)', background: '#ffffff' }}>
      <div style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', background: '#f4f4f6', borderBottom: '1px solid var(--border-subtle)' }}>
        {title}
      </div>
      <div style={{ overflowX: 'auto' }}>
        {lines.map((l) => {
          const text = side === 'expected' ? l.expected : l.actual;
          const differs = !l.same;
          return (
            <div
              key={l.n}
              style={{
                ...mono,
                display: 'flex',
                whiteSpace: 'pre',
                background: differs ? (side === 'expected' ? '#f0fbf4' : '#fff5f5') : 'transparent',
                borderLeft: l.n === firstDiff ? `3px solid ${side === 'expected' ? '#1a7f37' : '#cf222e'}` : '3px solid transparent',
              }}
            >
              <span style={{ width: '2.2rem', flexShrink: 0, textAlign: 'right', paddingRight: '0.5rem', color: 'var(--text-muted)', userSelect: 'none' }}>{l.n}</span>
              {text === null ? (
                <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>(줄 없음)</span>
              ) : (
                // Trailing spaces are invisible otherwise, and they are a
                // real cause of failures; show them as a middle dot.
                <span style={{ color: '#1a1a1a', paddingRight: '0.5rem' }}>
                  {text.replace(/ +$/, (m) => '·'.repeat(m.length)) || ' '}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Comparison({ expected, actual, label }: { expected: string; actual: string; label?: string }) {
  const diff = diffOutput(expected, actual);
  const view = visibleLines(diff);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      {label && (
        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
          입력 <code style={{ ...mono, color: '#1a1a1a' }}>{label}</code>
        </div>
      )}
      <div style={{ fontSize: '0.76rem', color: '#1a1a1a', lineHeight: 1.5 }}>
        {diff.firstDiff !== null && (
          <strong style={{ fontWeight: 700 }}>
            {diff.lines.length === 1 ? '결과가 달라요. ' : `${diff.firstDiff}번째 줄부터 달라요. `}
          </strong>
        )}
        {diff.hint}
      </div>
      {view.skippedBefore > 0 && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>… 앞의 같은 {view.skippedBefore}줄 생략</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
        <Column title="기대 출력" lines={view.lines} side="expected" firstDiff={diff.firstDiff} />
        <Column title="내 출력" lines={view.lines} side="actual" firstDiff={diff.firstDiff} />
      </div>
      {view.skippedAfter > 0 && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>… 뒤의 {view.skippedAfter}줄 생략</div>}
    </div>
  );
}

// Whole-output problems have one result labelled 전체 코드 출력; function
// problems have one per call, labelled with the call. At most three failed
// calls are expanded -- past that the pattern is usually the same.
export default function OutputComparison({ results }: { results: TestResult[] }) {
  const failed = results.filter((r) => !r.passed);
  if (failed.length === 0) return null;
  const wholeOutput = results.length === 1 && results[0].input === '전체 코드 출력';
  const shown = failed.slice(0, 3);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.6rem' }}>
      {shown.map((r, i) => (
        <Comparison
          key={i}
          expected={String(r.expected ?? '')}
          actual={String(r.actual ?? '')}
          label={wholeOutput ? undefined : r.input}
        />
      ))}
      {failed.length > shown.length && (
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>틀린 테스트 {failed.length - shown.length}개 더 있음</div>
      )}
    </div>
  );
}
