/**
 * In-memory sliding-window rate limiter.
 *
 * Per-key buckets store the timestamps of accepted hits; a request is
 * allowed while fewer than `max` timestamps fall inside the last
 * `windowMs` milliseconds. Old timestamps are pruned on every check and
 * the bucket is deleted once empty, so keys do not accumulate forever.
 *
 * LIMITATION (same philosophy as the in-memory quote store): state lives
 * in the Node process. In a multi-instance deployment (several Next.js
 * server processes behind a load balancer) each instance keeps its own
 * counters, so the effective limit is `max * instanceCount`. For the
 * single-instance deployment this platform currently runs, that is
 * acceptable; swap the Map for Redis (`INCR` + `PEXPIRE`) when scaling
 * out.
 */

export interface RateLimitConfig {
  /** Window length in milliseconds */
  windowMs: number
  /** Max accepted requests per key inside the window */
  max: number
}

export interface RateLimitResult {
  /** Whether the current request is allowed */
  allowed: boolean
  /** Milliseconds until the oldest hit leaves the window (when blocked) */
  retryAfterMs: number
}

/** Env flag that disables rate limiting (tests / trusted environments only). */
export const RATE_LIMIT_DISABLED = "MARIVO_RATE_LIMIT_DISABLED"

const buckets = new Map<string, number[]>()

/** Test hook: wipe all buckets. */
export function resetRateLimits(): void {
  buckets.clear()
}

/**
 * Check (and count) a request against the sliding window for a key.
 *
 * The key should already encode its scope, e.g. `login:203.0.113.7` —
 * callers compose `prefix + identifier`.
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  if (process.env[RATE_LIMIT_DISABLED] === "1") {
    return { allowed: true, retryAfterMs: 0 }
  }

  const now = Date.now()
  const windowStart = now - config.windowMs

  const hits = (buckets.get(key) ?? []).filter((ts) => ts > windowStart)

  if (hits.length >= config.max) {
    // Blocked — do not record the rejected request, but keep the bucket.
    buckets.set(key, hits)
    const oldestHit = hits[0]
    return {
      allowed: false,
      retryAfterMs: Math.max(oldestHit + config.windowMs - now, 1),
    }
  }

  hits.push(now)
  buckets.set(key, hits)
  return { allowed: true, retryAfterMs: 0 }
}

/**
 * Resolve a stable client identifier for rate limiting.
 * Prefers `x-forwarded-for` (first hop, set by the reverse proxy);
 * falls back to `x-real-ip`, then to "unknown" so all direct hits share
 * one bucket.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    const first = forwarded.split(",")[0].trim()
    if (first) return first
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown"
}
