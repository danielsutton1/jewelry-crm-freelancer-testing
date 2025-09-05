// CHALLENGE 2: Test cases for communications API
// This file should contain your test cases

// TODO: Create test cases here
// You should test:
// 1. Valid API request
// 2. Database connection error
// 3. Empty result set
// 4. Invalid query parameters
// 5. Edge cases

// Example test cases (you need to complete these):
/*
import { NextRequest } from 'next/server'

describe('Communications API', () => {
  test('should return communications with user names', async () => {
    // Test valid request
    const request = new NextRequest('http://localhost:3000/api/communications')
    const response = await GET(request)
    
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
  })

  test('should handle database errors gracefully', async () => {
    // Test database error scenario
  })

  test('should return empty array when no communications exist', async () => {
    // Test empty result scenario
  })
})
*/


import { GET } from './api-route'
import { NextRequest } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

jest.mock('@/lib/supabase/server', () => ({
  createSupabaseServerClient: jest.fn(),
}))

describe('Communications API', () => {
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    order: jest.fn(),
  }

  beforeEach(() => {
    (createSupabaseServerClient as jest.Mock).mockResolvedValue(mockSupabase)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return communications with user names', async () => {
    const mockData = [
      {
        id: 1,
        message: 'Hello',
        created_at: '2025-01-01T00:00:00Z',
        sender: [{ name: 'Alice' }],       // <- array to mimic Supabase
        recipient: [{ name: 'Bob' }],      // <- array to mimic Supabase
      },
    ]

    mockSupabase.order.mockResolvedValue({ data: mockData, error: null })

    const request = new NextRequest('http://localhost:3000/api/communications')
    const response = await GET(request)
    expect(response.status).toBe(200)

    const json = await response.json()
    expect(json.success).toBe(true)
    expect(Array.isArray(json.data)).toBe(true)

    const expectedData = mockData.map((item) => ({
      ...item,
      sender: item.sender[0],
      recipient: item.recipient[0],
    }))

    expect(json.data).toEqual(expectedData)
  })

  test('should handle database errors gracefully', async () => {
    mockSupabase.order.mockResolvedValue({ data: null, error: new Error('DB Error') })

    const request = new NextRequest('http://localhost:3000/api/communications')
    const response = await GET(request)
    expect(response.status).toBe(500)

    const json = await response.json()
    expect(json.error).toBe('DB Error')
  })

  test('should return empty array when no communications exist', async () => {
    mockSupabase.order.mockResolvedValue({ data: [], error: null })

    const request = new NextRequest('http://localhost:3000/api/communications')
    const response = await GET(request)
    expect(response.status).toBe(200)

    const json = await response.json()
    expect(json.success).toBe(true)
    expect(json.data).toEqual([])
  })

  test('should handle unexpected data format', async () => {
    mockSupabase.order.mockResolvedValue({ data: null, error: null })

    const request = new NextRequest('http://localhost:3000/api/communications')
    const response = await GET(request)
    expect(response.status).toBe(200)

    const json = await response.json()
    expect(json.success).toBe(true)
    expect(json.data).toEqual([])
  })

  test('should return 400 for invalid query parameter', async () => {
    const request = new NextRequest('http://localhost:3000/api/communications?limit=abc')
    const response = await GET(request)

    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json.error).toBe('Invalid limit parameter')
  })

})
