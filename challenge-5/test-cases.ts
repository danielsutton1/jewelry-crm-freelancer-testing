import { OrderAnalyticsService } from './order-analytics-service'
import { AnalyticsError, Order } from './types'

describe('OrderAnalyticsService', () => {
  let service: OrderAnalyticsService

  beforeEach(() => {
    service = new OrderAnalyticsService()
  })

  test('should calculate totals for valid data', async () => {
    const orders: Order[] = [
      {
        id: '1',
        customer_id: 'customer1',
        total_amount: 250,
        status: 'completed',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        items: [
          { id: '1', product_id: 'prod1', price: 100, quantity: 2 },
          { id: '2', product_id: 'prod2', price: 50, quantity: 1 }
        ]
      }
    ]
    
    const totals = await service.calculateOrderTotals(orders)
    
    expect(totals.totalRevenue).toBe(250)
    expect(totals.averageOrderValue).toBe(250)
    expect(totals.totalItems).toBe(2)
    expect(totals.orderCount).toBe(1)
  })

  test('should handle empty array', async () => {
    const totals = await service.calculateOrderTotals([])
    
    expect(totals.totalRevenue).toBe(0)
    expect(totals.averageOrderValue).toBe(0)
    expect(totals.totalItems).toBe(0)
    expect(totals.orderCount).toBe(0)
  })

  test('should throw error for undefined data', async () => {
    await expect(service.calculateOrderTotals(undefined)).rejects.toThrow(AnalyticsError)
    await expect(service.calculateOrderTotals(null)).rejects.toThrow(AnalyticsError)
  })

  test('should handle orders with missing items', async () => {
    const orders: Order[] = [
      {
        id: '1',
        customer_id: 'customer1',
        total_amount: 0,
        status: 'pending',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        items: null as any
      }
    ]
    
    const totals = await service.calculateOrderTotals(orders)
    
    expect(totals.totalRevenue).toBe(0)
    expect(totals.totalItems).toBe(0)
    expect(totals.orderCount).toBe(1)
  })

  test('should calculate statistics correctly', async () => {
    const orders: Order[] = [
      {
        id: '1',
        customer_id: 'customer1',
        total_amount: 100,
        status: 'completed',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        items: [{ id: '1', product_id: 'prod1', price: 100, quantity: 1 }]
      },
      {
        id: '2',
        customer_id: 'customer2',
        total_amount: 200,
        status: 'pending',
        created_at: '2024-01-02',
        updated_at: '2024-01-02',
        items: [{ id: '2', product_id: 'prod2', price: 200, quantity: 1 }]
      }
    ]
    
    const stats = await service.getOrderStatistics(orders)
    
    expect(stats.totalOrders).toBe(2)
    expect(stats.statusCounts['completed']).toBe(1)
    expect(stats.statusCounts['pending']).toBe(1)
    expect(stats.averageItemsPerOrder).toBe(1)
  })

  test('should handle invalid item data gracefully', async () => {
    const orders: Order[] = [
      {
        id: '1',
        customer_id: 'customer1',
        total_amount: 100,
        status: 'completed',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        items: [
          { id: '1', product_id: 'prod1', price: 100, quantity: 1 },
          { id: '2', product_id: 'prod2', price: -50, quantity: 1 },
          null as any
        ]
      }
    ]
    
    const totals = await service.calculateOrderTotals(orders)
    
    expect(totals.totalRevenue).toBe(100)
    expect(totals.totalItems).toBe(1)
  })

  test('should calculate revenue by period', async () => {
    const orders: Order[] = [
      {
        id: '1',
        customer_id: 'customer1',
        total_amount: 100,
        status: 'completed',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        items: [{ id: '1', product_id: 'prod1', price: 100, quantity: 1 }]
      }
    ]
    
    const revenue = await service.getRevenueByPeriod(orders, 'day')
    
    expect(revenue['2024-01-01']).toBe(100)
  })
})
