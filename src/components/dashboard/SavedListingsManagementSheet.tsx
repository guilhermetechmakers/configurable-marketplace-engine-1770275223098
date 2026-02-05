import { Link } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { useMySavedListings, useRemoveSavedListing } from '@/hooks/useSavedListings'
import type { SavedListing } from '@/types/database/saved_listing'
import { Heart, Trash2, ExternalLink, Search } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface SavedListingsManagementSheetProps {
  userId: string | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SavedListingsManagementSheet({
  userId,
  open,
  onOpenChange,
}: SavedListingsManagementSheetProps) {
  const { data: savedList, isLoading } = useMySavedListings(userId)
  const removeSaved = useRemoveSavedListing()
  const items = savedList ?? []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[85vh] flex flex-col rounded-2xl border-border bg-card shadow-card sm:max-w-lg"
        showClose
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Saved listings
          </DialogTitle>
          <DialogDescription>
            Manage your saved listings and saved searches. Remove any you no longer need.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium text-foreground">No saved items</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Save listings or searches from the browse page to see them here.
            </p>
            <Button asChild className="mt-4" onClick={() => onOpenChange(false)}>
              <Link to="/listings">Browse listings</Link>
            </Button>
          </div>
        ) : (
          <ScrollArea className="max-h-[50vh] pr-2">
            <ul className="space-y-2">
              {items.map((item) => (
                <SavedListingRow
                  key={item.id}
                  item={item}
                  onRemove={() =>
                    removeSaved.mutate(item.id, {
                      onSuccess: () => {
                        if (items.length <= 1) onOpenChange(false)
                      },
                    })
                  }
                  isRemoving={removeSaved.isPending}
                />
              ))}
            </ul>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}

function SavedListingRow({
  item,
  onRemove,
  isRemoving,
}: {
  item: SavedListing
  onRemove: () => void
  isRemoving: boolean
}) {
  const isSearch = !item.listing_id && item.search_criteria && Object.keys(item.search_criteria).length > 0
  const label = item.name ?? (isSearch ? 'Saved search' : `Listing ${item.listing_id?.slice(0, 8) ?? ''}`)

  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 transition-shadow hover:shadow-card">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">
          Saved {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {item.listing_id && (
          <Button variant="ghost" size="icon" asChild aria-label="View listing">
            <Link to={`/listings/${item.listing_id}`} onClick={() => {}}>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={isRemoving}
          aria-label="Remove from saved"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </li>
  )
}
