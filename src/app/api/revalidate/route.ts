import { NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { timingSafeEqual } from 'crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Manual cache purge.
 *
 * Editor saves already purge the cache in-process (see
 * src/payload/hooks/revalidate.ts). This endpoint exists for the cases that
 * happen outside Payload: a database restore, a bulk import, or an operator
 * who needs to force a refresh without a deploy.
 */
function isAuthorised(request: Request): boolean {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret) return false

  const provided = request.headers.get('x-revalidate-secret') ?? ''
  const a = Buffer.from(provided)
  const b = Buffer.from(secret)
  // timingSafeEqual throws on a length mismatch, so compare lengths first.
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function POST(request: Request) {
  if (!isAuthorised(request)) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const tag = searchParams.get('tag')
  const path = searchParams.get('path')

  if (!tag && !path) {
    return NextResponse.json(
      { ok: false, error: 'Provide ?tag= or ?path=' },
      { status: 400 },
    )
  }

  if (tag) revalidateTag(tag, 'max')
  if (path) revalidatePath(path, 'page')

  return NextResponse.json({ ok: true, tag, path, revalidatedAt: new Date().toISOString() })
}
