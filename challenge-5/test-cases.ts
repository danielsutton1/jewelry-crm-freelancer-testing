// CHALLENGE 5: Test cases for OrderAnalyticsService
// This file contains comprehensive test cases for data transformation scenarios

import { describe, it, expect, beforeEach } from '@jest/globals'
import { OrderAnalyticsService } from './order-analytics-service'
import { 
  Order, 
  OrderItem, 
  AnalyticsErrorCode
} from './types'

describe('OrderAnalyticsService', () => {
  let service: OrderAnalyticsService

  beforeEach(() => {
    service = new OrderAnalyticsService()
  })

  // Helper function to create valid order item
  const createValidOrderItem = (id: string, price: number, quantity: number): OrderItem => ({
    id,
    product_id: 'product-1',
    quantity,
    price,
    created_at: '2024-01-01T00:00:00Z'
  })

  // Helper function to create valid order
  const createValidOrder = (id: string, items: OrderItem[]): Order => ({
    id,
    customer_id: 'customer-1',
    total_amount: 100.00,
    status: 'pending',
    items,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  })

  // Test 1: Valid data - should return correct calculations
  it('should calculate order totals correctly for valid data', async () => {
    const items1 = [
      createValidOrderItem('item-1', 50.00, 2),
      createValidOrderItem('item-2', 25.00, 1)
    ]
    const items2 = [
      createValidOrderItem('item-3', 100.00, 1)
    ]

    const orders = [
      createValidOrder('order-1', items1),
      createValidOrder('order-2', items2)
    ]

    const result = await service.calculateOrderTotals(orders)
    
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.totalRevenue).toBe(225.00) // (50*2 + 25*1) + (100*1)
      expect(result.data.averageOrderValue).toBe(112.50) // 225 / 2
      expect(result.data.totalItems).toBe(4) // 2 + 1 + 1
    }
  })

  // Test 2: Empty array - should return zero values, no crash
  it('should handle empty array gracefully', async () => {
    const result = await service.calculateOrderTotals([])
    
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.totalRevenue).toBe(0)
      expect(result.data.averageOrderValue).toBe(0)
      expect(result.data.totalItems).toBe(0)
    }
  })

  // Test 3: Undefined data - should return error, no crash
  it('should handle undefined data gracefully', async () => {
    const result = await service.calculateOrderTotals(undefined)
    
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('Orders data is required')
      expect(result.code).toBe(AnalyticsErrorCode.INVALID_INPUT)
    }
  })

  // Test 4: Null data - should return error, no crash
  it('should handle null data gracefully', async () => {
    const result = await service.calculateOrderTotals(null)
    
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('Orders data is required')
      expect(result.code).toBe(AnalyticsErrorCode.INVALID_INPUT)
    }
  })

  // Test 5: Invalid input type - should return error
  it('should handle invalid input type gracefully', async () => {
    const result = await service.calculateOrderTotals('invalid' as unknown as Order[])
    
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('Orders must be an array')
      expect(result.code).toBe(AnalyticsErrorCode.INVALID_INPUT)
    }
  })

  // Test 6: Missing items - should handle gracefully
  it('should handle orders with missing items gracefully', async () => {
    const orderWithoutItems = createValidOrder('order-1', [])
    orderWithoutItems.items = undefined as unknown as OrderItem[]

    const result = await service.calculateOrderTotals([orderWithoutItems])
    
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.totalRevenue).toBe(0)
      expect(result.data.averageOrderValue).toBe(0)
      expect(result.data.totalItems).toBe(0)
    }
  })

  // Test 7: Invalid order data - should filter out invalid orders
  it('should filter out invalid order data', async () => {
    const validOrder = createValidOrder('order-1', [
      createValidOrderItem('item-1', 50.00, 1)
    ])
    
    const invalidOrder = createValidOrder('order-2', [])
    invalidOrder.total_amount = 'invalid' as unknown as number

    const result = await service.calculateOrderTotals([validOrder, invalidOrder])
    
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.totalRevenue).toBe(50.00)
      expect(result.data.averageOrderValue).toBe(50.00) // Only 1 valid order
      expect(result.data.totalItems).toBe(1)
    }
  })

  // Test 8: Order statistics with valid data
  it('should calculate order statistics correctly for valid data', async () => {
    const orders = [
      createValidOrder('order-1', []),
      createValidOrder('order-2', []),
      createValidOrder('order-3', [])
    ]
    
    // Set different statuses
    orders[0].status = 'pending'
    orders[1].status = 'completed'
    orders[2].status = 'pending'

    const result = await service.getOrderStatistics(orders)
    
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.totalOrders).toBe(3)
      expect(result.data.statusCounts.pending).toBe(2)
      expect(result.data.statusCounts.completed).toBe(1)
    }
  })

  // Test 9: Order statistics with empty array
  it('should handle empty array for statistics', async () => {
    const result = await service.getOrderStatistics([])
    
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.totalOrders).toBe(0)
      expect(result.data.statusCounts).toEqual({})
    }
  })

  // Test 10: Order statistics with undefined data
  it('should handle undefined data for statistics', async () => {
    const result = await service.getOrderStatistics(undefined)
    
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('Orders data is required')
      expect(result.code).toBe(AnalyticsErrorCode.INVALID_INPUT)
    }
  })

  // Test 11: TypeScript types validation
  it('should have correct TypeScript types', () => {
    const order = createValidOrder('order-1', [
      createValidOrderItem('item-1', 50.00, 2)
    ])
    
    expect(order.id).toBe('order-1')
    expect(order.items).toHaveLength(1)
    expect(order.items[0].price).toBe(50.00)
    expect(order.items[0].quantity).toBe(2)

    const orderItem = createValidOrderItem('item-1', 25.00, 3)
    expect(orderItem.product_id).toBe('product-1')
    expect(orderItem.price).toBe(25.00)
    expect(orderItem.quantity).toBe(3)
  })

  // Test 12: Edge case - zero quantity items
  it('should handle zero quantity items correctly', async () => {
    const items = [
      createValidOrderItem('item-1', 50.00, 0), // Zero quantity
      createValidOrderItem('item-2', 25.00, 1)
    ]

    const orders = [createValidOrder('order-1', items)]
    const result = await service.calculateOrderTotals(orders)
    
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.totalRevenue).toBe(25.00) // Only valid item
      expect(result.data.totalItems).toBe(1) // Only valid item
    }
  })

  // Test 13: Edge case - negative prices
  it('should handle negative prices correctly', async () => {
    const items = [
      createValidOrderItem('item-1', -10.00, 1), // Negative price
      createValidOrderItem('item-2', 25.00, 1)
    ]

    const orders = [createValidOrder('order-1', items)]
    const result = await service.calculateOrderTotals(orders)
    
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.totalRevenue).toBe(25.00) // Only valid item
      expect(result.data.totalItems).toBe(1) // Only valid item
    }
  })
})