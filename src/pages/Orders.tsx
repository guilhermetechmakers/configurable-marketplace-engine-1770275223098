import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MainLayout } from '@/components/layout/MainLayout'
import { AnimatedPage } from '@/components/AnimatedPage'
import { useMyOrders } from '@/hooks/useOrders'
import { useCurrentUser } from '@/hooks/useAuth'
import { Skeleton } from '@/components/ui/skeleton'

export function Orders() {
  const { data: user, isLoading: userLoading } = useCurrentUser()
  const { data, isLoading } = useMyOrders()
  const orders = data?.data ?? []

  if (userLoading) {
    return (
      <MainLayout>
        <AnimatedPage className="mx-auto max-w-4xl px-6 py-12">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="mt-8 h-64 w-full" />
        </AnimatedPage>
      </MainLayout>
    )
  }

  if (!user) {
    return (
      <MainLayout>
        <AnimatedPage className="mx-auto max-w-md px-6 py-12 text-center">
          <p className="text-muted-foreground">Please log in to view orders.</p>
          <Button asChild className="mt-4">
            <Link to="/login">Log in</Link>
          </Button>
        </AnimatedPage>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <AnimatedPage className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground">Order history</h1>
        <p className="mt-1 text-muted-foreground">
          View and manage your orders. Open an order for details, messages, or to start a dispute.
        </p>

        {isLoading ? (
          <Skeleton className="mt-8 h-64 w-full rounded-2xl" />
        ) : orders.length === 0 ? (
          <Card className="mt-8">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No orders yet.</p>
              <Button asChild className="mt-4">
                <Link to="/listings">Browse listings</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {(order.total_cents / 100).toFixed(2)} {order.currency} · {order.status}
                    </p>
                  </div>
                  <Badge variant="secondary">{order.status}</Badge>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/orders/${order.id}`}>View details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </AnimatedPage>
    </MainLayout>
  )
}
