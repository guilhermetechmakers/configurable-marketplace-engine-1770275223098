import { useFormContext } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ListingPolicy } from '@/types/listing'

const POLICY_TYPES: { type: ListingPolicy['type']; label: string }[] = [
  { type: 'shipping', label: 'Shipping' },
  { type: 'returns', label: 'Returns' },
  { type: 'cancellation', label: 'Cancellation' },
  { type: 'service_terms', label: 'Service terms' },
]

export function PoliciesStep() {
  const { watch, setValue } = useFormContext()
  const policies = (watch('policies') ?? []) as ListingPolicy[]

  const getContent = (type: ListingPolicy['type']) =>
    policies.find((p) => p.type === type)?.content ?? ''

  const setContent = (type: ListingPolicy['type'], content: string) => {
    const next = policies.filter((p) => p.type !== type)
    if (content.trim()) next.push({ type, content: content.trim() })
    setValue('policies', next)
  }

  return (
    <Card className="rounded-2xl border-border bg-card shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-foreground">
          Policies
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Outline shipping, returns, cancellation, or service terms so buyers know what to expect.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {POLICY_TYPES.map(({ type, label }) => (
          <div key={type} className="space-y-2">
            <Label htmlFor={`policy-${type}`}>{label}</Label>
            <Textarea
              id={`policy-${type}`}
              placeholder={`e.g. ${type === 'shipping' ? 'Ships within 2–3 business days.' : `Describe your ${label.toLowerCase()} policy.`}`}
              value={getContent(type)}
              onChange={(e) => setContent(type, e.target.value)}
              rows={2}
              className="rounded-xl border-border focus-visible:ring-primary resize-none"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
