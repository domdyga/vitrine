import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { getSupabaseServerClient } = await import('@/lib/supabase/server')
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase.from('model_stats').select('*')
    if (error) throw error
    return NextResponse.json(data)
  } catch {
    return NextResponse.json([])
  }
}
