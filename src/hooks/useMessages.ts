import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { messagesApi } from '@/api/messages'
import type { MessageConversationInsert, MessageInsert } from '@/types/database/conversation'
import { toast } from 'sonner'

export const messageKeys = {
  all: ['messages'] as const,
  conversations: (userId: string) => [...messageKeys.all, 'conversations', userId] as const,
  thread: (conversationId: string) => [...messageKeys.all, 'thread', conversationId] as const,
}

export function useMyConversations(userId: string | undefined) {
  return useQuery({
    queryKey: messageKeys.conversations(userId ?? ''),
    queryFn: () => messagesApi.getMyConversations(userId!),
    enabled: Boolean(userId),
  })
}

export function useConversationMessages(conversationId: string | null) {
  return useQuery({
    queryKey: messageKeys.thread(conversationId ?? ''),
    queryFn: () => messagesApi.getMessages(conversationId!),
    enabled: Boolean(conversationId),
  })
}

export function useCreateConversation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: MessageConversationInsert) => messagesApi.createConversation(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: messageKeys.conversations(variables.buyer_id),
      })
      queryClient.invalidateQueries({
        queryKey: messageKeys.conversations(variables.seller_id),
      })
      toast.success('Conversation started')
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to start conversation'),
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: MessageInsert) => messagesApi.sendMessage(input),
    onSuccess: (msg) => {
      queryClient.invalidateQueries({ queryKey: messageKeys.thread(msg.conversation_id) })
      queryClient.invalidateQueries({ queryKey: messageKeys.all })
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to send message'),
  })
}
