import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { ProtectedRouteResponse, ErrorResponse } from './types'

export async function GET(request: NextRequest): Promise<NextResponse<ProtectedRouteResponse | ErrorResponse>> {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('Authentication error:', authError)
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }
    
    if (!user) {
      console.warn('No user found in session')
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data, error: dbError } = await supabase
      .from('user_data')
      .select('*')
      .eq('user_id', user.id)
    
    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch user data' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      data: data || [],
      userId: user.id 
    })
  } catch (error) {
    console.error('Unexpected error in protected route:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ProtectedRouteResponse | ErrorResponse>> {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    const { data, error: dbError } = await supabase
      .from('user_data')
      .insert({ ...body, user_id: user.id })
      .select()
    
    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { success: false, error: 'Failed to create user data' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      data: data || [],
      userId: user.id 
    })
  } catch (error) {
    console.error('Unexpected error in protected route POST:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
