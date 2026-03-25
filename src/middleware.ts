import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)

  if (!sessionCookie) {
    const url = request.nextUrl.clone()
    const redirectPath = request.nextUrl.pathname
    const loginPath = redirectPath.startsWith("/administration")
      ? "/connexion-administration"
      : "/connexion"
    url.pathname = loginPath
    url.searchParams.set("redirect", redirectPath)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/bureau/:path*", "/administration/:path*"],
}
