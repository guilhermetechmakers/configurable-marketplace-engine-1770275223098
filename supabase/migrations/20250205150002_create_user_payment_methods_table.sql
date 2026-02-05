-- =====================================================
-- Migration: Create user_payment_methods table
-- Created: 2025-02-05T15:00:02Z
-- Tables: user_payment_methods
-- Purpose: Store user payment methods (cards, bank) for display and Stripe reference
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS user_payment_methods (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  payment_type TEXT NOT NULL CHECK (payment_type IN ('card', 'bank_account')),
  display_name TEXT,
  last_four TEXT,
  brand TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  stripe_payment_method_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS user_payment_methods_user_id_idx ON user_payment_methods(user_id);

DROP TRIGGER IF EXISTS update_user_payment_methods_updated_at ON user_payment_methods;
CREATE TRIGGER update_user_payment_methods_updated_at
  BEFORE UPDATE ON user_payment_methods
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

ALTER TABLE user_payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_payment_methods_select_own"
  ON user_payment_methods FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_payment_methods_insert_own"
  ON user_payment_methods FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_payment_methods_update_own"
  ON user_payment_methods FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_payment_methods_delete_own"
  ON user_payment_methods FOR DELETE
  USING (auth.uid() = user_id);

COMMENT ON TABLE user_payment_methods IS 'User payment methods (cards, bank) for checkout and payouts';
