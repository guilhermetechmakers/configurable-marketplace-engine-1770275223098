import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listingsApi } from '@/api/listings'
import { toast } from 'sonner'
import type { UpdateListingInput } from '@/types/listing'

export const listingKeys = {
  all: ['listings'] as const,
  search: (params: Record<string, unknown>) =>
    [...listingKeys.all, 'search', params] as const,
  detail: (id: string) => [...listingKeys.all, id] as const,
  myListings: () => [...listingKeys.all, 'me'] as const,
  categories: () => ['listings', 'categories'] as const,
}

export function useListingCategories() {
  return useQuery({
    queryKey: listingKeys.categories(),
    queryFn: listingsApi.getCategories,
    staleTime: 1000 * 60 * 5,
  })
}

export function useListingsSearch(params: {
  q?: string
  category_id?: string
  page?: number
  limit?: number
  sort?: string
}) {
  return useQuery({
    queryKey: listingKeys.search(params),
    queryFn: () => listingsApi.search(params),
    staleTime: 1000 * 60 * 2,
  })
}

export function useListing(id: string) {
  return useQuery({
    queryKey: listingKeys.detail(id),
    queryFn: () => listingsApi.getById(id),
    enabled: !!id,
  })
}

export function useMyListings() {
  return useQuery({
    queryKey: listingKeys.myListings(),
    queryFn: listingsApi.getMyListings,
  })
}

export function useCreateListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: listingsApi.create,
    onSuccess: (newListing) => {
      queryClient.invalidateQueries({ queryKey: listingKeys.all })
      queryClient.setQueryData(listingKeys.detail(newListing.id), newListing)
      toast.success('Listing created')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to create listing')
    },
  })
}

export function useUpdateListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string
      updates: Partial<UpdateListingInput>
    }) => listingsApi.update(id, updates),
    onSuccess: (updated) => {
      queryClient.setQueryData(listingKeys.detail(updated.id), updated)
      queryClient.invalidateQueries({ queryKey: listingKeys.all })
      toast.success('Listing updated')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to update listing')
    },
  })
}

export function useDeleteListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: listingsApi.delete,
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: listingKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: listingKeys.all })
      toast.success('Listing deleted')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to delete listing')
    },
  })
}
