/**
 * Database types for profiles table (Supabase)
 * Generated: 2025-02-05T13:00:00Z
 */

export type ProfileRole = 'buyer' | 'seller' | 'admin' | 'moderator'

export type VerificationStatus = 'none' | 'pending' | 'approved' | 'rejected'

export interface Profile {
  id: string
  user_id: string
  full_name: string | null
  role: ProfileRole
  company: string | null
  avatar_url: string | null
  /** Present after migration 20250205150000 */
  bio?: string | null
  /** Present after migration 20250205150000 */
  verification_status?: VerificationStatus
  created_at: string
  updated_at: string
}

export interface ProfileInsert {
  id?: string
  user_id: string
  full_name?: string | null
  role?: ProfileRole
  company?: string | null
  avatar_url?: string | null
  bio?: string | null
  verification_status?: VerificationStatus
}

export interface ProfileUpdate {
  full_name?: string | null
  role?: ProfileRole
  company?: string | null
  avatar_url?: string | null
  bio?: string | null
  verification_status?: VerificationStatus
}

export type ProfileRow = Profile
