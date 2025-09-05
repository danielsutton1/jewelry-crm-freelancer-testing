import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

type User = { name: string }
type Communication = {
  id: number
  message: string
  created_at: string
  sender: User
  recipient: User
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const limitParam = url.searchParams.get('limit')

    // Validate limit parameter
    let limit: number | undefined
    if (limitParam !== null) {
      limit = parseInt(limitParam)
      if (isNaN(limit) || limit <= 0) {
        return NextResponse.json(
          { error: 'Invalid limit parameter' },
          { status: 400 }
        )
      }
    }

    const supabase = await createSupabaseServerClient()

    let query = supabase
      .from('communications')
      .select(`
        id,
        message,
        created_at,
        sender:sender_id (name),
        recipient:recipient_id (name)
      `)
      .order('created_at', { ascending: false })

    if (limit) query = query.limit(limit)

    const { data, error } = await query
    if (error) throw error

    const communications: Communication[] = (data || []).map((item: any) => ({
      id: item.id,
      message: item.message,
      created_at: item.created_at,
      sender: item.sender?.[0] || { name: 'Unknown' },
      recipient: item.recipient?.[0] || { name: 'Unknown' },
    }))

    return NextResponse.json({ success: true, data: communications })
  } catch (error: any) {
    console.error('Error fetching communications:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
