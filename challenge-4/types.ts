// CHALLENGE 4: TypeScript types for protected route
// This file contains TypeScript type definitions for authentication

// User type from Supabase Auth
export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
  aud: string
  role: string
  email_confirmed_at?: string
  phone?: string
  confirmed_at?: string
  last_sign_in_at?: string
  app_metadata: Record<string, unknown>
  user_metadata: Record<string, unknown>
  identities: unknown[]
  factors?: unknown[]
}

// User data from database
export interface UserData {
  id: string
  user_id: string
  data: Record<string, unknown>
  created_at: string
  updated_at: string
}

// Success response for authenticated users
export interface ProtectedRouteSuccessResponse {
  success: true
  data: UserData[]
}

// Error response for various scenarios
export interface ProtectedRouteErrorResponse {
  success: false
  error: string
  status: number
}

// Union type for all possible responses
export type ProtectedRouteResponse = ProtectedRouteSuccessResponse | ProtectedRouteErrorResponse

// HTTP status codes enum
export enum HttpStatus {
  OK = 200,
  UNAUTHORIZED = 401,
  INTERNAL_SERVER_ERROR = 500
}
