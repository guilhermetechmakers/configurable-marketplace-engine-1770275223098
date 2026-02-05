import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { MainLayout } from '@/components/layout/MainLayout'
import { AnimatedPage } from '@/components/AnimatedPage'
import { AlertTriangle } from 'lucide-react'

export function Error() {
  return (
    <MainLayout>
      <AnimatedPage className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">
          We’re sorry. An error occurred. Our team has been notified.
        </p>
        <Button asChild className="mt-8">
          <Link to="/">Go home</Link>
        </Button>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/help">Report issue</Link>
        </Button>
      </AnimatedPage>
    </MainLayout>
  )
}
