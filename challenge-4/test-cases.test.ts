// CHALLENGE 4: Test cases for protected route
// This file should contain your test cases

// TODO: Create test cases here
// You should test:
// 1. Authenticated user scenario
// 2. Unauthenticated user scenario
// 3. Database error scenario
// 4. Invalid token scenario
// 5. Edge cases

// Example test cases (you need to complete these):
/*
import { NextRequest } from 'next/server'

describe('Protected Route', () => {
  test('should return 200 for authenticated user', async () => {
    // Test authenticated user scenario
    const request = new NextRequest('http://localhost:3000/api/protected-route', {
      headers: {
        'Authorization': 'Bearer valid-token'
      }
    })
    
    const response = await GET(request)
    expect(response.status).toBe(200)
  })

  test('should return 401 for unauthenticated user', async () => {
    // Test unauthenticated user scenario
    const request = new NextRequest('http://localhost:3000/api/protected-route')
    
    const response = await GET(request)
    expect(response.status).toBe(401)
  })

  test('should return 500 for database errors', async () => {
    // Test database error scenario
  })

  test('should return 401 for invalid token', async () => {
    // Test invalid token scenario
  })
})
*/


import { GET } from './protected-route'
import { NextRequest } from 'next/server'

// Control mock behavior
let mockMode: 'authUser' | 'unauthenticated' | 'invalidToken' | 'dbError' = 'authUser'

// Inline mock for Supabase
jest.mock('@/lib/supabase/server', () => {
  return {
    createSupabaseServerClient: jest.fn(() => {
      return {
        auth: {
          getUser: jest.fn(async () => {
            if (mockMode === 'authUser') {
              return { data: { user: { id: '123' } }, error: null }
            }
            if (mockMode === 'unauthenticated') {
              return { data: { user: null }, error: null }
            }
            if (mockMode === 'invalidToken') {
              return { data: { user: null }, error: { message: 'Invalid token' } }
            }
            return { data: { user: null }, error: null }
          }),
        },
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => {
              if (mockMode === 'dbError') {
                return { data: null, error: { message: 'Database error' } }
              }
              return { data: [{ id: '1', user_id: '123' }], error: null }
            }),
          })),
        })),
      }
    }),
  }
})

describe('Protected Route', () => {
  const mockReq = {} as NextRequest

  test('returns 200 with data for authenticated user', async () => {
    mockMode = 'authUser'
    const res = await GET(mockReq)
    const json = await res.json()
    console.log('Authenticated Response:', res.status, json)
    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data).toEqual([{ id: '1', user_id: '123' }])
  })

  test('returns 401 for unauthenticated user', async () => {
    mockMode = 'unauthenticated'
    const res = await GET(mockReq)
    const json = await res.json()
    console.log('Unuthenticated Response:', res.status, json)
    expect(res.status).toBe(401)
    expect(json.error).toBe('Unauthorized')
  })

  test('returns 401 for invalid token', async () => {
    mockMode = 'invalidToken'
    const res = await GET(mockReq)
    const json = await res.json()
    console.log('Invalid token:', res.status, json)
    expect(res.status).toBe(401)
    expect(json.error).toBe('Invalid token')
  })

test('returns 500 for database error', async () => {
  mockMode = 'dbError'

  // Override just for this case: make sure auth passes
  const { createSupabaseServerClient } = require('@/lib/supabase/server')
  ;(createSupabaseServerClient as jest.Mock).mockReturnValueOnce({
    auth: {
      getUser: jest.fn(async () => ({
        data: { user: { id: '123' } },
        error: null,
      })),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({ data: null, error: { message: 'Database error' } })),
      })),
    })),
  })

  const res = await GET({} as NextRequest)
  const json = await res.json()
  console.log('Db error:', res.status, json)
  expect(res.status).toBe(500)
  expect(json.error).toBe('Database error')
})

})
