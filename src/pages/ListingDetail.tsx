import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/MainLayout'
import { AnimatedPage } from '@/components/AnimatedPage'
import { useListing } from '@/hooks/useListings'
import { useCurrentUser } from '@/hooks/useAuth'
import { Skeleton } from '@/components/ui/skeleton'
import { Star, MessageCircle, ShoppingCart, Calendar } from 'lucide-react'

export function ListingDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: listing, isLoading, isError } = useListing(id ?? '')
  useCurrentUser()

  if (!id) {
    return (
      <MainLayout>
        <AnimatedPage className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-muted-foreground">Invalid listing.</p>
          <Button asChild className="mt-4">
            <Link to="/listings">Browse listings</Link>
          </Button>
        </AnimatedPage>
      </MainLayout>
    )
  }

  if (isLoading) {
    return (
      <MainLayout>
        <AnimatedPage className="mx-auto max-w-7xl px-6 py-12">
          <Skeleton className="aspect-video w-full rounded-2xl" />
          <Skeleton className="mt-6 h-10 w-2/3" />
          <Skeleton className="mt-4 h-24 w-full" />
        </AnimatedPage>
      </MainLayout>
    )
  }

  if (isError || !listing) {
    return (
      <MainLayout>
        <AnimatedPage className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-muted-foreground">Listing not found.</p>
          <Button asChild className="mt-4">
            <Link to="/listings">Browse listings</Link>
          </Button>
        </AnimatedPage>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <AnimatedPage className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-muted">
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
            <div>
              <h1 className="text-3xl font-bold text-foreground">{listing.title}</h1>
              {listing.summary && (
                <p className="mt-2 text-muted-foreground">{listing.summary}</p>
              )}
            </div>
            {Object.keys(listing.attributes).length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold">Details</h3>
                  <dl className="mt-4 space-y-2">
                    {Object.entries(listing.attributes).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <dt className="text-muted-foreground">{key}</dt>
                        <dd>{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold">Reviews</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  No reviews yet. Reviews appear after completed orders.
                </p>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <p className="text-2xl font-bold text-primary">
                  {listing.price_cents != null
                    ? `${(listing.price_cents / 100).toFixed(2)} ${listing.currency}`
                    : 'Price on request'}
                </p>
                <div className="mt-4 flex gap-4">
                  <Button className="flex-1" asChild>
                    <Link to={`/checkout?listing=${listing.id}`}>
                      <ShoppingCart className="mr-2 h-4 w-4" /> Add to cart
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" title="Book">
                    <Calendar className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" title="Message">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" className="mt-4 w-full">
                  Request quote
                </Button>
                <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 text-[#F6C244]" />
                  <span>No reviews yet</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AnimatedPage>
    </MainLayout>
  )
}
