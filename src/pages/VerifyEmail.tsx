import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { MainLayout } from '@/components/layout/MainLayout'
import { AnimatedPage } from '@/components/AnimatedPage'
import {
  useVerifyEmailToken,
  useResendVerification,
  useCurrentUser,
} from '@/hooks/useAuth'
import { VerificationFailedDialog } from '@/components/auth/VerificationFailedDialog'
import { ResendConfirmationDialog } from '@/components/auth/ResendConfirmationDialog'
import {
  Loader2,
  Mail,
  CheckCircle,
  AlertCircle,
  User,
  LayoutDashboard,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type VerifyStatus = 'idle' | 'verifying' | 'success' | 'failed'

const RATE_LIMIT_MESSAGE =
  'You can request a new verification email every 15 minutes.'
const RESEND_CONFIRM_MESSAGE =
  'You can request another verification email in 15 minutes if needed.'

export function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const tokenHash = searchParams.get('token_hash') ?? ''
  const typeParam = searchParams.get('type')
  const verificationType = typeParam === 'signup' ? 'signup' : 'email'

  const { data: user, refetch: refetchUser } = useCurrentUser()
  const verifyToken = useVerifyEmailToken()
  const resend = useResendVerification()

  const [status, setStatus] = useState<VerifyStatus>(tokenHash ? 'verifying' : 'idle')
  const [failedDialogOpen, setFailedDialogOpen] = useState(false)
  const [resendConfirmOpen, setResendConfirmOpen] = useState(false)
  const hasVerified = useRef(false)

  // Run verification once when token is present
  useEffect(() => {
    if (!tokenHash || hasVerified.current) return
    hasVerified.current = true
    verifyToken.mutate(
      { tokenHash, type: verificationType },
      {
        onSuccess: () => {
          setStatus('success')
          refetchUser()
        },
        onSettled: (_, error) => {
          if (error) setStatus('failed')
        },
      },
    )
  }, [tokenHash, verificationType, verifyToken, refetchUser])

  const handleResend = () => {
    resend.mutate(user?.email, {
      onSuccess: () => {
        setFailedDialogOpen(false)
        setResendConfirmOpen(true)
      },
    })
  }

  // Show verification failed dialog when status becomes failed
  useEffect(() => {
    if (status === 'failed') setFailedDialogOpen(true)
  }, [status])

  const isVerifying = status === 'verifying'
  const isSuccess = status === 'success'
  const isFailed = status === 'failed'
  const isIdle = status === 'idle'

  return (
    <MainLayout>
      <AnimatedPage className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6 py-12">
        {/* Header: welcome message */}
        <header className="mb-8 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Email verification
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {isVerifying && 'Verifying your email…'}
            {isSuccess && 'Welcome! Your email is verified.'}
            {isFailed && 'Verification failed'}
            {isIdle && 'Verify your email'}
          </h1>
        </header>

        {/* Main: status card */}
        <Card className="w-full rounded-2xl border-border bg-card shadow-card">
          <CardHeader className="text-center">
            {isVerifying && (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Loader2
                    className="h-8 w-8 animate-spin text-primary"
                    aria-hidden
                  />
                </div>
                <CardTitle className="text-xl">Verifying your email</CardTitle>
                <CardDescription>
                  Please wait while we confirm your email address.
                </CardDescription>
              </>
            )}
            {isSuccess && (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="h-8 w-8 text-primary" aria-hidden />
                </div>
                <CardTitle className="text-xl">Email verified</CardTitle>
                <CardDescription>
                  Your account is active. Complete your profile or go to the
                  dashboard to get started.
                </CardDescription>
              </>
            )}
            {isFailed && (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <AlertCircle className="h-8 w-8 text-destructive" aria-hidden />
                </div>
                <CardTitle className="text-xl">Verification failed</CardTitle>
                <CardDescription>
                  The link may have expired or is invalid. Request a new
                  verification email below.
                </CardDescription>
              </>
            )}
            {isIdle && (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-8 w-8 text-primary" aria-hidden />
                </div>
                <CardTitle className="text-xl">Check your email</CardTitle>
                <CardDescription>
                  We sent a verification link to your email. Click the link to
                  activate your account.
                </CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {isSuccess && (
              <div className="flex flex-col gap-3">
                <Button
                  asChild
                  className={cn(
                    'w-full rounded-xl transition-all duration-200',
                    'hover:scale-[1.02] hover:shadow-md',
                  )}
                  size="lg"
                >
                  <Link to="/profile" className="inline-flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Complete profile
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className={cn(
                    'w-full rounded-xl transition-all duration-200',
                    'hover:scale-[1.02] hover:shadow-md',
                  )}
                  size="lg"
                >
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Go to dashboard
                  </Link>
                </Button>
              </div>
            )}
            {(isFailed || isIdle) && (
              <>
                <Button
                  className={cn(
                    'w-full rounded-xl transition-all duration-200',
                    'hover:scale-[1.02] hover:shadow-md',
                  )}
                  size="lg"
                  disabled={resend.isPending}
                  onClick={handleResend}
                >
                  {resend.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Resend verification email'
                  )}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  {RATE_LIMIT_MESSAGE}
                </p>
              </>
            )}
            {isFailed && (
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setFailedDialogOpen(true)}
              >
                See help and rate limit info
              </Button>
            )}
            <p className="text-center text-sm text-muted-foreground">
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                Back to login
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Footer: support links */}
        <footer className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Need help?{' '}
            <Link to="/help" className="font-medium text-primary hover:underline">
              Contact support
            </Link>
            {' · '}
            <Link to="/help" className="font-medium text-primary hover:underline">
              FAQs
            </Link>
          </p>
        </footer>
      </AnimatedPage>

      <VerificationFailedDialog
        open={failedDialogOpen}
        onOpenChange={setFailedDialogOpen}
        onResend={handleResend}
        isResendPending={resend.isPending}
        rateLimitMessage={RATE_LIMIT_MESSAGE}
      />
      <ResendConfirmationDialog
        open={resendConfirmOpen}
        onOpenChange={setResendConfirmOpen}
        rateLimitInfo={RESEND_CONFIRM_MESSAGE}
      />
    </MainLayout>
  )
}
