import type { PromoValidationResult } from '@/types/database/promo_code'

/** Single line item in checkout (from listing + quantity/dates) */
export interface CheckoutLineItem {
  listing_id: string
  title: string
  quantity: number
  unit_price_cents: number
  total_cents: number
  currency: string
  /** For booking mode */
  dates?: { start: string; end: string }
  image_url?: string | null
}

/** Billing or shipping address fields */
export interface AddressFields {
  line1: string
  line2?: string
  city: string
  state?: string
  postal_code: string
  country: string
  tax_id?: string
}

/** Fee breakdown for checkout */
export interface CheckoutFeeBreakdown {
  subtotal_cents: number
  platform_fee_cents: number
  discount_cents: number
  tax_cents: number
  total_cents: number
  currency: string
  seller_payout_cents: number
}

/** Applied promo for display */
export interface AppliedPromo {
  result: PromoValidationResult
  discount_cents: number
}
