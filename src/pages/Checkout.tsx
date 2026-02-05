import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MainLayout } from '@/components/layout/MainLayout'
import { AnimatedPage } from '@/components/AnimatedPage'
import { useCurrentUser } from '@/hooks/useAuth'
import { Skeleton } from '@/components/ui/skeleton'

export function Checkout() {
  const { data: user, isLoading } = useCurrentUser()

  if (isLoading) {
    return (
      <MainLayout>
        <AnimatedPage className="mx-auto max-w-2xl px-6 py-12">
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
          <p className="text-muted-foreground">Please log in to checkout.</p>
          <Button asChild className="mt-4">
            <Link to="/login">Log in</Link>
          </Button>
        </AnimatedPage>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <AnimatedPage className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
        <p className="mt-1 text-muted-foreground">
          Review your order and enter payment details.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Order summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Order summary will load from cart/listing.
              </p>
              <div className="mt-4 space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>—</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform fee</span>
                  <span>—</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>—</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="promo">Promo code</Label>
                <Input id="promo" placeholder="Enter code" />
              </div>
              <div className="space-y-2">
                <Label>Payment method</Label>
                <p className="text-sm text-muted-foreground">
                  Stripe Elements would be integrated here.
                </p>
              </div>
              <Button className="w-full" size="lg">
                Place order
              </Button>
            </CardContent>
          </Card>
        </div>
      </AnimatedPage>
    </MainLayout>
  )
}
