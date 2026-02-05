import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface ImageZoomModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  src: string
  alt: string
  className?: string
}

export function ImageZoomModal({
  open,
  onOpenChange,
  src,
  alt,
  className,
}: ImageZoomModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'max-w-[90vw] max-h-[90vh] w-auto p-0 overflow-hidden border-0 bg-transparent shadow-none',
          className,
        )}
        showClose={true}
      >
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <div className="flex items-center justify-center rounded-2xl overflow-hidden bg-black/90">
          <img
            src={src}
            alt={alt}
            className="max-h-[90vh] max-w-full w-auto object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
