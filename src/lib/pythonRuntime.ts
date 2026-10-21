// Python-side setup shared by usePyodide (the app) and
// scripts/verify-python-libs.mjs (which replays every library problem in a
// real Pyodide), so the two can't drift apart.
import { PY_DATASETS } from '../data/pyDatasets';

// Run once per Pyodide instance, before any user code.
//
// - MPLBACKEND=Agg: Pyodide's own matplotlib backend draws into
//   document.body on plt.show(). Agg renders off-screen; the app shows the
//   figures itself as PNGs (PY_COLLECT_FIGURES).
// - The warning filters matter for grading, not just tidiness: stderr is
//   captured into the same stream stdout_match compares, so pandas' one-time
//   "Pyarrow will become a required dependency" notice made the first pandas
//   run of every session fail with a correct answer.
export const PY_RUNTIME_SETUP = `
import os, warnings
os.chdir('/home/pyodide')
os.environ['MPLBACKEND'] = 'Agg'
warnings.filterwarnings('ignore', message=r'(?s).*Pyarrow will become a required dependency')
warnings.filterwarnings('ignore', message=r'.*non-GUI backend')
warnings.filterwarnings('ignore', message=r'.*Glyph .* missing from')

# Run guard (see RUN_GUARD_SECONDS). Same tracing trick as PERF_HARNESS: a
# BaseException, so student code catching Exception can't swallow it.
class _PqTimeout(BaseException):
    pass

def _pq_guard_start(limit):
    import sys, time
    count = [0]
    deadline = time.perf_counter() + limit
    def tracer(frame, event, arg):
        count[0] += 1
        if (count[0] & 1023) == 0 and time.perf_counter() > deadline:
            raise _PqTimeout()
        return tracer
    sys.settrace(tracer)

def _pq_guard_stop():
    import sys
    sys.settrace(None)
`;

// Pyodide shares the page's thread, so `while i < 10:` without `i += 1`
// used to freeze the tab for good. Runs are traced and stopped after this
// long. Not applied when NumPy/Pandas/Matplotlib are involved: importing
// them executes a lot of Python, and tracing makes that noticeably slower.
export const RUN_GUARD_SECONDS = 10;
export const TIMEOUT_MARKER = '_PqTimeout';
export const TIMEOUT_MESSAGE =
  `실행 시간이 ${RUN_GUARD_SECONDS}초를 넘어서 멈췄어요. 끝나지 않는 반복(조건이 계속 참인 while, 값이 바뀌지 않는 반복 변수)이나 너무 깊은 재귀가 없는지 확인해 보세요.`;

// Pyodide's working directory. Datasets are written by absolute path because
// FS.mkdirTree treats a relative path as rooted at / (it made /data while
// read_csv('data/...') looked in /home/pyodide/data).
export const PY_HOME = '/home/pyodide';

export function writeDatasets(py: { FS: any }) {
  py.FS.mkdirTree(`${PY_HOME}/data`);
  for (const d of PY_DATASETS) py.FS.writeFile(`${PY_HOME}/${d.path}`, d.csv);
}

// Matches import matplotlib / import matplotlib.pyplot as plt / from
// matplotlib import ..., and plt.* when the import is elsewhere.
export const needsMatplotlib = (code: string) => code.includes('matplotlib') || code.includes('plt.');

// Agg's bundled DejaVu Sans has no Hangul, so Korean titles render as boxes.
// Same family as the site (Pretendard), as a TTF -- matplotlib can't read
// the woff2 subsets the page uses. jsDelivr is already allowed by the CSP
// (connect-src) and its pretendard@ URLs are cached by the service worker.
export const KOREAN_FONT_URL =
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/alternative/Pretendard-Regular.ttf';
export const KOREAN_FONT_PATH = '/home/pyodide/.fonts/Pretendard-Regular.ttf';
export const PY_FONT_SETUP = `
from matplotlib import font_manager as _fm
import matplotlib.pyplot as _plt
_fm.fontManager.addfont(${JSON.stringify(KOREAN_FONT_PATH)})
_plt.rcParams['font.family'] = 'Pretendard'
_plt.rcParams['axes.unicode_minus'] = False
`;

// Before each run: drop figures left over from the previous one, otherwise
// a second run would grade (and show) the first run's plot too.
export const PY_BEFORE_RUN = `
import sys as _sys
if 'matplotlib.pyplot' in _sys.modules:
    _sys.modules['matplotlib.pyplot'].close('all')
`;

// After each run: every open figure as a base64 PNG, for the console.
export const PY_COLLECT_FIGURES = `
def _pq_collect():
    import sys, io, base64
    if 'matplotlib.pyplot' not in sys.modules:
        return []
    plt = sys.modules['matplotlib.pyplot']
    out = []
    for n in plt.get_fignums():
        buf = io.BytesIO()
        plt.figure(n).savefig(buf, format='png', dpi=90, bbox_inches='tight')
        out.append(base64.b64encode(buf.getvalue()).decode())
    return out
_pq_collect()
`;

