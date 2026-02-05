export type ListingStatus = 'draft' | 'pending' | 'published' | 'archived'

export type ListingSortOption =
  | 'relevance'
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'rating'

export interface ListingCategory {
  id: string
  slug: string
  name: string
  schema_id: string
  parent_id?: string | null
  filter_schema?: ListingFilterField[]
}

/** Filter field definition for dynamic filters panel (from category schema) */
export interface ListingFilterField {
  key: string
  label: string
  type: 'range' | 'checkbox' | 'select'
  options?: { value: string; label: string }[]
  min?: number
  max?: number
  unit?: string
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
  /** Optional location for search and map */
  location?: string | null
  latitude?: number | null
  longitude?: number | null
  /** Badges e.g. verified, instant_book */
  badges?: string[]
  /** Aggregated rating (e.g. 1–5) for sort/display */
  rating_average?: number | null
  review_count?: number | null
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

/** Wizard step ids for Create/Edit Listing */
export const LISTING_WIZARD_STEPS = [
  'category',
  'details',
  'media',
  'pricing',
  'availability',
  'policies',
  'preview',
] as const

export type ListingWizardStepId = (typeof LISTING_WIZARD_STEPS)[number]

/** Form field definition for dynamic listing details (from category schema) */
export interface ListingDetailField {
  key: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'date'
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  min?: number
  max?: number
  conditional?: { key: string; value: string | number | boolean }
}

/** Category with optional detail schema for dynamic form */
export interface ListingCategoryWithSchema extends ListingCategory {
  detail_schema?: ListingDetailField[]
}

/** Availability slot (single or range) */
export interface AvailabilitySlot {
  start_date: string
  end_date: string
  recurring_pattern?: 'daily' | 'weekly' | 'monthly' | null
}

/** Policy entry for listing */
export interface ListingPolicy {
  type: 'shipping' | 'returns' | 'cancellation' | 'service_terms'
  content: string
}
