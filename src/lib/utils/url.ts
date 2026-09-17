/**
 * The canonical origin of the site. Everything that needs an absolute URL
 * (sitemap, canonical tags, OpenGraph, JSON-LD) goes through here so a domain
 * change is a single environment variable.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  return raw.replace(/\/$/, '')
}

export function absoluteUrl(pathname: string): string {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `${getSiteUrl()}${path}`
}

/** Resolve a Payload media URL, which is relative when files are served locally. */
export function mediaUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return absoluteUrl(url)
}
