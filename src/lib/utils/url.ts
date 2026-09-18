/**
 * The canonical origin of the site. Everything that needs an absolute URL
 * (sitemap, canonical tags, OpenGraph, JSON-LD) goes through here, so a domain
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

/**
 * A media URL for rendering on the page.
 *
 * Payload prefixes uploads with its `serverURL`, so a self-hosted file comes
 * back as `https://kianbehsaz.com/api/cms/media/file/kiln.webp`. That origin is
 * stripped here, for two reasons:
 *
 *  - `next/image` only optimises remote URLs whose host is in `remotePatterns`,
 *    so an absolute URL to our own host is rejected with a 400;
 *  - a relative path keeps working when the site is reached on any other host
 *    (a preview deployment, a staging domain, localhost).
 *
 * URLs on another origin — object storage, a CDN — are passed through
 * untouched and do need a `remotePatterns` entry.
 */
export function mediaUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  if (!url.startsWith('http://') && !url.startsWith('https://')) return url

  try {
    const parsed = new URL(url)
    if (parsed.origin !== new URL(getSiteUrl()).origin) return url
    return `${parsed.pathname}${parsed.search}`
  } catch {
    return url
  }
}

/**
 * The same media as an absolute URL, for metadata.
 *
 * OpenGraph, Twitter cards and JSON-LD are consumed off-site, where a relative
 * path means nothing.
 */
export function absoluteMediaUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return absoluteUrl(url)
}
