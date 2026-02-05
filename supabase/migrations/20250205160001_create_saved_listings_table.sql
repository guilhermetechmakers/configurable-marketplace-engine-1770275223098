-- =====================================================
-- Migration: Create saved_listings table for buyer saved items and searches
-- Created: 2025-02-05T16:00:01Z
-- Tables: saved_listings
-- Purpose: Store user saved listings and optional search criteria
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: saved_listings
-- Purpose: Buyer saved listings and saved search criteria
-- =====================================================
CREATE TABLE IF NOT EXISTS saved_listings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID,
  search_criteria JSONB DEFAULT '{}'::jsonb,
  name TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT saved_listings_listing_or_search CHECK (
    listing_id IS NOT NULL OR (search_criteria IS NOT NULL AND search_criteria != '{}'::jsonb)
  )
);

CREATE INDEX IF NOT EXISTS saved_listings_user_id_idx ON saved_listings(user_id);
CREATE INDEX IF NOT EXISTS saved_listings_listing_id_idx ON saved_listings(listing_id) WHERE listing_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS saved_listings_created_at_idx ON saved_listings(created_at DESC);

DROP TRIGGER IF EXISTS update_saved_listings_updated_at ON saved_listings;
CREATE TRIGGER update_saved_listings_updated_at
  BEFORE UPDATE ON saved_listings
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

ALTER TABLE saved_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved_listings_select_own"
  ON saved_listings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "saved_listings_insert_own"
  ON saved_listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saved_listings_update_own"
  ON saved_listings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saved_listings_delete_own"
  ON saved_listings FOR DELETE
  USING (auth.uid() = user_id);

COMMENT ON TABLE saved_listings IS 'Buyer saved listings and saved search criteria';
COMMENT ON COLUMN saved_listings.listing_id IS 'Reference to listing when saving a specific listing';
COMMENT ON COLUMN saved_listings.search_criteria IS 'Saved search filters when no specific listing';
