import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { SiteSetting } from '@/payload-types'
import type { Locale } from '@/lib/i18n/config'
import { Link } from '@/lib/i18n/navigation'
import { mediaUrl } from '@/lib/utils/url'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { LocaleSwitcher } from './LocaleSwitcher'
import { MobileNav } from './MobileNav'
import { PRIMARY_NAV } from './navigation'

export async function Header({
  locale,
  settings,
}: {
  locale: Locale
  settings: SiteSetting | null
}) {
  const [t, tSite] = await Promise.all([
    getTranslations({ locale, namespace: 'Nav' }),
    getTranslations({ locale, namespace: 'Site' }),
  ])

  const siteName = settings?.siteName || tSite('name')
  const logo =
    settings?.logo && typeof settings.logo === 'object' ? mediaUrl(settings.logo.url) : undefined

  const items = PRIMARY_NAV.map((item) => ({ href: item.href, label: t(item.labelKey) }))

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-surface/90 backdrop-blur-md">
      <Container className="flex h-18 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3" aria-label={siteName}>
          {logo ? (
            <Image src={logo} alt={siteName} width={140} height={40} priority className="h-10 w-auto" />
          ) : (
            <span className="font-display text-xl font-semibold text-brand-900">{siteName}</span>
          )}
        </Link>

        <nav aria-label={t('menu')} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-pill px-3 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50 hover:text-brand-900"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher className="hidden sm:flex" />
          <Button href="/contact" size="sm" className="hidden lg:inline-flex">
            {t('contact')}
          </Button>
          <MobileNav items={items} />
        </div>
      </Container>
    </header>
  )
}
