import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/MainLayout'
import { AnimatedPage } from '@/components/AnimatedPage'
import { useListingsSearch, useListingCategories } from '@/hooks/useListings'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, MapPin } from 'lucide-react'

export function Listings() {
  const [query, setQuery] = useState('')
  const [categoryId, setCategoryId] = useState<string | undefined>()
  const [page, setPage] = useState(1)
  const { data: categories } = useListingCategories()
  const { data, isLoading, isError } = useListingsSearch({
    q: query || undefined,
    category_id: categoryId,
    page,
    limit: 12,
  })

  const listings = data?.data ?? []
  const totalPages = data ? Math.ceil(data.count / data.limit) : 0

  return (
    <MainLayout>
      <AnimatedPage className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground">Explore listings</h1>
        <p className="mt-1 text-muted-foreground">
          Search and filter by category to find what you need.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search keyword, location..."
              className="pl-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={categoryId === undefined ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoryId(undefined)}
            >
              All
            </Button>
            {categories?.map((cat) => (
              <Button
                key={cat.id}
                variant={categoryId === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategoryId(cat.id)}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Button variant="ghost" size="sm">
            <MapPin className="mr-2 h-4 w-4" /> Map view
          </Button>
        </div>

        {isLoading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        ) : isError ? (
          <Card className="mt-8">
            <CardContent className="py-12 text-center text-muted-foreground">
              Failed to load listings. Try again later.
            </CardContent>
          </Card>
        ) : listings.length === 0 ? (
          <Card className="mt-8">
            <CardContent className="py-12 text-center text-muted-foreground">
              No listings found. Try adjusting your search or filters.
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <Link key={listing.id} to={`/listings/${listing.id}`}>
                  <Card className="h-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="aspect-video w-full overflow-hidden rounded-t-2xl bg-muted">
                      {listing.media_urls?.[0] ? (
                        <img
                          src={listing.media_urls[0]}
                          alt={listing.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground">{listing.title}</h3>
                      {listing.summary && (
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {listing.summary}
                        </p>
                      )}
                      <p className="mt-2 font-medium text-primary">
                        {listing.price_cents != null
                          ? `${(listing.price_cents / 100).toFixed(2)} ${listing.currency}`
                          : 'Price on request'}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </AnimatedPage>
    </MainLayout>
  )
}
