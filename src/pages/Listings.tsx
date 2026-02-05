import { useCallback, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/MainLayout'
import { AnimatedPage } from '@/components/AnimatedPage'
import {
  useListingsSearch,
  useListingCategories,
} from '@/hooks/useListings'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { SearchForm, type SearchFormValues } from '@/components/listings/SearchForm'
import { SortDropdown } from '@/components/listings/SortDropdown'
import { ListingsFiltersPanel, type AppliedFilters } from '@/components/listings/ListingsFiltersPanel'
import { ListingCard } from '@/components/listings/ListingCard'
import { MapViewPlaceholder } from '@/components/listings/MapViewPlaceholder'
import { LayoutGrid, List, MapPin, SlidersHorizontal } from 'lucide-react'
import type { ListingSortOption } from '@/types/listing'
import { cn } from '@/lib/utils'

const VIEW_GRID = 'grid'
const VIEW_LIST = 'list'
type ViewMode = typeof VIEW_GRID | typeof VIEW_LIST

const DEFAULT_SORT: ListingSortOption = 'relevance'
const LOCATION_SUGGESTIONS = ['New York', 'London', 'Berlin', 'Paris', 'San Francisco']

function parseFiltersFromUrl(searchParams: URLSearchParams): AppliedFilters {
  const raw = searchParams.get('filters')
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>
    return typeof parsed === 'object' && parsed !== null ? (parsed as AppliedFilters) : {}
  } catch {
    return {}
  }
}

function filtersToParams(filters: AppliedFilters): Record<string, string | number | number[] | string[]> | undefined {
  if (!filters || Object.keys(filters).length === 0) return undefined
  const out: Record<string, string | number | number[] | string[]> = {}
  for (const [k, v] of Object.entries(filters)) {
    if (v === undefined || v === '') continue
    if (Array.isArray(v) && (v as unknown[]).length === 0) continue
    out[k] = v as string | number | number[] | string[]
  }
  return Object.keys(out).length > 0 ? out : undefined
}

