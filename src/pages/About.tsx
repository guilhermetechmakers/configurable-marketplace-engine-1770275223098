import { MainLayout } from '@/components/layout/MainLayout'
import { AnimatedPage } from '@/components/AnimatedPage'
import { Card, CardContent } from '@/components/ui/card'

export function About() {
  return (
    <MainLayout>
      <AnimatedPage className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground">About</h1>
        <p className="mt-1 text-muted-foreground">
          Configurable marketplace engine for niche verticals.
        </p>

        <Card className="mt-8">
          <CardContent className="prose prose-slate max-w-none p-6 dark:prose-invert">
            <p>
              This platform powers two-sided marketplaces with a central configuration layer:
              categories, dynamic listing schemas, fees, and feature flags. The same codebase
              adapts to many verticals—local goods, services, B2B—with buyer/seller roles,
              Stripe Connect payouts, moderation, and admin tooling.
            </p>
          </CardContent>
        </Card>
      </AnimatedPage>
    </MainLayout>
  )
}
