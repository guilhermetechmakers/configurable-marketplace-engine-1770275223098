import { MainLayout } from '@/components/layout/MainLayout'
import { AnimatedPage } from '@/components/AnimatedPage'
import { Card, CardContent } from '@/components/ui/card'

export function Privacy() {
  return (
    <MainLayout>
      <AnimatedPage className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
        <p className="mt-1 text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

        <Card className="mt-8">
          <CardContent className="prose prose-slate max-w-none p-6 dark:prose-invert">
            <p>
              This privacy policy describes how we collect, use, and share your information
              when you use our marketplace platform. We use your data to provide the service,
              process transactions, and improve the product. We do not sell your personal data.
            </p>
            <h2>Data we collect</h2>
            <p>Account information, transaction data, communications, and usage data.</p>
            <h2>How we use it</h2>
            <p>To operate the marketplace, process payments, enforce policies, and communicate with you.</p>
            <h2>Your rights</h2>
            <p>You may access, correct, or delete your data and manage cookie preferences.</p>
          </CardContent>
        </Card>
      </AnimatedPage>
    </MainLayout>
  )
}
