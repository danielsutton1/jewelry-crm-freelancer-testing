export interface OrderItem {
  id: string
  product_id: string
  quantity: number
  price: number
  created_at?: string
}

export interface Order {
  id: string
  customer_id: string
  total_amount: number
  status: string
  items: OrderItem[]
  created_at: string
  updated_at: string
}

export interface OrderTotals {
  totalRevenue: number
  averageOrderValue: number
  totalItems: number
  orderCount: number
}

export interface OrderStatistics {
  totalOrders: number
  statusCounts: Record<string, number>
  averageItemsPerOrder: number
}

export class AnalyticsError extends Error {
  public code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = 'AnalyticsError'
    this.code = code
  }
}

export interface RevenueData {
  period: string
  revenue: number
}

export interface AnalyticsFilters {
  startDate?: string
  endDate?: string
  status?: string
  customerId?: string
}

export type PeriodType = 'day' | 'week' | 'month' | 'year'
