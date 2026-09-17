import { getFormatter, getTranslations } from 'next-intl/server'
import type { Article } from '@/payload-types'
import type { Locale } from '@/lib/i18n/config'
import { resolveMedia } from '@/lib/cms/media'
import { MediaCard } from '@/components/ui/Card'

export async function ArticleGrid({
  locale,
  articles,
  priorityCount = 0,
}: {
  locale: Locale
  articles: Article[]
  priorityCount?: number
}) {
  const [t, format] = await Promise.all([
    getTranslations({ locale, namespace: 'Articles' }),
    getFormatter({ locale }),
  ])

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, index) => {
        const image = resolveMedia(article.coverImage, 'card')
        const category =
          article.category && typeof article.category === 'object' ? article.category.title : null

        const parts: string[] = []
        if (article.publishedAt) {
          // next-intl formats Persian and Arabic dates with the right calendar
          // and numerals for each locale.
          parts.push(format.dateTime(new Date(article.publishedAt), { dateStyle: 'medium' }))
        }
        if (article.readingMinutes) {
          parts.push(t('readingTime', { minutes: article.readingMinutes }))
        }

        return (
          <li key={article.id}>
            <MediaCard
              href={`/articles/${article.slug}`}
              title={article.title}
              description={article.excerpt}
              imageUrl={image?.url}
              imageAlt={image?.alt}
              badge={category}
              meta={parts.join(' · ') || undefined}
              priority={index < priorityCount}
            />
          </li>
        )
      })}
    </ul>
  )
}
