import { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { OrderStatus } from '@/types/order'

const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'paid',
  'processing',
  'shipped',
  'completed',
  'cancelled',
  'refunded',
  'disputed',
]

interface OrderStatusUpdateSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderId: string | null
  currentStatus: string
  onUpdate: (orderId: string, status: string) => void
  isSubmitting?: boolean
}

export function OrderStatusUpdateSheet({
  open,
  onOpenChange,
  orderId,
  currentStatus,
  onUpdate,
  isSubmitting = false,
}: OrderStatusUpdateSheetProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>(currentStatus)

  useEffect(() => {
    if (open) setSelectedStatus(currentStatus)
  }, [open, currentStatus])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (orderId && selectedStatus) {
      onUpdate(orderId, selectedStatus)
      onOpenChange(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="rounded-tl-2xl border-border bg-card shadow-card"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-foreground">
            Update order status
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Change the status of this order. The buyer may be notified.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="order-status">New status</Label>
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger
                id="order-status"
                className="rounded-xl border-border focus:ring-primary"
              >
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <SheetFooter className="gap-2 pt-4">
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
              {isSubmitting ? 'Updating…' : 'Update status'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
