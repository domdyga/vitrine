import type { NextRequest } from 'next/server'

async function computeAdminToken(username: string, password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(`${username}:${password}`)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function isAdminAuthorized(req: NextRequest): Promise<boolean> {
  // 1. Vérifier le cookie admin_token (auth env-var)
  const token = req.cookies.get('admin_token')?.value
  const validUser = process.env.ADMIN_USERNAME
  const validPass = process.env.ADMIN_PASSWORD

  if (token && validUser && validPass) {
    const expected = await computeAdminToken(validUser, validPass)
    if (token === expected) return true
  }

  // 2. Fallback : vérifier la session Supabase
  try {
    const { getSupabaseServiceClient } = await import('@/lib/supabase/server')
    const supabase = getSupabaseServiceClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) return true
  } catch {
    // Supabase non configuré
  }

  return false
}
