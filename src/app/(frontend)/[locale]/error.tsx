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
    // The digest is the only safe identifier to surface: it lets an operator
    // find the full stack trace in the server logs without exposing it here.
    console.error('[page error]', error.digest ?? error.message)
  }, [error])

  const t = useTranslations('Error')

  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
      <h1 className="text-3xl font-semibold text-brand-900">{t('title')}</h1>
      <p className="mt-4 max-w-md text-brand-600">{t('body')}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-pill bg-accent-600 px-6 py-3 text-sm font-medium text-white hover:bg-accent-700"
      >
        {t('retry')}
      </button>
      {error.digest ? (
        <p className="mt-6 text-xs text-brand-400" dir="ltr">
          {error.digest}
        </p>
      ) : null}
    </Container>
  )
}
