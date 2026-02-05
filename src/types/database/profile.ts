/**
 * Database types for profiles table (Supabase)
 * Generated: 2025-02-05T13:00:00Z
 */

export type ProfileRole = 'buyer' | 'seller' | 'admin' | 'moderator'

export interface Profile {
  id: string
  user_id: string
  full_name: string | null
  role: ProfileRole
  company: string | null
  avatar_url: string | null
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
}

export interface ProfileUpdate {
  full_name?: string | null
  role?: ProfileRole
  company?: string | null
  avatar_url?: string | null
}

export type ProfileRow = Profile
