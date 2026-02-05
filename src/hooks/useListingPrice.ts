import { useMemo } from 'react'
import type { Listing } from '@/types/listing'

export interface PriceCalculationOptions {
  quantity?: number
  /** For booking mode: number of nights or days */
  nightsOrDays?: number
}

/**
 * Computes total price for a listing based on quantity or duration.
 * Uses listing.price_cents and currency; supports simple quantity or nightly/daily rate.
 */
export function usePriceCalculation(
  listing: Listing | undefined,
  options: PriceCalculationOptions = {},
): { totalCents: number | null; subtotalLabel: string; currency: string } {
  const { quantity = 1, nightsOrDays } = options

  return useMemo(() => {
    if (!listing) {
      return { totalCents: null, subtotalLabel: '', currency: 'USD' }
    }
    const priceCents = listing.price_cents ?? 0
    const currency = listing.currency ?? 'USD'
    const multiplier = nightsOrDays != null ? Math.max(1, nightsOrDays) : quantity
    const totalCents = priceCents * multiplier
    const subtotalLabel =
      nightsOrDays != null
        ? `${(priceCents / 100).toFixed(2)} ${currency} × ${nightsOrDays} night(s)`
        : quantity > 1
          ? `${(priceCents / 100).toFixed(2)} ${currency} × ${quantity}`
          : ''
    return { totalCents, subtotalLabel, currency }
  }, [listing, quantity, nightsOrDays])
}
