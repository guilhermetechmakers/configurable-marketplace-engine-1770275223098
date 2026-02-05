-- =====================================================
-- Migration: Create verification_attempts table
-- Created: 2025-02-05T14:00:00Z
-- Tables: verification_attempts
-- Purpose: Audit log for email verification and resend attempts; supports rate limiting
-- =====================================================

-- Enable UUID extension (idempotent)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: verification_attempts
-- Purpose: Log verification and resend attempts for security and rate-limit enforcement
-- =====================================================
CREATE TABLE IF NOT EXISTS verification_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('verify', 'resend')),
  status TEXT NOT NULL CHECK (status IN ('success', 'failure')),
  resend_count SMALLINT DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT verification_attempts_email_not_empty CHECK (length(trim(email)) > 0)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS verification_attempts_user_id_idx ON verification_attempts(user_id);
CREATE INDEX IF NOT EXISTS verification_attempts_email_created_at_idx ON verification_attempts(email, created_at DESC);
CREATE INDEX IF NOT EXISTS verification_attempts_action_idx ON verification_attempts(action);
CREATE INDEX IF NOT EXISTS verification_attempts_created_at_idx ON verification_attempts(created_at DESC);

-- Enable Row Level Security
ALTER TABLE verification_attempts ENABLE ROW LEVEL SECURITY;

-- Only service role or backend can insert/read (audit table); no direct user access
-- Allow authenticated user to read own attempts by user_id
CREATE POLICY "verification_attempts_select_own"
  ON verification_attempts FOR SELECT
  USING (auth.uid() = user_id);

-- Insert is done by service role / Edge Function (no policy = only service role)
-- For app to log via anon key, use a secure Edge Function that inserts after verify/resend

COMMENT ON TABLE verification_attempts IS 'Audit log for email verification and resend attempts; used for rate limiting and security';
COMMENT ON COLUMN verification_attempts.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN verification_attempts.user_id IS 'User when known; nullable for attempts before session';
COMMENT ON COLUMN verification_attempts.email IS 'Email address used for the attempt';
COMMENT ON COLUMN verification_attempts.action IS 'verify = token check; resend = resend email request';
COMMENT ON COLUMN verification_attempts.status IS 'success or failure outcome';
COMMENT ON COLUMN verification_attempts.resend_count IS 'Resend count in current window for rate limit display';

-- =====================================================
-- ROLLBACK INSTRUCTIONS (for documentation only)
-- =====================================================
-- To rollback this migration, execute:
-- DROP TABLE IF EXISTS verification_attempts CASCADE;
