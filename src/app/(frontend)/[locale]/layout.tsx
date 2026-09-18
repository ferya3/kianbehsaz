import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { IBM_Plex_Mono, IBM_Plex_Sans_Arabic } from 'next/font/google'

import '@/styles/globals.css'

import { routing } from '@/lib/i18n/routing'
import { getDirection, localeHrefLang, type Locale } from '@/lib/i18n/config'
import { getSiteSettings } from '@/lib/cms/queries'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { JsonLd } from '@/components/shared/JsonLd'
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo/jsonLd'
import { buildAlternates } from '@/lib/seo/metadata'
import { absoluteMediaUrl, getSiteUrl } from '@/lib/utils/url'

/**
 * One family across Persian, Arabic and Latin, so switching language never
 * switches typeface. Plex Arabic holds its shape at display sizes, which this
 * layout leans on heavily.
 */
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-app-sans',
})

/** Latin only: figures, units, indices. Never Persian body text. */
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-app-mono',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}

  const t = await getTranslations({ locale, namespace: 'Site' })
  const settings = await getSiteSettings(locale)

  const name = settings?.siteName || t('name')
  const description = settings?.defaultSeoDescription || t('description')

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: `${name} — ${settings?.tagline || t('tagline')}`,
      template: `%s — ${name}`,
    },
    description,
    applicationName: name,
    alternates: buildAlternates(locale, '/'),
    openGraph: { type: 'website', siteName: name, locale: localeHrefLang[locale] },
    formatDetection: { telephone: false },
    // Matches the page background, so the browser chrome on mobile does not
    // sit as a white band above a black site.
    themeColor: '#08090a',
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  // Required for static rendering: without it, every page under this layout
  // opts into dynamic rendering the first time it reads a translation.
  setRequestLocale(locale)

  const typedLocale = locale as Locale
  const [t, tCommon, settings] = await Promise.all([
    getTranslations({ locale, namespace: 'Site' }),
    getTranslations({ locale, namespace: 'Common' }),
    getSiteSettings(typedLocale),
  ])

  const siteName = settings?.siteName || t('name')
  // Rendered nowhere in this layout — it only feeds the Organization schema,
  // which is read off-site and therefore needs an absolute URL.
  const logo =
    settings?.logo && typeof settings.logo === 'object'
      ? absoluteMediaUrl(settings.logo.url)
      : undefined

  return (
    <html
      lang={localeHrefLang[typedLocale]}
      dir={getDirection(typedLocale)}
      className={`${plexArabic.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-ink-950 text-ink-100">
        <NextIntlClientProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:z-[110] focus:m-4 focus:bg-ember-500 focus:px-4 focus:py-2 focus:text-white"
          >
            {tCommon('skipToContent')}
          </a>

          <SiteHeader locale={typedLocale} settings={settings} />

          <main id="main">{children}</main>

          <SiteFooter locale={typedLocale} settings={settings} />
        </NextIntlClientProvider>

        {/* One fixed grain layer over the whole page: it never scrolls with the
            content and costs a single composite. */}
        <div aria-hidden="true" className="grain-overlay" />

        <JsonLd
          data={[
            organizationJsonLd({
              name: siteName,
              description: settings?.defaultSeoDescription ?? t('description'),
              logo,
              sameAs: settings?.social?.map((profile) => profile.url) ?? [],
              phone: settings?.phones?.[0]?.number ?? null,
              email: settings?.emails?.[0]?.address ?? null,
              address: settings?.address ?? null,
            }),
            websiteJsonLd({ name: siteName, locale: typedLocale }),
          ]}
        />
      </body>
    </html>
  )
}
