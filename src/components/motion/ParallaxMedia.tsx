'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

/**
 * An image that drifts against the scroll inside its own frame.
 *
 * The image is rendered taller than the frame and moved vertically, so the
 * frame never shows an empty edge. Only `transform` animates, so the effect
 * stays on the compositor and never triggers layout.
 */
export function ParallaxMedia({
  src,
  alt,
  className,
  imageClassName,
  /** Travel as a share of the frame height. Keep it small; this is depth, not motion. */
  strength = 0.12,
  priority = false,
  sizes = '(min-width: 1024px) 50vw, 100vw',
}: {
  src: string
  alt: string
  className?: string
  imageClassName?: string
  strength?: number
  priority?: boolean
  sizes?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const percent = Math.round(strength * 100)
  const y = useTransform(scrollYProgress, [0, 1], [`-${percent}%`, `${percent}%`])

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      <motion.div
        className="absolute inset-0"
        style={
          reduce
            ? undefined
            : { y, top: `-${percent}%`, bottom: `-${percent}%`, height: 'auto' }
        }
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn('object-cover', imageClassName)}
        />
      </motion.div>
    </div>
  )
}
