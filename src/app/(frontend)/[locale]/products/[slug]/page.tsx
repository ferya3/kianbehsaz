import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/config'
import { buildMetadata } from '@/lib/seo/metadata'
import { productJsonLd } from '@/lib/seo/jsonLd'
import { getProductBySlug, getPublishedSlugs, getSiteSettings } from '@/lib/cms/queries'
import { ogImageUrl, resolveMedia } from '@/lib/cms/media'
import { PageHeader } from '@/components/shared/PageHeader'
import { Section, SectionHeader } from '@/components/ui/Section'
import { RichText } from '@/components/shared/RichText'
import { SpecTable } from '@/components/shared/SpecTable'
import { Gallery } from '@/components/shared/Gallery'
import { JsonLd } from '@/components/shared/JsonLd'
import { Button } from '@/components/ui/Button'
import { ProductGrid } from '@/components/products/ProductGrid'

type Props = { params: Promise<{ locale: string; slug: string }> }

export const revalidate = 600

export async function generateStaticParams() {
  // Slugs are shared across languages, so one list covers all three locales.
  const slugs = await getPublishedSlugs('products')

  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) return {}

  const product = await getProductBySlug(locale as Locale, slug)
  if (!product) return {}

  const tSite = await getTranslations({ locale, namespace: 'Site' })

  return buildMetadata({
    locale,
    path: `/products/${slug}`,
    title: product.title,
    description: product.shortDescription,
    image: ogImageUrl(product.seo?.image ?? product.coverImage),
    overrides: product.seo,
    siteName: tSite('name'),
  })
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const typedLocale = locale as Locale
  const product = await getProductBySlug(typedLocale, slug)
  if (!product) notFound()

  const [t, tNav, tCommon, settings] = await Promise.all([
    getTranslations({ locale, namespace: 'Products' }),
    getTranslations({ locale, namespace: 'Nav' }),
    getTranslations({ locale, namespace: 'Common' }),
    getSiteSettings(typedLocale),
  ])

  const cover = resolveMedia(product.coverImage, 'wide')
  const category = typeof product.category === 'object' ? product.category : null

  const galleryImages = (product.gallery ?? [])
    .map((item) => resolveMedia(item.image, 'card'))
    .filter((image): image is NonNullable<typeof image> => image !== null)

  const specs = (product.specifications ?? []).map((spec) => ({
    label: spec.label,
    value: spec.value,
    unit: spec.unit,
  }))

  const downloads = (product.downloads ?? []).filter(
    (item): item is Exclude<typeof item, number> => typeof item === 'object',
  )

  const related = (product.relatedProducts ?? []).filter(
    (item): item is Exclude<typeof item, number> => typeof item === 'object',
  )

  const breadcrumbs = [{ name: tNav('products'), href: '/products' }]
  if (category) {
    breadcrumbs.push({
      name: category.title,
      href: `/products/category/${category.slug}`,
    })
  }
  breadcrumbs.push({ name: product.title, href: `/products/${product.slug}` })

  return (
    <>
      <PageHeader
        locale={typedLocale}
        title={product.title}
        subtitle={product.shortDescription}
        breadcrumbs={breadcrumbs}
      >
        <Button href="/contact">{t('requestQuote')}</Button>
      </PageHeader>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[3fr_2fr]">
          <div>
            {cover ? (
              <div className="relative aspect-16/10 overflow-hidden rounded-card bg-brand-100">
                <Image
                  src={cover.url}
                  alt={cover.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 44rem, 92vw"
                  className="object-cover"
                />
              </div>
            ) : null}

            {product.description ? (
              <RichText data={product.description} className="mt-10" />
            ) : null}
          </div>

          <aside className="space-y-10">
            {specs.length ? (
              <div>
                <h2 className="mb-4 text-xl font-semibold">{t('specifications')}</h2>
                <SpecTable
                  rows={specs}
                  labels={{ property: t('property'), value: t('value'), unit: t('unit') }}
                />
              </div>
            ) : null}

            {product.applications?.length ? (
              <div>
                <h2 className="mb-4 text-xl font-semibold">{t('applications')}</h2>
                <ul className="space-y-3">
                  {product.applications.map((application) => (
                    <li
                      key={application.id ?? application.title}
                      className="rounded-card border border-brand-100 p-4"
                    >
                      <p className="font-medium text-brand-800">{application.title}</p>
                      {application.description ? (
                        <p className="mt-1 text-sm text-brand-600">{application.description}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {downloads.length ? (
              <div>
                <h2 className="mb-4 text-xl font-semibold">{t('downloads')}</h2>
                <ul className="space-y-2">
                  {downloads.map((file) => (
                    <li key={file.id}>
                      <a
                        href={file.url ?? '#'}
                        download
                        className="flex items-center justify-between rounded-card border border-brand-100 px-4 py-3 text-sm transition-colors hover:bg-brand-50"
                      >
                        <span>{file.title}</span>
                        <span className="text-accent-700">{tCommon('download')}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </Section>

      {galleryImages.length ? (
        <Section tone="muted">
          <SectionHeader title={t('gallery')} />
          <Gallery images={galleryImages} label={t('gallery')} />
        </Section>
      ) : null}

      {related.length ? (
        <Section>
          <SectionHeader title={t('relatedProducts')} />
          <ProductGrid products={related} />
        </Section>
      ) : null}

      <JsonLd
        data={productJsonLd({
          name: product.title,
          description: product.shortDescription,
          image: cover?.url,
          brand: settings?.siteName || 'Kian Behsaz',
          url: `/${locale}/products/${product.slug}`,
          specifications: specs.map((spec) => ({
            label: spec.label,
            value: spec.unit ? `${spec.value} ${spec.unit}` : spec.value,
          })),
        })}
      />
    </>
  )
}
