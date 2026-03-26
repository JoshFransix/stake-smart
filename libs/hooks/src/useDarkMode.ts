import { useThemeStore, useThemeSync } from './stores/themeStore';

export function useDarkMode() {
  const { setTheme, toggle } = useThemeStore();
  const { theme, isDark } = useThemeSync();

  return {
    theme,
    isDark,
    setTheme,
    toggle,
  };
}