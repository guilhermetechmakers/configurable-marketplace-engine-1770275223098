import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileApi } from '@/api/profile'
import { authKeys } from '@/hooks/useAuth'
import type { ProfileUpdate } from '@/types/database/profile'
import { toast } from 'sonner'

export const profileKeys = {
  byUserId: (userId: string) => ['profile', userId] as const,
}

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: profileKeys.byUserId(userId ?? ''),
    queryFn: () => profileApi.getByUserId(userId!),
    enabled: Boolean(userId),
  })
}

export function useUpdateProfile(userId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (updates: ProfileUpdate) =>
      profileApi.update(userId!, updates),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: profileKeys.byUserId(userId) })
        queryClient.invalidateQueries({ queryKey: authKeys.user })
      }
      toast.success('Profile updated')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to update profile')
    },
  })
}
