import { useState, useEffect } from 'react';

declare global {
  interface Window {
    loadPyodide: (config?: { indexURL?: string }) => Promise<any>;
  }
}

export interface TestResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
}

export interface RunResponse {
  success: boolean;
  stdout: string;
  error?: string;
  testResults?: TestResult[];
}

export function usePyodide() {
  const [pyodide, setPyodide] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initPyodide() {
      try {
        // Wait a small moment to ensure index.html script tag loaded
        let attempts = 0;
        while (!window.loadPyodide && attempts < 30) {
          await new Promise((resolve) => setTimeout(resolve, 200));
          attempts++;
        }

        if (!window.loadPyodide) {
          throw new Error('Pyodide CDN 스크립트를 로드할 수 없습니다. 인터넷 연결을 확인해 주세요.');
        }

        const py = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/',
        });

        // Preload common packages (numpy, pandas) for seamless problem solving
        try {
          await py.loadPackage(['numpy', 'pandas']);
        } catch (pkgErr) {
          console.warn('Package preload notice:', pkgErr);
        }

        if (isMounted) {
          setPyodide(py);
          setLoading(false);
        }
      } catch (err: any) {
        console.error('Pyodide Init Error:', err);
        if (isMounted) {
          setError(err.message || '파이썬 실행 엔진 로드 중 오류가 발생했습니다.');
          setLoading(false);
        }
      }
    }

    initPyodide();

    return () => {
      isMounted = false;
    };
  }, []);

  const runCode = async (
    code: string,
    testCases?: { input: string; expected: string }[],
    testRunnerCode?: string
  ): Promise<RunResponse> => {
    if (!pyodide) {
      return { success: false, stdout: '', error: '파이썬 엔진이 아직 준비되지 않았습니다.' };
    }

    const stdoutLines: string[] = [];

    // Redirect stdout/stderr in pyodide
    pyodide.setStdout({
      batched: (msg: string) => {
        stdoutLines.push(msg);
      },
    });
    pyodide.setStderr({
      batched: (msg: string) => {
        stdoutLines.push(msg);
      },
    });

    try {
      // Normalize mobile smart quotes, apostrophes, and non-breaking spaces
      const normalizedCode = code
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/[\u2018\u2019\u00B4\u02B9]/g, "'")
        .replace(/\u00A0/g, ' ');

      // Dynamically load numpy or pandas if used in code
      if (normalizedCode.includes('numpy') || normalizedCode.includes('np.')) {
        try { await pyodide.loadPackage('numpy'); } catch (e) {}
      }
      if (normalizedCode.includes('pandas') || normalizedCode.includes('pd.')) {
        try { await pyodide.loadPackage('pandas'); } catch (e) {}
      }

      // Clear python globals cache (except builtins) to avoid state pollution between runs
      await pyodide.runPythonAsync(`
import sys
# Keep only essential and loaded modules
`);

      // 1. Run the user's custom function definition in Pyodide
      await pyodide.runPythonAsync(normalizedCode);

      // 1.5. If the test runner is output-based matching (stdout_match)
      if (testRunnerCode === 'stdout_match') {
        const userStdout = stdoutLines.join('\n').trim();
        const expected = testCases && testCases[0] ? String(testCases[0].expected) : '';
        
        const cleanExpected = expected.replace(/^['"]|['"]$/g, '');
        
        const cleanActual = userStdout.replace(/\r\n/g, '\n').trim();
        const cleanExpectedNorm = cleanExpected.replace(/\r\n/g, '\n').trim();

        const passed = cleanActual === cleanExpectedNorm;

        return {
          success: passed,
          stdout: userStdout,
          testResults: [
            {
              input: '전체 코드 출력',
              expected: cleanExpectedNorm,
              actual: cleanActual,
              passed
            }
          ]
        };
      }

      // 2. If it's sandbox or quiz and there are no testCases, just return execution
      if (!testCases || !testRunnerCode) {
        return {
          success: true,
          stdout: stdoutLines.join('\n'),
        };
      }

      // 3. Inject test_cases into Python global scope
      const inputs = testCases.map((tc) => tc.input);
      pyodide.globals.set('test_cases', pyodide.toPy(inputs));

      // 4. Run the validation harness
      await pyodide.runPythonAsync(testRunnerCode);

      // 5. Clean up injected globals
      pyodide.globals.delete('test_cases');

      const stdoutResult = stdoutLines.join('\n');
      const testMarker = '###TEST_OUT###';
      const markerIndex = stdoutResult.indexOf(testMarker);

      if (markerIndex === -1) {
        return {
          success: false,
          stdout: stdoutResult,
          error: '테스트 프레임워크와 연결되지 않았습니다. 함수명과 매개변수를 확인해 주세요.',
        };
      }

      const userStdout = stdoutResult.substring(0, markerIndex).trim();
      const testJSON = stdoutResult.substring(markerIndex + testMarker.length).trim();
      const actualOutputs: string[] = JSON.parse(testJSON);

      const testResults = testCases.map((tc, index) => {
        const actual = (actualOutputs[index] !== undefined ? actualOutputs[index] : '').trim();
        const expected = tc.expected.trim();

        // Standardize quotes or spaces for comparisons
        const cleanActual = actual.replace(/^['"]|['"]$/g, '').replace(/\s+/g, ' ');
        const cleanExpected = expected.replace(/^['"]|['"]$/g, '').replace(/\s+/g, ' ');

        const passed = cleanActual === cleanExpected;

        return {
          input: tc.input,
          expected: tc.expected,
          actual,
          passed,
        };
      });

      const allPassed = testResults.every((tr) => tr.passed);

      return {
        success: allPassed,
        stdout: userStdout,
        testResults,
      };
    } catch (err: any) {
      return {
        success: false,
        stdout: stdoutLines.join('\n'),
        error: err.message || String(err),
      };
    }
  };

  return { loading, error, runCode, pyodide };
}
