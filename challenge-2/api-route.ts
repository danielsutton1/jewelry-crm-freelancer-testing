import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { CommunicationWithUsers, ApiResponse } from './types'

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<CommunicationWithUsers[]>>> {
  try {
    const supabase = await createSupabaseServerClient()
    
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
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch communications' },
        { status: 500 }
      )
    }
    
    if (!data) {
      return NextResponse.json(
        { success: true, data: [] },
        { status: 200 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      data: data as CommunicationWithUsers[] 
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
