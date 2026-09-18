import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/config'
import { buildMetadata } from '@/lib/seo/metadata'
import { getProjectBySlug, getPublishedSlugs } from '@/lib/cms/queries'
import { ogImageUrl, resolveMedia } from '@/lib/cms/media'
import { Container } from '@/components/ui/Container'
import { Section, SectionHead } from '@/components/ui/Section'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { RichText } from '@/components/shared/RichText'
import { Gallery } from '@/components/shared/Gallery'
import { SpecTable } from '@/components/shared/SpecTable'
import { Reveal, RevealLines } from '@/components/motion/Reveal'
import { ProductGrid } from '@/components/products/ProductGrid'

type Props = { params: Promise<{ locale: string; slug: string }> }

export const revalidate = 600

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs('projects')

  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) return {}

  const project = await getProjectBySlug(locale as Locale, slug)
  if (!project) return {}

  const tSite = await getTranslations({ locale, namespace: 'Site' })

  return buildMetadata({
    locale,
    path: `/projects/${slug}`,
    title: project.title,
    description: project.summary,
    image: ogImageUrl(project.seo?.image ?? project.coverImage),
    overrides: project.seo,
    siteName: tSite('name'),
  })
}

/**
 * A project opens on the building itself, full bleed, with the title over it —
 * then hands over to a facts rail and the write-up.
 */
export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const typedLocale = locale as Locale
  const project = await getProjectBySlug(typedLocale, slug)
  if (!project) notFound()

  const [t, tNav, tProducts] = await Promise.all([
    getTranslations({ locale, namespace: 'Projects' }),
    getTranslations({ locale, namespace: 'Nav' }),
    getTranslations({ locale, namespace: 'Products' }),
  ])

  const cover = resolveMedia(project.coverImage, 'wide')
  const category = typeof project.category === 'object' ? project.category : null

  const galleryImages = (project.gallery ?? [])
    .map((item) => resolveMedia(item.image, 'card'))
    .filter((image): image is NonNullable<typeof image> => image !== null)

  const productsUsed = (project.productsUsed ?? []).filter(
    (item): item is Exclude<typeof item, number> => typeof item === 'object',
  )

  const facts = [
    { label: t('client'), value: project.client },
    { label: t('location'), value: project.location },
    { label: t('year'), value: project.year?.toString() },
    { label: t('category'), value: category?.title },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value))

  const breadcrumbs = [{ name: tNav('projects'), href: '/projects' }]
  if (category) {
    breadcrumbs.push({ name: category.title, href: `/projects/category/${category.slug}` })
  }
  breadcrumbs.push({ name: project.title, href: `/projects/${project.slug}` })

  return (
    <>
      <section className="relative isolate flex min-h-[85svh] flex-col justify-end overflow-hidden bg-ink-950">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : null}
        <div aria-hidden="true" className="media-scrim absolute inset-0" />

        <Container className="relative pt-36 pb-16">
          <Breadcrumbs locale={typedLocale} items={breadcrumbs} />
          <h1 className="mt-10 max-w-4xl text-[clamp(2.25rem,6.5vw,5.5rem)] leading-[1.02]">
            <RevealLines lines={[project.title]} />
          </h1>
          {project.summary ? (
            <p className="mt-6 max-w-xl text-lg text-ink-200">{project.summary}</p>
          ) : null}
        </Container>
      </section>

      {/* Facts rail: the four things a visitor checks before reading anything. */}
      {facts.length ? (
        <div className="border-b border-white/10 bg-ink-900">
          <Container>
            <dl className="grid grid-cols-2 divide-white/10 md:grid-cols-4 md:divide-x rtl:md:divide-x-reverse">
              {facts.map((fact) => (
                <div key={fact.label} className="py-7 md:px-8 md:first:ps-0 md:last:pe-0">
                  <dt className="label-mono">{fact.label}</dt>
                  <dd className="mt-2 text-lg text-ink-50">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </div>
      ) : null}

      <Section>
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-24">
          <Reveal>{project.description ? <RichText data={project.description} /> : null}</Reveal>

          {project.technicalInfo?.length ? (
            <Reveal delay={0.1}>
              <section className="lg:sticky lg:top-28 lg:self-start">
                <h2 className="label-mono mb-6 text-ember-400">{t('technicalInfo')}</h2>
                <SpecTable
                  rows={project.technicalInfo.map((row) => ({
                    label: row.label,
                    value: row.value,
                  }))}
                  labels={{
                    property: tProducts('property'),
                    value: tProducts('value'),
                    unit: tProducts('unit'),
                  }}
                />
              </section>
            </Reveal>
          ) : null}
        </div>
      </Section>

      {galleryImages.length ? (
        <Section tone="raised" className="border-y border-white/10">
          <SectionHead index="02" label={tProducts('gallery')} title={tProducts('gallery')} />
          <Gallery images={galleryImages} label={tProducts('gallery')} />
        </Section>
      ) : null}

      {productsUsed.length ? (
        <Section>
          <SectionHead index="03" label={t('productsUsed')} title={t('productsUsed')} />
          <ProductGrid products={productsUsed} />
        </Section>
      ) : null}
    </>
  )
}
