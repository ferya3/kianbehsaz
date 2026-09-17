import createMiddleware from 'next-intl/middleware'
import { routing } from '@/lib/i18n/routing'

/**
 * Next 16 renamed the `middleware` convention to `proxy`; next-intl's factory
 * is unchanged, only the file name moved.
 *
 * Its job here is locale negotiation: redirect `/` to the visitor's best
 * matching language and make sure every page URL carries a locale prefix.
 */
export default createMiddleware(routing)

export const config = {
  /**
   * Run on every path except:
   *  - `/api/*`        application and CMS API routes
   *  - `/admin/*`      the Payload admin panel
   *  - `/_next/*`      framework internals
   *  - `/media/*`      uploaded files
   *  - anything with a file extension (favicon.ico, robots.txt, …)
   */
  matcher: ['/((?!api|admin|_next|_vercel|media|.*\\..*).*)'],
}
