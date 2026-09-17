import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/lib/i18n/config'
import { getProductCategories, getProducts } from '@/lib/cms/queries'
import { PageHeader } from '@/components/shared/PageHeader'
import { Section } from '@/components/ui/Section'
import { CategoryFilter } from '@/components/shared/CategoryFilter'
import { EmptyState } from '@/components/shared/EmptyState'
import { Pagination } from '@/components/shared/Pagination'
import { ProductGrid } from './ProductGrid'

const PER_PAGE = 12

/**
 * Shared by `/products` and `/products/category/[slug]`. Both are the same
 * view with a different filter, so they are the same component.
 */
export async function ProductsListing({
  locale,
  categorySlug,
  page,
}: {
  locale: Locale
  categorySlug?: string
  page: number
}) {
  const [t, tNav, categories] = await Promise.all([
    getTranslations({ locale, namespace: 'Products' }),
    getTranslations({ locale, namespace: 'Nav' }),
    getProductCategories(locale),
  ])

  const result = await getProducts(locale, { categorySlug, page, limit: PER_PAGE })
  const activeCategory = categories.find((category) => category.slug === categorySlug)

  const basePath = categorySlug ? `/products/category/${categorySlug}` : '/products'

  const breadcrumbs = [{ name: tNav('products'), href: '/products' }]
  if (activeCategory) {
    breadcrumbs.push({ name: activeCategory.title, href: basePath })
  }

  return (
    <>
      <PageHeader
        locale={locale}
        title={activeCategory?.title ?? t('title')}
        subtitle={activeCategory?.description ?? t('subtitle')}
        breadcrumbs={breadcrumbs}
      >
        <CategoryFilter
          label={t('categories')}
          options={[
            { label: t('allCategories'), href: '/products', active: !categorySlug },
            ...categories.map((category) => ({
              label: category.title,
              href: `/products/category/${category.slug}`,
              active: category.slug === categorySlug,
            })),
          ]}
        />
      </PageHeader>

      <Section>
        {result.docs.length ? (
          <>
            <ProductGrid products={result.docs} priorityCount={3} />
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
