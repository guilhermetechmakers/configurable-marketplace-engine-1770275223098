/**
 * Database types for user_kyc_documents table
 * Generated: 2025-02-05T15:00:01Z
 */

export type KycDocumentType = 'id_front' | 'id_back' | 'proof_of_address' | 'other'
export type KycUploadStatus = 'pending' | 'uploaded' | 'failed'
export type KycVerificationStatus = 'pending' | 'approved' | 'rejected'

export interface UserKycDocument {
  id: string
  user_id: string
  document_type: KycDocumentType
  file_url: string | null
  file_name: string | null
  upload_status: KycUploadStatus
  verification_status: KycVerificationStatus
  rejection_reason: string | null
  created_at: string
  updated_at: string
}

export interface UserKycDocumentInsert {
  id?: string
  user_id: string
  document_type: KycDocumentType
  file_url?: string | null
  file_name?: string | null
  upload_status?: KycUploadStatus
  verification_status?: KycVerificationStatus
  rejection_reason?: string | null
}

export interface UserKycDocumentUpdate {
  file_url?: string | null
  file_name?: string | null
  upload_status?: KycUploadStatus
  verification_status?: KycVerificationStatus
  rejection_reason?: string | null
}

export type UserKycDocumentRow = UserKycDocument
