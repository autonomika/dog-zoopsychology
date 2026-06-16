type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

const MAX_KEYS = 10_000;

function prune(now: number) {
  if (store.size <= MAX_KEYS) return;
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
    if (store.size <= MAX_KEYS * 0.8) break;
  }
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  prune(now);

  const entry = store.get(key);
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (entry.count >= limit) {
    return { ok: false, retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) };
  }

  entry.count += 1;
  return { ok: true };
}
