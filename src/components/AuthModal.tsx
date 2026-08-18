import { useState } from 'react';
import { X, LogIn, UserPlus, Lock, Mail, User, AlertCircle, Database } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, signIn, signUp, isConfigured } = useAuth();
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  if (!authModalOpen) return null;

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
            Supabase 데이터베이스 연동으로 언제 어디서나 진도와 스크릭이 보존됩니다.
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
              <Database size={14} /> Supabase 키 미설정 안내
            </div>
            실제 Supabase 클라우드 DB에 연결하시려면 프로젝트의 <code>.env</code> 파일 또는 Vercel 환경변수에 <code>VITE_SUPABASE_URL</code>과 <code>VITE_SUPABASE_ANON_KEY</code>를 입력해 주세요. (미입력 시 오프라인 로컬 저장소 모드로 작동합니다)
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

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isSignUp && (
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#1a1a1a', display: 'block', marginBottom: '0.3rem' }}>
                닉네임
              </label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#8c959f' }} />
                <input
                  type="text"
                  required
                  placeholder="사용하실 닉네임 입력..."
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
