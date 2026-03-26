import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'system',
      
      setTheme: (theme) => set({ theme }),
      
      toggle: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),
    }),
    {
      name: 'theme',
    }
  )
);

const getSystemTheme = (): 'light' | 'dark' => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

export function useThemeSync() {
  const theme = useThemeStore((state) => state.theme);
  
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    
    const applyTheme = () => {
      const systemTheme = getSystemTheme();
      const activeTheme = theme === 'system' ? systemTheme : theme;
      document.documentElement.classList.toggle('dark', activeTheme === 'dark');
    };
    
    applyTheme();
    
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };
    
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, [theme]);
  
  const isDark = theme === 'system' 
    ? getSystemTheme() === 'dark' 
    : theme === 'dark';
  
  return { theme, isDark };
}
