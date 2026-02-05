import { useCallback } from 'react'
import { Search, MapPin, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface SearchFormValues {
  q: string
  location: string
  dateFrom: string
  dateTo: string
}

interface SearchFormProps {
  values: SearchFormValues
  onChange: (values: SearchFormValues) => void
  onSubmit: () => void
  isSearching?: boolean
  className?: string
  /** Location suggestions for autocomplete (datalist) */
  locationSuggestions?: string[]
}

export function SearchForm({
  values,
  onChange,
  onSubmit,
  isSearching = false,
  className,
  locationSuggestions = [],
}: SearchFormProps) {
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      onSubmit()
    },
    [onSubmit],
  )

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex flex-col gap-4', className)}
      role="search"
      aria-label="Search listings"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
        <div className="relative lg:col-span-4">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Keyword, title..."
            className="pl-10 rounded-xl border-input focus-visible:ring-ring"
            value={values.q}
            onChange={(e) => onChange({ ...values, q: e.target.value })}
            aria-label="Search keyword"
            autoComplete="off"
          />
        </div>
        <div className="relative lg:col-span-3">
          <MapPin
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="text"
            placeholder="Location"
            className="pl-10 rounded-xl border-input focus-visible:ring-ring"
            value={values.location}
            onChange={(e) => onChange({ ...values, location: e.target.value })}
            aria-label="Location"
            autoComplete="off"
            list="location-suggestions"
          />
          {locationSuggestions.length > 0 && (
            <datalist id="location-suggestions">
              {locationSuggestions.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          )}
        </div>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end lg:col-span-4">
          <div className="relative flex-1">
            <Calendar
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Label htmlFor="date-from" className="sr-only">
              Date from
            </Label>
            <Input
              id="date-from"
              type="date"
              className="pl-10 rounded-xl border-input focus-visible:ring-ring"
              value={values.dateFrom}
              onChange={(e) => onChange({ ...values, dateFrom: e.target.value })}
              aria-label="Date from"
            />
          </div>
          <div className="relative flex-1">
            <Label htmlFor="date-to" className="sr-only">
              Date to
            </Label>
            <Input
              id="date-to"
              type="date"
              className="pl-10 rounded-xl border-input focus-visible:ring-ring mt-2 sm:mt-0"
              value={values.dateTo}
              onChange={(e) => onChange({ ...values, dateTo: e.target.value })}
              aria-label="Date to"
            />
          </div>
        </div>
        <div className="flex items-end sm:col-span-2 lg:col-span-1">
          <Button
            type="submit"
            className="w-full rounded-xl transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            disabled={isSearching}
            aria-busy={isSearching}
          >
            {isSearching ? 'Searching…' : 'Search'}
          </Button>
        </div>
      </div>
    </form>
  )
}
