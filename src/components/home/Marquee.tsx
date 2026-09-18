import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/lib/i18n/config'

/**
 * A slow band of credentials under the hero.
 *
 * Rendered twice, side by side, and translated by exactly -50%, so the loop is
 * seamless with no JavaScript. It stops entirely under
 * `prefers-reduced-motion` (see the `marquee-track` utility).
 */
export async function Marquee({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Home' })

  const items = [
    'ISO 9001',
    t('statCapacity'),
    'EN 771-1',
    t('qualityTitle'),
    'ASTM C67',
    t('statProjects'),
    'ISO 14001',
    t('sustainabilityTitle'),
  ]

  const run = (key: string) => (
    <ul className="flex shrink-0 items-center" aria-hidden={key === 'clone'}>
      {items.map((item, index) => (
        <li key={`${key}-${index}`} className="flex items-center whitespace-nowrap">
          <span className="label-mono px-8 text-ink-300">{item}</span>
          <span aria-hidden="true" className="text-ember-500">
            ◆
          </span>
        </li>
      ))}
    </ul>
  )

  return (
    <div className="overflow-hidden border-b border-white/10 bg-ink-900 py-4">
      {/* `w-max` keeps both copies on one line so the -50% shift lands exactly
          on the start of the duplicate. */}
      <div className="marquee-track flex w-max">
        {run('a')}
        {run('clone')}
      </div>
    </div>
  )
}
