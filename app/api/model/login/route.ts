import { NextRequest, NextResponse } from 'next/server'

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()
    if (!username || !password) {
      return NextResponse.json({ error: 'Identifiants manquants' }, { status: 400 })
    }

    const { getSupabaseServiceClient } = await import('@/lib/supabase/server')
    const supabase = getSupabaseServiceClient()

    const { data: model, error } = await supabase
      .from('models')
      .select('id, name, model_username, model_password_hash')
      .eq('model_username', username)
      .single()

    if (error || !model || !model.model_password_hash) {
      return NextResponse.json({ error: 'Identifiants incorrects.' }, { status: 401 })
    }

    const inputHash = await hashPassword(password)
    if (inputHash !== model.model_password_hash) {
      return NextResponse.json({ error: 'Identifiants incorrects.' }, { status: 401 })
    }

    // Token = SHA-256(model_id + password_hash)
    const tokenData = new TextEncoder().encode(`${model.id}:${model.model_password_hash}`)
    const tokenHash = await crypto.subtle.digest('SHA-256', tokenData)
    const token = Array.from(new Uint8Array(tokenHash))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    const response = NextResponse.json({ ok: true, modelId: model.id, name: model.name })

    response.cookies.set('model_token', `${model.id}.${token}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
