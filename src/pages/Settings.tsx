import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { MainLayout } from '@/components/layout/MainLayout'
import { AnimatedPage } from '@/components/AnimatedPage'
import { useCurrentUser } from '@/hooks/useAuth'
import { Skeleton } from '@/components/ui/skeleton'

export function Settings() {
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
          <p className="text-muted-foreground">Please log in to access settings.</p>
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
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Account, notifications, billing, and developer tools.
        </p>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Email, password, 2FA</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user.email} disabled />
            </div>
            <Button variant="outline">Change password</Button>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <span className="text-sm">Two-factor authentication</span>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Email and in-app preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <span className="text-sm">Order updates</span>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </AnimatedPage>
    </MainLayout>
  )
}
