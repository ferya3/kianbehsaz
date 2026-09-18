import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/lib/i18n/config'
import { Container } from '@/components/ui/Container'
import { ArrowLink } from '@/components/ui/Button'
import { Reveal } from '@/components/motion/Reveal'

/**
 * The four quality-control steps, as a numbered sequence.
 *
 * Each step is a column under a hairline with its number set at display size:
 * the page's one moment of pure structure, between two image-heavy sections.
 */
export async function Process({ locale }: { locale: Locale }) {
  const [t, tQuality, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: 'Home' }),
    getTranslations({ locale, namespace: 'Quality' }),
    getTranslations({ locale, namespace: 'Common' }),
  ])

  const steps = [
    { title: tQuality('step1'), body: tQuality('step1Body') },
    { title: tQuality('step2'), body: tQuality('step2Body') },
    { title: tQuality('step3'), body: tQuality('step3Body') },
    { title: tQuality('step4'), body: tQuality('step4Body') },
  ]

  return (
    <section className="border-y border-white/10 bg-ink-900 py-section">
      <Container>
        <div className="rule-hairline flex items-baseline gap-4 pt-4">
          <span className="label-mono text-ember-400">04</span>
          <span className="label-mono">{t('qualityEyebrow')}</span>
        </div>

        <div className="mt-8 mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-2xl text-[clamp(2rem,4.4vw,3.75rem)]">
            {tQuality('processTitle')}
          </h2>
          <ArrowLink href="/quality">{tCommon('readMore')}</ArrowLink>
        </div>

        <ol className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.07}>
              <li className="rule-hairline pt-6">
                <span
                  dir="ltr"
                  className="font-display text-5xl leading-none font-semibold text-ink-700"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-6 text-lg font-semibold text-ink-50">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-400">{step.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  )
}
