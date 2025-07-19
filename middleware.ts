import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

// Only protect these base paths
const protectedPaths = ["/admin", "/seller", "/customer"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path starts with one of the protected routes
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path))

  if (!isProtected) {
    return NextResponse.next() // allow access to all other routes
  }

  // Get token from cookies
  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  try {
    const { payload } = await jwtVerify(token, secret)
    const userRole = payload.role as string

    // Allow access only if the role matches the path
    if (pathname.startsWith("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }

    if (pathname.startsWith("/seller") && userRole !== "seller") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }

    if (pathname.startsWith("/customer") && userRole !== "customer") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }
}

// Match all routes so middleware can decide which to protect
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
}
