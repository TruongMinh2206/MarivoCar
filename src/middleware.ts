import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Protected routes that require authentication
const PROTECTED_ROUTES = ["/my-bookings", "/booking/"]

// Admin routes that require admin role
const ADMIN_ROUTES = ["/admin"]

// Auth routes that should redirect if already logged in
const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // For now, basic middleware - will be enhanced with NextAuth
  // Check for protected routes
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  const isAdminRoute = ADMIN_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  // TODO: Replace with actual NextAuth session check
  const token = request.cookies.get("next-auth.session-token")?.value

  if (isProtectedRoute && !token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  if (isAdminRoute && !token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  // Add security headers
  const response = NextResponse.next()

  // Request ID for tracing
  const requestId = crypto.randomUUID()
  response.headers.set("X-Request-Id", requestId)

  return response
}

export const config = {
  matcher: [
    // Match all paths except static files and images
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
