import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { ClipboardList, Download, Maximize2, RefreshCw, Trash2, Pencil, X, Plus, Copy, Check } from 'lucide-react';
import qrcode from 'qrcode-generator';
import { useAuth } from '../contexts/AuthContext';
import { useContest } from '../contexts/ContestContext';
import { supabase } from '../lib/supabase';
import { problems, problemTrack } from '../data/problems';
import {
  addDays,
  displayNames,
  joinLink,
  relativeDay,
  rosterCsv,
  studentStats,
} from '../utils/contest';
import type { Roster, RosterStudent, StudentStats } from '../utils/contest';
import { kstDate } from '../utils/winterEvent';

// 우리 반 현황 (teachers) and 대회 관리 (the admin). Everything here comes from
// SECURITY DEFINER functions that check the caller -- hiding the menu is a
// convenience, not the protection.

const PROBLEM_BY_ID = new Map(problems.map((p) => [p.id, p]));
const shortDate = (d: string) => `${Number(d.slice(5, 7))}/${Number(d.slice(8, 10))}`;

interface AdminClass {
  id: string;
  name: string;
  teacher_name: string | null;
  capacity: number | null;
  student_code: string;
  teacher_code: string;
  participants: number;
  teachers: number;
}

interface AdminContest {
  id: string;
  name: string;
  starts_on: string;
  ends_on: string;
  languages: string[];
  difficulties: string[];
  classes: AdminClass[];
}

