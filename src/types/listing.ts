export type ListingStatus = 'draft' | 'pending' | 'published' | 'archived'

export interface ListingCategory {
  id: string
  slug: string
  name: string
  schema_id: string
}

export interface Listing {
  id: string
  title: string
  summary?: string
  category_id: string
  seller_id: string
  status: ListingStatus
  price_cents?: number
  currency: string
  attributes: Record<string, unknown>
  media_urls: string[]
  created_at: string
  updated_at: string
}

export interface CreateListingInput {
  title: string
  summary?: string
  category_id: string
  price_cents?: number
  currency: string
  attributes: Record<string, unknown>
  media_urls?: string[]
}

export interface UpdateListingInput extends Partial<CreateListingInput> {
  id: string
  status?: ListingStatus
}
