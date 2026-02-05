-- =====================================================
-- Migration: Create seller_settings table
-- Created: 2025-02-05T15:00:04Z
-- Tables: seller_settings
-- Purpose: Seller-specific settings (storefront, payout schedule, shipping)
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS seller_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  storefront_name TEXT,
  storefront_slug TEXT,
  payout_schedule TEXT NOT NULL DEFAULT 'weekly' CHECK (payout_schedule IN ('daily', 'weekly', 'monthly')),
  shipping_enabled BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT seller_settings_user_id_unique UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS seller_settings_user_id_idx ON seller_settings(user_id);

DROP TRIGGER IF EXISTS update_seller_settings_updated_at ON seller_settings;
CREATE TRIGGER update_seller_settings_updated_at
  BEFORE UPDATE ON seller_settings
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

ALTER TABLE seller_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "seller_settings_select_own"
  ON seller_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "seller_settings_insert_own"
  ON seller_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "seller_settings_update_own"
  ON seller_settings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "seller_settings_delete_own"
  ON seller_settings FOR DELETE
  USING (auth.uid() = user_id);

COMMENT ON TABLE seller_settings IS 'Seller-specific settings: storefront, payout schedule, shipping';
