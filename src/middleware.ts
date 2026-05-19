import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"
import { resolveDashboardLoginPath } from "@/helpers/dashboard-login-path"

export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)

  if (!sessionCookie) {
    const url = request.nextUrl.clone()
    const redirectPath = request.nextUrl.pathname
    const loginPath = resolveDashboardLoginPath(redirectPath)
    url.pathname = loginPath
    url.searchParams.set("redirect", redirectPath)
    return NextResponse.redirect(url)
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-pathname", request.nextUrl.pathname)

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: [
    "/bureau/:path*",
    "/administration/:path*",
    "/hebergement-relation/:path*",
  ],
}
