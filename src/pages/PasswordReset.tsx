import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/MainLayout'
import { AnimatedPage } from '@/components/AnimatedPage'
import {
  usePasswordResetRequest,
  usePasswordReset,
  useSignOut,
} from '@/hooks/useAuth'
import { isSupabaseConfigured } from '@/lib/supabase'
import { Loader2, Mail, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const requestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

const resetSchemaWithConfirm = z
  .object({
    token: z.string().optional(),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RequestFormData = z.infer<typeof requestSchema>
type ResetFormData = z.infer<typeof resetSchemaWithConfirm>

/** Detect if user landed from Supabase recovery link (hash contains type=recovery) */
function useIsRecoveryMode(): boolean {
  const [isRecovery, setIsRecovery] = useState(false)
  useEffect(() => {
    if (!isSupabaseConfigured()) return
    const hash = window.location.hash
    const params = new URLSearchParams(hash.replace(/^#/, ''))
    setIsRecovery(params.get('type') === 'recovery')
  }, [])
  return isRecovery
}

/** For API flow: URL may contain token= in query */
function useUrlResetToken(): string | null {
  const [token, setToken] = useState<string | null>(null)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const t = params.get('token')
    setToken(t ?? null)
  }, [])
  return token
}

type ViewState = 'request' | 'request_sent' | 'reset' | 'reset_success'

export function PasswordReset() {
  const [viewState, setViewState] = useState<ViewState>('request')
  const isRecoveryMode = useIsRecoveryMode()
  const urlResetToken = useUrlResetToken()

  const requestReset = usePasswordResetRequest()
  const resetPassword = usePasswordReset()
  const signOut = useSignOut()

  const requestForm = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
  })

  const resetForm = useForm<ResetFormData>({
    resolver: zodResolver(resetSchemaWithConfirm),
    defaultValues: { token: '' },
  })

  useEffect(() => {
    if (isRecoveryMode) setViewState('reset')
  }, [isRecoveryMode])

  useEffect(() => {
    if (urlResetToken && !isSupabaseConfigured()) setViewState('reset')
  }, [urlResetToken])

  const onRequestSubmit = (data: RequestFormData) => {
    requestReset.mutate(data.email, {
      onSuccess: () => setViewState('request_sent'),
    })
  }

  const onResetSubmit = (data: ResetFormData) => {
    if (
      !isSupabaseConfigured() &&
      !urlResetToken &&
      !(data.token?.trim())
    ) {
      resetForm.setError('token', {
        type: 'manual',
        message: 'Paste the token from your reset email',
      })
      return
    }
    const token = isSupabaseConfigured()
      ? ''
      : (urlResetToken ?? data.token ?? '')
    resetPassword.mutate(
      { token, newPassword: data.newPassword },
      {
        onSuccess: () => {
          setViewState('reset_success')
          signOut.mutate(undefined, { onSettled: () => {} })
        },
      },
    )
  }

  return (
    <MainLayout>
      <AnimatedPage className="flex min-h-[80vh] flex-col">
        {/* Minimal header: back to login */}
        <header className="border-b border-border bg-card shadow-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
            <Link
              to="/login"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg px-2 py-1 -ml-2"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to login
            </Link>
          </div>
        </header>

        {/* Main: single card with request / request_sent / reset / success */}
        <main className="mx-auto flex w-full max-w-md flex-1 items-center px-6 py-12 md:px-8">
          <Card
            className={cn(
              'w-full rounded-2xl border border-border bg-card shadow-card transition-shadow duration-300 hover:shadow-lg',
            )}
          >
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
                Password reset
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {viewState === 'request' &&
                  'Enter your email and we’ll send you a link to reset your password.'}
                {viewState === 'request_sent' && 'Check your email for next steps.'}
                {viewState === 'reset' &&
                  'Enter your new password below.'}
                {viewState === 'reset_success' && 'Your password has been updated.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Request form */}
              {viewState === 'request' && (
                <form
                  onSubmit={requestForm.handleSubmit(onRequestSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="rounded-xl pl-9 focus-visible:ring-2 focus-visible:ring-primary/20"
                        {...requestForm.register('email')}
                      />
                    </div>
                    {requestForm.formState.errors.email && (
                      <p className="text-sm text-destructive">
                        {requestForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-xl"
                    size="lg"
                    disabled={requestReset.isPending}
                  >
                    {requestReset.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        Sending...
                      </>
                    ) : (
                      'Send reset link'
                    )}
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    {isSupabaseConfigured() ? (
                      'Already have a reset link? Open it from your email.'
                    ) : (
                      <button
                        type="button"
                        className="font-medium text-primary hover:underline"
                        onClick={() => setViewState('reset')}
                      >
                        Have a reset token? Set new password
                      </button>
                    )}
                  </p>
                </form>
              )}

              {/* Request sent confirmation */}
              {viewState === 'request_sent' && (
                <div className="rounded-xl bg-accent/80 p-4 text-center text-sm text-muted-foreground animate-fade-in">
                  We’ve sent an email with reset instructions. Check your inbox and
                  click the link to set a new password. You can close this page.
                </div>
              )}

              {/* Reset form (new password + confirm; optional token for API) */}
              {viewState === 'reset' && (
                <form
                  onSubmit={resetForm.handleSubmit(onResetSubmit)}
                  className="space-y-4"
                >
                  {!isSupabaseConfigured() && !urlResetToken && (
                    <div className="space-y-2">
                      <Label htmlFor="reset-token">Reset token</Label>
                      <Input
                        id="reset-token"
                        type="text"
                        placeholder="Paste token from email"
                        autoComplete="one-time-code"
                        className="rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20"
                        {...resetForm.register('token')}
                      />
                      {resetForm.formState.errors.token && (
                        <p className="text-sm text-destructive">
                          {resetForm.formState.errors.token.message}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="reset-new-password">New password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="reset-new-password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="rounded-xl pl-9 focus-visible:ring-2 focus-visible:ring-primary/20"
                        {...resetForm.register('newPassword')}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      At least 8 characters; include uppercase, lowercase, and a number.
                    </p>
                    {resetForm.formState.errors.newPassword && (
                      <p className="text-sm text-destructive">
                        {resetForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reset-confirm-password">Confirm password</Label>
                    <Input
                      id="reset-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20"
                      {...resetForm.register('confirmPassword')}
                    />
                    {resetForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {resetForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-xl"
                    size="lg"
                    disabled={resetPassword.isPending}
                  >
                    {resetPassword.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        Updating...
                      </>
                    ) : (
                      'Reset password'
                    )}
                  </Button>
                </form>
              )}

              {/* Success state */}
              {viewState === 'reset_success' && (
                <div className="animate-fade-in space-y-4">
                  <div className="flex flex-col items-center gap-3 rounded-xl bg-accent/80 p-6 text-center">
                    <CheckCircle2 className="h-12 w-12 text-primary" aria-hidden />
                    <p className="text-sm text-muted-foreground">
                      Your password has been updated. You can now sign in with your
                      new password.
                    </p>
                  </div>
                  <Button
                    asChild
                    className="w-full rounded-xl"
                    size="lg"
                  >
                    <Link to="/login">Return to login</Link>
                  </Button>
                </div>
              )}

              {/* Back to login link when not on success */}
              {viewState !== 'reset_success' && (
                <p className="text-center text-sm text-muted-foreground">
                  <Link
                    to="/login"
                    className="font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-1"
                  >
                    Back to login
                  </Link>
                </p>
              )}
            </CardContent>
          </Card>
        </main>

        {/* Footer is provided by MainLayout */}
      </AnimatedPage>
    </MainLayout>
  )
}
