import { useFormContext } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import type { AvailabilitySlot } from '@/types/listing'

const RECURRING_OPTIONS = [
  { value: '', label: 'One-time' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]

export function AvailabilityStep() {
  const { watch, setValue } = useFormContext()
  const slots = (watch('availability_slots') ?? []) as AvailabilitySlot[]

  const addSlot = () => {
    setValue('availability_slots', [
      ...slots,
      { start_date: '', end_date: '', recurring_pattern: null },
    ])
  }

  const updateSlot = (index: number, updates: Partial<AvailabilitySlot>) => {
    const next = [...slots]
    next[index] = { ...next[index], ...updates }
    setValue('availability_slots', next)
  }

  const removeSlot = (index: number) => {
    setValue(
      'availability_slots',
      slots.filter((_, i) => i !== index),
    )
  }

  return (
    <Card className="rounded-2xl border-border bg-card shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-foreground">
          Availability
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Set when this listing is available. Add date ranges or recurring patterns for bookings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {slots.map((slot, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 rounded-xl border border-border bg-muted/20 p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Slot {index + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => removeSlot(index)}
                aria-label="Remove slot"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label>Start date</Label>
                <Input
                  type="date"
                  value={slot.start_date}
                  onChange={(e) => updateSlot(index, { start_date: e.target.value })}
                  className="rounded-xl border-border focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label>End date</Label>
                <Input
                  type="date"
                  value={slot.end_date}
                  onChange={(e) => updateSlot(index, { end_date: e.target.value })}
                  className="rounded-xl border-border focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label>Recurring</Label>
                <Select
                  value={slot.recurring_pattern ?? 'none'}
                  onValueChange={(v) =>
                    updateSlot(index, {
                      recurring_pattern: v === 'none' ? null : (v as AvailabilitySlot['recurring_pattern']),
                    })
                  }
                >
                  <SelectTrigger className="rounded-xl border-border focus:ring-primary">
                    <SelectValue placeholder="One-time" />
                  </SelectTrigger>
                  <SelectContent>
                    {RECURRING_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value || 'none'} value={opt.value || 'none'}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-xl border-dashed"
          onClick={addSlot}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add availability slot
        </Button>
      </CardContent>
    </Card>
  )
}
