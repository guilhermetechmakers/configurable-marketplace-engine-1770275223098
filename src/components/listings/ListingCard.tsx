import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'
import type { Listing } from '@/types/listing'
import { cn } from '@/lib/utils'

interface ListingCardProps {
  listing: Listing
  /** 'grid' | 'list' - list uses horizontal layout */
  variant?: 'grid' | 'list'
  className?: string
}

const BADGE_LABELS: Record<string, string> = {
  verified: 'Verified',
  instant_book: 'Instant book',
}

export function ListingCard({
  listing,
  variant = 'grid',
  className,
}: ListingCardProps) {
  const badges = listing.badges ?? []
  const priceLabel =
    listing.price_cents != null
      ? `${(listing.price_cents / 100).toFixed(2)} ${listing.currency}`
      : 'Price on request'

  if (variant === 'list') {
    return (
      <Card
        className={cn(
          'overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          className,
        )}
      >
        <Link
          to={`/listings/${listing.id}`}
          className="flex flex-col sm:flex-row sm:items-stretch"
          aria-label={`View ${listing.title}`}
        >
          <div className="relative h-40 w-full shrink-0 overflow-hidden bg-muted sm:h-32 sm:w-48">
            {listing.media_urls?.[0] ? (
              <img
                src={listing.media_urls[0]}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                No image
              </div>
            )}
            {badges.length > 0 && (
              <div className="absolute left-2 top-2 flex flex-wrap gap-1">
                {badges.slice(0, 2).map((b) => (
                  <Badge
                    key={b}
                    variant="secondary"
                    className="bg-card/90 text-xs"
                  >
                    {BADGE_LABELS[b] ?? b}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <CardContent className="flex flex-1 flex-col justify-between p-4 text-left">
            <div>
              <h3 className="font-semibold text-foreground">{listing.title}</h3>
              {listing.summary && (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {listing.summary}
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="font-medium text-primary">{priceLabel}</span>
                {listing.rating_average != null && (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star
                      className="h-4 w-4 fill-yellow text-yellow"
                      aria-hidden
                    />
                    {listing.rating_average.toFixed(1)}
                    {listing.review_count != null && (
                      <span>({listing.review_count})</span>
                    )}
                  </span>
                )}
              </div>
            </div>
            <span
              className="mt-3 inline-flex h-9 cursor-pointer items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-all hover:scale-[1.02] active:scale-[0.98]"
              aria-hidden
            >
              View details
            </span>
          </CardContent>
        </Link>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        'h-full overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        className,
      )}
    >
      <Link
        to={`/listings/${listing.id}`}
        className="flex h-full flex-col"
        aria-label={`View ${listing.title}`}
      >
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {listing.media_urls?.[0] ? (
            <img
              src={listing.media_urls[0]}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
              No image
            </div>
          )}
          {badges.length > 0 && (
            <div className="absolute left-2 top-2 flex flex-wrap gap-1">
              {badges.slice(0, 2).map((b) => (
                <Badge
                  key={b}
                  variant="secondary"
                  className="bg-card/90 text-xs"
                >
                  {BADGE_LABELS[b] ?? b}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <CardContent className="flex flex-1 flex-col p-4">
          <h3 className="font-semibold text-foreground">{listing.title}</h3>
          {listing.summary && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {listing.summary}
            </p>
          )}
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
            <span className="font-medium text-primary">{priceLabel}</span>
            {listing.rating_average != null && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star
                  className="h-4 w-4 fill-yellow text-yellow"
                  aria-hidden
                />
                {listing.rating_average.toFixed(1)}
                {listing.review_count != null && (
                  <span>({listing.review_count})</span>
                )}
              </span>
            )}
          </div>
          <span
            className="mt-3 inline-flex h-9 w-full cursor-pointer items-center justify-center rounded-xl bg-primary text-sm font-medium text-primary-foreground shadow transition-all hover:scale-[1.02] active:scale-[0.98]"
            aria-hidden
          >
            View details
          </span>
        </CardContent>
      </Link>
    </Card>
  )
}
