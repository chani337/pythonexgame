// Grading for HTML/CSS problems.
//
// Python/SQL/JS problems are graded by comparing stdout. A web page has no
// stdout, so these problems are graded by inspecting the page the browser
// actually built: does the element exist, what text does it hold, and what
// style did the cascade finally give it.
//
// Style checks compare *computed* values, never the source text. `red`,
// `#f00` and `rgb(255, 0, 0)` all compute to the same thing, so a student is
// never marked wrong for spelling a correct answer differently. The expected
// value is normalised the same way (see computeExpected), so problem authors
// can write `red` too.
//
// Everything here takes the preview iframe's Document and reads it. Nothing
// is ever executed inside it -- the iframe is sandboxed without
// allow-scripts (see WebPreview.tsx).
import type { TestResult } from '../hooks/usePyodide';

// `negate` flips any check: "this link is NOT green" is how a problem proves
// a descendant selector didn't also hit the element outside it.
type Common = { selector: string; label: string; negate?: boolean };

export type WebCheck = Common & (
  /** At least `min` (default 1) and at most `max` elements match. */
  | { kind: 'exists'; min?: number; max?: number }
  /** The first match's text, whitespace-collapsed, equals `equals`. */
  | { kind: 'text'; equals: string }
  /** The first match has `attr`, and (when given) its value equals `equals`. */
  | { kind: 'attr'; attr: string; equals?: string }
  /** The first match's computed `property` equals `equals` once both are computed. */
  | { kind: 'style'; property: string; equals: string }
  /** The first match's rendered box is `width` x `height` CSS px (±1). */
  | { kind: 'size'; width?: number; height?: number }
  /**
   * Every match (at least two) sits side by side left to right (`row`) or
   * stacked top to bottom (`column`) -- for layouts whose computed values
   * don't say it directly, e.g. grid-template-columns resolves to px tracks.
   * "Side by side" means each box starts after the previous one ends and the
   * two overlap vertically, so align-items: center (different tops) still
   * counts as one row.
   */
  | { kind: 'layout'; direction: 'row' | 'column' }
);

export const collapseWhitespace = (s: string) => s.replace(/\s+/g, ' ').trim();

// A selector the browser can't parse throws from querySelector. That is an
// authoring bug in the problem, not a student mistake, so it surfaces as a
// failed check with the reason rather than crashing the grader.
function queryAll(doc: Document, selector: string): Element[] {
  try {
    return Array.from(doc.querySelectorAll(selector));
  } catch {
    throw new Error(`잘못된 선택자: ${selector}`);
  }
}

// Computes what `value` becomes for `property` in the same context as
// `target`: a probe of the same tag, inserted next to it so percentages and
// em/rem resolve against the same parent, read, then removed. The target's
// own value is read before the probe goes in, so the probe can't disturb it
// (e.g. by shifting an :nth-child match).
function computeExpected(target: Element, property: string, value: string): string {
  const doc = target.ownerDocument;
  const win = doc.defaultView!;
  const probe = doc.createElement(target.tagName);
  (probe as HTMLElement).style.setProperty(property, value);
  // A border width computes to 0 while its style is `none`, so on a bare
  // probe `2px` would come out as `0px`. Give the probe a visible border so
  // the width survives -- the target's own style is checked separately.
  const borderSide = property.match(/^border(-(?:top|right|bottom|left))?-width$/);
  if (borderSide) (probe as HTMLElement).style.setProperty(`border${borderSide[1] ?? ''}-style`, 'solid');
  const parent = target.parentElement ?? doc.body;
  parent.appendChild(probe);
  const computed = win.getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return computed.trim();
}

function runOne(doc: Document, check: WebCheck): { passed: boolean; actual: string } {
  const matches = queryAll(doc, check.selector);

  if (check.kind === 'exists') {
    const min = check.min ?? 1;
    const max = check.max ?? Infinity;
    return { passed: matches.length >= min && matches.length <= max, actual: `${matches.length}개` };
  }

  if (check.kind === 'layout') {
    if (matches.length < 2) return { passed: false, actual: `${matches.length}개` };
    const boxes = matches.map((m) => m.getBoundingClientRect());
    const row = check.direction === 'row';
    const overlaps = (a0: number, a1: number, b0: number, b1: number) => Math.min(a1, b1) - Math.max(a0, b0) > 0;
    const passed = boxes.every((b, i) => {
      if (i === 0) return true;
      const prev = boxes[i - 1];
      return row
        ? b.left >= prev.right - 1 && overlaps(prev.top, prev.bottom, b.top, b.bottom)
        : b.top >= prev.bottom - 1 && overlaps(prev.left, prev.right, b.left, b.right);
    });
    return { passed, actual: row ? '한 줄로 나란히 있지 않음' : '한 열로 쌓여 있지 않음' };
  }

  const el = matches[0];
  if (!el) return { passed: false, actual: `${check.selector} 없음` };

  if (check.kind === 'text') {
    const actual = collapseWhitespace(el.textContent ?? '');
    return { passed: actual === collapseWhitespace(check.equals), actual };
  }

  if (check.kind === 'size') {
    const box = el.getBoundingClientRect();
    const passed =
      (check.width === undefined || Math.abs(box.width - check.width) < 1) &&
      (check.height === undefined || Math.abs(box.height - check.height) < 1);
    return { passed, actual: `${Math.round(box.width)}×${Math.round(box.height)}px` };
  }

  if (check.kind === 'attr') {
    const actual = el.getAttribute(check.attr);
    if (actual === null) return { passed: false, actual: `${check.attr} 속성 없음` };
    return { passed: check.equals === undefined || actual.trim() === check.equals, actual };
  }

  const win = doc.defaultView!;
  const actual = win.getComputedStyle(el).getPropertyValue(check.property).trim();
  const expected = computeExpected(el, check.property, check.equals);
  return { passed: actual === expected, actual };
}

export function runWebChecks(doc: Document, checks: WebCheck[]): TestResult[] {
  return checks.map((check) => {
    try {
      const { passed, actual } = runOne(doc, check);
      return { input: check.label, expected: '', actual, passed: check.negate ? !passed : passed };
    } catch (err) {
      return { input: check.label, expected: '', actual: (err as Error).message, passed: false };
    }
  });
}
