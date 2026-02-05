/**
 * Database types for user_payment_methods table
 * Generated: 2025-02-05T15:00:02Z
 */

export type PaymentMethodType = 'card' | 'bank_account'

export interface UserPaymentMethod {
  id: string
  user_id: string
  payment_type: PaymentMethodType
  display_name: string | null
  last_four: string | null
  brand: string | null
  is_default: boolean
  stripe_payment_method_id: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface UserPaymentMethodInsert {
  id?: string
  user_id: string
  payment_type: PaymentMethodType
  display_name?: string | null
  last_four?: string | null
  brand?: string | null
  is_default?: boolean
  stripe_payment_method_id?: string | null
  metadata?: Record<string, unknown>
}

export interface UserPaymentMethodUpdate {
  display_name?: string | null
  is_default?: boolean
  metadata?: Record<string, unknown>
}

export type UserPaymentMethodRow = UserPaymentMethod
