-- =====================================================
-- Migration: Create promo_codes table
-- Created: 2025-02-05T19:00:00Z
-- Tables: promo_codes
-- Purpose: Store promo/discount codes for checkout (code, discount value, expiry, usage)
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
-- TABLE: promo_codes
-- Purpose: Promo codes for checkout discounts (percent or fixed)
-- =====================================================
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

  code TEXT NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
  discount_value_cents INTEGER NOT NULL CHECK (discount_value_cents >= 0),
  discount_percent NUMERIC(5,2) CHECK (discount_percent IS NULL OR (discount_percent >= 0 AND discount_percent <= 100)),

  max_uses INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT true,

  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT promo_codes_code_not_empty CHECK (length(trim(code)) > 0),
  CONSTRAINT promo_codes_value_check CHECK (
    (discount_type = 'percent' AND discount_percent IS NOT NULL AND discount_value_cents = 0) OR
    (discount_type = 'fixed' AND discount_value_cents > 0)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS promo_codes_code_idx ON promo_codes(LOWER(trim(code)));
CREATE INDEX IF NOT EXISTS promo_codes_expires_at_idx ON promo_codes(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS promo_codes_active_idx ON promo_codes(active) WHERE active = true;

DROP TRIGGER IF EXISTS update_promo_codes_updated_at ON promo_codes;
CREATE TRIGGER update_promo_codes_updated_at
  BEFORE UPDATE ON promo_codes
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Allow read of active promo codes for validation (anon + authenticated); write via service role only
CREATE POLICY "promo_codes_select_active"
  ON promo_codes FOR SELECT
  USING (active = true);

CREATE POLICY "promo_codes_all_service_role"
  ON promo_codes FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE promo_codes IS 'Promo/discount codes for checkout; validated by code, expiry and usage limits';
COMMENT ON COLUMN promo_codes.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN promo_codes.code IS 'Case-insensitive promo code string';
COMMENT ON COLUMN promo_codes.discount_type IS 'percent or fixed';
COMMENT ON COLUMN promo_codes.discount_value_cents IS 'Fixed discount in cents (when discount_type = fixed)';
COMMENT ON COLUMN promo_codes.discount_percent IS 'Percent discount 0-100 (when discount_type = percent)';
