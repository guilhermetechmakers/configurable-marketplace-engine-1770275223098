import { Card, CardContent } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/MainLayout'
import { AnimatedPage } from '@/components/AnimatedPage'
import { Star } from 'lucide-react'

export function Reviews() {
  return (
    <MainLayout>
      <AnimatedPage className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground">Reviews & moderation</h1>
        <p className="mt-1 text-muted-foreground">
          Manage reviews and flagged content. Moderator actions are logged.
        </p>

        <Card className="mt-8">
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">
              Reviews list and moderation queue would load here. Star icon for ratings:{' '}
              <Star className="inline h-4 w-4 text-[#F6C244]" />.
            </p>
          </CardContent>
        </Card>
      </AnimatedPage>
    </MainLayout>
  )
}
