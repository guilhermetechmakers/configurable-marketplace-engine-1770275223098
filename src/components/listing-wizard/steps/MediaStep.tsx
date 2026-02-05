import { useCallback, useRef } from 'react'
import { useFormContext } from 'react-hook-form'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const MAX_MEDIA = 10
const ACCEPT = 'image/*,.webp'

export function MediaStep() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { watch, setValue } = useFormContext()
  const mediaUrls = (watch('media_urls') ?? []) as string[]

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files?.length) return
      const next: string[] = [...mediaUrls]
      for (let i = 0; i < files.length && next.length < MAX_MEDIA; i++) {
        const file = files[i]
        if (!file.type.startsWith('image/')) continue
        const url = URL.createObjectURL(file)
        next.push(url)
      }
      setValue('media_urls', next)
      e.target.value = ''
    },
    [mediaUrls, setValue],
  )

  const removeAt = (index: number) => {
    const next = mediaUrls.filter((_, i) => i !== index)
    setValue('media_urls', next)
  }

  return (
    <Card className="rounded-2xl border-border bg-card shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-foreground">
          Media
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Upload images. Drag and drop or click to add. You can reorder or remove later.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Label className="sr-only">Upload images</Label>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="hidden"
          onChange={handleFileChange}
          aria-label="Choose image files"
        />
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          className={cn(
            'flex min-h-[160px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/30 p-8 text-center transition-all duration-200',
            'hover:border-primary hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          )}
        >
          <Upload className="h-10 w-10 text-muted-foreground" aria-hidden />
          <span className="text-sm font-medium text-muted-foreground">
            Drag and drop images here, or click to upload
          </span>
          <span className="text-xs text-muted-foreground">
            Up to {MAX_MEDIA} images. WebP, PNG, JPG.
          </span>
        </div>
        {mediaUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {mediaUrls.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted"
              >
                {url.startsWith('blob:') || url.startsWith('http') ? (
                  <img
                    src={url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8 rounded-lg opacity-90 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeAt(index)
                  }}
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
