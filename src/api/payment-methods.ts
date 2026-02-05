import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type {
  UserPaymentMethod,
  UserPaymentMethodInsert,
  UserPaymentMethodUpdate,
} from '@/types/database/user_payment_method'

export const paymentMethodsApi = {
  listByUserId: async (userId: string): Promise<UserPaymentMethod[]> => {
    if (!isSupabaseConfigured() || !supabase) {
      return []
    }
    const { data, error } = await supabase
      .from('user_payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return (data ?? []) as UserPaymentMethod[]
  },

  create: async (
    insert: UserPaymentMethodInsert,
  ): Promise<UserPaymentMethod> => {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Payment methods are not configured')
    }
    const { data, error } = await supabase
      .from('user_payment_methods')
      .insert(insert)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as UserPaymentMethod
  },

  update: async (
    id: string,
    userId: string,
    updates: UserPaymentMethodUpdate,
  ): Promise<UserPaymentMethod> => {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Payment methods are not configured')
    }
    const { data, error } = await supabase
      .from('user_payment_methods')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as UserPaymentMethod
  },

  delete: async (id: string, userId: string): Promise<void> => {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Payment methods are not configured')
    }
    const { error } = await supabase
      .from('user_payment_methods')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
    if (error) throw new Error(error.message)
  },
}
