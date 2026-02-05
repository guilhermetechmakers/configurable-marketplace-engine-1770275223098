import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertCircle, Loader2 } from 'lucide-react'

interface VerificationFailedDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onResend: () => void
  isResendPending: boolean
  /** Optional rate limit message, e.g. "You can request a new email every 15 minutes." */
  rateLimitMessage?: string
}

export function VerificationFailedDialog({
  open,
  onOpenChange,
  onResend,
  isResendPending,
  rateLimitMessage = 'You can request a new verification email every 15 minutes.',
}: VerificationFailedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl border-border bg-card shadow-lg sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>
          <DialogTitle className="text-center text-xl font-bold text-foreground">
            Verification failed
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            The link may have expired or is invalid. You can request a new
            verification email below. {rateLimitMessage}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-2">
          <Button
            className="w-full rounded-xl"
            size="lg"
            disabled={isResendPending}
            onClick={() => onResend()}
          >
            {isResendPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Resend verification email'
            )}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {rateLimitMessage}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
