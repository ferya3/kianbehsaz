import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/config'
import { buildMetadata } from '@/lib/seo/metadata'
import { getPageBySlug } from '@/lib/cms/queries'
import { ogImageUrl, resolveMedia } from '@/lib/cms/media'
import { PageHeader } from '@/components/shared/PageHeader'
import { Section } from '@/components/ui/Section'
import { RichText } from '@/components/shared/RichText'

/**
 * Catch-all for editorial pages from the `pages` collection (privacy policy,
 * terms, campaign landing pages).
 *
 * Static routes such as /products or /contact are matched first by the router,
 * so a CMS page can never shadow one — but for the same reason an editor who
 * gives a page the slug `products` will find it unreachable. The admin
 * description on the slug field says so.
 */
type Props = { params: Promise<{ locale: string; slug: string }> }

export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) return {}

  const page = await getPageBySlug(locale as Locale, slug)
  if (!page) return {}

  const tSite = await getTranslations({ locale, namespace: 'Site' })

  return buildMetadata({
    locale,
    path: `/${slug}`,
    title: page.title,
    description: page.subtitle,
    image: ogImageUrl(page.seo?.image ?? page.heroImage),
    overrides: page.seo,
    siteName: tSite('name'),
  })
}

export default async function CmsPage({ params }: Props) {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const typedLocale = locale as Locale
  const page = await getPageBySlug(typedLocale, slug)
  if (!page) notFound()

  const hero = resolveMedia(page.heroImage, 'wide')

  return (
    <>
      <PageHeader
        locale={typedLocale}
        title={page.title}
        subtitle={page.subtitle}
        breadcrumbs={[{ name: page.title, href: `/${page.slug}` }]}
      />

      <Section>
        {hero ? (
          <div className="relative mb-12 aspect-16/9 overflow-hidden rounded-card bg-brand-100">
            <Image
              src={hero.url}
              alt={hero.alt}
              fill
              priority
              sizes="(min-width: 1024px) 72rem, 92vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="mx-auto max-w-3xl">
          <RichText data={page.content} />
        </div>
      </Section>
    </>
  )
}
