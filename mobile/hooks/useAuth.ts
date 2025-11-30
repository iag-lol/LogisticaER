import { useAuthStore } from '../store/auth';

export function useAuth() {
  const session = useAuthStore((state) => state.session);
  const profile = useAuthStore((state) => state.profile);
  const loading = useAuthStore((state) => state.loading);

  return { session, profile, loading };
}
