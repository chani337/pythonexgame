import { useEffect, useRef, useState } from 'react';
import { X, Flag, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useContest } from '../contexts/ContestContext';
import { supabase } from '../lib/supabase';
import { normalizeCode } from '../utils/contest';

// 대항전 참가: code → "이 반이 맞나요?" → 실명과 동의 → 완료. A teacher code
// goes through the same box and skips the name.

interface LookupResult {
  error?: 'not_found' | 'wait' | 'ended' | 'name' | 'other_class';
  kind?: 'student' | 'teacher';
  class_id?: string;
  class_name?: string;
  teacher_name?: string | null;
  contest_name?: string;
  starts_on?: string;
  ends_on?: string;
  joined_class_id?: string | null;
  joined_class_name?: string | null;
  ok?: boolean;
}

type Step = 'code' | 'confirm' | 'name' | 'done';

const ERRORS: Record<string, string> = {
  not_found: '코드를 다시 확인해 주세요.',
  wait: '코드를 여러 번 틀렸어요. 1분 뒤에 다시 시도해 주세요.',
  ended: '이번 대항전은 끝났어요. 홈에서 최종 결과를 볼 수 있어요.',
  name: '이름을 1~20자로 적어 주세요.',
  other_class: '이미 다른 반에 참가 중이에요.',
};

const shortDate = (d?: string) => (d ? `${Number(d.slice(5, 7))}/${Number(d.slice(8, 10))}` : '');

interface ContestJoinModalProps {
  /** After a teacher code: open 우리 반 현황. */
  onOpenClassView: () => void;
}

