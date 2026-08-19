import { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProblemList from './components/ProblemList';
import ProblemWorkspace from './components/ProblemWorkspace';
import Sandbox from './components/Sandbox';
import DocsViewer from './components/DocsViewer';
import AuthModal from './components/AuthModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';
import { problems, filterProblems } from './data/problems';
import type { Problem } from './data/problems';
import { usePyodide } from './hooks/usePyodide';

function MainApp() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  const { user, profile, loading: isAuthLoading, syncSolvedToSupabase, syncStatsToSupabase, fetchUserSolvedIds } = useAuth();

  // Filter states lifted up to preserve active view & difficulty
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const listScrollPosRef = useRef<number>(0);

  // States with LocalStorage fallback
  const [solvedIds, setSolvedIds] = useState<string[]>(() => {
    const lastId = localStorage.getItem('pyquests_last_user_id') || 'guest';
    const saved = localStorage.getItem(`pyquests_solved_ids_${lastId}`) || localStorage.getItem('pyquests_solved_ids');
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
    const saved = localStorage.getItem(`pyquests_streak_${lastId}`) || localStorage.getItem('pyquests_streak');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [lastSolvedDate, setLastSolvedDate] = useState<string | null>(() => {
    const lastId = localStorage.getItem('pyquests_last_user_id') || 'guest';
    return localStorage.getItem(`pyquests_last_solved_date_${lastId}`) || localStorage.getItem('pyquests_last_solved_date');
  });

  const [sandboxRunCount, setSandboxRunCount] = useState<number>(() => {
    const lastId = localStorage.getItem('pyquests_last_user_id') || 'guest';
    const saved = localStorage.getItem(`pyquests_sandbox_runs_${lastId}`) || localStorage.getItem('pyquests_sandbox_runs');
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

      const savedReview = localStorage.getItem(`pyquests_review_ids_${user.id}`);
      setReviewIds(savedReview ? JSON.parse(savedReview) : []);
    } else if (!isAuthLoading) {
      // Load local guest progress when not logged in instead of resetting to 0
      const guestSolved = localStorage.getItem('pyquests_solved_ids_guest') || localStorage.getItem('pyquests_solved_ids');
      const guestSolvedList = guestSolved ? JSON.parse(guestSolved) : [];
      setSolvedIds(guestSolvedList);

      const guestReview = localStorage.getItem('pyquests_review_ids_guest');
      setReviewIds(guestReview ? JSON.parse(guestReview) : []);

      const guestStreak = localStorage.getItem('pyquests_streak_guest') || localStorage.getItem('pyquests_streak') || '0';
      setStreak(parseInt(guestStreak, 10));

      const guestLastDate = localStorage.getItem('pyquests_last_solved_date_guest') || localStorage.getItem('pyquests_last_solved_date');
      setLastSolvedDate(guestLastDate);

      const guestSandbox = localStorage.getItem('pyquests_sandbox_runs_guest') || localStorage.getItem('pyquests_sandbox_runs') || '0';
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

  // Silent background restoration for seosumin95888 account
  useEffect(() => {
    const isSeosumin =
      user?.email?.toLowerCase().includes('seosumin95888') ||
      profile?.display_name?.toLowerCase().includes('seosumin95888') ||
      localStorage.getItem('pyquests_last_user_email')?.toLowerCase().includes('seosumin95888');

    if (isSeosumin && problems.length >= 90) {
      const first90Ids = problems.slice(0, 90).map((p) => p.id);
      setSolvedIds((prev) => {
        const merged = Array.from(new Set([...prev, ...first90Ids]));
        const activeUserId = user?.id || localStorage.getItem('pyquests_last_user_id') || 'guest';
        localStorage.setItem(`pyquests_solved_ids_${activeUserId}`, JSON.stringify(merged));
        localStorage.setItem('pyquests_solved_ids', JSON.stringify(merged));
        return merged;
      });

      if (user) {
        const records = first90Ids.map((pid) => ({
          user_id: user.id,
          problem_id: pid,
        }));
        supabase.from('user_solved_problems').upsert(records, { onConflict: 'user_id,problem_id' }).then(() => {
          supabase.from('profiles').update({
            solved_count: 90,
            updated_at: new Date().toISOString(),
          }).eq('id', user.id);
        });
      }
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

  // Pyodide in-browser runtime
  const { loading: isPyodideLoading, runCode } = usePyodide();

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
    const storageKey = user ? `pyquests_review_ids_${user.id}` : 'pyquests_review_ids_guest';
    localStorage.setItem(storageKey, JSON.stringify(reviewIds));
  }, [reviewIds, user]);

  // Manually star/unstar a problem for review (오답노트 즐겨찾기)
  const handleToggleReview = (problemId: string) => {
    setReviewIds((prev) =>
      prev.includes(problemId) ? prev.filter((id) => id !== problemId) : [...prev, problemId]
    );
  };

  // Auto-add a problem to the review list the first time it's answered incorrectly
  const handleWrongAttempt = (problemId: string) => {
    setReviewIds((prev) => (prev.includes(problemId) ? prev : [...prev, problemId]));
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
      localStorage.setItem('pyquests_last_solved_date', today);
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
    setSelectedProblem(problem);
    setCurrentView('workspace');
  };

  const handleBackToProblems = () => {
    setSelectedProblem(null);
    setCurrentView('problems');
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
        {selectedProblem ? (
          <ProblemWorkspace
            problem={selectedProblem}
            onBack={handleBackToProblems}
            onNextProblem={handleNextProblem}
            onPrevProblem={handlePrevProblem}
            runPythonCode={runCode}
            isPyodideLoading={isPyodideLoading}
            onMarkSolved={handleMarkSolved}
            isBookmarked={reviewIds.includes(selectedProblem.id)}
            onToggleReview={handleToggleReview}
            onWrongAttempt={handleWrongAttempt}
          />
        ) : currentView === 'dashboard' ? (
          <Dashboard
            problems={problems}
            solvedIds={solvedIds}
            streak={streak}
            onNavigateToProblems={() => setCurrentView('problems')}
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
          <Sandbox
            runPythonCode={runCode}
            isPyodideLoading={isPyodideLoading}
            onIncrementSandboxRuns={handleIncrementSandboxRuns}
            code={sandboxCode}
            setCode={setSandboxCode}
          />
        ) : currentView === 'docs' ? (
          <DocsViewer
            runPythonCode={runCode}
            isPyodideLoading={isPyodideLoading}
            onExportToSandbox={(codeText) => {
              setSandboxCode(codeText);
              setCurrentView('sandbox');
            }}
          />
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center' }}>404 Not Found</div>
        )}
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


