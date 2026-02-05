import { Link } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ConfirmationStatus = 'success' | 'error'

interface CheckoutConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  status: ConfirmationStatus
  orderId?: string | null
  message?: string
}

export function CheckoutConfirmationDialog({
  open,
  onOpenChange,
  status,
  orderId,
  message,
}: CheckoutConfirmationDialogProps) {
  const isSuccess = status === 'success'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-2xl border-border bg-card shadow-card sm:max-w-md"
        showClose
      >
        <DialogHeader>
          <div
            className={cn(
              'mx-auto flex h-14 w-14 items-center justify-center rounded-full',
              isSuccess ? 'bg-accent text-primary' : 'bg-destructive/10 text-destructive',
            )}
          >
            {isSuccess ? (
              <CheckCircle2 className="h-8 w-8" aria-hidden />
            ) : (
              <XCircle className="h-8 w-8" aria-hidden />
            )}
          </div>
          <DialogTitle className="text-center text-xl font-bold text-foreground">
            {isSuccess ? 'Order confirmed' : 'Payment failed'}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            {isSuccess ? (
              <>
                Thank you for your order. A confirmation email has been sent to your inbox.
                {orderId && (
                  <span className="mt-2 block text-sm">
                    Order ID: <code className="rounded bg-muted px-1 font-mono">{orderId}</code>
                  </span>
                )}
              </>
            ) : (
              message ?? 'Something went wrong. Please try again or use a different payment method.'
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          {isSuccess ? (
            <>
              <Button asChild variant="outline" className="rounded-xl">
                <Link to="/orders">
                  <FileText className="mr-2 h-4 w-4" />
                  View orders
                </Link>
              </Button>
              <Button asChild className="rounded-xl">
                <Link to="/listings">Continue shopping</Link>
              </Button>
            </>
          ) : (
            <Button
              type="button"
              className="rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              Try again
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
