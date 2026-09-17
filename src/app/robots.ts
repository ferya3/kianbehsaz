import type { MetadataRoute } from 'next'
import { absoluteUrl, getSiteUrl } from '@/lib/utils/url'

export default function robots(): MetadataRoute.Robots {
  // A staging deployment must never be indexed. The canonical origin is the
  // only signal we can rely on here.
  const isProduction = getSiteUrl() === 'https://kianbehsaz.com'

  if (!isProduction) {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/graphql', '/graphql-playground'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: getSiteUrl(),
  }
}
