import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePasswordResetRequest } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Invalid email'),
})

type FormData = z.infer<typeof schema>

interface PasswordResetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PasswordResetModal({ open, onOpenChange }: PasswordResetModalProps) {
  const [submitted, setSubmitted] = useState(false)
  const requestReset = usePasswordResetRequest()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    requestReset.mutate(data.email, {
      onSuccess: () => {
        setSubmitted(true)
      },
    })
  }

  const handleClose = (next: boolean) => {
    if (!next) setSubmitted(false)
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="rounded-2xl border-border bg-card shadow-lg sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            Forgot password?
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter your email and we&apos;ll send you a link to reset your password.
          </DialogDescription>
        </DialogHeader>
        {submitted ? (
          <div className="rounded-xl bg-accent/50 p-4 text-center text-sm text-muted-foreground">
            Check your email for the reset link. You can close this window.
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="you@example.com"
                className="rounded-xl border-input focus:ring-2 focus:ring-primary/20"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full rounded-xl"
              disabled={requestReset.isPending}
            >
              {requestReset.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send reset link'
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
