'use client'

import { useState, type FormEvent } from 'react'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/lib/i18n/config'
import { contactSchema, fieldErrors } from '@/lib/validation/contact'
import { Field, Honeypot, Input, Textarea } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'

type Status = 'idle' | 'submitting' | 'success' | 'error' | 'rateLimited'

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  company: '',
  subject: '',
  message: '',
}

export function ContactForm({ locale }: { locale: Locale }) {
  const t = useTranslations('Contact')
  const tValidation = useTranslations('Validation')

  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Status>('idle')

  const update = (field: keyof typeof EMPTY) => (value: string) =>
    setValues((current) => ({ ...current, [field]: value }))

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const payload = {
      ...values,
      locale,
      // Read straight from the form: React never touches the honeypot.
      website: String(formData.get('website') ?? ''),
    }

    // Validate with the same schema the API route uses, so the browser and the
    // server can never disagree about what is acceptable.
    const parsed = contactSchema.safeParse(payload)
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error))
      setStatus('idle')
      return
    }

    setErrors({})
    setStatus('submitting')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })

      if (response.ok) {
        setValues(EMPTY)
        setStatus('success')
        return
      }

      if (response.status === 429) {
        setStatus('rateLimited')
        return
      }

      const body = (await response.json().catch(() => null)) as
        | { fields?: Record<string, string> }
        | null
      if (body?.fields) setErrors(body.fields)
      setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  const errorFor = (field: string) => (errors[field] ? tValidation(errors[field]) : undefined)

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-8">
      <Honeypot />

      <div className="grid gap-6 md:grid-cols-2">
        <Field id="name" label={t('name')} required error={errorFor('name')}>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            required
            value={values.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            onChange={(event) => update('name')(event.target.value)}
          />
        </Field>

        <Field id="company" label={t('company')} hint={t('optional')} error={errorFor('company')}>
          <Input
            id="company"
            name="company"
            autoComplete="organization"
            value={values.company}
            onChange={(event) => update('company')(event.target.value)}
          />
        </Field>

        <Field id="email" label={t('email')} required error={errorFor('email')}>
          <Input
            id="email"
            name="email"
            type="email"
            dir="ltr"
            autoComplete="email"
            required
            value={values.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            onChange={(event) => update('email')(event.target.value)}
          />
        </Field>

        <Field id="phone" label={t('phone')} hint={t('optional')} error={errorFor('phone')}>
          <Input
            id="phone"
            name="phone"
            type="tel"
            dir="ltr"
            autoComplete="tel"
            value={values.phone}
            aria-invalid={Boolean(errors.phone)}
            onChange={(event) => update('phone')(event.target.value)}
          />
        </Field>
      </div>

      <Field id="subject" label={t('subject')} required error={errorFor('subject')}>
        <Input
          id="subject"
          name="subject"
          required
          value={values.subject}
          aria-invalid={Boolean(errors.subject)}
          onChange={(event) => update('subject')(event.target.value)}
        />
      </Field>

      <Field id="message" label={t('message')} required error={errorFor('message')}>
        <Textarea
          id="message"
          name="message"
          required
          value={values.message}
          aria-invalid={Boolean(errors.message)}
          onChange={(event) => update('message')(event.target.value)}
        />
      </Field>

      <p className="text-xs text-ink-500">{t('consent')}</p>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? t('submitting') : t('submit')}
        </Button>

        <p aria-live="polite" className="text-sm">
          {status === 'success' ? <span className="text-ember-300">{t('success')}</span> : null}
          {status === 'error' ? <span className="text-ember-300">{t('error')}</span> : null}
          {status === 'rateLimited' ? (
            <span className="text-ember-300">{t('rateLimited')}</span>
          ) : null}
        </p>
      </div>
    </form>
  )
}
