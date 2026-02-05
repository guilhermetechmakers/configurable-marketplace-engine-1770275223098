import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ListingPreviewPanel } from '@/components/listing-wizard/ListingPreviewPanel'
import { Image as ImageIcon } from 'lucide-react'
import type { ListingPolicy } from '@/types/listing'

interface PreviewStepProps {
  categoryName?: string
}

export function PreviewStep({ categoryName }: PreviewStepProps) {
  const { watch } = useFormContext()
  const title = watch('title')
  const summary = watch('summary')
  const priceCents = watch('price_cents') as number | undefined
  const currency = watch('currency') ?? 'USD'
  const mediaUrls = (watch('media_urls') ?? []) as string[]
  const policies = (watch('policies') ?? []) as ListingPolicy[]
  const attributes = watch('attributes') ?? {}

  const priceLabel =
    priceCents != null && priceCents > 0
      ? `${(priceCents / 100).toFixed(2)} ${currency}`
      : 'Price on request'

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
      <Card className="rounded-2xl border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground">
            Preview
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Review how your listing will appear. Save as draft or publish when ready.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">
              Media ({mediaUrls.length})
            </h4>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {mediaUrls.length > 0 ? (
                mediaUrls.map((url, i) => (
                  <div
                    key={i}
                    className="h-24 w-32 shrink-0 overflow-hidden rounded-xl border border-border bg-muted"
                  >
                    <img
                      src={url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))
              ) : (
                <div className="flex h-24 w-32 shrink-0 items-center justify-center rounded-xl border border-dashed border-border text-muted-foreground">
                  <ImageIcon className="h-8 w-8" />
                </div>
              )}
            </div>
          </section>
          <section>
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">
              Details
            </h4>
            <p className="font-bold text-foreground">{title || '—'}</p>
            {categoryName && (
              <Badge variant="secondary" className="mt-1">
                {categoryName}
              </Badge>
            )}
            {summary && (
              <p className="mt-2 text-sm text-muted-foreground">{summary}</p>
            )}
            <p className="mt-2 font-medium text-primary">{priceLabel}</p>
            {Object.keys(attributes).length > 0 && (
              <dl className="mt-3 space-y-1 text-sm">
                {Object.entries(attributes).map(([key, val]) =>
                  val != null && String(val).trim() !== '' ? (
                    <div key={key} className="flex gap-2">
                      <dt className="text-muted-foreground capitalize">{key}:</dt>
                      <dd className="text-foreground">{String(val)}</dd>
                    </div>
                  ) : null,
                )}
              </dl>
            )}
          </section>
          {policies.filter((p) => p.content).length > 0 && (
            <section>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                Policies
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {policies
                  .filter((p) => p.content)
                  .map((p) => (
                    <li key={p.type}>
                      <span className="font-medium capitalize text-foreground">
                        {p.type.replace('_', ' ')}:
                      </span>{' '}
                      {p.content}
                    </li>
                  ))}
              </ul>
            </section>
          )}
        </CardContent>
      </Card>
      <aside className="hidden lg:block">
        <ListingPreviewPanel categoryName={categoryName} />
      </aside>
    </div>
  )
}
