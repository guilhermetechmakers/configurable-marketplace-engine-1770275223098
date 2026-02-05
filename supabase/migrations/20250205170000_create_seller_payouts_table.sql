-- =====================================================
-- Migration: Create seller_payouts table
-- Created: 2025-02-05T17:00:00Z
-- Tables: seller_payouts
-- Purpose: Payout records for sellers (Stripe Connect, balance, schedule)
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: seller_payouts
-- Purpose: Payout history and pending payouts per seller
-- =====================================================
CREATE TABLE IF NOT EXISTS seller_payouts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  amount_cents BIGINT NOT NULL CHECK (amount_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed', 'cancelled')),
  payout_date TIMESTAMPTZ,
  stripe_payout_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS seller_payouts_seller_id_idx ON seller_payouts(seller_id);
CREATE INDEX IF NOT EXISTS seller_payouts_status_idx ON seller_payouts(status);
CREATE INDEX IF NOT EXISTS seller_payouts_payout_date_idx ON seller_payouts(payout_date DESC);
CREATE INDEX IF NOT EXISTS seller_payouts_created_at_idx ON seller_payouts(created_at DESC);

DROP TRIGGER IF EXISTS update_seller_payouts_updated_at ON seller_payouts;
CREATE TRIGGER update_seller_payouts_updated_at
  BEFORE UPDATE ON seller_payouts
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

ALTER TABLE seller_payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "seller_payouts_select_own"
  ON seller_payouts FOR SELECT
  USING (auth.uid() = seller_id);

CREATE POLICY "seller_payouts_insert_own"
  ON seller_payouts FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "seller_payouts_update_own"
  ON seller_payouts FOR UPDATE
  USING (auth.uid() = seller_id)
  WITH CHECK (auth.uid() = seller_id);

COMMENT ON TABLE seller_payouts IS 'Seller payout records (Stripe Connect, balance transfers)';
COMMENT ON COLUMN seller_payouts.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN seller_payouts.seller_id IS 'Seller (references auth.users)';