export default function ContestJoinModal({ onOpenClassView }: ContestJoinModalProps) {
  const { user, openAuthModal } = useAuth();
  const { joinOpen, joinCode, closeJoin, refresh } = useContest();
  const [step, setStep] = useState<Step>('code');
  const [code, setCode] = useState(joinCode);
  const [info, setInfo] = useState<LookupResult | null>(null);
  const [realName, setRealName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const autoLooked = useRef(false);

  useEffect(() => {
    if (!joinOpen) return;
    setStep('code');
    setCode(joinCode);
    setInfo(null);
    setError('');
    setAgreed(false);
    autoLooked.current = false;
  }, [joinOpen, joinCode]);

  const lookup = async (raw: string) => {
    const normalized = normalizeCode(raw);
    if (normalized.length !== 6) {
      setError('코드는 6자리예요.');
      return;
    }
    setBusy(true);
    setError('');
    const { data, error: rpcError } = await supabase.rpc('contest_lookup', { p_code: normalized });
    setBusy(false);
    const result = (data ?? {}) as LookupResult;
    if (rpcError || result.error) {
      setError(ERRORS[result.error ?? ''] ?? '잠시 후 다시 시도해 주세요.');
      return;
    }
    setCode(normalized);
    setInfo(result);
    setStep('confirm');
  };

  // A /join/<code> link fills the code in; look it up as soon as we can.
  useEffect(() => {
    if (joinOpen && user && joinCode && !autoLooked.current) {
      autoLooked.current = true;
      void lookup(joinCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joinOpen, user, joinCode]);

  const join = async () => {
    setBusy(true);
    setError('');
    const { data, error: rpcError } = await supabase.rpc('contest_join', {
      p_code: code,
      p_real_name: info?.kind === 'student' ? realName.trim() : null,
    });
    setBusy(false);
    const result = (data ?? {}) as LookupResult;
    if (rpcError || !result.ok) {
      setError(ERRORS[result.error ?? ''] ?? '참가하지 못했어요. 잠시 후 다시 시도해 주세요.');
      return;
    }
    refresh();
    setStep('done');
  };

  if (!joinOpen) return null;

  const otherClass = info?.joined_class_id && info.joined_class_id !== info.class_id;
  const sameClass = info?.joined_class_id && info.joined_class_id === info.class_id;
  const upcoming = info?.starts_on ? info.starts_on > new Date(Date.now() + 9 * 3600_000).toISOString().slice(0, 10) : false;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9998,
        padding: '1rem',
      }}
      onClick={closeJoin}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="대항전 참가"
        style={{
          backgroundColor: '#ffffff',
          padding: '1.75rem',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.2)',
          border: '1px solid #1a1a1a',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
            <Flag size={18} /> 과정 대항전 참가
          </h3>
          <button onClick={closeJoin} aria-label="닫기" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div role="alert" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.65rem 0.8rem', fontSize: '0.82rem', fontWeight: 600 }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} /> {error}
          </div>
        )}

        {!user ? (
          <>
            <p style={{ fontSize: '0.88rem', color: '#374151', lineHeight: 1.6, margin: 0 }}>
              대항전은 로그인한 회원만 참가할 수 있어요. 로그인하면 {code ? <b>코드 {normalizeCode(code)}</b> : '코드 입력'}로 이어서 참가해요.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => openAuthModal('login')}>로그인</button>
              <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => openAuthModal('signup')}>회원가입</button>
            </div>
          </>
        ) : step === 'code' ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void lookup(code);
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1a1a1a' }} htmlFor="contest-code">
              선생님께 받은 6자리 코드
            </label>
            <input
              id="contest-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoFocus
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              maxLength={9}
              placeholder="예: PY7K2A"
              style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '0.3em', textAlign: 'center', fontFamily: 'var(--font-mono)', padding: '0.6rem', border: '1px solid #1a1a1a', textTransform: 'uppercase' }}
            />
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>대소문자와 띄어쓰기는 상관없어요.</span>
            <button type="submit" className="btn-primary" disabled={busy} style={{ justifyContent: 'center' }}>
              {busy ? '확인하는 중…' : '확인'}
            </button>
          </form>
        ) : step === 'confirm' && info ? (
          <>
            <div style={{ border: '1px solid var(--border-subtle)', background: '#f9fafb', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{info.contest_name} · {shortDate(info.starts_on)} ~ {shortDate(info.ends_on)}</span>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1a1a1a' }}>
                {info.kind === 'teacher' ? `${info.class_name} 담임으로 등록할까요?` : `${info.class_name}에 참가할까요?`}
              </span>
              {info.teacher_name && info.kind === 'student' && <span style={{ fontSize: '0.82rem', color: '#374151' }}>담임: {info.teacher_name}</span>}
            </div>
            {info.kind === 'teacher' ? (
              <>
                <p style={{ fontSize: '0.82rem', color: '#374151', margin: 0, lineHeight: 1.6 }}>
                  등록하면 메뉴에 <b>우리 반 현황</b>이 생겨요. 담임 코드는 학생에게 공유하지 마세요.
                </p>
                <button className="btn-primary" disabled={busy} style={{ justifyContent: 'center' }} onClick={join}>담임으로 등록</button>
              </>
            ) : otherClass ? (
              <p style={{ fontSize: '0.85rem', color: '#b91c1c', fontWeight: 600, margin: 0, lineHeight: 1.6 }}>
                이미 {info.joined_class_name}에 참가 중이에요. 반을 바꾸려면 담임 선생님께 말씀해 주세요.
              </p>
            ) : (
              <>
                {sameClass && <p style={{ fontSize: '0.82rem', color: '#1a7f37', fontWeight: 600, margin: 0 }}>이미 이 반에 참가 중이에요. 이름만 고칠 수 있어요.</p>}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { setStep('code'); setInfo(null); }}>다른 코드</button>
                  <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep('name')}>네, 맞아요</button>
                </div>
              </>
            )}
          </>
        ) : step === 'name' && info ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (agreed && realName.trim()) void join();
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1a1a1a' }} htmlFor="contest-name">실명</label>
            <input
              id="contest-name"
              value={realName}
              onChange={(e) => setRealName(e.target.value)}
              autoFocus
              maxLength={20}
              placeholder="예: 김민수"
              style={{ fontSize: '1rem', padding: '0.6rem 0.75rem', border: '1px solid #1a1a1a' }}
            />
            <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.8rem', color: '#374151', lineHeight: 1.55, cursor: 'pointer' }}>
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ marginTop: '0.2rem' }} />
              <span>
                이름은 <b>우리 반 담임 선생님과 관리자만</b> 볼 수 있어요. 다른 학생과 상대 반에는 보이지 않고, 랭킹과 현황판에는 지금 닉네임이 그대로 나와요. 동의해요.
              </span>
            </label>
            <button type="submit" className="btn-primary" disabled={busy || !agreed || !realName.trim()} style={{ justifyContent: 'center' }}>
              {busy ? '참가하는 중…' : '참가하기'}
            </button>
          </form>
        ) : step === 'done' && info ? (
          <>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.4rem', padding: '0.5rem 0' }}>
              <span style={{ fontSize: '2rem' }}>{info.kind === 'teacher' ? '📋' : '🏁'}</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1a1a1a' }}>
                {info.kind === 'teacher' ? `${info.class_name} 담임으로 등록했어요` : `${info.class_name}으로 참가했어요!`}
              </span>
              {info.kind === 'student' && (
                <span style={{ fontSize: '0.85rem', color: '#374151' }}>
                  {upcoming ? `${shortDate(info.starts_on)}부터 새로 푼 문제가 반 점수에 들어가요.` : '지금부터 새로 푼 문제가 반 점수에 들어가요.'}
                </span>
              )}
            </div>
            {info.kind === 'student' && (
              <p style={{ fontSize: '0.78rem', color: '#92400e', background: '#fffbeb', border: '1px solid #f59e0b', padding: '0.6rem 0.75rem', margin: 0, lineHeight: 1.55 }}>
                정답 코드를 본 문제, 객관식을 여러 번 골라 맞힌 문제는 반 점수에 들어가지 않아요. 틀린 뒤 스스로 고쳐서 맞히면 들어가요.
              </p>
            )}
            <button
              className="btn-primary"
              style={{ justifyContent: 'center' }}
              onClick={() => {
                closeJoin();
                if (info.kind === 'teacher') onOpenClassView();
              }}
            >
              {info.kind === 'teacher' ? '우리 반 현황 열기' : '확인'}
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
