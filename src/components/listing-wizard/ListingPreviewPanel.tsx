import { useFormContext } from 'react-hook-form'
import { Card, CardContent } from '@/components/ui/card'
import { Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ListingPreviewPanelProps {
  categoryName?: string
  className?: string
}

export function ListingPreviewPanel({
  categoryName,
  className,
}: ListingPreviewPanelProps) {
  const { watch } = useFormContext()
  const title = watch('title')
  const summary = watch('summary')
  const priceCents = watch('price_cents') as number | undefined
  const currency = watch('currency') ?? 'USD'
  const mediaUrls = (watch('media_urls') ?? []) as string[]

  const priceLabel =
    priceCents != null && priceCents > 0
      ? `${(priceCents / 100).toFixed(2)} ${currency}`
      : 'Price on request'

  return (
    <Card
      className={cn(
        'sticky top-4 overflow-hidden rounded-2xl border-border bg-card shadow-card',
        className,
      )}
    >
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground px-4 pt-4">
        Live preview
      </div>
      <CardContent className="p-4">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
          {mediaUrls[0] ? (
            <img
              src={mediaUrls[0]}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ImageIcon className="h-12 w-12" />
            </div>
          )}
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="font-bold text-foreground line-clamp-2">
            {title || 'Listing title'}
          </h3>
          {categoryName && (
            <p className="text-xs text-muted-foreground">{categoryName}</p>
          )}
          {summary && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {summary}
            </p>
          )}
          <p className="text-sm font-medium text-primary">{priceLabel}</p>
        </div>
      </CardContent>
    </Card>
  )
}
