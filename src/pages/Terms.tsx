import { MainLayout } from '@/components/layout/MainLayout'
import { AnimatedPage } from '@/components/AnimatedPage'
import { Card, CardContent } from '@/components/ui/card'

export function Terms() {
  return (
    <MainLayout>
      <AnimatedPage className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
        <p className="mt-1 text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

        <Card className="mt-8">
          <CardContent className="prose prose-slate max-w-none p-6 dark:prose-invert">
            <p>
              By using this marketplace you agree to these terms. You must be eligible to enter
              into a binding agreement. Sellers are responsible for their listings and compliance
              with laws. Buyers agree to pay for orders and abide by policies.
            </p>
            <h2>Acceptable use</h2>
            <p>You may not use the platform for illegal or abusive purposes. We may suspend or terminate accounts that violate these terms.</p>
            <h2>Fees and payments</h2>
            <p>Fees are described in the pricing section. Payment processing is subject to our payment provider&apos;s terms.</p>
          </CardContent>
        </Card>
      </AnimatedPage>
    </MainLayout>
  )
}
