import 'server-only'

import { getPayload, type Payload } from 'payload'
import config from '@payload-config'

/**
 * Payload runs in-process, so the front end talks to the database through the
 * local API rather than over HTTP to itself. No network hop, no serialisation,
 * and access control still applies because we pass `overrideAccess: false`
 * wherever the data is public.
 */
export async function getCms(): Promise<Payload> {
  return getPayload({ config })
}

/**
 * Wrap a CMS read so that a database outage degrades the page instead of
 * taking the whole site down: a missing product list renders an empty state,
 * a missing global renders the defaults from `messages/`.
 */
export async function safeQuery<T>(
  label: string,
  run: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await run()
  } catch (error) {
    console.error(`[cms] ${label} failed:`, error)
    return fallback
  }
}
