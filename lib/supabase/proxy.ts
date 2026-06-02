import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { ROUTE_ACCESS, ROUTES } from "@/lib/constants/routes";

export async function updateSession(request: NextRequest) {
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

  /**
   * AUTH CHECK (must stay immediately after client creation)
   */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;
  const isEmailVerified = !!user?.email_confirmed_at;

  const role = user?.app_metadata?.role ?? "CUSTOMER";
  const isAdmin = role === "ADMIN";

  const pathname = request.nextUrl.pathname;

  const isRootPath = pathname === ROUTES.HOME;

  const isPublicRoute = ROUTE_ACCESS.public.some((route) =>
    pathname.startsWith(route)
  );

  const isGuestOnlyRoute = ROUTE_ACCESS.guestOnly.some(
    (route) => pathname === route
  );

  const isUserRoute = ROUTE_ACCESS.user.some((route) =>
    pathname.startsWith(route)
  );

  const isAdminRoute = ROUTE_ACCESS.admin.some((route) =>
    pathname.startsWith(route)
  );

  /**
   * PUBLIC ACCESS
   */
  if (isRootPath || isPublicRoute) {
    return response;
  }

  /**
   * GUEST ONLY (login/signup/reset)
   */
  if (isGuestOnlyRoute && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.HOME;
    return NextResponse.redirect(url);
  }

  /**
   * PROTECTED ROUTES (user + admin)
   */
  if ((isUserRoute || isAdminRoute) && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.LOGIN;
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  /**
   * EMAIL VERIFICATION ENFORCEMENT
   */
  if (
    (isUserRoute || isAdminRoute) &&
    !isEmailVerified &&
    pathname !== ROUTES.VERIFY_EMAIL
  ) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.VERIFY_EMAIL;
    return NextResponse.redirect(url);
  }

  /**
   * ADMIN PROTECTION (CRITICAL ADDITION)
   */
  if (isAdminRoute && !isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.HOME;
    return NextResponse.redirect(url);
  }

  return response;
}