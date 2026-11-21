import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const sessionCookie = request.cookies.get("finanz_session_id");

  if (!sessionCookie) {
    const newSessionId = crypto.randomUUID();
    response.cookies.set("finanz_session_id", newSessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // Dura 1 año
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};