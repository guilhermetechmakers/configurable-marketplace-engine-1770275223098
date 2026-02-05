/**
 * Database types for saved_listings table
 * Generated: 2025-02-05
 */

export interface SavedListing {
  id: string
  user_id: string
  listing_id: string | null
  search_criteria: Record<string, unknown>
  name: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface SavedListingInsert {
  id?: string
  user_id: string
  listing_id?: string | null
  search_criteria?: Record<string, unknown>
  name?: string | null
  metadata?: Record<string, unknown>
}

export interface SavedListingUpdate {
  listing_id?: string | null
  search_criteria?: Record<string, unknown>
  name?: string | null
  metadata?: Record<string, unknown>
}

export type SavedListingRow = SavedListing
