// CHALLENGE 3: Fixed OrdersService
// This file contains the fixed service code with proper error handling and data validation

import { createClient } from '@supabase/supabase-js'
import { 
  Order, 
  ServiceResult, 
  OrderStatus,
  SupabaseOrderResult
} from './types'

export class OrdersService {
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  /**
   * Get all orders with proper error handling and data validation
   * Never returns undefined - always returns an array
   */
  async getOrders(): Promise<Order[]> {
    try {
      const { data, error } = await this.supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        throw new Error(`Failed to fetch orders: ${error.message}`)
      }
      
      return this.validateOrders(data || [])
      
    } catch (error) {
      return []
    }
  }
  
  /**
   * Get order by ID with proper error handling
   * Returns null for invalid IDs, never undefined
   */
  async getOrderById(id: string): Promise<Order | null> {
    try {
      if (!id || typeof id !== 'string') {
        return null
      }
      
      const { data, error } = await this.supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        throw new Error(`Failed to fetch order: ${error.message}`)
      }
      
      return data ? this.validateOrder(data) : null
      
    } catch (error) {
      return null
    }
  }

  /**
   * Validate and transform array of orders
   */
  private validateOrders(orders: SupabaseOrderResult[]): Order[] {
    if (!Array.isArray(orders)) {
      return []
    }
    
    return orders
      .map(order => this.validateOrder(order))
      .filter((order): order is Order => order !== null)
  }

  /**
   * Validate and transform single order
   */
  private validateOrder(orderData: SupabaseOrderResult): Order | null {
    try {
      const { id, customer_id, total_amount, status, created_at, updated_at } = orderData
      
      // Check required fields
      if (!id || !customer_id || total_amount === undefined) {
        return null
      }
      
      // Validate data types
      if (typeof total_amount !== 'number' || total_amount < 0) {
        return null
      }
      
      // Validate status
      const validStatuses = Object.values(OrderStatus)
      if (!validStatuses.includes(status as OrderStatus)) {
        return null
      }
      
      // Return validated order
      return {
        id,
        customer_id,
        total_amount,
        status,
        created_at,
        updated_at
      }
      
    } catch (error) {
      return null
    }
  }

  /**
   * Get orders with service response wrapper for better error handling
   */
  async getOrdersWithResponse(): Promise<ServiceResult<Order[]>> {
    try {
      const orders = await this.getOrders()
      return { success: true, data: orders }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        code: 'FETCH_ORDERS_ERROR'
      }
    }
  }

}
