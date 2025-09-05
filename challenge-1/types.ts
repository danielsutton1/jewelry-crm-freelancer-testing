// CHALLENGE 1: TypeScript types for the update_customer_company function
// This file contains comprehensive TypeScript type definitions

// Base response interface
export interface BaseApiResponse {
  success: boolean;
  timestamp?: string;
}

// Function parameter types
export interface UpdateCustomerCompanyParams {
  company_name: string;
  customer_id: string;
}

// Success response data
export interface UpdateCustomerCompanyData {
  customer_id: string;
  old_company: string | null;
  new_company: string;
  updated_at: string;
}

// Success response
export interface UpdateCustomerCompanySuccessResponse extends BaseApiResponse {
  success: true;
  message: string;
  data: UpdateCustomerCompanyData;
}

// Error response
export interface UpdateCustomerCompanyErrorResponse extends BaseApiResponse {
  success: false;
  error: string;
  error_code: CustomerErrorCode;
}

// Union type for all possible responses
export type UpdateCustomerCompanyResponse = 
  | UpdateCustomerCompanySuccessResponse 
  | UpdateCustomerCompanyErrorResponse;

// Error codes enum
export enum CustomerErrorCode {
  INVALID_COMPANY_NAME = 'INVALID_COMPANY_NAME',
  INVALID_CUSTOMER_ID = 'INVALID_CUSTOMER_ID',
  CUSTOMER_NOT_FOUND = 'CUSTOMER_NOT_FOUND',
  DATABASE_ERROR = 'DATABASE_ERROR'
}

// Customer entity type
export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string | null;
  created_at: string;
  updated_at: string;
}

// Specific audit log values for customer company updates
export interface CustomerCompanyAuditValues {
  company: string | null;
}

// Audit log entry type with specific typing
export interface AuditLog {
  id: string;
  table_name: 'customers';
  record_id: string;
  action: 'UPDATE_COMPANY';
  old_values: CustomerCompanyAuditValues | null;
  new_values: CustomerCompanyAuditValues | null;
  user_id: string | null;
  created_at: string;
}

// Supabase error type
export interface SupabaseError {
  message: string;
  code: string;
  details?: string;
  hint?: string;
}

// Function call result type (for Supabase RPC calls)
export interface FunctionCallResult<T = UpdateCustomerCompanyResponse> {
  data: T | null;
  error: SupabaseError | null;
}

// Database function response type (what the SQL function returns)
export interface DatabaseFunctionResponse {
  success: boolean;
  message?: string;
  error?: string;
  error_code?: CustomerErrorCode;
  data?: UpdateCustomerCompanyData;
}
