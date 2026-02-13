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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

  // Define public routes that don't require authentication
  const publicRoutes = ["/auth/login","/auth/candidate/login","/auth/employer/login", 
    "/auth/register","/auth/employer/register","/auth/candidate/register", "/welcome/forgot-password",
    "/welcome/forgot-password/employer","/welcome/forgot-password/candidate", "/welcome/change-password",
     "/welcome/change-password/candidate","/welcome/change-password/employer","/welcome"];
  
  // Check if current path is public or onboarding
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isOnboardingRoute = pathname.startsWith("/onboarding/");

  // ===== HANDLE ROOT PATH FIRST =====
  if (pathname === "/") {
    // No tokens - redirect to welcome
    if (!accessToken || !userInfoCookie) {
      return NextResponse.redirect(new URL("/welcome", request.url));
    }

    // Parse user info and redirect to appropriate page
    try {
      const userInfo = JSON.parse(userInfoCookie);
      
      // Check if onboarding is complete
      if (!userInfo.onboarding) {
        return NextResponse.redirect(new URL(`/onboarding/${userInfo.role}`, request.url));
      }
      
      // Redirect to dashboard
      return NextResponse.redirect(new URL(`/${userInfo.role}/dashboard`, request.url));
    } catch (error) {
      // If parsing fails, clear cookies and redirect to welcome
      const response = NextResponse.redirect(new URL("/welcome", request.url));
      response.cookies.delete("access-token");
      response.cookies.delete("refresh-token");
      response.cookies.delete("user-info");
      return response;
    }
  }
  // ===== END ROOT PATH HANDLING =====

  // Check if access token is missing or expired
  const needsRefresh = !accessToken || (accessToken && isTokenExpired(accessToken));

  // If token needs refresh and we have refresh token and not on public route
  if (needsRefresh && refreshToken && !isPublicRoute) {
    console.log("Middleware: Access token missing or expired");
    
    const newAccessToken = await refreshAccessToken(refreshToken);

    if (newAccessToken) {
      // Create response and set new access token
      const response = NextResponse.next();
      response.cookies.set("access-token", newAccessToken, {
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 24 hours
      });

      console.log("Middleware: Proceeding with refreshed token");
      return response;
    } else {
      // Refresh failed - clear cookies and redirect to welcome
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

  // If no access token and no refresh token, redirect to welcome (except for public routes)
  if (!accessToken && !refreshToken) {
    if (!isPublicRoute) {
      const welcomeUrl = new URL("/welcome", request.url);
      welcomeUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(welcomeUrl);
    }
    return NextResponse.next();
  }

  // Parse user info
  let userInfo;
  try {
    userInfo = userInfoCookie ? JSON.parse(userInfoCookie) : null;
  } catch (error) {
    // If user info is invalid, clear cookies and redirect to welcome
    const response = NextResponse.redirect(new URL("/welcome", request.url));
    response.cookies.delete("access-token");
    response.cookies.delete("refresh-token");
    response.cookies.delete("user-info");
    return response;
  }
  
  // If user is authenticated
  if (userInfo) {
    // If onboarding is not complete and not already on onboarding route
    if (!userInfo.onboarding && !isOnboardingRoute) {
      // Redirect to dynamic role-based onboarding
      const roleOnboardingUrl = new URL(`/onboarding/${userInfo.role}`, request.url);
      return NextResponse.redirect(roleOnboardingUrl);
    }

    // If onboarding is complete and user is on onboarding route, redirect to home
    if (userInfo.onboarding && isOnboardingRoute) {
      return NextResponse.redirect(new URL(`/${userInfo.role}/dashboard/`, request.url));
    }

    // If user is authenticated and tries to access login/register, redirect to home
    if (isPublicRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};