import { Link } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface SignupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignupModal({ open, onOpenChange }: SignupModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-2xl border-border bg-card shadow-card sm:max-w-md"
        showClose={true}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            Get started in minutes
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Create your account to configure your marketplace, onboard sellers,
            and go live. No credit card required for the starter plan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link to="/signup" onClick={() => onOpenChange(false)}>
              Create account
            </Link>
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
