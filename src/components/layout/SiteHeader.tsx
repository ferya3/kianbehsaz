import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { SiteSetting } from '@/payload-types'
import type { Locale } from '@/lib/i18n/config'
import { Link } from '@/lib/i18n/navigation'
import { mediaUrl } from '@/lib/utils/url'
import { PRIMARY_NAV } from './navigation'
import { HeaderShell } from './HeaderShell'
import { OverlayMenu } from './OverlayMenu'

/**
 * The header floats over the hero and only grows a background once the page
 * has scrolled past it — see HeaderShell, which owns that behaviour.
 *
 * Navigation lives behind one button at every breakpoint, not just on mobile.
 * A full-screen index is both the more considered choice for a site this dark
 * and one less layout that has to be maintained twice.
 */
export async function SiteHeader({
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

  const items = PRIMARY_NAV.map((item, index) => ({
    href: item.href,
    label: t(item.labelKey),
    index: String(index + 1).padStart(2, '0'),
  }))

  const contactLine = settings?.phones?.[0]?.number ?? settings?.emails?.[0]?.address ?? null

  return (
    <HeaderShell>
      <Link href="/" className="flex items-center gap-3" aria-label={siteName}>
        {logo ? (
          <Image src={logo} alt={siteName} width={132} height={36} priority className="h-8 w-auto" />
        ) : (
          <span className="font-display text-lg font-semibold tracking-tight text-ink-50">
            {siteName}
          </span>
        )}
      </Link>

      <div className="flex items-center gap-6">
        {contactLine ? (
          <span dir="ltr" className="label-mono hidden text-ink-300 lg:inline">
            {contactLine}
          </span>
        ) : null}

        <OverlayMenu
          items={items}
          siteName={siteName}
          tagline={settings?.tagline ?? tSite('tagline')}
        />
      </div>
    </HeaderShell>
  )
}
