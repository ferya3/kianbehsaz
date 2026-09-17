import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/lib/i18n/config'
import { getProjectCategories, getProjects } from '@/lib/cms/queries'
import { PageHeader } from '@/components/shared/PageHeader'
import { Section } from '@/components/ui/Section'
import { CategoryFilter } from '@/components/shared/CategoryFilter'
import { EmptyState } from '@/components/shared/EmptyState'
import { Pagination } from '@/components/shared/Pagination'
import { ProjectGrid } from './ProjectGrid'

const PER_PAGE = 12

export async function ProjectsListing({
  locale,
  categorySlug,
  page,
}: {
  locale: Locale
  categorySlug?: string
  page: number
}) {
  const [t, tNav, categories] = await Promise.all([
    getTranslations({ locale, namespace: 'Projects' }),
    getTranslations({ locale, namespace: 'Nav' }),
    getProjectCategories(locale),
  ])

  const result = await getProjects(locale, { categorySlug, page, limit: PER_PAGE })
  const activeCategory = categories.find((category) => category.slug === categorySlug)
  const basePath = categorySlug ? `/projects/category/${categorySlug}` : '/projects'

  const breadcrumbs = [{ name: tNav('projects'), href: '/projects' }]
  if (activeCategory) breadcrumbs.push({ name: activeCategory.title, href: basePath })

  return (
    <>
      <PageHeader
        locale={locale}
        title={activeCategory?.title ?? t('title')}
        subtitle={activeCategory?.description ?? t('subtitle')}
        breadcrumbs={breadcrumbs}
      >
        <CategoryFilter
          label={t('category')}
          options={[
            { label: t('allCategories'), href: '/projects', active: !categorySlug },
            ...categories.map((category) => ({
              label: category.title,
              href: `/projects/category/${category.slug}`,
              active: category.slug === categorySlug,
            })),
          ]}
        />
      </PageHeader>

      <Section>
        {result.docs.length ? (
          <>
            <ProjectGrid projects={result.docs} priorityCount={3} />
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
