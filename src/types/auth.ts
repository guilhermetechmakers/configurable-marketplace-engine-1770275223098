export type UserRole = 'buyer' | 'seller' | 'admin' | 'moderator'

export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    full_name?: string
    avatar_url?: string
    role: UserRole
    email_verified: boolean
  }
}

export interface SignInInput {
  email: string
  password: string
  remember?: boolean
}

export interface SignUpInput {
  email: string
  password: string
  confirmPassword: string
  full_name: string
  role: UserRole
  company?: string
  acceptTerms: boolean
}
