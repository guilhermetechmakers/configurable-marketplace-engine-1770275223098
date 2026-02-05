import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { paymentMethodsApi } from '@/api/payment-methods'
import type {
  UserPaymentMethodInsert,
  UserPaymentMethodUpdate,
} from '@/types/database/user_payment_method'
import { toast } from 'sonner'

export const paymentMethodsKeys = {
  byUserId: (userId: string) => ['paymentMethods', userId] as const,
}

export function usePaymentMethods(userId: string | undefined) {
  return useQuery({
    queryKey: paymentMethodsKeys.byUserId(userId ?? ''),
    queryFn: () => paymentMethodsApi.listByUserId(userId!),
    enabled: Boolean(userId),
  })
}

export function useAddPaymentMethod(userId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (insert: UserPaymentMethodInsert) =>
      paymentMethodsApi.create(insert),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: paymentMethodsKeys.byUserId(userId),
        })
      }
      toast.success('Payment method added')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to add payment method')
    },
  })
}

export function useUpdatePaymentMethod(userId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string
      updates: UserPaymentMethodUpdate
    }) => paymentMethodsApi.update(id, userId!, updates),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: paymentMethodsKeys.byUserId(userId),
        })
      }
      toast.success('Payment method updated')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Update failed')
    },
  })
}

export function useRemovePaymentMethod(userId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => paymentMethodsApi.delete(id, userId!),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: paymentMethodsKeys.byUserId(userId),
        })
      }
      toast.success('Payment method removed')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Remove failed')
    },
  })
}
