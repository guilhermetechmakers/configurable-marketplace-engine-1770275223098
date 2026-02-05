import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { PromoValidationResult } from '@/types/database/promo_code'

export const promoCodesApi = {
  /**
   * Validate a promo code for checkout. Returns discount details if valid and applicable.
   */
  validate: async (code: string): Promise<PromoValidationResult> => {
    if (!isSupabaseConfigured() || !supabase) {
      return {
        valid: false,
        code: code.trim(),
        discount_type: 'fixed',
        discount_value_cents: 0,
        discount_percent: null,
        message: 'Promo codes are not configured',
      }
    }
    const trimmed = code.trim()
    if (!trimmed) {
      return {
        valid: false,
        code: '',
        discount_type: 'fixed',
        discount_value_cents: 0,
        discount_percent: null,
        message: 'Enter a promo code',
      }
    }

    const { data, error } = await supabase
      .from('promo_codes')
      .select('id, code, discount_type, discount_value_cents, discount_percent, max_uses, used_count, expires_at')
      .eq('active', true)
      .ilike('code', trimmed)
      .maybeSingle()

    if (error) {
      return {
        valid: false,
        code: trimmed,
        discount_type: 'fixed',
        discount_value_cents: 0,
        discount_percent: null,
        message: 'Could not validate code',
      }
    }

    if (!data) {
      return {
        valid: false,
        code: trimmed,
        discount_type: 'fixed',
        discount_value_cents: 0,
        discount_percent: null,
        message: 'Invalid or expired promo code',
      }
    }

    const row = data as {
      id: string
      code: string
      discount_type: 'percent' | 'fixed'
      discount_value_cents: number
      discount_percent: number | null
      max_uses: number | null
      used_count: number
      expires_at: string | null
    }

    if (row.expires_at && new Date(row.expires_at) <= new Date()) {
      return {
        valid: false,
        code: trimmed,
        discount_type: 'fixed',
        discount_value_cents: 0,
        discount_percent: null,
        message: 'This promo code has expired',
      }
    }

    if (row.max_uses != null && row.used_count >= row.max_uses) {
      return {
        valid: false,
        code: trimmed,
        discount_type: 'fixed',
        discount_value_cents: 0,
        discount_percent: null,
        message: 'This promo code has reached its usage limit',
      }
    }

    return {
      valid: true,
      promo_code_id: row.id,
      code: row.code,
      discount_type: row.discount_type,
      discount_value_cents: row.discount_value_cents,
      discount_percent: row.discount_percent,
      message: 'Promo code applied',
    }
  },
}
