import { useState, useEffect } from 'react';
import { LayoutDashboard, BookOpen, Terminal, GraduationCap, Menu, X, UserCheck, LogIn, LogOut, PanelLeftClose, PanelLeftOpen, Edit3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ProfileEditModal from './ProfileEditModal';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  solvedCount: number;
  totalCount: number;
  streak: number;
}

export default function Sidebar({
  currentView,
  onViewChange,
  solvedCount,
  totalCount,
  streak,
}: SidebarProps) {
  const progressPercent = Math.round((solvedCount / totalCount) * 100) || 0;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileEditModalOpen, setProfileEditModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('pyquests_sidebar_collapsed');
    return saved !== null ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('pyquests_sidebar_collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const { user, profile, setAuthModalOpen, signOut } = useAuth();

  const menuItems = [
    { id: 'dashboard', name: '대시보드', icon: LayoutDashboard },
    { id: 'problems', name: '문제 학습', icon: BookOpen },
    { id: 'sandbox', name: '샌드박스', icon: Terminal },
    { id: 'docs', name: '학습 가이드', icon: GraduationCap },
  ];

  return (
    <aside
      style={{
        width: isCollapsed ? '76px' : '250px',
        height: '100vh',
        padding: isCollapsed ? '2.5rem 0.75rem' : '2.5rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRight: '1px solid var(--border-subtle)',
        background: '#ffffff',
        flexShrink: 0,
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* === DESKTOP SIDEBAR === */}
      <div className="sidebar-desktop" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
        {/* Brand Title & Toggle */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'space-between',
              marginBottom: '3rem',
              paddingLeft: isCollapsed ? '0' : '0.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  background: '#1a1a1a',
                  width: '38px',
                  height: '38px',
                  borderRadius: '0px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>Py</span>
              </div>
              {!isCollapsed && (
                <div>
                  <h1
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: '700',
                      letterSpacing: '0.05em',
                      color: '#1a1a1a',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    PyQuests
                  </h1>
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', display: 'block', marginTop: '1px', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
                    Python · SQL · Java 코딩 마스터
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? '메인 메뉴 펼치기' : '메인 메뉴 접기'}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '0.35rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '0px',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#1a1a1a')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>
          </div>

          {/* Navigation Menu */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  title={isCollapsed ? item.name : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    gap: isCollapsed ? '0' : '1rem',
                    width: '100%',
                    padding: isCollapsed ? '0.85rem 0' : '0.85rem 1rem',
                    background: isActive ? '#1a1a1a' : 'transparent',
                    border: 'none',
                    borderRadius: '0px',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'var(--font-display)',
                    fontWeight: isActive ? '600' : '500',
                    fontSize: '0.85rem',
                    letterSpacing: '0.02em',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'var(--bg-dark)';
                      e.currentTarget.style.color = '#1a1a1a';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  <IconComponent
                    size={18}
                    style={{
                      color: isActive ? '#ffffff' : 'var(--text-secondary)',
                      transition: 'color 0.2s ease',
                      flexShrink: 0,
                    }}
                  />
                  {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.name}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Account & Progress Indicators */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* User Account Card */}
          <div
            style={{
              background: '#f4f4f6',
              border: '1px solid var(--border-subtle)',
              padding: isCollapsed ? '0.65rem 0.35rem' : '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: isCollapsed ? 'center' : 'stretch',
              gap: '0.5rem',
            }}
          >
            {user ? (
              <div style={{ textAlign: isCollapsed ? 'center' : 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', gap: '0.4rem', fontSize: '0.78rem', fontWeight: '700', color: '#1a1a1a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <UserCheck size={14} color="#0969da" style={{ flexShrink: 0 }} />
                    {!isCollapsed && <span>{profile?.display_name || user.email?.split('@')[0]}</span>}
                  </div>
                  {!isCollapsed && (
                    <button
                      onClick={() => setProfileEditModalOpen(true)}
                      title="닉네임 변경"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        padding: '2px 4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                        flexShrink: 0,
                      }}
                    >
                      <Edit3 size={13} />
                    </button>
                  )}
                </div>
                {!isCollapsed && (
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '0.1rem' }}>
                    {user.email}
                  </div>
                )}
                <button
                  onClick={() => signOut()}
                  title="로그아웃"
                  style={{
                    marginTop: '0.4rem',
                    background: 'transparent',
                    border: 'none',
                    color: '#cf222e',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    gap: '0.2rem',
                    padding: 0,
                    width: '100%',
                  }}
                >
                  <LogOut size={12} /> {!isCollapsed && '로그아웃'}
                </button>
              </div>
            ) : (
              <div style={{ textAlign: isCollapsed ? 'center' : 'left' }}>
                {!isCollapsed && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                    계정을 연결하고 클라우드 동기화를 켜세요.
                  </span>
                )}
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="btn-primary"
                  title="로그인 / 회원가입"
                  style={{
                    width: '100%',
                    padding: isCollapsed ? '0.5rem 0' : '0.45rem 0.75rem',
                    fontSize: '0.75rem',
                    justifyContent: 'center',
                  }}
                >
                  <LogIn size={14} /> {!isCollapsed && '로그인 / 회원가입'}
                </button>
              </div>
            )}
          </div>

          {streak > 0 && (
            <div
              title={`${streak}일 연속 달성 중!`}
              style={{
                background: '#fcfcfc',
                border: '1px solid var(--border-subtle)',
                borderRadius: '0px',
                padding: isCollapsed ? '0.5rem 0' : '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                gap: '0.75rem',
              }}
            >
              <div style={{ fontSize: '1.1rem' }}>🔥</div>
              {!isCollapsed && (
                <div>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      color: '#a66908',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      display: 'block',
                      letterSpacing: '0.02em',
                    }}
                  >
                    연속 해결 스트릭
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1a1a1a' }}>{streak}일 연속 달성 중!</span>
                </div>
              )}
            </div>
          )}

          {/* Global Progress Bar */}
          <div
            title={`학습 진척도: ${progressPercent}% (${solvedCount}/${totalCount})`}
            style={{
              background: '#fcfcfc',
              border: '1px solid var(--border-subtle)',
              borderRadius: '0px',
              padding: isCollapsed ? '0.75rem 0.35rem' : '1rem',
              textAlign: isCollapsed ? 'center' : 'left',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: isCollapsed ? 'center' : 'space-between',
                alignItems: 'center',
                marginBottom: '0.4rem',
                fontSize: '0.75rem',
              }}
            >
              {!isCollapsed && <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>학습 진척도</span>}
              <span style={{ color: '#1a1a1a', fontWeight: '700', fontSize: isCollapsed ? '0.75rem' : '0.75rem' }}>{progressPercent}%</span>
            </div>

            <div
              style={{
                height: '4px',
                width: '100%',
                backgroundColor: '#eaeaea',
                borderRadius: '0px',
                overflow: 'hidden',
                marginBottom: isCollapsed ? '0' : '0.5rem',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progressPercent}%`,
                  background: '#1a1a1a',
                  borderRadius: '0px',
                  transition: 'width 0.5s ease-out',
                }}
              ></div>
            </div>

            {!isCollapsed && (
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>
                총 {totalCount}개 중 {solvedCount}개 완료
              </span>
            )}
          </div>
        </div>
      </div>

      {/* === MOBILE BOTTOM TAB BAR (visible only on mobile via CSS) === */}
      <div className="sidebar-mobile">
        <nav
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '0.5rem 0',
            paddingBottom: 'env(safe-area-inset-bottom, 0.5rem)',
          }}
        >
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  setMobileMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.2rem',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.4rem 0.8rem',
                  color: isActive ? '#1a1a1a' : 'var(--text-muted)',
                  transition: 'color 0.2s ease',
                }}
              >
                <IconComponent size={20} />
                <span style={{ fontSize: '0.6rem', fontWeight: isActive ? '700' : '500', letterSpacing: '0.02em' }}>
                  {item.name}
                </span>
              </button>
            );
          })}
          {/* Hamburger for extra info */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.2rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.4rem 0.8rem',
              color: mobileMenuOpen ? '#1a1a1a' : 'var(--text-muted)',
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            <span style={{ fontSize: '0.6rem', fontWeight: '500' }}>더보기</span>
          </button>
        </nav>

        {/* Expandable Progress Panel */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: '1rem',
              borderTop: '1px solid var(--border-subtle)',
              background: '#fafafa',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            {streak > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                <span>🔥</span>
                <span style={{ fontWeight: '700', color: '#1a1a1a' }}>{streak}일 연속 달성 중!</span>
              </div>
            )}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>학습 진척도</span>
                <span style={{ fontWeight: '700' }}>{progressPercent}%</span>
              </div>
              <div style={{ height: '4px', background: '#eaeaea', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progressPercent}%`, background: '#1a1a1a', transition: 'width 0.5s' }}></div>
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                총 {totalCount}개 중 {solvedCount}개 완료
              </span>
            </div>
          </div>
        )}
      </div>

      <ProfileEditModal
        isOpen={profileEditModalOpen}
        onClose={() => setProfileEditModalOpen(false)}
      />
    </aside>
  );
}
