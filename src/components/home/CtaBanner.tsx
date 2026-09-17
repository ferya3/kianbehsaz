import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/lib/i18n/config'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'

export async function CtaBanner({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Home' })

  return (
    <Section tone="inverse">
      <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">{t('ctaTitle')}</h2>
          <p className="mt-4 text-lg text-brand-300">{t('ctaBody')}</p>
        </div>
        <Button href="/contact" size="lg">
          {t('ctaButton')}
        </Button>
      </div>
    </Section>
  )
}
