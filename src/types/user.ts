import type { UserRole } from './auth'

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: UserRole
  email_verified: boolean
  kyc_status?: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

export interface UpdateUserInput {
  id: string
  full_name?: string
  avatar_url?: string
}
