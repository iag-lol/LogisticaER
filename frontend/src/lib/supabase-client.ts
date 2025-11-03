import { createClient } from '@supabase/supabase-js'

const fallbackUrl = 'https://wvcplgwemvqhvtstlqmt.supabase.co'
const fallbackAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2Y3BsZ3dlbXZxaHZ0c3RscW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNjIyMDUsImV4cCI6MjA3NTkzODIwNX0.K1YOv5lRn9fOous3AyG2gPxsQBzqOXRfYHgrCmO5zxk'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? fallbackUrl
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? fallbackAnonKey

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'equipo-clm-auth',
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
