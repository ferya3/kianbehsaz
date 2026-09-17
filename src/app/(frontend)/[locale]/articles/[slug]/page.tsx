import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/config'
import { buildMetadata } from '@/lib/seo/metadata'
import { articleJsonLd } from '@/lib/seo/jsonLd'
import { getArticleBySlug, getArticles, getPublishedSlugs, getSiteSettings } from '@/lib/cms/queries'
import { ogImageUrl, resolveMedia } from '@/lib/cms/media'
import { Container } from '@/components/ui/Container'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { RichText } from '@/components/shared/RichText'
import { JsonLd } from '@/components/shared/JsonLd'
import { Badge } from '@/components/ui/Badge'
import { ArticleGrid } from '@/components/articles/ArticleGrid'

type Props = { params: Promise<{ locale: string; slug: string }> }

export const revalidate = 300

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs('articles')

  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) return {}

  const article = await getArticleBySlug(locale as Locale, slug)
  if (!article) return {}

  const tSite = await getTranslations({ locale, namespace: 'Site' })

  return buildMetadata({
    locale,
    path: `/articles/${slug}`,
    title: article.title,
    description: article.excerpt,
    image: ogImageUrl(article.seo?.image ?? article.coverImage),
    type: 'article',
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    overrides: article.seo,
    siteName: tSite('name'),
  })
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const typedLocale = locale as Locale
  const article = await getArticleBySlug(typedLocale, slug)
  if (!article) notFound()

  const [t, tNav, format, settings, related] = await Promise.all([
    getTranslations({ locale, namespace: 'Articles' }),
    getTranslations({ locale, namespace: 'Nav' }),
    getFormatter({ locale }),
    getSiteSettings(typedLocale),
    getArticles(typedLocale, { limit: 3, excludeId: article.id }),
  ])

  const cover = resolveMedia(article.coverImage, 'wide')
  const category = typeof article.category === 'object' ? article.category : null
  const author = typeof article.author === 'object' && article.author ? article.author.name : null

  const breadcrumbs = [{ name: tNav('articles'), href: '/articles' }]
  if (category) {
    breadcrumbs.push({ name: category.title, href: `/articles/category/${category.slug}` })
  }
  breadcrumbs.push({ name: article.title, href: `/articles/${article.slug}` })

  return (
    <>
      <article>
        <Container className="py-12 md:py-16">
          <Breadcrumbs locale={typedLocale} items={breadcrumbs} />

          <header className="mx-auto mt-6 max-w-3xl">
            {category ? <Badge tone="accent">{category.title}</Badge> : null}
            <h1 className="mt-4 text-3xl font-semibold text-brand-900 md:text-5xl">
              {article.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-brand-500">
              {article.publishedAt ? (
                <time dateTime={article.publishedAt}>
                  {t('publishedOn', {
                    date: format.dateTime(new Date(article.publishedAt), { dateStyle: 'long' }),
                  })}
                </time>
              ) : null}
              {author ? (
                <span>
                  {t('author')}: {author}
                </span>
              ) : null}
              {article.readingMinutes ? (
                <span>{t('readingTime', { minutes: article.readingMinutes })}</span>
              ) : null}
            </div>

            {article.excerpt ? (
              <p className="mt-6 text-lg text-brand-600">{article.excerpt}</p>
            ) : null}
          </header>

          {cover ? (
            <div className="relative mx-auto mt-10 aspect-16/9 max-w-4xl overflow-hidden rounded-card bg-brand-100">
              <Image
                src={cover.url}
                alt={cover.alt}
                fill
                priority
                sizes="(min-width: 1024px) 56rem, 92vw"
                className="object-cover"
              />
            </div>
          ) : null}

          <div className="mx-auto mt-12 max-w-3xl">
            <RichText data={article.content} />

            {article.tags?.length ? (
              <div className="mt-10 flex flex-wrap items-center gap-2">
                <span className="text-sm text-brand-500">{t('tags')}:</span>
                {article.tags.map((tag) => (
                  <Badge key={tag.id ?? tag.label}>{tag.label}</Badge>
                ))}
              </div>
            ) : null}
          </div>
        </Container>
      </article>

      {related.docs.length ? (
        <Section tone="muted">
          <SectionHeader title={t('related')} />
          <ArticleGrid locale={typedLocale} articles={related.docs} />
        </Section>
      ) : null}

      <JsonLd
        data={articleJsonLd({
          headline: article.title,
          description: article.excerpt,
          image: cover?.url,
          url: `/${locale}/articles/${article.slug}`,
          publishedTime: article.publishedAt,
          modifiedTime: article.updatedAt,
          authorName: author,
          publisherName: settings?.siteName || 'Kian Behsaz',
          locale: typedLocale,
        })}
      />
    </>
  )
}
