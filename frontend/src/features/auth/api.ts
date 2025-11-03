import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase-client'
import type { Profile } from './types'

export async function signInWithCredentials({
  username,
  password,
}: {
  username: string
  password: string
}): Promise<Session> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: username,
    password,
  })

  if (error || !data.session) {
    throw new Error(error?.message ?? 'No se pudo iniciar sesión.')
  }

  return data.session
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw new Error(error.message)
  }
}

export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, rut, name, terminal, role, created_at, updated_at')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (!data) {
    throw new Error('El perfil no está configurado.')
  }

  return data as Profile
}
