import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { UserPaymentMethod } from '@/types/database/user_payment_method'

const paymentMethodSchema = z.object({
  payment_type: z.enum(['card', 'bank_account']),
  display_name: z.string().min(1, 'Display name is required').max(80),
  last_four: z.string().length(4).optional().or(z.literal('')),
  brand: z.string().max(32).optional().or(z.literal('')),
  is_default: z.boolean().optional(),
})

type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>

interface AddEditPaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paymentMethod?: UserPaymentMethod | null
  onSubmit: (values: PaymentMethodFormValues) => void
  isSubmitting?: boolean
}

export function AddEditPaymentDialog({
  open,
  onOpenChange,
  paymentMethod,
  onSubmit,
  isSubmitting = false,
}: AddEditPaymentDialogProps) {
  const isEdit = Boolean(paymentMethod?.id)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      payment_type: paymentMethod?.payment_type ?? 'card',
      display_name: paymentMethod?.display_name ?? '',
      last_four: paymentMethod?.last_four ?? '',
      brand: paymentMethod?.brand ?? '',
      is_default: paymentMethod?.is_default ?? false,
    },
  })

  const paymentType = watch('payment_type')

  const onOpenChangeHandler = (next: boolean) => {
    if (next) {
      reset({
        payment_type: paymentMethod?.payment_type ?? 'card',
        display_name: paymentMethod?.display_name ?? '',
        last_four: paymentMethod?.last_four ?? '',
        brand: paymentMethod?.brand ?? '',
        is_default: paymentMethod?.is_default ?? false,
      })
    }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeHandler}>
      <DialogContent
        className="rounded-2xl border-border bg-card shadow-card sm:max-w-md"
        showClose
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {isEdit ? 'Edit payment method' : 'Add payment method'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEdit
              ? 'Update the display name or set as default.'
              : 'Add a card or bank account for checkout and payouts.'}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((values) => {
            onSubmit(values)
            onOpenChange(false)
          })}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={paymentType}
              onValueChange={(v) =>
                setValue('payment_type', v as 'card' | 'bank_account')
              }
            >
              <SelectTrigger className="rounded-xl border-input shadow-sm focus:ring-ring">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="bank_account">Bank account</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment-display_name">Display name</Label>
            <Input
              id="payment-display_name"
              placeholder={
                paymentType === 'card' ? 'e.g. Visa •••• 4242' : 'Bank account'
              }
              className="rounded-xl border-input shadow-sm focus-visible:ring-ring"
              {...register('display_name')}
            />
            {errors.display_name && (
              <p className="text-sm text-destructive">
                {errors.display_name.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <Label htmlFor="payment-is_default" className="cursor-pointer">
              Set as default payment method
            </Label>
            <Switch
              id="payment-is_default"
              checked={watch('is_default')}
              onCheckedChange={(v) => setValue('is_default', v)}
            />
          </div>
          {!isEdit && (
            <>
              <div className="space-y-2">
                <Label htmlFor="payment-last_four">Last 4 digits (optional)</Label>
                <Input
                  id="payment-last_four"
                  placeholder="4242"
                  maxLength={4}
                  className="rounded-xl border-input shadow-sm focus-visible:ring-ring w-24"
                  {...register('last_four')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-brand">Brand (optional)</Label>
                <Input
                  id="payment-brand"
                  placeholder="Visa, Mastercard, etc."
                  className="rounded-xl border-input shadow-sm focus-visible:ring-ring"
                  {...register('brand')}
                />
              </div>
            </>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChangeHandler(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : isEdit ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
