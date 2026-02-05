import { Link } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

interface ResendConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Rate limit info, e.g. "You can request another email in 15 minutes." */
  rateLimitInfo?: string
}

export function ResendConfirmationDialog({
  open,
  onOpenChange,
  rateLimitInfo = 'You can request another verification email in 15 minutes if needed.',
}: ResendConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl border-border bg-card shadow-lg sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-7 w-7 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl font-bold text-foreground">
            Verification email sent
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Check your inbox and click the link to verify your account.{' '}
            {rateLimitInfo}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-2">
          <Button asChild className="w-full rounded-xl" size="lg">
            <Link to="/login" onClick={() => onOpenChange(false)}>
              Back to login
            </Link>
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {rateLimitInfo}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