export function Listings() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const q = searchParams.get('q') ?? ''
  const location = searchParams.get('location') ?? ''
  const dateFrom = searchParams.get('date_from') ?? ''
  const dateTo = searchParams.get('date_to') ?? ''
  const categoryId = searchParams.get('category_id') ?? undefined
  const sort = (searchParams.get('sort') as ListingSortOption) ?? DEFAULT_SORT
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1)
  const view = (searchParams.get('view') as ViewMode) ?? VIEW_GRID
  const mapView = searchParams.get('map') === 'true'
  const appliedFilters = useMemo(() => parseFiltersFromUrl(searchParams), [searchParams])

  const { data: categories } = useListingCategories()
  const filtersParam = useMemo(
    () => filtersToParams(appliedFilters),
    [appliedFilters],
  )

  const { data, isLoading, isError } = useListingsSearch({
    q: q || undefined,
    category_id: categoryId || undefined,
    location: location || undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    page,
    limit: 12,
    sort,
    filters: filtersParam as Record<string, string | number | [number, number] | string[]> | undefined,
  })

  const listings = data?.data ?? []
  const totalPages = data ? Math.ceil(data.count / data.limit) : 0
  const selectedCategory = useMemo(
    () => categories?.find((c) => c.id === categoryId) ?? null,
    [categories, categoryId],
  )

  const setParams = useCallback(
    (updates: Record<string, string | number | undefined>, resetPage = true) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        for (const [key, value] of Object.entries(updates)) {
          if (value === undefined || value === '') {
            next.delete(key)
          } else {
            next.set(key, String(value))
          }
        }
        if (resetPage && !('page' in updates)) next.delete('page')
        return next
      })
    },
    [setSearchParams],
  )

  const setPage = useCallback(
    (newPage: number) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.set('page', String(newPage))
        return next
      })
    },
    [setSearchParams],
  )

  const setFiltersInUrl = useCallback(
    (filters: AppliedFilters) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (Object.keys(filters).length === 0) {
          next.delete('filters')
        } else {
          next.set('filters', JSON.stringify(filters))
        }
        next.delete('page')
        return next
      })
    },
    [setSearchParams],
  )

  const searchFormValues: SearchFormValues = useMemo(
    () => ({ q, location, dateFrom, dateTo }),
    [q, location, dateFrom, dateTo],
  )

  const handleSearchSubmit = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('q', q)
      next.set('location', location)
      next.set('date_from', dateFrom)
      next.set('date_to', dateTo)
      next.delete('page')
      return next
    })
  }, [q, location, dateFrom, dateTo, setSearchParams])

  const handleSearchFormChange = useCallback(
    (values: SearchFormValues) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.set('q', values.q)
        next.set('location', values.location)
        next.set('date_from', values.dateFrom)
        next.set('date_to', values.dateTo)
        next.delete('page')
        return next
      })
    },
    [setSearchParams],
  )

  const handleClearFilters = useCallback(() => {
    setFiltersInUrl({})
    setFiltersOpen(false)
  }, [setFiltersInUrl])

  return (
    <MainLayout>
      <AnimatedPage className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Explore listings
          </h1>
          <p className="mt-1 text-muted-foreground">
            Search by keyword, location, and dates. Filter by category and refine with filters.
          </p>

          <div className="mt-6">
            <SearchForm
              values={searchFormValues}
              onChange={handleSearchFormChange}
              onSubmit={handleSearchSubmit}
              isSearching={isLoading}
              locationSuggestions={LOCATION_SUGGESTIONS}
            />
          </div>
        </header>

        {/* Category pills */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex min-w-0 gap-2">
            <Button
              variant={!categoryId ? 'default' : 'outline'}
              size="sm"
              className="shrink-0 rounded-xl"
              onClick={() => setParams({ category_id: undefined })}
            >
              All
            </Button>
            {categories?.map((cat) => (
              <Button
                key={cat.id}
                variant={categoryId === cat.id ? 'default' : 'outline'}
                size="sm"
                className="shrink-0 rounded-xl"
                onClick={() => setParams({ category_id: cat.id })}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Toolbar: sort, view toggle, map, filters */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <SortDropdown
              value={sort}
              onChange={(v) => setParams({ sort: v })}
            />
            <div className="hidden h-6 w-px bg-border sm:block" aria-hidden />
            <div className="flex rounded-xl border border-input p-0.5">
              <Button
                variant={view === VIEW_GRID ? 'default' : 'ghost'}
                size="sm"
                className="rounded-lg"
                onClick={() => setParams({ view: VIEW_GRID })}
                aria-label="Grid view"
                aria-pressed={view === VIEW_GRID}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={view === VIEW_LIST ? 'default' : 'ghost'}
                size="sm"
                className="rounded-lg"
                onClick={() => setParams({ view: VIEW_LIST })}
                aria-label="List view"
                aria-pressed={view === VIEW_LIST}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant={mapView ? 'default' : 'outline'}
              size="sm"
              className="rounded-xl"
              onClick={() =>
                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev)
                  if (prev.get('map') === 'true') next.delete('map')
                  else next.set('map', 'true')
                  return next
                })
              }
              aria-pressed={mapView}
              aria-label="Toggle map view"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Map
            </Button>
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl lg:hidden"
                  aria-label="Open filters"
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <ListingsFiltersPanel
                    category={selectedCategory}
                    filters={appliedFilters}
                    onFiltersChange={setFiltersInUrl}
                    onClear={handleClearFilters}
                    compact
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <p className="text-sm text-muted-foreground">
            {data != null ? (
              <>
                <span className="font-medium text-foreground">{data.count}</span>{' '}
                result{data.count !== 1 ? 's' : ''}
              </>
            ) : null}
          </p>
        </div>

        <div className="flex gap-8">
          {/* Filters sidebar (desktop) */}
          <aside
            className="hidden w-56 shrink-0 lg:block"
            aria-label="Filter options"
          >
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-4 shadow-card">
              <ListingsFiltersPanel
                category={selectedCategory}
                filters={appliedFilters}
                onFiltersChange={setFiltersInUrl}
                onClear={handleClearFilters}
              />
            </div>
          </aside>

          {/* Main content: list grid or map */}
          <main className="min-w-0 flex-1">
            {mapView ? (
              <MapViewPlaceholder listings={listings} className="animate-fade-in" />
            ) : isLoading ? (
              <div
                className={cn(
                  view === VIEW_LIST
                    ? 'space-y-4'
                    : 'grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3',
                )}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className={cn(
                      view === VIEW_LIST ? 'h-32' : 'h-72',
                      'rounded-2xl bg-muted',
                    )}
                  />
                ))}
              </div>
            ) : isError ? (
              <Card className="animate-fade-in">
                <CardContent className="py-12 text-center text-muted-foreground">
                  Failed to load listings. Try again later.
                </CardContent>
              </Card>
            ) : listings.length === 0 ? (
              <Card className="animate-fade-in">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No listings found. Try adjusting your search or filters.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 rounded-xl"
                    onClick={handleClearFilters}
                  >
                    Clear filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div
                  className={cn(
                    view === VIEW_LIST
                      ? 'space-y-4 animate-fade-in-up'
                      : 'grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 animate-fade-in-up',
                  )}
                  style={{ animationDuration: '0.4s' }}
                >
                  {listings.map((listing, i) => (
                    <div
                      key={listing.id}
                      style={
                        view === VIEW_GRID
                          ? { animationDelay: `${Math.min(i * 50, 300)}ms` }
                          : undefined
                      }
                    >
                      <ListingCard
                        listing={listing}
                        variant={view}
                      />
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      disabled={page <= 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </Button>
                    <span className="px-4 text-sm text-muted-foreground">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      disabled={page >= totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </AnimatedPage>
    </MainLayout>
  )
}
