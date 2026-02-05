import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import type { ListingCategory, ListingFilterField } from '@/types/listing'
import { cn } from '@/lib/utils'

export interface AppliedFilters {
  price_min?: number
  price_max?: number
  [key: string]: string | number | [number, number] | string[] | undefined
}

interface ListingsFiltersPanelProps {
  category: ListingCategory | null
  filters: AppliedFilters
  onFiltersChange: (filters: AppliedFilters) => void
  onClear: () => void
  className?: string
  /** When true, render compact for sheet on mobile */
  compact?: boolean
}

/** Default filter fields when category has no filter_schema (e.g. price range) */
const DEFAULT_FILTER_FIELDS: ListingFilterField[] = [
  { key: 'price_min', label: 'Min price', type: 'range', min: 0, max: 100000, unit: '¢' },
  { key: 'price_max', label: 'Max price', type: 'range', min: 0, max: 100000, unit: '¢' },
]

export function ListingsFiltersPanel({
  category,
  filters,
  onFiltersChange,
  onClear,
  className,
  compact = false,
}: ListingsFiltersPanelProps) {
  const fields: ListingFilterField[] =
    category?.filter_schema && category.filter_schema.length > 0
      ? category.filter_schema
      : DEFAULT_FILTER_FIELDS

  const handleNumberFilter = useCallback(
    (key: string, value: number | '') => {
      const num = value === '' ? undefined : value
      if (num === undefined) {
        const { [key]: _, ...rest } = filters
        onFiltersChange(rest)
      } else {
        onFiltersChange({ ...filters, [key]: num })
      }
    },
    [filters, onFiltersChange],
  )

  const handleCheckboxChange = useCallback(
    (key: string, optionValue: string, checked: boolean) => {
      const raw = filters[key]
      const arr = Array.isArray(raw) ? (raw as string[]) : []
      const next = checked
        ? [...arr, optionValue]
        : arr.filter((v) => v !== optionValue)
      onFiltersChange({ ...filters, [key]: next })
    },
    [filters, onFiltersChange],
  )

  const hasActiveFilters =
    Object.keys(filters).length > 0 &&
    Object.values(filters).some(
      (v) =>
        v !== undefined &&
        v !== '' &&
        (Array.isArray(v) ? v.length > 0 : true),
    )

  return (
    <div
      className={cn('flex flex-col', className)}
      role="region"
      aria-label="Filters"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Filters
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-primary"
          >
            Clear all
          </Button>
        )}
      </div>
      <Separator className="mt-2 mb-4" />
      <ScrollArea className={compact ? 'h-[60vh]' : 'max-h-[400px]'}>
        <div className="space-y-6 pr-2">
          {fields.map((field) => {
            if (field.type === 'range') {
              const val = filters[field.key] as number | undefined
              return (
                <div key={field.key} className="space-y-2">
                  <Label className="text-sm">{field.label}</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={field.min ?? 0}
                      max={field.max ?? 999999}
                      placeholder={String(field.min ?? '')}
                      value={val ?? ''}
                      onChange={(e) => {
                        const v = e.target.value
                        handleNumberFilter(field.key, v === '' ? '' : Number(v))
                      }}
                      className="rounded-lg"
                    />
                    {field.unit && (
                      <span className="text-sm text-muted-foreground">
                        {field.unit}
                      </span>
                    )}
                  </div>
                </div>
              )
            }
            if (field.type === 'checkbox' && field.options) {
              const selected = (filters[field.key] as string[]) ?? []
              return (
                <div key={field.key} className="space-y-2">
                  <Label className="text-sm">{field.label}</Label>
                  <div className="space-y-2">
                    {field.options.map((opt) => (
                      <label
                        key={opt.value}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <Checkbox
                          checked={selected.includes(opt.value)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(
                              field.key,
                              opt.value,
                              checked === true,
                            )
                          }
                          aria-label={opt.label}
                        />
                        <span className="text-sm">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )
            }
            return null
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
