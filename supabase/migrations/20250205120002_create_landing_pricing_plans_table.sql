-- =====================================================
-- Migration: Create landing_pricing_plans table
-- Created: 2025-02-05T12:00:02Z
-- Tables: landing_pricing_plans
-- Purpose: Store pricing tiers (name, price, features, limits) for landing page
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
-- TABLE: landing_pricing_plans
-- =====================================================
CREATE TABLE IF NOT EXISTS landing_pricing_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  interval TEXT NOT NULL DEFAULT 'month' CHECK (interval IN ('month', 'year', 'one_time')),
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  limits JSONB NOT NULL DEFAULT '{}'::jsonb,
  cta_label TEXT DEFAULT 'Get started',
  cta_link TEXT DEFAULT '/signup',
  highlighted BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT landing_pricing_plans_name_not_empty CHECK (length(trim(name)) > 0)
);

CREATE INDEX IF NOT EXISTS landing_pricing_plans_sort_order_idx ON landing_pricing_plans(sort_order);
CREATE INDEX IF NOT EXISTS landing_pricing_plans_is_active_idx ON landing_pricing_plans(is_active) WHERE is_active = true;

DROP TRIGGER IF EXISTS update_landing_pricing_plans_updated_at ON landing_pricing_plans;
CREATE TRIGGER update_landing_pricing_plans_updated_at
  BEFORE UPDATE ON landing_pricing_plans
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

ALTER TABLE landing_pricing_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "landing_pricing_plans_select_public"
  ON landing_pricing_plans FOR SELECT
  USING (is_active = true);

COMMENT ON TABLE landing_pricing_plans IS 'Pricing tiers for landing page (name, price, features, limits)';
