import type { ReactNode } from 'react'
import { Container } from '@/components/ui/Container'
import type { Locale } from '@/lib/i18n/config'
import { Breadcrumbs, type Crumb } from './Breadcrumbs'

/** The band at the top of every inner page: breadcrumbs, title, lead. */
export async function PageHeader({
  locale,
  title,
  subtitle,
  breadcrumbs,
  children,
}: {
  locale: Locale
  title: string
  subtitle?: string | null
  breadcrumbs: Crumb[]
  children?: ReactNode
}) {
  return (
    <div className="border-b border-brand-100 bg-surface-muted py-12 md:py-16">
      <Container>
        <Breadcrumbs locale={locale} items={breadcrumbs} />
        <h1 className="mt-5 max-w-3xl text-3xl font-semibold text-brand-900 md:text-5xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-4 max-w-2xl text-lg text-brand-600">{subtitle}</p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </Container>
    </div>
  )
}
