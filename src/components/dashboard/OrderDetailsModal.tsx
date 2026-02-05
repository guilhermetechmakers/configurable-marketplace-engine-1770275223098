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
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useOrder } from '@/hooks/useOrders'
import type { Order } from '@/types/order'
import { Package, ExternalLink } from 'lucide-react'

interface OrderDetailsModalProps {
  orderId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'secondary',
  paid: 'default',
  processing: 'default',
  shipped: 'default',
  completed: 'default',
  cancelled: 'destructive',
  refunded: 'outline',
  disputed: 'destructive',
}

export function OrderDetailsModal({
  orderId,
  open,
  onOpenChange,
}: OrderDetailsModalProps) {
  const { data: order, isLoading, isError } = useOrder(orderId ?? '')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[85vh] rounded-2xl border-border bg-card shadow-card sm:max-w-lg"
        showClose
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Order details
          </DialogTitle>
          <DialogDescription>
            View order summary and actions.
          </DialogDescription>
        </DialogHeader>

        {!orderId ? (
          <p className="text-sm text-muted-foreground">No order selected.</p>
        ) : isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : isError || !order ? (
          <p className="text-sm text-destructive">Failed to load order.</p>
        ) : (
          <OrderDetailsContent order={order} />
        )}

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {orderId && (
            <Button asChild>
              <Link to={`/orders`} onClick={() => onOpenChange(false)}>
                View all orders
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function OrderDetailsContent({ order }: { order: Order }) {
  const variant = statusVariant[order.status] ?? 'secondary'
  const total = (order.total_cents / 100).toFixed(2)
  const fee = (order.platform_fee_cents / 100).toFixed(2)

  return (
    <div className="space-y-4 animate-in fade-in-0 duration-200">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Order #{order.id.slice(0, 8)}
        </span>
        <Badge variant={variant}>{order.status}</Badge>
      </div>
      <Separator />
      <dl className="grid gap-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Total</dt>
          <dd className="font-medium">
            {total} {order.currency}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Platform fee</dt>
          <dd>{fee} {order.currency}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Mode</dt>
          <dd className="capitalize">{order.mode}</dd>
        </div>
      </dl>
      <Separator />
      <p className="text-xs text-muted-foreground">
        Created {new Date(order.created_at).toLocaleDateString()}. Use the order history page for
        messages, refunds, or disputes.
      </p>
    </div>
  )
}
