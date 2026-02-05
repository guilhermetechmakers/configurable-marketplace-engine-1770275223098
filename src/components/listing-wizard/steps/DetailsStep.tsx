import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ListingDetailField } from '@/types/listing'

interface DetailsStepProps {
  detailSchema: ListingDetailField[]
  /** Whether title/summary are shown (always shown in details step) */
  showTitleSummary?: boolean
}

/** Default schema when category has no detail_schema */
const DEFAULT_DETAIL_SCHEMA: ListingDetailField[] = [
  { key: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Listing title' },
  { key: 'summary', label: 'Summary', type: 'textarea', placeholder: 'Short description' },
  { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Full description' },
]

function FieldRenderer({
  field,
  value,
  onChange,
  error,
}: {
  field: ListingDetailField
  value: unknown
  onChange: (key: string, value: string | number | boolean) => void
  error?: string
}) {
  const name = field.key
  const id = `detail-${name}`

  if (field.type === 'textarea') {
    return (
      <div className="space-y-2">
        <Label htmlFor={id}>
          {field.label}
          {field.required && <span className="text-destructive"> *</span>}
        </Label>
        <Textarea
          id={id}
          placeholder={field.placeholder}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(name, e.target.value)}
          className="rounded-xl border-border focus-visible:ring-primary resize-none"
          rows={3}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    )
  }

  if (field.type === 'select') {
    return (
      <div className="space-y-2">
        <Label htmlFor={id}>
          {field.label}
          {field.required && <span className="text-destructive"> *</span>}
        </Label>
        <Select
          value={(value as string) ?? ''}
          onValueChange={(v) => onChange(name, v)}
        >
          <SelectTrigger id={id} className="rounded-xl border-border focus:ring-primary">
            <SelectValue placeholder={field.placeholder ?? 'Select…'} />
          </SelectTrigger>
          <SelectContent>
            {(field.options ?? []).map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    )
  }

  if (field.type === 'checkbox') {
    return (
      <div className="flex items-center gap-2 space-y-0">
        <Checkbox
          id={id}
          checked={Boolean(value)}
          onCheckedChange={(checked) => onChange(name, !!checked)}
        />
        <Label htmlFor={id} className="font-normal cursor-pointer">
          {field.label}
        </Label>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    )
  }

  if (field.type === 'number') {
    return (
      <div className="space-y-2">
        <Label htmlFor={id}>
          {field.label}
          {field.required && <span className="text-destructive"> *</span>}
        </Label>
        <Input
          id={id}
          type="number"
          min={field.min}
          max={field.max}
          placeholder={field.placeholder}
          value={(value as number) ?? ''}
          onChange={(e) => onChange(name, e.target.value === '' ? 0 : Number(e.target.value))}
          className="rounded-xl border-border focus-visible:ring-primary"
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    )
  }

  // text | date
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {field.label}
        {field.required && <span className="text-destructive"> *</span>}
      </Label>
      <Input
        id={id}
        type={field.type === 'date' ? 'date' : 'text'}
        placeholder={field.placeholder}
        value={(value as string) ?? ''}
        onChange={(e) => onChange(name, e.target.value)}
        className="rounded-xl border-border focus-visible:ring-primary"
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

export function DetailsStep({
  detailSchema,
  showTitleSummary = true,
}: DetailsStepProps) {
  const { register, setValue, watch, formState: { errors } } = useFormContext()
  const schema = detailSchema.length > 0 ? detailSchema : DEFAULT_DETAIL_SCHEMA
  const attributes = watch('attributes') ?? {}

  const handleAttributeChange = (key: string, value: string | number | boolean) => {
    setValue('attributes', { ...attributes, [key]: value })
  }

  return (
    <Card className="rounded-2xl border-border bg-card shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-foreground">
          Listing details
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Fill in the information. Fields adapt to the selected category.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {showTitleSummary && (
          <>
            <div className="space-y-2">
              <Label htmlFor="listing-title">Title</Label>
              <Input
                id="listing-title"
                placeholder="Listing title"
                className="rounded-xl border-border focus-visible:ring-primary"
                {...register('title', { required: 'Title is required', maxLength: 200 })}
              />
              {errors.title && (
                <p className="text-xs text-destructive">
                  {(errors.title as { message?: string }).message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="listing-summary">Summary</Label>
              <Textarea
                id="listing-summary"
                placeholder="Short description"
                rows={3}
                className="rounded-xl border-border focus-visible:ring-primary resize-none"
                {...register('summary')}
              />
            </div>
          </>
        )}
        {schema
          .filter((f) => f.key !== 'title' && f.key !== 'summary')
          .map((field) => (
            <FieldRenderer
              key={field.key}
              field={field}
              value={attributes[field.key]}
              onChange={handleAttributeChange}
              error={(errors.attributes as Record<string, { message?: string }>)?.[field.key]?.message}
            />
          ))}
      </CardContent>
    </Card>
  )
}
