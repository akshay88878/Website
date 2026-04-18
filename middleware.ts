import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken
} from "@/services/adminSession";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedAdminApi =
    pathname === "/api/admin/logout" || pathname.startsWith("/api/admin/config");

  if (!isProtectedAdminApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const isAuthorized = await verifyAdminSessionToken(token);

  if (isAuthorized) {
    return NextResponse.next();
  }

  return NextResponse.json(
    {
      success: false,
      message: "Unauthorized"
    },
    { status: 401 }
  );
}
