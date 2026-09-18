'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Modal } from '@/components/ui/Modal'

export type GalleryImage = {
  url: string
  alt: string
  width?: number
  height?: number
  caption?: string | null
}

export function Gallery({ images, label }: { images: GalleryImage[]; label: string }) {
  const t = useTranslations('Nav')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const active = activeIndex === null ? null : images[activeIndex]

  if (!images.length) return null

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {images.map((image, index) => (
          <li key={`${image.url}-${index}`}>
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group relative block aspect-4/3 w-full overflow-hidden bg-ink-800"
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(min-width: 768px) 20rem, 45vw"
                loading="lazy"
                className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
              />
            </button>
          </li>
        ))}
      </ul>

      <Modal open={active !== null} onClose={() => setActiveIndex(null)} label={label}>
        {active ? (
          <figure className="bg-ink-950">
            <div className="relative aspect-video w-full">
              <Image
                src={active.url}
                alt={active.alt}
                fill
                sizes="(min-width: 768px) 48rem, 92vw"
                className="object-contain"
              />
            </div>
            <figcaption className="flex items-center justify-between gap-4 px-5 py-4 text-sm text-ink-300">
              <span>{active.caption ?? active.alt}</span>
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className="label-mono border border-white/30 px-3 py-1 text-white"
              >
                {t('close')}
              </button>
            </figcaption>
          </figure>
        ) : null}
      </Modal>
    </>
  )
}
