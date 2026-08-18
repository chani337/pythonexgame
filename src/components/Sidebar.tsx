import { useState } from 'react';
import { LayoutDashboard, BookOpen, Terminal, GraduationCap, Menu, X, UserCheck, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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
        width: 'var(--sidebar-width)',
        height: '100vh',
        padding: '2.5rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRight: '1px solid var(--border-subtle)',
        background: '#ffffff',
        flexShrink: 0,
      }}
    >
      {/* === DESKTOP SIDEBAR === */}
      <div className="sidebar-desktop">
        {/* Brand Title */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '3.5rem',
              paddingLeft: '0.25rem',
            }}
          >
            <div
              style={{
                background: '#1a1a1a',
                width: '38px',
                height: '38px',
                borderRadius: '0px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>Py</span>
            </div>
            <div>
              <h1
                style={{
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  letterSpacing: '0.05em',
                  color: '#1a1a1a',
                }}
              >
                PyQuests
              </h1>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'block', marginTop: '1px', letterSpacing: '0.02em' }}>
                파이썬 코딩 마스터
              </span>
            </div>
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
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    width: '100%',
                    padding: '0.85rem 1rem',
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
                    size={16}
                    style={{
                      color: isActive ? '#ffffff' : 'var(--text-secondary)',
                      transition: 'color 0.2s ease',
                    }}
                  />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Account & Progress Indicators */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* User Account Card */}
          <div
            style={{
              background: '#f4f4f6',
              border: '1px solid var(--border-subtle)',
              padding: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            {user ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: '700', color: '#1a1a1a' }}>
                  <UserCheck size={14} color="#0969da" />
                  <span>{profile?.display_name || user.email?.split('@')[0]}</span>
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '0.1rem' }}>
                  {user.email}
                </div>
                <button
                  onClick={() => signOut()}
                  style={{
                    marginTop: '0.5rem',
                    background: 'transparent',
                    border: 'none',
                    color: '#cf222e',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    padding: 0,
                  }}
                >
                  <LogOut size={12} /> 로그아웃
                </button>
              </div>
            ) : (
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                  계정을 연결하고 클라우드 동기화를 켜세요.
                </span>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.75rem',
                    fontSize: '0.75rem',
                    justifyContent: 'center',
                  }}
                >
                  <LogIn size={13} /> 로그인 / 회원가입
                </button>
              </div>
            )}
          </div>

          {streak > 0 && (
            <div
              style={{
                background: '#fcfcfc',
                border: '1px solid var(--border-subtle)',
                borderRadius: '0px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <div style={{ fontSize: '1.2rem' }}>🔥</div>
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
                  연속 문제 해결 스트릭
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1a1a1a' }}>{streak}일 연속 달성 중!</span>
              </div>
            </div>
          )}

          {/* Global Progress Bar */}
          <div
            style={{
              background: '#fcfcfc',
              border: '1px solid var(--border-subtle)',
              borderRadius: '0px',
              padding: '1rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem',
                fontSize: '0.75rem',
              }}
            >
              <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>학습 진척도</span>
              <span style={{ color: '#1a1a1a', fontWeight: '700' }}>{progressPercent}%</span>
            </div>

            <div
              style={{
                height: '4px',
                width: '100%',
                backgroundColor: '#eaeaea',
                borderRadius: '0px',
                overflow: 'hidden',
                marginBottom: '0.5rem',
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

            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>
              총 {totalCount}개 중 {solvedCount}개 완료
            </span>
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
    </aside>
  );
}
