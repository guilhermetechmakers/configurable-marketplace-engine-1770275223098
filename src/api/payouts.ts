import { api } from '@/lib/api'
import type { Payout, SellerBalance } from '@/types/payout'

export const payoutsApi = {
  getMyPayouts: async (params?: {
    page?: number
    limit?: number
    status?: string
  }): Promise<Payout[]> => {
    const searchParams = new URLSearchParams()
    if (params?.page != null) searchParams.set('page', String(params.page))
    if (params?.limit != null) searchParams.set('limit', String(params.limit))
    if (params?.status) searchParams.set('status', params.status)
    const query = searchParams.toString()
    try {
      const res = await api.get<{ data: Payout[] }>(
        `/payouts${query ? `?${query}` : ''}`,
      )
      return (res as { data?: Payout[] })?.data ?? []
    } catch {
      return []
    }
  },

  getMyBalance: async (): Promise<SellerBalance> => {
    try {
      const res = await api.get<SellerBalance>('/payouts/balance')
      return res as SellerBalance
    } catch {
      return {
        available_cents: 0,
        pending_cents: 0,
        currency: 'USD',
        next_payout_date: null,
      }
    }
  },

  getPayoutById: async (id: string): Promise<Payout | null> => {
    try {
      return await api.get<Payout>(`/payouts/${id}`)
    } catch {
      return null
    }
  },
}
