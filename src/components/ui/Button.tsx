import type { ComponentProps, ReactNode } from 'react'
import { Link } from '@/lib/i18n/navigation'
import { cn } from '@/lib/utils/cn'

type Variant = 'solid' | 'outline' | 'quiet'
type Size = 'sm' | 'md' | 'lg'

/**
 * Square, not pill. Rounded buttons read as consumer software; this company
 * sells load-bearing material, and the whole layout is built on right angles.
 */
const base =
  'group/btn inline-flex items-center justify-center gap-3 font-medium transition-colors duration-200 ' +
  'disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2'

const variants: Record<Variant, string> = {
  solid: 'bg-ember-500 text-white hover:bg-ember-400 focus-visible:outline-ember-400',
  outline:
    'border border-white/20 text-ink-50 hover:border-white/60 hover:bg-white/5 focus-visible:outline-white',
  quiet: 'text-ink-300 hover:text-ink-50 focus-visible:outline-white',
}

const sizes: Record<Size, string> = {
  sm: 'h-10 px-5 text-sm',
  md: 'h-12 px-7 text-sm',
  lg: 'h-14 px-9 text-base',
}

type CommonProps = {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

type AsButton = CommonProps &
  Omit<ComponentProps<'button'>, keyof CommonProps> & { href?: undefined }

type AsLink = CommonProps & { href: string; external?: boolean }

export function Button(props: AsButton | AsLink) {
  const { variant = 'solid', size = 'md', className, children } = props
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

/**
 * The site's other call to action: a label over a rule that draws itself on
 * hover. Used wherever a solid button would be too loud — which is most places
 * in this layout.
 */
export function ArrowLink({
  href,
  external,
  className,
  children,
}: {
  href: string
  external?: boolean
  className?: string
  children: ReactNode
}) {
  const content = (
    <>
      <span className="relative">
        {children}
        <span
          aria-hidden="true"
          className="absolute -bottom-1 start-0 block h-px w-full origin-[var(--rule-origin)] scale-x-0 bg-current transition-transform duration-400 ease-[var(--ease-out-expo)] group-hover/arrow:scale-x-100"
        />
      </span>
      {/* Flipped in RTL so the arrow always points the way reading runs. */}
      <span
        aria-hidden="true"
        className="translate-x-0 transition-transform duration-300 group-hover/arrow:-translate-x-1 rtl:rotate-180 rtl:group-hover/arrow:translate-x-1"
      >
        ←
      </span>
    </>
  )

  const classes = cn(
    'group/arrow inline-flex items-center gap-3 text-sm font-medium text-ink-50 [--rule-origin:left] rtl:[--rule-origin:right]',
    className,
  )

  if (external) {
    return (
      <a href={href} className={classes} rel="noopener noreferrer" target="_blank">
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  )
}
