import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { registerSW } from 'virtual:pwa-register';

// Asks before switching to a new deploy, instead of switching underneath the
// user.
//
// This used to be registerType: 'autoUpdate': a new service worker called
// skipWaiting and took over every open tab immediately, without reloading
// them, and its activate step deleted the previous build's precache. An open
// tab was left running the old index.js under a worker that no longer had
// the old chunks -- the blank-tab bug lazyWithReload.ts patches over.
//
// With 'prompt' the new worker installs and waits. Nothing changes until the
// user presses 업데이트, which tells it to skip waiting; when it takes
// control, this tab reloads once onto the new build. Old caches are dropped
// only at that point (cleanupOutdatedCaches), so the two builds never mix.
//
// Other open tabs are not reloaded for the user -- one of them may hold a
// half-written answer. They switch to a "applied in another window" notice
// and reload when that user chooses.
//
// Registration happens once per page, at module scope, so React StrictMode's
// double effect in dev can't register twice.

type Phase = 'hidden' | 'available' | 'updating' | 'appliedElsewhere' | 'failed';

// Per session, so 나중에 holds across reloads of this tab but the prompt
// returns the next time the app is opened.
const DISMISS_KEY = 'pyquests_update_dismissed';
// Hourly while open, plus whenever the app comes back to the foreground --
// a home-screen app is usually resumed, not relaunched.
const CHECK_INTERVAL_MS = 60 * 60 * 1000;
const MIN_CHECK_GAP_MS = 5 * 60 * 1000;
// If the waiting worker never takes control (it failed, or was replaced),
// stop showing "업데이트 중" and let the user carry on.
const APPLY_TIMEOUT_MS = 15_000;

let phase: Phase = 'hidden';
const listeners = new Set<(p: Phase) => void>();
const setPhase = (next: Phase) => {
  phase = next;
  listeners.forEach((l) => l(next));
};

let started = false;
let updateSW: ((reloadPage?: boolean) => Promise<void>) | undefined;
let registration: ServiceWorkerRegistration | undefined;
let userInitiated = false;
let lastCheck = 0;

const isDismissed = () => {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return false;
  }
};

function checkForUpdate() {
  const reg = registration;
  // Offline, or a check already in flight: skip quietly. A failed check is
  // retried at the next interval or foregrounding; the app is unaffected.
  if (!reg || !navigator.onLine || reg.installing) return;
  lastCheck = Date.now();
  reg.update().catch(() => {});
}

function start() {
  if (started || typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  started = true;
  lastCheck = Date.now();

  updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      if (!isDismissed()) setPhase('available');
    },
    // Called when the new worker takes control of this page.
    onNeedReload() {
      if (userInitiated) {
        // Exactly once: this page is about to be replaced.
        userInitiated = false;
        window.location.reload();
      } else {
        setPhase('appliedElsewhere');
      }
    },
    onRegisteredSW(_url, reg) {
      registration = reg;
      setInterval(checkForUpdate, CHECK_INTERVAL_MS);
    },
    // No service worker (blocked, private mode, unsupported): the site
    // still works, it just isn't installable or offline-capable.
    onRegisterError() {},
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && Date.now() - lastCheck > MIN_CHECK_GAP_MS) checkForUpdate();
  });
  window.addEventListener('online', checkForUpdate);
}

function applyUpdate() {
  // The worker can vanish between prompt and click (another tab already
  // applied it and this one missed the event). Then the new build is
  // already in control and a plain reload is the update.
  if (registration && !registration.waiting) {
    window.location.reload();
    return;
  }
  userInitiated = true;
  setPhase('updating');
  updateSW?.(true).catch(() => {});
  setTimeout(() => {
    if (phase === 'updating') {
      userInitiated = false;
      setPhase('failed');
    }
  }, APPLY_TIMEOUT_MS);
}

function dismiss() {
  try {
    sessionStorage.setItem(DISMISS_KEY, '1');
  } catch {
    // Storage blocked: hidden for this page only, shown again on reload.
  }
  setPhase('hidden');
}

export default function UpdatePrompt() {
  const [current, setCurrent] = useState<Phase>(phase);

  useEffect(() => {
    listeners.add(setCurrent);
    start();
    return () => {
      listeners.delete(setCurrent);
    };
  }, []);

  if (current === 'hidden') return null;

  const title =
    current === 'appliedElsewhere' ? '다른 창에서 업데이트를 적용했어요.' :
    current === 'failed' ? '업데이트를 적용하지 못했어요.' :
    '새로운 업데이트가 있습니다.';
  const body =
    current === 'appliedElsewhere' ? '새로고침하면 이 창도 최신 버전으로 바뀝니다.' :
    current === 'failed' ? '지금 버전은 그대로 사용할 수 있어요. 다음에 앱을 열 때 다시 안내해 드릴게요.' :
    '최신 버전이 배포되었습니다. 업데이트하면 새로운 기능과 개선 사항을 사용할 수 있습니다.';

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem 1rem',
        padding: '0.85rem 1rem 0.85rem 1.1rem',
        width: 'max-content',
        maxWidth: 'calc(100vw - 2rem)',
        background: '#ffffff',
        border: '1px solid #1a1a1a',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        fontSize: '0.85rem',
        color: '#1a1a1a',
      }}
    >
      <RefreshCw size={16} style={{ flexShrink: 0 }} />
      <span style={{ flex: '1 1 16rem', lineHeight: 1.5 }}>
        <strong style={{ display: 'block', fontWeight: 700 }}>{title}</strong>
        <span style={{ color: 'var(--text-secondary)' }}>{body}</span>
      </span>
      <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
        {current === 'failed' ? (
          <button className="btn-secondary" onClick={() => setPhase('hidden')} style={{ padding: '0.5rem 1rem', fontSize: '0.78rem' }}>
            닫기
          </button>
        ) : (
          <>
            <button
              className="btn-secondary"
              onClick={dismiss}
              disabled={current === 'updating'}
              style={{ padding: '0.5rem 1rem', fontSize: '0.78rem' }}
            >
              나중에
            </button>
            <button
              className="btn-primary"
              onClick={current === 'appliedElsewhere' ? () => window.location.reload() : applyUpdate}
              disabled={current === 'updating'}
              style={{ padding: '0.5rem 1rem', fontSize: '0.78rem' }}
            >
              {current === 'updating' ? '업데이트 중...' : current === 'appliedElsewhere' ? '새로고침' : '업데이트'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
