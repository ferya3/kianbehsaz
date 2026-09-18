import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/lib/i18n/config'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { RevealLines } from '@/components/motion/Reveal'

/**
 * The page's one bright surface.
 *
 * Ember is used exactly twice on the homepage — the kiln in the hero and this
 * block — so arriving here reads as the end of the argument rather than as one
 * more section.
 */
export async function CtaBanner({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Home' })

  return (
    <section className="bg-ember-600 py-section text-white">
      <Container>
        <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="label-mono text-white/70">06</span>
            <h2 className="mt-6 text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.02] text-white">
              <RevealLines lines={[t('ctaTitle')]} />
            </h2>
            <p className="mt-6 max-w-xl text-lg text-white/80">{t('ctaBody')}</p>
          </div>

          <Button
            href="/contact"
            size="lg"
            className="bg-ink-950 text-white hover:bg-ink-900 focus-visible:outline-white"
          >
            {t('ctaButton')}
          </Button>
        </div>
      </Container>
    </section>
  )
}
