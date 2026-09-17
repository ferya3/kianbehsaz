import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Liveness probe for the container and for Nginx upstream checks.
 *
 * Deliberately shallow: it answers "this process can serve requests", not
 * "the database is reachable". A deep check here would take the whole site
 * out of the load balancer during a brief database blip, when most pages are
 * still being served from cache.
 */
export function GET() {
  return NextResponse.json({ status: 'ok', uptime: Math.round(process.uptime()) })
}
