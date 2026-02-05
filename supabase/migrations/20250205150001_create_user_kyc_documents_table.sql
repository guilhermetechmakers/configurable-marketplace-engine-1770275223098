-- =====================================================
-- Migration: Create user_kyc_documents table
-- Created: 2025-02-05T15:00:01Z
-- Tables: user_kyc_documents
-- Purpose: Store KYC document uploads and verification status per user
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
-- TABLE: user_kyc_documents
-- Purpose: KYC document uploads and verification status
-- =====================================================
CREATE TABLE IF NOT EXISTS user_kyc_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  document_type TEXT NOT NULL CHECK (document_type IN ('id_front', 'id_back', 'proof_of_address', 'other')),
  file_url TEXT,
  file_name TEXT,
  upload_status TEXT NOT NULL DEFAULT 'pending' CHECK (upload_status IN ('pending', 'uploaded', 'failed')),
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS user_kyc_documents_user_id_idx ON user_kyc_documents(user_id);
CREATE INDEX IF NOT EXISTS user_kyc_documents_verification_status_idx ON user_kyc_documents(verification_status);

DROP TRIGGER IF EXISTS update_user_kyc_documents_updated_at ON user_kyc_documents;
CREATE TRIGGER update_user_kyc_documents_updated_at
  BEFORE UPDATE ON user_kyc_documents
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

ALTER TABLE user_kyc_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_kyc_documents_select_own"
  ON user_kyc_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_kyc_documents_insert_own"
  ON user_kyc_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_kyc_documents_update_own"
  ON user_kyc_documents FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_kyc_documents_delete_own"
  ON user_kyc_documents FOR DELETE
  USING (auth.uid() = user_id);

COMMENT ON TABLE user_kyc_documents IS 'KYC document uploads and verification status per user';
