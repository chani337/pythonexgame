import { useState, useEffect, useRef, Suspense } from 'react';
import { RefreshCw, CloudUpload, X, Clock } from 'lucide-react';
import Sidebar from './components/Sidebar';
import AuthModal from './components/AuthModal';
import ViewErrorBoundary from './components/ViewErrorBoundary';
import UpdatePrompt from './components/UpdatePrompt';
import { lazyWithReload } from './lib/lazyWithReload';

// Lazily loaded so each view's code (and, for DocsViewer, the large docs.ts
// chapter text) only downloads when the user actually navigates there,
// instead of all being bundled into the initial page load. lazyWithReload
// recovers a tab left open across a deploy (see that file).
const Dashboard = lazyWithReload(() => import('./components/Dashboard'));
const ProblemList = lazyWithReload(() => import('./components/ProblemList'));
const ProblemWorkspace = lazyWithReload(() => import('./components/ProblemWorkspace'));
const Sandbox = lazyWithReload(() => import('./components/Sandbox'));
const DocsViewer = lazyWithReload(() => import('./components/DocsViewer'));
const Board = lazyWithReload(() => import('./components/Board'));
const Changelog = lazyWithReload(() => import('./components/Changelog'));
import { AuthProvider, useAuth } from './contexts/AuthContext';
import type { GuestMergeResult } from './contexts/AuthContext';
import { supabase } from './lib/supabase';
import { problems, filterProblems } from './data/problems';
import type { Problem } from './data/problems';
import { parsePath, routeForState, nextHistoryAction } from './lib/routes';
import type { ViewName } from './lib/routes';
import type { DocCategory } from './data/docs';

// Resolving /problems/<id> back to a Problem. Built once rather than a
// find() per navigation.
const PROBLEM_BY_ID = new Map(problems.map((p) => [p.id, p]));

// The entry URL, read once per page load rather than on every render. Only
// the useState initialisers below consult it; after that the state is the
// source of truth and the address bar follows it.
const INITIAL_ROUTE = parsePath(window.location.pathname);
import { usePyodide } from './hooks/usePyodide';
import { useJsRunner } from './hooks/useJsRunner';
import { useSqlRunner } from './hooks/useSqlRunner';

function LoginRequiredGate({ description, onLogin }: { description: string; onLogin: () => void }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '4rem 2rem',
        textAlign: 'center',
        minHeight: '50vh',
      }}
    >
      <div style={{ fontSize: '2.5rem' }}>🔒</div>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1a1a1a' }}>로그인이 필요한 기능이에요</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '360px', lineHeight: 1.6 }}>{description}</p>
      <button onClick={onLogin} className="btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
        로그인 / 회원가입
      </button>
    </div>
  );
}

