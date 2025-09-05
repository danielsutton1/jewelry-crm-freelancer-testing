// CHALLENGE 2: TypeScript types for communications API
// This file contains the TypeScript type definitions for the communications API

// Base User type from the database
export interface User {
  id: string
  name: string
  email: string
  created_at: string
  updated_at: string
}

// Communication type with optional user relationships
export interface Communication {
  id: string
  message: string
  sender_id: string | null
  recipient_id: string | null
  created_at: string
  updated_at: string
  // Populated user objects when joined
  sender?: User | null
  recipient?: User | null
}

// API response types
export interface CommunicationsResponse {
  success: true
  data: Communication[]
}

export interface CommunicationsError {
  success: false
  error: string
  status?: number
}

// Type for Supabase query result - matches the actual Supabase response format
export interface SupabaseCommunicationResult {
  id: string
  message: string
  sender_id: string | null
  recipient_id: string | null
  created_at: string
  updated_at: string
  sender: {
    name: string
  } | null
  recipient: {
    name: string
  } | null
}
