import { useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MainLayout } from '@/components/layout/MainLayout'
import { AnimatedPage } from '@/components/AnimatedPage'
import { useCurrentUser } from '@/hooks/useAuth'
import { useListing } from '@/hooks/useListings'
import { usePaymentMethods } from '@/hooks/usePaymentMethods'
import { useCreateOrder } from '@/hooks/useOrders'
import {
  PromoCodeModal,
  BillingShippingForm,
  CheckoutConfirmationDialog,
  type BillingShippingFormRef,
  type ConfirmationStatus,
} from '@/components/checkout'
import type { CheckoutLineItem, CheckoutFeeBreakdown, AppliedPromo } from '@/types/checkout'
import type { UserPaymentMethod } from '@/types/database/user_payment_method'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tag,
  CreditCard,
  ShoppingBag,
  Loader2,
  ChevronRight,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const PLATFORM_FEE_PERCENT = 10
const TAX_PERCENT = 0

function formatMoney(cents: number, currency: string): string {
  return `${(cents / 100).toFixed(2)} ${currency}`
}

export function Checkout() {
  const [searchParams] = useSearchParams()
  const listingId = searchParams.get('listing') ?? ''
  const qty = Math.max(1, parseInt(searchParams.get('qty') ?? '1', 10) || 1)
  const billingFormRef = useRef<BillingShippingFormRef>(null)
  const [promoModalOpen, setPromoModalOpen] = useState(false)
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null)
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [confirmationStatus, setConfirmationStatus] = useState<ConfirmationStatus>('success')
  const [confirmationMessage, setConfirmationMessage] = useState<string | undefined>()
  const [orderId, setOrderId] = useState<string | null>(null)

  const { data: user, isLoading: userLoading } = useCurrentUser()
  const { data: listing, isLoading: listingLoading } = useListing(listingId)
  const { data: paymentMethods = [] } = usePaymentMethods(user?.id)
  const createOrder = useCreateOrder()

  const lineItem: CheckoutLineItem | null = useMemo(() => {
    if (!listing?.id || listing.price_cents == null) return null
    const unit = listing.price_cents
    const total = unit * qty
    return {
      listing_id: listing.id,
      title: listing.title,
      quantity: qty,
      unit_price_cents: unit,
      total_cents: total,
      currency: listing.currency ?? 'USD',
      image_url: listing.media_urls?.[0] ?? null,
    }
  }, [listing, qty])

  const breakdown: CheckoutFeeBreakdown | null = useMemo(() => {
    if (!lineItem) return null
    const subtotal_cents = lineItem.total_cents
    const platform_fee_cents = Math.round(
      (subtotal_cents * PLATFORM_FEE_PERCENT) / 100,
    )
    const discount_cents = appliedPromo?.discount_cents ?? 0
    const afterDiscount = Math.max(0, subtotal_cents - discount_cents)
    const tax_cents = Math.round((afterDiscount * TAX_PERCENT) / 100)
    const total_cents = afterDiscount + platform_fee_cents + tax_cents
    const seller_payout_cents = afterDiscount - platform_fee_cents
    return {
      subtotal_cents,
      platform_fee_cents,
      discount_cents,
      tax_cents,
      total_cents,
      currency: lineItem.currency,
      seller_payout_cents: Math.max(0, seller_payout_cents),
    }
  }, [lineItem, appliedPromo])

  const isLoading = userLoading || (!!listingId && listingLoading)

  if (isLoading) {
    return (
      <MainLayout>
        <AnimatedPage className="mx-auto max-w-5xl px-6 py-12">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="mt-8 h-64 w-full rounded-2xl" />
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <Skeleton className="h-96 rounded-2xl" />
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        </AnimatedPage>
      </MainLayout>
    )
  }

  if (!user) {
    return (
      <MainLayout>
        <AnimatedPage className="mx-auto max-w-md px-6 py-12 text-center">
          <p className="text-muted-foreground">Please log in to checkout.</p>
          <Button asChild className="mt-4 rounded-xl">
            <Link to="/login">Log in</Link>
          </Button>
        </AnimatedPage>
      </MainLayout>
    )
  }

  if (!listingId || !listing) {
    return (
      <MainLayout>
        <AnimatedPage className="mx-auto max-w-md px-6 py-12 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-bold text-foreground">
            No items to checkout
          </h2>
          <p className="mt-2 text-muted-foreground">
            Add an item from a listing to continue.
          </p>
          <Button asChild className="mt-6 rounded-xl">
            <Link to="/listings">Browse listings</Link>
          </Button>
        </AnimatedPage>
      </MainLayout>
    )
  }

  if (!lineItem || !breakdown) {
    return (
      <MainLayout>
        <AnimatedPage className="mx-auto max-w-md px-6 py-12 text-center">
          <p className="text-muted-foreground">This listing may not be available for purchase.</p>
          <Button asChild className="mt-4 rounded-xl">
            <Link to="/listings">Browse listings</Link>
          </Button>
        </AnimatedPage>
      </MainLayout>
    )
  }

  const handleApplyPromo = (code: string, discountCents: number, promoCodeId?: string) => {
    setAppliedPromo({
      result: {
        valid: true,
        code,
        discount_type: 'fixed',
        discount_value_cents: discountCents,
        discount_percent: null,
        promo_code_id: promoCodeId,
        message: 'Applied',
      },
      discount_cents: discountCents,
    })
    toast.success(`Promo "${code}" applied`)
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
    toast.success('Promo code removed')
  }

  const handlePlaceOrder = async () => {
    const billingRef = billingFormRef.current
    if (!billingRef) {
      toast.error('Please fill in billing and shipping details')
      return
    }
    const addressData = await billingRef.validateAndGetValues()
    if (!addressData) {
      toast.error('Please fix the billing and shipping form errors')
      return
    }

    createOrder.mutate(
      {
        listing_id: listing.id,
        quantity: qty,
        promo_code_id: appliedPromo?.result.promo_code_id,
        billing_address: addressData.billing as unknown as Record<string, string>,
        shipping_address: addressData.shipping
          ? (addressData.shipping as unknown as Record<string, string>)
          : undefined,
      },
      {
        onSuccess: (order) => {
          setOrderId(order.id)
          setConfirmationStatus('success')
          setConfirmationMessage(undefined)
          setConfirmationOpen(true)
        },
        onError: (err) => {
          setOrderId(null)
          setConfirmationStatus('error')
          setConfirmationMessage(err.message ?? 'Payment could not be completed.')
          setConfirmationOpen(true)
        },
      },
    )
  }

  const defaultPayment = paymentMethods.find((p) => p.is_default) ?? paymentMethods[0]
  const effectivePaymentId = selectedPaymentId ?? defaultPayment?.id ?? null

  return (
    <MainLayout>
      <AnimatedPage className="mx-auto max-w-5xl px-6 py-8 md:px-8 lg:px-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link to="/listings" className="transition-colors hover:text-foreground">
                Listings
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-4 w-4" />
            </li>
            <li className="font-medium text-foreground">Checkout</li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Checkout
        </h1>
        <p className="mt-1 text-muted-foreground">
          Review your order, apply a promo code, and enter payment details.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Left: Order summary, promo, payment, billing */}
          <div className="space-y-6">
            <Card className="overflow-hidden rounded-2xl border-border bg-card shadow-card transition-shadow duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  Order summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  {lineItem.image_url ? (
                    <img
                      src={lineItem.image_url}
                      alt=""
                      className="h-20 w-20 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                      No image
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground">{lineItem.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {lineItem.quantity} × {formatMoney(lineItem.unit_price_cents, lineItem.currency)}
                    </p>
                    <p className="mt-1 font-medium text-foreground">
                      {formatMoney(lineItem.total_cents, lineItem.currency)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">
                      {formatMoney(breakdown.subtotal_cents, breakdown.currency)}
                    </span>
                  </div>
                  {breakdown.discount_cents > 0 && (
                    <div className="flex justify-between text-sm text-primary">
                      <span>Discount ({appliedPromo?.result.code})</span>
                      <span>-{formatMoney(breakdown.discount_cents, breakdown.currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Platform fee ({PLATFORM_FEE_PERCENT}%)</span>
                    <span className="text-foreground">
                      {formatMoney(breakdown.platform_fee_cents, breakdown.currency)}
                    </span>
                  </div>
                  {breakdown.tax_cents > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="text-foreground">
                        {formatMoney(breakdown.tax_cents, breakdown.currency)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      {formatMoney(breakdown.total_cents, breakdown.currency)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Promo code</Label>
                  {appliedPromo ? (
                    <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-accent/50 px-4 py-2">
                      <span className="font-medium text-primary">{appliedPromo.result.code}</span>
                      <span className="text-sm text-muted-foreground">
                        -{formatMoney(appliedPromo.discount_cents, breakdown.currency)}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={handleRemovePromo}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter code"
                        className="rounded-xl border-input shadow-sm focus-visible:ring-ring"
                        readOnly
                        onFocus={() => setPromoModalOpen(true)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="shrink-0 rounded-xl"
                        onClick={() => setPromoModalOpen(true)}
                      >
                        <Tag className="mr-2 h-4 w-4" />
                        Apply
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden rounded-2xl border-border bg-card shadow-card transition-shadow duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {paymentMethods.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No saved payment methods. Stripe Elements integration can be added here for new card entry. For now, place order to continue (backend may accept test mode).
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {paymentMethods.map((pm: UserPaymentMethod) => (
                      <li key={pm.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedPaymentId(pm.id)}
                          className={cn(
                            'flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition-all duration-200',
                            effectivePaymentId === pm.id
                              ? 'border-primary bg-accent/50 shadow-sm'
                              : 'border-border bg-card hover:border-primary/50',
                          )}
                        >
                          <span className="font-medium text-foreground">
                            {pm.display_name ?? `${pm.brand ?? 'Card'} •••• ${pm.last_four ?? '****'}`}
                          </span>
                          {effectivePaymentId === pm.id && (
                            <span className="text-sm text-primary">Selected</span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="text-xs text-muted-foreground">
                  Payment is processed securely. You can add or manage payment methods in your{' '}
                  <Link to="/profile" className="text-primary underline hover:no-underline">
                    profile
                  </Link>
                  .
                </p>
              </CardContent>
            </Card>

            <BillingShippingForm ref={billingFormRef} className="rounded-2xl" />
          </div>

          {/* Right: Sticky summary + CTA */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card className="overflow-hidden rounded-2xl border-border bg-accent/30 shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground">
                  Payout summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seller receives</span>
                    <span className="font-medium text-foreground">
                      {formatMoney(breakdown.seller_payout_cents, breakdown.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform fee</span>
                    <span className="text-foreground">
                      {formatMoney(breakdown.platform_fee_cents, breakdown.currency)}
                    </span>
                  </div>
                </div>
                <div className="border-t border-border pt-4">
                  <Button
                    type="button"
                    size="lg"
                    className="w-full rounded-xl transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    onClick={handlePlaceOrder}
                    disabled={createOrder.isPending}
                  >
                    {createOrder.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing…
                      </>
                    ) : (
                      `Place order · ${formatMoney(breakdown.total_cents, breakdown.currency)}`
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <PromoCodeModal
          open={promoModalOpen}
          onOpenChange={setPromoModalOpen}
          onApplied={handleApplyPromo}
          subtotalCents={breakdown.subtotal_cents}
          currency={breakdown.currency}
        />

        <CheckoutConfirmationDialog
          open={confirmationOpen}
          onOpenChange={setConfirmationOpen}
          status={confirmationStatus}
          orderId={orderId}
          message={confirmationMessage}
        />
      </AnimatedPage>
    </MainLayout>
  )
}
