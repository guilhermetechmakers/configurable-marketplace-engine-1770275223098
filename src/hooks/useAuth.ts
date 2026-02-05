import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/api/auth'
import { usersApi } from '@/api/users'
import { isSupabaseConfigured } from '@/lib/supabase'
import { toast } from 'sonner'

export const authKeys = {
  user: ['auth', 'user'] as const,
}

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: () =>
      isSupabaseConfigured()
        ? authApi.getCurrentUser()
        : usersApi.getCurrent(),
    retry: false,
    staleTime: 1000 * 60 * 10,
    enabled:
      typeof window !== 'undefined' &&
      (!!localStorage.getItem('auth_token') || isSupabaseConfigured()),
  })
}

export function useSignIn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.signIn,
    onSuccess: (data) => {
      if (data.user) {
        queryClient.setQueryData(authKeys.user, data.user)
      }
      toast.success('Signed in successfully')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Sign in failed')
    },
  })
}

export function useSignUp() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.signUp,
    onSuccess: (data) => {
      if (data.user) {
        queryClient.setQueryData(authKeys.user, data.user)
      }
      toast.success('Account created. Please verify your email.')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Sign up failed')
    },
  })
}

export function useSignOut() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.signOut,
    onSuccess: () => {
      queryClient.clear()
      toast.success('Signed out')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Sign out failed')
    },
  })
}

export function usePasswordResetRequest() {
  return useMutation({
    mutationFn: authApi.resetPasswordRequest,
    onSuccess: () => {
      toast.success('Password reset email sent')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Request failed')
    },
  })
}

export function usePasswordReset() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      authApi.resetPassword(token, newPassword),
    onSuccess: () => {
      queryClient.clear()
      toast.success('Password updated. You can sign in with your new password.')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Password update failed')
    },
  })
}

export function useVerifyEmailToken() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ tokenHash, type }: { tokenHash: string; type?: 'email' | 'signup' }) =>
      authApi.verifyToken(tokenHash, type ?? 'email'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.user })
      toast.success('Email verified successfully')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Verification failed')
    },
  })
}

export function useResendVerification() {
  return useMutation({
    mutationFn: authApi.resendVerification,
    onSuccess: () => {
      toast.success('Verification email sent')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to resend')
    },
  })
}

export function useSignInWithOAuth() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.signInWithOAuth,
    onError: (err: Error) => {
      toast.error(err.message ?? 'Social login failed')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.user })
    },
  })
}
