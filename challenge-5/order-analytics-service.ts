// CHALLENGE 5: Fixed OrderAnalyticsService
// This file contains the fixed service code with proper error handling and data validation

import { 
  Order, 
  OrderItem, 
  OrderTotals, 
  OrderStatistics, 
  ServiceResult, 
  AnalyticsErrorCode
} from './types'

export class OrderAnalyticsService {
  /**
   * Calculate order totals with proper error handling and data validation
   * Handles undefined data, empty arrays, and missing items gracefully
   */
  async calculateOrderTotals(orders: Order[] | undefined | null): Promise<ServiceResult<OrderTotals>> {
    try {
      // Validate input data
      if (!orders) {
        return {
          success: false,
          error: 'Orders data is required',
          code: AnalyticsErrorCode.INVALID_INPUT
        }
      }

      if (!Array.isArray(orders)) {
        return {
          success: false,
          error: 'Orders must be an array',
          code: AnalyticsErrorCode.INVALID_INPUT
        }
      }

      // Handle empty array
      if (orders.length === 0) {
        const emptyTotals: OrderTotals = {
          totalRevenue: 0,
          averageOrderValue: 0,
          totalItems: 0
        }
        return { success: true, data: emptyTotals }
      }

      // Calculate totals with validation
      let totalRevenue = 0
      let totalItems = 0
      let validOrders = 0

      for (const order of orders) {
        if (!this.validateOrder(order)) {
          continue // Skip invalid orders
        }

        validOrders++
        
        // Calculate revenue for this order
        if (order.items && Array.isArray(order.items)) {
          for (const item of order.items) {
            if (this.validateOrderItem(item)) {
              totalRevenue += item.price * item.quantity
              totalItems += item.quantity
            }
          }
        }
      }

      // Calculate average order value
      const averageOrderValue = validOrders > 0 ? totalRevenue / validOrders : 0

      const totals: OrderTotals = {
        totalRevenue,
        averageOrderValue,
        totalItems
      }

      return { success: true, data: totals }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        code: AnalyticsErrorCode.CALCULATION_ERROR
      }
    }
  }
  
  /**
   * Get order statistics with proper error handling
   * Handles undefined data and empty arrays gracefully
   */
  async getOrderStatistics(orders: Order[] | undefined | null): Promise<ServiceResult<OrderStatistics>> {
    try {
      // Validate input data
      if (!orders) {
        return {
          success: false,
          error: 'Orders data is required',
          code: AnalyticsErrorCode.INVALID_INPUT
        }
      }

      if (!Array.isArray(orders)) {
        return {
          success: false,
          error: 'Orders must be an array',
          code: AnalyticsErrorCode.INVALID_INPUT
        }
      }

      // Handle empty array
      if (orders.length === 0) {
        const emptyStats: OrderStatistics = {
          totalOrders: 0,
          statusCounts: {}
        }
        return { success: true, data: emptyStats }
      }

      // Calculate statistics
      const totalOrders = orders.length
      const statusCounts: Record<string, number> = {}

      for (const order of orders) {
        if (!this.validateOrder(order)) {
          continue // Skip invalid orders
        }

        const status = order.status || 'unknown'
        statusCounts[status] = (statusCounts[status] || 0) + 1
      }

      const statistics: OrderStatistics = {
        totalOrders,
        statusCounts
      }

      return { success: true, data: statistics }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        code: AnalyticsErrorCode.CALCULATION_ERROR
      }
    }
  }

  /**
   * Validate order data structure
   */
  private validateOrder(order: unknown): order is Order {
    if (!order || typeof order !== 'object') {
      return false
    }

    const orderObj = order as Record<string, unknown>
    
    return (
      typeof orderObj.id === 'string' &&
      typeof orderObj.customer_id === 'string' &&
      typeof orderObj.total_amount === 'number' &&
      typeof orderObj.status === 'string' &&
      Array.isArray(orderObj.items) &&
      typeof orderObj.created_at === 'string' &&
      typeof orderObj.updated_at === 'string'
    )
  }

  /**
   * Validate order item data structure
   */
  private validateOrderItem(item: unknown): item is OrderItem {
    if (!item || typeof item !== 'object') {
      return false
    }

    const itemObj = item as Record<string, unknown>
    
    return (
      typeof itemObj.id === 'string' &&
      typeof itemObj.product_id === 'string' &&
      typeof itemObj.quantity === 'number' &&
      typeof itemObj.price === 'number' &&
      itemObj.quantity > 0 &&
      itemObj.price >= 0 &&
      typeof itemObj.created_at === 'string'
    )
  }
}
