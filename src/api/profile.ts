import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { api } from '@/lib/api'
import type { Profile, ProfileUpdate } from '@/types/database/profile'
import type { User, UpdateUserInput } from '@/types/user'

export const profileApi = {
  getByUserId: async (userId: string): Promise<Profile | null> => {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()
      if (error) throw new Error(error.message)
      return data as Profile | null
    }
    const user = await api.get<User>(`/users/me`)
    return user
      ? {
          id: user.id,
          user_id: user.id,
          full_name: user.full_name ?? null,
          role: user.role,
          company: null,
          avatar_url: user.avatar_url ?? null,
          bio: null,
          verification_status: 'none',
          created_at: user.created_at,
          updated_at: user.updated_at,
        }
      : null
  },

  update: async (userId: string, updates: ProfileUpdate): Promise<Profile> => {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: updates.full_name,
          company: updates.company,
          avatar_url: updates.avatar_url,
          bio: updates.bio,
          verification_status: updates.verification_status,
        })
        .eq('user_id', userId)
        .select()
        .single()
      if (error) throw new Error(error.message)
      return data as Profile
    }
    const updated = await api.put<User>(`/users/${userId}`, {
      id: userId,
      full_name: updates.full_name,
      avatar_url: updates.avatar_url,
    } as UpdateUserInput)
    return {
      id: updated.id,
      user_id: updated.id,
      full_name: updated.full_name ?? null,
      role: updated.role,
      company: null,
      avatar_url: updated.avatar_url ?? null,
      bio: null,
      verification_status: 'none',
      created_at: updated.created_at,
      updated_at: updated.updated_at,
    }
  },
}
