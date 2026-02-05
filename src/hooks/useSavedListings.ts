import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { savedListingsApi } from '@/api/savedListings'
import type { SavedListingInsert, SavedListingUpdate } from '@/types/database/saved_listing'
import { toast } from 'sonner'

export const savedListingKeys = {
  all: ['savedListings'] as const,
  list: (userId: string) => [...savedListingKeys.all, 'list', userId] as const,
}

export function useMySavedListings(userId: string | undefined) {
  return useQuery({
    queryKey: savedListingKeys.list(userId ?? ''),
    queryFn: () => savedListingsApi.getMySavedListings(userId!),
    enabled: Boolean(userId),
  })
}

export function useAddSavedListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: SavedListingInsert) => savedListingsApi.addSavedListing(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: savedListingKeys.list(variables.user_id),
      })
      toast.success('Saved')
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to save'),
  })
}

export function useUpdateSavedListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: SavedListingUpdate }) =>
      savedListingsApi.updateSavedListing(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: savedListingKeys.all })
      toast.success('Updated')
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to update'),
  })
}

export function useRemoveSavedListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: savedListingsApi.removeSavedListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: savedListingKeys.all })
      toast.success('Removed from saved')
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to remove'),
  })
}
