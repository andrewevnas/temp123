"use client";

import Image from "next/image";
import Link from "next/link";
import LookSlider from "@/components/public/LookSlider";

/**
 * Minimal editorial hero
 * - Mobile: type-led, centered BOOK NOW button, small image tile below.
 * - Desktop: left typographic block + vertical rule + right portrait panel.
 */
export default function HeroEditorial() {
  return (
    <section className="bg-ivory">
      {/* Top centered 'BOOK NOW' to mirror the inspiration */}
      {/* <div className="container-xy pt-3 sm:pt-3">
        <div className="flex justify-center">
          <Link
            href="/booking"
            className="inline-flex items-center justify-center rounded-full border border-ink/25 px-6 py-2 text-sm hover:bg-ink hover:text-white transition"
          >
            Book now
          </Link>
        </div>
      </div> */}

      <div className="container-xy py-4 sm:py-7">
        <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-12 items-stretch min-h-[78vh]">
          {/* Left: typographic block */}
          <div className="flex flex-col justify-center items-center text-center lg:items-start lg:text-left h-full">
            <h1 className="font-display text-[2.2rem] leading-[1.05] sm:text-5xl tracking-tight">
              Emily Gallagher
              <br />
              <br />
              <span className="text-ink/60">Makeup Artist</span>
              <br />
              <br />
            </h1>

            <div className="eyebrow mb-3">
              Fashion and Editorial • Special Occasion • Bridal • Photoshoots •
              Film and TV • Lessons and Masterclasses
            </div>

            <p className="text-ink/80 mt-4 max-w-prose">
              Each look tells a story.
              <br />
              Enhancing your natural beauty while pushing creative boundaries.
            </p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center lg:justify-start">
              <Link href="/booking" className="btn btn-primary">
                Book
              </Link>
              <Link href="/services" className="btn btn-ghost">
                All services
              </Link>
            </div>
          </div>

          {/* Middle: vertical rule (desktop only) */}
          <div
            className="hidden lg:block w-px bg-ink/10 min-h-full rounded"
            aria-hidden
          />

          {/* Right: portrait panel (desktop), small tile (mobile) */}
          {/* Right: slider panel */}
          <div className="flex justify-center lg:justify-end items-center h-full">
            <div className="w-full max-w-[340px] sm:max-w-[380px]">
              <LookSlider
                images={[
                  { src: "/looks/slider1.jpg", alt: "Bridal soft glam" },
                  { src: "/looks/slider2.jpg", alt: "Editorial glossy lid" },
                  { src: "/looks/slider3.jpg", alt: "Retro wing & nude lip" },
                ]}
                intervalMs={3800}
                aspect="portrait"
              />
            </div>
          </div>
        </div>

        {/* Hairline rule to anchor the section */}
        <div className="rule mt-8 sm:mt-12" />
      </div>
    </section>
  );
}
