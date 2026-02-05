import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { MessageConversation, Message, MessageConversationInsert, MessageInsert } from '@/types/database/conversation'

export interface ConversationWithLastMessage extends MessageConversation {
  last_message?: Message | null
  last_message_at?: string | null
  unread_count?: number
}

export const messagesApi = {
  async getMyConversations(userId: string): Promise<ConversationWithLastMessage[]> {
    const client = isSupabaseConfigured() ? supabase : null
    if (!client) return []
    const { data: conversations, error } = await client
      .from('message_conversations')
      .select('*')
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('updated_at', { ascending: false })
      .limit(20)
    if (error) throw new Error(error.message)
    const list = (conversations ?? []) as MessageConversation[]
    const withLast: ConversationWithLastMessage[] = await Promise.all(
      list.map(async (c) => {
        const { data: msgs } = await client
          .from('messages')
          .select('*')
          .eq('conversation_id', c.id)
          .order('created_at', { ascending: false })
          .limit(1)
        const last = (msgs ?? [])[0] as Message | undefined
        const { count } = await client
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', c.id)
          .is('read_at', null)
          .neq('sender_id', userId)
        return {
          ...c,
          last_message: last ?? null,
          last_message_at: last?.created_at ?? null,
          unread_count: count ?? 0,
        }
      }),
    )
    return withLast
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const client = isSupabaseConfigured() ? supabase : null
    if (!client) return []
    const { data, error } = await client
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    if (error) throw new Error(error.message)
    return (data ?? []) as Message[]
  },

  async createConversation(input: MessageConversationInsert): Promise<MessageConversation> {
    const client = isSupabaseConfigured() ? supabase : null
    if (!client) throw new Error('Supabase not configured')
    const { data, error } = await client
      .from('message_conversations')
      .insert(input)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as MessageConversation
  },

  async sendMessage(input: MessageInsert): Promise<Message> {
    const client = isSupabaseConfigured() ? supabase : null
    if (!client) throw new Error('Supabase not configured')
    const { data, error } = await client
      .from('messages')
      .insert(input)
      .select()
      .single()
    if (error) throw new Error(error.message)
    await client
      .from('message_conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', input.conversation_id)
    return data as Message
  },

  async markAsRead(messageId: string): Promise<void> {
    const client = isSupabaseConfigured() ? supabase : null
    if (!client) return
    await client
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('id', messageId)
  },
}
