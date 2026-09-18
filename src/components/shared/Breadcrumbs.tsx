import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/lib/i18n/config'
import { Link } from '@/lib/i18n/navigation'
import { JsonLd } from './JsonLd'
import { breadcrumbJsonLd } from '@/lib/seo/jsonLd'

export type Crumb = { name: string; href: string }

/**
 * Renders the trail and emits the matching BreadcrumbList structured data from
 * the same array, so the two can never disagree.
 */
export async function Breadcrumbs({
  locale,
  items,
}: {
  locale: Locale
  items: Crumb[]
}) {
  const t = await getTranslations({ locale, namespace: 'Common' })
  const tNav = await getTranslations({ locale, namespace: 'Nav' })

  const trail: Crumb[] = [{ name: tNav('home'), href: '/' }, ...items]

  return (
    <>
      <nav aria-label={t('breadcrumb')} className="label-mono">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {trail.map((crumb, index) => {
            const isLast = index === trail.length - 1

            return (
              <li key={crumb.href} className="flex items-center gap-2">
                {isLast ? (
                  <span aria-current="page" className="text-ink-200">
                    {crumb.name}
                  </span>
                ) : (
                  <Link href={crumb.href} className="transition-colors hover:text-ink-100">
                    {crumb.name}
                  </Link>
                )}
                {!isLast ? (
                  <span aria-hidden="true" className="text-ink-600 rtl:rotate-180">
                    ›
                  </span>
                ) : null}
              </li>
            )
          })}
        </ol>
      </nav>

      <JsonLd
        data={breadcrumbJsonLd(
          trail.map((crumb) => ({
            name: crumb.name,
            path: `/${locale}${crumb.href === '/' ? '' : crumb.href}`,
          })),
        )}
      />
    </>
  )
}
