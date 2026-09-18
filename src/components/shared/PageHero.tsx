import Image from 'next/image'
import type { ReactNode } from 'react'
import { Container } from '@/components/ui/Container'
import type { Locale } from '@/lib/i18n/config'
import { Breadcrumbs, type Crumb } from './Breadcrumbs'
import { RevealLines } from '@/components/motion/Reveal'
import { cn } from '@/lib/utils/cn'

/**
 * The opening frame of every inner page.
 *
 * It clears the fixed header, carries the chapter index, and optionally sits
 * on a darkened image — so an inner page opens the same way the homepage does,
 * one scale down.
 */
export async function PageHero({
  locale,
  index,
  title,
  subtitle,
  breadcrumbs,
  imageUrl,
  imageAlt,
  children,
  className,
}: {
  locale: Locale
  /** Two-digit chapter number matching the navigation index. */
  index?: string
  title: string
  subtitle?: string | null
  breadcrumbs: Crumb[]
  imageUrl?: string | null
  imageAlt?: string | null
  children?: ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        'relative isolate overflow-hidden border-b border-white/10 bg-ink-950',
        className,
      )}
    >
      {imageUrl ? (
        <>
          <Image
            src={imageUrl}
            alt={imageAlt ?? ''}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-45"
          />
          <div aria-hidden="true" className="media-scrim absolute inset-0" />
        </>
      ) : null}

      <Container className="relative pt-36 pb-16 md:pt-44 md:pb-20">
        <Breadcrumbs locale={locale} items={breadcrumbs} />

        <div className="mt-10 flex items-baseline gap-5">
          {index ? <span className="label-mono text-ember-400">{index}</span> : null}
          <h1 className="max-w-4xl text-[clamp(2.25rem,6vw,5rem)] leading-[1.02]">
            <RevealLines lines={[title]} />
          </h1>
        </div>

        {subtitle ? (
          <p className="mt-6 max-w-xl text-lg text-ink-300">{subtitle}</p>
        ) : null}

        {children ? <div className="mt-10">{children}</div> : null}
      </Container>
    </section>
  )
}
