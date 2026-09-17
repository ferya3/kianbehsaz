import type { Product } from '@/payload-types'
import { resolveMedia } from '@/lib/cms/media'
import { MediaCard } from '@/components/ui/Card'

export function ProductGrid({
  products,
  priorityCount = 0,
}: {
  products: Product[]
  /** Number of leading cards to mark `priority`, for above-the-fold grids. */
  priorityCount?: number
}) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => {
        const image = resolveMedia(product.coverImage, 'card')
        const category =
          product.category && typeof product.category === 'object' ? product.category.title : null

        return (
          <li key={product.id}>
            <MediaCard
              href={`/products/${product.slug}`}
              title={product.title}
              description={product.shortDescription}
              imageUrl={image?.url}
              imageAlt={image?.alt}
              badge={category}
              priority={index < priorityCount}
            />
          </li>
        )
      })}
    </ul>
  )
}
