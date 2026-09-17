import 'server-only'

import { createHash } from 'crypto'

type Bucket = { count: number; resetAt: number }

/**
 * Fixed-window rate limiter held in process memory.
 *
 * This is deliberate for a single-container deployment behind Nginx: it costs
 * nothing and stops the obvious abuse. Cloudflare's own rate limiting sits in
 * front of it as the first line. The moment the app runs on more than one
 * instance this has to move to Redis — see docs/ARCHITECTURE.md.
 */
const buckets = new Map<string, Bucket>()

/** Drop expired buckets so a long-running process does not grow unbounded. */
function sweep(now: number) {
  if (buckets.size < 512) return
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

export type RateLimitResult = {
  allowed: boolean
  remaining: number
  retryAfterSeconds: number
}

export function rateLimit(
  key: string,
  { limit, windowSeconds }: { limit: number; windowSeconds: number },
): RateLimitResult {
  const now = Date.now()
  sweep(now)

  const existing = buckets.get(key)

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 })
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 }
  }

  existing.count += 1

  if (existing.count > limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    }
  }

  return {
    allowed: true,
    remaining: limit - existing.count,
    retryAfterSeconds: 0,
  }
}

/**
 * Best-effort client IP. Behind Cloudflare → Nginx the real address arrives in
 * `cf-connecting-ip`; `x-forwarded-for` is only trusted because Nginx rewrites
 * it (see deploy/nginx/kianbehsaz.conf).
 */
export function clientIp(headers: Headers): string {
  return (
    headers.get('cf-connecting-ip') ??
    headers.get('x-real-ip') ??
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  )
}

/**
 * Hash an IP before it touches the database. The salt lives only in the
 * environment, so a database dump on its own cannot be reversed into
 * addresses, and rotating the salt unlinks the stored history.
 */
export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? ''
  return createHash('sha256').update(`${ip}:${salt}`).digest('hex')
}
