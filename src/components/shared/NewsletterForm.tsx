'use client'

import { useState, type FormEvent } from 'react'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/lib/i18n/config'

type State = 'idle' | 'submitting' | 'success' | 'error'

export function NewsletterForm({ locale }: { locale: Locale }) {
  const t = useTranslations('Newsletter')
  const [state, setState] = useState<State>('idle')
  const [email, setEmail] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState('submitting')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, locale, website: '' }),
      })

      setState(response.ok ? 'success' : 'error')
      if (response.ok) setEmail('')
    } catch {
      setState('error')
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <h3 className="text-sm font-semibold tracking-wide text-white uppercase">{t('title')}</h3>
      <p className="mt-2 text-sm text-brand-300">{t('body')}</p>

      <div className="mt-3 flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          {t('placeholder')}
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          dir="ltr"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t('placeholder')}
          className="min-w-0 flex-1 rounded-pill border border-white/20 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-brand-400 focus:border-accent-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === 'submitting'}
          className="rounded-pill bg-accent-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-700 disabled:opacity-60"
        >
          {t('submit')}
        </button>
      </div>

      <p aria-live="polite" className="mt-2 min-h-5 text-xs">
        {state === 'success' ? <span className="text-accent-300">{t('success')}</span> : null}
        {state === 'error' ? <span className="text-accent-400">{t('error')}</span> : null}
      </p>
    </form>
  )
}
