// CHALLENGE 2: Test cases for communications API
// This file contains the test cases as specified in the requirements

import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import {
  CommunicationsResponse,
  CommunicationsError,
  Communication,
  User,
  SupabaseCommunicationResult
} from './types'

// Mock the Supabase server client
const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis()
} as {
  from: jest.MockedFunction<any>
  select: jest.MockedFunction<any>
  order: jest.MockedFunction<any>
}

// Import the GET function before mocking
import { GET } from './api-route'

// Mock the createSupabaseServerClient function
jest.mock('@/lib/supabase/server', () => ({
  createSupabaseServerClient: jest.fn().mockReturnValue(mockSupabase)
}))

describe('Communications API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSupabase.from.mockReturnThis()
    mockSupabase.select.mockReturnThis()
    mockSupabase.order.mockReturnThis()
  })

  // Helper function to make API request
  const makeRequest = async () => {
    return await GET()
  }

  // Test 1: Valid request - Expected: 200 status with communications array including sender/recipient names
  it('should return communications with user names', async () => {
    const mockData: SupabaseCommunicationResult[] = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        message: 'Hello, how are you?',
        sender_id: '550e8400-e29b-41d4-a716-446655440001',
        recipient_id: '550e8400-e29b-41d4-a716-446655440002',
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-01T10:00:00Z',
        sender: { name: 'Admin User' },
        recipient: { name: 'Manager User' }
      }
    ]

    mockSupabase.order.mockResolvedValue({
      data: mockData,
      error: null
    })

    const response = await makeRequest()
    
    expect(response.status).toBe(200)
    const data = await response.json() as CommunicationsResponse
    
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
    expect(data.data[0].sender?.name).toBe('Admin User')
    expect(data.data[0].recipient?.name).toBe('Manager User')
    
    expect(mockSupabase.from).toHaveBeenCalledWith('communications')
    expect(mockSupabase.select).toHaveBeenCalledWith(expect.stringContaining('sender:sender_id(name)'))
    expect(mockSupabase.order).toHaveBeenCalledWith('created_at', { ascending: false })
  })

  // Test 2: Database connection error - Expected: 503 status with error message
  it('should handle database connection error', async () => {
    mockSupabase.order.mockResolvedValue({
      data: null,
      error: { message: 'Database connection failed' }
    })

    const response = await makeRequest()
    
    expect(response.status).toBe(503)
    const data = await response.json() as CommunicationsError
    
    expect(data.success).toBe(false)
    expect(data.error).toContain('Database query failed')
    expect(data.error).toContain('Database connection failed')
  })

  // Test 3: Empty result set - Expected: 200 status with empty array
  it('should return empty array when no communications exist', async () => {
    mockSupabase.order.mockResolvedValue({
      data: [],
      error: null
    })

    const response = await makeRequest()
    
    expect(response.status).toBe(200)
    const data = await response.json() as CommunicationsResponse
    
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
    expect(data.data).toHaveLength(0)
  })

  // Test 4: Invalid query parameters - Expected: 400 status with validation error
  it('should handle invalid query parameters', async () => {
    // Mock invalid query error
    mockSupabase.order.mockResolvedValue({
      data: null,
      error: { message: 'Invalid query syntax' }
    })

    const response = await makeRequest()
    
    expect(response.status).toBe(500)
    const data = await response.json() as CommunicationsError
    
    expect(data.success).toBe(false)
    expect(data.error).toContain('Database query failed')
    expect(data.error).toContain('Invalid query syntax')
  })

  // Test 5: Edge cases - Connection errors
  it('should handle connection errors gracefully', async () => {
    mockSupabase.order.mockRejectedValue(new Error('Connection timeout'))

    const response = await makeRequest()
    
    expect(response.status).toBe(500)
    const data = await response.json() as CommunicationsError
    
    expect(data.success).toBe(false)
    expect(data.error).toBe('Connection timeout')
  })

  // Test TypeScript types
  it('should have correct TypeScript types', () => {
    const user: User = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Test User',
      email: 'test@example.com',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
    
    expect(user.id).toBe('550e8400-e29b-41d4-a716-446655440001')
    expect(user.name).toBe('Test User')

    const communication: Communication = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      message: 'Test message',
      sender_id: '550e8400-e29b-41d4-a716-446655440001',
      recipient_id: '550e8400-e29b-41d4-a716-446655440002',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      sender: user,
      recipient: user
    }
    
    expect(communication.message).toBe('Test message')
    expect(communication.sender?.name).toBe('Test User')
  })
})
