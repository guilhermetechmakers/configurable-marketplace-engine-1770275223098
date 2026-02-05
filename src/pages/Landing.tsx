import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { MainLayout } from '@/components/layout/MainLayout'
import { AnimatedPage } from '@/components/AnimatedPage'
import { SignupModal } from '@/components/landing/SignupModal'
import { DemoLaunchDialog } from '@/components/landing/DemoLaunchDialog'
import {
  ShoppingBag,
  Zap,
  Shield,
  ArrowRight,
  Settings,
  Users,
  Rocket,
  Search,
  CreditCard,
  MessageSquare,
  Star,
  Check,
} from 'lucide-react'
import { useLandingTemplates, useLandingTestimonials, useLandingPricingPlans } from '@/hooks/useLanding'
import type { LandingTemplate } from '@/types/landing'
import { cn } from '@/lib/utils'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'shopping-bag': ShoppingBag,
  zap: Zap,
  shield: Shield,
}

const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: 'Configure',
    description: 'Define categories, schemas, and fees for your vertical.',
    icon: Settings,
  },
  {
    step: 2,
    title: 'Onboard Sellers',
    description: 'KYC, Stripe Connect, and dynamic listing forms.',
    icon: Users,
  },
  {
    step: 3,
    title: 'Go Live',
    description: 'Checkout, bookings, payouts, and moderation built in.',
    icon: Rocket,
  },
]

const FEATURES = [
  {
    title: 'Dynamic listing schemas',
    description: 'Category-driven forms and filters generated from config.',
    icon: Search,
  },
  {
    title: 'Stripe Connect payouts',
    description: 'Application fees, transfers, and payout schedules.',
    icon: CreditCard,
  },
  {
    title: 'In-app messaging',
    description: 'Buyer–seller threads with moderation and attachments.',
    icon: MessageSquare,
  },
  {
    title: 'Reviews & moderation',
    description: 'Ratings, moderation queue, and dispute resolution.',
    icon: Star,
  },
]

