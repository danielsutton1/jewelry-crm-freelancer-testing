// CHALLENGE 3: Test cases for OrdersService
// This file should contain your test cases

// TODO: Create test cases here
// You should test:
// 1. Valid data scenario
// 2. Database error scenario
// 3. Empty result scenario
// 4. Invalid ID scenario
// 5. Edge cases

// Example test cases (you need to complete these):
/*
import { OrdersService } from './orders-service'

describe('OrdersService', () => {
  let ordersService: OrdersService

  beforeEach(() => {
    ordersService = new OrdersService()
  })

  test('should return array of orders, never undefined', async () => {
    const orders = await ordersService.getOrders()
    
    expect(Array.isArray(orders)).toBe(true)
    expect(orders).not.toBeUndefined()
  })

  test('should handle database errors gracefully', async () => {
    // Test database error scenario
  })

  test('should return empty array when no orders exist', async () => {
    // Test empty result scenario
  })

  test('should return null for invalid order ID', async () => {
    const order = await ordersService.getOrderById('invalid-id')
    expect(order).toBeNull()
  })
})
*/


// File: challenge-3/orders-service.test.ts
import { OrdersService } from './orders-service'

// Local variable to control mock behavior
let mockMode: 'success' | 'empty' | 'error' = 'success'

// Inline mock of supabase server
jest.mock('../lib/supabase/server', () => {
  return {
    createSupabaseServerClient: jest.fn(() => {
      return {
        from: jest.fn(() => ({
          select: jest.fn().mockImplementation(() => {
            if (mockMode === 'success') {
              return {
                data: [{ id: '1', name: 'mocked order' }],
                error: null,
                eq: jest.fn(() => ({
                  single: jest.fn(async () => ({
                    data: { id: '1', name: 'mocked order' },
                    error: null,
                  })),
                })),
              }
            }
            if (mockMode === 'empty') {
              return {
                data: [],
                error: null,
                eq: jest.fn(() => ({
                  single: jest.fn(async () => ({
                    data: null,
                    error: { code: 'PGRST116', message: 'No rows found' },
                  })),
                })),
              }
            }
            if (mockMode === 'error') {
              return {
                data: null,
                error: { message: 'Database error' },
                eq: jest.fn(() => ({
                  single: jest.fn(async () => ({
                    data: null,
                    error: { message: 'Database error' },
                  })),
                })),
              }
            }
            return { data: [], error: null }
          }),
        })),
      }
    }),
  }
})

// Helper function to set mock mode
const setMockMode = (mode: 'success' | 'empty' | 'error') => {
  mockMode = mode
}

describe('OrdersService with mockMode', () => {
  let service: OrdersService

  beforeEach(() => {
    service = new OrdersService()
  })

  test('returns orders in success mode', async () => {
    setMockMode('success')

    const result = await service.getOrders()
    console.log('Orders:', result)
    expect(result).toEqual([{ id: '1', name: 'mocked order' }])
  })

  test('returns empty array in empty mode', async () => {
    setMockMode('empty')

    const result = await service.getOrders()
    console.log('Empty array:', result)
    expect(result).toEqual([])
  })

  test('throws error in error mode', async () => {
    setMockMode('error')

    await expect(service.getOrders()).rejects.toThrow('Failed to fetch orders')
  })

  test('returns null for invalid ID', async () => {
    setMockMode('empty')

    const result = await service.getOrderById('999')
    console.log('Invalid ID output:', result)
    expect(result).toBeNull()
  })
})
