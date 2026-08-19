import { useState } from 'react';
import { X, LogIn, UserPlus, Lock, Mail, User, AlertCircle, Database } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, signIn, signUp, signInWithGoogle, isConfigured } = useAuth();
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  if (!authModalOpen) return null;

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    const res = await signInWithGoogle();
    if (res.error) {
      setErrorMsg(res.error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (!displayName.trim()) {
          setErrorMsg('닉네임을 입력해 주세요.');
          setLoading(false);
          return;
        }
        const res = await signUp(email, password, displayName);
        if (res.error) {
          setErrorMsg(res.error.message);
        } else {
          setAuthModalOpen(false);
        }
      } else {
        const res = await signIn(email, password);
        if (res.error) {
          setErrorMsg(res.error.message === 'Invalid login credentials' ? '이메일 또는 비밀번호가 올바르지 않습니다.' : res.error.message);
        } else {
          setAuthModalOpen(false);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#ffffff',
          border: '1px solid #1a1a1a',
          padding: '2rem',
          position: 'relative',
          borderRadius: '0px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          style={{
            position: 'absolute',
            right: '1rem',
            top: '1rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Title */}
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              background: '#f4f4f6',
              border: '1px solid #1a1a1a',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem',
            }}
          >
            {isSignUp ? <UserPlus size={22} color="#1a1a1a" /> : <LogIn size={22} color="#1a1a1a" />}
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1a1a1a' }}>
            {isSignUp ? 'PyQuests 계정 생성' : 'PyQuests 로그인'}
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            클라우드 계정 연동으로 언제 어디서나 학습 진도와 스트릭이 안전하게 보존됩니다.
          </p>
        </div>

        {!isConfigured && (
          <div
            style={{
              background: '#fff8e6',
              border: '1px solid #a66908',
              padding: '0.85rem',
              fontSize: '0.75rem',
              color: '#a66908',
              marginBottom: '1rem',
              lineHeight: '1.5',
            }}
          >
            <div style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
              <Database size={14} /> 클라우드 DB 연결 안내
            </div>
            온라인 클라우드 DB 서버에 실시간 동기화하시려면 프로젝트 <code>.env</code> 또는 Vercel 환경변수에 API 접속 정보를 입력해 주세요. (미입력 시 오프라인 저장소 모드로 작동합니다)
          </div>
        )}

        {errorMsg && (
          <div
            style={{
              background: '#fff5f5',
              border: '1px solid #cf222e',
              padding: '0.75rem',
              fontSize: '0.78rem',
              color: '#cf222e',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <AlertCircle size={14} />
            {errorMsg}
          </div>
        )}

        {/* Google OAuth Login Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          style={{
            width: '100%',
            height: '42px',
            background: '#ffffff',
            border: '1px solid #1a1a1a',
            borderRadius: '0px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            fontSize: '0.82rem',
            fontWeight: '700',
            color: '#1a1a1a',
            cursor: 'pointer',
            marginBottom: '1rem',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#f4f4f6')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Google 계정으로 계속하기
        </button>

        <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0', gap: '0.75rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>또는 이메일로 계속</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isSignUp && (
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#1a1a1a', display: 'block', marginBottom: '0.3rem' }}>
                닉네임 (최대 5자)
              </label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#8c959f' }} />
                <input
                  type="text"
                  required
                  maxLength={5}
                  placeholder="사용하실 닉네임 입력 (최대 5자)..."
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', paddingLeft: '2.2rem', height: '38px', fontSize: '0.82rem' }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#1a1a1a', display: 'block', marginBottom: '0.3rem' }}>
              이메일 주소
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#8c959f' }} />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input"
                style={{ width: '100%', paddingLeft: '2.2rem', height: '38px', fontSize: '0.82rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#1a1a1a', display: 'block', marginBottom: '0.3rem' }}>
              비밀번호
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#8c959f' }} />
              <input
                type="password"
                required
                placeholder="6자리 이상 비밀번호..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input"
                style={{ width: '100%', paddingLeft: '2.2rem', height: '38px', fontSize: '0.82rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              height: '40px',
              justifyContent: 'center',
              marginTop: '0.5rem',
              fontSize: '0.85rem',
            }}
          >
            {loading ? '처리 중...' : isSignUp ? '회원가입 완료' : '로그인하기'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div style={{ marginTop: '1.25rem', textAlign: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg(null);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '0.78rem',
              color: '#1a1a1a',
              fontWeight: '700',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {isSignUp ? '이미 계정이 있으신가요? 로그인하기' : '계정이 없으신가요? 새로 회원가입하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
