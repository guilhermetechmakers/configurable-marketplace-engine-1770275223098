import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type {
  UserKycDocument,
  UserKycDocumentInsert,
  UserKycDocumentUpdate,
} from '@/types/database/user_kyc_document'

export const kycApi = {
  listByUserId: async (userId: string): Promise<UserKycDocument[]> => {
    if (!isSupabaseConfigured() || !supabase) {
      return []
    }
    const { data, error } = await supabase
      .from('user_kyc_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return (data ?? []) as UserKycDocument[]
  },

  create: async (insert: UserKycDocumentInsert): Promise<UserKycDocument> => {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('KYC is not configured')
    }
    const { data, error } = await supabase
      .from('user_kyc_documents')
      .insert(insert)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as UserKycDocument
  },

  update: async (
    id: string,
    userId: string,
    updates: UserKycDocumentUpdate,
  ): Promise<UserKycDocument> => {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('KYC is not configured')
    }
    const { data, error } = await supabase
      .from('user_kyc_documents')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as UserKycDocument
  },

  delete: async (id: string, userId: string): Promise<void> => {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('KYC is not configured')
    }
    const { error } = await supabase
      .from('user_kyc_documents')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
    if (error) throw new Error(error.message)
  },
}
