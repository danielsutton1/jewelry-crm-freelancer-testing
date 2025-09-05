// CHALLENGE 4: Test cases for protected route
// This file contains comprehensive test cases for authentication scenarios

// Mock the createSupabaseServerClient function before any imports
const mockSupabase = {
  auth: {
    getUser: jest.fn()
  },
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis()
} as {
  auth: {
    getUser: jest.MockedFunction<any>
  }
  from: jest.MockedFunction<any>
  select: jest.MockedFunction<any>
  eq: jest.MockedFunction<any>
}

const mockCreateSupabaseServerClient = jest.fn().mockReturnValue(mockSupabase)

jest.mock('@/lib/supabase/server', () => ({
  createSupabaseServerClient: mockCreateSupabaseServerClient
}))

import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { NextRequest } from 'next/server'
import { GET } from './protected-route'
import { 
  ProtectedRouteSuccessResponse, 
  ProtectedRouteErrorResponse,
  User,
  UserData,
  HttpStatus
} from './types'

describe('Protected Route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Reset all mocks to return this for chaining
    mockSupabase.from.mockReturnThis()
    mockSupabase.select.mockReturnThis()
    mockSupabase.eq.mockReturnThis()
    
    // Ensure createSupabaseServerClient returns our mock
    mockCreateSupabaseServerClient.mockReturnValue(mockSupabase)
  })

  // Helper function to make API request
  const makeRequest = async (headers: Record<string, string> = {}) => {
    const request = new NextRequest('http://localhost:3000/api/protected-route', {
      headers
    })
    return await GET(request)
  }

  // Helper function to make authenticated request
  const makeAuthenticatedRequest = async () => {
    return await makeRequest({
      'Authorization': 'Bearer valid-token'
    })
  }

  // Test 1: Authenticated user scenario - Expected: 200 status with user data
  it('should return 200 for authenticated user', async () => {
    const mockUser: User = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'admin@example.com',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: {},
      user_metadata: {},
      identities: []
    }

    const mockUserData: UserData[] = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        data: { preferences: { theme: 'dark' } },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ]

    // Mock authenticated user
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null
    })

    // Mock database query
    mockSupabase.eq.mockResolvedValue({
      data: mockUserData,
      error: null
    })

    const response = await makeAuthenticatedRequest()
    
    expect(response.status).toBe(HttpStatus.OK)
    const data = await response.json() as ProtectedRouteSuccessResponse
    
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
    expect(data.data).toHaveLength(1)
    expect(data.data[0].user_id).toBe('550e8400-e29b-41d4-a716-446655440001')
  })

  // Test 2: Unauthenticated user scenario - Expected: 401 status with error message
  it('should return 401 for unauthenticated user', async () => {
    // Mock unauthenticated user
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null
    })

    const response = await makeRequest()
    
    expect(response.status).toBe(HttpStatus.UNAUTHORIZED)
    const data = await response.json() as ProtectedRouteErrorResponse
    
    expect(data.success).toBe(false)
    expect(data.error).toBe('Unauthorized - User not authenticated')
    expect(data.status).toBe(HttpStatus.UNAUTHORIZED)
  })

  // Test 3: Authentication error scenario - Expected: 401 status with error message
  it('should return 401 for authentication error', async () => {
    // Mock authentication error
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid token' }
    })

    const response = await makeRequest({
      'Authorization': 'Bearer invalid-token'
    })
    
    expect(response.status).toBe(HttpStatus.UNAUTHORIZED)
    const data = await response.json() as ProtectedRouteErrorResponse
    
    expect(data.success).toBe(false)
    expect(data.error).toBe('Authentication failed')
    expect(data.status).toBe(HttpStatus.UNAUTHORIZED)
  })

  // Test 4: Database error scenario - Expected: 500 status with error message
  it('should return 500 for database errors', async () => {
    const mockUser: User = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'admin@example.com',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: {},
      user_metadata: {},
      identities: []
    }

    // Mock authenticated user
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null
    })

    // Mock database error
    mockSupabase.eq.mockResolvedValue({
      data: null,
      error: { message: 'Database connection failed' }
    })

    const response = await makeAuthenticatedRequest()
    
    expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
    const data = await response.json() as ProtectedRouteErrorResponse
    
    expect(data.success).toBe(false)
    expect(data.error).toContain('Database error')
    expect(data.error).toContain('Database connection failed')
    expect(data.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
  })

  // Test 5: Edge case - Empty user data
  it('should return 200 with empty array when no user data exists', async () => {
    const mockUser: User = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'admin@example.com',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: {},
      user_metadata: {},
      identities: []
    }

    // Mock authenticated user
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null
    })

    // Mock empty database result
    mockSupabase.eq.mockResolvedValue({
      data: [],
      error: null
    })

    const response = await makeAuthenticatedRequest()
    
    expect(response.status).toBe(HttpStatus.OK)
    const data = await response.json() as ProtectedRouteSuccessResponse
    
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
    expect(data.data).toHaveLength(0)
  })

  // Test 6: TypeScript types validation
  it('should have correct TypeScript types', () => {
    const user: User = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'admin@example.com',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: {},
      user_metadata: {},
      identities: []
    }
    
    expect(user.id).toBe('550e8400-e29b-41d4-a716-446655440001')
    expect(user.email).toBe('admin@example.com')

    const userData: UserData = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      user_id: '550e8400-e29b-41d4-a716-446655440001',
      data: { preferences: { theme: 'dark' } },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
    expect(userData.user_id).toBe('550e8400-e29b-41d4-a716-446655440001')
    expect((userData.data as { preferences: { theme: string } }).preferences.theme).toBe('dark')
  })
})