export default function ContestManage() {
  const { user, profile } = useAuth();
  const { board, refresh: refreshBoard } = useContest();
  const isAdmin = profile?.is_admin === true;
  const [adminContests, setAdminContests] = useState<AdminContest[]>([]);
  const [classId, setClassId] = useState<string | null>(null);

  const loadAdmin = useCallback(() => {
    if (!isAdmin) return;
    supabase.rpc('contest_admin_list').then(({ data }) => setAdminContests((data as AdminContest[] | null) ?? []));
  }, [isAdmin]);
  useEffect(loadAdmin, [loadAdmin]);

  // Classes this account can open: its own as a teacher, every class of
  // the shown contest for the admin.
  const classOptions = useMemo(() => {
    if (!board) return [];
    const mine = new Set(board.mine?.teacher_class_ids ?? []);
    return board.classes.filter((c) => isAdmin || mine.has(c.id));
  }, [board, isAdmin]);

  useEffect(() => {
    if (!classId && classOptions.length > 0) setClassId(classOptions[0].id);
  }, [classOptions, classId]);

  if (!user) {
    return <Empty text="로그인한 담임 선생님만 볼 수 있어요." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, minWidth: 0 }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#1a1a1a' }}>
        <ClipboardList size={22} /> {isAdmin ? '대회 관리' : '우리 반 현황'}
      </h2>

      {isAdmin && (
        <AdminPanel
          contests={adminContests}
          onChanged={() => {
            loadAdmin();
            refreshBoard();
          }}
        />
      )}

      {classOptions.length === 0 ? (
        !isAdmin && <Empty text="담임 코드를 넣으면 이곳에서 우리 반 학생들의 풀이 현황을 볼 수 있어요. 홈의 대항전 카드에서 「대항전 참가하기」를 눌러 담임 코드를 넣어 주세요." />
      ) : (
        <>
          {classOptions.length > 1 && (
            <div role="tablist" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {classOptions.map((c) => (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={classId === c.id}
                  onClick={() => setClassId(c.id)}
                  className={classId === c.id ? 'btn-primary' : 'btn-secondary'}
                  style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
          {classId && <RosterPanel key={classId} classId={classId} scope={board?.contest} onChanged={refreshBoard} />}
        </>
      )}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
      {text}
    </div>
  );
}

// ---- the roster ---------------------------------------------------------------

type Filter = 'all' | 'not_today' | 'quiet' | 'flag';
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'not_today', label: '오늘 안 푼 학생' },
  { id: 'quiet', label: '3일 이상 안 푼 학생' },
  { id: 'flag', label: '확인 필요' },
];

const STATUS_COLOR: Record<string, string> = { 활발: '#1a7f37', '쉬는 중': '#6b7280', '독려 필요': '#cf222e', '확인 필요': '#b45309' };

function RosterPanel({ classId, scope, onChanged }: { classId: string; scope?: { languages: string[]; difficulties: string[] }; onChanged: () => void }) {
  const [roster, setRoster] = useState<Roster | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [view, setView] = useState<'students' | 'problems'>('students');
  const [openId, setOpenId] = useState<string | null>(null);
  const [codeScreen, setCodeScreen] = useState(false);
  const [editing, setEditing] = useState(false);

  const load = useCallback(() => {
    supabase.rpc('contest_roster', { p_class_id: classId }).then(({ data, error: e }) => {
      if (e) setError('현황을 불러오지 못했어요. 담임 코드가 바뀌었다면 새 코드로 다시 등록해 주세요.');
      else setRoster(data as Roster);
    });
  }, [classId]);
  useEffect(load, [load]);

  const names = useMemo(() => (roster ? displayNames(roster.students) : new Map<string, string>()), [roster]);
  const rows = useMemo(
    () => (roster ? roster.students.map((s) => ({ s, st: studentStats(s.solves, roster.contest) })) : []),
    [roster]
  );

  if (error) return <Empty text={error} />;
  if (!roster) return <Empty text="불러오는 중…" />;

  const { contest } = roster;
  const capacity = roster.class.capacity;
  const missing = capacity ? Math.max(capacity - roster.students.length, 0) : null;
  const shown = rows.filter(({ st }) =>
    filter === 'all' ? true : filter === 'not_today' ? st.today === 0 : filter === 'quiet' ? st.status === '독려 필요' : st.burst
  );

  const exportCsv = () => {
    const blob = new Blob([rosterCsv(roster)], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${roster.class.name}_현황_${kstDate()}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <section className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>{roster.class.name}</h3>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {contest.name} · {shortDate(contest.starts_on)} ~ {shortDate(contest.ends_on)} · 참가 {roster.students.length}명
            {capacity ? ` / 정원 ${capacity}명` : ''}
            {missing ? <b style={{ color: '#cf222e' }}> · 미참가 {missing}명</b> : ''}
          </p>
          {!capacity && <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#b45309' }}>수강 정원을 넣어 주세요. 정원으로 나눠야 안 들어온 학생까지 평균에 들어가요.</p>}
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button className="btn-primary" style={{ padding: '0.45rem 0.8rem', fontSize: '0.78rem' }} onClick={() => setCodeScreen(true)}>
            <Maximize2 size={14} /> 코드 안내 화면
          </button>
          <button className="btn-secondary" style={{ padding: '0.45rem 0.8rem', fontSize: '0.78rem' }} onClick={() => setEditing((e) => !e)}>
            <Pencil size={14} /> 정원 · 응원
          </button>
          <button className="btn-secondary" style={{ padding: '0.45rem 0.8rem', fontSize: '0.78rem' }} onClick={exportCsv}>
            <Download size={14} /> CSV
          </button>
          <button className="btn-secondary" style={{ padding: '0.45rem 0.6rem', fontSize: '0.78rem' }} onClick={load} aria-label="새로고침" title="새로고침">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {editing && (
        <ClassSettings
          classId={classId}
          capacity={capacity}
          cheer={roster.class.cheer}
          onSaved={() => {
            setEditing(false);
            load();
            onChanged();
          }}
        />
      )}

      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <button className={view === 'students' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }} onClick={() => setView('students')}>학생별</button>
        <button className={view === 'problems' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }} onClick={() => setView('problems')}>문제별</button>
        {view === 'students' && (
          <span style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginLeft: '0.5rem' }}>
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
                style={{ border: '1px solid var(--border-subtle)', background: filter === f.id ? '#1a1a1a' : '#ffffff', color: filter === f.id ? '#ffffff' : '#1a1a1a', padding: '0.3rem 0.6rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
              >
                {f.label}
              </button>
            ))}
          </span>
        )}
      </div>

      {view === 'students' ? (
        <div style={{ overflowX: 'auto' }}>
          <table className="contest-table roster-table">
            <thead>
              <tr>
                <th>이름</th>
                <th>오늘</th>
                <th>이번 라운드</th>
                <th>대회 누적</th>
                <th>연속</th>
                <th>마지막 풀이</th>
                <th>상태</th>
                <th title="대회 기간에 정답 코드를 열어 본 문제 수">정답 봄</th>
              </tr>
            </thead>
            <tbody>
              {shown.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    {roster.students.length === 0 ? '아직 참가한 학생이 없어요. 코드 안내 화면을 띄워 주세요.' : '해당하는 학생이 없어요.'}
                  </td>
                </tr>
              )}
              {shown.map(({ s, st }) => (
                <Fragment key={s.user_id}>
                  <tr>
                    <td>
                      <button onClick={() => setOpenId(openId === s.user_id ? null : s.user_id)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontWeight: 700, color: '#0969da', textAlign: 'left' }}>
                        {names.get(s.user_id)}
                      </button>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{s.display_name}</div>
                    </td>
                    <td>{st.today}</td>
                    <td>{st.round}</td>
                    <td><b>{st.total}</b></td>
                    <td>{st.streak}일</td>
                    <td>{relativeDay(st.lastAt, contest.today)}</td>
                    <td><span style={{ color: STATUS_COLOR[st.status], fontWeight: 700 }}>{st.status}</span></td>
                    <td>{s.answer_views}</td>
                  </tr>
                  {openId === s.user_id && (
                    <tr>
                      <td colSpan={8} style={{ background: '#f9fafb' }}>
                        <StudentDetail classId={classId} student={s} stats={st} name={names.get(s.user_id) ?? s.real_name} onChanged={() => { load(); onChanged(); }} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <ProblemMatrix roster={roster} names={names} scope={scope} />
      )}

      <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        반 점수에 들어간 풀이만 셉니다. 「정답 봄」은 벌점이 아니라 누가 어디서 막히는지 보는 용도예요. 「확인 필요」는 1분 안에 10문제 이상 푼 기록이 있는 학생이고, 자동으로 빼지는 않아요.
      </p>

      {codeScreen && <CodeScreen className={roster.class.name} code={roster.class.student_code} onClose={() => setCodeScreen(false)} />}
    </section>
  );
}

function ClassSettings({ classId, capacity, cheer, onSaved }: { classId: string; capacity: number | null; cheer: string | null; onSaved: () => void }) {
  const [cap, setCap] = useState(capacity ? String(capacity) : '');
  const [text, setText] = useState(cheer ?? '');
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    const n = parseInt(cap, 10);
    const { error } = await supabase.rpc('contest_update_class', {
      p_class_id: classId,
      p_capacity: Number.isFinite(n) && n > 0 ? n : null,
      p_cheer: text,
    });
    setBusy(false);
    if (error) window.alert('저장하지 못했어요. 정원은 1~500, 응원은 60자까지예요.');
    else onSaved();
  };
  return (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end', padding: '0.75rem', background: '#f9fafb', border: '1px solid var(--border-subtle)' }}>
      <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 700 }}>
        수강 정원
        <input type="number" min={1} max={500} value={cap} onChange={(e) => setCap(e.target.value)} style={{ width: '6rem', padding: '0.4rem', border: '1px solid #1a1a1a' }} />
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 700, flex: 1, minWidth: '200px' }}>
        홈에 보일 응원 한마디 (60자)
        <input value={text} maxLength={60} onChange={(e) => setText(e.target.value)} placeholder="예: 1반 끝까지 가 보자!" style={{ padding: '0.4rem', border: '1px solid #1a1a1a' }} />
      </label>
      <button className="btn-primary" disabled={busy} onClick={save} style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}>저장</button>
    </div>
  );
}

