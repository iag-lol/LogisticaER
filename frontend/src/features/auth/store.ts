import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Session } from '@supabase/supabase-js'
import type { Profile } from './types'

const fallbackStorage: Storage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  key: () => null,
  length: 0,
}

const storage: Storage =
  typeof window !== 'undefined' ? window.localStorage : fallbackStorage

interface AuthState {
  session: Session | null
  profile: Profile | null
  loading: boolean
  setSession: (session: Session | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (loading: boolean) => void
  reset: () => void
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
      name: 'equipo-clm-auth-store',
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({
        session: state.session,
        profile: state.profile,
      }),
    },
  ),
)
