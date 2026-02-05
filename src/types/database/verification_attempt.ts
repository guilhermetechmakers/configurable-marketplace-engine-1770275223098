/**
 * Database types for verification_attempts table
 * Generated: 2025-02-05T14:00:00Z
 */

export type VerificationAction = 'verify' | 'resend'
export type VerificationAttemptStatus = 'success' | 'failure'

export interface VerificationAttempt {
  id: string
  user_id: string | null
  email: string
  action: VerificationAction
  status: VerificationAttemptStatus
  resend_count: number
  metadata: Record<string, unknown>
  created_at: string
}

export interface VerificationAttemptInsert {
  id?: string
  user_id?: string | null
  email: string
  action: VerificationAction
  status: VerificationAttemptStatus
  resend_count?: number
  metadata?: Record<string, unknown>
}

export type VerificationAttemptRow = VerificationAttempt
