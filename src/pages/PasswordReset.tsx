import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MainLayout } from '@/components/layout/MainLayout'
import { AnimatedPage } from '@/components/AnimatedPage'
import { usePasswordResetRequest } from '@/hooks/useAuth'

const requestSchema = z.object({
  email: z.string().email('Invalid email'),
})

const resetSchema = z
  .object({
    token: z.string().min(1, 'Token is required'),
    newPassword: z.string().min(8, 'At least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RequestFormData = z.infer<typeof requestSchema>
type ResetFormData = z.infer<typeof resetSchema>

export function PasswordReset() {
  const [requested, setRequested] = useState(false)
  const requestReset = usePasswordResetRequest()

  const requestForm = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
  })

  const resetForm = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  })

  const onRequestSubmit = (data: RequestFormData) => {
    requestReset.mutate(data.email, {
      onSuccess: () => setRequested(true),
    })
  }

  const onResetSubmit = (_data: ResetFormData) => {
    // In a real app, call API with token + newPassword
  }

  return (
    <MainLayout>
      <AnimatedPage className="mx-auto flex min-h-[80vh] max-w-md items-center px-6 py-12">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Password reset</CardTitle>
            <CardDescription>
              Request a reset link or enter your token and new password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="request">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="request">Request link</TabsTrigger>
                <TabsTrigger value="reset">Reset password</TabsTrigger>
              </TabsList>
              <TabsContent value="request" className="space-y-4 pt-4">
                {requested ? (
                  <div className="rounded-xl bg-accent p-4 text-center text-sm text-muted-foreground">
                    Check your email for the reset link. You can close this page.
                  </div>
                ) : (
                  <form
                    onSubmit={requestForm.handleSubmit(onRequestSubmit)}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        {...requestForm.register('email')}
                      />
                      {requestForm.formState.errors.email && (
                        <p className="text-sm text-destructive">
                          {requestForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={requestReset.isPending}
                    >
                      {requestReset.isPending ? 'Sending...' : 'Send reset link'}
                    </Button>
                  </form>
                )}
              </TabsContent>
              <TabsContent value="reset" className="space-y-4 pt-4">
                <form
                  onSubmit={resetForm.handleSubmit(onResetSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="token">Reset token</Label>
                    <Input
                      id="token"
                      placeholder="Paste token from email"
                      {...resetForm.register('token')}
                    />
                    {resetForm.formState.errors.token && (
                      <p className="text-sm text-destructive">
                        {resetForm.formState.errors.token.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      {...resetForm.register('newPassword')}
                    />
                    {resetForm.formState.errors.newPassword && (
                      <p className="text-sm text-destructive">
                        {resetForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...resetForm.register('confirmPassword')}
                    />
                    {resetForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {resetForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                  <Button type="submit" className="w-full">
                    Reset password
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              <Link to="/login" className="font-medium text-primary hover:underline">
                Back to login
              </Link>
            </p>
          </CardContent>
        </Card>
      </AnimatedPage>
    </MainLayout>
  )
}
