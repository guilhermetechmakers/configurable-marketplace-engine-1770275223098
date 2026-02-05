import { useQuery } from '@tanstack/react-query'
import { landingApi } from '@/api/landing'

export const landingKeys = {
  all: ['landing'] as const,
  templates: () => [...landingKeys.all, 'templates'] as const,
  testimonials: () => [...landingKeys.all, 'testimonials'] as const,
  pricingPlans: () => [...landingKeys.all, 'pricing-plans'] as const,
}

export function useLandingTemplates() {
  return useQuery({
    queryKey: landingKeys.templates(),
    queryFn: () => landingApi.getTemplates(),
    staleTime: 1000 * 60 * 10,
  })
}

export function useLandingTestimonials() {
  return useQuery({
    queryKey: landingKeys.testimonials(),
    queryFn: () => landingApi.getTestimonials(),
    staleTime: 1000 * 60 * 10,
  })
}

export function useLandingPricingPlans() {
  return useQuery({
    queryKey: landingKeys.pricingPlans(),
    queryFn: () => landingApi.getPricingPlans(),
    staleTime: 1000 * 60 * 10,
  })
}
