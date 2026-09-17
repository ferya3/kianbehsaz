import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/config'
import { buildMetadata } from '@/lib/seo/metadata'
import { getSiteSettings } from '@/lib/cms/queries'
import { PageHeader } from '@/components/shared/PageHeader'
import { Section } from '@/components/ui/Section'
import { ContactForm } from '@/components/shared/ContactForm'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

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

  return (
    <>
      <PageHeader
        locale={typedLocale}
        title={t('title')}
        subtitle={t('subtitle')}
        breadcrumbs={[{ name: tNav('contact'), href: '/contact' }]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[3fr_2fr]">
          <div>
            <h2 className="text-2xl font-semibold">{t('formTitle')}</h2>
            <div className="mt-8">
              <ContactForm locale={typedLocale} />
            </div>
          </div>

          <aside className="space-y-8">
            {settings?.address ? (
              <div>
                <h2 className="text-sm font-semibold tracking-wide text-brand-500 uppercase">
                  {t('addressTitle')}
                </h2>
                <p className="mt-2 text-brand-800">{settings.address}</p>
              </div>
            ) : null}

            {settings?.phones?.length ? (
              <div>
                <h2 className="text-sm font-semibold tracking-wide text-brand-500 uppercase">
                  {t('phoneTitle')}
                </h2>
                <ul className="mt-2 space-y-1">
                  {settings.phones.map((phone) => (
                    <li key={phone.id ?? phone.number}>
                      <a href={`tel:${phone.number}`} dir="ltr" className="text-brand-800">
                        {phone.number}
                      </a>
                      {phone.label ? (
                        <span className="ms-2 text-sm text-brand-500">{phone.label}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {settings?.emails?.length ? (
              <div>
                <h2 className="text-sm font-semibold tracking-wide text-brand-500 uppercase">
                  {t('emailTitle')}
                </h2>
                <ul className="mt-2 space-y-1">
                  {settings.emails.map((email) => (
                    <li key={email.id ?? email.address}>
                      <a href={`mailto:${email.address}`} dir="ltr" className="text-brand-800">
                        {email.address}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {settings?.openingHours ? (
              <div>
                <h2 className="text-sm font-semibold tracking-wide text-brand-500 uppercase">
                  {t('hoursTitle')}
                </h2>
                <p className="mt-2 text-brand-800">{settings.openingHours}</p>
              </div>
            ) : null}

            {settings?.mapEmbedUrl ? (
              <iframe
                src={settings.mapEmbedUrl}
                title={t('addressTitle')}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="aspect-4/3 w-full rounded-card border border-brand-100"
              />
            ) : null}
          </aside>
        </div>
      </Section>
    </>
  )
}
