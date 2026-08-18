import { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProblemList from './components/ProblemList';
import ProblemWorkspace from './components/ProblemWorkspace';
import Sandbox from './components/Sandbox';
import DocsViewer from './components/DocsViewer';
import { problems } from './data/problems';
import type { Problem } from './data/problems';
import { usePyodide } from './hooks/usePyodide';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

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
    if (solvedIds.includes(problemId)) return; // Already solved

    const newSolvedIds = [...solvedIds, problemId];
    setSolvedIds(newSolvedIds);

    // Calculate streak
    const today = new Date().toISOString().split('T')[0];
    
    if (!lastSolvedDate) {
      // First problem solved ever
      setStreak(1);
    } else {
      const lastDate = new Date(lastSolvedDate);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Solved consecutive day
        setStreak((prev) => prev + 1);
      } else if (diffDays > 1) {
        // Streak broken
        setStreak(1);
      }
      // If diffDays === 0, solved another problem on the same day, streak stays the same
    }

    setLastSolvedDate(today);
    localStorage.setItem('pyquests_last_solved_date', today);
  };

  const handleIncrementSandboxRuns = () => {
    setSandboxRunCount((prev) => prev + 1);
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

