import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MainLayout } from '@/components/layout/MainLayout'
import { AnimatedPage } from '@/components/AnimatedPage'
import { EmailVerificationDialog } from '@/components/auth/EmailVerificationDialog'
import {
  useSignIn,
  useSignUp,
  useSignInWithOAuth,
} from '@/hooks/useAuth'
import { isSupabaseConfigured } from '@/lib/supabase'
import type { UserRole } from '@/types/auth'
import { Loader2, Mail, Lock, User, Building2 } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
})

const signupSchema = z
  .object({
    full_name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'At least 8 characters'),
    confirmPassword: z.string(),
    role: z.enum(['buyer', 'seller'] as const),
    company: z.string().optional(),
    acceptTerms: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.acceptTerms === true, {
    message: 'You must accept the terms',
    path: ['acceptTerms'],
  })

type LoginFormData = z.infer<typeof loginSchema>
type SignupFormData = z.infer<typeof signupSchema>

const roles: { value: UserRole; label: string }[] = [
  { value: 'buyer', label: 'Buyer' },
  { value: 'seller', label: 'Seller' },
]

const socialProviders = [
  { provider: 'google' as const, label: 'Google' },
  { provider: 'apple' as const, label: 'Apple' },
  { provider: 'facebook' as const, label: 'Facebook' },
]

export function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  const defaultTab = location.pathname === '/signup' ? 'signup' : 'login'
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState<string | undefined>()

  const signIn = useSignIn()
  const signUp = useSignUp()
  const signInOAuth = useSignInWithOAuth()

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { remember: false },
  })

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: 'buyer', acceptTerms: false },
  })

  const onLoginSubmit = (data: LoginFormData) => {
    signIn.mutate(
      { email: data.email, password: data.password, remember: data.remember },
      {
        onSuccess: () => navigate('/dashboard'),
      },
    )
  }

  const onSignupSubmit = (data: SignupFormData) => {
    signUp.mutate(
      {
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        full_name: data.full_name,
        role: data.role,
        company: data.company,
        acceptTerms: data.acceptTerms,
      },
      {
        onSuccess: (_, variables) => {
          setVerificationEmail(variables.email)
          setVerificationDialogOpen(true)
        },
      },
    )
  }

  const onSocialLogin = (provider: 'google' | 'apple' | 'facebook') => {
    if (!isSupabaseConfigured()) {
      signInOAuth.mutate(provider) // will toast "Social login is not configured"
      return
    }
    signInOAuth.mutate(provider)
  }

  const onContinueAsGuest = () => {
    navigate('/listings')
  }

  return (
    <MainLayout>
      <AnimatedPage className="mx-auto flex min-h-[80vh] max-w-md items-center px-6 py-12">
        <Card className="w-full rounded-2xl border-border bg-card shadow-card transition-shadow duration-300 hover:shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              Welcome
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to your account or create a new one.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-xl bg-muted p-1">
                <TabsTrigger
                  value="login"
                  className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Log in
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Sign up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6 space-y-4">
                <form
                  onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        className="rounded-xl pl-9 focus-visible:ring-2 focus-visible:ring-primary/20"
                        {...loginForm.register('email')}
                      />
                    </div>
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-destructive">
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        className="rounded-xl pl-9 focus-visible:ring-2 focus-visible:ring-primary/20"
                        {...loginForm.register('password')}
                      />
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-destructive">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <Controller
                      name="remember"
                      control={loginForm.control}
                      render={({ field }) => (
                        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="rounded border-input"
                          />
                          <span>Remember me</span>
                        </label>
                      )}
                    />
                    <Link
                      to="/password-reset"
                      className="rounded text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-xl"
                    size="lg"
                    disabled={signIn.isPending}
                  >
                    {signIn.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Log in'
                    )}
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    <button
                      type="button"
                      className="font-medium text-primary hover:underline"
                      onClick={() => setVerificationDialogOpen(true)}
                    >
                      Resend verification email
                    </button>
                  </p>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-6 space-y-4">
                <form
                  onSubmit={signupForm.handleSubmit(onSignupSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="signup-full_name">Full name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="signup-full_name"
                        placeholder="Jane Doe"
                        className="rounded-xl pl-9 focus-visible:ring-2 focus-visible:ring-primary/20"
                        {...signupForm.register('full_name')}
                      />
                    </div>
                    {signupForm.formState.errors.full_name && (
                      <p className="text-sm text-destructive">
                        {signupForm.formState.errors.full_name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        className="rounded-xl pl-9 focus-visible:ring-2 focus-visible:ring-primary/20"
                        {...signupForm.register('email')}
                      />
                    </div>
                    {signupForm.formState.errors.email && (
                      <p className="text-sm text-destructive">
                        {signupForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        className="rounded-xl pl-9 focus-visible:ring-2 focus-visible:ring-primary/20"
                        {...signupForm.register('password')}
                      />
                    </div>
                    {signupForm.formState.errors.password && (
                      <p className="text-sm text-destructive">
                        {signupForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirmPassword">Confirm password</Label>
                    <Input
                      id="signup-confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20"
                      {...signupForm.register('confirmPassword')}
                    />
                    {signupForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {signupForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Controller
                      name="role"
                      control={signupForm.control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="rounded-xl focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((r) => (
                              <SelectItem key={r.value} value={r.value}>
                                {r.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-company">Company (optional)</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="signup-company"
                        placeholder="Acme Inc"
                        className="rounded-xl pl-9 focus-visible:ring-2 focus-visible:ring-primary/20"
                        {...signupForm.register('company')}
                      />
                    </div>
                  </div>
                  <Controller
                    name="acceptTerms"
                    control={signupForm.control}
                    render={({ field }) => (
                      <label className="flex cursor-pointer items-start gap-2 text-sm text-muted-foreground">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-0.5 rounded border-input"
                        />
                        <span>
                          I accept the{' '}
                          <Link
                            to="/terms"
                            className="font-medium text-primary hover:underline"
                          >
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link
                            to="/privacy"
                            className="font-medium text-primary hover:underline"
                          >
                            Privacy Policy
                          </Link>
                        </span>
                      </label>
                    )}
                  />
                  {signupForm.formState.errors.acceptTerms && (
                    <p className="text-sm text-destructive">
                      {signupForm.formState.errors.acceptTerms.message}
                    </p>
                  )}
                  <Button
                    type="submit"
                    className="w-full rounded-xl"
                    size="lg"
                    disabled={signUp.isPending}
                  >
                    {signUp.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Sign up'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {isSupabaseConfigured() && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-wider text-muted-foreground">
                    <span className="bg-card px-2">Or continue with</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {socialProviders.map(({ provider, label }) => (
                    <Button
                      key={provider}
                      type="button"
                      variant="outline"
                      className="rounded-xl border-border"
                      disabled={signInOAuth.isPending}
                      onClick={() => onSocialLogin(provider)}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </>
            )}

            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-xl border-border"
                onClick={onContinueAsGuest}
              >
                Continue as Guest
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                {defaultTab === 'login' ? (
                  <>
                    Don&apos;t have an account?{' '}
                    <Link
                      to="/signup"
                      className="font-medium text-primary hover:underline"
                    >
                      Sign up
                    </Link>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="font-medium text-primary hover:underline"
                    >
                      Log in
                    </Link>
                  </>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </AnimatedPage>

      <EmailVerificationDialog
        open={verificationDialogOpen}
        onOpenChange={setVerificationDialogOpen}
        email={verificationEmail}
      />
    </MainLayout>
  )
}
