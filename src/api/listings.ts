import { api } from '@/lib/api'
import type {
  Listing,
  CreateListingInput,
  UpdateListingInput,
  ListingCategory,
  ListingSortOption,
} from '@/types/listing'
import type { PaginatedResponse } from '@/types/api'

export interface ListingsSearchParams {
  q?: string
  category_id?: string
  location?: string
  date_from?: string
  date_to?: string
  page?: number
  limit?: number
  sort?: ListingSortOption
  /** Key-value filters from dynamic schema (e.g. price_min, price_max, attribute options) */
  filters?: Record<string, string | number | [number, number] | string[]>
}

export const listingsApi = {
  getCategories: async (): Promise<ListingCategory[]> =>
    api.get<ListingCategory[]>('/listings/categories'),

  search: async (params: ListingsSearchParams): Promise<PaginatedResponse<Listing>> => {
    const searchParams = new URLSearchParams()
    if (params.q) searchParams.set('q', params.q)
    if (params.category_id) searchParams.set('category_id', params.category_id)
    if (params.location) searchParams.set('location', params.location)
    if (params.date_from) searchParams.set('date_from', params.date_from)
    if (params.date_to) searchParams.set('date_to', params.date_to)
    if (params.page != null) searchParams.set('page', String(params.page))
    if (params.limit != null) searchParams.set('limit', String(params.limit))
    if (params.sort) searchParams.set('sort', params.sort)
    if (params.filters && Object.keys(params.filters).length > 0) {
      searchParams.set('filters', JSON.stringify(params.filters))
    }
    const query = searchParams.toString()
    return api.get<PaginatedResponse<Listing>>(
      `/listings/search${query ? `?${query}` : ''}`,
    )
  },

  getById: async (id: string): Promise<Listing> =>
    api.get<Listing>(`/listings/${id}`),

  create: async (input: CreateListingInput): Promise<Listing> =>
    api.post<Listing>('/listings', input),

  update: async (id: string, updates: Partial<UpdateListingInput>): Promise<Listing> =>
    api.patch<Listing>(`/listings/${id}`, updates),

  delete: async (id: string): Promise<void> => api.delete(`/listings/${id}`),

  getMyListings: async (): Promise<Listing[]> =>
    api.get<Listing[]>('/listings/me'),
}
