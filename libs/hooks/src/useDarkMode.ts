import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggle = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  return { isDark, toggle };
}
