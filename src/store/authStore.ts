import { create } from 'zustand';
import type { User, OnboardingAnswers } from '../types';
import * as api from '../lib/api';
import { toast } from './toastStore';

interface AuthState {
  user: User | null;
  onboarded: boolean;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  submitOnboarding: (answers: OnboardingAnswers) => Promise<void>;
  spendCredit: (amount?: number) => void;
  setTier: (tier: User['tier']) => void;
  updateUser: (patch: Partial<User>) => void;  // ← NEW
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  onboarded: false,
  loading: false,
  initialized: false,
  error: null,

  checkAuth: async () => {
    set({ loading: true });
    try {
      let result = await api.getCurrentUser();

      if (!result.ok && result.error === 'unauthorized') {
        const refreshResult = await api.refreshToken();
        if (refreshResult.ok) {
          result = await api.getCurrentUser();
        }
      }

      if (result.ok && result.data) {
        set({ user: result.data, onboarded: !!result.data.segment, error: null });
      } else {
        set({ user: null, onboarded: false });
      }
    } catch (e) {
      set({ user: null, onboarded: false });
    } finally {
      set({ loading: false, initialized: true });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    const result = await api.login(email, password);
    set({ loading: false });

    if (!result.ok || !result.data) {
      const message = result.error || 'Login failed';
      set({ error: message });
      toast.error(message);
      return false;
    }

    set({ user: result.data, onboarded: !!result.data.segment, error: null, initialized: true });
    toast.success(`Welcome back, ${result.data.name.split(' ')[0]}.`);
    return true;
  },

  signup: async (name, email, password) => {
    set({ loading: true, error: null });
    const result = await api.signup(name, email, password);
    set({ loading: false });

    if (!result.ok || !result.data) {
      const message = result.error || 'Signup failed';
      set({ error: message });
      toast.error(message);
      return false;
    }

    set({ user: result.data, onboarded: false, error: null, initialized: true });
    toast.success('Account created — let\'s set things up.');
    return true;
  },

  logout: async () => {
    await api.logout();
    set({ user: null, onboarded: false, error: null, initialized: true });
    toast.info('Logged out.');
  },

  submitOnboarding: async (answers) => {
    const current = get().user;
    if (!current) {
      toast.error('No user found. Please log in again.');
      return;
    }

    set({ loading: true });
    const result = await api.completeOnboarding(current.id, answers);
    set({ loading: false });

    if (result.ok && result.data) {
      set({ user: result.data, onboarded: true });
      toast.success('Your workspace is ready.');
    } else {
      toast.error(result.error || 'Could not save onboarding – please try again.');
      set({ error: result.error || 'Onboarding failed' });
    }
  },

  spendCredit: (amount = 1) => {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, credits: Math.max(0, current.credits - amount) };
    set({ user: updated });
  },

  setTier: (tier) => {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, tier };
    set({ user: updated });
  },

  // NEW: Update user state in memory
  updateUser: (patch) => {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, ...patch };
    set({ user: updated });
  },

  clearError: () => set({ error: null }),
}));