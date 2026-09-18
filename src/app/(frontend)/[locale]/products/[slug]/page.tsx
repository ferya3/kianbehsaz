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
import { Container } from '@/components/ui/Container'
import { Section, SectionHead } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { RichText } from '@/components/shared/RichText'
import { SpecTable } from '@/components/shared/SpecTable'
import { Gallery } from '@/components/shared/Gallery'
import { JsonLd } from '@/components/shared/JsonLd'
import { Reveal, RevealLines } from '@/components/motion/Reveal'
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

/**
 * A product page reads as a technical dossier rather than as a shop listing.
 *
 * The image is a tall column that sticks while the specification, applications
 * and downloads scroll past it — the engineer keeps the material in view while
 * reading its numbers.
 */
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
    breadcrumbs.push({ name: category.title, href: `/products/category/${category.slug}` })
  }
  breadcrumbs.push({ name: product.title, href: `/products/${product.slug}` })

  return (
    <>
      <Container className="pt-36 pb-16 md:pt-44">
        <Breadcrumbs locale={typedLocale} items={breadcrumbs} />

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            {category ? <p className="label-mono text-ember-400">{category.title}</p> : null}
            <h1 className="mt-4 max-w-3xl text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[1]">
              <RevealLines lines={[product.title]} />
            </h1>
            {product.shortDescription ? (
              <p className="mt-6 max-w-xl text-lg text-ink-300">{product.shortDescription}</p>
            ) : null}
          </div>

          <Button href="/contact" size="lg">
            {t('requestQuote')}
          </Button>
        </div>
      </Container>

      <Container className="pb-section">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          {/* Sticky media column: the material stays in view while the numbers
              scroll past it. */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            {cover ? (
              <div className="relative aspect-4/5 overflow-hidden bg-ink-800">
                <Image
                  src={cover.url}
                  alt={cover.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 46vw, 92vw"
                  className="object-cover"
                />
              </div>
            ) : null}
          </div>

          <div className="space-y-16">
            {specs.length ? (
              <Reveal>
                <section>
                  <h2 className="label-mono mb-6 text-ember-400">{t('specifications')}</h2>
                  <SpecTable
                    rows={specs}
                    labels={{ property: t('property'), value: t('value'), unit: t('unit') }}
                  />
                </section>
              </Reveal>
            ) : null}

            {product.description ? (
              <Reveal>
                <RichText data={product.description} />
              </Reveal>
            ) : null}

            {product.applications?.length ? (
              <Reveal>
                <section>
                  <h2 className="label-mono mb-6 text-ember-400">{t('applications')}</h2>
                  <ul>
                    {product.applications.map((application, index) => (
                      <li
                        key={application.id ?? application.title}
                        className="rule-hairline flex gap-6 py-5"
                      >
                        <span className="label-mono shrink-0">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <p className="font-medium text-ink-100">{application.title}</p>
                          {application.description ? (
                            <p className="mt-1 text-sm text-ink-400">{application.description}</p>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            ) : null}

            {downloads.length ? (
              <Reveal>
                <section>
                  <h2 className="label-mono mb-6 text-ember-400">{t('downloads')}</h2>
                  <ul>
                    {downloads.map((file) => (
                      <li key={file.id} className="rule-hairline">
                        <a
                          href={file.url ?? '#'}
                          download
                          className="group flex items-center justify-between gap-6 py-5 text-sm"
                        >
                          <span className="text-ink-200 transition-colors group-hover:text-ink-50">
                            {file.title}
                          </span>
                          <span className="label-mono text-ember-400">{tCommon('download')}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            ) : null}
          </div>
        </div>
      </Container>

      {galleryImages.length ? (
        <Section tone="raised" className="border-y border-white/10">
          <SectionHead index="02" label={t('gallery')} title={t('gallery')} />
          <Gallery images={galleryImages} label={t('gallery')} />
        </Section>
      ) : null}

      {related.length ? (
        <Section>
          <SectionHead index="03" label={t('relatedProducts')} title={t('relatedProducts')} />
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
