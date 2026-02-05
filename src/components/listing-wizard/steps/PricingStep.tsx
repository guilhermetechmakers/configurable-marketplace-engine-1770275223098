import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const CURRENCIES = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
]

export function PricingStep() {
  const { watch, setValue, formState: { errors } } = useFormContext()
  const priceCents = watch('price_cents') as number | undefined
  const currency = watch('currency') ?? 'USD'
  const displayValue = priceCents != null && priceCents > 0 ? priceCents / 100 : ''

  return (
    <Card className="rounded-2xl border-border bg-card shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-foreground">
          Pricing
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Set the base price and currency. Discounts and fees can be configured later.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="listing-price">Price ({currency})</Label>
            <Input
              id="listing-price"
              type="number"
              min={0}
              step={0.01}
              placeholder="0.00"
              value={displayValue}
              onChange={(e) => {
                const v = e.target.value
                setValue('price_cents', v === '' ? undefined : Math.round(Number(v) * 100))
              }}
              className="rounded-xl border-border focus-visible:ring-primary"
            />
            {errors.price_cents && (
              <p className="text-xs text-destructive">
                {(errors.price_cents as { message?: string }).message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="listing-currency">Currency</Label>
            <Select
              value={currency}
              onValueChange={(v) => setValue('currency', v)}
            >
              <SelectTrigger
                id="listing-currency"
                className="rounded-xl border-border focus:ring-primary"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
