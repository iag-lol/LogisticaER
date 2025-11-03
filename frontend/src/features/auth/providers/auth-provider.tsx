import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase-client'
import { fetchProfile } from '../api'
import { useAuthStore } from '../store'

export function AuthProvider({ children }: PropsWithChildren) {
  const { setSession, setProfile, setLoading } = useAuthStore()

  useEffect(() => {
    let mounted = true

    const initialize = async () => {
      try {
        setLoading(true)
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        if (!mounted) return

        setSession(session ?? null)

        if (session?.user) {
          try {
            const profile = await fetchProfile(session.user.id)
            if (mounted) {
              setProfile(profile)
            }
          } catch (profileError) {
            console.error(profileError)
            if (mounted) {
              setProfile(null)
            }
          }
        } else {
          setProfile(null)
        }
      } catch (err) {
        console.error(err)
        if (mounted) {
          setSession(null)
          setProfile(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    void initialize()

    const {
      data: authListener,
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session ?? null)

      if (session?.user) {
        try {
          const profile = await fetchProfile(session.user.id)
          setProfile(profile)
        } catch (profileError) {
          console.error(profileError)
          setProfile(null)
        }
      } else {
        setProfile(null)
      }
    })

    return () => {
      mounted = false
      authListener.subscription.unsubscribe()
    }
  }, [setSession, setProfile, setLoading])

  return children
}
