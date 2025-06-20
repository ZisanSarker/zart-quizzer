import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define your public and protected routes
const PUBLIC_ROUTES = ['/', '/login', '/register', '/forgot-password', '/oauth-success']
const DASHBOARD_ROUTE = '/dashboard'

// Which routes require authentication
function isProtectedRoute(pathname: string) {
  // All routes except PUBLIC_ROUTES and static/_next assets
  return !PUBLIC_ROUTES.includes(pathname) && !pathname.startsWith('/_next')
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Call your backend API to check if the user is authenticated
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
  const cookie = req.headers.get('cookie') || ''
  let isAuthenticated = false

  // Only check auth on relevant routes
  if (isProtectedRoute(pathname) || PUBLIC_ROUTES.includes(pathname)) {
    try {
      const res = await fetch(`${apiBase}/auth/me`, {
        headers: { cookie },
        credentials: 'include',
      })
      if (res.ok) {
        isAuthenticated = true
      }
    } catch (e) {
      // do nothing, user is not authenticated
    }
  }

  // If user is authenticated and on public route, redirect to dashboard
  if (isAuthenticated && PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL(DASHBOARD_ROUTE, req.url))
  }

  // If user is not authenticated and on a protected route, redirect to login
  if (!isAuthenticated && isProtectedRoute(pathname)) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Otherwise, continue as normal
  return NextResponse.next()
}

// Matcher config (adjust as needed)
export const config = {
  matcher: [
    // All routes except static files, _next, assets, etc.
    '/((?!_next/static|_next/image|favicon.ico|images|api/auth|api/public).*)',
  ],
}