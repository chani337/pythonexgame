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
import { problems } from './data/problems';
import type { Problem } from './data/problems';
import { usePyodide } from './hooks/usePyodide';

function MainApp() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  const { user, profile, syncSolvedToSupabase, syncStatsToSupabase, fetchUserSolvedIds } = useAuth();

  // Filter states lifted up to preserve active view & difficulty
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const listScrollPosRef = useRef<number>(0);

  // States with LocalStorage fallback
  const [solvedIds, setSolvedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('pyquests_solved_ids');
    return saved ? JSON.parse(saved) : [];
  });

  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem('pyquests_streak');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [lastSolvedDate, setLastSolvedDate] = useState<string | null>(() => {
    return localStorage.getItem('pyquests_last_solved_date');
  });

  const [sandboxRunCount, setSandboxRunCount] = useState<number>(() => {
    const saved = localStorage.getItem('pyquests_sandbox_runs');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Fetch solved problem IDs from Supabase when user logs in or reset on logout
  useEffect(() => {
    if (user) {
      fetchUserSolvedIds().then((remoteSolvedIds) => {
        setSolvedIds(remoteSolvedIds || []);
      });
    } else {
      // When logged out, reset to empty state so next user gets a fresh start
      setSolvedIds([]);
      setStreak(0);
      setLastSolvedDate(null);
      setSandboxRunCount(0);
    }
  }, [user]);

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

  // Pyodide in-browser runtime
  const { loading: isPyodideLoading, runCode } = usePyodide();

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('pyquests_solved_ids', JSON.stringify(solvedIds));
  }, [solvedIds]);

  useEffect(() => {
    localStorage.setItem('pyquests_streak', streak.toString());
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('pyquests_sandbox_runs', sandboxRunCount.toString());
  }, [sandboxRunCount]);

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
    const filtered = problems.filter((problem) => {
      const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty;
      const matchesType = selectedType === 'all' || problem.type === selectedType;
      const matchesSearch =
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDifficulty && matchesType && matchesSearch;
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

    const filtered = problems.filter((problem) => {
      const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty;
      const matchesType = selectedType === 'all' || problem.type === selectedType;
      const matchesSearch =
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDifficulty && matchesType && matchesSearch;
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
            onSelectProblem={handleSelectProblem}
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