// testRunnerCode: 'figure_check' -- grades a plot by inspecting the figure.
//
// Each test case input is "<label>|<expression>". The label is what the
// student sees next to PASS/FAIL; the expression is evaluated against the
// current figure with `_fig`, `_axes` and `_ax` (= _axes[0]) bound, and
// formatted so expected values stay readable: floats to 2 decimals, numpy
// scalars/arrays as plain Python, sequences as [a, b, c].
export const FIGURE_CHECK_HARNESS = `
import json as _json
import matplotlib.pyplot as _plt
import numpy as _np
_fig = _plt.gcf()
# Tick labels, legend text and autoscaled limits are only filled in on draw;
# without this, get_xticklabels() returns empty strings.
_fig.canvas.draw()
_axes = _fig.axes
_ax = _axes[0] if _axes else None
def _pq_fmt(v):
    if isinstance(v, _np.ndarray):
        v = v.tolist()
    if isinstance(v, (list, tuple)):
        return '[' + ', '.join(_pq_fmt(x) for x in v) + ']'
    if isinstance(v, (bool, _np.bool_)):
        return str(bool(v))
    if isinstance(v, (float, _np.floating)):
        return str(round(float(v), 2))
    if isinstance(v, _np.integer):
        return str(int(v))
    return str(v)
_pq_out = []
for _case in test_cases:
    _expr = _case.split('|', 1)[1]
    try:
        _pq_out.append(_pq_fmt(eval(_expr)))
    except Exception as _e:
        _pq_out.append('오류: ' + type(_e).__name__)
print('###TEST_OUT###')
print(_json.dumps(_pq_out, ensure_ascii=False))
`;

/** The part of a "<label>|<expression>" test input that is shown to students. */
export const testLabel = (input: string) => (input.includes('|') ? input.split('|', 1)[0] : input);

// Efficiency tests (problem.perfTests): large inputs with a time limit, like
// a coding-test site's 효율성 테스트.
//
// Pyodide runs on the page's main thread, so a slow or endless solution
// can't be killed from JavaScript. Instead the run is traced: every 1024
// Python events the tracer checks the clock and raises _PqTimeout, a
// BaseException so `except Exception` in student code can't swallow it.
// Tracing costs ~8x on line-heavy code, which is why both sides are traced.
//
// The limit is relative to the reference solution timed on the same device,
// in the same run: 30x its time, at least 1 s, at most 5 s. A fixed limit
// would fail correct O(n) answers on slow school PCs; 30x still separates
// O(n) / O(n log n) from O(n^2) by orders of magnitude at these sizes.
//
// Globals in: _pq_perf_calls (list of call expressions), _pq_reference
// (reference solution source). Out: a ###PERF_OUT### JSON line.
export const PERF_HARNESS = `
import sys as _sys, time as _time, json as _json

class _PqTimeout(BaseException):
    pass

def _pq_timed(call, ns, limit):
    count = [0]
    deadline = _time.perf_counter() + limit
    def tracer(frame, event, arg):
        count[0] += 1
        if (count[0] & 1023) == 0 and _time.perf_counter() > deadline:
            raise _PqTimeout()
        return tracer
    t0 = _time.perf_counter()
    _sys.settrace(tracer)
    try:
        result = eval(call, ns)
        status = 'ok'
    except _PqTimeout:
        result, status = None, 'timeout'
    except Exception as e:
        result, status = type(e).__name__ + ': ' + str(e), 'error'
    finally:
        _sys.settrace(None)
    ms = (_time.perf_counter() - t0) * 1000
    # A single long C-level call (e.g. a key= builtin) can't be interrupted
    # mid-way; it still fails on the clock once it returns.
    if status == 'ok' and ms > limit * 1000:
        status = 'timeout'
    return status, ms, result

_pq_ref_ns = {}
exec(_pq_reference, _pq_ref_ns)
_pq_perf = []
for _call in _pq_perf_calls:
    _st, _ref_ms, _ref = _pq_timed(_call, _pq_ref_ns, 30.0)
    _limit = min(max(_ref_ms * 30 / 1000, 1.0), 5.0)
    _st, _ms, _res = _pq_timed(_call, globals(), _limit)
    _exp = str(_ref)
    _act = str(_res) if _st != 'timeout' else ''
    _pq_perf.append({
        'status': 'ok' if _st == 'ok' and _act == _exp else ('wrong' if _st == 'ok' else _st),
        'ms': round(_ms),
        'limitMs': round(_limit * 1000),
        'expected': _exp[:300],
        'actual': _act[:300],
    })
print('###PERF_OUT###')
print(_json.dumps(_pq_perf, ensure_ascii=False))
`;
