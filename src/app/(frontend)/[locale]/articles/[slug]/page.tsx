import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/config'
import { buildMetadata } from '@/lib/seo/metadata'
import { articleJsonLd } from '@/lib/seo/jsonLd'
import {
  getArticleBySlug,
  getArticles,
  getPublishedSlugs,
  getSiteSettings,
} from '@/lib/cms/queries'
import { ogImageUrl, resolveMedia } from '@/lib/cms/media'
import { Container } from '@/components/ui/Container'
import { Section, SectionHead } from '@/components/ui/Section'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { RichText } from '@/components/shared/RichText'
import { JsonLd } from '@/components/shared/JsonLd'
import { Tag } from '@/components/ui/Tag'
import { RevealLines } from '@/components/motion/Reveal'
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
        <Container className="pt-36 pb-12 md:pt-44">
          <Breadcrumbs locale={typedLocale} items={breadcrumbs} />

          <header className="mt-10 max-w-4xl">
            {category ? <p className="label-mono text-ember-400">{category.title}</p> : null}

            <h1 className="mt-5 text-[clamp(2rem,5.5vw,4.5rem)] leading-[1.04]">
              <RevealLines lines={[article.title]} />
            </h1>

            {article.excerpt ? (
              <p className="mt-8 max-w-2xl text-xl text-ink-300">{article.excerpt}</p>
            ) : null}

            {/* One mono line rather than a labelled table: three short facts
                do not need three headings. */}
            <p className="rule-hairline label-mono mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 pt-5">
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
            </p>
          </header>
        </Container>

        {cover ? (
          <div className="relative aspect-21/9 w-full overflow-hidden bg-ink-800">
            <Image
              src={cover.url}
              alt={cover.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <Container className="py-section">
          {/* Measure capped well below the container: long-form Persian is
              unreadable at the full width this layout otherwise uses. */}
          <div className="mx-auto max-w-2xl">
            <RichText data={article.content} />

            {article.tags?.length ? (
              <div className="rule-hairline mt-14 flex flex-wrap items-center gap-2 pt-6">
                <span className="label-mono me-2">{t('tags')}</span>
                {article.tags.map((tag) => (
                  <Tag key={tag.id ?? tag.label}>{tag.label}</Tag>
                ))}
              </div>
            ) : null}
          </div>
        </Container>
      </article>

      {related.docs.length ? (
        <Section tone="raised" className="border-t border-white/10">
          <SectionHead index="06" label={t('related')} title={t('related')} />
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
