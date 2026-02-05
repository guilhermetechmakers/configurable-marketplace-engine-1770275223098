import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationPreferencesApi } from '@/api/notification-preferences'
import type { NotificationChannel } from '@/types/database/user_notification_preference'
import { toast } from 'sonner'

export const notificationPreferencesKeys = {
  byUserId: (userId: string) => ['notificationPreferences', userId] as const,
}

export function useNotificationPreferences(userId: string | undefined) {
  return useQuery({
    queryKey: notificationPreferencesKeys.byUserId(userId ?? ''),
    queryFn: () => notificationPreferencesApi.listByUserId(userId!),
    enabled: Boolean(userId),
  })
}

export function useUpdateNotificationPreference(userId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      channel,
      enabled,
    }: {
      channel: NotificationChannel
      enabled: boolean
    }) => notificationPreferencesApi.upsert(userId!, channel, enabled),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: notificationPreferencesKeys.byUserId(userId),
        })
      }
      toast.success('Notification preference updated')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Update failed')
    },
  })
}
