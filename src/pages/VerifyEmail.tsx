import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/MainLayout'
import { AnimatedPage } from '@/components/AnimatedPage'
import { useResendVerification } from '@/hooks/useAuth'
import { Loader2, Mail, CheckCircle } from 'lucide-react'

export function VerifyEmail() {
  const resend = useResendVerification()
  type VerifyStatus = 'pending' | 'success' | 'failed'
  const status = 'pending' as VerifyStatus // In real app, derive from query params or API

  return (
    <MainLayout>
      <AnimatedPage className="mx-auto flex min-h-[80vh] max-w-md items-center px-6 py-12">
        <Card className="w-full">
          <CardHeader className="text-center">
            {status === 'pending' && (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                <CardTitle className="text-2xl">Verify your email</CardTitle>
                <CardDescription>
                  We sent a verification link to your email. Click the link to activate your account.
                </CardDescription>
              </>
            )}
            {status === 'success' && (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Email verified</CardTitle>
                <CardDescription>
                  Your account is active. You can complete your profile or go to the dashboard.
                </CardDescription>
              </>
            )}
            {status === 'failed' && (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <Mail className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle className="text-2xl">Verification failed</CardTitle>
                <CardDescription>
                  The link may have expired. Request a new verification email below.
                </CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/dashboard">Go to dashboard</Link>
            </Button>
            <Button
              variant="outline"
              className="w-full"
              disabled={resend.isPending}
              onClick={() => resend.mutate()}
            >
              {resend.isPending ? 'Sending...' : 'Resend verification email'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
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
