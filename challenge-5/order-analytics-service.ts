// File: challenge-5/order-analytics-service.ts
import { Order, OrderTotals, OrderStatistics } from './types'

export class OrderAnalyticsService {
  async calculateOrderTotals(orders?: Order[]): Promise<OrderTotals> {
    try {
      if (!orders || !Array.isArray(orders)) {
        console.warn('[OrderAnalyticsService] Invalid or undefined orders array')
        return { totalRevenue: 0, averageOrderValue: 0, totalItems: 0 }
      }

      if (orders.length === 0) {
        return { totalRevenue: 0, averageOrderValue: 0, totalItems: 0 }
      }

      const totalRevenue = orders.reduce((sum, order) => {
        if (!order.items || !Array.isArray(order.items)) return sum

        return (
          sum +
          order.items.reduce((itemSum, item) => {
            const price = typeof item.price === 'number' ? item.price : 0
            const quantity = typeof item.quantity === 'number' ? item.quantity : 0
            return itemSum + price * quantity
          }, 0)
        )
      }, 0)

      const averageOrderValue = totalRevenue / orders.length

      const totalItems = orders.reduce((sum, order) => {
        if (!order.items || !Array.isArray(order.items)) return sum
        return sum + order.items.length
      }, 0)

      return { totalRevenue, averageOrderValue, totalItems }
    } catch (err: any) {
      console.error('[OrderAnalyticsService] Error in calculateOrderTotals:', err.message)
      return { totalRevenue: 0, averageOrderValue: 0, totalItems: 0 }
    }
  }

  async getOrderStatistics(orders?: Order[]): Promise<OrderStatistics> {
    try {
      if (!orders || !Array.isArray(orders)) {
        console.warn('[OrderAnalyticsService] Invalid or undefined orders array')
        return { totalOrders: 0, statusCounts: {} }
      }

      const totalOrders = orders.length

      const statusCounts = orders.reduce<Record<string, number>>((counts, order) => {
        const status = order.status || 'unknown'
        counts[status] = (counts[status] || 0) + 1
        return counts
      }, {})

      return { totalOrders, statusCounts }
    } catch (err: any) {
      console.error('[OrderAnalyticsService] Error in getOrderStatistics:', err.message)
      return { totalOrders: 0, statusCounts: {} }
    }
  }
}
