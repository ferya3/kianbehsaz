import Image from 'next/image'
import type { ReactNode } from 'react'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/shared/Reveal'
import { cn } from '@/lib/utils/cn'

/**
 * The image-beside-text block reused by the production, technology, quality
 * and sustainability sections. `reverse` alternates the sides so the homepage
 * does not read as four identical rows.
 */
export function FeatureSplit({
  eyebrow,
  title,
  body,
  imageUrl,
  imageAlt,
  reverse = false,
  tone = 'default',
  children,
}: {
  eyebrow?: string
  title: string
  body: string
  imageUrl?: string | null
  imageAlt?: string
  reverse?: boolean
  tone?: 'default' | 'muted'
  children?: ReactNode
}) {
  return (
    <Section tone={tone}>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal className={cn(reverse && 'lg:order-2')}>
          <div className="relative aspect-4/3 overflow-hidden rounded-card bg-brand-100">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={imageAlt ?? title}
                fill
                sizes="(min-width: 1024px) 34rem, 92vw"
                className="object-cover"
              />
            ) : null}
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          {eyebrow ? (
            <p className="mb-3 text-sm font-medium tracking-wide text-accent-600 uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-3xl font-semibold md:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-brand-600">{body}</p>
          {children ? <div className="mt-8">{children}</div> : null}
        </Reveal>
      </div>
    </Section>
  )
}
