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
`;

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
