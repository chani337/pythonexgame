import { useEffect, useState } from 'react';

const STORAGE_KEY = 'pyquests_dark_mode';

export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'true';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', isDark);
    localStorage.setItem(STORAGE_KEY, String(isDark));
  }, [isDark]);

  return { isDark, toggleDark: () => setIsDark((prev) => !prev) };
}
