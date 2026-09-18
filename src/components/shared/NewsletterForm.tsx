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
      <h3 className="label-mono">{t('title')}</h3>

      <div className="mt-4 flex items-center gap-3 border-b border-white/20 focus-within:border-ember-400">
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
          className="min-w-0 flex-1 bg-transparent py-2 font-mono text-sm text-ink-50 placeholder:text-ink-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === 'submitting'}
          aria-label={t('submit')}
          className="shrink-0 py-2 text-ink-300 transition-colors hover:text-ember-400 disabled:opacity-50 rtl:rotate-180"
        >
          →
        </button>
      </div>

      <p aria-live="polite" className="mt-2 min-h-5 text-xs">
        {state === 'success' ? <span className="text-ember-300">{t('success')}</span> : null}
        {state === 'error' ? <span className="text-ember-400">{t('error')}</span> : null}
      </p>
    </form>
  )
}
