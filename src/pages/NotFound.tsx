import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { MainLayout } from '@/components/layout/MainLayout'
import { AnimatedPage } from '@/components/AnimatedPage'
import { Search } from 'lucide-react'

export function NotFound() {
  return (
    <MainLayout>
      <AnimatedPage className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 py-12 text-center">
        <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
        <p className="mt-4 text-lg font-medium text-foreground">Page not found</p>
        <p className="mt-2 text-muted-foreground">
          The page you’re looking for doesn’t exist or was moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link to="/">Go home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/listings">
              <Search className="mr-2 h-4 w-4" /> Search listings
            </Link>
          </Button>
        </div>
      </AnimatedPage>
    </MainLayout>
  )
}
