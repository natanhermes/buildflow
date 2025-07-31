import { NextResponse } from 'next/server'

import { auth } from '@/auth'

export default auth((request) => {
  const { nextUrl } = request
  const isLoggedIn = !!request.auth
  const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
  const isOnLogin = nextUrl.pathname === '/'

  if (isLoggedIn && isOnLogin) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  if (!isLoggedIn && isOnDashboard) {
    return NextResponse.redirect(new URL('/', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/obras/:path*',
    '/atividades/:path*',
    '/',
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)"
  ],
}
