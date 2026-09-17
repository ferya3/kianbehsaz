import { NextResponse } from 'next/server'
import { getPrisma } from '@/lib/db/prisma'
import { fieldErrors, newsletterSchema } from '@/lib/validation/contact'
import { clientIp, hashIp, rateLimit } from '@/lib/security/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const ip = clientIp(request.headers)
  const limit = rateLimit(`newsletter:${ip}`, { limit: 5, windowSeconds: 60 * 60 })

  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: 'rateLimited' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    )
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalidBody' }, { status: 400 })
  }

  const parsed = newsletterSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'validation', fields: fieldErrors(parsed.error) },
      { status: 422 },
    )
  }

  const { email, locale, website } = parsed.data
  if (website) return NextResponse.json({ ok: true })

  try {
    // Re-subscribing is idempotent, and it clears a previous unsubscribe.
    await getPrisma().newsletterSubscriber.upsert({
      where: { email },
      create: { email, locale, ipHash: hashIp(ip) },
      update: { locale, unsubscribedAt: null },
    })
  } catch (error) {
    console.error('[newsletter] failed to store subscriber', error)
    return NextResponse.json({ ok: false, error: 'server' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
