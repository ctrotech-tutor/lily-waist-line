import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { ROUTE_ACCESS, ROUTES } from "@/lib/constants/routes";

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip static assets and auth callback
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/cron/") ||
    pathname.startsWith("/static/") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/fonts/") ||
    pathname.startsWith("/favicon") ||
    pathname === "/sw.js" ||
    pathname === "/logo.png" ||
    pathname === "/logo.svg" ||
    pathname === "/og-img.png" ||
    pathname.startsWith(ROUTES.AUTH_CALLBACK)
  ) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;
  const isEmailVerified = !!user?.email_confirmed_at;

  const isRootPath = pathname === ROUTES.HOME;

  const isPublicRoute = ROUTE_ACCESS.public.some((route) =>
    pathname.startsWith(route)
  );

  const isGuestOnlyRoute = ROUTE_ACCESS.guestOnly.some(
    (route) => pathname === route
  );

  const isProtectedRoute =
    ROUTE_ACCESS.user.some((route) => pathname.startsWith(route)) ||
    ROUTE_ACCESS.admin.some((route) => pathname.startsWith(route));

  // Public routes
  if (isRootPath || isPublicRoute) {
    return response;
  }

  // Prevent logged-in users from accessing auth pages
  if (isGuestOnlyRoute && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.HOME;
    return NextResponse.redirect(url);
  }

  // Require authentication
  if (isProtectedRoute && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.LOGIN;
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  // Require verified email
  if (
    isProtectedRoute &&
    isAuthenticated &&
    !isEmailVerified &&
    pathname !== ROUTES.VERIFY_EMAIL
  ) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.VERIFY_EMAIL;
    return NextResponse.redirect(url);
  }

  return response;
}