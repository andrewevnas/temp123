'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

type Slide = { src: string; alt: string }
type Props = {
  images: Slide[]
  intervalMs?: number
  aspect?: 'portrait' | 'square' | 'landscape'
}

export default function LookSlider({ images, intervalMs = 3500, aspect = 'portrait' }: Props) {
  const [i, setI] = useState(0)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const paused = useRef(false)
  const touchX = useRef<number | null>(null)

  const next = useCallback(() => setI(n => (n + 1) % images.length), [images.length])
  const prev = () => setI(n => (n - 1 + images.length) % images.length)

  useEffect(() => {
    if (images.length < 2) return
    if (timer.current) clearInterval(timer.current)
    timer.current = setInterval(() => { if (!paused.current) next() }, intervalMs)
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [intervalMs, images.length, next])

  const ratio =
    aspect === 'portrait'  ? 'aspect-[3/4]' :
    aspect === 'landscape' ? 'aspect-[4/3]' :
                             'aspect-square'

  // Fallback if no images
  if (!images || images.length === 0) {
    return <div className={`relative w-full ${ratio} rounded-[16px] bg-ink/5`} />
  }

  return (
    <div
      className={`relative w-full ${ratio} rounded-[16px] shadow-soft overflow-hidden select-none`}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onTouchStart={e => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={e => {
        if (touchX.current == null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 40) (dx < 0 ? next() : prev())
        touchX.current = null
      }}
      aria-roledescription="carousel"
      aria-label="Portfolio looks"
    >
      {images.map((img, idx) => (
        <div
          key={img.src + idx}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${idx === i ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden={idx !== i}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 520px"
            className="object-cover"
            priority={idx === 0}
          />
        </div>
      ))}

      {/* dots */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 w-6 rounded-full transition ${idx === i ? 'bg-white/90' : 'bg-white/40 hover:bg-white/60'}`}
              onClick={() => setI(idx)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
