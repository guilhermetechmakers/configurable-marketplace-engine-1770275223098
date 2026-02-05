/**
 * Types for landing page content (templates, testimonials, pricing plans)
 */

export interface LandingTemplate {
  id: string
  name: string
  description: string | null
  demo_link: string
  icon_key: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface LandingTestimonial {
  id: string
  customer_name: string
  quote: string
  logo_url: string | null
  company_name: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface LandingPricingPlan {
  id: string
  name: string
  price: number
  currency: string
  interval: 'month' | 'year' | 'one_time'
  features: string[]
  limits: Record<string, unknown>
  cta_label: string
  cta_link: string
  highlighted: boolean
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}
