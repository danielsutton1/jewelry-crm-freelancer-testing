import { createSupabaseServerClient } from '../lib/supabase/server'
import { Order } from './types'


export class OrdersService {
  async getOrders(): Promise<Order[]> {
    try {
      const supabase = await createSupabaseServerClient()

      const { data, error } = await supabase
        .from('orders')
        .select('*')

      if (error) {
        console.error('[OrdersService:getOrders] Database error:', error.message)
        throw new Error('Failed to fetch orders')
      }

      // Always return array, never undefined
      return data ?? []
    } catch (err) {
      console.error('[OrdersService:getOrders] Unexpected error:', err)
      throw err
    }
  }

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const supabase = await createSupabaseServerClient()

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('[OrdersService:getOrderById] Database error:', error.message)
        if (error.code === 'PGRST116') {
          // Record not found
          return null
        }
        throw new Error('Failed to fetch order')
      }

      // Return null if no record found, never undefined
      return data ?? null
    } catch (err) {
      console.error('[OrdersService:getOrderById] Unexpected error:', err)
      throw err
    }
  }
}
