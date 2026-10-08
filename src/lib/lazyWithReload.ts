import { lazy } from 'react';
import type { ComponentType } from 'react';

// Every view is a lazy chunk with a content hash in its file name. A tab
// that was open across a deploy still holds the old index, so the first
// time it opens a view it hasn't loaded yet, it asks for a chunk the new
// deployment doesn't have -- and the SPA rewrite in vercel.json used to
// answer that with index.html (200, text/html), which the browser refuses
// as a module. With no error boundary, React unmounted the whole app: a
// blank white page on "some tab", only after a deploy, never reproducible
// on a fresh load.
//
// The fix for a stale tab is to load the new version, so a failed import
// reloads the page once. The timestamp guard stops a reload loop when the
// failure isn't staleness (offline, a genuinely broken chunk): the second
// failure inside the window is rethrown to ViewErrorBoundary instead.
const RELOAD_KEY = 'pyquests_chunk_reload_at';
const RELOAD_WINDOW_MS = 10_000;

// Same constraint as React.lazy's own signature.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyWithReload<T extends ComponentType<any>>(load: () => Promise<{ default: T }>) {
  return lazy(() =>
    load().catch((err: unknown) => {
      let last = 0;
      try {
        last = Number(sessionStorage.getItem(RELOAD_KEY)) || 0;
      } catch {
        // Storage blocked: can't guard against a loop, so don't reload.
        throw err;
      }
      if (Date.now() - last < RELOAD_WINDOW_MS) throw err;
      try {
        sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
      } catch {
        throw err;
      }
      window.location.reload();
      // Keep Suspense showing its fallback until the reload takes over.
      return new Promise<never>(() => {});
    })
  );
}