export function Landing() {
  const [signupOpen, setSignupOpen] = useState(false)
  const [demoDialogOpen, setDemoDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<LandingTemplate | null>(null)

  const { data: templates = [], isLoading: templatesLoading } = useLandingTemplates()
  const { data: testimonials = [], isLoading: testimonialsLoading } = useLandingTestimonials()
  const { data: plans = [], isLoading: plansLoading } = useLandingPricingPlans()

  const openDemoDialog = (template: LandingTemplate) => {
    setSelectedTemplate(template)
    setDemoDialogOpen(true)
  }

  return (
    <MainLayout>
      <AnimatedPage>
        {/* Hero */}
        <section
          id="hero"
          className="relative overflow-hidden px-6 py-16 md:px-8 md:py-24 lg:py-32"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/50 via-background to-background" />
          <div className="relative mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground animate-fade-in-up sm:text-5xl md:text-6xl md:leading-tight">
              Launch your marketplace in days, not months
            </h1>
            <p className="mt-6 text-lg text-muted-foreground animate-fade-in-up sm:text-xl [animation-delay:100ms]">
              A configurable two-sided marketplace engine. Define categories,
              dynamic listing schemas, and fees—then go live with checkout,
              bookings, and Stripe Connect payouts.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-in-up [animation-delay:200ms]">
              <Button
                size="lg"
                className="min-h-[44px] px-8 text-base"
                onClick={() => setSignupOpen(true)}
              >
                Get started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" asChild className="min-h-[44px] px-8 text-base">
                <Link to="/listings">Explore Marketplace demo</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Use-case Templates */}
        <section
          id="templates"
          className="scroll-mt-24 border-t border-border bg-accent/30 px-6 py-16 md:px-8 md:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
              Use-case templates
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              One codebase, many verticals. Start from a template and customize.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {templatesLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <Card
                      key={i}
                      className="overflow-hidden rounded-2xl border-border bg-card shadow-card"
                    >
                      <CardHeader>
                        <div className="h-12 w-12 animate-pulse rounded-xl bg-muted" />
                        <div className="mt-4 h-5 w-3/4 animate-pulse rounded bg-muted" />
                        <div className="mt-2 h-4 w-full animate-pulse rounded bg-muted" />
                      </CardHeader>
                    </Card>
                  ))
                : templates.map((template, i) => {
                    const Icon =
                      ICON_MAP[template.icon_key ?? ''] ?? ShoppingBag
                    return (
                      <Card
                        key={template.id}
                        className={cn(
                          'overflow-hidden rounded-2xl border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg',
                          'animate-fade-in-up',
                        )}
                        style={{ animationDelay: `${i * 80}ms` }}
                      >
                        <CardHeader>
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Icon className="h-6 w-6" />
                          </div>
                          <CardTitle className="mt-4 text-foreground">
                            {template.name}
                          </CardTitle>
                          <CardDescription>{template.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-0">
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => openDemoDialog(template)}
                          >
                            Launch demo
                          </Button>
                        </CardFooter>
                      </Card>
                    )
                  })}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section
          id="how-it-works"
          className="scroll-mt-24 px-6 py-16 md:px-8 md:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
              How it works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              Configure, onboard sellers, and go live—without custom engineering.
            </p>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {HOW_IT_WORKS_STEPS.map(({ step, title, description, icon: Icon }, i) => (
                <div
                  key={step}
                  className="animate-fade-in-up text-center"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-card transition-transform duration-300 hover:scale-105">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section
          id="features"
          className="scroll-mt-24 border-t border-border bg-accent/30 px-6 py-16 md:px-8 md:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
              Core features
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              Everything you need to run a two-sided marketplace at scale.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map(({ title, description, icon: Icon }, i) => (
                <Card
                  key={title}
                  className={cn(
                    'rounded-2xl border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg',
                    'animate-fade-in-up',
                  )}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <CardHeader>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base font-semibold text-foreground">
                      {title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing & Plans */}
        <section
          id="pricing"
          className="scroll-mt-24 px-6 py-16 md:px-8 md:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
              Pricing & plans
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              Start free, scale as you grow. No hidden fees.
            </p>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {plansLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <Card
                      key={i}
                      className="rounded-2xl border-border bg-card shadow-card"
                    >
                      <CardHeader>
                        <div className="h-6 w-24 animate-pulse rounded bg-muted" />
                        <div className="mt-2 h-8 w-16 animate-pulse rounded bg-muted" />
                      </CardHeader>
                    </Card>
                  ))
                : plans.map((plan, i) => (
                    <Card
                      key={plan.id}
                      className={cn(
                        'flex flex-col rounded-2xl border-2 bg-card shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg',
                        plan.highlighted
                          ? 'border-primary bg-accent/50'
                          : 'border-border',
                        'animate-fade-in-up',
                      )}
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <CardHeader className="text-center">
                        {plan.highlighted && (
                          <span className="mb-2 inline-block text-xs font-medium uppercase tracking-wide text-primary">
                            Most popular
                          </span>
                        )}
                        <CardTitle className="text-foreground">
                          {plan.name}
                        </CardTitle>
                        <div className="mt-2">
                          <span className="text-3xl font-bold text-foreground">
                            ${plan.price}
                          </span>
                          {plan.interval !== 'one_time' && (
                            <span className="text-muted-foreground">
                              /{plan.interval}
                            </span>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <ul className="space-y-3">
                          {plan.features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                              <Check className="h-4 w-4 shrink-0 text-primary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter className="pt-6">
                        <Button
                          asChild
                          variant={plan.highlighted ? 'default' : 'outline'}
                          className="w-full"
                          size="lg"
                        >
                          <Link to={plan.cta_link}>{plan.cta_label}</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section
          id="testimonials"
          className="scroll-mt-24 border-t border-border bg-accent/30 px-6 py-16 md:px-8 md:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
              What our customers say
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              Trusted by teams launching niche marketplaces worldwide.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonialsLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <Card
                      key={i}
                      className="rounded-2xl border-border bg-card shadow-card"
                    >
                      <CardContent className="pt-6">
                        <div className="h-4 w-full animate-pulse rounded bg-muted" />
                        <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-muted" />
                        <div className="mt-4 h-4 w-1/2 animate-pulse rounded bg-muted" />
                      </CardContent>
                    </Card>
                  ))
                : testimonials.map((t, i) => (
                    <Card
                      key={t.id}
                      className={cn(
                        'rounded-2xl border-border bg-card shadow-card transition-all duration-300 hover:shadow-lg',
                        'animate-fade-in-up',
                      )}
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <CardContent className="pt-6">
                        <p className="text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
                        <div className="mt-4 flex items-center gap-3">
                          {t.logo_url ? (
                            <img
                              src={t.logo_url}
                              alt=""
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                              {t.customer_name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-foreground">
                              {t.customer_name}
                            </p>
                            {t.company_name && (
                              <p className="text-sm text-muted-foreground">
                                {t.company_name}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          </div>
        </section>

        <SignupModal open={signupOpen} onOpenChange={setSignupOpen} />
        <DemoLaunchDialog
          open={demoDialogOpen}
          onOpenChange={setDemoDialogOpen}
          template={selectedTemplate}
        />
      </AnimatedPage>
    </MainLayout>
  )
}
