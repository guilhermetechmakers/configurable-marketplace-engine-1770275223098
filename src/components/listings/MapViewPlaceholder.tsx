import { MapPin } from 'lucide-react'
import type { Listing } from '@/types/listing'
import { cn } from '@/lib/utils'

interface MapViewPlaceholderProps {
  listings: Listing[]
  onSelectListing?: (id: string) => void
  className?: string
}

/**
 * Placeholder for map view. When a map API (e.g. Mapbox, Google Maps) is integrated,
 * replace with a real map component that shows pins and clustering.
 */
export function MapViewPlaceholder({
  listings,
  onSelectListing,
  className,
}: MapViewPlaceholderProps) {
  const withLocation = listings.filter(
    (l) => l.latitude != null && l.longitude != null,
  )

  return (
    <div
      className={cn(
        'flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-border bg-muted/50 p-8 text-center',
        className,
      )}
      role="img"
      aria-label="Map view of listings"
    >
      <MapPin className="h-12 w-12 text-muted-foreground" aria-hidden />
      <p className="mt-3 text-sm font-medium text-foreground">Map view</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {withLocation.length > 0
          ? `${withLocation.length} listing(s) with location. Map integration can show pins and clustering here.`
          : 'Listings with location will appear on the map when a map provider is connected.'}
      </p>
      {withLocation.length > 0 && (
        <ul className="mt-4 flex flex-wrap justify-center gap-2">
          {withLocation.slice(0, 5).map((l) => (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => onSelectListing?.(l.id)}
                className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
              >
                {l.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
