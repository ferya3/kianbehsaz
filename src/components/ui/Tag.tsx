import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

type Tone = 'outline' | 'ember' | 'solid'

const tones: Record<Tone, string> = {
  outline: 'border border-white/20 text-ink-300',
  ember: 'border border-ember-500/50 bg-ember-500/10 text-ember-300',
  solid: 'bg-white/10 text-ink-100 backdrop-blur-sm',
}

/** A small square label. Square, like everything else with an edge here. */
export function Tag({
  tone = 'outline',
  className,
  children,
}: {
  tone?: Tone
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 text-xs font-medium tracking-wide',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
