import { useTranslations } from 'next-intl'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

export default function LocaleNotFound() {
  const t = useTranslations('NotFound')

  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-6xl font-semibold text-accent-500" dir="ltr">
        404
      </p>
      <h1 className="mt-6 text-3xl font-semibold text-brand-900">{t('title')}</h1>
      <p className="mt-4 max-w-md text-brand-600">{t('body')}</p>
      <Button href="/" className="mt-8">
        {t('cta')}
      </Button>
    </Container>
  )
}
