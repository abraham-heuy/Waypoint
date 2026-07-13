import { create } from 'zustand';

export type ThemeMode = 'dark' | 'light';

interface ThemeState {
  mode: ThemeMode;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
}

const STORAGE_KEY = 'waypoint_theme';

function applyMode(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === 'light') root.classList.add('light');
  else root.classList.remove('light');
}

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)').matches;
  return prefersLight ? 'light' : 'dark';
}

const initialMode = getInitialMode();
if (typeof window !== 'undefined') applyMode(initialMode);

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: initialMode,
  toggle: () => {
    const next: ThemeMode = get().mode === 'dark' ? 'light' : 'dark';
    applyMode(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    set({ mode: next });
  },
  setMode: (mode) => {
    applyMode(mode);
    window.localStorage.setItem(STORAGE_KEY, mode);
    set({ mode });
  },
}));
