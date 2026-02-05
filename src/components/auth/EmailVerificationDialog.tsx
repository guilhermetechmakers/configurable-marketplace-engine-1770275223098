import { Link } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useResendVerification } from '@/hooks/useAuth'
import { Mail, Loader2 } from 'lucide-react'

interface EmailVerificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Email to resend verification to (e.g. after signup) */
  email?: string
}

export function EmailVerificationDialog({
  open,
  onOpenChange,
  email,
}: EmailVerificationDialogProps) {
  const resend = useResendVerification()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl border-border bg-card shadow-lg sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-7 w-7 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl font-bold text-foreground">
            Verify your email
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            We sent a verification link to your email. Click the link to activate
            your account. You can also complete your profile or go to the dashboard
            after verifying.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-2">
          <Button asChild className="w-full rounded-xl" size="lg">
            <Link to="/dashboard">Go to dashboard</Link>
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-xl"
            size="lg"
            disabled={resend.isPending}
            onClick={() => resend.mutate(email)}
          >
            {resend.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Resend verification email'
            )}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
              onClick={() => onOpenChange(false)}
            >
              Back to login
            </Link>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
