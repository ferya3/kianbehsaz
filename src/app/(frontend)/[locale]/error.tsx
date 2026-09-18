'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/ui/Container'

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // The digest is the only safe identifier to show: it lets an operator find
    // the full stack trace in the server logs without exposing it here.
    console.error('[page error]', error.digest ?? error.message)
  }, [error])

  const t = useTranslations('Error')

  return (
    <Container className="flex min-h-[80svh] flex-col justify-center py-32">
      <h1 className="max-w-3xl text-[clamp(1.75rem,4vw,3rem)]">{t('title')}</h1>
      <p className="mt-5 max-w-md text-ink-400">{t('body')}</p>

      <div className="mt-12">
        <button
          type="button"
          onClick={reset}
          className="h-14 bg-ember-500 px-9 text-base font-medium text-white transition-colors hover:bg-ember-400"
        >
          {t('retry')}
        </button>
      </div>

      {error.digest ? (
        <p className="label-mono mt-10" dir="ltr">
          REF {error.digest}
        </p>
      ) : null}
    </Container>
  )
}
