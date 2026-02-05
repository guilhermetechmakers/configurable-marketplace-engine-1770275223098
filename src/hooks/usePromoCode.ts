import { useMutation } from '@tanstack/react-query'
import { promoCodesApi } from '@/api/promo-codes'
import type { PromoValidationResult } from '@/types/database/promo_code'

export const promoCodeKeys = {
  validate: (code: string) => ['promoCode', 'validate', code.trim()] as const,
}

export function useValidatePromoCode() {
  return useMutation({
    mutationFn: (code: string) => promoCodesApi.validate(code),
  })
}

export type { PromoValidationResult }
