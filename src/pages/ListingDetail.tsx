import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { MainLayout } from '@/components/layout/MainLayout'
import { AnimatedPage } from '@/components/AnimatedPage'
import { useListing } from '@/hooks/useListings'
import { useListingCategories } from '@/hooks/useListings'
import { useProfile } from '@/hooks/useProfile'
import { useCurrentUser } from '@/hooks/useAuth'
import { useListingReviews, useReviewAggregation, useSubmitReview } from '@/hooks/useReviews'
import { usePriceCalculation } from '@/hooks/useListingPrice'
import {
  ImageZoomModal,
  BookingInquiryForm,
  ReviewSubmissionForm,
  ListingDetailMessagingWidget,
} from '@/components/listing-detail'
import {
  Star,
  ShoppingCart,
  Calendar,
  ChevronRight,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BookingInquiryFormValues } from '@/components/listing-detail'
import type { ReviewSubmissionFormValues } from '@/components/listing-detail'

const BADGE_LABELS: Record<string, string> = {
  verified: 'Verified',
  instant_book: 'Instant book',
}

export function ListingDetail() {
  const { id } = useParams<{ id: string }>()
  const [quantity, setQuantity] = useState(1)
  const [zoomImage, setZoomImage] = useState<string | null>(null)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [inquiryMode, setInquiryMode] = useState<'book' | 'inquiry'>('inquiry')
  const [reviewFormOpen, setReviewFormOpen] = useState(false)

  const { data: listing, isLoading, isError } = useListing(id ?? '')
  const { data: categories } = useListingCategories()
  const { data: sellerProfile } = useProfile(listing?.seller_id)
  const { data: user } = useCurrentUser()
  const { data: reviews = [] } = useListingReviews(listing?.id ?? '')
  const { data: aggregation } = useReviewAggregation(listing?.id ?? '')
  const submitReview = useSubmitReview(listing?.id ?? '')
  const { totalCents, subtotalLabel, currency } = usePriceCalculation(listing, { quantity })

  const categoryName = useMemo(() => {
    if (!listing?.category_id || !categories?.length) return null
    const cat = categories.find((c) => c.id === listing.category_id)
    return cat?.name ?? null
  }, [listing?.category_id, categories])

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
        <AnimatedPage className="mx-auto max-w-7xl px-6 py-8">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="mt-6 aspect-video w-full rounded-2xl" />
          <Skeleton className="mt-6 h-10 w-2/3" />
          <Skeleton className="mt-4 h-24 w-full" />
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-40 rounded-2xl" />
              <Skeleton className="h-32 rounded-2xl" />
            </div>
            <Skeleton className="h-80 rounded-2xl" />
          </div>
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

  const mediaUrls = listing.media_urls?.length ? listing.media_urls : []
  const primaryMedia = mediaUrls[0]
  const sellerName = sellerProfile?.full_name ?? null
  const sellerAvatarUrl = sellerProfile?.avatar_url ?? null
  const ratingAverage = listing.rating_average ?? aggregation?.average ?? null
  const reviewCount = listing.review_count ?? aggregation?.count ?? 0
  const badges = listing.badges ?? []
  const attributes = listing.attributes && typeof listing.attributes === 'object'
    ? Object.entries(listing.attributes)
    : []

  const handleInquirySubmit = async (_values: BookingInquiryFormValues) => {
    // TODO: send inquiry (e.g. create conversation with message or booking request)
    await new Promise((r) => setTimeout(r, 500))
  }

  const handleReviewSubmit = async (values: ReviewSubmissionFormValues) => {
    if (!user?.id) return
    await submitReview.mutateAsync({
      user_id: user.id,
      rating: values.rating,
      comment: values.comment ?? null,
    })
  }

  return (
    <MainLayout>
      <AnimatedPage className="mx-auto max-w-7xl px-6 py-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link
                to="/listings"
                className="transition-colors hover:text-foreground"
              >
                Listings
              </Link>
            </li>
            {categoryName && (
              <>
                <li aria-hidden>
                  <ChevronRight className="h-4 w-4" />
                </li>
                <li>{categoryName}</li>
              </>
            )}
            <li aria-hidden>
              <ChevronRight className="h-4 w-4" />
            </li>
            <li className="font-medium text-foreground truncate max-w-[200px] sm:max-w-none">
              {listing.title}
            </li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left column: gallery, title, details, reviews, policies */}
          <div className="lg:col-span-2 space-y-6">
            {/* Media gallery */}
            <div className="space-y-3">
              <div
                className="aspect-video w-full overflow-hidden rounded-2xl bg-muted shadow-card transition-all duration-300 hover:shadow-lg"
                onClick={() => primaryMedia && setZoomImage(primaryMedia)}
              >
                {primaryMedia ? (
                  <img
                    src={primaryMedia}
                    alt={listing.title}
                    className="h-full w-full cursor-zoom-in object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              {mediaUrls.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {mediaUrls.slice(0, 5).map((url) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => setZoomImage(url)}
                      className="h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 border-transparent bg-muted transition-[border-color,shadow] hover:border-primary hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <img
                        src={url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & summary */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {badges.slice(0, 3).map((b) => (
                  <Badge
                    key={b}
                    variant="secondary"
                    className="bg-accent text-foreground"
                  >
                    {BADGE_LABELS[b] ?? b}
                  </Badge>
                ))}
              </div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                {listing.title}
              </h1>
              {listing.summary && (
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {listing.summary}
                </p>
              )}
            </div>

            {/* Dynamic attributes (collapsible) */}
            {attributes.length > 0 && (
              <Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                <Accordion type="single" collapsible defaultValue="attributes">
                  <AccordionItem value="attributes" className="border-b-0">
                    <AccordionTrigger className="px-6 py-4 text-left font-semibold">
                      Details
                    </AccordionTrigger>
                    <AccordionContent>
                      <dl className="px-6 pb-4 space-y-3">
                        {attributes.map(([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between gap-4 text-sm"
                          >
                            <dt className="text-muted-foreground capitalize">
                              {key.replace(/_/g, ' ')}
                            </dt>
                            <dd className="text-foreground font-medium text-right">
                              {value != null && value !== ''
                                ? String(value)
                                : '—'}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            )}

            {/* Reviews section */}
            <Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    Reviews
                  </h2>
                  {(ratingAverage != null || reviewCount > 0) && (
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Star className="h-5 w-5 fill-yellow text-yellow" />
                      <span className="font-medium text-foreground">
                        {ratingAverage != null ? ratingAverage.toFixed(1) : '—'}
                      </span>
                      <span>({reviewCount} review{reviewCount === 1 ? '' : 's'})</span>
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No reviews yet. Reviews appear after completed orders.
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {reviews.slice(0, 5).map((r) => (
                      <li
                        key={r.id}
                        className="border-b border-border pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  'h-4 w-4',
                                  star <= r.rating
                                    ? 'fill-yellow text-yellow'
                                    : 'text-muted',
                                )}
                              />
                            ))}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(r.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {r.comment && (
                          <p className="mt-2 text-sm text-foreground">{r.comment}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                {user?.id && user.id !== listing.seller_id && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    onClick={() => setReviewFormOpen(true)}
                  >
                    Write a review
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Policies & FAQs */}
            <Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <CardHeader>
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  Policies & FAQs
                </h2>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Cancellation, refund, and shipping policies are set by the seller.
                  Contact the seller for specific terms before purchasing.
                </p>
                <p>
                  Have a question? Use the &quot;Message seller&quot; button above.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right column: sticky price & booking panel + seller card */}
          <div className="space-y-6">
            <Card className="sticky top-24 overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-shadow duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <p className="text-2xl font-bold text-primary">
                  {listing.price_cents != null
                    ? `${(listing.price_cents / 100).toFixed(2)} ${listing.currency}`
                    : 'Price on request'}
                </p>
                {listing.price_cents != null && quantity > 1 && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {subtotalLabel} = {(totalCents ?? 0) / 100} {currency}
                  </p>
                )}
                {listing.price_cents != null && (
                  <div className="mt-4 flex items-center gap-2">
                    <label htmlFor="quantity" className="text-sm font-medium">
                      Quantity
                    </label>
                    <input
                      id="quantity"
                      type="number"
                      min={1}
                      max={99}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))
                      }
                      className="h-10 w-20 rounded-xl border border-input bg-background px-3 text-center text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                )}
                <div className="mt-6 flex flex-col gap-2">
                  <Button className="w-full transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]" asChild>
                    <Link to={`/checkout?listing=${listing.id}${quantity > 1 ? `&qty=${quantity}` : ''}`}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to cart
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    onClick={() => {
                      setInquiryMode('book')
                      setInquiryOpen(true)
                    }}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Book now
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    onClick={() => {
                      setInquiryMode('inquiry')
                      setInquiryOpen(true)
                    }}
                  >
                    Request quote
                  </Button>
                </div>
                <div className="mt-6">
                  <ListingDetailMessagingWidget
                    listingId={listing.id}
                    listingTitle={listing.title}
                    sellerId={listing.seller_id}
                    sellerName={sellerName}
                    sellerAvatarUrl={sellerAvatarUrl}
                  />
                </div>
                {(ratingAverage != null || reviewCount > 0) && (
                  <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow text-yellow" />
                    <span>
                      {ratingAverage != null ? ratingAverage.toFixed(1) : '—'}
                      {' '}({reviewCount} review{reviewCount === 1 ? '' : 's'})
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Seller card */}
            <Card className="overflow-hidden rounded-2xl border border-border bg-accent/50 shadow-card">
              <CardContent className="p-6">
                <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Seller
                </h3>
                <div className="mt-3 flex items-center gap-4">
                  <Avatar className="h-12 w-12 rounded-full border-2 border-border">
                    <AvatarImage src={sellerAvatarUrl ?? undefined} alt={sellerName ?? 'Seller'} />
                    <AvatarFallback className="bg-card text-foreground">
                      {(sellerName ?? 'S')
                        .split(/\s+/)
                        .map((s) => s[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground truncate">
                      {sellerName ?? 'Seller'}
                    </p>
                    {ratingAverage != null && (
                      <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-yellow text-yellow" />
                        {ratingAverage.toFixed(1)} · {reviewCount} review{reviewCount === 1 ? '' : 's'}
                      </p>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Use the &quot;Message seller&quot; button above to contact this seller.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modals */}
        {zoomImage && (
          <ImageZoomModal
            open={!!zoomImage}
            onOpenChange={(open) => !open && setZoomImage(null)}
            src={zoomImage}
            alt={listing.title}
          />
        )}
        <BookingInquiryForm
          open={inquiryOpen}
          onOpenChange={setInquiryOpen}
          listingTitle={listing.title}
          mode={inquiryMode}
          onSubmit={handleInquirySubmit}
        />
        <ReviewSubmissionForm
          open={reviewFormOpen}
          onOpenChange={setReviewFormOpen}
          listingTitle={listing.title}
          onSubmit={handleReviewSubmit}
          isLoading={submitReview.isPending}
        />
      </AnimatedPage>
    </MainLayout>
  )
}
