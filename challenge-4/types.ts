export interface User {
  id: string
  email: string
  email_confirmed_at?: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface UserData {
  id: string
  user_id: string
  profile_data?: Record<string, any>
  preferences?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface ProtectedRouteResponse {
  success: true
  data: UserData[]
  userId: string
}

export interface ErrorResponse {
  success: false
  error: string
}

export interface AuthContext {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading' | 'error'
