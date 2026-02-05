import { Link } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react'
import type { Listing } from '@/types/listing'

interface RecommendationFeedbackDialogProps {
  listing: Listing | null
  recommendationId?: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onFeedback: (feedback: 'like' | 'dislike') => void
  isPending: boolean
}

export function RecommendationFeedbackDialog({
  listing,
  recommendationId: _recommendationId,
  open,
  onOpenChange,
  onFeedback,
  isPending,
}: RecommendationFeedbackDialogProps) {
  if (!listing) return null

  const handleLike = () => {
    onFeedback('like')
    onOpenChange(false)
  }
  const handleDislike = () => {
    onFeedback('dislike')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-2xl border-border bg-card shadow-card sm:max-w-sm"
        showClose
      >
        <DialogHeader>
          <DialogTitle>Rate this recommendation</DialogTitle>
          <DialogDescription>
            Does &quot;{listing.title}&quot; match your interests? Your feedback helps us improve suggestions.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 py-2">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={handleLike}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <ThumbsUp className="h-4 w-4" />
                Like
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={handleDislike}
            disabled={isPending}
          >
            <ThumbsDown className="h-4 w-4" />
            Dislike
          </Button>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="ghost" asChild className="w-full sm:w-auto">
            <Link to={`/listings/${listing.id}`} onClick={() => onOpenChange(false)}>
              View listing
            </Link>
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Skip
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
