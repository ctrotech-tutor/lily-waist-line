import { ROUTE_ACCESS, ROUTES } from "@/lib/constants/routes"

type Claims = {
    role?: string
}

type User = {
    email_confirmed_at?: string | null
}

export function getAuthContext(
    claims: Claims | null,
    user: User | null
) {
    return {
        isAuthenticated: !!user,
        isEmailVerified: !!user?.email_confirmed_at,
        role: claims?.role ?? "guest",
    }
}
export function canAccessRoute(
    pathname: string,
    context: ReturnType<typeof getAuthContext>
) {
    const { isAuthenticated, isEmailVerified, role } = context

    const match = (routes: readonly string[]) =>
        routes.some(
            (r) => pathname === r || pathname.startsWith(r + "/")
        )

    const isPublic = match(ROUTE_ACCESS.public)
    const isGuestOnly = match(ROUTE_ACCESS.guestOnly)
    const isUser = match(ROUTE_ACCESS.user)
    const isAdmin = match(ROUTE_ACCESS.admin)

    // 1. PUBLIC
    if (pathname === ROUTES.HOME || isPublic) {
        return { allow: true }
    }

    // 2. GUEST ONLY
    if (isGuestOnly && isAuthenticated) {
        return { redirect: ROUTES.HOME }
    }

    // 3. NOT AUTHENTICATED
    if ((isUser || isAdmin) && !isAuthenticated) {
        return {
            redirect: ROUTES.LOGIN,
            reason: "auth_required",
        }
    }

    // 4. EMAIL NOT VERIFIED
    if (
        (isUser || isAdmin) &&
        isAuthenticated &&
        !isEmailVerified &&
        !pathname.startsWith(ROUTES.VERIFY_EMAIL)
    ) {
        return {
            redirect: ROUTES.VERIFY_EMAIL,
            reason: "email_required",
        }
    }

    // 5. ADMIN CHECK
    if (isAdmin && role !== "admin") {
        return {
            redirect: ROUTES.HOME,
            reason: "admin_only",
        }
    }

    return { allow: true }
}