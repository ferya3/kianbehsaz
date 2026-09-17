import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { HomePage } from '@/payload-types'
import type { Locale } from '@/lib/i18n/config'
import { resolveMedia } from '@/lib/cms/media'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

/**
 * The hero decides the site's LCP, so the rules here are deliberate:
 *
 *  - the mobile image is a separate, smaller asset — never a video;
 *  - the image is `priority` and carries explicit `sizes`;
 *  - the text is server-rendered and never animated in.
 */
export async function Hero({
  locale,
  home,
}: {
  locale: Locale
  home: HomePage | null
}) {
  const t = await getTranslations({ locale, namespace: 'Home' })

  const hero = home?.hero
  const desktop = resolveMedia(hero?.desktopMedia, 'wide')
  const mobile = resolveMedia(hero?.mobileImage, 'card') ?? desktop
  const isVideo =
    hero?.desktopMedia &&
    typeof hero.desktopMedia === 'object' &&
    hero.desktopMedia.mimeType?.startsWith('video/')

  const title = hero?.title || t('heroTitle')
  const subtitle = hero?.subtitle || t('heroSubtitle')
  const overlay = Math.min(Math.max(hero?.overlayOpacity ?? 55, 0), 100) / 100

  const primaryLabel = hero?.primaryCta?.label || t('heroCtaPrimary')
  const primaryHref = hero?.primaryCta?.href || '/products'
  const secondaryLabel = hero?.secondaryCta?.label || t('heroCtaSecondary')
  const secondaryHref = hero?.secondaryCta?.href || '/contact'

  return (
    <section className="relative isolate flex min-h-[32rem] items-center overflow-hidden bg-brand-950 md:min-h-[38rem]">
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

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/70 to-transparent"
        style={{ opacity: overlay }}
      />

      <Container className="relative py-20 md:py-28">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-semibold text-white md:text-6xl">{title}</h1>
          <p className="mt-6 text-lg text-brand-200 md:text-xl">{subtitle}</p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button href={primaryHref} size="lg">
              {primaryLabel}
            </Button>
            <Button href={secondaryHref} size="lg" variant="inverse">
              {secondaryLabel}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
