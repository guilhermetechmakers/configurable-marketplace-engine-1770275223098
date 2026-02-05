-- =====================================================
-- Migration: Create user_recommendations table for personalized suggestions
-- Created: 2025-02-05T16:00:02Z
-- Tables: user_recommendations
-- Purpose: Store recommendation scores and feedback for listing suggestions
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: user_recommendations
-- Purpose: Per-user listing recommendations with score and optional feedback
-- =====================================================
CREATE TABLE IF NOT EXISTS user_recommendations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL,
  score NUMERIC(5, 4) NOT NULL DEFAULT 0,
  feedback TEXT CHECK (feedback IN ('like', 'dislike', NULL)),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS user_recommendations_user_id_idx ON user_recommendations(user_id);
CREATE INDEX IF NOT EXISTS user_recommendations_listing_id_idx ON user_recommendations(listing_id);
CREATE INDEX IF NOT EXISTS user_recommendations_score_idx ON user_recommendations(user_id, score DESC);
CREATE INDEX IF NOT EXISTS user_recommendations_created_at_idx ON user_recommendations(created_at DESC);

DROP TRIGGER IF EXISTS update_user_recommendations_updated_at ON user_recommendations;
CREATE TRIGGER update_user_recommendations_updated_at
  BEFORE UPDATE ON user_recommendations
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

ALTER TABLE user_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_recommendations_select_own"
  ON user_recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_recommendations_insert_own"
  ON user_recommendations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_recommendations_update_own"
  ON user_recommendations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_recommendations_delete_own"
  ON user_recommendations FOR DELETE
  USING (auth.uid() = user_id);

COMMENT ON TABLE user_recommendations IS 'Personalized listing recommendations and feedback';
COMMENT ON COLUMN user_recommendations.score IS 'Recommendation score (e.g. 0–1)';
COMMENT ON COLUMN user_recommendations.feedback IS 'User like/dislike for tuning';
