import { useTranslations } from 'next-intl'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

export default function LocaleNotFound() {
  const t = useTranslations('NotFound')

  return (
    <Container className="flex min-h-[80svh] flex-col justify-center py-32">
      <p dir="ltr" className="font-display text-[clamp(5rem,20vw,16rem)] leading-none font-semibold text-ink-800">
        404
      </p>
      <h1 className="mt-8 text-[clamp(1.75rem,4vw,3rem)]">{t('title')}</h1>
      <p className="mt-5 max-w-md text-ink-400">{t('body')}</p>
      <div className="mt-12">
        <Button href="/" size="lg">
          {t('cta')}
        </Button>
      </div>
    </Container>
  )
}
