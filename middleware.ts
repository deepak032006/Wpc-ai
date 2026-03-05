import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Check if JWT token expired
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return true;

    const expiry = payload.exp * 1000;
    return Date.now() >= expiry - 10000;
  } catch {
    return true;
  }
}

// Refresh access token
async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "https://wpcapi.careerbandhu.in/"}api/auth/refresh/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data.access;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access-token")?.value;
  const refreshToken = request.cookies.get("refresh-token")?.value;
  const userInfoCookie = request.cookies.get("user-info")?.value;

  const { pathname } = request.nextUrl;

  const publicRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/candidate/login",
    "/auth/employer/login",
    "/auth/candidate/register",
    "/auth/employer/register",
    "/welcome",
    "/welcome/forgot-password",
    "/welcome/change-password",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // ROOT HANDLING
  if (pathname === "/") {
    if (!accessToken || !userInfoCookie) {
      return NextResponse.redirect(new URL("/welcome", request.url));
    }

    try {
      const userInfo = JSON.parse(userInfoCookie);

      return NextResponse.redirect(
        new URL(`/${userInfo.role}/dashboard`, request.url)
      );
    } catch {
      const res = NextResponse.redirect(new URL("/welcome", request.url));
      res.cookies.delete("access-token");
      res.cookies.delete("refresh-token");
      res.cookies.delete("user-info");
      return res;
    }
  }

  // TOKEN REFRESH
  const needsRefresh = !accessToken || isTokenExpired(accessToken);

  if (needsRefresh && refreshToken && !isPublicRoute) {
    const newAccessToken = await refreshAccessToken(refreshToken);

    if (newAccessToken) {
      const res = NextResponse.next();

      res.cookies.set("access-token", newAccessToken, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24,
      });

      return res;
    }

    const welcomeUrl = new URL("/welcome", request.url);
    welcomeUrl.searchParams.set("redirect", pathname);

    const res = NextResponse.redirect(welcomeUrl);

    res.cookies.delete("access-token");
    res.cookies.delete("refresh-token");
    res.cookies.delete("user-info");

    return res;
  }

  // NOT LOGGED IN
  if (!accessToken && !refreshToken) {
    if (!isPublicRoute) {
      const welcomeUrl = new URL("/welcome", request.url);
      welcomeUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(welcomeUrl);
    }
  }

  // Logged-in users shouldn't access public routes
  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};