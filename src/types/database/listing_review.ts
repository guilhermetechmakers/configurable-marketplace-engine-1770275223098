/**
 * Database types for listing_reviews table
 * Generated: 2025-02-05T18:00:00Z
 */

export type ListingReviewStatus = 'published' | 'hidden' | 'flagged'

export interface ListingReview {
  id: string
  listing_id: string
  user_id: string
  order_id: string | null
  rating: number
  comment: string | null
  status: ListingReviewStatus
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface ListingReviewInsert {
  id?: string
  listing_id: string
  user_id: string
  order_id?: string | null
  rating: number
  comment?: string | null
  status?: ListingReviewStatus
  metadata?: Record<string, unknown>
}

export interface ListingReviewUpdate {
  rating?: number
  comment?: string | null
  status?: ListingReviewStatus
  metadata?: Record<string, unknown>
}

export type ListingReviewRow = ListingReview

/** Client display shape with reviewer name/avatar when joined */
export interface ListingReviewWithAuthor extends ListingReview {
  author_name?: string | null
  author_avatar_url?: string | null
}
