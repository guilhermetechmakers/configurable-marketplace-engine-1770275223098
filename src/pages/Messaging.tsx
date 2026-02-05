import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/MainLayout'
import { AnimatedPage } from '@/components/AnimatedPage'
import { useCurrentUser } from '@/hooks/useAuth'
import { MessageSquare } from 'lucide-react'

export function Messaging() {
  const { data: user, isLoading } = useCurrentUser()

  if (isLoading) {
    return null
  }

  if (!user) {
    return (
      <MainLayout>
        <AnimatedPage className="mx-auto max-w-md px-6 py-12 text-center">
          <p className="text-muted-foreground">Please log in to view messages.</p>
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
        <h1 className="text-3xl font-bold text-foreground">Messages</h1>
        <p className="mt-1 text-muted-foreground">
          Your conversations with buyers and sellers.
        </p>

        <Card className="mt-8">
          <CardContent className="flex min-h-[400px] flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No conversations yet.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Messages will appear here when you contact a seller or receive an inquiry.
            </p>
            <Button asChild className="mt-6">
              <Link to="/listings">Browse listings</Link>
            </Button>
          </CardContent>
        </Card>
      </AnimatedPage>
    </MainLayout>
  )
}
