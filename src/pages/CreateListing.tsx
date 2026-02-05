import { useState, useMemo, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { MainLayout } from '@/components/layout/MainLayout'
import { AnimatedPage } from '@/components/AnimatedPage'
import { useCurrentUser } from '@/hooks/useAuth'
import {
  useListingCategories,
  useCreateListing,
  useUpdateListing,
  useListing,
} from '@/hooks/useListings'
import {
  ListingWizardStepper,
  CategoryStep,
  DetailsStep,
  MediaStep,
  PricingStep,
  AvailabilityStep,
  PoliciesStep,
  PreviewStep,
  ListingPreviewPanel,
} from '@/components/listing-wizard'
import {
  LISTING_WIZARD_STEPS,
  type ListingCategoryWithSchema,
  type AvailabilitySlot,
  type ListingPolicy,
} from '@/types/listing'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const listingFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  summary: z.string().max(500).optional().or(z.literal('')),
  category_id: z.string().min(1, 'Category is required'),
  price_cents: z.number().min(0).optional(),
  currency: z.string().min(1).default('USD'),
  attributes: z.record(z.unknown()).default({}),
  media_urls: z.array(z.string()).default([]),
  availability_slots: z
    .array(
      z.object({
        start_date: z.string(),
        end_date: z.string(),
        recurring_pattern: z
          .enum(['daily', 'weekly', 'monthly'])
          .nullable()
          .optional(),
      }),
    )
    .default([]),
  policies: z
    .array(
      z.object({
        type: z.enum(['shipping', 'returns', 'cancellation', 'service_terms']),
        content: z.string(),
      }),
    )
    .default([]),
})

type ListingFormValues = z.infer<typeof listingFormSchema>

const defaultValues: ListingFormValues = {
  title: '',
  summary: '',
  category_id: '',
  price_cents: undefined,
  currency: 'USD',
  attributes: {},
  media_urls: [],
  availability_slots: [],
  policies: [],
}

function getDetailSchema(category: ListingCategoryWithSchema | undefined) {
  return category?.detail_schema ?? []
}

