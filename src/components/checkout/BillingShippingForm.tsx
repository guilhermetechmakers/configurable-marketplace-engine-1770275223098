import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { MapPin } from 'lucide-react'
import type { AddressFields } from '@/types/checkout'
import { cn } from '@/lib/utils'

const billingSchema = z.object({
  line1: z.string().min(1, 'Address line 1 is required').max(120),
  line2: z.string().max(120).optional().or(z.literal('')),
  city: z.string().min(1, 'City is required').max(80),
  state: z.string().max(50).optional().or(z.literal('')),
  postal_code: z.string().min(1, 'Postal code is required').max(20),
  country: z.string().min(1, 'Country is required').max(2),
  tax_id: z.string().max(50).optional().or(z.literal('')),
  same_as_shipping: z.boolean().optional(),
  shipping_line1: z.string().max(120).optional().or(z.literal('')),
  shipping_line2: z.string().max(120).optional().or(z.literal('')),
  shipping_city: z.string().max(80).optional().or(z.literal('')),
  shipping_state: z.string().max(50).optional().or(z.literal('')),
  shipping_postal_code: z.string().max(20).optional().or(z.literal('')),
  shipping_country: z.string().max(2).optional().or(z.literal('')),
})

export type BillingShippingFormValues = z.infer<typeof billingSchema>

export interface BillingShippingFormRef {
  validateAndGetValues: () => Promise<{
    billing: AddressFields
    shipping: AddressFields | null
  } | null>
}

interface BillingShippingFormProps {
  defaultValues?: Partial<BillingShippingFormValues>
  onSubmit?: (billing: AddressFields, shipping: AddressFields | null) => void
  isSubmitting?: boolean
  className?: string
  /** When true, form shows a submit button that calls onSubmit. When false, parent uses ref to get values on Place order. */
  showSubmitButton?: boolean
}

export const BillingShippingForm = forwardRef<
  BillingShippingFormRef,
  BillingShippingFormProps
