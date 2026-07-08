/**
 * Lightweight fixed-window rate limiter for form/API endpoints.
 *
 * NOTE: state is per worker isolate (an in-memory Map), which is enough to blunt
 * casual abuse and accidental double-submits. For strict, globally-consistent
 * limits across all Oxygen instances, back this with Durable Objects / KV — see
 * SECURITY.md. The interface below stays the same when you swap the store.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const store = new Map<string, Bucket>();

/** Best-effort client identity from proxy headers. */
export function clientKey(request: Request): string {
  const h = request.headers;
  const fwd = h.get('x-forwarded-for');
  return (
    (fwd ? fwd.split(',')[0].trim() : '') ||
    h.get('cf-connecting-ip') ||
    h.get('x-real-ip') ||
    'anonymous'
  );
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(
  request: Request,
  bucket: string,
  {limit, windowMs}: {limit: number; windowMs: number},
  now = Date.now(),
): RateLimitResult {
  // Opportunistic sweep so the map can't grow unbounded.
  if (store.size > 5000) {
    for (const [k, v] of store) {
      if (v.resetAt <= now) store.delete(k);
    }
  }

  const key = `${bucket}:${clientKey(request)}`;
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, {count: 1, resetAt: now + windowMs});
    return {ok: true, remaining: limit - 1, resetAt: now + windowMs};
  }

  existing.count += 1;
  return {
    ok: existing.count <= limit,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
  };
}

/** Test helper: clear all buckets. */
export function __resetRateLimitStore(): void {
  store.clear();
}
