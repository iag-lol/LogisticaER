import { PropsWithChildren, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/auth';
import { fetchProfile } from '../services/auth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 30,
    },
  },
});

export function AppProviders({ children }: PropsWithChildren) {
  const setSession = useAuthStore((state) => state.setSession);
  const setProfile = useAuthStore((state) => state.setProfile);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    let mounted = true;

    const initialise = async () => {
      try {
        setLoading(true);
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (!mounted) return;

        setSession(session ?? null);

        if (session?.user) {
          try {
            const profile = await fetchProfile(session.user.id);
            if (mounted) {
              setProfile(profile);
            }
          } catch (profileError) {
            console.error(profileError);
            if (mounted) setProfile(null);
          }
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error(err);
        if (mounted) {
          setSession(null);
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void initialise();

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session ?? null);
      if (session?.user) {
        try {
          const profile = await fetchProfile(session.user.id);
          setProfile(profile);
        } catch (profileError) {
          console.error(profileError);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [setProfile, setSession, setLoading]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
