import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type {
  ListingReview,
  ListingReviewInsert,
  ListingReviewUpdate,
  ListingReviewWithAuthor,
} from '@/types/database/listing_review'

export interface ReviewAggregation {
  average: number
  count: number
  distribution?: Record<number, number>
}

export const reviewsApi = {
  getByListingId: async (listingId: string): Promise<ListingReviewWithAuthor[]> => {
    if (!isSupabaseConfigured() || !supabase) return []
    const { data, error } = await supabase
      .from('listing_reviews')
      .select('*')
      .eq('listing_id', listingId)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    const list = (data ?? []) as ListingReview[]
    return list.map((r) => ({ ...r, author_name: null, author_avatar_url: null }))
  },

  getAggregation: async (listingId: string): Promise<ReviewAggregation> => {
    if (!isSupabaseConfigured() || !supabase) return { average: 0, count: 0 }
    const { data, error } = await supabase
      .from('listing_reviews')
      .select('rating')
      .eq('listing_id', listingId)
      .eq('status', 'published')
    if (error) throw new Error(error.message)
    const ratings = (data ?? []) as { rating: number }[]
    const count = ratings.length
    if (count === 0) return { average: 0, count: 0 }
    const sum = ratings.reduce((a, r) => a + r.rating, 0)
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    ratings.forEach((r) => {
      distribution[r.rating] = (distribution[r.rating] ?? 0) + 1
    })
    return {
      average: Math.round((sum / count) * 10) / 10,
      count,
      distribution,
    }
  },

  create: async (input: ListingReviewInsert): Promise<ListingReview> => {
    if (!isSupabaseConfigured() || !supabase) throw new Error('Reviews not configured')
    const { data, error } = await supabase
      .from('listing_reviews')
      .insert(input)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as ListingReview
  },

  update: async (id: string, updates: ListingReviewUpdate): Promise<ListingReview> => {
    if (!isSupabaseConfigured() || !supabase) throw new Error('Reviews not configured')
    const { data, error } = await supabase
      .from('listing_reviews')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as ListingReview
  },
}
