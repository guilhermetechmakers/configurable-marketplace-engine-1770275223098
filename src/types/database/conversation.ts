/**
 * Database types for message_conversations and messages tables
 * Generated: 2025-02-05
 */

export interface MessageConversation {
  id: string
  buyer_id: string
  seller_id: string
  order_id: string | null
  listing_id: string | null
  subject: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  read_at: string | null
  attachments: unknown[]
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface MessageConversationInsert {
  id?: string
  buyer_id: string
  seller_id: string
  order_id?: string | null
  listing_id?: string | null
  subject?: string | null
  metadata?: Record<string, unknown>
}

export interface MessageInsert {
  id?: string
  conversation_id: string
  sender_id: string
  content: string
  read_at?: string | null
  attachments?: unknown[]
  metadata?: Record<string, unknown>
}

export type MessageConversationRow = MessageConversation
export type MessageRow = Message
