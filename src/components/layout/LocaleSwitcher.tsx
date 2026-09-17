'use client'

import { useParams } from 'next/navigation'
import { useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/lib/i18n/navigation'
import { localeLabels, locales, type Locale } from '@/lib/i18n/config'
import { cn } from '@/lib/utils/cn'

/**
 * Switches language while staying on the same page.
 *
 * `usePathname` from next-intl returns the path *without* the locale prefix,
 * so the router can simply re-render the current route in the new language —
 * no mapping table between language versions.
 */
export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations('Nav')
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const [isPending, startTransition] = useTransition()

  const current = (params.locale as Locale | undefined) ?? locales[0]

  return (
    <div className={cn('flex items-center gap-1', className)} role="group" aria-label={t('language')}>
      {locales.map((locale) => {
        const active = locale === current

        return (
          <button
            key={locale}
            type="button"
            lang={locale}
            aria-current={active ? 'true' : undefined}
            disabled={isPending || active}
            onClick={() => {
              startTransition(() => {
                // `pathname` here is next-intl's: the current path *without*
                // the locale prefix, with dynamic segments already filled in.
                // Re-navigating to it under another locale lands on the same
                // document, because slugs are shared across languages.
                router.replace(pathname, { locale })
              })
            }}
            className={cn(
              'rounded-pill px-2.5 py-1 text-xs font-medium transition-colors',
              active
                ? 'bg-brand-900 text-white'
                : 'text-brand-600 hover:bg-brand-100 disabled:opacity-50',
            )}
          >
            {localeLabels[locale]}
          </button>
        )
      })}
    </div>
  )
}
