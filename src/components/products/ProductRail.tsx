import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Product } from '@/payload-types'
import type { Locale } from '@/lib/i18n/config'
import { Link } from '@/lib/i18n/navigation'
import { resolveMedia } from '@/lib/cms/media'
import { Container } from '@/components/ui/Container'
import { ArrowLink } from '@/components/ui/Button'

/**
 * Products as a horizontal rail that runs off the edge of the viewport.
 *
 * A grid of three cards says "here is everything". A rail that continues past
 * the right edge says "there is more", and it lets each product be a tall
 * portrait frame instead of a squat card. Scroll snapping keeps it usable with
 * a trackpad, a touch screen or the keyboard — it is a plain scroll container,
 * so no JavaScript is involved.
 */
export async function ProductRail({
  locale,
  products,
}: {
  locale: Locale
  products: Product[]
}) {
  const [t, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: 'Home' }),
    getTranslations({ locale, namespace: 'Common' }),
  ])

  if (!products.length) return null

  return (
    <section className="bg-ink-950 py-section">
      <Container>
        <div className="rule-hairline flex items-baseline gap-4 pt-4">
          <span className="label-mono text-ember-400">02</span>
          <span className="label-mono">{t('productsEyebrow')}</span>
        </div>

        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-2xl text-[clamp(2rem,4.4vw,3.75rem)]">{t('productsTitle')}</h2>
          <ArrowLink href="/products">{tCommon('viewAll')}</ArrowLink>
        </div>
      </Container>

      {/* Bleeds to the edge: the container's inline padding becomes the rail's
          lead-in, and the last card can sit half off-screen. */}
      <div className="mt-14 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul className="flex w-max snap-x snap-mandatory gap-5 px-5 md:px-10 xl:px-16">
          {products.map((product, index) => {
            const image = resolveMedia(product.coverImage, 'card')
            const category =
              typeof product.category === 'object' ? product.category.title : null
            const spec = product.specifications?.[0]

            return (
              <li key={product.id} className="w-[78vw] shrink-0 snap-start sm:w-[44vw] lg:w-[30vw]">
                <Link href={`/products/${product.slug}`} className="group block">
                  <div className="relative aspect-3/4 overflow-hidden bg-ink-800">
                    {image ? (
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 44vw, 78vw"
                        className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                      />
                    ) : null}

                    <div
                      aria-hidden="true"
                      className="media-scrim absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-90"
                    />

                    <span className="label-mono absolute top-5 start-5 text-ink-200">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <div className="absolute inset-x-0 bottom-0 p-6">
                      {category ? (
                        <span className="label-mono text-ember-300">{category}</span>
                      ) : null}
                      <h3 className="mt-2 text-2xl font-semibold text-ink-50">{product.title}</h3>

                      {spec ? (
                        <p className="mt-3 flex items-baseline gap-2 border-t border-white/15 pt-3">
                          <span dir="ltr" className="font-mono text-lg text-ink-100">
                            {spec.value}
                            {spec.unit ? ` ${spec.unit}` : ''}
                          </span>
                          <span className="text-xs text-ink-400">{spec.label}</span>
                        </p>
                      ) : null}
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
