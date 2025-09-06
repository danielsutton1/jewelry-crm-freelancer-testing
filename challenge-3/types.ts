export interface Order {
  id: string
  customer_id: string
  total_amount: number
  status: string
  created_at: string
  updated_at: string
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export class OrdersServiceError extends Error {
  public code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = 'OrdersServiceError'
    this.code = code
  }
}

export interface ServiceResponse<T> {
  data: T
  error?: string
}

export interface OrderFilters {
  status?: OrderStatus
  customerId?: string
  startDate?: string
  endDate?: string
}
