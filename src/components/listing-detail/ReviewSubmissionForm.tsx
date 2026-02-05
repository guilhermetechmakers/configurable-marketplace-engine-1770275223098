import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
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
import { Star, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
})

export type ReviewSubmissionFormValues = z.infer<typeof reviewSchema>

interface ReviewSubmissionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  listingTitle: string
  onSubmit: (values: ReviewSubmissionFormValues) => void | Promise<void>
  isLoading?: boolean
}

export function ReviewSubmissionForm({
  open,
  onOpenChange,
  listingTitle,
  onSubmit,
  isLoading = false,
}: ReviewSubmissionFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ReviewSubmissionFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: '' },
  })

  const rating = watch('rating')

  const handleFormSubmit = async (values: ReviewSubmissionFormValues) => {
    await onSubmit(values)
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Write a review</DialogTitle>
          <DialogDescription>
            Share your experience for &quot;{listingTitle}&quot;. Reviews help other buyers.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <input type="hidden" {...register('rating', { valueAsNumber: true })} />
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-1" role="group" aria-label="Star rating">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue('rating', value, { shouldValidate: true })}
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                  aria-label={`${value} star${value === 1 ? '' : 's'}`}
                >
                  <Star
                    className={cn(
                      'h-8 w-8 transition-colors',
                      value <= rating
                        ? 'fill-yellow text-yellow'
                        : 'text-muted-foreground',
                    )}
                  />
                </button>
              ))}
            </div>
            {errors.rating && (
              <p className="text-sm text-destructive">{errors.rating.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="review_comment">Comment (optional)</Label>
            <Textarea
              id="review_comment"
              placeholder="Tell others what you liked or what could be improved…"
              rows={4}
              {...register('comment')}
              className="rounded-xl focus-visible:ring-2 focus-visible:ring-ring"
            />
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
              disabled={isLoading || rating < 1}
              className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Star className="mr-2 h-4 w-4 fill-current" />
              )}
              Submit review
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
