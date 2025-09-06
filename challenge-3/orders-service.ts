import { createClient } from '@supabase/supabase-js'
import { Order, OrdersServiceError } from './types'

export class OrdersService {
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async getOrders(): Promise<Order[]> {
    try {
      const { data, error } = await this.supabase
        .from('orders')
        .select('*')
      
      if (error) {
        console.error('Database error fetching orders:', error)
        throw new OrdersServiceError('Failed to fetch orders', 'DATABASE_ERROR')
      }
      
      return data || []
    } catch (error) {
      if (error instanceof OrdersServiceError) {
        throw error
      }
      console.error('Unexpected error in getOrders:', error)
      throw new OrdersServiceError('Unexpected error occurred', 'UNKNOWN_ERROR')
    }
  }
  
  async getOrderById(id: string): Promise<Order | null> {
    if (!id || typeof id !== 'string') {
      throw new OrdersServiceError('Invalid order ID provided', 'INVALID_INPUT')
    }

    try {
      const { data, error } = await this.supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        console.error('Database error fetching order:', error)
        throw new OrdersServiceError('Failed to fetch order', 'DATABASE_ERROR')
      }
      
      return data || null
    } catch (error) {
      if (error instanceof OrdersServiceError) {
        throw error
      }
      console.error('Unexpected error in getOrderById:', error)
      throw new OrdersServiceError('Unexpected error occurred', 'UNKNOWN_ERROR')
    }
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    if (!customerId || typeof customerId !== 'string') {
      throw new OrdersServiceError('Invalid customer ID provided', 'INVALID_INPUT')
    }

    try {
      const { data, error } = await this.supabase
        .from('orders')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Database error fetching customer orders:', error)
        throw new OrdersServiceError('Failed to fetch customer orders', 'DATABASE_ERROR')
      }
      
      return data || []
    } catch (error) {
      if (error instanceof OrdersServiceError) {
        throw error
      }
      console.error('Unexpected error in getOrdersByCustomer:', error)
      throw new OrdersServiceError('Unexpected error occurred', 'UNKNOWN_ERROR')
    }
  }
}
