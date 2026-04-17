import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { profileId, type, value } = body

    if (!profileId || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['view', 'click', 'time'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (supabaseUrl && serviceKey) {
      const { getSupabaseServiceClient } = await import('@/lib/supabase/server')
      const supabase = getSupabaseServiceClient()
      await supabase.from('analytics').insert({
        model_id: profileId as string,
        type: type as 'view' | 'click' | 'time',
        value: typeof value === 'number' ? value : null,
      })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
