import { useState } from 'react'
import { signInWithCredentials, signOut as supabaseSignOut, fetchProfile } from '../api'
import { useAuthStore } from '../store'

export function useAuthActions() {
  const setSession = useAuthStore((state) => state.setSession)
  const setProfile = useAuthStore((state) => state.setProfile)
  const setLoading = useAuthStore((state) => state.setLoading)
  const reset = useAuthStore((state) => state.reset)
  const [error, setError] = useState<string | null>(null)

  const signIn = async ({ username, password }: { username: string; password: string }) => {
    setError(null)
    setLoading(true)
    try {
      const session = await signInWithCredentials({ username, password })
      setSession(session)
      if (session.user) {
        const profile = await fetchProfile(session.user.id)
        setProfile(profile)
      }
      return session
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await supabaseSignOut()
    } finally {
      reset()
    }
  }

  return {
    signIn,
    signOut,
    error,
    setError,
  }
}
