import type { Role } from '@/lib/constants'

export interface Profile {
  id: string
  rut: string
  name: string
  terminal: string
  role: Role
  created_at?: string
  updated_at?: string
}
