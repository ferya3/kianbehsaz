import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/config'
import { buildMetadata } from '@/lib/seo/metadata'
import { getGalleryImages } from '@/lib/cms/queries'
import { resolveMedia } from '@/lib/cms/media'
import { PageHero } from '@/components/shared/PageHero'
import { Section } from '@/components/ui/Section'
import { Gallery } from '@/components/shared/Gallery'
import { EmptyState } from '@/components/shared/EmptyState'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}

  const t = await getTranslations({ locale, namespace: 'Gallery' })
  const tSite = await getTranslations({ locale, namespace: 'Site' })

  return buildMetadata({
    locale,
    path: '/gallery',
    title: t('title'),
    description: t('subtitle'),
    siteName: tSite('name'),
  })
}

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const typedLocale = locale as Locale
  const [t, tNav, media] = await Promise.all([
    getTranslations({ locale, namespace: 'Gallery' }),
    getTranslations({ locale, namespace: 'Nav' }),
    getGalleryImages(typedLocale),
  ])

  const images = media
    .map((item) => {
      const resolved = resolveMedia(item, 'card')
      return resolved ? { ...resolved, caption: item.caption } : null
    })
    .filter((image): image is NonNullable<typeof image> => image !== null)

  return (
    <>
      <PageHero
        locale={typedLocale}
        index="10"
        title={t('title')}
        subtitle={t('subtitle')}
        breadcrumbs={[{ name: tNav('gallery'), href: '/gallery' }]}
      />

      <Section>
        {images.length ? (
          <Gallery images={images} label={t('title')} />
        ) : (
          <EmptyState message={t('empty')} />
        )}
      </Section>
    </>
  )
}
