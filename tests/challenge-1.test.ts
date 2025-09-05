// Test for Challenge 1: Database Function Error
import { describe, it, expect } from '@jest/globals'
import {
  UpdateCustomerCompanyParams,
  UpdateCustomerCompanyResponse,
  UpdateCustomerCompanySuccessResponse,
  UpdateCustomerCompanyErrorResponse,
  CustomerErrorCode,
  Customer,
  AuditLog,
  FunctionCallResult,
  DatabaseFunctionResponse
} from '@/challenge-1/types'

describe('Challenge 1: Database Function Types', () => {
  it('should have proper TypeScript types defined', () => {
    // Test parameter types
    const params: UpdateCustomerCompanyParams = {
      company_name: 'Test Company',
      customer_id: '550e8400-e29b-41d4-a716-446655440001'
    }
    
    expect(params.company_name).toBe('Test Company')
    expect(params.customer_id).toBe('550e8400-e29b-41d4-a716-446655440001')
  })

  it('should handle success response type', () => {
    const successResponse: UpdateCustomerCompanySuccessResponse = {
      success: true,
      message: 'Company updated successfully',
      data: {
        customer_id: '550e8400-e29b-41d4-a716-446655440001',
        old_company: 'Old Company',
        new_company: 'New Company',
        updated_at: '2024-01-01T00:00:00Z'
      },
      timestamp: '2024-01-01T00:00:00Z'
    }
    
    expect(successResponse.success).toBe(true)
    expect(successResponse.data.new_company).toBe('New Company')
  })

  it('should handle error response type', () => {
    const errorResponse: UpdateCustomerCompanyErrorResponse = {
      success: false,
      error: 'Customer not found',
      error_code: CustomerErrorCode.CUSTOMER_NOT_FOUND,
      timestamp: '2024-01-01T00:00:00Z'
    }
    
    expect(errorResponse.success).toBe(false)
    expect(errorResponse.error_code).toBe(CustomerErrorCode.CUSTOMER_NOT_FOUND)
  })

  it('should handle union response type', () => {
    const response: UpdateCustomerCompanyResponse = {
      success: true,
      message: 'Success',
      data: {
        customer_id: '550e8400-e29b-41d4-a716-446655440001',
        old_company: 'Old',
        new_company: 'New',
        updated_at: '2024-01-01T00:00:00Z'
      }
    }
    
    if (response.success) {
      expect(response.data.new_company).toBe('New')
    }
  })

  it('should handle customer entity type', () => {
    const customer: Customer = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'John Doe',
      email: 'john@example.com',
      company: 'Acme Corp',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
    
    expect(customer.name).toBe('John Doe')
    expect(customer.company).toBe('Acme Corp')
  })

  it('should handle audit log type', () => {
    const auditLog: AuditLog = {
      id: 'audit-123',
      table_name: 'customers',
      record_id: '550e8400-e29b-41d4-a716-446655440001',
      action: 'UPDATE_COMPANY',
      old_values: { company: 'Old Company' },
      new_values: { company: 'New Company' },
      user_id: null,
      created_at: '2024-01-01T00:00:00Z'
    }
    
    expect(auditLog.table_name).toBe('customers')
    expect(auditLog.action).toBe('UPDATE_COMPANY')
    expect(auditLog.old_values?.company).toBe('Old Company')
  })

  it('should handle function call result type', () => {
    const result: FunctionCallResult = {
      data: {
        success: true,
        message: 'Success',
        data: {
          customer_id: '550e8400-e29b-41d4-a716-446655440001',
          old_company: 'Old',
          new_company: 'New',
          updated_at: '2024-01-01T00:00:00Z'
        }
      },
      error: null
    }
    
    expect(result.data?.success).toBe(true)
    expect(result.error).toBeNull()
  })

  it('should handle database function response type', () => {
    const dbResponse: DatabaseFunctionResponse = {
      success: true,
      message: 'Company updated successfully',
      data: {
        customer_id: '550e8400-e29b-41d4-a716-446655440001',
        old_company: 'Old Company',
        new_company: 'New Company',
        updated_at: '2024-01-01T00:00:00Z'
      }
    }
    
    expect(dbResponse.success).toBe(true)
    expect(dbResponse.data?.new_company).toBe('New Company')
  })

  it('should validate error codes enum', () => {
    expect(CustomerErrorCode.INVALID_COMPANY_NAME).toBe('INVALID_COMPANY_NAME')
    expect(CustomerErrorCode.INVALID_CUSTOMER_ID).toBe('INVALID_CUSTOMER_ID')
    expect(CustomerErrorCode.CUSTOMER_NOT_FOUND).toBe('CUSTOMER_NOT_FOUND')
    expect(CustomerErrorCode.DATABASE_ERROR).toBe('DATABASE_ERROR')
  })
})
