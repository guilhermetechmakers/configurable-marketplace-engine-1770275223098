import { useQuery } from '@tanstack/react-query'
import { payoutsApi } from '@/api/payouts'

export const payoutKeys = {
  all: ['payouts'] as const,
  list: (params?: { page?: number; limit?: number; status?: string }) =>
    [...payoutKeys.all, 'list', params] as const,
  balance: () => [...payoutKeys.all, 'balance'] as const,
  detail: (id: string) => [...payoutKeys.all, id] as const,
}

export function useMyPayouts(params?: {
  page?: number
  limit?: number
  status?: string
}) {
  return useQuery({
    queryKey: payoutKeys.list(params),
    queryFn: () => payoutsApi.getMyPayouts(params),
    staleTime: 1000 * 60 * 2,
  })
}

export function useMyBalance() {
  return useQuery({
    queryKey: payoutKeys.balance(),
    queryFn: payoutsApi.getMyBalance,
    staleTime: 1000 * 60,
  })
}

export function usePayout(id: string) {
  return useQuery({
    queryKey: payoutKeys.detail(id),
    queryFn: () => payoutsApi.getPayoutById(id),
    enabled: !!id,
  })
}
