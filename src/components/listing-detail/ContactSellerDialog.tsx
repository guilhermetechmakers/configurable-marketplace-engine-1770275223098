import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ContactSellerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sellerName: string | null
  sellerAvatarUrl: string | null
  listingTitle: string
  onStartConversation: () => void
  isLoading?: boolean
}

export function ContactSellerDialog({
  open,
  onOpenChange,
  sellerName,
  sellerAvatarUrl,
  listingTitle,
  onStartConversation,
  isLoading = false,
}: ContactSellerDialogProps) {
  const displayName = sellerName ?? 'Seller'
  const initials = displayName
    .split(/\s+/)
    .map((s) => s[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact seller</DialogTitle>
          <DialogDescription>
            Start a conversation about &quot;{listingTitle}&quot;
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4 py-4">
          <Avatar className="h-14 w-14 rounded-full border-2 border-border">
            <AvatarImage src={sellerAvatarUrl ?? undefined} alt={displayName} />
            <AvatarFallback className="bg-accent text-foreground text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{displayName}</p>
            <p className="text-sm text-muted-foreground">
              You can ask questions about the listing, availability, or request a quote.
            </p>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onStartConversation()
              onOpenChange(false)
            }}
            disabled={isLoading}
            className={cn(
              'transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]',
            )}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {isLoading ? 'Opening…' : 'Start conversation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