function StudentDetail({ classId, student, stats, name, onChanged }: { classId: string; student: RosterStudent; stats: StudentStats; name: string; onChanged: () => void }) {
  const rename = async () => {
    const next = window.prompt('바꿀 이름 (1~20자)', student.real_name)?.trim();
    if (!next || next === student.real_name) return;
    const { error } = await supabase.rpc('contest_rename_participant', { p_class_id: classId, p_user_id: student.user_id, p_real_name: next });
    if (error) window.alert('이름을 바꾸지 못했어요.');
    else onChanged();
  };
  const remove = async () => {
    if (!window.confirm(`${name} 학생을 이 반에서 뺄까요? 학생의 풀이 기록은 지워지지 않고, 반 점수에서만 빠져요. 학생은 다시 코드를 넣어 다른 반에 들어갈 수 있어요.`)) return;
    const { error } = await supabase.rpc('contest_remove_participant', { p_class_id: classId, p_user_id: student.user_id });
    if (error) window.alert('빼지 못했어요.');
    else onChanged();
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: '0.25rem' }}>
      <div style={{ fontSize: '0.78rem', color: '#374151' }}>
        닉네임 {student.display_name} · {shortDate(kstDate(new Date(student.joined_at)))} 참가 · 오답노트 {student.review_count}문제 · 대회 기간 정답 본 문제 {student.answer_views}개
        {stats.burst && <b style={{ color: '#b45309' }}> · 1분 안에 10문제 이상 푼 기록이 있어요</b>}
      </div>
      {student.solves.length === 0 ? (
        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>대회 기간에 반 점수에 들어간 문제가 아직 없어요.</span>
      ) : (
        <ol style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.78rem', columns: '2 260px', columnGap: '1.5rem' }}>
          {[...student.solves].reverse().map((s) => (
            <li key={s.problem_id} style={{ breakInside: 'avoid' }}>
              {PROBLEM_BY_ID.get(s.problem_id)?.title ?? s.problem_id}{' '}
              <span style={{ color: 'var(--text-secondary)' }}>{shortDate(kstDate(new Date(s.solved_at)))}</span>
            </li>
          ))}
        </ol>
      )}
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        <button className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem' }} onClick={rename}><Pencil size={12} /> 이름 고치기</button>
        <button className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem', color: '#cf222e', borderColor: '#cf222e' }} onClick={remove}><Trash2 size={12} /> 반에서 빼기</button>
      </div>
    </div>
  );
}

