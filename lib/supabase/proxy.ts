import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { ROUTE_ACCESS, ROUTES } from '@/lib/constants/routes'

const isProduction = process.env.NODE_ENV === 'production'

const defaultCookieOptions = isProduction
  ? { domain: '.lilywaistline.com', path: '/', sameSite: 'lax' as const }
  : { path: '/' }

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )

          supabaseResponse = NextResponse.next({
            request,
          })

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, { ...defaultCookieOptions, ...options })
          )

          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          )
        },
      },
    }
  )

  // MUST remain first
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims

  const isAuthenticated = !!claims
  let isEmailVerified = false

  // Only fetch full user if authenticated
  if (isAuthenticated) {
    const { data: userData } = await supabase.auth.getUser()

    isEmailVerified = !!userData.user?.email_confirmed_at;
  }

  const pathname = request.nextUrl.pathname

  const isRootPath = pathname === ROUTES.HOME
  const isPublicRoute = ROUTE_ACCESS.public.some(route =>
    pathname.startsWith(route)
  )
  const isGuestOnlyRoute = ROUTE_ACCESS.guestOnly.some(
    route => pathname === route
  )
  const isUserRoute = ROUTE_ACCESS.user.some(route =>
    pathname.startsWith(route)
  )
  const isAdminRoute = ROUTE_ACCESS.admin.some(route =>
    pathname.startsWith(route)
  )

  // Public access
  if (isRootPath || isPublicRoute) {
    return supabaseResponse
  }

  // Guest-only routes
  if (isGuestOnlyRoute && isAuthenticated) {
    const url = request.nextUrl.clone()
    url.pathname = ROUTES.HOME
    return NextResponse.redirect(url)
  }

  // Protected routes
  if ((isUserRoute || isAdminRoute) && !isAuthenticated) {
    const url = request.nextUrl.clone()
    url.pathname = ROUTES.LOGIN
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // Email verification enforcement
  if ((isUserRoute || isAdminRoute) && !isEmailVerified) {
    const url = request.nextUrl.clone()
    url.pathname = ROUTES.VERIFY_EMAIL
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}