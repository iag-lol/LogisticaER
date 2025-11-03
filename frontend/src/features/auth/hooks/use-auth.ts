import { useAuthStore } from '../store'

export function useAuth() {
  const session = useAuthStore((state) => state.session)
  const profile = useAuthStore((state) => state.profile)
  const loading = useAuthStore((state) => state.loading)
  const setLoading = useAuthStore((state) => state.setLoading)

  return {
    session,
    profile,
    loading,
    setLoading,
  }
}
