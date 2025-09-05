// CHALLENGE 4: Fixed protected API route
// This file contains the fixed API route code with proper authentication handling

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { 
  ProtectedRouteResponse, 
  ProtectedRouteSuccessResponse, 
  ProtectedRouteErrorResponse,
  HttpStatus
} from './types'

export async function GET(request: NextRequest): Promise<NextResponse<ProtectedRouteResponse>> {
  try {
    const supabase = await createSupabaseServerClient()
    
    // Get user authentication status
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    // Handle authentication errors
    if (authError) {
      const errorResponse: ProtectedRouteErrorResponse = {
        success: false,
        error: 'Authentication failed',
        status: HttpStatus.UNAUTHORIZED
      }
      return NextResponse.json(errorResponse, { status: HttpStatus.UNAUTHORIZED })
    }
    
    // Check if user is authenticated
    if (!user) {
      const errorResponse: ProtectedRouteErrorResponse = {
        success: false,
        error: 'Unauthorized - User not authenticated',
        status: HttpStatus.UNAUTHORIZED
      }
      return NextResponse.json(errorResponse, { status: HttpStatus.UNAUTHORIZED })
    }
    
    // User is authenticated, proceed with protected logic
    const { data, error: dbError } = await supabase
      .from('user_data')
      .select('*')
      .eq('user_id', user.id)
    
    // Handle database errors
    if (dbError) {
      const errorResponse: ProtectedRouteErrorResponse = {
        success: false,
        error: `Database error: ${dbError.message}`,
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
      return NextResponse.json(errorResponse, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
    
    // Return successful response with user data
    const successResponse: ProtectedRouteSuccessResponse = {
      success: true,
      data: data || []
    }
    
    return NextResponse.json(successResponse, { status: HttpStatus.OK })
    
  } catch (error) {
    // Handle unexpected errors
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    
    const errorResponse: ProtectedRouteErrorResponse = {
      success: false,
      error: errorMessage,
      status: HttpStatus.INTERNAL_SERVER_ERROR
    }
    
    return NextResponse.json(errorResponse, { status: HttpStatus.INTERNAL_SERVER_ERROR })
  }
}
