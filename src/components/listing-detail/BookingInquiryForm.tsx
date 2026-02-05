import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Calendar, Loader2 } from 'lucide-react'

const inquirySchema = z.object({
  message: z.string().min(10, 'Please enter at least 10 characters'),
  preferred_start: z.string().optional(),
  preferred_end: z.string().optional(),
})

export type BookingInquiryFormValues = z.infer<typeof inquirySchema>

interface BookingInquiryFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  listingTitle: string
  mode: 'book' | 'inquiry'
  onSubmit: (values: BookingInquiryFormValues) => void | Promise<void>
  isLoading?: boolean
}

export function BookingInquiryForm({
  open,
  onOpenChange,
  listingTitle,
  mode,
  onSubmit,
  isLoading = false,
}: BookingInquiryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingInquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { message: '', preferred_start: '', preferred_end: '' },
  })

  const handleFormSubmit = async (values: BookingInquiryFormValues) => {
    await onSubmit(values)
    reset()
    onOpenChange(false)
  }

  const isBooking = mode === 'book'
  const title = isBooking ? 'Request booking' : 'Request quote'
  const description = isBooking
    ? `Send your preferred dates for "${listingTitle}". The seller will confirm availability.`
    : `Ask a question or request a quote for "${listingTitle}".`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {isBooking && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferred_start">Preferred start</Label>
                <Input
                  id="preferred_start"
                  type="date"
                  {...register('preferred_start')}
                  className="rounded-xl focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferred_end">Preferred end</Label>
                <Input
                  id="preferred_end"
                  type="date"
                  {...register('preferred_end')}
                  className="rounded-xl focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="inquiry_message">Message</Label>
            <Textarea
              id="inquiry_message"
              placeholder={
                isBooking
                  ? 'Add any details about your booking request…'
                  : 'Describe what you need or ask a question…'
              }
              rows={4}
              {...register('message')}
              className="rounded-xl focus-visible:ring-2 focus-visible:ring-ring"
            />
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message.message}</p>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Calendar className="mr-2 h-4 w-4" />
              )}
              {isBooking ? 'Send request' : 'Send inquiry'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
