import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MainLayout } from '@/components/layout/MainLayout'
import { AnimatedPage } from '@/components/AnimatedPage'
import { useCurrentUser } from '@/hooks/useAuth'
import { useMyListings } from '@/hooks/useListings'
import { useMyOrders } from '@/hooks/useOrders'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ShoppingBag,
  MessageSquare,
  Heart,
  PlusCircle,
  Package,
  TrendingUp,
} from 'lucide-react'

export function Dashboard() {
  const { data: user, isLoading: userLoading } = useCurrentUser()
  const { data: myListings, isLoading: listingsLoading } = useMyListings()
  const { data: ordersData, isLoading: ordersLoading } = useMyOrders()
  const isSeller = user?.role === 'seller'
  const listings = myListings ?? []

  if (userLoading) {
    return (
      <MainLayout>
        <AnimatedPage className="mx-auto max-w-7xl px-6 py-12">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="mt-8 h-32 w-full" />
        </AnimatedPage>
      </MainLayout>
    )
  }

  if (!user) {
    return (
      <MainLayout>
        <AnimatedPage className="mx-auto max-w-md px-6 py-12 text-center">
          <p className="text-muted-foreground">Please log in to view your dashboard.</p>
          <Button asChild className="mt-4">
            <Link to="/login">Log in</Link>
          </Button>
        </AnimatedPage>
      </MainLayout>
    )
  }

  const orders = ordersData?.data ?? []

  return (
    <MainLayout>
      <AnimatedPage className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back, {user.full_name ?? user.email}.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Orders
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <span className="text-2xl font-bold">{orders.length}</span>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Messages
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">0</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Saved
              </CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">0</span>
            </CardContent>
          </Card>
          {isSeller && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Listings
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {listingsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <span className="text-2xl font-bold">{listings.length}</span>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent orders</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/orders">View all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <Skeleton className="h-24 w-full" />
              ) : orders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No orders yet.</p>
              ) : (
                <ul className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <li
                      key={order.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <span className="text-sm font-medium">Order #{order.id.slice(0, 8)}</span>
                      <span className="text-sm text-muted-foreground">{order.status}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {isSeller && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Your listings</CardTitle>
                <Button size="sm" asChild>
                  <Link to="/listings/create">
                    <PlusCircle className="mr-2 h-4 w-4" /> New listing
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {listingsLoading ? (
                  <Skeleton className="h-24 w-full" />
                ) : listings.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No listings yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {listings.slice(0, 5).map((listing) => (
                      <li key={listing.id} className="flex items-center justify-between rounded-lg border p-3">
                        <Link
                          to={`/listings/${listing.id}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          {listing.title}
                        </Link>
                        <span className="text-sm text-muted-foreground">{listing.status}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-8">
          <Button asChild>
            <Link to="/listings">
              <ShoppingBag className="mr-2 h-4 w-4" /> Browse listings
            </Link>
          </Button>
        </div>
      </AnimatedPage>
    </MainLayout>
  )
}
