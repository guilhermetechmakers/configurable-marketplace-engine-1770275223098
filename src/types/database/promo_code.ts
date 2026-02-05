/**
 * Database types for promo_codes table
 * Generated: 2025-02-05T19:00:00Z
 */

export type PromoDiscountType = 'percent' | 'fixed'

export interface PromoCode {
  id: string
  code: string
  discount_type: PromoDiscountType
  discount_value_cents: number
  discount_percent: number | null
  max_uses: number | null
  used_count: number
  expires_at: string | null
  active: boolean
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface PromoCodeInsert {
  id?: string
  code: string
  discount_type: PromoDiscountType
  discount_value_cents: number
  discount_percent?: number | null
  max_uses?: number | null
  used_count?: number
  expires_at?: string | null
  active?: boolean
  metadata?: Record<string, unknown>
}

export interface PromoCodeUpdate {
  active?: boolean
  used_count?: number
  metadata?: Record<string, unknown>
}

/** Result of validating a promo code for checkout */
export interface PromoValidationResult {
  valid: boolean
  promo_code_id?: string
  code: string
  discount_type: PromoDiscountType
  discount_value_cents: number
  discount_percent: number | null
  message?: string
}

export type PromoCodeRow = PromoCode
