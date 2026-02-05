-- =====================================================
-- Migration: Create landing_testimonials table
-- Created: 2025-02-05T12:00:01Z
-- Tables: landing_testimonials
-- Purpose: Store testimonials (customer name, quote, logo URL) for landing page
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
-- TABLE: landing_testimonials
-- =====================================================
CREATE TABLE IF NOT EXISTS landing_testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  quote TEXT NOT NULL,
  logo_url TEXT,
  company_name TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT landing_testimonials_quote_not_empty CHECK (length(trim(quote)) > 0)
);

CREATE INDEX IF NOT EXISTS landing_testimonials_sort_order_idx ON landing_testimonials(sort_order);
CREATE INDEX IF NOT EXISTS landing_testimonials_is_active_idx ON landing_testimonials(is_active) WHERE is_active = true;

DROP TRIGGER IF EXISTS update_landing_testimonials_updated_at ON landing_testimonials;
CREATE TRIGGER update_landing_testimonials_updated_at
  BEFORE UPDATE ON landing_testimonials
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

ALTER TABLE landing_testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "landing_testimonials_select_public"
  ON landing_testimonials FOR SELECT
  USING (is_active = true);

COMMENT ON TABLE landing_testimonials IS 'Testimonials and logos for landing page social proof';
