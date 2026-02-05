import { api } from '@/lib/api'
import type {
  Listing,
  CreateListingInput,
  UpdateListingInput,
  ListingCategory,
} from '@/types/listing'
import type { PaginatedResponse } from '@/types/api'

export const listingsApi = {
  getCategories: async (): Promise<ListingCategory[]> =>
    api.get<ListingCategory[]>('/listings/categories'),

  search: async (params: {
    q?: string
    category_id?: string
    page?: number
    limit?: number
    sort?: string
  }): Promise<PaginatedResponse<Listing>> => {
    const searchParams = new URLSearchParams()
    if (params.q) searchParams.set('q', params.q)
    if (params.category_id) searchParams.set('category_id', params.category_id)
    if (params.page != null) searchParams.set('page', String(params.page))
    if (params.limit != null) searchParams.set('limit', String(params.limit))
    if (params.sort) searchParams.set('sort', params.sort)
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
