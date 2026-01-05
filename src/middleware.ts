import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/shared/session";
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "./shared/routes";

const protectedRoutes = Object.values(PRIVATE_ROUTES);
const publicRoutes = Object.values(PUBLIC_ROUTES);

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  console.log("🔥 Middleware is running:", path);
  if (path === "/") {
    const cookie = req.cookies.get("session")?.value;
    const session = await decrypt(cookie);

    return NextResponse.redirect(
      new URL(
        session?.token
          ? PRIVATE_ROUTES.DASHBOARD_ANALYTICS
          : PUBLIC_ROUTES.LOGIN,
        req.nextUrl,
      ),
    );
  }
  // 2. Check if the current route is protected or public

  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.token) {
    return NextResponse.redirect(new URL(PUBLIC_ROUTES.LOGIN, req.nextUrl));
  }

  // 5. Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    session?.token &&
    !req.nextUrl.pathname.startsWith(PRIVATE_ROUTES.DASHBOARD_ANALYTICS)
  ) {
    return NextResponse.redirect(
      new URL(PRIVATE_ROUTES.DASHBOARD_ANALYTICS, req.nextUrl),
    );
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
