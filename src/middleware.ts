import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const AUTH_LIMIT = 10;
const AUTH_WINDOW_MS = 60_000;

function clientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function middleware(request: NextRequest) {
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/login", "/api/auth/register"],
};
