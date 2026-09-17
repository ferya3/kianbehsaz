import type { ComponentProps, ReactNode } from 'react'
import { Link } from '@/lib/i18n/navigation'
import { cn } from '@/lib/utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'inverse'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-pill font-medium transition-colors ' +
  'disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2'

const variants: Record<Variant, string> = {
  primary: 'bg-accent-600 text-white hover:bg-accent-700 focus-visible:outline-accent-600',
  secondary:
    'bg-brand-900 text-white hover:bg-brand-800 focus-visible:outline-brand-900',
  ghost:
    'border border-brand-200 bg-transparent text-brand-800 hover:bg-brand-50 focus-visible:outline-brand-400',
  inverse:
    'border border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 focus-visible:outline-white',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-13 px-8 text-base',
}

type CommonProps = {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

type ButtonAsButton = CommonProps &
  Omit<ComponentProps<'button'>, keyof CommonProps> & { href?: undefined }

type ButtonAsLink = CommonProps & {
  href: string
  /** Set for links that leave the site or point at a file. */
  external?: boolean
}

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = 'primary', size = 'md', className, children } = props
  const classes = cn(base, variants[variant], sizes[size], className)

  if ('href' in props && props.href !== undefined) {
    const { href, external } = props

    if (external) {
      return (
        <a href={href} className={classes} rel="noopener noreferrer" target="_blank">
          {children}
        </a>
      )
    }

    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
