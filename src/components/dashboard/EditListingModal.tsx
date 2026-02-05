import { useEffect } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Listing, ListingStatus } from '@/types/listing'

const editListingSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  summary: z.string().max(500).optional().or(z.literal('')),
  price_cents: z.coerce.number().min(0, 'Price must be ≥ 0').optional(),
  currency: z.string().min(1, 'Currency is required').max(10),
  status: z.enum(['draft', 'pending', 'published', 'archived']),
})

type EditListingFormValues = z.infer<typeof editListingSchema>

interface EditListingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  listing: Listing | null
  onSubmit: (values: {
    title: string
    summary?: string
    price_cents?: number
    currency: string
    status: ListingStatus
  }) => void
  isSubmitting?: boolean
}

export function EditListingModal({
  open,
  onOpenChange,
  listing,
  onSubmit,
  isSubmitting = false,
}: EditListingModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<EditListingFormValues>({
    resolver: zodResolver(editListingSchema),
    defaultValues: {
      title: '',
      summary: '',
      price_cents: 0,
      currency: 'USD',
      status: 'draft',
    },
  })

  const status = watch('status')

  useEffect(() => {
    if (listing) {
      reset({
        title: listing.title,
        summary: listing.summary ?? '',
        price_cents: listing.price_cents ?? 0,
        currency: listing.currency,
        status: listing.status,
      })
    }
  }, [listing, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-2xl border-border bg-card shadow-card sm:max-w-md"
        showClose
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            Edit listing
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update title, summary, price, and status. Changes are saved when you
            submit.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((values) =>
            onSubmit({
              title: values.title,
              summary: values.summary || undefined,
              price_cents: values.price_cents,
              currency: values.currency,
              status: values.status as ListingStatus,
            }),
          )}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="edit-listing-title">Title</Label>
            <Input
              id="edit-listing-title"
              {...register('title')}
              placeholder="Listing title"
              className="rounded-xl border-border focus-visible:ring-primary"
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-listing-summary">Summary</Label>
            <Textarea
              id="edit-listing-summary"
              {...register('summary')}
              placeholder="Brief description"
              rows={3}
              className="rounded-xl border-border focus-visible:ring-primary resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-listing-price">Price (cents)</Label>
              <Input
                id="edit-listing-price"
                type="number"
                min={0}
                {...register('price_cents')}
                className="rounded-xl border-border focus-visible:ring-primary"
              />
              {errors.price_cents && (
                <p className="text-xs text-destructive">
                  {errors.price_cents.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-listing-currency">Currency</Label>
              <Input
                id="edit-listing-currency"
                {...register('currency')}
                className="rounded-xl border-border focus-visible:ring-primary"
              />
              {errors.currency && (
                <p className="text-xs text-destructive">
                  {errors.currency.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setValue('status', v as EditListingFormValues['status'])}
            >
              <SelectTrigger className="rounded-xl border-border focus:ring-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving…' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
