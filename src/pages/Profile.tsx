import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { MainLayout } from '@/components/layout/MainLayout'
import { AnimatedPage } from '@/components/AnimatedPage'
import { useCurrentUser } from '@/hooks/useAuth'
import { Skeleton } from '@/components/ui/skeleton'
import { Store, CreditCard, Bell, AlertTriangle } from 'lucide-react'

export function Profile() {
  const { data: user, isLoading } = useCurrentUser()

  if (isLoading) {
    return (
      <MainLayout>
        <AnimatedPage className="mx-auto max-w-3xl px-6 py-12">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="mt-4 h-8 w-48" />
          <Skeleton className="mt-8 h-64 w-full" />
        </AnimatedPage>
      </MainLayout>
    )
  }

  if (!user) {
    return (
      <MainLayout>
        <AnimatedPage className="mx-auto max-w-md px-6 py-12 text-center">
          <p className="text-muted-foreground">Please log in to view your profile.</p>
          <Button asChild className="mt-4">
            <Link to="/login">Log in</Link>
          </Button>
        </AnimatedPage>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <AnimatedPage className="mx-auto max-w-3xl px-6 py-12">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback>
                  {(user.full_name ?? user.email).slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user.full_name ?? 'No name'}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                <div className="mt-2 flex gap-2">
                  <Badge>{user.role}</Badge>
                  {user.kyc_status && <Badge variant="secondary">{user.kyc_status}</Badge>}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <h3 className="font-semibold">Edit profile</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full name</Label>
                  <Input id="full_name" defaultValue={user.full_name} />
                </div>
              </div>
            </div>
            <Separator />
            {user.role === 'seller' && (
              <>
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <Store className="h-4 w-4" /> KYC / Verification
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Complete verification to receive payouts.
                  </p>
                  <Button variant="outline">Start verification</Button>
                </div>
                <Separator />
              </>
            )}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-semibold">
                <CreditCard className="h-4 w-4" /> Payment methods
              </h3>
              <p className="text-sm text-muted-foreground">
                Manage cards and bank accounts for payouts.
              </p>
              <Button variant="outline">Manage payment methods</Button>
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-semibold">
                <Bell className="h-4 w-4" /> Notifications
              </h3>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <span className="text-sm">Email notifications</span>
                <Switch defaultChecked />
              </div>
            </div>
            <Separator />
            <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-4">
              <h3 className="flex items-center gap-2 font-semibold text-destructive">
                <AlertTriangle className="h-4 w-4" /> Danger zone
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Deleting your account is permanent and cannot be undone.
              </p>
              <Button variant="destructive" className="mt-4">
                Delete account
              </Button>
            </div>
          </CardContent>
        </Card>
      </AnimatedPage>
    </MainLayout>
  )
}
