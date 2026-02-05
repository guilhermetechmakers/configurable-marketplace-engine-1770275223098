-- =====================================================
-- Migration: Create listing_reviews table for listing ratings and comments
-- Created: 2025-02-05T18:00:00Z
-- Tables: listing_reviews
-- Purpose: Store reviews tied to completed transactions; one review per user per order/listing
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: listing_reviews
-- Purpose: Reviews for listings; reviewer is buyer, linked to listing and optional order
-- =====================================================
CREATE TABLE IF NOT EXISTS listing_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  listing_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'hidden', 'flagged')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS listing_reviews_listing_id_idx ON listing_reviews(listing_id);
CREATE INDEX IF NOT EXISTS listing_reviews_user_id_idx ON listing_reviews(user_id);
CREATE INDEX IF NOT EXISTS listing_reviews_created_at_idx ON listing_reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS listing_reviews_rating_idx ON listing_reviews(rating) WHERE status = 'published';

DROP TRIGGER IF EXISTS update_listing_reviews_updated_at ON listing_reviews;
CREATE TRIGGER update_listing_reviews_updated_at
  BEFORE UPDATE ON listing_reviews
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

ALTER TABLE listing_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read published reviews for a listing
CREATE POLICY "listing_reviews_select_published"
  ON listing_reviews FOR SELECT
  USING (status = 'published');

-- Users can read their own reviews
CREATE POLICY "listing_reviews_select_own"
  ON listing_reviews FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own review (enforce one per user per listing in app or unique constraint)
CREATE POLICY "listing_reviews_insert_own"
  ON listing_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own review
CREATE POLICY "listing_reviews_update_own"
  ON listing_reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own review (soft-delete via status preferred)
CREATE POLICY "listing_reviews_delete_own"
  ON listing_reviews FOR DELETE
  USING (auth.uid() = user_id);

COMMENT ON TABLE listing_reviews IS 'Reviews for marketplace listings; aggregated for listing rating_average and review_count';
COMMENT ON COLUMN listing_reviews.listing_id IS 'Listing being reviewed (may reference external listings API)';
COMMENT ON COLUMN listing_reviews.user_id IS 'Reviewer (references auth.users)';
COMMENT ON COLUMN listing_reviews.rating IS '1-5 star rating';
