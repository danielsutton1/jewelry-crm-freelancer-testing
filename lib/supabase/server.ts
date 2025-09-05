import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export function createSupabaseServerClient() {
  // In real app, Supabase client uses cookies for auth context
  const supabase = createServerComponentClient({ cookies })
  return supabase
}
