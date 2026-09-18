import { getTranslations } from 'next-intl/server'
import type { HomePage } from '@/payload-types'
import type { Locale } from '@/lib/i18n/config'
import { resolveMedia } from '@/lib/cms/media'
import { Container } from '@/components/ui/Container'
import { ArrowLink } from '@/components/ui/Button'
import { Reveal, RevealLines } from '@/components/motion/Reveal'
import { ParallaxMedia } from '@/components/motion/ParallaxMedia'
import { splitDisplayLines } from '@/lib/utils/text'

/**
 * The company's argument, set as a statement rather than as a paragraph.
 *
 * Asymmetric on purpose: the text column sticks while the tall image scrolls
 * past it, so the two halves move at different speeds and the section reads as
 * one held thought instead of a row of equal boxes.
 */
export async function Manifesto({
  locale,
  home,
}: {
  locale: Locale
  home: HomePage | null
}) {
  const [t, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: 'Home' }),
    getTranslations({ locale, namespace: 'Common' }),
  ])

  const image = resolveMedia(home?.intro?.image, 'wide')
  const title = home?.intro?.title || t('introTitle')
  const body = home?.intro?.body || t('introBody')

  const lines = splitDisplayLines(title, 24)

  return (
    <section className="bg-ink-950 py-section">
      <Container>
        <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="rule-hairline flex items-baseline gap-4 pt-4">
              <span className="label-mono text-ember-400">01</span>
              <span className="label-mono">{t('introEyebrow')}</span>
            </div>

            <h2 className="mt-10 text-[clamp(2rem,4.2vw,3.5rem)] leading-[1.06]">
              <RevealLines lines={lines} />
            </h2>

            <Reveal delay={0.15}>
              <p className="mt-8 max-w-md text-lg text-ink-300">{body}</p>
              <div className="mt-10">
                <ArrowLink href="/about">{tCommon('readMore')}</ArrowLink>
              </div>
            </Reveal>
          </div>

          {image ? (
            <ParallaxMedia
              src={image.url}
              alt={image.alt}
              className="aspect-3/4 w-full lg:aspect-2/3"
              sizes="(min-width: 1024px) 45vw, 92vw"
            />
          ) : null}
        </div>
      </Container>
    </section>
  )
}
