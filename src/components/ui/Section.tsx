import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'
import { Container } from './Container'

type Tone = 'base' | 'raised' | 'ember'

const tones: Record<Tone, string> = {
  base: 'bg-ink-950',
  // Lifted by a few percent rather than by a border, so the seam is felt but
  // not drawn.
  raised: 'bg-ink-900',
  ember: 'bg-ember-600 text-white',
}

export function Section({
  id,
  tone = 'base',
  size = 'md',
  bleed = false,
  className,
  containerClassName,
  children,
}: {
  id?: string
  tone?: Tone
  size?: 'sm' | 'md' | 'lg'
  /** Skip the container: the section manages its own edges. */
  bleed?: boolean
  className?: string
  containerClassName?: string
  children: ReactNode
}) {
  const padding =
    size === 'lg' ? 'py-section-lg' : size === 'sm' ? 'py-20' : 'py-section'

  return (
    <section id={id} className={cn(tones[tone], padding, className)}>
      {bleed ? children : <Container className={containerClassName}>{children}</Container>}
    </section>
  )
}

/**
 * Section heading: a mono index and label on one hairline, the title below it.
 *
 * The index is what makes a long dark page navigable — you always know which
 * of eight chapters you are in.
 */
export function SectionHead({
  index,
  label,
  title,
  body,
  action,
  className,
}: {
  /** Two-digit chapter number, e.g. "03". */
  index?: string
  label?: string
  title: string
  body?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <header className={cn('mb-14 md:mb-20', className)}>
      {(index || label) && (
        <div className="rule-hairline flex items-baseline gap-4 pt-4">
          {index ? <span className="label-mono text-ember-400">{index}</span> : null}
          {label ? <span className="label-mono">{label}</span> : null}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="max-w-3xl text-[clamp(2rem,4.4vw,3.75rem)]">{title}</h2>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>

      {body ? <p className="mt-6 max-w-xl text-lg text-ink-300">{body}</p> : null}
    </header>
  )
}