function MainApp() {
  // The screen used to be plain state with no URL, so every view shared one
  // address: the back button left the site, a problem couldn't be linked, and
  // there was a single page for search engines to index. The state still
  // lives here -- routes.ts only keeps the address bar in step with it.
  const [currentView, setCurrentView] = useState<string>(INITIAL_ROUTE.view);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(
    INITIAL_ROUTE.problemId ? PROBLEM_BY_ID.get(INITIAL_ROUTE.problemId) ?? null : null
  );
  // Which guide language is open, lifted out of DocsViewer so /docs/css can
  // be a real address. Undefined means "whatever the reader last had open",
  // which is what DocsViewer did on its own before.
  const [docCategory, setDocCategory] = useState<DocCategory | undefined>(INITIAL_ROUTE.docCategory);

  const { user, profile, loading: isAuthLoading, syncSolvedToSupabase, syncSandboxRunsToSupabase, fetchUserSolvedIds, syncReviewProblemToSupabase, fetchUserReviewProblemIds, setAuthModalOpen, guestMergeResult, clearGuestMergeResult, idleLoggedOut, clearIdleLoggedOut, idleLimitMinutes } = useAuth();

  // Filter states lifted up to preserve active view & difficulty
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const listScrollPosRef = useRef<number>(0);

  // Login nudge for guests. Dismissal is per-session (plain state, not
  // localStorage) so it reappears on a later visit without nagging within one.
  // Deliberately a banner and not a modal -- nothing should block solving.
  const [loginNudgeDismissed, setLoginNudgeDismissed] = useState(false);

  // States with LocalStorage fallback. Always scoped per-account (or
  // "guest") -- never fall back to the old unscoped `pyquests_*` keys here.
  // Those were written by long-removed code and reading them back would
  // leak whichever account last populated them into the current account.
  const [solvedIds, setSolvedIds] = useState<string[]>(() => {
    const lastId = localStorage.getItem('pyquests_last_user_id') || 'guest';
    const saved = localStorage.getItem(`pyquests_solved_ids_${lastId}`);
    return saved ? JSON.parse(saved) : [];
  });

  // 오답노트: 틀린 문제는 자동으로, 별표는 수동으로 추가되는 "복습 목록"
  const [reviewIds, setReviewIds] = useState<string[]>(() => {
    const lastId = localStorage.getItem('pyquests_last_user_id') || 'guest';
    const saved = localStorage.getItem(`pyquests_review_ids_${lastId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [streak, setStreak] = useState<number>(() => {
    const lastId = localStorage.getItem('pyquests_last_user_id') || 'guest';
    const saved = localStorage.getItem(`pyquests_streak_${lastId}`);
    return saved ? parseInt(saved, 10) : 0;
  });

  const [lastSolvedDate, setLastSolvedDate] = useState<string | null>(() => {
    const lastId = localStorage.getItem('pyquests_last_user_id') || 'guest';
    return localStorage.getItem(`pyquests_last_solved_date_${lastId}`);
  });

  const [sandboxRunCount, setSandboxRunCount] = useState<number>(() => {
    const lastId = localStorage.getItem('pyquests_last_user_id') || 'guest';
    const saved = localStorage.getItem(`pyquests_sandbox_runs_${lastId}`);
    return saved ? parseInt(saved, 10) : 0;
  });

  // Fetch solved problem IDs from Supabase when user logs in. Supabase is
  // the source of truth once logged in -- local storage is just a mirror of
  // it, overwritten on every login, never merged. Merging (local ∪ remote)
  // meant a bad id that once leaked into a browser's local cache could never
  // be cleared even by deleting the row server-side, since a union can only
  // grow. (First-time guest progress still makes it into the account via
  // AuthContext's mergeLocalStorageProgress, which pushes local -> Supabase
  // on login -- this just stops the read side from re-inflating past that.)
  useEffect(() => {
    if (user) {
      localStorage.setItem('pyquests_last_user_id', user.id);
      const localKey = `pyquests_solved_ids_${user.id}`;

      fetchUserSolvedIds().then((remoteSolvedIds) => {
        setSolvedIds(remoteSolvedIds || []);
        localStorage.setItem(localKey, JSON.stringify(remoteSolvedIds || []));
      });

      const localReviewKey = `pyquests_review_ids_${user.id}`;

      fetchUserReviewProblemIds().then((remoteReviewIds) => {
        setReviewIds(remoteReviewIds || []);
        localStorage.setItem(localReviewKey, JSON.stringify(remoteReviewIds || []));
      });
    } else if (!isAuthLoading) {
      // Load local guest progress when not logged in instead of resetting to 0
      const guestSolved = localStorage.getItem('pyquests_solved_ids_guest');
      const guestSolvedList = guestSolved ? JSON.parse(guestSolved) : [];
      setSolvedIds(guestSolvedList);

      const guestReview = localStorage.getItem('pyquests_review_ids_guest');
      setReviewIds(guestReview ? JSON.parse(guestReview) : []);

      const guestStreak = localStorage.getItem('pyquests_streak_guest') || '0';
      setStreak(parseInt(guestStreak, 10));

      const guestLastDate = localStorage.getItem('pyquests_last_solved_date_guest');
      setLastSolvedDate(guestLastDate);

      const guestSandbox = localStorage.getItem('pyquests_sandbox_runs_guest') || '0';
      setSandboxRunCount(parseInt(guestSandbox, 10));
    }
  }, [user, isAuthLoading]);

  // Sync profile stats when logged in
  useEffect(() => {
    if (user && profile) {
      setStreak(profile.streak || 0);
      setLastSolvedDate(profile.last_solved_date || null);
      setSandboxRunCount(profile.sandbox_runs || 0);
    }
  }, [user, profile]);

  // Sandbox Code state shared with DocsViewer
  const [sandboxCode, setSandboxCode] = useState<string>(() => {
    const saved = localStorage.getItem('pyquests_sandbox_code');
    return saved || `# 파이썬 리스트 컴프리헨션 예제
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# 짝수는 제곱하고 홀수는 그대로 유지
result = [x**2 if x % 2 == 0 else x for x in numbers]

print("원본 리스트:", numbers)
print("변환 리스트:", result)
`;
  });

  useEffect(() => {
    localStorage.setItem('pyquests_sandbox_code', sandboxCode);
  }, [sandboxCode]);

  // Pyodide in-browser runtime: deferred until a view that actually needs
  // Python (sandbox/docs/a coding problem that isn't JS/HTML/CSS) mounts, since the WASM
  // download + numpy/pandas preload blocks the main thread for several
  // seconds and shouldn't happen just for browsing the dashboard. Once
  // triggered it latches on so navigating away and back doesn't reload it.
  const [pyodideNeeded, setPyodideNeeded] = useState(false);
  useEffect(() => {
    const problemLanguage = selectedProblem?.language || (selectedProblem ? 'python' : undefined);
    const needsPyodide =
      ((currentView === 'sandbox' || currentView === 'docs') && !!user) ||
      (!!selectedProblem && !['js', 'html', 'css'].includes(problemLanguage!));
    if (needsPyodide) setPyodideNeeded(true);
  }, [currentView, selectedProblem, user]);
  const { loading: isPyodideLoading, status: pyodideStatus, runCode } = usePyodide(pyodideNeeded);
  const { runCode: runJsCode } = useJsRunner();
  const { runCode: runSqlCode } = useSqlRunner();

  // Save changes to localStorage scoped to user
  useEffect(() => {
    const storageKey = user ? `pyquests_solved_ids_${user.id}` : 'pyquests_solved_ids_guest';
    localStorage.setItem(storageKey, JSON.stringify(solvedIds));
  }, [solvedIds, user]);

  useEffect(() => {
    const storageKey = user ? `pyquests_streak_${user.id}` : 'pyquests_streak_guest';
    localStorage.setItem(storageKey, streak.toString());
  }, [streak, user]);

  useEffect(() => {
    const storageKey = user ? `pyquests_sandbox_runs_${user.id}` : 'pyquests_sandbox_runs_guest';
    localStorage.setItem(storageKey, sandboxRunCount.toString());
  }, [sandboxRunCount, user]);

  useEffect(() => {
    if (!lastSolvedDate) return;
    const storageKey = user ? `pyquests_last_solved_date_${user.id}` : 'pyquests_last_solved_date_guest';
    localStorage.setItem(storageKey, lastSolvedDate);
  }, [lastSolvedDate, user]);

  useEffect(() => {
    const storageKey = user ? `pyquests_review_ids_${user.id}` : 'pyquests_review_ids_guest';
    localStorage.setItem(storageKey, JSON.stringify(reviewIds));
  }, [reviewIds, user]);

  // Manually star/unstar a problem for review (오답노트 즐겨찾기)
  const handleToggleReview = (problemId: string) => {
    setReviewIds((prev) => {
      const nowInReview = !prev.includes(problemId);
      syncReviewProblemToSupabase(problemId, nowInReview);
      return nowInReview ? [...prev, problemId] : prev.filter((id) => id !== problemId);
    });
  };

  // Auto-add a problem to the review list the first time it's answered incorrectly
  const handleWrongAttempt = (problemId: string) => {
    setReviewIds((prev) => {
      if (prev.includes(problemId)) return prev;
      syncReviewProblemToSupabase(problemId, true);
      return [...prev, problemId];
    });
  };

  // Mark a problem as solved and compute the streak
  const handleMarkSolved = (problemId: string) => {
    let newStreak = streak;
    const today = new Date().toISOString().split('T')[0];

    if (!solvedIds.includes(problemId)) {
      const newSolvedIds = [...solvedIds, problemId];
      setSolvedIds(newSolvedIds);

      if (!lastSolvedDate) {
        newStreak = 1;
      } else {
        const lastDate = new Date(lastSolvedDate);
        const currentDate = new Date(today);
        const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          newStreak = streak + 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      }
      setStreak(newStreak);
      setLastSolvedDate(today);
    }

    // Sync to Supabase. The streak computed above is an optimistic local
    // value for immediate feedback only -- migration 001 derives streak,
    // last_solved_date and solved_count from user_solved_problems, and
    // syncSolvedToSupabase re-reads the authoritative values afterwards.
    syncSolvedToSupabase(problemId);
  };

  // Admin-only shortcut that marks everything solved. It goes through the
  // merge_guest_progress RPC rather than a direct upsert for two reasons:
  // the 30-inserts-per-minute trigger from migration 001 would reject 377
  // rows outright, and streak/last_solved_date are server-derived now, so
  // the old `setStreak(30)` + stat upsert was writing values the database
  // discards.
  const handleUnlockAllProblems = async () => {
    const allIds = problems.map((p) => p.id);
    setSolvedIds(allIds);
    setSandboxRunCount(50);

    if (user) {
      try {
        const { error } = await supabase.rpc('merge_guest_progress', {
          p_problem_ids: allIds,
        });
        if (error) {
          console.error('Unlock all failed:', error);
          return;
        }
        await syncSandboxRunsToSupabase(50);
      } catch (err) {
        console.error('Unlock all sync error:', err);
      }
    }
  };

  const handleIncrementSandboxRuns = () => {
    const newCount = sandboxRunCount + 1;
    setSandboxRunCount(newCount);
    syncSandboxRunsToSupabase(newCount);
  };

  // ── URL <-> state ───────────────────────────────────────────────────────
  // One direction each, and they can't ping-pong: the writer only acts when
  // the address bar actually differs from the state, and popstate sets state
  // to what the address bar already says.
  const didFirstUrlSyncRef = useRef(false);

  useEffect(() => {
    // The app restores the problem-list scroll position itself
    // (listScrollPosRef), so the browser doing it too fights that.
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    const isFirstRun = !didFirstUrlSyncRef.current;
    didFirstUrlSyncRef.current = true;

    const action = nextHistoryAction(
      window.location.pathname,
      routeForState(currentView as ViewName, selectedProblem?.id, docCategory),
      isFirstRun
    );

    if (action.kind === 'push') window.history.pushState(null, '', action.path);
    else if (action.kind === 'replace') window.history.replaceState(null, '', action.path);
  }, [currentView, selectedProblem, docCategory]);

  useEffect(() => {
    const onPopState = () => {
      const route = parsePath(window.location.pathname);
      setCurrentView(route.view);
      setSelectedProblem(
        route.problemId ? PROBLEM_BY_ID.get(route.problemId) ?? null : null
      );
      setDocCategory(route.docCategory);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleSelectProblem = (problem: Problem) => {
    const mainEl = document.querySelector('.main-content');
    if (mainEl) {
      listScrollPosRef.current = mainEl.scrollTop;
    }
    // Deliberately leave currentView untouched (e.g. 'docs' or 'problems') so
    // that going back returns to wherever the problem was opened from, rather
    // than always dropping back to the full problem list.
    setSelectedProblem(problem);
  };

  const handleBackToProblems = () => {
    setSelectedProblem(null);
  };

  // Next / Previous problem handlers
  const handleNextProblem = () => {
    if (!selectedProblem) return;

    // 1. Check current filtered list
    const filtered = filterProblems(problems, {
      language: selectedLanguage,
      difficulty: selectedDifficulty,
      type: selectedType,
      search: searchQuery,
    });

    const filterIndex = filtered.findIndex((p) => p.id === selectedProblem.id);
    if (filterIndex !== -1 && filterIndex < filtered.length - 1) {
      setSelectedProblem(filtered[filterIndex + 1]);
      return;
    }

    // 2. Fallback to global problems list
    const globalIndex = problems.findIndex((p) => p.id === selectedProblem.id);
    if (globalIndex !== -1 && globalIndex < problems.length - 1) {
      setSelectedProblem(problems[globalIndex + 1]);
      return;
    }

    // 3. Loop back to first problem if at the very end
    if (problems.length > 0) {
      setSelectedProblem(problems[0]);
    } else {
      handleBackToProblems();
    }
  };

  const handlePrevProblem = () => {
    if (!selectedProblem) return;

    const filtered = filterProblems(problems, {
      language: selectedLanguage,
      difficulty: selectedDifficulty,
      type: selectedType,
      search: searchQuery,
    });

    const filterIndex = filtered.findIndex((p) => p.id === selectedProblem.id);
    if (filterIndex > 0) {
      setSelectedProblem(filtered[filterIndex - 1]);
      return;
    }

    const globalIndex = problems.findIndex((p) => p.id === selectedProblem.id);
    if (globalIndex > 0) {
      setSelectedProblem(problems[globalIndex - 1]);
    }
  };

  return (
    <div className="app-container">
      {/* Auth Login/Signup Modal */}
      <AuthModal />

      {/* Navigation Sidebar */}
      <Sidebar
        currentView={selectedProblem ? 'problems' : currentView}
        onViewChange={(view) => {
          setSelectedProblem(null);
          setCurrentView(view);
        }}
        solvedCount={solvedIds.length}
        totalCount={problems.length}
        streak={streak}
      />

      {/* Main Content Router */}
      <main className="main-content">
        <ViewErrorBoundary key={selectedProblem ? `problem:${selectedProblem.id}` : currentView}>
        <Suspense
          fallback={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              불러오는 중...
            </div>
          }
        >
        {selectedProblem ? (
          <ProblemWorkspace
            problem={selectedProblem}
            onBack={handleBackToProblems}
            onNextProblem={handleNextProblem}
            onPrevProblem={handlePrevProblem}
            runPythonCode={runCode}
            runJsCode={runJsCode}
            runSqlCode={runSqlCode}
            isPyodideLoading={isPyodideLoading}
            onMarkSolved={handleMarkSolved}
            isBookmarked={reviewIds.includes(selectedProblem.id)}
            onToggleReview={handleToggleReview}
            onWrongAttempt={handleWrongAttempt}
            backLabel={currentView === 'docs' ? '학습가이드로 돌아가기' : '목록으로 돌아가기'}
          />
        ) : currentView === 'dashboard' ? (
          <Dashboard
            problems={problems}
            solvedIds={solvedIds}
            streak={streak}
            onNavigateToProblems={(language, difficulty) => {
              if (language) setSelectedLanguage(language);
              if (difficulty) setSelectedDifficulty(difficulty);
              setCurrentView('problems');
            }}
            onSelectProblem={handleSelectProblem}
            sandboxRunCount={sandboxRunCount}
            onUnlockAll={handleUnlockAllProblems}
            onNavigateToChangelog={() => setCurrentView('changelog')}
          />
        ) : currentView === 'problems' ? (
          <ProblemList
            problems={problems}
            solvedIds={solvedIds}
            reviewIds={reviewIds}
            onToggleReview={handleToggleReview}
            onSelectProblem={handleSelectProblem}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            initialScrollPos={listScrollPosRef.current}
          />
        ) : currentView === 'sandbox' ? (
          user ? (
            <Sandbox
              runPythonCode={runCode}
              isPyodideLoading={isPyodideLoading}
              onIncrementSandboxRuns={handleIncrementSandboxRuns}
              code={sandboxCode}
              setCode={setSandboxCode}
            />
          ) : (
            <LoginRequiredGate
              description="샌드박스는 로그인한 회원만 이용할 수 있어요. 로그인하고 자유롭게 코드를 실행해 보세요."
              onLogin={() => setAuthModalOpen(true)}
            />
          )
        ) : currentView === 'docs' ? (
          user ? (
            <DocsViewer
              runPythonCode={runCode}
              isPyodideLoading={isPyodideLoading}
              onExportToSandbox={(codeText) => {
                setSandboxCode(codeText);
                setCurrentView('sandbox');
              }}
              problems={problems}
              onSelectProblem={handleSelectProblem}
              category={docCategory}
              onCategoryChange={setDocCategory}
            />
          ) : (
            <LoginRequiredGate
              description="학습 가이드는 로그인한 회원만 볼 수 있어요. 로그인하고 학습을 시작해 보세요."
              onLogin={() => setAuthModalOpen(true)}
            />
          )
        ) : currentView === 'board' ? (
          user ? (
            <Board />
          ) : (
            <LoginRequiredGate
              description="고객센터는 로그인한 회원만 이용할 수 있어요. 로그인하고 문의를 남겨보세요."
              onLogin={() => setAuthModalOpen(true)}
            />
          )
        ) : currentView === 'changelog' ? (
          <Changelog />
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center' }}>404 Not Found</div>
        )}
        </Suspense>
        </ViewErrorBoundary>
      </main>

      {guestMergeResult && (
        <GuestMergeToast result={guestMergeResult} onClose={clearGuestMergeResult} />
      )}

      {/* Three solves is enough to have something worth losing, and late
          enough that it doesn't greet a first-time visitor. */}
      {!user && !isAuthLoading && solvedIds.length >= 3 && !loginNudgeDismissed && (
        <LoginNudgeBanner
          solvedCount={solvedIds.length}
          onLogin={() => { setLoginNudgeDismissed(true); setAuthModalOpen(true); }}
          onDismiss={() => setLoginNudgeDismissed(true)}
        />
      )}

      {/* An auto-logout with no explanation is indistinguishable from the
          site breaking, so it always says why. */}
      {idleLoggedOut && (
        <IdleLogoutNotice minutes={idleLimitMinutes} onClose={clearIdleLoggedOut} />
      )}

      {pyodideStatus && <RuntimeStatusPill message={pyodideStatus} />}

      <UpdatePrompt />
    </div>
  );
}

// Confirms that progress made before signing in was carried over. Guests who
// solve problems and then register used to lose everything, silently -- the
// merge only ran for accounts that already had a profile row.
function GuestMergeToast({ result, onClose }: { result: GuestMergeResult; onClose: () => void }) {
  const failed = result.failed;
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
        gap: '0.6rem',
        padding: '0.75rem 1rem 0.75rem 1.1rem',
        maxWidth: 'calc(100vw - 2rem)',
        background: failed ? '#fef2f2' : '#ffffff',
        border: `1px solid ${failed ? '#dc2626' : '#16a34a'}`,
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: '#1a1a1a',
      }}
    >
      <CloudUpload size={16} color={failed ? '#dc2626' : '#16a34a'} style={{ flexShrink: 0 }} />
      <span>
        {failed
          ? '진도를 계정에 저장하지 못했어요. 다음 로그인에 다시 시도합니다.'
          : `이전에 푼 ${result.mergedSolved}개 문제를 계정에 저장했어요!`}
        {!failed && result.skippedSolved > 0 && (
          <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
            {` (지금은 없는 문제 ${result.skippedSolved}개는 제외)`}
          </span>
        )}
      </span>
      <button
        onClick={onClose}
        aria-label="알림 닫기"
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.15rem', display: 'flex', color: 'var(--text-secondary)' }}
      >
        <X size={15} />
      </button>
    </div>
  );
}

// Shown after the inactivity timer ends a session. Written for school
// computer labs, where the session that gets left open is the one someone
// else inherits.
function IdleLogoutNotice({ minutes, onClose }: { minutes: number; onClose: () => void }) {
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
        gap: '0.6rem',
        padding: '0.75rem 1rem 0.75rem 1.1rem',
        maxWidth: 'calc(100vw - 2rem)',
        background: '#fff8e6',
        border: '1px solid #a66908',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: '#1a1a1a',
      }}
    >
      <Clock size={16} color="#a66908" style={{ flexShrink: 0 }} />
      <span>
        {`${minutes}분 동안 사용이 없어 자동으로 로그아웃했어요.`}
        <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
          {' 진도는 계정에 저장되어 있으니 다시 로그인하면 이어서 풀 수 있어요.'}
        </span>
      </span>
      <button
        onClick={onClose}
        aria-label="알림 닫기"
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.15rem', display: 'flex', color: 'var(--text-secondary)' }}
      >
        <X size={15} />
      </button>
    </div>
  );
}

// Guest progress lives only in this browser's localStorage, so clearing the
// cache or switching devices loses it. This says so once the guest has enough
// invested to care, without blocking anything.
function LoginNudgeBanner({ solvedCount, onLogin, onDismiss }: { solvedCount: number; onLogin: () => void; onDismiss: () => void }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 99998,
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        padding: '0.7rem 0.85rem 0.7rem 1.1rem',
        maxWidth: 'calc(100vw - 2rem)',
        background: '#1a1a1a',
        color: '#ffffff',
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        fontSize: '0.82rem',
      }}
    >
      <span>
        <strong>{solvedCount}개</strong>를 푸셨어요. 진도를 저장하려면 로그인하세요 — 다른 기기에서도 이어서 풀 수 있어요.
      </span>
      <button
        onClick={onLogin}
        style={{ background: '#ffffff', color: '#1a1a1a', border: 'none', padding: '0.4rem 0.9rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}
      >
        로그인
      </button>
      <button
        onClick={onDismiss}
        aria-label="안내 닫기"
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.15rem', display: 'flex', color: '#94a3b8', flexShrink: 0 }}
      >
        <X size={15} />
      </button>
    </div>
  );
}

// Shown while a Python package wheel downloads mid-run. numpy is 11MB and
// pandas pulls ~35MB with dependencies, so the run button would otherwise sit
// there looking broken. One fixed element here instead of the same prop
// threaded into ProblemWorkspace, Sandbox and DocsViewer.
function RuntimeStatusPill({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.6rem 1.1rem',
        background: '#1a1a1a',
        color: '#ffffff',
        fontSize: '0.82rem',
        fontWeight: 600,
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        maxWidth: 'calc(100vw - 2rem)',
      }}
    >
      <RefreshCw size={14} style={{ animation: 'spin 2s linear infinite', flexShrink: 0 }} />
      <span>{message}</span>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}


