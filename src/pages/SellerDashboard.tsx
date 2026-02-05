import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { AnimatedPage } from '@/components/AnimatedPage'
import { useCurrentUser } from '@/hooks/useAuth'
import { useMyListings } from '@/hooks/useListings'
import { useSellerOrders } from '@/hooks/useOrders'
import { useMyBalance, useMyPayouts } from '@/hooks/usePayouts'
import { useMyConversations } from '@/hooks/useMessages'
import { useUpdateListing } from '@/hooks/useListings'
import { useUpdateOrderStatus } from '@/hooks/useOrders'
import {
  TrendingUp,
  Eye,
  ShoppingBag,
  Percent,
  PlusCircle,
  Pencil,
  Copy,
  Archive,
  MoreHorizontal,
  DollarSign,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EditListingModal } from '@/components/dashboard/EditListingModal'
import { OrderStatusUpdateSheet } from '@/components/dashboard/OrderStatusUpdateSheet'
import { PayoutDetailsDialog } from '@/components/dashboard/PayoutDetailsDialog'
import { IdentityVerificationForm } from '@/components/dashboard/IdentityVerificationForm'
import { MessageReplyDialog } from '@/components/dashboard/MessageReplyDialog'
import type { Listing } from '@/types/listing'
import type { Order } from '@/types/order'
import type { Payout } from '@/types/payout'
import type { ConversationWithLastMessage } from '@/api/messages'
import { cn } from '@/lib/utils'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const statusBadgeVariant: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  pending: 'secondary',
  paid: 'default',
  processing: 'default',
  shipped: 'default',
  completed: 'default',
  cancelled: 'destructive',
  refunded: 'outline',
  disputed: 'destructive',
  draft: 'outline',
  published: 'default',
  archived: 'secondary',
}

