/**
 * Database types for seller_settings table
 * Generated: 2025-02-05T15:00:04Z
 */

export type PayoutSchedule = 'daily' | 'weekly' | 'monthly'

export interface SellerSettings {
  id: string
  user_id: string
  storefront_name: string | null
  storefront_slug: string | null
  payout_schedule: PayoutSchedule
  shipping_enabled: boolean
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface SellerSettingsInsert {
  id?: string
  user_id: string
  storefront_name?: string | null
  storefront_slug?: string | null
  payout_schedule?: PayoutSchedule
  shipping_enabled?: boolean
  metadata?: Record<string, unknown>
}

export interface SellerSettingsUpdate {
  storefront_name?: string | null
  storefront_slug?: string | null
  payout_schedule?: PayoutSchedule
  shipping_enabled?: boolean
  metadata?: Record<string, unknown>
}

export type SellerSettingsRow = SellerSettings
