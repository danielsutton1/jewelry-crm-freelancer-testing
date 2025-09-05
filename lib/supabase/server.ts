// Mock Supabase server client for testing purposes
// This file provides a mock implementation of the Supabase server client

import { createClient } from '@supabase/supabase-js'

// Mock environment variables for testing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ? process.env.NEXT_PUBLIC_SUPABASE_URL : 'https://mock.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : 'mock-anon-key'

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Export the createSupabaseServerClient function
export async function createSupabaseServerClient() {
  return supabase
}
