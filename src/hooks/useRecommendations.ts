import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { recommendationsApi } from '@/api/recommendations'
import type { UserRecommendationInsert, UserRecommendationUpdate } from '@/types/database/user_recommendation'
import { toast } from 'sonner'

export const recommendationKeys = {
  all: ['recommendations'] as const,
  list: (userId: string) => [...recommendationKeys.all, 'list', userId] as const,
}

export function useMyRecommendations(userId: string | undefined, limit = 10) {
  return useQuery({
    queryKey: recommendationKeys.list(userId ?? ''),
    queryFn: () => recommendationsApi.getMyRecommendations(userId!, limit),
    enabled: Boolean(userId),
  })
}

export function useSetRecommendationFeedback() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UserRecommendationUpdate }) =>
      recommendationsApi.setFeedback(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: recommendationKeys.all }),
    onError: (err: Error) => toast.error(err.message ?? 'Failed to save feedback'),
  })
}

export function useAddRecommendation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UserRecommendationInsert) => recommendationsApi.addRecommendation(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: recommendationKeys.list(variables.user_id),
      })
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to save'),
  })
}
