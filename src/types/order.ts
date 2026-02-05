export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'disputed'

export type TransactionMode = 'checkout' | 'booking' | 'inquiry'

export interface Order {
  id: string
  buyer_id: string
  seller_id: string
  listing_id: string
  status: OrderStatus
  mode: TransactionMode
  total_cents: number
  platform_fee_cents: number
  seller_payout_cents: number
  currency: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}
