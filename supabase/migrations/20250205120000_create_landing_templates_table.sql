-- =====================================================
-- Migration: Create landing_templates table for use-case templates
-- Created: 2025-02-05T12:00:00Z
-- Tables: landing_templates
-- Purpose: Store use-case template cards (name, description, demo link) for landing page
-- =====================================================

-- Enable UUID extension (idempotent)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: landing_templates
-- Purpose: Use-case templates shown on landing (e.g. Local Goods, Services, B2B)
-- =====================================================
CREATE TABLE IF NOT EXISTS landing_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  demo_link TEXT NOT NULL DEFAULT '/listings',
  icon_key TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT landing_templates_name_not_empty CHECK (length(trim(name)) > 0)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS landing_templates_sort_order_idx ON landing_templates(sort_order);
CREATE INDEX IF NOT EXISTS landing_templates_is_active_idx ON landing_templates(is_active) WHERE is_active = true;

-- Auto-update trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_landing_templates_updated_at ON landing_templates;
CREATE TRIGGER update_landing_templates_updated_at
  BEFORE UPDATE ON landing_templates
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE landing_templates ENABLE ROW LEVEL SECURITY;

-- Public read for landing page; write via service role only
CREATE POLICY "landing_templates_select_public"
  ON landing_templates FOR SELECT
  USING (is_active = true);

COMMENT ON TABLE landing_templates IS 'Use-case templates for landing page (name, description, demo link)';
COMMENT ON COLUMN landing_templates.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN landing_templates.demo_link IS 'Path or URL for Launch Demo CTA';
