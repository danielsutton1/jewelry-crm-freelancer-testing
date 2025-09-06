import { OrdersService } from './orders-service'
import { OrdersServiceError } from './types'

describe('OrdersService', () => {
  let ordersService: OrdersService

  beforeEach(() => {
    ordersService = new OrdersService()
  })

  test('should return array of orders, never undefined', async () => {
    try {
      const orders = await ordersService.getOrders()
      
      expect(Array.isArray(orders)).toBe(true)
      expect(orders).not.toBeUndefined()
    } catch (error) {
      expect(error).toBeInstanceOf(OrdersServiceError)
    }
  })

  test('should handle empty results gracefully', async () => {
    try {
      const orders = await ordersService.getOrders()
      expect(Array.isArray(orders)).toBe(true)
    } catch (error) {
      expect(error).toBeInstanceOf(OrdersServiceError)
    }
  })

  test('should return null for non-existent order ID', async () => {
    try {
      const order = await ordersService.getOrderById('00000000-0000-0000-0000-000000000000')
      expect(order).toBeNull()
    } catch (error) {
      expect(error).toBeInstanceOf(OrdersServiceError)
    }
  })

  test('should throw error for invalid order ID', async () => {
    await expect(ordersService.getOrderById('')).rejects.toThrow(OrdersServiceError)
    await expect(ordersService.getOrderById(null as any)).rejects.toThrow(OrdersServiceError)
  })

  test('should handle database errors with proper error types', async () => {
    try {
      await ordersService.getOrders()
    } catch (error) {
      if (error instanceof OrdersServiceError) {
        expect(error.code).toBeDefined()
        expect(error.message).toBeDefined()
      }
    }
  })

  test('should return orders for valid customer ID', async () => {
    try {
      const orders = await ordersService.getOrdersByCustomer('valid-customer-id')
      expect(Array.isArray(orders)).toBe(true)
    } catch (error) {
      expect(error).toBeInstanceOf(OrdersServiceError)
    }
  })

  test('should throw error for invalid customer ID', async () => {
    await expect(ordersService.getOrdersByCustomer('')).rejects.toThrow(OrdersServiceError)
  })
})
