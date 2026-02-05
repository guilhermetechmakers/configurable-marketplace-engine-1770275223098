import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Profile, ProfileUpdate } from '@/types/database/profile'

const editProfileSchema = z.object({
  full_name: z.string().min(1, 'Name is required').max(120, 'Name too long'),
  company: z.string().max(120).optional().or(z.literal('')),
  bio: z.string().max(500).optional().or(z.literal('')),
})

type EditProfileFormValues = z.infer<typeof editProfileSchema>

interface EditProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: Profile | null | undefined
  onSubmit: (values: ProfileUpdate) => void
  isSubmitting?: boolean
}

export function EditProfileModal({
  open,
  onOpenChange,
  profile,
  onSubmit,
  isSubmitting = false,
}: EditProfileModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      full_name: profile?.full_name ?? '',
      company: profile?.company ?? '',
      bio: profile?.bio ?? '',
    },
  })

  const onOpenChangeHandler = (next: boolean) => {
    if (next) {
      reset({
        full_name: profile?.full_name ?? '',
        company: profile?.company ?? '',
        bio: profile?.bio ?? '',
      })
    }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeHandler}>
      <DialogContent
        className="rounded-2xl border-border bg-card shadow-card sm:max-w-md"
        showClose
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            Edit profile
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update your name, company, and bio. Changes are saved to your
            account.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((values) => {
            onSubmit({
              full_name: values.full_name,
              company: values.company ? values.company : undefined,
              bio: values.bio ? values.bio : undefined,
            })
            onOpenChange(false)
          })}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="edit-full_name">Full name</Label>
            <Input
              id="edit-full_name"
              placeholder="Your name"
              className="rounded-xl border-input shadow-sm focus-visible:ring-ring"
              {...register('full_name')}
            />
            {errors.full_name && (
              <p className="text-sm text-destructive">
                {errors.full_name.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-company">Company (optional)</Label>
            <Input
              id="edit-company"
              placeholder="Company name"
              className="rounded-xl border-input shadow-sm focus-visible:ring-ring"
              {...register('company')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-bio">Bio (optional)</Label>
            <Textarea
              id="edit-bio"
              placeholder="A short bio"
              rows={3}
              className="rounded-xl border-input shadow-sm focus-visible:ring-ring resize-none"
              {...register('bio')}
            />
            {errors.bio && (
              <p className="text-sm text-destructive">{errors.bio.message}</p>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChangeHandler(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
