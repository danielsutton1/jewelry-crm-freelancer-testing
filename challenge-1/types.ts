// CHALLENGE 1: TypeScript types for the update_customer_company function
// This file should contain your TypeScript type definitions

// Function parameter types
export interface UpdateCustomerCompanyParams {
  company_name: string;
  customer_id: string; // UUID as string in TypeScript
}

// Success response data
export interface UpdateCustomerCompanyData {
  customer_id: string;
  old_company: string | null;
  new_company: string;
  updated_at: string; // ISO timestamp string
}

// Success response type
export interface UpdateCustomerCompanySuccessResponse {
  success: true;
  message: string;
  data: UpdateCustomerCompanyData;
}

// Error response type
export interface UpdateCustomerCompanyErrorResponse {
  success: false;
  error: string;
  error_code: 'INVALID_COMPANY_NAME' | 'CUSTOMER_NOT_FOUND' | 'DATABASE_ERROR';
}

// Union type for all possible responses
export type UpdateCustomerCompanyResponse = 
  | UpdateCustomerCompanySuccessResponse 
  | UpdateCustomerCompanyErrorResponse;

// Type for the Supabase RPC call parameters
export interface SupabaseRpcParams {
  company_name: string;
  customer_id: string;
}

// Customer table structure
export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string | null;
  created_at: string;
  updated_at: string;
}

// Audit log entry structure
export interface AuditLog {
  id: string;
  table_name: string;
  record_id: string;
  action: string;
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  user_id: string | null;
  created_at: string;
}
