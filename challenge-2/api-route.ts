// CHALLENGE 2: Fixed API route for communications
// This file contains the fixed API route code with proper relationships and error handling

import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { 
  CommunicationsResponse, 
  CommunicationsError, 
  SupabaseCommunicationResult,
  Communication
} from './types'

export async function GET(): Promise<NextResponse<CommunicationsResponse | CommunicationsError>> {
  try {
    const supabase = await createSupabaseServerClient()
    
    // Fixed query with proper foreign key relationships
    // Now that we have foreign keys, Supabase can properly join the tables
    const { data, error } = await supabase
      .from('communications')
      .select(`
        id,
        message,
        sender_id,
        recipient_id,
        created_at,
        updated_at,
        sender:sender_id(name),
        recipient:recipient_id(name)
      `)
      .order('created_at', { ascending: false }) as { data: SupabaseCommunicationResult[] | null, error: Error | null }
    
    if (error) {
      throw new Error(`Database query failed: ${error.message}`)
    }
    
    // Handle null data case
    if (!data) {
      throw new Error('No data returned from database')
    }
    
    // Transform the data to match our expected format
    const transformedData: Communication[] = data.map(comm => {
      const { id, message, sender_id, recipient_id, created_at, updated_at, sender, recipient } = comm
      
      return {
        id,
        message,
        sender_id,
        recipient_id,
        created_at,
        updated_at,
        sender: sender ? {
          id: sender_id!,
          name: sender.name,
          email: '', // Not selected in query for privacy
          created_at: '',
          updated_at: ''
        } : null,
        recipient: recipient ? {
          id: recipient_id!,
          name: recipient.name,
          email: '', // Not selected in query for privacy
          created_at: '',
          updated_at: ''
        } : null
      }
    })
    
    const response: CommunicationsResponse = {
      success: true,
      data: transformedData
    }
    
    return NextResponse.json(response, { status: 200 })
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    
    // Determine appropriate status code based on error type
    const statusCode = errorMessage.includes('connection') ? 503 :
                      errorMessage.includes('permission') || errorMessage.includes('auth') ? 403 : 500
    
    const errorResponse: CommunicationsError = {
      success: false,
      error: errorMessage,
      status: statusCode
    }
    
    return NextResponse.json(errorResponse, { status: statusCode })
  }
}