export function SellerDashboard() {
  const { data: user, isLoading: userLoading } = useCurrentUser()
  const { data: listings = [], isLoading: listingsLoading } = useMyListings()
  const { data: ordersRes, isLoading: ordersLoading } = useSellerOrders()
  const { data: balance, isLoading: balanceLoading } = useMyBalance()
  const { data: payouts = [], isLoading: payoutsLoading } = useMyPayouts({
    limit: 5,
  })
  const { data: conversations = [] } = useMyConversations(user?.id ?? '')

  const updateListing = useUpdateListing()
  const updateOrderStatus = useUpdateOrderStatus()

  const [editListing, setEditListing] = useState<Listing | null>(null)
  const [orderStatusOrder, setOrderStatusOrder] = useState<Order | null>(null)
  const [payoutDetail, setPayoutDetail] = useState<Payout | null>(null)
  const [showIdentityVerification, setShowIdentityVerification] =
    useState(false)
  const [messageConversation, setMessageConversation] =
    useState<ConversationWithLastMessage | null>(null)

  const orders = ordersRes?.data ?? []
  const unreadMessages = conversations.reduce(
    (acc, c) => acc + (c.unread_count ?? 0),
    0,
  )

  const earningsCents =
    orders
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + (o.seller_payout_cents ?? 0), 0) +
    (balance?.available_cents ?? 0)
  const conversion =
    listings.filter((l) => l.status === 'published').length > 0 && orders.length > 0
      ? Math.min(
          100,
          Math.round(
            (orders.length /
              Math.max(
                1,
                listings.filter((l) => l.status === 'published').length,
              )) *
              100,
          ),
        )
      : 0

  const chartData =
    payouts.length > 0
      ? payouts
          .slice(0, 7)
          .reverse()
          .map((p, i) => ({
            name: `P${i + 1}`,
            amount: p.amount_cents / 100,
            date: p.payout_date
              ? new Date(p.payout_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              : '—',
          }))
      : [{ name: 'P1', amount: 0, date: '—' }]

  if (userLoading) {
    return (
      <AnimatedPage className="p-6 md:p-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-8 h-32 w-full" />
      </AnimatedPage>
    )
  }

  if (!user || user.role !== 'seller') {
    return (
      <AnimatedPage className="p-6 md:p-8">
        <Card className="rounded-2xl border-border bg-card shadow-card">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Seller dashboard is only available for seller accounts.
            </p>
            <Button asChild className="mt-4">
              <Link to="/dashboard">Back to overview</Link>
            </Button>
          </CardContent>
        </Card>
      </AnimatedPage>
    )
  }

  return (
    <AnimatedPage className="p-6 md:p-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Seller dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage listings, orders, and payouts.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" className="rounded-xl">
            <Link to="/listings/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              New listing
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={() => setShowIdentityVerification(true)}
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            Verification
          </Button>
        </div>
      </header>

      {/* Performance metrics */}
      <section className="mb-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Earnings"
            value={
              balanceLoading ? null : `$${(earningsCents / 100).toFixed(2)}`
            }
            icon={<DollarSign className="h-5 w-5" />}
            accent="primary"
          />
          <MetricCard
            title="Orders"
            value={ordersLoading ? null : orders.length}
            icon={<ShoppingBag className="h-5 w-5" />}
          />
          <MetricCard
            title="Conversion"
            value={ordersLoading ? null : `${conversion}%`}
            icon={<Percent className="h-5 w-5" />}
          />
          <MetricCard
            title="Listings"
            value={listingsLoading ? null : listings.length}
            icon={<Eye className="h-5 w-5" />}
          />
        </div>
        <Card className="mt-6 rounded-2xl border-border bg-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Payout history
            </CardTitle>
          </CardHeader>
          <CardContent className="h-32">
            {payoutsLoading ? (
              <Skeleton className="h-full w-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="payoutGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="rgb(var(--primary))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="100%"
                        stopColor="rgb(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" hide />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.date ?? ''
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="rgb(var(--primary))"
                    strokeWidth={2}
                    fill="url(#payoutGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </section>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Main: Listings + Orders */}
        <div className="space-y-8 lg:col-span-3">
          <Card className="rounded-2xl border-border bg-card shadow-card transition-shadow hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Listings</CardTitle>
              <Button asChild size="sm" variant="outline" className="rounded-xl">
                <Link to="/listings/create">Create</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {listingsLoading ? (
                <ListingsTableSkeleton />
              ) : listings.length === 0 ? (
                <EmptyListings />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-muted-foreground">
                        <th className="pb-3 font-medium">Title</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium">Price</th>
                        <th className="w-24 pb-3 font-medium text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {listings.map((listing) => (
                        <tr
                          key={listing.id}
                          className="border-b border-border/50 transition-colors hover:bg-accent/30"
                        >
                          <td className="py-3 font-medium">
                            <Link
                              to={`/listings/${listing.id}`}
                              className="text-primary hover:underline"
                            >
                              {listing.title}
                            </Link>
                          </td>
                          <td className="py-3">
                            <Badge
                              variant={
                                statusBadgeVariant[listing.status] ?? 'secondary'
                              }
                            >
                              {listing.status}
                            </Badge>
                          </td>
                          <td className="py-3 text-muted-foreground">
                            {listing.price_cents != null
                              ? `${(listing.price_cents / 100).toFixed(2)} ${listing.currency}`
                              : '—'}
                          </td>
                          <td className="py-3 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  aria-label="Actions"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => setEditListing(listing)}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link
                                    to="/listings/create"
                                    state={{ duplicateFrom: listing }}
                                  >
                                    <Copy className="mr-2 h-4 w-4" />
                                    Duplicate
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    updateListing.mutate({
                                      id: listing.id,
                                      updates: { status: 'archived' },
                                    })
                                  }
                                >
                                  <Archive className="mr-2 h-4 w-4" />
                                  Archive
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border bg-card shadow-card transition-shadow hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Orders queue</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link to="/orders">View all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <OrdersQueueSkeleton />
              ) : orders.length === 0 ? (
                <EmptyOrdersQueue />
              ) : (
                <ul className="space-y-2">
                  {orders.slice(0, 8).map((order) => (
                    <li
                      key={order.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card p-3 transition-shadow hover:shadow-card"
                    >
                      <div>
                        <span className="text-sm font-medium">
                          #{order.id.slice(0, 8)}
                        </span>
                        <span className="ml-2 text-sm text-muted-foreground">
                          {(order.total_cents / 100).toFixed(2)} {order.currency}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            statusBadgeVariant[order.status] ?? 'secondary'
                          }
                        >
                          {order.status}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                          onClick={() => setOrderStatusOrder(order)}
                        >
                          Update
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Side panels */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="rounded-2xl border-border bg-accent/40 shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="h-4 w-4 text-primary" />
                Payouts & balance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {balanceLoading ? (
                <Skeleton className="h-20 w-full rounded-xl" />
              ) : (
                <>
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground">
                      Available
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      ${((balance?.available_cents ?? 0) / 100).toFixed(2)}{' '}
                      {balance?.currency ?? 'USD'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground">Pending</p>
                    <p className="text-xl font-bold text-foreground">
                      ${((balance?.pending_cents ?? 0) / 100).toFixed(2)}{' '}
                      {balance?.currency ?? 'USD'}
                    </p>
                  </div>
                  {balance?.next_payout_date && (
                    <p className="text-xs text-muted-foreground">
                      Next payout:{' '}
                      {new Date(
                        balance.next_payout_date,
                      ).toLocaleDateString()}
                    </p>
                  )}
                  {payouts.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        Recent payouts
                      </p>
                      <ul className="space-y-1">
                        {payouts.slice(0, 3).map((p) => (
                          <li key={p.id}>
                            <button
                              type="button"
                              className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm hover:bg-accent"
                              onClick={() => setPayoutDetail(p)}
                            >
                              <span>
                                {(p.amount_cents / 100).toFixed(2)}{' '}
                                {p.currency}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {p.status}
                              </Badge>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border bg-card shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="h-4 w-4" />
                Messages
                {unreadMessages > 0 && (
                  <Badge variant="default" className="text-xs">
                    {unreadMessages}
                  </Badge>
                )}
              </CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link to="/messages">Open</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {conversations.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No conversations yet.
                </p>
              ) : (
                <ul className="space-y-2">
                  {conversations.slice(0, 3).map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-2 text-left text-sm transition-shadow hover:shadow-card"
                        onClick={() => setMessageConversation(c)}
                      >
                        <span className="truncate">
                          {c.subject ?? `Conversation ${c.id.slice(0, 8)}`}
                        </span>
                        {(c.unread_count ?? 0) > 0 && (
                          <span className="text-xs text-primary">
                            {c.unread_count}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <footer className="mt-12 flex flex-wrap gap-4 border-t border-border pt-8">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/help">Help</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/settings">Settings</Link>
        </Button>
      </footer>

      <EditListingModal
        open={editListing !== null && editListing.id !== ''}
        onOpenChange={(open) => !open && setEditListing(null)}
        listing={editListing}
        onSubmit={(values) => {
          if (editListing?.id) {
            updateListing.mutate({
              id: editListing.id,
              updates: values,
            })
            setEditListing(null)
          }
        }}
        isSubmitting={updateListing.isPending}
      />

      <OrderStatusUpdateSheet
        open={orderStatusOrder !== null}
        onOpenChange={(open) => !open && setOrderStatusOrder(null)}
        orderId={orderStatusOrder?.id ?? null}
        currentStatus={orderStatusOrder?.status ?? 'pending'}
        onUpdate={(id, status) => updateOrderStatus.mutate({ id, status })}
        isSubmitting={updateOrderStatus.isPending}
      />

      <PayoutDetailsDialog
        open={payoutDetail !== null}
        onOpenChange={(open) => !open && setPayoutDetail(null)}
        payout={payoutDetail}
      />

      <IdentityVerificationForm
        open={showIdentityVerification}
        onOpenChange={setShowIdentityVerification}
      />

      {user && (
        <MessageReplyDialog
          conversation={messageConversation}
          currentUserId={user.id}
          open={messageConversation !== null}
          onOpenChange={(open) => !open && setMessageConversation(null)}
        />
      )}
    </AnimatedPage>
  )
}

function MetricCard({
  title,
  value,
  icon,
  accent,
}: {
  title: string
  value: number | string | null
  icon: React.ReactNode
  accent?: 'primary'
}) {
  return (
    <Card
      className={cn(
        'rounded-2xl border-border shadow-card transition-all duration-300 hover:shadow-lg',
        accent === 'primary' && 'border-primary/20 bg-accent/30',
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
          <Skeleton className="h-8 w-16" />
        ) : (
          <span className="text-2xl font-bold">{value}</span>
        )}
      </CardContent>
    </Card>
  )
}

function ListingsTableSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-12 w-full rounded-xl" />
      ))}
    </div>
  )
}

function OrdersQueueSkeleton() {
  return (
    <ul className="space-y-2">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-14 w-full rounded-xl" />
      ))}
    </ul>
  )
}

function EmptyListings() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/30 py-8 text-center">
      <Eye className="mx-auto h-10 w-10 text-muted-foreground" />
      <p className="mt-2 text-sm text-muted-foreground">No listings yet.</p>
      <Button asChild variant="outline" size="sm" className="mt-2 rounded-xl">
        <Link to="/listings/create">Create listing</Link>
      </Button>
    </div>
  )
}

function EmptyOrdersQueue() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/30 py-8 text-center">
      <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground" />
      <p className="mt-2 text-sm text-muted-foreground">No orders yet.</p>
      <Button asChild variant="outline" size="sm" className="mt-2 rounded-xl">
        <Link to="/listings">View listings</Link>
      </Button>
    </div>
  )
}
