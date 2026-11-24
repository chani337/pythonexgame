// Helpers for the "앱으로 설치하기" guide (PWA install).
//
// Chrome / Edge / Samsung Internet fire `beforeinstallprompt` once, early in
// page load. It has to be caught at module load (imported from main.tsx) or
// it's gone by the time someone opens the guide. Safari never fires it: iOS
// users install from the share sheet, which the guide walks through.

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const OPEN_INSTALL_GUIDE_EVENT = 'pyquests-open-install-guide';
export const INSTALL_PROMPT_CHANGE_EVENT = 'pyquests-install-prompt-change';

let deferredPrompt: BeforeInstallPromptEvent | null = null;

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Keep the browser's mini-infobar from popping up on its own; the guide
    // offers the same prompt behind a button instead.
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    window.dispatchEvent(new Event(INSTALL_PROMPT_CHANGE_EVENT));
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    window.dispatchEvent(new Event(INSTALL_PROMPT_CHANGE_EVENT));
  });
}

/** True when the browser can show its own install dialog right now. */
export function canPromptInstall(): boolean {
  return deferredPrompt !== null;
}

/** Show the browser's install dialog. Resolves true if the user accepted. */
export async function promptInstall(): Promise<boolean> {
  if (!deferredPrompt) return false;
  const evt = deferredPrompt;
  deferredPrompt = null;
  window.dispatchEvent(new Event(INSTALL_PROMPT_CHANGE_EVENT));
  await evt.prompt();
  const { outcome } = await evt.userChoice;
  return outcome === 'accepted';
}

/** Already opened from the home screen / as an installed app. */
export function isRunningAsApp(): boolean {
  if (typeof window === 'undefined') return false;
  const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return iosStandalone || window.matchMedia?.('(display-mode: standalone)').matches === true;
}

export type InstallPlatform = 'ios' | 'android' | 'desktop';

/** Best guess at which instructions this visitor needs. */
export function detectInstallPlatform(ua: string = typeof navigator !== 'undefined' ? navigator.userAgent : ''): InstallPlatform {
  // iPadOS 13+ reports itself as a Mac; the touch check tells them apart.
  const isIPadOS = /Macintosh/.test(ua) && typeof navigator !== 'undefined' && navigator.maxTouchPoints > 1;
  if (/iPhone|iPad|iPod/.test(ua) || isIPadOS) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'desktop';
}

export function openInstallGuide(): void {
  window.dispatchEvent(new Event(OPEN_INSTALL_GUIDE_EVENT));
}
