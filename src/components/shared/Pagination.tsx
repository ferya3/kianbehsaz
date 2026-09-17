import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/lib/i18n/config'
import { Link } from '@/lib/i18n/navigation'
import { cn } from '@/lib/utils/cn'

/**
 * Page links are real `<a>` elements with `?page=` so that every page of a
 * listing is crawlable and shareable, rather than a client-side "load more"
 * that search engines never see.
 */
export async function Pagination({
  locale,
  basePath,
  page,
  totalPages,
}: {
  locale: Locale
  basePath: string
  page: number
  totalPages: number
}) {
  if (totalPages <= 1) return null

  const t = await getTranslations({ locale, namespace: 'Common' })
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  const href = (target: number) => (target === 1 ? basePath : `${basePath}?page=${target}`)

  return (
    <nav aria-label={t('page', { page: totalPages })} className="mt-12 flex justify-center">
      <ul className="flex flex-wrap items-center gap-2">
        <li>
          {page > 1 ? (
            <Link
              href={href(page - 1)}
              rel="prev"
              className="rounded-pill border border-brand-200 px-4 py-2 text-sm hover:bg-brand-50"
            >
              {t('previous')}
            </Link>
          ) : null}
        </li>

        {pages.map((target) => (
          <li key={target}>
            <Link
              href={href(target)}
              aria-current={target === page ? 'page' : undefined}
              className={cn(
                'inline-flex h-10 min-w-10 items-center justify-center rounded-pill px-3 text-sm',
                target === page
                  ? 'bg-brand-900 text-white'
                  : 'border border-brand-200 text-brand-700 hover:bg-brand-50',
              )}
            >
              {target}
            </Link>
          </li>
        ))}

        <li>
          {page < totalPages ? (
            <Link
              href={href(page + 1)}
              rel="next"
              className="rounded-pill border border-brand-200 px-4 py-2 text-sm hover:bg-brand-50"
            >
              {t('next')}
            </Link>
          ) : null}
        </li>
      </ul>
    </nav>
  )
}
