'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

/**
 * Counts a figure up when it scrolls into view.
 *
 * The value arrives as a display string ("120k", "450+", "20+"), so the
 * component pulls the number out, animates that, and puts the prefix and
 * suffix back. Anything without a number is rendered untouched.
 *
 * The final value is in the DOM from the first render for screen readers and
 * crawlers; only the visible text animates.
 */
export function CountUp({ value, durationMs = 1400 }: { value: string; durationMs?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()

  const match = value.match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/)
  const target = match ? Number.parseFloat(match[2]!.replace(',', '')) : null

  const [shown, setShown] = useState<number | null>(target === null ? null : 0)

  useEffect(() => {
    if (target === null || reduce || !inView) return

    let frame = 0
    const start = performance.now()

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      // Ease-out: the figure lands rather than stops.
      const eased = 1 - (1 - t) ** 3
      setShown(target * eased)
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, target, durationMs, reduce])

  if (target === null || match === null) {
    return <span ref={ref}>{value}</span>
  }

  const decimals = (match[2]!.split(/[.,]/)[1] ?? '').length
  const display =
    reduce || shown === null ? target : Number(shown.toFixed(decimals))

  return (
    <span ref={ref}>
      <span aria-hidden="true">
        {match[1]}
        {display.toLocaleString('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
        {match[3]}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  )
}
