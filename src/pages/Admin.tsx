import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/MainLayout'
import { AnimatedPage } from '@/components/AnimatedPage'
import { useCurrentUser } from '@/hooks/useAuth'
import { Settings, Users, FileText, Shield } from 'lucide-react'

export function Admin() {
  const { data: user, isLoading } = useCurrentUser()
  const isAdmin = user?.role === 'admin' || user?.role === 'moderator'

  if (isLoading) {
    return null
  }

  if (!user || !isAdmin) {
    return (
      <MainLayout>
        <AnimatedPage className="mx-auto max-w-md px-6 py-12 text-center">
          <p className="text-muted-foreground">You don’t have access to the admin dashboard.</p>
          <Button asChild className="mt-4">
            <Link to="/">Go home</Link>
          </Button>
        </AnimatedPage>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <AnimatedPage className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground">Admin dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Configuration, users, moderation, disputes, and audit logs.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <Settings className="h-8 w-8 text-primary" />
              <CardTitle>Config editor</CardTitle>
              <CardDescription>Taxonomy, schemas, fees, feature flags</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm">Open editor</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary" />
              <CardTitle>User management</CardTitle>
              <CardDescription>Search, impersonate, suspend</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm">Manage users</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 text-primary" />
              <CardTitle>Listings moderation</CardTitle>
              <CardDescription>Approve, remove, escalate</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm">Moderation queue</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary" />
              <CardTitle>Dispute center</CardTitle>
              <CardDescription>Orders, payouts, evidence</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm">Disputes</Button>
            </CardContent>
          </Card>
        </div>
      </AnimatedPage>
    </MainLayout>
  )
}
