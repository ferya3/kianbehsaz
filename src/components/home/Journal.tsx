import Image from 'next/image'
import { getFormatter, getTranslations } from 'next-intl/server'
import type { Article } from '@/payload-types'
import type { Locale } from '@/lib/i18n/config'
import { Link } from '@/lib/i18n/navigation'
import { resolveMedia } from '@/lib/cms/media'
import { Container } from '@/components/ui/Container'
import { ArrowLink } from '@/components/ui/Button'
import { Reveal } from '@/components/motion/Reveal'

/**
 * The knowledge base, set as a journal: the newest piece large, the rest as a
 * list beside it. An even grid of three would say all three matter equally,
 * which is never true of a publication.
 */
export async function Journal({
  locale,
  articles,
}: {
  locale: Locale
  articles: Article[]
}) {
  const [t, tCommon, format] = await Promise.all([
    getTranslations({ locale, namespace: 'Home' }),
    getTranslations({ locale, namespace: 'Common' }),
    getFormatter({ locale }),
  ])

  if (!articles.length) return null

  const [lead, ...rest] = articles
  const leadImage = resolveMedia(lead!.coverImage, 'wide')

  const dateOf = (value?: string | null) =>
    value ? format.dateTime(new Date(value), { dateStyle: 'medium' }) : null

  return (
    <section className="bg-ink-950 py-section">
      <Container>
        <div className="rule-hairline flex items-baseline gap-4 pt-4">
          <span className="label-mono text-ember-400">05</span>
          <span className="label-mono">{t('articlesEyebrow')}</span>
        </div>

        <div className="mt-8 mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-2xl text-[clamp(2rem,4.4vw,3.75rem)]">{t('articlesTitle')}</h2>
          <ArrowLink href="/articles">{tCommon('viewAll')}</ArrowLink>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-20">
          <Reveal>
            <Link href={`/articles/${lead!.slug}`} className="group block">
              <div className="relative aspect-16/10 overflow-hidden bg-ink-800">
                {leadImage ? (
                  <Image
                    src={leadImage.url}
                    alt={leadImage.alt}
                    fill
                    sizes="(min-width: 1024px) 55vw, 92vw"
                    className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
                  />
                ) : null}
              </div>

              <p className="label-mono mt-6">{dateOf(lead!.publishedAt)}</p>
              <h3 className="mt-3 text-3xl leading-tight font-semibold text-ink-100 transition-colors group-hover:text-ink-50">
                {lead!.title}
              </h3>
              {lead!.excerpt ? (
                <p className="mt-4 max-w-xl text-ink-400">{lead!.excerpt}</p>
              ) : null}
            </Link>
          </Reveal>

          <ul className="lg:pt-4">
            {rest.map((article, index) => (
              <li key={article.id} className="rule-hairline">
                <Reveal delay={0.08 + index * 0.06}>
                  <Link href={`/articles/${article.slug}`} className="group block py-7">
                    <p className="label-mono">{dateOf(article.publishedAt)}</p>
                    <h3 className="mt-3 text-xl leading-snug font-semibold text-ink-200 transition-colors group-hover:text-ink-50">
                      {article.title}
                    </h3>
                    {article.excerpt ? (
                      <p className="mt-2 line-clamp-2 text-sm text-ink-500">{article.excerpt}</p>
                    ) : null}
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
