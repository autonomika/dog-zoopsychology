import { NextResponse } from "next/server";

type RateLimitOptions = {
  bucket: string;
  max: number;
  windowMs: number;
  key?: string;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = globalThis as typeof globalThis & {
  __securityRateLimitStore?: Map<string, RateLimitEntry>;
};

function rateLimitStore() {
  if (!store.__securityRateLimitStore) {
    store.__securityRateLimitStore = new Map<string, RateLimitEntry>();
  }
  return store.__securityRateLimitStore;
}

function cleanupExpired(now: number) {
  const entries = rateLimitStore();
  for (const [key, entry] of entries.entries()) {
    if (entry.resetAt <= now) entries.delete(key);
  }
}

export function getClientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("true-client-ip") ||
    "unknown"
  );
}

export function enforceRateLimit(req: Request, options: RateLimitOptions) {
  const now = Date.now();
  cleanupExpired(now);

  const subject = options.key?.trim() || getClientIp(req);
  const key = `${options.bucket}:${subject}`;
  const entries = rateLimitStore();
  const current = entries.get(key);

  if (!current || current.resetAt <= now) {
    entries.set(key, { count: 1, resetAt: now + options.windowMs });
    return null;
  }

  current.count += 1;
  entries.set(key, current);

  if (current.count <= options.max) {
    return null;
  }

  const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
  return NextResponse.json(
    { error: "Слишком много запросов. Повторите позже." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
      },
    }
  );
}

function requestOrigin(req: Request) {
  const originHeader = req.headers.get("origin");
  if (originHeader) {
    try {
      return new URL(originHeader).origin;
    } catch {
      return null;
    }
  }

  const refererHeader = req.headers.get("referer");
  if (refererHeader) {
    try {
      return new URL(refererHeader).origin;
    } catch {
      return null;
    }
  }

  return null;
}

export function enforceSameOrigin(req: Request) {
  const actualOrigin = requestOrigin(req);
  if (!actualOrigin) return null;

  const allowedOrigins = new Set<string>();

  try {
    allowedOrigins.add(new URL(req.url).origin);
  } catch {
    // no-op
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (appUrl) {
    try {
      allowedOrigins.add(new URL(appUrl).origin);
    } catch {
      // no-op
    }
  }

  if (allowedOrigins.has(actualOrigin)) {
    return null;
  }

  return NextResponse.json({ error: "Недопустимый источник запроса" }, { status: 403 });
}

export function enforceWebhookToken(req: Request) {
  const expected = process.env.YOOKASSA_WEBHOOK_TOKEN?.trim();
  if (!expected || expected.includes("change-me") || expected.includes("...")) {
    return NextResponse.json({ error: "Webhook token не настроен" }, { status: 503 });
  }

  const url = new URL(req.url);
  const actual = req.headers.get("x-webhook-token")?.trim() || url.searchParams.get("token")?.trim();

  if (actual && actual === expected) {
    return null;
  }

  return NextResponse.json({ error: "Недопустимый webhook token" }, { status: 401 });
}
