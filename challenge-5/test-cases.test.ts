// CHALLENGE 5: Test cases for OrderAnalyticsService
// This file should contain your test cases

// TODO: Create test cases here
// You should test:
// 1. Valid data scenario
// 2. Empty array scenario
// 3. Undefined data scenario
// 4. Missing items scenario
// 5. Edge cases

// Example test cases (you need to complete these):
/*
import { OrderAnalyticsService } from './order-analytics-service'

describe('OrderAnalyticsService', () => {
  let service: OrderAnalyticsService

  beforeEach(() => {
    service = new OrderAnalyticsService()
  })

  test('should calculate totals for valid data', async () => {
    const orders = [
      {
        id: '1',
        items: [
          { id: '1', price: 100, quantity: 2 },
          { id: '2', price: 50, quantity: 1 }
        ]
      }
    ]
    
    const totals = await service.calculateOrderTotals(orders)
    
    expect(totals.totalRevenue).toBe(250)
    expect(totals.averageOrderValue).toBe(250)
    expect(totals.totalItems).toBe(3)
  })

  test('should handle empty array', async () => {
    const totals = await service.calculateOrderTotals([])
    
    expect(totals.totalRevenue).toBe(0)
    expect(totals.averageOrderValue).toBe(0)
    expect(totals.totalItems).toBe(0)
  })

  test('should handle undefined data', async () => {
    // Test undefined data scenario
  })

  test('should handle missing items', async () => {
    // Test missing items scenario
  })
})
*/

import { OrderAnalyticsService } from './order-analytics-service'
import { Order } from './types'

const service = new OrderAnalyticsService()

const mockOrders: Order[] = [
  {
    id: '1',
    status: 'completed',
    items: [
      { id: 'i1', name: 'Item A', price: 100, quantity: 2 },
      { id: 'i2', name: 'Item B', price: 50, quantity: 1 },
    ],
  },
  {
    id: '2',
    status: 'pending',
    items: [{ id: 'i3', name: 'Item C', price: 200, quantity: 1 }],
  },
  {
    id: '3',
    status: 'completed',
    items: [],
  },
]

describe('OrderAnalyticsService', () => {
  test('calculates totals correctly', async () => {
    const totals = await service.calculateOrderTotals(mockOrders)
    console.log('Order Totals:', totals)

    expect(totals).toEqual({
      totalRevenue: 450,
      averageOrderValue: 150,
      totalItems: 3,
    })
  })

  test('calculates statistics correctly', async () => {
    const stats = await service.getOrderStatistics(mockOrders)
    console.log('Order Statistics:', stats)

    expect(stats).toEqual({
      totalOrders: 3,
      statusCounts: { completed: 2, pending: 1 },
    })
  })

  test('handles empty orders (totals)', async () => {
    const totals = await service.calculateOrderTotals([])
    console.log('Empty Orders Totals:', totals)

    expect(totals).toEqual({
      totalRevenue: 0,
      averageOrderValue: 0,
      totalItems: 0,
    })
  })

  test('handles empty orders (statistics)', async () => {
    const stats = await service.getOrderStatistics([])
    console.log('Empty Orders Statistics:', stats)

    expect(stats).toEqual({
      totalOrders: 0,
      statusCounts: {},
    })
  })
})

