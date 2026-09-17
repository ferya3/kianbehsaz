import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'
import { Container } from './Container'

type Tone = 'default' | 'muted' | 'inverse'

const tones: Record<Tone, string> = {
  default: 'bg-surface text-brand-900',
  muted: 'bg-surface-muted text-brand-900',
  inverse: 'bg-brand-950 text-brand-50',
}

/**
 * The vertical rhythm of the whole site lives here. Pages compose Sections
 * instead of setting their own padding, which is what keeps the page from
 * drifting into a dozen slightly different gaps.
 */
export function Section({
  id,
  tone = 'default',
  size = 'md',
  className,
  containerClassName,
  children,
}: {
  id?: string
  tone?: Tone
  size?: 'md' | 'lg'
  className?: string
  containerClassName?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className={cn(
        tones[tone],
        size === 'lg' ? 'py-section-lg' : 'py-section',
        className,
      )}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  )
}

/** Eyebrow + title + optional lead paragraph, used at the top of a Section. */
export function SectionHeader({
  eyebrow,
  title,
  body,
  align = 'start',
  tone = 'default',
  action,
}: {
  eyebrow?: string
  title: string
  body?: string
  align?: 'start' | 'center'
  tone?: Tone
  action?: ReactNode
}) {
  const inverse = tone === 'inverse'

  return (
    <div
      className={cn(
        'mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'items-center text-center md:flex-col md:items-center',
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow ? (
          <p
            className={cn(
              'mb-3 text-sm font-medium tracking-wide uppercase',
              inverse ? 'text-accent-300' : 'text-accent-600',
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-3xl font-semibold md:text-4xl">{title}</h2>
        {body ? (
          <p className={cn('mt-4 text-lg', inverse ? 'text-brand-200' : 'text-brand-600')}>
            {body}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
