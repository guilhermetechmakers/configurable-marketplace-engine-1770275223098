import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersApi } from '@/api/orders'
import { toast } from 'sonner'

export const orderKeys = {
  all: ['orders'] as const,
  list: (params?: { page?: number; status?: string }) =>
    [...orderKeys.all, 'list', params] as const,
  sellerList: (params?: { page?: number; status?: string }) =>
    [...orderKeys.all, 'seller', params] as const,
  detail: (id: string) => [...orderKeys.all, id] as const,
}

export function useMyOrders(params?: { page?: number; status?: string }) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => ordersApi.getMyOrders(params),
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ordersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
      toast.success('Order placed')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to place order')
    },
  })
}

export function useSellerOrders(params?: {
  page?: number
  status?: string
}) {
  return useQuery({
    queryKey: orderKeys.sellerList(params),
    queryFn: () => ordersApi.getSellerOrders(params),
    staleTime: 1000 * 60,
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ordersApi.updateStatus(id, status),
    onSuccess: (updated) => {
      queryClient.setQueryData(orderKeys.detail(updated.id), updated)
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
      toast.success('Order status updated')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to update order status')
    },
  })
}
