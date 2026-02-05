import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AnimatedPage } from '@/components/AnimatedPage'
import { useCurrentUser } from '@/hooks/useAuth'
import { useMyOrders } from '@/hooks/useOrders'
import { useMyConversations } from '@/hooks/useMessages'
import { useMySavedListings } from '@/hooks/useSavedListings'
import { useListingsSearch } from '@/hooks/useListings'
import { useAddRecommendation, useSetRecommendationFeedback, useMyRecommendations } from '@/hooks/useRecommendations'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Package,
  MessageSquare,
  Heart,
  Sparkles,
  PlusCircle,
  TrendingUp,
  ShoppingBag,
  Settings,
  HelpCircle,
} from 'lucide-react'
import { OrderDetailsModal } from '@/components/dashboard/OrderDetailsModal'
import { MessageReplyDialog } from '@/components/dashboard/MessageReplyDialog'
import { SavedListingsManagementSheet } from '@/components/dashboard/SavedListingsManagementSheet'
import { RecommendationFeedbackDialog } from '@/components/dashboard/RecommendationFeedbackDialog'
import type { Order } from '@/types/order'
import type { ConversationWithLastMessage } from '@/api/messages'
import type { Listing } from '@/types/listing'
import { cn } from '@/lib/utils'

export function Dashboard() {
  const { data: user, isLoading: userLoading } = useCurrentUser()
  const { data: ordersData, isLoading: ordersLoading } = useMyOrders()
  const { data: conversations = [], isLoading: conversationsLoading } = useMyConversations(user?.id)
  const { data: savedList = [], isLoading: savedLoading } = useMySavedListings(user?.id)
  const { data: recommendedListings } = useListingsSearch({ limit: 8 })
  const { data: myRecommendations = [] } = useMyRecommendations(user?.id, 50)

  const [orderModalId, setOrderModalId] = useState<string | null>(null)
  const [messageDialogConversation, setMessageDialogConversation] = useState<ConversationWithLastMessage | null>(null)
  const [savedSheetOpen, setSavedSheetOpen] = useState(false)
  const [recommendationDialogListing, setRecommendationDialogListing] = useState<Listing | null>(null)
  const [recommendationDialogRecId, setRecommendationDialogRecId] = useState<string | null>(null)

  const addRecommendation = useAddRecommendation()
  const setFeedback = useSetRecommendationFeedback()

  const orders = ordersData?.data ?? []
  const recommendations = recommendedListings?.data ?? []
  const unreadCount = conversations.reduce((acc, c) => acc + (c.unread_count ?? 0), 0)

  const handleRecommendationFeedback = (listing: Listing, feedback: 'like' | 'dislike') => {
    const existing = myRecommendations.find((r) => r.listing_id === listing.id)
    if (existing) {
      setFeedback.mutate({ id: existing.id, updates: { feedback } })
    } else if (user?.id) {
      addRecommendation.mutate({
        user_id: user.id,
        listing_id: listing.id,
        score: feedback === 'like' ? 1 : 0,
        feedback,
      })
    }
  }

  if (userLoading) {
    return (
      <AnimatedPage className="mx-auto max-w-7xl px-6 py-12">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-8 h-32 w-full" />
      </AnimatedPage>
    )
  }

  if (!user) {
    return (
      <AnimatedPage className="mx-auto max-w-md px-6 py-12 text-center">
        <p className="text-muted-foreground">Please log in to view your dashboard.</p>
        <Button asChild className="mt-4">
          <Link to="/login">Log in</Link>
        </Button>
      </AnimatedPage>
    )
  }

  const isSeller = user.role === 'seller'

  return (
    <>
    <AnimatedPage className="mx-auto max-w-7xl px-6 py-8 md:px-8">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="mt-1 text-muted-foreground">
              Welcome back, {user.full_name ?? user.email}.
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/profile">
                Profile
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/settings">
                <Settings className="mr-1.5 h-4 w-4" />
                Settings
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/help">
                <HelpCircle className="mr-1.5 h-4 w-4" />
                Help
              </Link>
            </Button>
          </nav>
        </header>

        {/* Summary cards */}
        <section className="mb-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              title="Orders"
              value={ordersLoading ? null : orders.length}
              icon={<Package className="h-5 w-5" />}
              href="/orders"
              delay={0}
            />
            <SummaryCard
              title="Messages"
              value={conversationsLoading ? null : conversations.length}
              subtitle={unreadCount > 0 ? `${unreadCount} unread` : undefined}
              icon={<MessageSquare className="h-5 w-5" />}
              href="/messages"
              delay={1}
            />
            <SummaryCard
              title="Saved"
              value={savedLoading ? null : savedList.length}
              icon={<Heart className="h-5 w-5" />}
              onClick={() => setSavedSheetOpen(true)}
              delay={2}
            />
            <SummaryCard
              title="Recommendations"
              value={recommendations.length}
              icon={<Sparkles className="h-5 w-5" />}
              delay={3}
            />
          </div>
        </section>

        {/* Main grid: Recent Orders + Messages Preview */}
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Recent Orders */}
          <Card className="lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Recent orders</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/orders">View all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <OrdersSkeleton />
              ) : orders.length === 0 ? (
                <EmptyOrders />
              ) : (
                <RecentOrdersList
                  orders={orders.slice(0, 5)}
                  onViewDetails={(id) => setOrderModalId(id)}
                />
              )}
            </CardContent>
          </Card>

          {/* Messages preview */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Messages</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/messages">Open inbox</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {conversationsLoading ? (
                <MessagesSkeleton />
              ) : conversations.length === 0 ? (
                <EmptyMessages />
              ) : (
                <MessagesPreviewList
                  conversations={conversations.slice(0, 3)}
                  onReply={(c) => setMessageDialogConversation(c)}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Saved listings */}
        <section className="mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Saved listings</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setSavedSheetOpen(true)}>
                Manage
              </Button>
            </CardHeader>
            <CardContent>
              {savedLoading ? (
                <Skeleton className="h-24 w-full rounded-xl" />
              ) : savedList.length === 0 ? (
                <EmptySavedList />
              ) : (
                <SavedListPreview items={savedList} onManage={() => setSavedSheetOpen(true)} />
              )}
            </CardContent>
          </Card>
        </section>

        {/* Recommendations */}
        <section className="mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Recommended for you</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/listings">Browse all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recommendations.length === 0 ? (
                <EmptyRecommendations />
              ) : (
                <RecommendationsGrid
                  listings={recommendations}
                  myRecommendations={myRecommendations}
                  onFeedback={(listing, recId) => {
                    setRecommendationDialogListing(listing)
                    setRecommendationDialogRecId(recId)
                  }}
                />
              )}
            </CardContent>
          </Card>
        </section>

        {/* Seller block */}
        {isSeller && (
          <section className="mt-8">
            <Card className="border-primary/20 bg-accent/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Seller tools
                </CardTitle>
                <Button size="sm" asChild>
                  <Link to="/listings/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New listing
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Manage your listings, orders, and payouts from the dashboard and listings pages.
                </p>
                <Button variant="outline" size="sm" asChild className="mt-3">
                  <Link to="/listings/create">Go to listings</Link>
                </Button>
              </CardContent>
            </Card>
          </section>
        )}

        <div className="mt-8">
          <Button asChild>
            <Link to="/listings">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Browse listings
            </Link>
          </Button>
        </div>
      </AnimatedPage>

      {/* Modals / dialogs */}
      <OrderDetailsModal
        orderId={orderModalId}
        open={orderModalId !== null}
        onOpenChange={(open) => !open && setOrderModalId(null)}
      />
      <MessageReplyDialog
        conversation={messageDialogConversation}
        currentUserId={user.id}
        open={messageDialogConversation !== null}
        onOpenChange={(open) => !open && setMessageDialogConversation(null)}
      />
      <SavedListingsManagementSheet
        userId={user.id}
        open={savedSheetOpen}
        onOpenChange={setSavedSheetOpen}
      />
      <RecommendationFeedbackDialog
        listing={recommendationDialogListing}
        recommendationId={recommendationDialogRecId}
        open={recommendationDialogListing !== null}
        onOpenChange={(open) => {
          if (!open) {
            setRecommendationDialogListing(null)
            setRecommendationDialogRecId(null)
          }
        }}
        onFeedback={(feedback) => {
          if (recommendationDialogListing) {
            handleRecommendationFeedback(recommendationDialogListing, feedback)
          }
        }}
        isPending={addRecommendation.isPending || setFeedback.isPending}
      />
    </>
  )
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  href,
  onClick,
  delay,
}: {
  title: string
  value: number | null
  subtitle?: string
  icon: React.ReactNode
  href?: string
  onClick?: () => void
  delay: number
}) {
  const content = (
    <Card
      className={cn(
        'transition-all duration-300 hover:shadow-lg',
        (href || onClick) && 'cursor-pointer',
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <span className="text-muted-foreground">{icon}</span>
      </CardHeader>
      <CardContent>
        {value === null ? (
          <Skeleton className="h-8 w-12" />
        ) : (
          <>
            <span className="text-2xl font-bold">{value}</span>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
  if (href) {
    return (
      <Link to={href} className="block animate-fade-in-up" style={{ animationDelay: `${delay * 50}ms` }}>
        {content}
      </Link>
    )
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="w-full text-left block animate-fade-in-up" style={{ animationDelay: `${delay * 50}ms` }}>
        {content}
      </button>
    )
  }
  return <div className="animate-fade-in-up" style={{ animationDelay: `${delay * 50}ms` }}>{content}</div>
}

function RecentOrdersList({
  orders,
  onViewDetails,
}: {
  orders: Order[]
  onViewDetails: (id: string) => void
}) {
  return (
    <ul className="space-y-2">
      {orders.map((order) => (
        <li
          key={order.id}
          className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card p-3 transition-shadow hover:shadow-card"
        >
          <div>
            <span className="text-sm font-medium">Order #{order.id.slice(0, 8)}</span>
            <span className="ml-2 text-sm text-muted-foreground">
              {(order.total_cents / 100).toFixed(2)} {order.currency}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {order.status}
            </span>
            <Button variant="outline" size="sm" onClick={() => onViewDetails(order.id)}>
              View details
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}

function MessagesPreviewList({
  conversations,
  onReply,
}: {
  conversations: ConversationWithLastMessage[]
  onReply: (c: ConversationWithLastMessage) => void
}) {
  return (
    <ul className="space-y-2">
      {conversations.map((c) => (
        <li
          key={c.id}
          className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card p-3 transition-shadow hover:shadow-card"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {c.subject ?? `Conversation ${c.id.slice(0, 8)}`}
            </p>
            {c.last_message && (
              <p className="truncate text-xs text-muted-foreground">
                {c.last_message.content}
              </p>
            )}
            {(c.unread_count ?? 0) > 0 && (
              <span className="text-xs text-primary">{c.unread_count ?? 0} unread</span>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={() => onReply(c)}>
            Reply
          </Button>
        </li>
      ))}
    </ul>
  )
}

function SavedListPreview({
  items,
  onManage,
}: {
  items: { id: string; listing_id: string | null; name: string | null }[]
  onManage: () => void
}) {
  const display = items.slice(0, 3)
  return (
    <div className="flex flex-wrap items-center gap-2">
      {display.map((item) => (
        <span
          key={item.id}
          className="rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-sm text-muted-foreground"
        >
          {item.name ?? (item.listing_id ? `Listing ${item.listing_id.slice(0, 8)}` : 'Saved search')}
        </span>
      ))}
      {items.length > 3 && (
        <span className="text-sm text-muted-foreground">+{items.length - 3} more</span>
      )}
      <Button variant="ghost" size="sm" onClick={onManage}>
        Manage
      </Button>
    </div>
  )
}

function RecommendationsGrid({
  listings,
  myRecommendations,
  onFeedback,
}: {
  listings: Listing[]
  myRecommendations: { id: string; listing_id: string }[]
  onFeedback: (listing: Listing, recId: string | null) => void
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {listings.slice(0, 8).map((listing) => {
        const rec = myRecommendations.find((r) => r.listing_id === listing.id)
        return (
          <Card
            key={listing.id}
            className="overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            <Link to={`/listings/${listing.id}`} className="block">
              <div className="aspect-video w-full bg-muted">
                {listing.media_urls?.[0] ? (
                  <img
                    src={listing.media_urls[0]}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <Sparkles className="h-8 w-8" />
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <p className="truncate text-sm font-medium">{listing.title}</p>
                <p className="text-sm text-muted-foreground">
                  {listing.price_cents != null
                    ? `${(listing.price_cents / 100).toFixed(2)} ${listing.currency}`
                    : '—'}
                </p>
              </CardContent>
            </Link>
            <div className="border-t border-border px-3 pb-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground"
                onClick={(e) => {
                  e.preventDefault()
                  onFeedback(listing, rec?.id ?? null)
                }}
              >
                Rate recommendation
              </Button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

function OrdersSkeleton() {
  return (
    <ul className="space-y-2">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-14 w-full rounded-xl" />
      ))}
    </ul>
  )
}

function MessagesSkeleton() {
  return (
    <ul className="space-y-2">
      {[1, 2].map((i) => (
        <Skeleton key={i} className="h-16 w-full rounded-xl" />
      ))}
    </ul>
  )
}

function EmptyOrders() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/30 py-8 text-center">
      <Package className="mx-auto h-10 w-10 text-muted-foreground" />
      <p className="mt-2 text-sm text-muted-foreground">No orders yet.</p>
      <Button asChild variant="outline" size="sm" className="mt-2">
        <Link to="/listings">Browse listings</Link>
      </Button>
    </div>
  )
}

function EmptyMessages() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/30 py-8 text-center">
      <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground" />
      <p className="mt-2 text-sm text-muted-foreground">No messages yet.</p>
      <Button asChild variant="outline" size="sm" className="mt-2">
        <Link to="/messages">Open inbox</Link>
      </Button>
    </div>
  )
}

function EmptySavedList() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/30 py-8 text-center">
      <Heart className="mx-auto h-10 w-10 text-muted-foreground" />
      <p className="mt-2 text-sm text-muted-foreground">No saved listings or searches.</p>
      <Button asChild variant="outline" size="sm" className="mt-2">
        <Link to="/listings">Browse listings</Link>
      </Button>
    </div>
  )
}

function EmptyRecommendations() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/30 py-8 text-center">
      <Sparkles className="mx-auto h-10 w-10 text-muted-foreground" />
      <p className="mt-2 text-sm text-muted-foreground">Browse listings to get personalized recommendations.</p>
      <Button asChild variant="outline" size="sm" className="mt-2">
        <Link to="/listings">Browse listings</Link>
      </Button>
    </div>
  )
}
