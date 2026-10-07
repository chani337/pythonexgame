import { useEffect, useRef } from 'react';

// Automatic logout after an hour of no interaction. Written for school
// computer labs: the common case isn't an attacker, it's a student who walks
// out at the bell and leaves their account open for the next class.
export const IDLE_LIMIT_MS = 60 * 60 * 1000;

// The deadline is a stored timestamp, not a setTimeout. A background tab has
// its timers throttled to roughly once a minute and a sleeping laptop stops
// firing them entirely, so a timer set for "60 minutes from now" fires
// whenever the machine feels like it. Comparing wall-clock stamps gives the
// right answer no matter how long the gap was -- including the case that
// matters most, where the browser was left open overnight.
const CHECK_INTERVAL_MS = 60 * 1000;

// Shared across tabs on purpose. Typing in one tab should keep the others
// alive, and a second tab opened after the hour has already passed should
// find the session expired rather than extending it.
const LAST_ACTIVITY_KEY = 'pyquests_last_activity_at';

// Writing on every event would mean a localStorage write per keystroke.
const WRITE_THROTTLE_MS = 30 * 1000;

// Discrete, intentional interactions only. mousemove and scroll would count
// a cat on the keyboard or a page settling after load; these all require
// someone to actually do something. 'visibilitychange' is handled separately
// because coming back to a tab is a reason to *check* the deadline, not to
// extend it -- otherwise leaving the lab and someone else touching the mouse
// would reset the clock.
const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;

function readLastActivity(): number | null {
  try {
    const raw = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (!raw) return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  } catch {
    return null;
  }
}

function writeLastActivity(at: number): void {
  try {
    localStorage.setItem(LAST_ACTIVITY_KEY, String(at));
  } catch { /* storage unavailable */ }
}

/** Forget the activity deadline. Called on logout so the next login starts fresh. */
export function clearIdleTimer(): void {
  try {
    localStorage.removeItem(LAST_ACTIVITY_KEY);
  } catch { /* storage unavailable */ }
}

/**
 * Signs the user out after IDLE_LIMIT_MS with no interaction.
 *
 * @param enabled  Only armed while someone is logged in -- a guest has no
 *                 session to end, and logging them out would just wipe the
 *                 local progress they haven't saved anywhere yet.
 * @param onIdle   Called instead of doing the sign-out itself, so the caller
 *                 can run its own cleanup and show the notice. Must be stable
 *                 or kept in a ref by the caller.
 */
export function useIdleLogout(enabled: boolean, onIdle: () => void): void {
  // Read through a ref so a re-rendered callback doesn't tear down and
  // rebuild the listeners (which would also reset the deadline).
  const onIdleRef = useRef(onIdle);
  onIdleRef.current = onIdle;

  const firedRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      firedRef.current = false;
      return;
    }

    firedRef.current = false;

    // A session restored from storage has no stamp on the very first login
    // in this browser. Seeding with "now" is the lenient choice, and the
    // right one: the alternative is logging someone out the instant they
    // sign in because a key they've never written is missing.
    if (readLastActivity() === null) writeLastActivity(Date.now());

    let lastWrite = 0;

    const markActive = () => {
      const now = Date.now();
      if (now - lastWrite < WRITE_THROTTLE_MS) return;
      lastWrite = now;
      writeLastActivity(now);
    };

    const check = () => {
      if (firedRef.current) return;
      const last = readLastActivity();
      if (last === null) return;
      if (Date.now() - last < IDLE_LIMIT_MS) return;
      // Guard against the interval and the visibility handler both firing,
      // and against a stale stamp triggering a second logout mid-teardown.
      firedRef.current = true;
      clearIdleTimer();
      onIdleRef.current();
    };

    ACTIVITY_EVENTS.forEach((type) =>
      // Capture phase: a component that stops propagation on its own
      // handlers shouldn't be able to make the whole app look idle.
      window.addEventListener(type, markActive, { capture: true, passive: true })
    );

    // Returning to the tab is the moment a stale deadline most needs
    // checking -- the interval may not have run at all while hidden.
    const onVisibility = () => {
      if (document.visibilityState === 'visible') check();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const intervalId = window.setInterval(check, CHECK_INTERVAL_MS);

    // And check immediately: on a reload, the stamp may already be hours old.
    check();

    return () => {
      ACTIVITY_EVENTS.forEach((type) =>
        window.removeEventListener(type, markActive, { capture: true })
      );
      document.removeEventListener('visibilitychange', onVisibility);
      window.clearInterval(intervalId);
    };
  }, [enabled]);
}
