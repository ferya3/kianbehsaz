import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/lib/i18n/config'
import { getArticleCategories, getArticles } from '@/lib/cms/queries'
import { PageHero } from '@/components/shared/PageHero'
import { Section } from '@/components/ui/Section'
import { CategoryFilter } from '@/components/shared/CategoryFilter'
import { EmptyState } from '@/components/shared/EmptyState'
import { Pagination } from '@/components/shared/Pagination'
import { ArticleGrid } from './ArticleGrid'

const PER_PAGE = 9

export async function ArticlesListing({
  locale,
  categorySlug,
  page,
}: {
  locale: Locale
  categorySlug?: string
  page: number
}) {
  const [t, tNav, categories] = await Promise.all([
    getTranslations({ locale, namespace: 'Articles' }),
    getTranslations({ locale, namespace: 'Nav' }),
    getArticleCategories(locale),
  ])

  const result = await getArticles(locale, { categorySlug, page, limit: PER_PAGE })
  const activeCategory = categories.find((category) => category.slug === categorySlug)
  const basePath = categorySlug ? `/articles/category/${categorySlug}` : '/articles'

  const breadcrumbs = [{ name: tNav('articles'), href: '/articles' }]
  if (activeCategory) breadcrumbs.push({ name: activeCategory.title, href: basePath })

  return (
    <>
      <PageHero
        locale={locale}
        index="05"
        title={activeCategory?.title ?? t('title')}
        subtitle={activeCategory?.description ?? t('subtitle')}
        breadcrumbs={breadcrumbs}
      >
        <CategoryFilter
          label={t('allCategories')}
          options={[
            { label: t('allCategories'), href: '/articles', active: !categorySlug },
            ...categories.map((category) => ({
              label: category.title,
              href: `/articles/category/${category.slug}`,
              active: category.slug === categorySlug,
            })),
          ]}
        />
      </PageHero>

      <Section>
        {result.docs.length ? (
          <>
            <ArticleGrid locale={locale} articles={result.docs} priorityCount={3} />
            <Pagination
              locale={locale}
              basePath={basePath}
              page={result.page}
              totalPages={result.totalPages}
            />
          </>
        ) : (
          <EmptyState message={t('empty')} />
        )}
      </Section>
    </>
  )
}
