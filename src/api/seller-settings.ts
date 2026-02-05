import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type {
  SellerSettings,
  SellerSettingsInsert,
  SellerSettingsUpdate,
} from '@/types/database/seller_settings'

export const sellerSettingsApi = {
  getByUserId: async (userId: string): Promise<SellerSettings | null> => {
    if (!isSupabaseConfigured() || !supabase) {
      return null
    }
    const { data, error } = await supabase
      .from('seller_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
    if (error) throw new Error(error.message)
    return data as SellerSettings | null
  },

  upsert: async (
    userId: string,
    insert: Partial<SellerSettingsInsert>,
  ): Promise<SellerSettings> => {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Seller settings are not configured')
    }
    const { data, error } = await supabase
      .from('seller_settings')
      .upsert(
        { user_id: userId, ...insert },
        { onConflict: 'user_id' },
      )
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as SellerSettings
  },

  update: async (
    userId: string,
    updates: SellerSettingsUpdate,
  ): Promise<SellerSettings> => {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Seller settings are not configured')
    }
    const { data, error } = await supabase
      .from('seller_settings')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as SellerSettings
  },
}
