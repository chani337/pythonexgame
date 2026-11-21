import { useEffect, useMemo, useState } from 'react';
import { Gift, MessageCircle, Snowflake } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  challengeYear,
  currentDecemberRun,
  GIFT_BADGE_DAYS,
  isChallengeRunning,
  isSnowEnabled,
  isWinterDecorSeason,
  kstDate,
  longestDecemberRun,
  readSolveDays,
  setSnowEnabled,
  SNOW_CHANGE_EVENT,
  SOLVE_DAYS_CHANGE_EVENT,
  WINTER_BADGES,
} from '../utils/winterEvent';

const RED = '#c0262d';
const GREEN = '#1a6b3c';
const DAY_MS = 24 * 60 * 60 * 1000;

interface WinterChallengeCardProps {
  onNavigateToBoard?: () => void;
}

// Solve days from the server for `year`'s December (Korean time), so a
// streak follows the account across devices. The local log only knows this
// browser.
async function fetchServerDecemberDays(userId: string, year: number): Promise<string[]> {
  const { data, error } = await supabase
    .from('user_solved_problems')
    .select('solved_at')
    .eq('user_id', userId)
    .gte('solved_at', `${year}-11-30T15:00:00Z`)
    .lt('solved_at', `${year}-12-31T15:00:00Z`);
  if (error || !data) return [];
  return data
    .map((row: { solved_at: string | null }) => row.solved_at)
    .filter((t): t is string => Boolean(t))
    .map((t) => kstDate(new Date(t)));
}

/** Length of the run that starts on Dec 1 -- the 산타의 조수 badge needs 1–25 unbroken. */
function runFromDecemberFirst(days: string[], year: number): number {
  const set = new Set(days);
  let day = 1;
  while (day <= 31 && set.has(`${year}-12-${String(day).padStart(2, '0')}`)) day++;
  return day - 1;
}

