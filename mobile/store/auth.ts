import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Session } from '@supabase/supabase-js';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface Profile {
  id: string;
  rut: string;
  name: string;
  terminal: string;
  role: string;
  created_at?: string;
  updated_at?: string;
}

interface AuthState {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      profile: null,
      loading: true,
      setSession: (session) => set({ session }),
      setProfile: (profile) => set({ profile }),
      setLoading: (loading) => set({ loading }),
      reset: () => set({ session: null, profile: null }),
    }),
    {
      name: 'equipo-clm-mobile-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) =>
        ({
          session: state.session,
          profile: state.profile,
        }) as Pick<AuthState, 'session' | 'profile'>,
    },
  ),
);
