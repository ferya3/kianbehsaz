import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Vazirmatn } from 'next/font/google'

import '@/styles/globals.css'

import { routing } from '@/lib/i18n/routing'
import { getDirection, localeHrefLang, type Locale } from '@/lib/i18n/config'
import { getSiteSettings } from '@/lib/cms/queries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { JsonLd } from '@/components/shared/JsonLd'
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo/jsonLd'
import { buildAlternates } from '@/lib/seo/metadata'
import { getSiteUrl, mediaUrl } from '@/lib/utils/url'

/**
 * Vazirmatn covers Persian, Arabic and Latin in one family, so a language
 * switch does not swap typeface — and there is only one font to download.
 */
const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-app-sans',
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
      default: `${name} | ${settings?.tagline || t('tagline')}`,
      template: `%s | ${name}`,
    },
    description,
    applicationName: name,
    alternates: buildAlternates(locale, '/'),
    openGraph: {
      type: 'website',
      siteName: name,
      locale: localeHrefLang[locale],
    },
    formatDetection: { telephone: false },
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

  // Required for static rendering: without it every page under this layout
  // opts into dynamic rendering the first time it reads a translation.
  setRequestLocale(locale)

  const typedLocale = locale as Locale
  const [t, tCommon, settings] = await Promise.all([
    getTranslations({ locale, namespace: 'Site' }),
    getTranslations({ locale, namespace: 'Common' }),
    getSiteSettings(typedLocale),
  ])

  const siteName = settings?.siteName || t('name')
  const logo =
    settings?.logo && typeof settings.logo === 'object' ? mediaUrl(settings.logo.url) : undefined

  return (
    <html
      lang={localeHrefLang[typedLocale]}
      dir={getDirection(typedLocale)}
      className={vazirmatn.variable}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col bg-surface antialiased">
        <NextIntlClientProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-4 focus:rounded-card focus:bg-brand-900 focus:px-4 focus:py-2 focus:text-white"
          >
            {tCommon('skipToContent')}
          </a>

          <Header locale={typedLocale} settings={settings} />

          <main id="main" className="flex-1">
            {children}
          </main>

          <Footer locale={typedLocale} settings={settings} />
        </NextIntlClientProvider>

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
