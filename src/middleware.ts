import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const AUTH_LIMIT = 10;
const AUTH_WINDOW_MS = 60_000;
const AUTH_PATHS = new Set(["/api/auth/login", "/api/auth/register"]);

function clientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  if (!AUTH_PATHS.has(request.nextUrl.pathname)) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  const ip = clientIp(request);
  const key = `${request.nextUrl.pathname}:${ip}`;
  const result = rateLimit(key, AUTH_LIMIT, AUTH_WINDOW_MS);

  if (!result.ok) {
    return NextResponse.json(
      { error: "Слишком много попыток. Попробуйте позже." },
      {
        status: 429,
        headers: { "Retry-After": String(result.retryAfter) },
      }
    );
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