export function CreateListing() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const { data: user, isLoading: userLoading } = useCurrentUser()
  const { data: categories, isLoading: categoriesLoading } = useListingCategories()
  const { data: existingListing, isLoading: listingLoading } = useListing(id ?? '')
  const createListing = useCreateListing()
  const updateListing = useUpdateListing()

  const [stepIndex, setStepIndex] = useState(0)
  const currentStepId = LISTING_WIZARD_STEPS[stepIndex]

  const methods = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues,
  })

  useEffect(() => {
    if (existingListing) {
      methods.reset({
        title: existingListing.title,
        summary: existingListing.summary ?? '',
        category_id: existingListing.category_id,
        price_cents: existingListing.price_cents,
        currency: existingListing.currency,
        attributes: existingListing.attributes ?? {},
        media_urls: existingListing.media_urls ?? [],
        availability_slots: (existingListing.attributes?.availability_slots as AvailabilitySlot[]) ?? [],
        policies: (existingListing.attributes?.policies as ListingPolicy[]) ?? [],
      })
    }
  }, [existingListing, methods])

  const categoryId = methods.watch('category_id')
  const selectedCategory = useMemo(
    () => categories?.find((c) => c.id === categoryId),
    [categories, categoryId],
  )
  const categoryName = selectedCategory?.name
  const detailSchema = getDetailSchema(selectedCategory as ListingCategoryWithSchema | undefined)

  const canGoNext = stepIndex < LISTING_WIZARD_STEPS.length - 1
  const canGoPrev = stepIndex > 0

  const handleNext = () => {
    if (currentStepId === 'category' && !categoryId) {
      toast.error('Please select a category')
      return
    }
    if (currentStepId === 'details') {
      methods.trigger(['title', 'summary']).then((ok) => {
        if (ok) setStepIndex((i) => Math.min(i + 1, LISTING_WIZARD_STEPS.length - 1))
      })
      return
    }
    setStepIndex((i) => Math.min(i + 1, LISTING_WIZARD_STEPS.length - 1))
  }

  const handlePrev = () => {
    setStepIndex((i) => Math.max(i - 1, 0))
  }

  const buildPayload = (status: 'draft' | 'published') => {
    const values = methods.getValues()
    const attributes = {
      ...values.attributes,
      ...(values.availability_slots?.length
        ? { availability_slots: values.availability_slots }
        : {}),
      ...(values.policies?.length ? { policies: values.policies } : {}),
    }
    return {
      title: values.title,
      summary: values.summary || undefined,
      category_id: values.category_id,
      price_cents: values.price_cents,
      currency: values.currency,
      attributes,
      media_urls: values.media_urls,
      ...(isEdit ? { status } : {}),
    }
  }

  const handleSaveDraft = () => {
    if (isEdit && id) {
      updateListing.mutate(
        { id, updates: buildPayload('draft') },
        {
          onSuccess: () => {
            toast.success('Draft saved')
            navigate(`/listings/${id}`)
          },
        },
      )
    } else {
      createListing.mutate(buildPayload('draft') as Parameters<typeof createListing.mutate>[0], {
        onSuccess: (listing) => {
          toast.success('Draft saved')
          navigate(`/listings/${listing.id}`)
        },
      })
    }
  }

  const handlePublish = () => {
    methods.trigger().then((ok) => {
      if (!ok) {
        toast.error('Please fix errors before publishing')
        return
      }
      if (isEdit && id) {
        updateListing.mutate(
          { id, updates: buildPayload('published') },
          {
            onSuccess: () => {
              toast.success('Listing published')
              navigate(`/listings/${id}`)
            },
          },
        )
      } else {
        createListing.mutate(buildPayload('published') as Parameters<typeof createListing.mutate>[0], {
          onSuccess: (listing) => {
            toast.success('Listing published')
            navigate(`/listings/${listing.id}`)
          },
        })
      }
    })
  }

  const isPending = createListing.isPending || updateListing.isPending

  if (userLoading) {
    return (
      <MainLayout>
        <AnimatedPage className="mx-auto max-w-2xl px-6 py-12">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="mt-8 h-96 w-full" />
        </AnimatedPage>
      </MainLayout>
    )
  }

  if (!user) {
    return (
      <MainLayout>
        <AnimatedPage className="mx-auto max-w-md px-6 py-12 text-center">
          <p className="text-muted-foreground">Please log in to create a listing.</p>
          <Button asChild className="mt-4">
            <Link to="/login">Log in</Link>
          </Button>
        </AnimatedPage>
      </MainLayout>
    )
  }

  if (isEdit && id && listingLoading) {
    return (
      <MainLayout>
        <AnimatedPage className="mx-auto max-w-4xl px-6 py-12">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="mt-6 h-12 w-full" />
          <Skeleton className="mt-8 h-96 w-full" />
        </AnimatedPage>
      </MainLayout>
    )
  }

  if (isEdit && id && !existingListing && !listingLoading) {
    return (
      <MainLayout>
        <AnimatedPage className="mx-auto max-w-md px-6 py-12 text-center">
          <p className="text-muted-foreground">Listing not found.</p>
          <Button asChild className="mt-4">
            <Link to="/listings">Browse listings</Link>
          </Button>
        </AnimatedPage>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <AnimatedPage className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            {isEdit ? 'Edit listing' : 'Create listing'}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Complete the steps below. You can save as draft and publish later.
          </p>
        </div>

        <ListingWizardStepper
          steps={LISTING_WIZARD_STEPS}
          currentIndex={stepIndex}
          className="mb-6"
        />

        <FormProvider {...methods}>
          <div className="grid gap-8 lg:grid-cols-[1fr,300px]">
            <div
              className={cn(
                'min-w-0',
                currentStepId !== 'preview' && 'lg:pr-0',
              )}
            >
              {currentStepId === 'category' && (
                <CategoryStep
                  categories={categories ?? []}
                  value={categoryId}
                  onChange={(v) => methods.setValue('category_id', v)}
                  isLoading={categoriesLoading}
                />
              )}
              {currentStepId === 'details' && (
                <DetailsStep detailSchema={detailSchema} showTitleSummary />
              )}
              {currentStepId === 'media' && <MediaStep />}
              {currentStepId === 'pricing' && <PricingStep />}
              {currentStepId === 'availability' && <AvailabilityStep />}
              {currentStepId === 'policies' && <PoliciesStep />}
              {currentStepId === 'preview' && (
                <PreviewStep categoryName={categoryName} />
              )}
            </div>
            {currentStepId !== 'preview' && currentStepId !== 'category' && (
              <aside className="hidden lg:block">
                <ListingPreviewPanel categoryName={categoryName} />
              </aside>
            )}
          </div>

          <footer className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                disabled={!canGoPrev}
                className="rounded-xl"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
              {canGoNext ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="rounded-xl bg-primary text-primary-foreground"
                >
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              ) : null}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isPending}
                className="rounded-xl"
              >
                Save draft
              </Button>
              <Button
                type="button"
                onClick={handlePublish}
                disabled={isPending}
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isPending ? 'Saving…' : isEdit ? 'Update & publish' : 'Publish'}
              </Button>
            </div>
          </footer>
        </FormProvider>
      </AnimatedPage>
    </MainLayout>
  )
}
