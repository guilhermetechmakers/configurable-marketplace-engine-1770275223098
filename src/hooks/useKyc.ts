import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { kycApi } from '@/api/kyc'
import { profileKeys } from '@/hooks/useProfile'
import type {
  UserKycDocumentInsert,
  UserKycDocumentUpdate,
} from '@/types/database/user_kyc_document'
import { toast } from 'sonner'

export const kycKeys = {
  byUserId: (userId: string) => ['kyc', userId] as const,
}

export function useKycDocuments(userId: string | undefined) {
  return useQuery({
    queryKey: kycKeys.byUserId(userId ?? ''),
    queryFn: () => kycApi.listByUserId(userId!),
    enabled: Boolean(userId),
  })
}

export function useCreateKycDocument(userId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (insert: UserKycDocumentInsert) => kycApi.create(insert),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: kycKeys.byUserId(userId) })
        queryClient.invalidateQueries({ queryKey: profileKeys.byUserId(userId) })
      }
      toast.success('Document uploaded')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Upload failed')
    },
  })
}

export function useUpdateKycDocument(userId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string
      updates: UserKycDocumentUpdate
    }) => kycApi.update(id, userId!, updates),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: kycKeys.byUserId(userId) })
        queryClient.invalidateQueries({ queryKey: profileKeys.byUserId(userId) })
      }
      toast.success('Document updated')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Update failed')
    },
  })
}

export function useDeleteKycDocument(userId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => kycApi.delete(id, userId!),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: kycKeys.byUserId(userId) })
        queryClient.invalidateQueries({ queryKey: profileKeys.byUserId(userId) })
      }
      toast.success('Document removed')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Delete failed')
    },
  })
}
