import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import AuthModal from './components/AuthModal';

// Lazily loaded so each view's code (and, for DocsViewer, the large docs.ts
// chapter text) only downloads when the user actually navigates there,
// instead of all being bundled into the initial page load.
const Dashboard = lazy(() => import('./components/Dashboard'));
const ProblemList = lazy(() => import('./components/ProblemList'));
const ProblemWorkspace = lazy(() => import('./components/ProblemWorkspace'));
const Sandbox = lazy(() => import('./components/Sandbox'));
const DocsViewer = lazy(() => import('./components/DocsViewer'));
const Board = lazy(() => import('./components/Board'));
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';
import { problems, filterProblems } from './data/problems';
import type { Problem } from './data/problems';
import { usePyodide } from './hooks/usePyodide';
import { useJsRunner } from './hooks/useJsRunner';

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
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  const { user, profile, loading: isAuthLoading, syncSolvedToSupabase, syncStatsToSupabase, fetchUserSolvedIds, syncReviewProblemToSupabase, fetchUserReviewProblemIds, setAuthModalOpen } = useAuth();

  // Filter states lifted up to preserve active view & difficulty
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const listScrollPosRef = useRef<number>(0);

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

  // Fetch solved problem IDs from Supabase when user logs in
  useEffect(() => {
    if (user) {
      localStorage.setItem('pyquests_last_user_id', user.id);
      const localKey = `pyquests_solved_ids_${user.id}`;
      const savedLocal = localStorage.getItem(localKey);
      const localSolved: string[] = savedLocal ? JSON.parse(savedLocal) : [];

      fetchUserSolvedIds().then((remoteSolvedIds) => {
        const merged = Array.from(new Set([...localSolved, ...(remoteSolvedIds || [])]));
        setSolvedIds(merged);
        localStorage.setItem(localKey, JSON.stringify(merged));
      });

      const localReviewKey = `pyquests_review_ids_${user.id}`;
      const savedLocalReview = localStorage.getItem(localReviewKey);
      const localReview: string[] = savedLocalReview ? JSON.parse(savedLocalReview) : [];

      fetchUserReviewProblemIds().then((remoteReviewIds) => {
        const merged = Array.from(new Set([...localReview, ...(remoteReviewIds || [])]));
        setReviewIds(merged);
        localStorage.setItem(localReviewKey, JSON.stringify(merged));
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
  // Python (sandbox/docs/a non-JS coding problem) mounts, since the WASM
  // download + numpy/pandas preload blocks the main thread for several
  // seconds and shouldn't happen just for browsing the dashboard. Once
  // triggered it latches on so navigating away and back doesn't reload it.
  const [pyodideNeeded, setPyodideNeeded] = useState(false);
  useEffect(() => {
    const problemLanguage = selectedProblem?.language || (selectedProblem ? 'python' : undefined);
    const needsPyodide =
      ((currentView === 'sandbox' || currentView === 'docs') && !!user) ||
      (!!selectedProblem && problemLanguage !== 'js');
    if (needsPyodide) setPyodideNeeded(true);
  }, [currentView, selectedProblem, user]);
  const { loading: isPyodideLoading, runCode } = usePyodide(pyodideNeeded);
  const { runCode: runJsCode } = useJsRunner();

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

    // Sync to Supabase
    syncSolvedToSupabase(problemId);
    syncStatsToSupabase(newStreak, today, sandboxRunCount);
  };

  const handleUnlockAllProblems = async () => {
    const allIds = problems.map((p) => p.id);
    setSolvedIds(allIds);
    setStreak(30);
    setSandboxRunCount(50);
    const today = new Date().toISOString().split('T')[0];
    setLastSolvedDate(today);

    // Batch sync to Supabase if logged in
    if (user) {
      try {
        const records = allIds.map((pid) => ({
          user_id: user.id,
          problem_id: pid,
        }));
        await supabase.from('user_solved_problems').upsert(records, { onConflict: 'user_id,problem_id' });
        await syncStatsToSupabase(30, today, 50);
      } catch (err) {
        console.error('Unlock all sync error:', err);
      }
    }
  };

  const handleIncrementSandboxRuns = () => {
    const newCount = sandboxRunCount + 1;
    setSandboxRunCount(newCount);
    if (lastSolvedDate) {
      syncStatsToSupabase(streak, lastSolvedDate, newCount);
    }
  };

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
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center' }}>404 Not Found</div>
        )}
        </Suspense>
      </main>
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


