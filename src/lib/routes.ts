// URL <-> view mapping.
//
// The app used to keep its current screen in a single `currentView` useState
// and nothing else, so every screen shared one URL: the back button left the
// site, a problem could not be linked to, and search engines had exactly one
// page to index. This module is the translation layer that fixes that without
// restructuring the component tree -- App still owns the state, it just keeps
// the address bar in step with it.
//
// Pure functions on purpose: no history, no window, no React. That makes the
// routing table something tests can assert on directly.
import type { DocCategory } from '../data/docs';

export type ViewName = 'dashboard' | 'problems' | 'sandbox' | 'docs' | 'board' | 'changelog';

export interface Route {
  view: ViewName;
  /** Set when a specific problem is open: /problems/<id>. */
  problemId?: string;
  /** Set when the guide is open on a specific language: /docs/<category>. */
  docCategory?: DocCategory;
}

// The segment that maps to each view. 'dashboard' is the root and has no
// segment of its own.
const VIEW_SEGMENTS: Record<Exclude<ViewName, 'dashboard'>, true> = {
  problems: true,
  sandbox: true,
  docs: true,
  board: true,
  changelog: true,
};

const DOC_CATEGORIES: DocCategory[] = ['python', 'sql', 'java', 'js', 'c', 'html', 'css'];

function isViewSegment(s: string): s is Exclude<ViewName, 'dashboard'> {
  return Object.prototype.hasOwnProperty.call(VIEW_SEGMENTS, s);
}

function isDocCategory(s: string): s is DocCategory {
  return (DOC_CATEGORIES as string[]).includes(s);
}

/**
 * Turn a pathname into a route. Anything unrecognised resolves to the
 * dashboard rather than throwing -- a stale or mistyped link should land
 * somewhere usable, and App replaces the URL once it has.
 */
export function parsePath(pathname: string): Route {
  // Tolerate a trailing slash, a missing leading one, and %-encoding (a
  // problem id is plain ascii, but a hand-edited URL need not be).
  const segments = pathname
    .split('/')
    .map((s) => {
      try {
        return decodeURIComponent(s);
      } catch {
        return s;
      }
    })
    .filter(Boolean);

  if (segments.length === 0) return { view: 'dashboard' };

  const [first, second] = segments;
  if (!isViewSegment(first)) return { view: 'dashboard' };

  if (first === 'problems' && second) {
    return { view: 'problems', problemId: second };
  }
  if (first === 'docs' && second) {
    // An unknown category falls back to the plain guide, which then uses
    // whatever the reader last had open.
    return isDocCategory(second) ? { view: 'docs', docCategory: second } : { view: 'docs' };
  }
  return { view: first };
}

/** The canonical path for a route. Inverse of parsePath for valid routes. */
export function buildPath(route: Route): string {
  if (route.view === 'dashboard') return '/';
  if (route.view === 'problems' && route.problemId) {
    return `/problems/${route.problemId}`;
  }
  if (route.view === 'docs' && route.docCategory) {
    return `/docs/${route.docCategory}`;
  }
  return `/${route.view}`;
}

/** Every path worth putting in a sitemap, excluding per-problem pages. */
export function staticPaths(): string[] {
  return [
    '/',
    ...Object.keys(VIEW_SEGMENTS).map((v) => `/${v}`),
    ...DOC_CATEGORIES.map((c) => `/docs/${c}`),
  ];
}

/**
 * The route a given UI state should be addressed as.
 *
 * A problem is always /problems/<id>, even when it was opened from the guide:
 * `view` stays 'docs' so that closing it returns there, but the problem still
 * needs a URL of its own. Keeping this rule here rather than inline in a
 * component is what makes it testable.
 */
export function routeForState(
  view: ViewName,
  problemId: string | undefined,
  docCategory: DocCategory | undefined
): Route {
  if (problemId) return { view: 'problems', problemId };
  return { view, docCategory };
}

export type HistoryAction =
  | { kind: 'none' }
  | { kind: 'push'; path: string }
  | { kind: 'replace'; path: string };

/**
 * What to do with the address bar, given where it is and where the UI is.
 *
 * - Already correct: do nothing. This is what stops the two sync directions
 *   from ping-ponging -- popstate sets state to match the URL, and this then
 *   finds nothing to write.
 * - First run and wrong: replace. The entry URL wasn't canonical (an unknown
 *   path, or a problem id that no longer exists), and pushing would leave
 *   Back pointing at a URL that resolves nowhere.
 * - Otherwise: push, so Back works.
 */
export function nextHistoryAction(
  currentPath: string,
  route: Route,
  isFirstRun: boolean
): HistoryAction {
  const path = buildPath(route);
  if (currentPath === path) return { kind: 'none' };
  return { kind: isFirstRun ? 'replace' : 'push', path };
}