// Problems × students, solved cells green. Sorted by how many solved, fewest
// first among those someone has solved, so the ones the class is stuck on
// come to the top.
function ProblemMatrix({ roster, names, scope }: { roster: Roster; names: Map<string, string>; scope?: { languages: string[]; difficulties: string[] } }) {
  const [onlyStarted, setOnlyStarted] = useState(true);
  const solvedBy = useMemo(() => {
    const m = new Map<string, Set<string>>();
    roster.students.forEach((s) => s.solves.forEach((x) => {
      if (!m.has(x.problem_id)) m.set(x.problem_id, new Set());
      m.get(x.problem_id)!.add(s.user_id);
    }));
    return m;
  }, [roster]);

  const inScope = problems.filter(
    (p) => !scope || (scope.languages.includes(problemTrack(p)) && scope.difficulties.includes(p.difficulty))
  );
  const list = (onlyStarted ? inScope.filter((p) => solvedBy.has(p.id)) : inScope)
    .map((p) => ({ p, n: solvedBy.get(p.id)?.size ?? 0 }))
    .sort((a, b) => (onlyStarted ? a.n - b.n : 0));
  const students = roster.students;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{ fontSize: '0.75rem', display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
        <input type="checkbox" checked={onlyStarted} onChange={(e) => setOnlyStarted(e.target.checked)} />
        한 명이라도 푼 문제만 (적게 푼 순)
      </label>
      {list.length === 0 ? (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>아직 푼 문제가 없어요.</span>
      ) : (
        <div style={{ overflow: 'auto', maxHeight: '60vh' }}>
          <table className="contest-table matrix-table">
            <thead>
              <tr>
                <th style={{ minWidth: '200px' }}>문제</th>
                <th>푼 학생</th>
                {students.map((s) => (
                  <th key={s.user_id} className="matrix-name" title={names.get(s.user_id)}>{names.get(s.user_id)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map(({ p, n }) => (
                <tr key={p.id}>
                  <td style={{ fontSize: '0.75rem' }}>{p.title}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{n}/{students.length}</td>
                  {students.map((s) => {
                    const done = solvedBy.get(p.id)?.has(s.user_id);
                    return <td key={s.user_id} aria-label={done ? '풀었음' : '안 풀었음'} style={{ background: done ? '#2da44e' : '#ffffff', minWidth: '22px' }} />;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Full screen for the projector: the code huge, a QR to the join link.
function CodeScreen({ className, code, onClose }: { className: string; code: string; onClose: () => void }) {
  const link = joinLink(code);
  const svg = useMemo(() => {
    const qr = qrcode(0, 'M');
    qr.addData(link);
    qr.make();
    return qr.createSvgTag({ cellSize: 8, margin: 2, scalable: true });
  }, [link]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="code-screen" role="dialog" aria-modal="true" aria-label="참가 코드 안내" style={{ position: 'fixed', inset: 0, background: '#ffffff', zIndex: 10000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', padding: '2rem', textAlign: 'center' }}>
      <button onClick={onClose} aria-label="닫기" style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: '1px solid #1a1a1a', padding: '0.5rem', cursor: 'pointer', display: 'flex' }}>
        <X size={22} />
      </button>
      <div style={{ fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 800 }}>🏁 {className} 과정 대항전 참가</div>
      <div style={{ display: 'flex', gap: 'clamp(1.5rem, 5vw, 4rem)', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ width: 'min(42vh, 70vw)', height: 'min(42vh, 70vw)' }} dangerouslySetInnerHTML={{ __html: svg }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '1rem', color: '#6b7280' }}>참가 코드</span>
          <span style={{ fontSize: 'clamp(3rem, 11vw, 8rem)', fontWeight: 900, letterSpacing: '0.12em', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>{code}</span>
          <span style={{ fontSize: 'clamp(0.9rem, 2vw, 1.2rem)', color: '#374151', fontFamily: 'var(--font-mono)' }}>{link.replace(/^https?:\/\//, '')}</span>
          <button
            className="btn-secondary"
            onClick={() => {
              navigator.clipboard?.writeText(link).then(() => setCopied(true), () => undefined);
            }}
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? '링크 복사됨' : '단톡방용 링크 복사'}
          </button>
        </div>
      </div>
      <p style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.15rem)', color: '#374151', maxWidth: '760px', lineHeight: 1.7, margin: 0 }}>
        로그인 → 코드 입력 → 실명 입력. 정답 코드를 본 문제와 객관식을 여러 번 골라 맞힌 문제는 반 점수에 들어가지 않아요.
      </p>
    </div>
  );
}

// ---- admin ----------------------------------------------------------------------

const LANG_OPTIONS: { id: string; label: string }[] = [
  { id: 'python', label: 'Python' },
  { id: 'pylib', label: 'Python Lib' },
  { id: 'sql', label: 'SQL' },
  { id: 'algorithm', label: '알고리즘' },
  { id: 'js', label: 'JS' },
  { id: 'java', label: 'Java' },
  { id: 'c', label: 'C' },
  { id: 'html', label: 'HTML' },
  { id: 'css', label: 'CSS' },
];
const DIFF_OPTIONS = [
  { id: 'basic', label: '기초' },
  { id: 'intermediate', label: '중급' },
  { id: 'advanced', label: '고급' },
  { id: 'expert', label: '챌린지' },
];

function AdminPanel({ contests, onChanged }: { contests: AdminContest[]; onChanged: () => void }) {
  const [creating, setCreating] = useState(false);
  return (
    <section className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>대회 목록 (관리자)</h3>
        <button className="btn-primary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }} onClick={() => setCreating((c) => !c)}>
          <Plus size={14} /> 새 대회
        </button>
      </div>
      {creating && <CreateContest onCreated={() => { setCreating(false); onChanged(); }} />}
      {contests.length === 0 && !creating && <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>아직 만든 대회가 없어요.</span>}
      {contests.map((c) => <AdminContestRow key={c.id} contest={c} onChanged={onChanged} />)}
    </section>
  );
}

function CreateContest({ onCreated }: { onCreated: () => void }) {
  const today = kstDate();
  const [name, setName] = useState('PyQuests 과정 대항전');
  const [starts, setStarts] = useState(today);
  const [ends, setEnds] = useState(addDays(today, 27));
  const [classes, setClasses] = useState([
    { name: '파이썬 기초 1반', teacher_name: '', capacity: '' },
    { name: '파이썬 기초 2반', teacher_name: '', capacity: '' },
  ]);
  const [langs, setLangs] = useState(['python']);
  const [diffs, setDiffs] = useState(['basic', 'intermediate']);
  const [busy, setBusy] = useState(false);
  const toggle = (list: string[], set: (v: string[]) => void, id: string) => set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  const create = async () => {
    if (ends < starts) return window.alert('끝나는 날이 시작일보다 빠를 수 없어요.');
    if (classes.some((c) => !c.name.trim())) return window.alert('반 이름을 모두 적어 주세요.');
    if (!langs.length || !diffs.length) return window.alert('문제 범위를 하나 이상 골라 주세요.');
    setBusy(true);
    const { error } = await supabase.rpc('contest_create', {
      p_name: name,
      p_starts_on: starts,
      p_ends_on: ends,
      p_classes: classes.map((c) => ({ name: c.name, teacher_name: c.teacher_name, capacity: c.capacity })),
      p_languages: langs,
      p_difficulties: diffs,
    });
    setBusy(false);
    if (error) window.alert(`만들지 못했어요: ${error.message}`);
    else onCreated();
  };

  const input = { padding: '0.4rem 0.5rem', border: '1px solid #1a1a1a', fontSize: '0.82rem' } as const;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', border: '1px solid #1a1a1a', background: '#f9fafb' }}>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <label className="admin-field" style={{ flex: 2, minWidth: '200px' }}>대회 이름<input style={input} value={name} maxLength={40} onChange={(e) => setName(e.target.value)} /></label>
        <label className="admin-field">시작일<input style={input} type="date" value={starts} onChange={(e) => setStarts(e.target.value)} /></label>
        <label className="admin-field">마지막 날<input style={input} type="date" value={ends} onChange={(e) => setEnds(e.target.value)} /></label>
      </div>
      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>기획안 기본값은 4주(28일)예요. 7일이 한 라운드예요.</span>
      {classes.map((c, i) => (
        <div key={i} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <label className="admin-field" style={{ flex: 2, minWidth: '160px' }}>반 이름<input style={input} value={c.name} maxLength={30} onChange={(e) => setClasses(classes.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} /></label>
          <label className="admin-field" style={{ flex: 1, minWidth: '110px' }}>담임 이름<input style={input} value={c.teacher_name} maxLength={20} onChange={(e) => setClasses(classes.map((x, j) => (j === i ? { ...x, teacher_name: e.target.value } : x)))} /></label>
          <label className="admin-field" style={{ width: '90px' }}>정원<input style={input} type="number" min={1} value={c.capacity} onChange={(e) => setClasses(classes.map((x, j) => (j === i ? { ...x, capacity: e.target.value } : x)))} /></label>
          {classes.length > 2 && <button className="btn-secondary" style={{ padding: '0.4rem' }} aria-label="반 빼기" onClick={() => setClasses(classes.filter((_, j) => j !== i))}><X size={14} /></button>}
        </div>
      ))}
      {classes.length < 4 && (
        <button className="btn-secondary" style={{ alignSelf: 'flex-start', padding: '0.35rem 0.7rem', fontSize: '0.75rem' }} onClick={() => setClasses([...classes, { name: '', teacher_name: '', capacity: '' }])}>
          <Plus size={12} /> 반 추가
        </button>
      )}
      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.78rem' }}>
        <fieldset style={{ border: 'none', padding: 0, margin: 0, display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <legend style={{ fontWeight: 700, marginBottom: '0.25rem' }}>문제 범위 · 언어</legend>
          {LANG_OPTIONS.map((l) => (
            <label key={l.id} style={{ display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
              <input type="checkbox" checked={langs.includes(l.id)} onChange={() => toggle(langs, setLangs, l.id)} /> {l.label}
            </label>
          ))}
        </fieldset>
        <fieldset style={{ border: 'none', padding: 0, margin: 0, display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <legend style={{ fontWeight: 700, marginBottom: '0.25rem' }}>난이도</legend>
          {DIFF_OPTIONS.map((d) => (
            <label key={d.id} style={{ display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
              <input type="checkbox" checked={diffs.includes(d.id)} onChange={() => toggle(diffs, setDiffs, d.id)} /> {d.label}
            </label>
          ))}
        </fieldset>
      </div>
      <button className="btn-primary" disabled={busy} onClick={create} style={{ alignSelf: 'flex-start', padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>
        대회 만들고 코드 발급
      </button>
    </div>
  );
}

function AdminContestRow({ contest, onChanged }: { contest: AdminContest; onChanged: () => void }) {
  const today = kstDate();
  const state = today < contest.starts_on ? '시작 전' : today <= contest.ends_on ? '진행 중' : '종료';
  const call = async (fn: string, args: Record<string, unknown>, confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return;
    const { error } = await supabase.rpc(fn, args);
    if (error) window.alert(`실패했어요: ${error.message}`);
    else onChanged();
  };
  const editDates = () => {
    const starts = window.prompt('시작일 (YYYY-MM-DD)', contest.starts_on);
    if (!starts) return;
    const ends = window.prompt('마지막 날 (YYYY-MM-DD)', contest.ends_on);
    if (!ends) return;
    void call('contest_update_contest', { p_contest_id: contest.id, p_name: contest.name, p_starts_on: starts, p_ends_on: ends });
  };
  const editClass = (k: AdminClass) => {
    const name = window.prompt('반 이름', k.name);
    if (!name) return;
    const teacher = window.prompt('담임 이름 (비워도 돼요)', k.teacher_name ?? '') ?? '';
    void call('contest_admin_update_class', { p_class_id: k.id, p_name: name, p_teacher_name: teacher });
  };

  return (
    <div style={{ border: '1px solid var(--border-subtle)', padding: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontWeight: 800 }}>
          {contest.name} <span style={{ fontWeight: 600, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{contest.starts_on} ~ {contest.ends_on} · {state} · {contest.languages.join(', ')} / {contest.difficulties.join(', ')}</span>
        </span>
        <span style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          <button className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem' }} onClick={editDates}>날짜 바꾸기</button>
          {state === '진행 중' && (
            <button className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem' }} onClick={() => call('contest_update_contest', { p_contest_id: contest.id, p_name: contest.name, p_starts_on: contest.starts_on, p_ends_on: today }, '오늘을 마지막 날로 해서 일찍 끝낼까요?')}>
              조기 종료
            </button>
          )}
          <button className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem', color: '#cf222e', borderColor: '#cf222e' }} onClick={() => call('contest_delete', { p_contest_id: contest.id }, `「${contest.name}」을 지울까요? 반·참가자·담임 등록이 모두 지워져요. 학생들의 풀이 기록은 남아요.`)}>
            삭제
          </button>
        </span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="contest-table">
          <thead>
            <tr><th>반</th><th>담임</th><th>정원</th><th>참가</th><th>학생 코드</th><th>담임 코드</th><th /></tr>
          </thead>
          <tbody>
            {contest.classes.map((k) => (
              <tr key={k.id}>
                <td>{k.name}</td>
                <td>{k.teacher_name ?? '—'} {k.teachers > 0 && <span style={{ fontSize: '0.7rem', color: '#1a7f37' }}>(등록 {k.teachers})</span>}</td>
                <td>{k.capacity ?? '—'}</td>
                <td>{k.participants}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>{k.student_code}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>{k.teacher_code}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <button className="link-button" onClick={() => editClass(k)}>이름</button>{' · '}
                  <button className="link-button" onClick={() => call('contest_regenerate_code', { p_class_id: k.id, p_kind: 'student' }, '학생 코드를 새로 만들까요? 이미 참가한 학생은 그대로예요.')}>학생 코드 재발급</button>{' · '}
                  <button className="link-button" onClick={() => call('contest_regenerate_code', { p_class_id: k.id, p_kind: 'teacher' }, '담임 코드를 새로 만들까요? 등록된 담임은 새 코드로 다시 등록해야 해요.')}>담임 코드 재발급</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
