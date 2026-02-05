-- =====================================================
-- Migration: Add bio and verification_status to profiles
-- Created: 2025-02-05T15:00:00Z
-- Tables: profiles (alter)
-- Purpose: Support profile bio and KYC verification status display
-- =====================================================

-- Add bio column
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add verification_status (overall KYC status for display)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'none'
  CHECK (verification_status IN ('none', 'pending', 'approved', 'rejected'));

COMMENT ON COLUMN profiles.bio IS 'User bio / about text';
COMMENT ON COLUMN profiles.verification_status IS 'Overall KYC verification status: none, pending, approved, rejected';
