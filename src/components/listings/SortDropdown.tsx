import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ListingSortOption } from '@/types/listing'
import { cn } from '@/lib/utils'

const SORT_LABELS: Record<ListingSortOption, string> = {
  relevance: 'Relevance',
  newest: 'Newest',
  price_asc: 'Price: low to high',
  price_desc: 'Price: high to low',
  rating: 'Rating',
}

interface SortDropdownProps {
  value: ListingSortOption
  onChange: (value: ListingSortOption) => void
  className?: string
}

export function SortDropdown({ value, onChange, className }: SortDropdownProps) {
  return (
    <Select
      value={value}
      onValueChange={(v) => onChange(v as ListingSortOption)}
    >
      <SelectTrigger
        className={cn('w-[180px] rounded-xl border-input', className)}
        aria-label="Sort listings by"
      >
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(SORT_LABELS) as ListingSortOption[]).map((opt) => (
          <SelectItem key={opt} value={opt} className="rounded-lg">
            {SORT_LABELS[opt]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
