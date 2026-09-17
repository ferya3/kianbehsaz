import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

type Tone = 'neutral' | 'accent' | 'inverse'

const tones: Record<Tone, string> = {
  neutral: 'bg-brand-100 text-brand-700',
  accent: 'bg-accent-100 text-accent-800',
  inverse: 'bg-white/15 text-white',
}

export function Badge({
  tone = 'neutral',
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
        'inline-flex items-center rounded-pill px-3 py-1 text-xs font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
