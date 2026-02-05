-- =====================================================
-- Migration: Create conversations and messages tables for in-app messaging
-- Created: 2025-02-05T16:00:00Z
-- Tables: message_conversations, messages
-- Purpose: Buyer-seller threaded messaging with read status and attachments
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TABLE: message_conversations
-- Purpose: Thread between buyer and seller (e.g. per order or listing)
-- =====================================================
CREATE TABLE IF NOT EXISTS message_conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID,
  listing_id UUID,
  subject TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS message_conversations_buyer_id_idx ON message_conversations(buyer_id);
CREATE INDEX IF NOT EXISTS message_conversations_seller_id_idx ON message_conversations(seller_id);
CREATE INDEX IF NOT EXISTS message_conversations_updated_at_idx ON message_conversations(updated_at DESC);

DROP TRIGGER IF EXISTS update_message_conversations_updated_at ON message_conversations;
CREATE TRIGGER update_message_conversations_updated_at
  BEFORE UPDATE ON message_conversations
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

ALTER TABLE message_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "message_conversations_select_participant"
  ON message_conversations FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "message_conversations_insert_buyer"
  ON message_conversations FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "message_conversations_update_participant"
  ON message_conversations FOR UPDATE
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id)
  WITH CHECK (auth.uid() = buyer_id OR auth.uid() = seller_id);

COMMENT ON TABLE message_conversations IS 'Messaging threads between buyer and seller';
COMMENT ON COLUMN message_conversations.order_id IS 'Optional link to order';
COMMENT ON COLUMN message_conversations.listing_id IS 'Optional link to listing';

-- =====================================================
-- TABLE: messages
-- Purpose: Individual messages in a conversation
-- =====================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES message_conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  attachments JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT messages_content_not_empty CHECK (length(trim(content)) > 0)
);

CREATE INDEX IF NOT EXISTS messages_conversation_id_idx ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS messages_sender_id_idx ON messages(sender_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at DESC);

DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages_select_conversation_participant"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM message_conversations c
      WHERE c.id = messages.conversation_id
      AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
    )
  );

CREATE POLICY "messages_insert_sender"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "messages_update_sender"
  ON messages FOR UPDATE
  USING (auth.uid() = sender_id)
  WITH CHECK (auth.uid() = sender_id);

COMMENT ON TABLE messages IS 'Individual messages within a conversation';
COMMENT ON COLUMN messages.read_at IS 'When the recipient read the message';

-- =====================================================
-- ROLLBACK (documentation only)
-- =====================================================
-- DROP TABLE IF EXISTS messages CASCADE;
-- DROP TABLE IF EXISTS message_conversations CASCADE;
