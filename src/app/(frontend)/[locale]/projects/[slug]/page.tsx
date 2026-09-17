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
import { PageHeader } from '@/components/shared/PageHeader'
import { Section, SectionHeader } from '@/components/ui/Section'
import { RichText } from '@/components/shared/RichText'
import { Gallery } from '@/components/shared/Gallery'
import { SpecTable } from '@/components/shared/SpecTable'
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
      <PageHeader
        locale={typedLocale}
        title={project.title}
        subtitle={project.summary}
        breadcrumbs={breadcrumbs}
      />

      <Section>
        {cover ? (
          <div className="relative aspect-16/9 overflow-hidden rounded-card bg-brand-100">
            <Image
              src={cover.url}
              alt={cover.alt}
              fill
              priority
              sizes="(min-width: 1024px) 72rem, 92vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="mt-12 grid gap-12 lg:grid-cols-[3fr_2fr]">
          <div>{project.description ? <RichText data={project.description} /> : null}</div>

          <aside className="space-y-10">
            {facts.length ? (
              <dl className="divide-y divide-brand-100 rounded-card border border-brand-100">
                {facts.map((fact) => (
                  <div key={fact.label} className="flex justify-between gap-4 px-4 py-3 text-sm">
                    <dt className="text-brand-500">{fact.label}</dt>
                    <dd className="font-medium text-brand-800">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {project.technicalInfo?.length ? (
              <div>
                <h2 className="mb-4 text-xl font-semibold">{t('technicalInfo')}</h2>
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
              </div>
            ) : null}
          </aside>
        </div>
      </Section>

      {galleryImages.length ? (
        <Section tone="muted">
          <SectionHeader title={tProducts('gallery')} />
          <Gallery images={galleryImages} label={tProducts('gallery')} />
        </Section>
      ) : null}

      {productsUsed.length ? (
        <Section>
          <SectionHeader title={t('productsUsed')} />
          <ProductGrid products={productsUsed} />
        </Section>
      ) : null}
    </>
  )
}
