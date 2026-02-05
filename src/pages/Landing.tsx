import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/MainLayout'
import { AnimatedPage } from '@/components/AnimatedPage'
import { ShoppingBag, Shield, Zap, ArrowRight } from 'lucide-react'

const useCases = [
  {
    title: 'Local Goods',
    description: 'Farmers markets, artisans, and local producers in one place.',
    icon: ShoppingBag,
  },
  {
    title: 'Services & Bookings',
    description: 'Hire professionals, book experiences, and manage availability.',
    icon: Zap,
  },
  {
    title: 'B2B Marketplaces',
    description: 'Connect buyers and sellers with configurable categories and fees.',
    icon: Shield,
  },
]

const steps = [
  { step: 1, title: 'Configure', description: 'Define categories, schemas, and fees for your vertical.' },
  { step: 2, title: 'Launch', description: 'Go live with listings, checkout, and payouts.' },
  { step: 3, title: 'Scale', description: 'Moderation, analytics, and admin tools built in.' },
]

export function Landing() {
  return (
    <MainLayout>
      <AnimatedPage>
        <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Launch your marketplace in days, not months
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              A configurable two-sided marketplace engine. Define categories, dynamic listing schemas, and fees—then go live with checkout, bookings, and Stripe Connect payouts.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/signup">
                  Get started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/listings">Explore demo</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-accent/30 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
              Use-case templates
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              One codebase, many verticals. Start from a template and customize.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {useCases.map(({ title, description, icon: Icon }, i) => (
                <Card
                  key={title}
                  className="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="mt-4">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
              How it works
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {steps.map(({ step, title, description }) => (
                <div key={step} className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground">
                    {step}
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-accent/30 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-card md:p-12">
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                Ready to build your marketplace?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Sign up and launch in minutes with our configurable engine.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button size="lg" asChild>
                  <Link to="/signup">Sign up free</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </AnimatedPage>
    </MainLayout>
  )
}
