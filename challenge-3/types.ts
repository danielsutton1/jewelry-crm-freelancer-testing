// CHALLENGE 3: TypeScript types for OrdersService
// This file contains the TypeScript type definitions for the OrdersService

// Order type matching the database schema
export interface Order {
  id: string
  customer_id: string
  total_amount: number
  status: string
  created_at: string
  updated_at: string
}

// Union type for all possible service responses
export type ServiceResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string; code?: string }

// Order status enum for type safety
export enum OrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Supabase query result types
export interface SupabaseOrderResult {
  id: string
  customer_id: string
  total_amount: number
  status: string
  created_at: string
  updated_at: string
}
