import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { ROUTE_ACCESS } from '@/lib/constants/routes'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with Supabase client, your users may be randomly logged out.
  // const { data } = await supabase.auth.getClaims()
  const { data } = await supabase.auth.getUser()
  const user = data?.user
  const pathname = request.nextUrl.pathname

  // Route-based access control - NO database operations in middleware
  const isPublicRoute = ROUTE_ACCESS.public.some(route => pathname.startsWith(route))
  const isGuestOnlyRoute = ROUTE_ACCESS.guestOnly.some(route => pathname === route)
  const isUserRoute = ROUTE_ACCESS.user.some(route => pathname.startsWith(route))
  const isAdminRoute = ROUTE_ACCESS.admin.some(route => pathname.startsWith(route))

  // Public routes - always allow
  if (isPublicRoute) {
    return supabaseResponse
  }

  // Guest-only routes - redirect if authenticated
  if (isGuestOnlyRoute && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // User routes - require authentication
  if (isUserRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // Admin routes - require authentication (role checking done in individual pages)
  if (isAdminRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change myNewResponse object to fit your needs, but avoid changing
  //    cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing browser and server to go out
  // of sync and terminate user's session prematurely!

  return supabaseResponse
}
