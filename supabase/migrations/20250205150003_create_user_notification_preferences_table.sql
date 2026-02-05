-- =====================================================
-- Migration: Create user_notification_preferences table
-- Created: 2025-02-05T15:00:03Z
-- Tables: user_notification_preferences
-- Purpose: Store per-user notification channel preferences (email, push, in_app)
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS user_notification_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  channel TEXT NOT NULL CHECK (channel IN ('email', 'push', 'in_app')),
  enabled BOOLEAN NOT NULL DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT user_notification_preferences_user_channel_unique UNIQUE (user_id, channel)
);

CREATE INDEX IF NOT EXISTS user_notification_preferences_user_id_idx ON user_notification_preferences(user_id);

DROP TRIGGER IF EXISTS update_user_notification_preferences_updated_at ON user_notification_preferences;
CREATE TRIGGER update_user_notification_preferences_updated_at
  BEFORE UPDATE ON user_notification_preferences
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_notification_preferences_select_own"
  ON user_notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_notification_preferences_insert_own"
  ON user_notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_notification_preferences_update_own"
  ON user_notification_preferences FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_notification_preferences_delete_own"
  ON user_notification_preferences FOR DELETE
  USING (auth.uid() = user_id);

COMMENT ON TABLE user_notification_preferences IS 'Per-user notification channel toggles (email, push, in_app)';
