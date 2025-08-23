'use client'

import Image from 'next/image'
import Link from 'next/link'

/**
 * Art-directed hero:
 * - Mobile: lower height, different object-position to reveal headline behind.
 * - Desktop: current composition stays.
 * - Card: smaller on mobile, centered bottom.
 */
export default function BannerHero() {
  return (
    <section className="relative overflow-hidden rounded-b-[16px] sm:rounded-b-[18px]">
      <div className="relative min-h-[64svh] sm:min-h-[78vh]">
        <Image
          src="/images/banner.jpg"
          alt="Signature bridal glam by Emily"
          fill
          priority
          sizes="100vw"
          /* On mobile, push the crop up a touch; desktop stays centered */
          className="object-cover object-[50%_28%] sm:object-center"
        />

        {/* very light fades so artwork stays crisp */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/8 to-transparent" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-12 sm:h-16 bg-gradient-to-t from-ivory to-transparent" />

        {/* bottom-centered card */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="container-xy pb-[max(.875rem,env(safe-area-inset-bottom))]">
            <div className="relative mx-auto w-full max-w-[44rem]">
              {/* super subtle edge light — keep a hint of 'edge' */}
              <span
                aria-hidden
                className="absolute -inset-[2px] rounded-[14px] bg-[conic-gradient(from_180deg_at_50%_50%,#d8a4a6_0%,transparent_40%,transparent_60%,#d8a4a6_100%)] blur-[12px] opacity-12"
              />
              <div className="relative rounded-[14px] border border-white/25 bg-white/60 backdrop-blur-md shadow-soft p-4 sm:p-7 text-center">
                <div className="subtle mb-1">Belfast • Bridal • Editorial</div>
                <h1 className="font-display text-[1.6rem] leading-tight sm:text-4xl tracking-tight mb-2">
                  Luxury glam with a personal touch.
                </h1>
                <p className="text-ink/80 text-[0.98rem] sm:text-[1.05rem] mb-4">
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
