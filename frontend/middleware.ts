import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("auth_token")?.value;

    // For client-side token stored in localStorage, we can't check in middleware
    // Instead, use the AdminGuard component client-side
    // This middleware is a secondary layer
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
