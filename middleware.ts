import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Helper to check if JWT token is expired
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return true;

    const expiryTime = payload.exp * 1000;
    const currentTime = Date.now();

    return currentTime >= expiryTime - 10000; // Refresh 10 seconds before expiry
  } catch (error) {
    console.error("Token decode error:", error);
    return true;
  }
}

// Helper to refresh access token
async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    console.log("Middleware: Attempting to refresh token...");

    const refreshResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "https://wpcapi.careerbandhu.in/"}api/auth/refresh/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      }
    );

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      console.log("Middleware: Token refreshed successfully");
      return data.access;
    }

    console.error("Middleware: Refresh failed with status", refreshResponse.status);
    return null;
  } catch (error) {
    console.error("Middleware: Token refresh error:", error);
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
    "/auth/candidate/login",
    "/auth/employer/login",
    "/auth/register",
    "/auth/employer/register",
    "/auth/candidate/register",
    "/welcome/forgot-password",
    "/welcome/forgot-password/employer",
    "/welcome/forgot-password/candidate",
    "/welcome/change-password",
    "/welcome/change-password/candidate",
    "/welcome/change-password/employer",
    "/welcome",
  ];

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isOnboardingRoute = pathname.startsWith("/onboarding/");

  // ===== HANDLE ROOT PATH FIRST =====
  if (pathname === "/") {
    if (!accessToken || !userInfoCookie) {
      return NextResponse.redirect(new URL("/welcome", request.url));
    }

    try {
      const userInfo = JSON.parse(userInfoCookie);

      if (!userInfo.onboarding) {
        return NextResponse.redirect(
          new URL(`/onboarding/${userInfo.role}`, request.url)
        );
      }

      return NextResponse.redirect(
        new URL(`/${userInfo.role}/dashboard`, request.url)
      );
    } catch (error) {
      const response = NextResponse.redirect(new URL("/welcome", request.url));
      response.cookies.delete("access-token");
      response.cookies.delete("refresh-token");
      response.cookies.delete("user-info");
      return response;
    }
  }
  // ===== END ROOT PATH HANDLING =====

  const needsRefresh = !accessToken || (accessToken && isTokenExpired(accessToken));

  if (needsRefresh && refreshToken && !isPublicRoute) {
    console.log("Middleware: Access token missing or expired");

    const newAccessToken = await refreshAccessToken(refreshToken);

    if (newAccessToken) {
      const response = NextResponse.next();
      response.cookies.set("access-token", newAccessToken, {
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 60 * 24,
      });

      console.log("Middleware: Proceeding with refreshed token");
      return response;
    } else {
      console.error("Middleware: Refresh failed, redirecting to login");

      const welcomeUrl = new URL("/welcome", request.url);
      welcomeUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(welcomeUrl);

      response.cookies.delete("access-token");
      response.cookies.delete("refresh-token");
      response.cookies.delete("user-info");

      return response;
    }
  }

  if (!accessToken && !refreshToken) {
    if (!isPublicRoute) {
      const welcomeUrl = new URL("/welcome", request.url);
      welcomeUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(welcomeUrl);
    }
    return NextResponse.next();
  }

  let userInfo;
  try {
    userInfo = userInfoCookie ? JSON.parse(userInfoCookie) : null;
  } catch (error) {
    const response = NextResponse.redirect(new URL("/welcome", request.url));
    response.cookies.delete("access-token");
    response.cookies.delete("refresh-token");
    response.cookies.delete("user-info");
    return response;
  }

  if (userInfo) {
    const isDashboardRoute = pathname.startsWith(`/${userInfo.role}/dashboard`);

    // 🔹 Only change: dashboard route excluded from onboarding redirect
    if (!userInfo.onboarding && !isOnboardingRoute && !isDashboardRoute) {
      const roleOnboardingUrl = new URL(
        `/onboarding/${userInfo.role}`,
        request.url
      );
      return NextResponse.redirect(roleOnboardingUrl);
    }

    if (userInfo.onboarding && isOnboardingRoute) {
      return NextResponse.redirect(
        new URL(`/${userInfo.role}/dashboard/`, request.url)
      );
    }

    if (isPublicRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};