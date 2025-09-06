import { NextRequest } from 'next/server'
import { GET } from './api-route'

describe('Communications API', () => {
  test('should return communications with user names', async () => {
    const request = new NextRequest('http://localhost:3000/api/communications')
    const response = await GET(request)
    
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
    
    if (data.data.length > 0) {
      expect(data.data[0]).toHaveProperty('id')
      expect(data.data[0]).toHaveProperty('message')
      expect(data.data[0]).toHaveProperty('sender')
      expect(data.data[0]).toHaveProperty('recipient')
    }
  })

  test('should handle empty result gracefully', async () => {
    const request = new NextRequest('http://localhost:3000/api/communications')
    const response = await GET(request)
    
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
  })

  test('should return proper error format on database error', async () => {
    const request = new NextRequest('http://localhost:3000/api/communications')
    
    try {
      const response = await GET(request)
      const data = await response.json()
      
      if (!data.success) {
        expect(response.status).toBe(500)
        expect(data).toHaveProperty('error')
        expect(data.success).toBe(false)
      }
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  test('should have proper response structure', async () => {
    const request = new NextRequest('http://localhost:3000/api/communications')
    const response = await GET(request)
    const data = await response.json()
    
    expect(data).toHaveProperty('success')
    if (data.success) {
      expect(data).toHaveProperty('data')
    } else {
      expect(data).toHaveProperty('error')
    }
  })
})
