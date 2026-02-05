import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type {
  LandingTemplate,
  LandingTestimonial,
  LandingPricingPlan,
} from '@/types/landing'

const FALLBACK_TEMPLATES: LandingTemplate[] = [
  {
    id: '1',
    name: 'Local Goods',
    description:
      'Farmers markets, artisans, and local producers in one place. Pre-configured categories and fees for food and produce.',
    demo_link: '/listings',
    icon_key: 'shopping-bag',
    sort_order: 0,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    name: 'Services & Bookings',
    description:
      'Hire professionals, book experiences, and manage availability. Built-in calendar and booking state machine.',
    demo_link: '/listings',
    icon_key: 'zap',
    sort_order: 1,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    name: 'B2B Marketplaces',
    description:
      'Connect buyers and sellers with configurable categories, dynamic schemas, and tiered fees.',
    demo_link: '/listings',
    icon_key: 'shield',
    sort_order: 2,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
]

const FALLBACK_TESTIMONIALS: LandingTestimonial[] = [
  {
    id: '1',
    customer_name: 'Sarah Chen',
    quote:
      'We launched our local food marketplace in two weeks. The configurable engine saved us months of custom development.',
    logo_url: null,
    company_name: 'FarmDirect',
    sort_order: 0,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    customer_name: 'Marcus Webb',
    quote:
      'Stripe Connect integration and dynamic listing forms let us onboard sellers without engineering support.',
    logo_url: null,
    company_name: 'CraftHub',
    sort_order: 1,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    customer_name: 'Elena Rodriguez',
    quote:
      'From configure to go-live in days. Moderation and dispute tools gave us confidence to scale.',
    logo_url: null,
    company_name: 'ServiceMatch',
    sort_order: 2,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
]

const FALLBACK_PLANS: LandingPricingPlan[] = [
  {
    id: '1',
    name: 'Starter',
    price: 0,
    currency: 'USD',
    interval: 'month',
    features: [
      'Up to 100 listings',
      'Basic search & filters',
      'Stripe Connect (standard)',
      'Email support',
    ],
    limits: { listings: 100 },
    cta_label: 'Get started',
    cta_link: '/signup',
    highlighted: false,
    sort_order: 0,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    name: 'Growth',
    price: 99,
    currency: 'USD',
    interval: 'month',
    features: [
      'Unlimited listings',
      'Dynamic schemas & categories',
      'Booking & inquiry modes',
      'Priority support',
      'Analytics & reports',
    ],
    limits: {},
    cta_label: 'Start free trial',
    cta_link: '/signup',
    highlighted: true,
    sort_order: 1,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    name: 'Enterprise',
    price: 299,
    currency: 'USD',
    interval: 'month',
    features: [
      'Everything in Growth',
      'Dedicated success manager',
      'Custom integrations',
      'SLA & audit logs',
      'On-premise option',
    ],
    limits: {},
    cta_label: 'Contact sales',
    cta_link: '/help',
    highlighted: false,
    sort_order: 2,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
]

export const landingApi = {
  async getTemplates(): Promise<LandingTemplate[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('landing_templates')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      if (!error && data?.length) {
        return data as LandingTemplate[]
      }
    }
    return FALLBACK_TEMPLATES
  },

  async getTestimonials(): Promise<LandingTestimonial[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('landing_testimonials')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      if (!error && data?.length) {
        return data as LandingTestimonial[]
      }
    }
    return FALLBACK_TESTIMONIALS
  },

  async getPricingPlans(): Promise<LandingPricingPlan[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('landing_pricing_plans')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      if (!error && data?.length) {
        return (data as LandingPricingPlan[]).map((row) => ({
          ...row,
          price: Number(row.price),
          features: Array.isArray(row.features) ? row.features : [],
          limits:
            row.limits && typeof row.limits === 'object'
              ? (row.limits as Record<string, unknown>)
              : {},
        }))
      }
    }
    return FALLBACK_PLANS
  },
}
