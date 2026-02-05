import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { LandingTemplate } from '@/types/landing'

interface DemoLaunchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: LandingTemplate | null
}

export function DemoLaunchDialog({
  open,
  onOpenChange,
  template,
}: DemoLaunchDialogProps) {
  const navigate = useNavigate()

  const handleLaunch = () => {
    if (template?.demo_link) {
      onOpenChange(false)
      navigate(template.demo_link)
    }
  }

  if (!template) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-2xl border-border bg-card shadow-card sm:max-w-md"
        showClose={true}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {template.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {template.description ??
              'Launch the demo to explore this use case with sample data.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button size="lg" className="w-full sm:w-auto" onClick={handleLaunch}>
            Launch demo
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
