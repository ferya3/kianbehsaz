import Image from 'next/image'
import { getFormatter, getTranslations } from 'next-intl/server'
import type { Article } from '@/payload-types'
import type { Locale } from '@/lib/i18n/config'
import { Link } from '@/lib/i18n/navigation'
import { resolveMedia } from '@/lib/cms/media'
import { Reveal } from '@/components/motion/Reveal'

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
    <ul className="grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, index) => {
        const image = resolveMedia(article.coverImage, 'card')
        const category =
          article.category && typeof article.category === 'object' ? article.category.title : null

        const meta = [
          article.publishedAt
            ? format.dateTime(new Date(article.publishedAt), { dateStyle: 'medium' })
            : null,
          article.readingMinutes ? t('readingTime', { minutes: article.readingMinutes }) : null,
        ].filter(Boolean)

        return (
          <li key={article.id}>
            <Reveal delay={(index % 3) * 0.07}>
              <Link href={`/articles/${article.slug}`} className="group block">
                <div className="relative aspect-16/10 overflow-hidden bg-ink-800">
                  {image ? (
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 1024px) 31vw, (min-width: 768px) 46vw, 92vw"
                      priority={index < priorityCount}
                      className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                    />
                  ) : null}
                </div>

                <p className="label-mono mt-5">
                  {category ? <span className="text-ember-400">{category} · </span> : null}
                  {meta.join(' · ')}
                </p>

                <h3 className="mt-3 text-xl leading-snug font-semibold text-ink-100 transition-colors group-hover:text-ink-50">
                  {article.title}
                </h3>

                {article.excerpt ? (
                  <p className="mt-3 line-clamp-3 text-sm text-ink-400">{article.excerpt}</p>
                ) : null}
              </Link>
            </Reveal>
          </li>
        )
      })}
    </ul>
  )
}
