import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "dev-secret-change-me";
  const token = await getToken({ req, secret });

  const isCandidate = pathname.startsWith("/app");
  const isHr = pathname.startsWith("/hr");
  const isAdmin = pathname.startsWith("/admin");

  if ((isCandidate || isHr || isAdmin) && !token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (isCandidate && token?.role !== "CANDIDATE") {
    return NextResponse.redirect(new URL(token?.role === "PLATFORM_ADMIN" ? "/admin/ai" : "/hr", req.url));
  }
  if (isHr && token?.role !== "HR" && token?.role !== "COMPANY_ADMIN") {
    return NextResponse.redirect(new URL(token?.role === "PLATFORM_ADMIN" ? "/admin/ai" : "/app", req.url));
  }
  if (isAdmin && token?.role !== "PLATFORM_ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/hr/:path*", "/admin/:path*"],
};
