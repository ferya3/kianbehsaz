import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/config'
import { buildMetadata } from '@/lib/seo/metadata'
import { getSiteSettings } from '@/lib/cms/queries'
import { Container } from '@/components/ui/Container'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { ContactForm } from '@/components/shared/ContactForm'
import { RevealLines } from '@/components/motion/Reveal'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}

  const t = await getTranslations({ locale, namespace: 'Contact' })
  const tSite = await getTranslations({ locale, namespace: 'Site' })

  return buildMetadata({
    locale,
    path: '/contact',
    title: t('title'),
    description: t('subtitle'),
    siteName: tSite('name'),
  })
}

/**
 * Contact is one screen, split: the details on one side, the form on the
 * other, with no page header above them. The page opens straight into the ask.
 */
export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const typedLocale = locale as Locale
  const [t, tNav, settings] = await Promise.all([
    getTranslations({ locale, namespace: 'Contact' }),
    getTranslations({ locale, namespace: 'Nav' }),
    getSiteSettings(typedLocale),
  ])

  const details = [
    { label: t('addressTitle'), value: settings?.address, dir: undefined },
    {
      label: t('phoneTitle'),
      value: settings?.phones?.map((phone) => phone.number).join('\n'),
      dir: 'ltr' as const,
      href: settings?.phones?.[0] ? `tel:${settings.phones[0].number}` : undefined,
    },
    {
      label: t('emailTitle'),
      value: settings?.emails?.map((email) => email.address).join('\n'),
      dir: 'ltr' as const,
      href: settings?.emails?.[0] ? `mailto:${settings.emails[0].address}` : undefined,
    },
    { label: t('hoursTitle'), value: settings?.openingHours, dir: undefined },
  ].filter((detail): detail is typeof detail & { value: string } => Boolean(detail.value))

  return (
    <Container className="pt-36 pb-section md:pt-44">
      <Breadcrumbs locale={typedLocale} items={[{ name: tNav('contact'), href: '/contact' }]} />

      <div className="mt-10 grid gap-16 lg:grid-cols-[1fr_1.15fr] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h1 className="text-[clamp(2.5rem,6.5vw,5rem)] leading-[1.02]">
            <RevealLines lines={[t('title')]} />
          </h1>
          <p className="mt-6 max-w-md text-lg text-ink-300">{t('subtitle')}</p>

          <dl className="mt-14">
            {details.map((detail) => (
              <div key={detail.label} className="rule-hairline py-5">
                <dt className="label-mono">{detail.label}</dt>
                <dd dir={detail.dir} className="mt-2 whitespace-pre-line text-ink-100">
                  {detail.href ? (
                    <a
                      href={detail.href}
                      className="font-mono transition-colors hover:text-ember-300"
                    >
                      {detail.value}
                    </a>
                  ) : (
                    detail.value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          {settings?.mapEmbedUrl ? (
            <iframe
              src={settings.mapEmbedUrl}
              title={t('addressTitle')}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="mt-10 aspect-4/3 w-full border border-white/10 grayscale"
            />
          ) : null}
        </div>

        <div className="border-t border-white/10 pt-10 lg:border-0 lg:pt-0">
          <h2 className="label-mono mb-10 text-ember-400">{t('formTitle')}</h2>
          <ContactForm locale={typedLocale} />
        </div>
      </div>
    </Container>
  )
}
