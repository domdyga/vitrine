import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })
  const { pathname } = request.nextUrl

  const isAdminRoute = pathname.startsWith('/admin')
  const isAdminLogin = pathname === '/admin/login'
  const isDashboardRoute = pathname.startsWith('/dashboard')
  const isLoginPage = pathname === '/login'

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Without Supabase config: guard admin routes only
  if (!url || !key) {
    if (isAdminRoute && !isAdminLogin) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    if (isDashboardRoute) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return response
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()

  // --- Admin routes ---
  if (isAdminRoute) {
    if (!user && !isAdminLogin) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    if (user && isAdminLogin) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  // --- Dashboard routes ---
  if (isDashboardRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // --- /login: redirect already-authenticated users ---
  if (isLoginPage && user) {
    const role = user.user_metadata?.role as string | undefined
    return NextResponse.redirect(
      new URL(role === 'admin' ? '/admin' : '/dashboard', request.url)
    )
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/login'],
}
