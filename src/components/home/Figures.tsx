import { getTranslations } from 'next-intl/server'
import type { SiteSetting } from '@/payload-types'
import type { Locale } from '@/lib/i18n/config'
import { Container } from '@/components/ui/Container'
import { CountUp } from '@/components/motion/CountUp'
import { Reveal } from '@/components/motion/Reveal'

/**
 * Four figures, each on its own hairline, counting up as they arrive.
 *
 * No cards and no boxes: the numbers are large enough to be the structure.
 */
export async function Figures({
  locale,
  settings,
}: {
  locale: Locale
  settings: SiteSetting | null
}) {
  const t = await getTranslations({ locale, namespace: 'Home' })

  const stats =
    settings?.stats?.length === 4
      ? settings.stats.map((stat) => ({ value: stat.value, label: stat.label }))
      : [
          { value: '20+', label: t('statYears') },
          { value: '450+', label: t('statProjects') },
          { value: '120k', label: t('statCapacity') },
          { value: '80+', label: t('statClients') },
        ]

  return (
    <section className="border-y border-white/10 bg-ink-900 py-20 md:py-28">
      <Container>
        <h2 className="sr-only">{t('statsTitle')}</h2>

        <dl className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08}>
              <div className="rule-hairline pt-5">
                <dd
                  dir="ltr"
                  className="font-display text-[clamp(2.75rem,6vw,4.5rem)] leading-none font-semibold text-ink-50 tabular"
                >
                  <CountUp value={stat.value} />
                </dd>
                <dt className="mt-4 text-sm text-ink-400">{stat.label}</dt>
              </div>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  )
}
