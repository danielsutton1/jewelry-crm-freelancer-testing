import { Order, OrderTotals, OrderStatistics, OrderItem, AnalyticsError } from './types'

export class OrderAnalyticsService {
  private validateOrders(orders: Order[] | null | undefined): Order[] {
    if (!orders || !Array.isArray(orders)) {
      throw new AnalyticsError('Orders data is required and must be an array', 'INVALID_INPUT')
    }
    return orders
  }

  private validateOrderItems(items: OrderItem[] | null | undefined): OrderItem[] {
    if (!items || !Array.isArray(items)) {
      return []
    }
    return items.filter(item => 
      item && 
      typeof item.price === 'number' && 
      typeof item.quantity === 'number' &&
      item.price >= 0 &&
      item.quantity >= 0
    )
  }

  async calculateOrderTotals(orders: Order[] | null | undefined): Promise<OrderTotals> {
    try {
      const validOrders = this.validateOrders(orders)
      
      if (validOrders.length === 0) {
        return {
          totalRevenue: 0,
          averageOrderValue: 0,
          totalItems: 0,
          orderCount: 0
        }
      }

      let totalRevenue = 0
      let totalItems = 0

      for (const order of validOrders) {
        const orderItems = this.validateOrderItems(order.items)
        
        const orderTotal = orderItems.reduce((itemSum, item) => {
          return itemSum + (item.price * item.quantity)
        }, 0)
        
        totalRevenue += orderTotal
        totalItems += orderItems.length
      }

      const averageOrderValue = totalRevenue / validOrders.length

      return {
        totalRevenue,
        averageOrderValue,
        totalItems,
        orderCount: validOrders.length
      }
    } catch (error) {
      if (error instanceof AnalyticsError) {
        throw error
      }
      console.error('Unexpected error in calculateOrderTotals:', error)
      throw new AnalyticsError('Failed to calculate order totals', 'CALCULATION_ERROR')
    }
  }
  
  async getOrderStatistics(orders: Order[] | null | undefined): Promise<OrderStatistics> {
    try {
      const validOrders = this.validateOrders(orders)
      
      if (validOrders.length === 0) {
        return {
          totalOrders: 0,
          statusCounts: {},
          averageItemsPerOrder: 0
        }
      }

      const statusCounts: Record<string, number> = {}
      let totalItemCount = 0

      for (const order of validOrders) {
        if (order.status) {
          statusCounts[order.status] = (statusCounts[order.status] || 0) + 1
        }
        
        const orderItems = this.validateOrderItems(order.items)
        totalItemCount += orderItems.length
      }

      const averageItemsPerOrder = totalItemCount / validOrders.length

      return {
        totalOrders: validOrders.length,
        statusCounts,
        averageItemsPerOrder
      }
    } catch (error) {
      if (error instanceof AnalyticsError) {
        throw error
      }
      console.error('Unexpected error in getOrderStatistics:', error)
      throw new AnalyticsError('Failed to get order statistics', 'CALCULATION_ERROR')
    }
  }

  async getRevenueByPeriod(orders: Order[] | null | undefined, period: 'day' | 'week' | 'month' = 'day'): Promise<Record<string, number>> {
    try {
      const validOrders = this.validateOrders(orders)
      
      const revenueByPeriod: Record<string, number> = {}

      for (const order of validOrders) {
        if (!order.created_at) continue

        const orderDate = new Date(order.created_at)
        let periodKey: string

        switch (period) {
          case 'week':
            const weekStart = new Date(orderDate)
            weekStart.setDate(orderDate.getDate() - orderDate.getDay())
            periodKey = weekStart.toISOString().split('T')[0]
            break
          case 'month':
            periodKey = orderDate.toISOString().slice(0, 7)
            break
          default:
            periodKey = orderDate.toISOString().split('T')[0]
        }

        const orderItems = this.validateOrderItems(order.items)
        const orderRevenue = orderItems.reduce((sum, item) => 
          sum + (item.price * item.quantity), 0
        )

        revenueByPeriod[periodKey] = (revenueByPeriod[periodKey] || 0) + orderRevenue
      }

      return revenueByPeriod
    } catch (error) {
      if (error instanceof AnalyticsError) {
        throw error
      }
      console.error('Unexpected error in getRevenueByPeriod:', error)
      throw new AnalyticsError('Failed to calculate revenue by period', 'CALCULATION_ERROR')
    }
  }
}
