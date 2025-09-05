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
      .order('created_at', { ascending: false }) as { data: SupabaseCommunicationResult[] | null, error: any }
    
    if (error) {
      console.error('Supabase query error:', error)
      throw new Error(`Database query failed: ${error.message}`)
    }
    
    // Handle null data case
    if (!data) {
      throw new Error('No data returned from database')
    }
    
    // Transform the data to match our expected format
    const transformedData: Communication[] = data.map(comm => ({
      id: comm.id,
      message: comm.message,
      sender_id: comm.sender_id,
      recipient_id: comm.recipient_id,
      created_at: comm.created_at,
      updated_at: comm.updated_at,
      sender: comm.sender ? {
        id: comm.sender_id!,
        name: comm.sender.name,
        email: '', // Not selected in query for privacy
        created_at: '',
        updated_at: ''
      } : null,
      recipient: comm.recipient ? {
        id: comm.recipient_id!,
        name: comm.recipient.name,
        email: '', // Not selected in query for privacy
        created_at: '',
        updated_at: ''
      } : null
    }))
    
    const response: CommunicationsResponse = {
      success: true,
      data: transformedData
    }
    
    return NextResponse.json(response, { status: 200 })
    
  } catch (error) {
    console.error('Error fetching communications:', error)
    
    // Determine appropriate status code based on error type
    let statusCode = 500
    let errorMessage = 'Internal server error'
    
    if (error instanceof Error) {
      errorMessage = error.message
      
      // Check for specific error types
      if (error.message.includes('Database query failed')) {
        statusCode = 500
      } else if (error.message.includes('connection')) {
        statusCode = 503 // Service unavailable
      } else if (error.message.includes('permission') || error.message.includes('auth')) {
        statusCode = 403 // Forbidden
      }
    }
    
    const errorResponse: CommunicationsError = {
      success: false,
      error: errorMessage,
      status: statusCode
    }
    
    return NextResponse.json(errorResponse, { status: statusCode })
  }
}
