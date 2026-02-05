import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewsApi } from '@/api/reviews'
import type { ListingReviewInsert } from '@/types/database/listing_review'
import { toast } from 'sonner'

export const reviewKeys = {
  byListing: (listingId: string) => ['reviews', 'listing', listingId] as const,
  aggregation: (listingId: string) => ['reviews', 'aggregation', listingId] as const,
}

export function useListingReviews(listingId: string) {
  return useQuery({
    queryKey: reviewKeys.byListing(listingId),
    queryFn: () => reviewsApi.getByListingId(listingId),
    enabled: !!listingId,
    staleTime: 1000 * 60 * 2,
  })
}

export function useReviewAggregation(listingId: string) {
  return useQuery({
    queryKey: reviewKeys.aggregation(listingId),
    queryFn: () => reviewsApi.getAggregation(listingId),
    enabled: !!listingId,
    staleTime: 1000 * 60 * 2,
  })
}

export function useSubmitReview(listingId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Omit<ListingReviewInsert, 'listing_id'>) =>
      reviewsApi.create({ ...input, listing_id: listingId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.byListing(listingId) })
      queryClient.invalidateQueries({ queryKey: reviewKeys.aggregation(listingId) })
      toast.success('Review submitted')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to submit review')
    },
  })
}
