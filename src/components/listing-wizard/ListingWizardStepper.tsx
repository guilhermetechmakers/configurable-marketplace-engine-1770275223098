import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ListingWizardStepId } from '@/types/listing'

const STEP_LABELS: Record<ListingWizardStepId, string> = {
  category: 'Category',
  details: 'Details',
  media: 'Media',
  pricing: 'Pricing',
  availability: 'Availability',
  policies: 'Policies',
  preview: 'Preview',
}

interface ListingWizardStepperProps {
  steps: readonly ListingWizardStepId[]
  currentIndex: number
  className?: string
}

export function ListingWizardStepper({
  steps,
  currentIndex,
  className,
}: ListingWizardStepperProps) {
  return (
    <nav
      aria-label="Listing creation progress"
      className={cn('flex items-center gap-1 overflow-x-auto pb-2', className)}
    >
      {steps.map((stepId, index) => {
        const isActive = index === currentIndex
        const isCompleted = index < currentIndex
        const label = STEP_LABELS[stepId]
        return (
          <div key={stepId} className="flex shrink-0 items-center">
            <div
              className={cn(
                'flex min-w-[44px] items-center justify-center rounded-full border-2 text-xs font-medium transition-all duration-200',
                isActive &&
                  'border-primary bg-primary text-primary-foreground shadow-card',
                isCompleted &&
                  'border-primary bg-primary text-primary-foreground',
                !isActive &&
                  !isCompleted &&
                  'border-border bg-card text-muted-foreground',
              )}
              aria-current={isActive ? 'step' : undefined}
              aria-label={`${label}${isCompleted ? ', completed' : ''}`}
            >
              {isCompleted ? (
                <span className="h-5 w-5" aria-hidden>
                  ✓
                </span>
              ) : (
                <span className="h-6 w-6 leading-6">{index + 1}</span>
              )}
            </div>
            <span
              className={cn(
                'ml-2 hidden text-sm font-medium sm:inline',
                isActive ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {label}
            </span>
            {index < steps.length - 1 && (
              <ChevronRight
                className="mx-1 h-4 w-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}
