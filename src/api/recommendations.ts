import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { UserRecommendation, UserRecommendationInsert, UserRecommendationUpdate } from '@/types/database/user_recommendation'

export const recommendationsApi = {
  async getMyRecommendations(userId: string, limit = 10): Promise<UserRecommendation[]> {
    if (!isSupabaseConfigured() || !supabase) return []
    const { data, error } = await supabase
      .from('user_recommendations')
      .select('*')
      .eq('user_id', userId)
      .order('score', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw new Error(error.message)
    return (data ?? []) as UserRecommendation[]
  },

  async addRecommendation(input: UserRecommendationInsert): Promise<UserRecommendation> {
    if (!isSupabaseConfigured() || !supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase
      .from('user_recommendations')
      .insert(input)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as UserRecommendation
  },

  async setFeedback(id: string, updates: UserRecommendationUpdate): Promise<UserRecommendation> {
    if (!isSupabaseConfigured() || !supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase
      .from('user_recommendations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as UserRecommendation
  },
}
