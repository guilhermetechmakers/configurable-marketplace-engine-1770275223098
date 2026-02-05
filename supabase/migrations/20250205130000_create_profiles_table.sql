-- =====================================================
-- Migration: Create profiles table for user roles and metadata
-- Created: 2025-02-05T13:00:00Z
-- Tables: profiles
-- Purpose: Extend auth.users with full_name, role (buyer/seller), company for marketplace
-- =====================================================

-- Enable UUID extension (idempotent)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Helper function for updated_at (idempotent)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TABLE: profiles
-- Purpose: User profile (role, company) linked to auth.users
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller', 'admin', 'moderator')),
  company TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT profiles_user_id_unique UNIQUE (user_id)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own profile; insert own on signup
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role can manage all (admin); no delete policy for users (cascade from auth.users)

COMMENT ON TABLE profiles IS 'User profiles (role, company) extending Supabase auth.users';
COMMENT ON COLUMN profiles.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN profiles.user_id IS 'References auth.users(id)';
COMMENT ON COLUMN profiles.role IS 'Marketplace role: buyer, seller, admin, moderator';

-- =====================================================
-- TRIGGER: Create profile on auth.users signup
-- Purpose: Insert profiles row with role/full_name/company from signUp metadata
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r TEXT := COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'role'), ''), 'buyer');
  valid_role TEXT := CASE WHEN r IN ('buyer', 'seller', 'admin', 'moderator') THEN r ELSE 'buyer' END;
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role, company)
  VALUES (
    NEW.id,
    COALESCE(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    valid_role,
    NULLIF(TRIM(NEW.raw_user_meta_data->>'company'), '')
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();
