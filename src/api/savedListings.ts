import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { SavedListing, SavedListingInsert, SavedListingUpdate } from '@/types/database/saved_listing'

export const savedListingsApi = {
  async getMySavedListings(userId: string): Promise<SavedListing[]> {
    if (!isSupabaseConfigured() || !supabase) return []
    const { data, error } = await supabase
      .from('saved_listings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return (data ?? []) as SavedListing[]
  },

  async addSavedListing(input: SavedListingInsert): Promise<SavedListing> {
    if (!isSupabaseConfigured() || !supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase
      .from('saved_listings')
      .insert(input)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as SavedListing
  },

  async updateSavedListing(id: string, updates: SavedListingUpdate): Promise<SavedListing> {
    if (!isSupabaseConfigured() || !supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase
      .from('saved_listings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as SavedListing
  },

  async removeSavedListing(id: string): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) return
    const { error } = await supabase.from('saved_listings').delete().eq('id', id)
    if (error) throw new Error(error.message)
  },

  async removeByListingId(userId: string, listingId: string): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) return
    const { error } = await supabase
      .from('saved_listings')
      .delete()
      .eq('user_id', userId)
      .eq('listing_id', listingId)
    if (error) throw new Error(error.message)
  },
}
