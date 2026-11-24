import { useEffect, useState } from 'react';
import { CheckCircle2, Download, Share, Smartphone, X } from 'lucide-react';
import {
  INSTALL_PROMPT_CHANGE_EVENT,
  OPEN_INSTALL_GUIDE_EVENT,
  canPromptInstall,
  detectInstallPlatform,
  isRunningAsApp,
  promptInstall,
} from '../utils/installApp';
import type { InstallPlatform } from '../utils/installApp';

const SITE_URL = 'pyquests.vercel.app';

const PLATFORMS: { id: InstallPlatform; label: string }[] = [
  { id: 'ios', label: '아이폰 · 아이패드' },
  { id: 'android', label: '안드로이드' },
  { id: 'desktop', label: 'PC (크롬 · 엣지)' },
];

// Words in 「」 are what the browser itself shows, so students can match
// them on screen.
const STEPS: Record<InstallPlatform, { steps: string[]; note?: string }> = {
  ios: {
    steps: [
      `Safari에서 ${SITE_URL} 을 열어요.`,
      '화면 아래쪽 가운데의 공유 버튼(네모에서 화살표가 위로 나온 모양)을 눌러요. 아이패드는 주소창 오른쪽 위에 있어요.',
      '메뉴를 아래로 내려 「홈 화면에 추가」를 눌러요. 안 보이면 맨 아래 「작업 편집」에서 추가할 수 있어요.',
      '오른쪽 위 「추가」를 누르면 홈 화면에 PyQuests 아이콘이 생겨요.',
    ],
    note: '카카오톡·네이버 앱 안에서 링크를 열었다면 오른쪽 위 메뉴에서 「Safari로 열기」를 먼저 눌러 주세요.',
  },
  android: {
    steps: [
      `크롬에서 ${SITE_URL} 을 열어요.`,
      '오른쪽 위 점 세 개(⋮) 메뉴를 눌러요.',
      '「앱 설치」 또는 「홈 화면에 추가」를 눌러요.',
      '「설치」를 누르면 홈 화면과 앱 목록에 PyQuests가 생겨요.',
    ],
    note: '삼성 인터넷은 아래쪽 메뉴(≡) → 「현재 페이지 추가」 → 「홈 화면」을 누르면 돼요.',
  },
  desktop: {
    steps: [
      `크롬이나 엣지에서 ${SITE_URL} 을 열어요.`,
      '주소창 오른쪽 끝에 있는 설치 아이콘(모니터에 화살표 모양)을 눌러요.',
      '「설치」를 누르면 바탕화면과 시작 메뉴에서 PyQuests를 따로 열 수 있어요.',
    ],
    note: '아이콘이 안 보이면 크롬은 ⋮ 메뉴 → 「전송, 저장, 공유」 → 「페이지를 앱으로 설치」, 엣지는 ··· 메뉴 → 「앱」 → 「이 사이트를 앱으로 설치」를 눌러요.',
  },
};

/** "앱으로 설치하기" guide. Opened from anywhere with openInstallGuide(). */
export default function InstallGuideModal() {
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState<InstallPlatform>(() => detectInstallPlatform());
  const [canPrompt, setCanPrompt] = useState(canPromptInstall);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onOpen = () => {
      setPlatform(detectInstallPlatform());
      setOpen(true);
    };
    const onPromptChange = () => setCanPrompt(canPromptInstall());
    window.addEventListener(OPEN_INSTALL_GUIDE_EVENT, onOpen);
    window.addEventListener(INSTALL_PROMPT_CHANGE_EVENT, onPromptChange);
    return () => {
      window.removeEventListener(OPEN_INSTALL_GUIDE_EVENT, onOpen);
      window.removeEventListener(INSTALL_PROMPT_CHANGE_EVENT, onPromptChange);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  const runningAsApp = isRunningAsApp();
  const { steps, note } = STEPS[platform];

  return (
    <div
      onClick={() => setOpen(false)}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-guide-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          border: '1px solid #1a1a1a',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90dvh',
          overflowY: 'auto',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.1rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ background: '#1a1a1a', color: '#ffffff', padding: '0.5rem', display: 'flex', flexShrink: 0 }}>
              <Smartphone size={20} />
            </div>
            <div>
              <h2 id="install-guide-title" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1a1a1a' }}>
                앱으로 설치하기
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                홈 화면 아이콘으로 바로 열리고, 주소창 없이 넓게 쓸 수 있어요.
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="닫기"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '0.25rem' }}
          >
            <X size={20} />
          </button>
        </div>

        {runningAsApp ? (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: '#eef8f0', border: '1px solid #b7e0c2', padding: '0.75rem 0.9rem', fontSize: '0.85rem', fontWeight: 700, color: '#1a7f37' }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            지금 앱으로 실행 중이에요. 이미 설치되어 있어요!
          </div>
        ) : installed ? (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: '#eef8f0', border: '1px solid #b7e0c2', padding: '0.75rem 0.9rem', fontSize: '0.85rem', fontWeight: 700, color: '#1a7f37' }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            설치했어요. 홈 화면이나 앱 목록에서 PyQuests를 열어 보세요.
          </div>
        ) : (
          canPrompt && (
            <button
              className="btn-primary"
              onClick={async () => setInstalled(await promptInstall())}
              style={{ justifyContent: 'center', width: '100%' }}
            >
              <Download size={16} />
              지금 바로 설치하기
            </button>
          )
        )}

        {/* Platform picker */}
        <div role="tablist" style={{ display: 'flex', flexWrap: 'wrap', background: '#f4f4f6', padding: '3px', border: '1px solid var(--border-subtle)' }}>
          {PLATFORMS.map((p) => {
            const active = p.id === platform;
            return (
              <button
                key={p.id}
                role="tab"
                aria-selected={active}
                onClick={() => setPlatform(p.id)}
                style={{
                  flex: '1 1 auto',
                  padding: '0.45rem 0.6rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  border: 'none',
                  cursor: 'pointer',
                  background: active ? '#1a1a1a' : 'transparent',
                  color: active ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {steps.map((step, i) => (
            <li key={i} style={{ display: 'flex', gap: '0.7rem', alignItems: 'flex-start' }}>
              <span
                style={{
                  flexShrink: 0,
                  width: '1.6rem',
                  height: '1.6rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#1a1a1a',
                  color: '#ffffff',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                }}
              >
                {i + 1}
              </span>
              <span style={{ fontSize: '0.86rem', color: '#1a1a1a', lineHeight: 1.6, paddingTop: '0.1rem' }}>
                {platform === 'ios' && i === 1 && <Share size={14} style={{ verticalAlign: '-2px', marginRight: '0.3rem', color: '#0969da' }} />}
                {step}
              </span>
            </li>
          ))}
        </ol>

        {note && (
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6, background: '#f7f7f8', padding: '0.7rem 0.85rem', borderLeft: '3px solid #d0d7de' }}>
            {note}
          </p>
        )}

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1a1a1a' }}>알아 두면 좋아요</div>
          <ul style={{ paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            <li>
              <b style={{ color: '#1a1a1a' }}>로그인해서 쓰세요.</b> 로그인하지 않으면 앱과 브라우저의 풀이 기록이 따로 저장돼요. 특히 아이폰은 둘이 완전히 나뉘어요.
            </li>
            <li>새 버전이 나오면 화면 위에 알림이 떠요. 「업데이트」를 누르면 다시 설치할 필요 없이 바로 바뀌어요.</li>
            <li>앱을 지우고 싶으면 홈 화면 아이콘을 길게 눌러 삭제하면 돼요. 로그인한 기록은 그대로 남아요.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
