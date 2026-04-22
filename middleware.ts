import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

async function computeAdminToken(username: string, password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(`${username}:${password}`)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function isAdminTokenValid(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('admin_token')?.value
  const validUser = process.env.ADMIN_USERNAME
  const validPass = process.env.ADMIN_PASSWORD
  if (!token || !validUser || !validPass) return false
  const expected = await computeAdminToken(validUser, validPass)
  return token === expected
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })
  const { pathname } = request.nextUrl

  const isAdminRoute = pathname.startsWith('/admin')
  const isAdminLogin = pathname === '/admin/login'
  const isDashboardRoute = pathname.startsWith('/dashboard')
  const isLoginPage = pathname === '/login'

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // --- Admin routes ---
  if (isAdminRoute) {
    // Try Supabase session first
    if (supabaseUrl && supabaseKey) {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet) =>
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            ),
        },
      })
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        if (isAdminLogin) return NextResponse.redirect(new URL('/admin', request.url))
        return response
      }
    }

    // Fallback: check admin_token cookie (env-var auth)
    const tokenValid = await isAdminTokenValid(request)
    if (tokenValid) {
      if (isAdminLogin) return NextResponse.redirect(new URL('/admin', request.url))
      return response
    }

    // Not authenticated
    if (!isAdminLogin) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // --- Dashboard routes ---
  if (isDashboardRoute) {
    // Check model_token cookie (per-model credential auth)
    const modelToken = request.cookies.get('model_token')?.value
    if (modelToken && /^[0-9a-f-]+\.[0-9a-f]{64}$/.test(modelToken)) {
      return response
    }

    // Fallback: Supabase session
    if (supabaseUrl && supabaseKey) {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet) =>
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            ),
        },
      })
      const { data: { user } } = await supabase.auth.getUser()
      if (user) return response
    }

    return NextResponse.redirect(new URL('/login', request.url))
  }

  // --- /login: redirect already-authenticated users ---
  if (isLoginPage && supabaseUrl && supabaseKey) {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) =>
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          ),
      },
    })
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const role = user.user_metadata?.role as string | undefined
      return NextResponse.redirect(
        new URL(role === 'admin' ? '/admin' : '/dashboard', request.url)
      )
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/login'],
}
