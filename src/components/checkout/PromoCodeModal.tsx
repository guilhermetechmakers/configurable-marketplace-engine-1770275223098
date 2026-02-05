import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useValidatePromoCode } from '@/hooks/usePromoCode'
import { Tag, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PromoCodeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplied: (code: string, discountCents: number, promoCodeId?: string) => void
  subtotalCents: number
  currency: string
}

export function PromoCodeModal({
  open,
  onOpenChange,
  onApplied,
  subtotalCents,
  currency,
}: PromoCodeModalProps) {
  const [code, setCode] = useState('')
  const validate = useValidatePromoCode()

  const result = validate.data
  const isValid = result?.valid ?? false
  const message = result?.message

  useEffect(() => {
    if (!open) {
      setCode('')
      validate.reset()
    }
  }, [open, validate.reset])

  const handleApply = () => {
    if (!code.trim()) return
    validate.mutate(code.trim(), {
      onSuccess: (data) => {
        if (data.valid && subtotalCents > 0) {
          const discountCents =
            data.discount_type === 'percent' && data.discount_percent != null
              ? Math.round((subtotalCents * data.discount_percent) / 100)
              : data.discount_value_cents
          const capped = Math.min(discountCents, subtotalCents)
          onApplied(data.code, capped, data.promo_code_id)
          onOpenChange(false)
        }
      },
    })
  }

  const discountCentsPreview =
    result?.valid && result.discount_type === 'percent' && result.discount_percent != null
      ? Math.round((subtotalCents * result.discount_percent) / 100)
      : result?.valid
        ? result.discount_value_cents
        : 0
  const cappedPreview = Math.min(discountCentsPreview, subtotalCents)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-2xl border-border bg-card shadow-card sm:max-w-md"
        showClose
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
            <Tag className="h-5 w-5 text-primary" />
            Promo code
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter your discount code to apply it to this order.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="promo-code-input">Code</Label>
            <div className="flex gap-2">
              <Input
                id="promo-code-input"
                placeholder="e.g. SAVE10"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                className={cn(
                  'rounded-xl border-input shadow-sm focus-visible:ring-ring',
                  isValid && 'border-primary',
                  result && !result.valid && 'border-destructive',
                )}
                disabled={validate.isPending}
                aria-invalid={result ? !result.valid : undefined}
                aria-describedby={message ? 'promo-message' : undefined}
              />
              <Button
                type="button"
                onClick={handleApply}
                disabled={!code.trim() || validate.isPending}
                className="shrink-0 rounded-xl"
              >
                {validate.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Apply'
                )}
              </Button>
            </div>
            {message && (
              <p
                id="promo-message"
                className={cn(
                  'flex items-center gap-2 text-sm',
                  isValid ? 'text-primary' : 'text-destructive',
                )}
              >
                {isValid ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 shrink-0" />
                )}
                {message}
              </p>
            )}
            {isValid && cappedPreview > 0 && (
              <p className="text-sm text-muted-foreground">
                You will save {(cappedPreview / 100).toFixed(2)} {currency} on this order.
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {isValid && (
            <Button
              type="button"
              onClick={() => {
                const discountCents =
                  result!.discount_type === 'percent' && result!.discount_percent != null
                    ? Math.round((subtotalCents * result!.discount_percent) / 100)
                    : result!.discount_value_cents
                onApplied(result!.code, Math.min(discountCents, subtotalCents), result!.promo_code_id)
                onOpenChange(false)
              }}
            >
              Use this code
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
