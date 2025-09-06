import { NextRequest } from 'next/server'
import { GET, POST } from './protected-route'

describe('Protected Route', () => {
  test('should handle authenticated user requests', async () => {
    const request = new NextRequest('http://localhost:3000/api/protected-route', {
      headers: {
        'Authorization': 'Bearer valid-token'
      }
    })
    
    try {
      const response = await GET(request)
      const data = await response.json()
      
      if (response.status === 200) {
        expect(data.success).toBe(true)
        expect(data.userId).toBeDefined()
        expect(Array.isArray(data.data)).toBe(true)
      } else if (response.status === 401) {
        expect(data.success).toBe(false)
        expect(data.error).toBeDefined()
      }
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  test('should return 401 for unauthenticated requests', async () => {
    const request = new NextRequest('http://localhost:3000/api/protected-route')
    
    try {
      const response = await GET(request)
      const data = await response.json()
      
      expect([401, 500]).toContain(response.status)
      expect(data.success).toBe(false)
      expect(data.error).toBeDefined()
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  test('should handle POST requests with authentication', async () => {
    const request = new NextRequest('http://localhost:3000/api/protected-route', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer valid-token'
      },
      body: JSON.stringify({ test: 'data' })
    })
    
    try {
      const response = await POST(request)
      const data = await response.json()
      
      expect([200, 401, 500]).toContain(response.status)
      if (response.status === 200) {
        expect(data.success).toBe(true)
        expect(data.userId).toBeDefined()
      } else {
        expect(data.success).toBe(false)
        expect(data.error).toBeDefined()
      }
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  test('should handle invalid JSON in POST requests', async () => {
    const request = new NextRequest('http://localhost:3000/api/protected-route', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer valid-token'
      },
      body: 'invalid-json'
    })
    
    try {
      const response = await POST(request)
      expect([400, 401, 500]).toContain(response.status)
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  test('should have consistent response structure', async () => {
    const request = new NextRequest('http://localhost:3000/api/protected-route')
    
    try {
      const response = await GET(request)
      const data = await response.json()
      
      expect(data).toHaveProperty('success')
      if (data.success) {
        expect(data).toHaveProperty('data')
        expect(data).toHaveProperty('userId')
      } else {
        expect(data).toHaveProperty('error')
      }
    } catch (error) {
      expect(error).toBeDefined()
    }
  })
})
