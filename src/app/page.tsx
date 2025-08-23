import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import HeroEditorial from "@/components/public/HeroEditorial";

import AboutEditorial from "@/components/public/AboutEditorial";
import ContactEditorial from "@/components/public/ContactEditorial";
import Script from 'next/script'
import { SITE } from '@/lib/site'

export default async function HomePage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    take: 6,
    select: { id: true, name: true, durationMin: true, depositPence: true },
  });

  return (
    <>
      <HeroEditorial />

      <AboutEditorial />

      {/* Services */}
      {/* <section className="section">
        <div className="mb-4 sm:mb-6 flex items-end justify-between">
          <div>
            <h2 className="h2">Popular services</h2>
            <p className="subtle">Tap a card to book instantly.</p>
          </div>
          <Link href="/services" className="subtle underline hidden sm:inline">All services →</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map((s) => (
            <Link
              key={s.id}
              href={`/booking?service=${s.id}`}
              className="group block border border-ink/10 hover:border-ink/30 rounded-[14px] p-4 sm:p-5 transition"
              aria-label={`Book ${s.name}`}
            >
              <div className="kicker mb-1">Service</div>
              <div className="font-medium text-lg">{s.name}</div>
              <p className="subtle mt-1">Duration: {s.durationMin} min</p>
              <p className="mt-2 text-sm">
                <span className="text-ink/70">Deposit: </span>
                <strong>£{(s.depositPence / 100).toFixed(2)}</strong>
              </p>
              <span className="subtle inline-block mt-3 underline group-hover:no-underline">Book now</span>
            </Link>
          ))}
        </div>

        <div className="mt-4 sm:mt-6">
          <Link href="/services" className="subtle underline sm:hidden">All services →</Link>
        </div>
      </section> */}

      {/* About */}
      {/* <section id="about" className="section scroll-mt-24">
        <div className="grid gap-6 sm:grid-cols-[1.2fr_1fr] items-start">
          <div>
            <div className="eyebrow mb-2">About</div>
            <h2 className="h2 mb-2">Luxury, but still you.</h2>
            <p className="text-ink/80">
              Belfast-based makeup artist specialising in bridal, events and editorial. Trained with Charlotte Tilbury,
              I focus on skin-first prep and flattering, lasting looks. I also offer lessons and masterclasses.
            </p>
          </div>
          <div className="card overflow-hidden">
            <Image src="/images/about-portrait.jpg" alt="Emily in studio" width={900} height={1100} className="w-full h-auto object-cover" />
          </div>
        </div>
      </section> */}

      {/* Testimonials */}
      <section id="testimonials" className="section scroll-mt-24">
        <div className="eyebrow mb-2">Testimonials</div>
        <h2 className="h2 mb-4">What clients say</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              q: "Emily made me feel incredible on my wedding day — makeup lasted all night!",
              a: "— Sarah, bride",
            },
            {
              q: "Perfect soft glam for my formal. Photos looked amazing.",
              a: "— Aoife",
            },
            {
              q: "Professional, calm, and so talented. Booked again for our shoot.",
              a: "— Megan, photographer",
            },
          ].map((t, i) => (
            <blockquote
              key={i}
              className="border border-ink/10 rounded-[14px] p-4"
            >
              <p className="text-ink/90">“{t.q}”</p>
              <footer className="subtle mt-2">{t.a}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Contact */}
      <ContactEditorial />

      <Script
        id="ld-local"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BeautySalon",
            name: "Emily Gallagher — Makeup Artist",
            url: SITE,
            image: `${SITE}/og.jpg`,
            address: {
              "@type": "PostalAddress",
              addressLocality: "Belfast",
              addressRegion: "NI",
              addressCountry: "UK",
            },
            areaServed: "Belfast",
            sameAs: [], // add Instagram/FB when ready
            potentialAction: {
              "@type": "ReserveAction",
              target: `${SITE}/booking`,
              name: "Book makeup appointment",
            },
          }),
        }}
      />
    </>
  );
}
