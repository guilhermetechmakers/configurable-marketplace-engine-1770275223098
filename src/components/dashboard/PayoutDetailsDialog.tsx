import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Payout } from '@/types/payout'
import { DollarSign, Calendar } from 'lucide-react'

interface PayoutDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  payout: Payout | null
  isLoading?: boolean
}

const statusVariant: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  pending: 'secondary',
  processing: 'default',
  paid: 'default',
  failed: 'destructive',
  cancelled: 'outline',
}

export function PayoutDetailsDialog({
  open,
  onOpenChange,
  payout,
  isLoading = false,
}: PayoutDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[85vh] rounded-2xl border-border bg-card shadow-card sm:max-w-md"
        showClose
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Payout details
          </DialogTitle>
          <DialogDescription>
            Transaction history and payout information.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : !payout ? (
          <p className="text-sm text-muted-foreground">No payout selected.</p>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                #{payout.id.slice(0, 8)}
              </span>
              <span
                className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                  statusVariant[payout.status] === 'destructive'
                    ? 'border-destructive text-destructive'
                    : statusVariant[payout.status] === 'default'
                      ? 'border-primary bg-accent text-primary'
                      : 'border-border text-muted-foreground'
                }`}
              >
                {payout.status}
              </span>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-2xl font-bold text-foreground">
                {(payout.amount_cents / 100).toFixed(2)} {payout.currency}
              </p>
            </div>
            <dl className="grid gap-2 text-sm">
              {payout.payout_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <dt className="text-muted-foreground">Payout date</dt>
                  <dd className="font-medium">
                    {new Date(payout.payout_date).toLocaleDateString()}
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Created</dt>
                <dd>
                  {new Date(payout.created_at).toLocaleDateString()}
                </dd>
              </div>
            </dl>
            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
