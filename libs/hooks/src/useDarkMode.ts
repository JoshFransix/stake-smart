import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme';

export function useDarkMode() {
  const getSystemTheme = (): 'light' | 'dark' => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  };

  const getInitialTheme = (): Theme => {
    return (localStorage.getItem(STORAGE_KEY) as Theme) || 'system';
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  // Track system changes
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    const activeTheme = theme === 'system' ? systemTheme : theme;

    root.classList.toggle('dark', activeTheme === 'dark');
  }, [theme, systemTheme]);

  // Persist user choice
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = () => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  };

  return {
    theme,
    isDark: (theme === 'system' ? systemTheme : theme) === 'dark',
    setTheme,
    toggle,
  };
}