>(function BillingShippingForm(
  {
    defaultValues,
    onSubmit,
    isSubmitting = false,
    className,
    showSubmitButton = false,
  },
  ref,
) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<BillingShippingFormValues>({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      same_as_shipping: true,
      country: 'US',
      ...defaultValues,
    },
  })

  const sameAsShipping = watch('same_as_shipping')

  useImperativeHandle(ref, () => ({
    validateAndGetValues: async () => {
      const valid = await trigger()
      if (!valid) return null
      const values = getValues()
      const billing: AddressFields = {
        line1: values.line1,
        line2: values.line2 || undefined,
        city: values.city,
        state: values.state || undefined,
        postal_code: values.postal_code,
        country: values.country,
        tax_id: values.tax_id || undefined,
      }
      const useSame = values.same_as_shipping !== false
      const shipping: AddressFields | null = useSame
        ? { ...billing }
        : {
            line1: values.shipping_line1 || values.line1,
            line2: values.shipping_line2 || undefined,
            city: values.shipping_city || values.city,
            state: values.shipping_state || undefined,
            postal_code: values.shipping_postal_code || values.postal_code,
            country: values.shipping_country || values.country,
          }
      return { billing, shipping }
    },
  }), [trigger, getValues])

  const handleFormSubmit = (values: BillingShippingFormValues) => {
    if (!onSubmit) return
    const billing: AddressFields = {
      line1: values.line1,
      line2: values.line2 || undefined,
      city: values.city,
      state: values.state || undefined,
      postal_code: values.postal_code,
      country: values.country,
      tax_id: values.tax_id || undefined,
    }
    const shipping: AddressFields | null = sameAsShipping
      ? { ...billing }
      : {
          line1: values.shipping_line1 || values.line1,
          line2: values.shipping_line2 || undefined,
          city: values.shipping_city || values.city,
          state: values.shipping_state || undefined,
          postal_code: values.shipping_postal_code || values.postal_code,
          country: values.shipping_country || values.country,
        }
    onSubmit(billing, shipping)
  }

  return (
    <Card
      className={cn(
        'overflow-hidden rounded-2xl border-border bg-card shadow-card transition-shadow duration-300 hover:shadow-lg',
        className,
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
          <MapPin className="h-5 w-5 text-primary" />
          Billing &amp; shipping
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm font-medium text-muted-foreground">Billing address</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="billing-line1">Address line 1</Label>
                <Input
                  id="billing-line1"
                  placeholder="Street address"
                  className="rounded-xl border-input shadow-sm focus-visible:ring-ring"
                  {...register('line1')}
                />
                {errors.line1 && (
                  <p className="text-sm text-destructive">{errors.line1.message}</p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="billing-line2">Address line 2 (optional)</Label>
                <Input
                  id="billing-line2"
                  placeholder="Apt, suite, etc."
                  className="rounded-xl border-input shadow-sm focus-visible:ring-ring"
                  {...register('line2')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing-city">City</Label>
                <Input
                  id="billing-city"
                  className="rounded-xl border-input shadow-sm focus-visible:ring-ring"
                  {...register('city')}
                />
                {errors.city && (
                  <p className="text-sm text-destructive">{errors.city.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing-state">State / Province</Label>
                <Input
                  id="billing-state"
                  className="rounded-xl border-input shadow-sm focus-visible:ring-ring"
                  {...register('state')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing-postal_code">Postal code</Label>
                <Input
                  id="billing-postal_code"
                  className="rounded-xl border-input shadow-sm focus-visible:ring-ring"
                  {...register('postal_code')}
                />
                {errors.postal_code && (
                  <p className="text-sm text-destructive">{errors.postal_code.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing-country">Country</Label>
                <Input
                  id="billing-country"
                  placeholder="US"
                  className="rounded-xl border-input shadow-sm focus-visible:ring-ring"
                  {...register('country')}
                />
                {errors.country && (
                  <p className="text-sm text-destructive">{errors.country.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="billing-tax_id">Tax / VAT ID (optional)</Label>
              <Input
                id="billing-tax_id"
                placeholder="For business purchases"
                className="rounded-xl border-input shadow-sm focus-visible:ring-ring"
                {...register('tax_id')}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 rounded-xl border border-border p-4">
            <Checkbox
              id="same_as_shipping"
              checked={sameAsShipping}
              onCheckedChange={(v) => setValue('same_as_shipping', v === true)}
            />
            <Label htmlFor="same_as_shipping" className="cursor-pointer text-sm font-medium">
              Shipping address same as billing
            </Label>
          </div>

          {!sameAsShipping && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-sm font-medium text-muted-foreground">Shipping address</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="shipping-line1">Address line 1</Label>
                  <Input
                    id="shipping-line1"
                    className="rounded-xl border-input shadow-sm focus-visible:ring-ring"
                    {...register('shipping_line1')}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="shipping-line2">Address line 2 (optional)</Label>
                  <Input
                    id="shipping-line2"
                    className="rounded-xl border-input shadow-sm focus-visible:ring-ring"
                    {...register('shipping_line2')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipping-city">City</Label>
                  <Input
                    id="shipping-city"
                    className="rounded-xl border-input shadow-sm focus-visible:ring-ring"
                    {...register('shipping_city')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipping-state">State / Province</Label>
                  <Input
                    id="shipping-state"
                    className="rounded-xl border-input shadow-sm focus-visible:ring-ring"
                    {...register('shipping_state')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipping-postal_code">Postal code</Label>
                  <Input
                    id="shipping-postal_code"
                    className="rounded-xl border-input shadow-sm focus-visible:ring-ring"
                    {...register('shipping_postal_code')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipping-country">Country</Label>
                  <Input
                    id="shipping-country"
                    className="rounded-xl border-input shadow-sm focus-visible:ring-ring"
                    {...register('shipping_country')}
                  />
                </div>
              </div>
            </div>
          )}

          {showSubmitButton && onSubmit && (
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-xl transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving…' : 'Continue to payment'}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  )
})
