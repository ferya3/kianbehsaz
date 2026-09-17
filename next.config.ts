import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./src/lib/i18n/request.ts')

const isDev = process.env.NODE_ENV === 'development'

/**
 * Content-Security-Policy for the public site.
 *
 * The Payload admin panel (/admin) and its API are excluded below: the admin
 * UI relies on inline styles/scripts that a strict policy would break.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  // `unsafe-inline` is required by the Next.js runtime for hydration bootstrap
  // scripts. `unsafe-eval` is only ever enabled in development.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "media-src 'self' https:",
  "connect-src 'self' https:",
  // The contact page embeds a map iframe whose provider is configured in the
  // CMS, so the host cannot be pinned here. Framing *us* is still forbidden.
  "frame-src 'self' https:",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone',

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Media served from the CMS in production (S3/R2 or the app itself).
      { protocol: 'https', hostname: '**.kianbehsaz.com' },
    ],
  },

  experimental: {
    // Payload ships a large server bundle; keep it out of the client graph.
    optimizePackageImports: ['framer-motion'],
  },

  async headers() {
    return [
      {
        // Everything except the Payload admin panel and the Payload REST API.
        source: '/((?!admin|api/cms).*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
