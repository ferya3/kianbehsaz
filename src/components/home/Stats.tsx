import { getTranslations } from 'next-intl/server'
import type { SiteSetting } from '@/payload-types'
import type { Locale } from '@/lib/i18n/config'
import { Section } from '@/components/ui/Section'

export async function Stats({
  locale,
  settings,
}: {
  locale: Locale
  settings: SiteSetting | null
}) {
  const t = await getTranslations({ locale, namespace: 'Home' })

  // Editable in the CMS; the defaults keep the section from collapsing before
  // anyone has filled it in.
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
    <Section tone="inverse" size="md">
      <h2 className="sr-only">{t('statsTitle')}</h2>
      <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="border-t border-white/15 pt-6">
            <dt className="text-sm text-brand-300">{stat.label}</dt>
            <dd className="mt-2 font-display text-4xl font-semibold text-white md:text-5xl">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
