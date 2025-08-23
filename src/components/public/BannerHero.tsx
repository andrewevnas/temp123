'use client'

import Image from 'next/image'
import Link from 'next/link'

/**
 * Full-bleed hero with a centered, bottom-floating glass card.
 * Mobile-first. Minimal fades. Subtle edge light.
 */
export default function BannerHero() {
  return (
    <section className="relative overflow-hidden rounded-b-[18px]">
      {/* Background photo */}
      <div className="relative min-h-[72svh] sm:min-h-[78vh]">
        <Image
          src="/images/banner.jpg"
          alt="Signature bridal glam by Emily"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Fades: lighter + shorter so artwork reads cleaner */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/10 to-transparent" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ivory to-transparent" />

        {/* Centered, bottom-floating card */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="container-xy pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="relative mx-auto w-full max-w-[46rem]">
              {/* very subtle edge light for 'a little bit of edge' */}
              <span
                aria-hidden
                className="absolute -inset-[2px] rounded-[12px] bg-[conic-gradient(from_180deg_at_50%_50%,#d8a4a6_0%,transparent_40%,transparent_60%,#d8a4a6_100%)] blur-[14px] opacity-15"
              />
              <div className="relative rounded-[12px] border border-white/30 bg-white/65 backdrop-blur-md shadow-soft p-5 sm:p-7 text-center">
                <div className="subtle mb-1">Belfast • Bridal • Editorial</div>
                <h1 className="font-display text-[1.9rem] sm:text-4xl leading-tight tracking-tight mb-2">
                  Luxury glam with a personal touch.
                </h1>
                <p className="text-ink/80 text-base sm:text-[1.05rem] mb-4">
                  Belfast’s trusted, home-grown makeup artist for weddings, formals & special occasions.
                  Charlotte Tilbury–trained. Mobile on request.
                </p>
                <div className="flex justify-center gap-3">
                  <Link href="/booking" className="btn btn-primary">Book now</Link>
                  <Link href="/services" className="btn btn-ghost">All services</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>      
    </section>
  )
}