export default function WinterChallengeCard({ onNavigateToBoard }: WinterChallengeCardProps) {
  const { user } = useAuth();
  const now = useMemo(() => new Date(), []);
  const year = challengeYear(now);
  const userId = user?.id;
  const accountKey = userId ?? 'guest';

  const [localDays, setLocalDays] = useState<string[]>(() => readSolveDays(accountKey));
  const [serverDays, setServerDays] = useState<string[]>([]);
  const [snowOn, setSnowOn] = useState(isSnowEnabled);

  useEffect(() => {
    const sync = () => setLocalDays(readSolveDays(accountKey));
    sync();
    window.addEventListener(SOLVE_DAYS_CHANGE_EVENT, sync);
    return () => window.removeEventListener(SOLVE_DAYS_CHANGE_EVENT, sync);
  }, [accountKey]);

  useEffect(() => {
    const sync = () => setSnowOn(isSnowEnabled());
    window.addEventListener(SNOW_CHANGE_EVENT, sync);
    return () => window.removeEventListener(SNOW_CHANGE_EVENT, sync);
  }, []);

  // Refetch when a new day is logged too, so today's cell fills in without a reload.
  useEffect(() => {
    if (!userId || year === null || !isSupabaseConfigured) {
      setServerDays([]);
      return;
    }
    let cancelled = false;
    const load = () => {
      fetchServerDecemberDays(userId, year).then((days) => {
        if (!cancelled) setServerDays(days);
      });
    };
    load();
    window.addEventListener(SOLVE_DAYS_CHANGE_EVENT, load);
    return () => {
      cancelled = true;
      window.removeEventListener(SOLVE_DAYS_CHANGE_EVENT, load);
    };
  }, [userId, year]);

  const days = useMemo(() => [...new Set([...localDays, ...serverDays])], [localDays, serverDays]);

  if (year === null) return null;

  const today = kstDate(now);
  const running = isChallengeRunning(now);
  const decorSeason = isWinterDecorSeason(now);
  const best = longestDecemberRun(days, year);
  const current = currentDecemberRun(days, now);
  const solvedToday = days.includes(today);
  const fromFirst = runFromDecemberFirst(days, year);

  let status: string;
  if (running) {
    status = `진행 중 · 12월 ${Number(today.slice(8))}일`;
  } else if (today < `${year}-12-01`) {
    const dDay = Math.round((Date.UTC(year, 11, 1) - Date.parse(`${today}T00:00:00Z`)) / DAY_MS);
    status = `12월 1일 시작 · D-${dDay}`;
  } else {
    status = '챌린지 종료';
  }

  const giftBadge = WINTER_BADGES.find((b) => b.days === GIFT_BADGE_DAYS);
  const giftEarned = best >= GIFT_BADGE_DAYS;
  const solvedSet = new Set(days);

  return (
    <div
      className="glass-card"
      style={{ borderRadius: '0px', borderTop: `4px solid ${RED}`, padding: 0, overflow: 'hidden' }}
    >
      {/* Header */}
      <div
        style={{
          padding: '1.75rem 2rem 1.5rem',
          background: 'linear-gradient(180deg, #fdf0f1 0%, #ffffff 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ flex: '1 1 320px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', color: '#ffffff', background: RED, padding: '0.2rem 0.5rem' }}>
              WINTER EVENT
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: RED }}>{status}</span>
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '0.5rem', textTransform: 'none' }}>
            🎄 12월 연속 학습 챌린지
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '560px' }}>
            12월 한 달 동안 하루도 빠짐없이 새 문제를 1개 이상 풀어 보세요. 연속 기록에 따라 겨울에만 받을 수 있는 한정 뱃지가 열려요.
          </p>
        </div>
        {decorSeason && (
          <button
            onClick={() => setSnowEnabled(!snowOn)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '0px',
              padding: '0.5rem 0.8rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#1a1a1a',
              cursor: 'pointer',
            }}
          >
            <Snowflake size={14} color={snowOn ? '#3b7cc4' : '#9a9a9a'} />
            {snowOn ? '눈 내리기 끄기' : '눈 내리기 켜기'}
          </button>
        )}
      </div>

      <div style={{ padding: '1.5rem 2rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Numbers */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2.5rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>지금 연속</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1a1a1a', lineHeight: 1 }}>
              {current}<span style={{ fontSize: '0.9rem', marginLeft: '0.2rem' }}>일</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>12월 최고 기록</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: RED, lineHeight: 1 }}>
              {best}<span style={{ fontSize: '0.9rem', marginLeft: '0.2rem' }}>일</span>
            </div>
          </div>
          {running && (
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: solvedToday ? GREEN : 'var(--text-secondary)', paddingBottom: '0.2rem' }}>
              {solvedToday ? '✓ 오늘 기록 완료!' : '오늘 아직 안 풀었어요. 1문제만 풀어도 이어져요.'}
            </div>
          )}
        </div>

        {/* December calendar */}
        <div className="winter-calendar">
          {Array.from({ length: 31 }, (_, i) => {
            const day = i + 1;
            const date = `${year}-12-${String(day).padStart(2, '0')}`;
            const solved = solvedSet.has(date);
            const christmas = day === 25;
            const classes = ['winter-calendar-day'];
            if (solved) classes.push('is-solved');
            else if (christmas) classes.push('is-christmas');
            if (date === today) classes.push('is-today');
            return (
              <div key={day} className={classes.join(' ')} title={`12월 ${day}일${solved ? ' · 해결' : ''}`}>
                {solved ? '❄' : christmas ? '🎄' : day}
              </div>
            );
          })}
        </div>

        {/* Badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {WINTER_BADGES.map((badge) => {
            const progress = badge.id === 'winter_santa' ? fromFirst : best;
            const earned = progress >= badge.days;
            const shown = Math.min(progress, badge.days);
            return (
              <div
                key={badge.id}
                style={{
                  border: `1px solid ${earned ? GREEN : 'var(--border-subtle)'}`,
                  background: earned ? '#eef7f1' : '#ffffff',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.6rem', filter: earned ? 'none' : 'grayscale(1)', opacity: earned ? 1 : 0.45 }}>{badge.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: earned ? GREEN : '#1a1a1a' }}>
                      {badge.name}{earned && ' · 달성!'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{badge.description}</div>
                  </div>
                </div>
                <div style={{ height: '6px', background: '#ececee' }}>
                  <div style={{ height: '100%', width: `${(shown / badge.days) * 100}%`, background: earned ? GREEN : RED }} />
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'right' }}>
                  {shown} / {badge.days}일
                </div>
              </div>
            );
          })}
        </div>

        {/* Gift notice */}
        <div
          style={{
            border: `2px dashed ${RED}`,
            background: giftEarned ? '#fffbe6' : '#ffffff',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start', flex: '1 1 320px' }}>
            <Gift size={22} color={RED} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '0.35rem' }}>
                {giftEarned ? '🎉 선물 받을 자격이 생겼어요!' : '🎁 달성하면 선물을 드려요'}
              </div>
              <p style={{ fontSize: '0.82rem', color: '#1a1a1a', lineHeight: 1.6 }}>
                12월에 {GIFT_BADGE_DAYS}일 연속으로 풀어 {giftBadge ? `${giftBadge.icon} ${giftBadge.name}` : '겨울'} 뱃지를 받으면, 이찬희 연구원 또는 고객센터에 과정명과 이름을 말씀해 주세요. 소정의 선물을 드려요!
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '0.35rem' }}>
                이 화면을 함께 보여 주시면 확인이 빨라요. 신청은 {year + 1}년 1월 15일까지 받아요.
                {!user && ' 로그인하지 않으면 기록이 이 브라우저에만 저장돼요.'}
              </p>
            </div>
          </div>
          {onNavigateToBoard && (
            <button
              onClick={onNavigateToBoard}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#1a1a1a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0px',
                padding: '0.65rem 1rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <MessageCircle size={15} />
              고객센터 가기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
