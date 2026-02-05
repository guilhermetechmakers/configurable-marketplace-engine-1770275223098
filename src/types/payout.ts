/**
 * Payout types for seller dashboard
 */

export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'cancelled'

export interface Payout {
  id: string
  seller_id: string
  amount_cents: number
  currency: string
  status: PayoutStatus
  payout_date: string | null
  stripe_payout_id: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface SellerBalance {
  available_cents: number
  pending_cents: number
  currency: string
  next_payout_date: string | null
}
