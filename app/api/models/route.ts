import { NextRequest, NextResponse } from 'next/server'
import { MOCK_MODELS } from '@/lib/mock-data'
import { isAdminAuthorized } from '@/lib/auth'

export async function GET() {
  try {
    const { getSupabaseServerClient } = await import('@/lib/supabase/server')
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase
      .from('models')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(MOCK_MODELS)
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!await isAdminAuthorized(req)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { getSupabaseServiceClient } = await import('@/lib/supabase/server')
    const supabase = getSupabaseServiceClient()

    const body = await req.json()
    const { data, error } = await supabase
      .from('models')
      .insert(body)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
