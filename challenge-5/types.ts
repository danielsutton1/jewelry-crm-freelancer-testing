// CHALLENGE 5: TypeScript types for OrderAnalyticsService
// This file contains comprehensive TypeScript type definitions

// Order item type
export interface OrderItem {
  id: string
  product_id: string
  quantity: number
  price: number
  created_at: string
}

// Order type with items
export interface Order {
  id: string
  customer_id: string
  total_amount: number
  status: string
  items: OrderItem[]
  created_at: string
  updated_at: string
}

// Order totals calculation result
export interface OrderTotals {
  totalRevenue: number
  averageOrderValue: number
  totalItems: number
}

// Order statistics result
export interface OrderStatistics {
  totalOrders: number
  statusCounts: Record<string, number>
}

// Union type for all possible service responses
export type ServiceResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string; code?: string }

// Error codes enum
export enum AnalyticsErrorCode {
  INVALID_INPUT = 'INVALID_INPUT',
  CALCULATION_ERROR = 'CALCULATION_ERROR'
}
