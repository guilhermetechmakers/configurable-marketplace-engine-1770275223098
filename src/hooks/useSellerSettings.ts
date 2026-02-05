import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { sellerSettingsApi } from '@/api/seller-settings'
import type {
  SellerSettingsUpdate,
  PayoutSchedule,
} from '@/types/database/seller_settings'
import { toast } from 'sonner'

export const sellerSettingsKeys = {
  byUserId: (userId: string) => ['sellerSettings', userId] as const,
}

export function useSellerSettings(userId: string | undefined) {
  return useQuery({
    queryKey: sellerSettingsKeys.byUserId(userId ?? ''),
    queryFn: () => sellerSettingsApi.getByUserId(userId!),
    enabled: Boolean(userId),
  })
}

export function useUpsertSellerSettings(userId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (updates: {
      storefront_name?: string | null
      storefront_slug?: string | null
      payout_schedule?: PayoutSchedule
      shipping_enabled?: boolean
    }) => sellerSettingsApi.upsert(userId!, updates),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: sellerSettingsKeys.byUserId(userId),
        })
      }
      toast.success('Seller settings saved')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to save settings')
    },
  })
}

export function useUpdateSellerSettings(userId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (updates: SellerSettingsUpdate) =>
      sellerSettingsApi.update(userId!, updates),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: sellerSettingsKeys.byUserId(userId),
        })
      }
      toast.success('Seller settings updated')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Update failed')
    },
  })
}
