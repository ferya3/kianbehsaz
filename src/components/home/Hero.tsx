import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { HomePage, Product } from '@/payload-types'
import type { Locale } from '@/lib/i18n/config'
import { resolveMedia } from '@/lib/cms/media'
import { Container } from '@/components/ui/Container'
import { Button, ArrowLink } from '@/components/ui/Button'
import { RevealLines } from '@/components/motion/Reveal'
import { splitDisplayLines } from '@/lib/utils/text'

/**
 * Full-viewport opening frame.
 *
 * The rules here are deliberate, because this is the site's LCP:
 *  - separate desktop and mobile assets; the mobile one is never a video;
 *  - the image is `priority` with explicit `sizes`;
 *  - the headline is server-rendered and only masked-in by CSS transform, so
 *    no layout or paint work blocks the largest element.
 *
 * The strip along the bottom carries real figures pulled from the products
 * themselves — the first thing an engineer scanning the page wants.
 */
export async function Hero({
  locale,
  home,
  products,
}: {
  locale: Locale
  home: HomePage | null
  products: Product[]
}) {
  const t = await getTranslations({ locale, namespace: 'Home' })
  const tCommon = await getTranslations({ locale, namespace: 'Common' })

  const hero = home?.hero
  const desktop = resolveMedia(hero?.desktopMedia, 'wide')
  const mobile = resolveMedia(hero?.mobileImage, 'card') ?? desktop
  const isVideo =
    hero?.desktopMedia &&
    typeof hero.desktopMedia === 'object' &&
    hero.desktopMedia.mimeType?.startsWith('video/')

  const title = hero?.title || t('heroTitle')
  const subtitle = hero?.subtitle || t('heroSubtitle')
  const overlay = Math.min(Math.max(hero?.overlayOpacity ?? 40, 0), 100) / 100

  const primaryLabel = hero?.primaryCta?.label || t('heroCtaPrimary')
  const primaryHref = hero?.primaryCta?.href || '/products'
  const secondaryLabel = hero?.secondaryCta?.label || t('heroCtaSecondary')
  const secondaryHref = hero?.secondaryCta?.href || '/contact'

  // Break points are chosen rather than left to CSS: the mask reveal needs
  // discrete lines, and a display-size headline must not break after a
  // particle. See splitDisplayLines.
  const lines = splitDisplayLines(title, 17)

  // One headline figure per product: the number an engineer scans for.
  const figures = products.slice(0, 3).map((product) => {
    const spec = product.specifications?.[0]
    return {
      id: product.id,
      label: product.title,
      value: spec ? `${spec.value}${spec.unit ? ` ${spec.unit}` : ''}` : '—',
      caption: spec?.label ?? '',
    }
  })

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink-950">
      {isVideo && desktop ? (
        <video
          className="absolute inset-0 hidden h-full w-full object-cover md:block"
          autoPlay
          muted
          loop
          playsInline
          poster={mobile?.url}
        >
          <source src={desktop.url} type="video/mp4" />
        </video>
      ) : desktop ? (
        <Image
          src={desktop.url}
          alt={desktop.alt}
          fill
          priority
          sizes="100vw"
          className="hidden object-cover md:block"
        />
      ) : null}

      {mobile ? (
        <Image
          src={mobile.url}
          alt={mobile.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover md:hidden"
        />
      ) : null}

      {/* Two scrims rather than one flat dim: the first grounds the bottom of
          the frame, the second darkens the side the text reads from — so the
          headline sits in shadow while the far edge of the image stays lit. */}
      <div aria-hidden="true" className="media-scrim absolute inset-0" style={{ opacity: overlay }} />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/35 to-transparent rtl:bg-gradient-to-l"
      />

      <Container className="relative pt-40 pb-12">
        <p className="label-mono mb-8 text-ember-400">
          {t('introEyebrow')} — <span dir="ltr">EST. 1998</span>
        </p>

        <h1 className="max-w-5xl text-[clamp(2.75rem,8vw,7rem)] leading-[0.98] font-semibold">
          <RevealLines lines={lines} />
        </h1>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-lg text-lg text-ink-200 md:text-xl">{subtitle}</p>

          <div className="flex flex-wrap items-center gap-6">
            <Button href={primaryHref} size="lg">
              {primaryLabel}
            </Button>
            <ArrowLink href={secondaryHref}>{secondaryLabel}</ArrowLink>
          </div>
        </div>
      </Container>

      {/* Figures strip: the page's first hard data, before any scrolling. */}
      {figures.length ? (
        <div className="relative border-t border-white/10 bg-ink-950/50 backdrop-blur-sm">
          <Container>
            <dl className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0 rtl:sm:divide-x-reverse">
              {figures.map((figure) => (
                <div key={figure.id} className="py-5 sm:px-8 sm:first:ps-0 sm:last:pe-0">
                  <dt className="label-mono">{figure.label}</dt>
                  <dd className="mt-1 flex items-baseline gap-2">
                    <span dir="ltr" className="font-mono text-2xl text-ink-50">
                      {figure.value}
                    </span>
                    <span className="text-xs text-ink-400">{figure.caption}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Container>
        </div>
      ) : null}

      <span className="sr-only">{tCommon('skipToContent')}</span>
    </section>
  )
}
