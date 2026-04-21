import { NextRequest, NextResponse } from 'next/server'

async function computeToken(username: string, password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(`${username}:${password}`)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    const validUser = process.env.ADMIN_USERNAME
    const validPass = process.env.ADMIN_PASSWORD

    if (!validUser || !validPass) {
      return NextResponse.json(
        { error: 'Admin non configuré. Ajoutez ADMIN_USERNAME et ADMIN_PASSWORD dans .env.local' },
        { status: 503 }
      )
    }

    if (username !== validUser || password !== validPass) {
      return NextResponse.json({ error: 'Identifiants incorrects.' }, { status: 401 })
    }

    const token = await computeToken(validUser, validPass)
    const response = NextResponse.json({ ok: true })

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
