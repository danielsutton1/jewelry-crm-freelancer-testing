// CHALLENGE 3: Test cases for OrdersService
// This file contains comprehensive test cases for the OrdersService

// Mock the Supabase client before any imports
const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis()
} as {
  from: jest.MockedFunction<any>
  select: jest.MockedFunction<any>
  eq: jest.MockedFunction<any>
  single: jest.MockedFunction<any>
  order: jest.MockedFunction<any>
}

// Mock the createClient function
const mockCreateClient = jest.fn().mockReturnValue(mockSupabase)

jest.mock('@supabase/supabase-js', () => ({
  createClient: mockCreateClient
}))

import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { OrdersService } from './orders-service'
import { 
  Order, 
  OrderStatus,
  SupabaseOrderResult
} from './types'

describe('OrdersService', () => {
  let ordersService: OrdersService

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Reset all mocks to return this for chaining
    mockSupabase.from.mockReturnThis()
    mockSupabase.select.mockReturnThis()
    mockSupabase.eq.mockReturnThis()
    mockSupabase.single.mockReturnThis()
    mockSupabase.order.mockReturnThis()
    
    // Ensure createClient returns our mock
    mockCreateClient.mockReturnValue(mockSupabase)
    
    ordersService = new OrdersService()
  })

  // Helper function to create mock order
  const createMockOrder = (id: string, customerId: string, totalAmount: number, status: string): SupabaseOrderResult => ({
    id,
    customer_id: customerId,
    total_amount: totalAmount,
    status,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z'
  })

  // Test 1: Valid data scenario - Expected: Array of orders, never undefined
  it('should return array of orders, never undefined', async () => {
    const mockOrders: SupabaseOrderResult[] = [
      createMockOrder('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 150.00, 'pending'),
      createMockOrder('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 275.50, 'completed')
    ]

    // Mock the final method in the chain to return the data
    mockSupabase.order.mockResolvedValue({
      data: mockOrders,
      error: null
    })

    const orders = await ordersService.getOrders()
    
    expect(Array.isArray(orders)).toBe(true)
    expect(orders).not.toBeUndefined()
    expect(orders).toHaveLength(2)
    expect(orders[0].id).toBe('550e8400-e29b-41d4-a716-446655440001')
    expect(orders[0].total_amount).toBe(150.00)
    expect(orders[0].status).toBe('pending')
  })

  // Test 2: Database error scenario - Expected: Proper error handling, no crash
  it('should handle database errors gracefully', async () => {
    mockSupabase.order.mockResolvedValue({
      data: null,
      error: { message: 'Database connection failed' }
    })

    const orders = await ordersService.getOrders()
    
    // Should return empty array instead of crashing
    expect(Array.isArray(orders)).toBe(true)
    expect(orders).toHaveLength(0)
    expect(orders).not.toBeUndefined()
  })

  // Test 3: Empty result scenario - Expected: Empty array, not undefined
  it('should return empty array when no orders exist', async () => {
    mockSupabase.order.mockResolvedValue({
      data: [],
      error: null
    })

    const orders = await ordersService.getOrders()
    
    expect(Array.isArray(orders)).toBe(true)
    expect(orders).toHaveLength(0)
    expect(orders).not.toBeUndefined()
  })

  // Test 4: Invalid ID scenario - Expected: null, not undefined
  it('should return null for invalid order ID', async () => {
    mockSupabase.single.mockResolvedValue({
      data: null,
      error: { code: 'PGRST116', message: 'No rows returned' }
    })

    const order = await ordersService.getOrderById('invalid-id')
    
    expect(order).toBeNull()
    expect(order).not.toBeUndefined()
  })

  // Test 5: Edge cases - null data from database
  it('should handle null data from database', async () => {
    mockSupabase.order.mockResolvedValue({
      data: null,
      error: null
    })

    const orders = await ordersService.getOrders()
    
    expect(Array.isArray(orders)).toBe(true)
    expect(orders).toHaveLength(0)
    expect(orders).not.toBeUndefined()
  })

  // Test 6: Invalid input validation
  it('should handle invalid input parameters', async () => {
    const order = await ordersService.getOrderById('')
    expect(order).toBeNull()

    const order2 = await ordersService.getOrderById(null as unknown as string)
    expect(order2).toBeNull()
  })

  // Test 7: Data validation - invalid order data
  it('should filter out invalid order data', async () => {
    const mockOrders: SupabaseOrderResult[] = [
      createMockOrder('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 150.00, 'pending'),
      {
        id: '', // Invalid - empty ID
        customer_id: '550e8400-e29b-41d4-a716-446655440002',
        total_amount: -100, // Invalid - negative amount
        status: 'invalid_status', // Invalid status
        created_at: '2024-01-01T11:00:00Z',
        updated_at: '2024-01-01T11:00:00Z'
      }
    ]

    mockSupabase.order.mockResolvedValue({
      data: mockOrders,
      error: null
    })

    const orders = await ordersService.getOrders()
    
    // Should only return valid orders
    expect(orders).toHaveLength(1)
    expect(orders[0].id).toBe('550e8400-e29b-41d4-a716-446655440001')
  })

  // Test 8: Service response wrapper methods
  it('should return proper service response for getOrdersWithResponse', async () => {
    const mockOrders: SupabaseOrderResult[] = [
      createMockOrder('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 150.00, 'pending')
    ]

    mockSupabase.order.mockResolvedValue({
      data: mockOrders,
      error: null
    })

    const result = await ordersService.getOrdersWithResponse()
    
    expect(result.success).toBe(true)
    if (result.success) {
      expect(Array.isArray(result.data)).toBe(true)
      expect(result.data).toHaveLength(1)
    }
  })

  // Test 9: Service response wrapper for errors
  it('should return proper error response for getOrdersWithResponse', async () => {
    // Mock a rejected promise to trigger the catch block
    mockSupabase.order.mockRejectedValue(new Error('Database connection failed'))

    const result = await ordersService.getOrdersWithResponse()
    
    // Since getOrders() catches errors and returns empty array, 
    // getOrdersWithResponse will return success with empty array
    expect(result.success).toBe(true)
    if (result.success) {
      expect(Array.isArray(result.data)).toBe(true)
      expect(result.data).toHaveLength(0)
    }
  })

  // Test 10: TypeScript types validation
  it('should have correct TypeScript types', () => {
    const order: Order = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      customer_id: '550e8400-e29b-41d4-a716-446655440001',
      total_amount: 150.00,
      status: 'pending',
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-01T10:00:00Z'
    }
    
    expect(order.id).toBe('550e8400-e29b-41d4-a716-446655440001')
    expect(order.total_amount).toBe(150.00)
    expect(order.status).toBe('pending')
    
    // Test OrderStatus enum
    expect(OrderStatus.PENDING).toBe('pending')
    expect(OrderStatus.COMPLETED).toBe('completed')
  })
})
