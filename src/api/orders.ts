import { api } from '@/lib/api'
import type { Order } from '@/types/order'
import type { PaginatedResponse } from '@/types/api'

export const ordersApi = {
  getMyOrders: async (params?: { page?: number; status?: string }): Promise<
    PaginatedResponse<Order>
  > => {
    const searchParams = new URLSearchParams()
    if (params?.page != null) searchParams.set('page', String(params.page))
    if (params?.status) searchParams.set('status', params.status)
    const query = searchParams.toString()
    return api.get<PaginatedResponse<Order>>(
      `/orders${query ? `?${query}` : ''}`,
    )
  },

  getById: async (id: string): Promise<Order> =>
    api.get<Order>(`/orders/${id}`),

  create: async (body: {
    listing_id: string
    quantity?: number
    dates?: { start: string; end: string }
  }): Promise<Order> => api.post<Order>('/orders', body),

  getSellerOrders: async (params?: {
    page?: number
    status?: string
  }): Promise<PaginatedResponse<Order>> => {
    const searchParams = new URLSearchParams()
    if (params?.page != null) searchParams.set('page', String(params.page))
    if (params?.status) searchParams.set('status', params.status)
    const query = searchParams.toString()
    return api.get<PaginatedResponse<Order>>(
      `/orders/seller${query ? `?${query}` : ''}`,
    )
  },

  updateStatus: async (
    id: string,
    status: string,
  ): Promise<Order> =>
    api.patch<Order>(`/orders/${id}/status`, { status }),
}
