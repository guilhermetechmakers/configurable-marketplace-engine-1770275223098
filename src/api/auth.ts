import { api } from '@/lib/api'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { AuthResponse, SignInInput, SignUpInput } from '@/types/auth'
import type { User } from '@/types/user'
import type { Profile } from '@/types/database/profile'

const AUTH_TOKEN_KEY = 'auth_token'

function setAuthToken(token: string | null) {
  if (token) localStorage.setItem(AUTH_TOKEN_KEY, token)
  else localStorage.removeItem(AUTH_TOKEN_KEY)
}

/** Map Supabase user + profile to app User type */
function mapSupabaseToUser(
  id: string,
  email: string,
  emailConfirmed: boolean,
  avatarUrl: string | undefined,
  profile: Profile | null,
): User {
  return {
    id,
    email,
    full_name: profile?.full_name ?? undefined,
    avatar_url: profile?.avatar_url ?? avatarUrl ?? undefined,
    role: (profile?.role as User['role']) ?? 'buyer',
    email_verified: emailConfirmed,
    created_at: '',
    updated_at: profile?.updated_at ?? '',
  }
}

export const authApi = {
  signIn: async (credentials: SignInInput): Promise<AuthResponse> => {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })
      if (error) throw new Error(error.message)
      const session = data.session
      const user = data.user
      if (!session?.access_token || !user) throw new Error('No session')
      setAuthToken(session.access_token)
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()
      const appUser = mapSupabaseToUser(
        user.id,
        user.email ?? '',
        !!user.email_confirmed_at,
        user.user_metadata?.avatar_url,
        profile as Profile | null,
      )
      return { token: session.access_token, user: appUser }
    }
    const data = await api.post<AuthResponse>('/auth/login', credentials)
    if (data.token) setAuthToken(data.token)
    return data
  },

  signUp: async (credentials: SignUpInput): Promise<AuthResponse> => {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.full_name,
            role: credentials.role,
            company: credentials.company ?? undefined,
          },
        },
      })
      if (error) throw new Error(error.message)
      const session = data.session
      const user = data.user
      if (!user) throw new Error('Sign up failed')
      const appUser = mapSupabaseToUser(
        user.id,
        user.email ?? '',
        !!user.email_confirmed_at,
        user.user_metadata?.avatar_url,
        null,
      )
      appUser.full_name = credentials.full_name
      appUser.role = credentials.role
      if (session?.access_token) setAuthToken(session.access_token)
      return { token: session?.access_token ?? '', user: appUser }
    }
    const data = await api.post<AuthResponse>('/auth/register', credentials)
    if (data.token) setAuthToken(data.token)
    return data
  },

  signOut: async (): Promise<void> => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut()
    } else {
      try {
        await api.post('/auth/logout', {})
      } catch {
        // ignore
      }
    }
    setAuthToken(null)
  },

  resetPasswordRequest: async (email: string): Promise<void> => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/password-reset`,
      })
      if (error) throw new Error(error.message)
      return
    }
    await api.post('/auth/forgot-password', { email })
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw new Error(error.message)
      return
    }
    await api.post('/auth/reset-password', { token, password: newPassword })
  },

  resendVerification: async (email?: string): Promise<void> => {
    if (isSupabaseConfigured() && supabase) {
      const targetEmail =
        email ??
        (await supabase.auth.getUser()).data.user?.email ??
        ''
      if (!targetEmail) throw new Error('Email required to resend verification')
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: targetEmail,
      })
      if (error) throw new Error(error.message)
      return
    }
    await api.post('/auth/resend-verification', {})
  },

  getCurrentUser: async (): Promise<User | null> => {
    if (isSupabaseConfigured() && supabase) {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return null
      const u = session.user
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', u.id)
        .maybeSingle()
      return mapSupabaseToUser(
        u.id,
        u.email ?? '',
        !!u.email_confirmed_at,
        u.user_metadata?.avatar_url,
        profile as Profile | null,
      )
    }
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (!token) return null
    try {
      return await api.get<User>('/users/me')
    } catch {
      return null
    }
  },

  signInWithOAuth: async (provider: 'google' | 'apple' | 'facebook'): Promise<void> => {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Social login is not configured')
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
    if (error) throw new Error(error.message)
  },
}
