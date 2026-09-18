import Image from 'next/image'
import type { Product } from '@/payload-types'
import { Link } from '@/lib/i18n/navigation'
import { resolveMedia } from '@/lib/cms/media'
import { Reveal } from '@/components/motion/Reveal'

/**
 * The listing counterpart to the homepage rail: the same tall portrait frame,
 * laid out in two columns so the products keep their scale instead of shrinking
 * into cards.
 */
export function ProductGrid({
  products,
  priorityCount = 0,
}: {
  products: Product[]
  /** Leading frames to mark `priority`, for above-the-fold rows. */
  priorityCount?: number
}) {
  return (
    <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2">
      {products.map((product, index) => {
        const image = resolveMedia(product.coverImage, 'card')
        const category =
          product.category && typeof product.category === 'object' ? product.category.title : null
        const spec = product.specifications?.[0]

        return (
          <li key={product.id}>
            <Reveal delay={(index % 2) * 0.08}>
              <Link href={`/products/${product.slug}`} className="group block">
                <div className="relative aspect-4/5 overflow-hidden bg-ink-800">
                  {image ? (
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 640px) 46vw, 92vw"
                      priority={index < priorityCount}
                      className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                    />
                  ) : null}

                  <div
                    aria-hidden="true"
                    className="media-scrim absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-85"
                  />

                  <span className="label-mono absolute top-6 start-6 text-ink-200">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="rule-hairline mt-6 flex items-start justify-between gap-6 pt-5">
                  <div>
                    {category ? <span className="label-mono">{category}</span> : null}
                    <h3 className="mt-2 text-2xl font-semibold text-ink-100 transition-colors group-hover:text-ink-50">
                      {product.title}
                    </h3>
                    {product.shortDescription ? (
                      <p className="mt-3 max-w-md text-sm text-ink-400">
                        {product.shortDescription}
                      </p>
                    ) : null}
                  </div>

                  {spec ? (
                    <p className="shrink-0 text-end">
                      <span dir="ltr" className="font-mono text-lg text-ink-100">
                        {spec.value}
                        {spec.unit ? ` ${spec.unit}` : ''}
                      </span>
                      <span className="mt-1 block text-xs text-ink-500">{spec.label}</span>
                    </p>
                  ) : null}
                </div>
              </Link>
            </Reveal>
          </li>
        )
      })}
    </ul>
  )
}
