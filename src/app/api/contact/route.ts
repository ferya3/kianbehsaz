import { NextResponse } from 'next/server'
import { getPrisma } from '@/lib/db/prisma'
import { contactSchema, fieldErrors } from '@/lib/validation/contact'
import { clientIp, hashIp, rateLimit } from '@/lib/security/rate-limit'

export const runtime = 'nodejs'
// Never cached: this endpoint only ever writes.
export const dynamic = 'force-dynamic'

const LIMIT = 5
const WINDOW_SECONDS = 15 * 60

export async function POST(request: Request) {
  const ip = clientIp(request.headers)
  const limit = rateLimit(`contact:${ip}`, { limit: LIMIT, windowSeconds: WINDOW_SECONDS })

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

  const parsed = contactSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'validation', fields: fieldErrors(parsed.error) },
      { status: 422 },
    )
  }

  const data = parsed.data

  // The honeypot is filled in — accept the request so the bot sees success,
  // but store nothing.
  if (data.website) {
    return NextResponse.json({ ok: true })
  }

  try {
    await getPrisma().contactRequest.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        subject: data.subject,
        message: data.message,
        locale: data.locale,
        ipHash: hashIp(ip),
        userAgent: request.headers.get('user-agent')?.slice(0, 512) ?? null,
      },
    })
  } catch (error) {
    // Log that the write failed, never the submitted content.
    console.error(
      '[contact] failed to store request:',
      error instanceof Error ? error.message : error,
    )
    return NextResponse.json({ ok: false, error: 'server' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
