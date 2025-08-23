import Link from 'next/link'
import BannerHero from '@/components/public/BannerHero'
import ContactSection from '@/components/public/ContactSection'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'

export default async function HomePage() {
  // grab a few services for the home grid
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
    take: 6,
    select: { id: true, name: true, durationMin: true, depositPence: true },
  })

  return (
    <>
      <BannerHero />

      {/* Services (clickable cards → booking with service preselected) */}
      <section className="section">
        <div className="mb-4 sm:mb-6 flex items-end justify-between">
          <div>
            <h2 className="h2">Popular services</h2>
            <p className="subtle">Tap a card to book instantly.</p>
          </div>
          <Link href="/services" className="subtle underline hidden sm:inline">All services →</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map(s => (
            <Link
              key={s.id}
              href={`/booking?service=${s.id}`}
              className="card p-4 sm:p-5 block transition hover:-translate-y-0.5"
              aria-label={`Book ${s.name}`}
            >
              <div className="font-medium text-base sm:text-lg">{s.name}</div>
              <p className="subtle mt-1">Duration: {s.durationMin} min</p>
              <p className="mt-2 text-sm">
                <span className="text-ink/70">Deposit: </span>
                <strong>£{(s.depositPence/100).toFixed(2)}</strong>
              </p>
              <span className="subtle inline-block mt-3 underline">Book now</span>
            </Link>
          ))}
        </div>

        <div className="mt-4 sm:mt-6">
          <Link href="/services" className="subtle underline sm:hidden">All services →</Link>
        </div>
      </section>

      {/* About section (anchor) */}
      <section id="about" className="section scroll-mt-24">
        <div className="grid gap-6 sm:grid-cols-[1.2fr_1fr] items-start">
          <div>
            <h2 className="h2 mb-2">About Emily</h2>
            <p className="text-ink/80 mb-4">
              Belfast-based makeup artist specialising in bridal, events and editorial.
              Luxury yet approachable: modern glam that enhances your features and lasts all day.
            </p>
            <p className="text-ink/80">
              Trained with Charlotte Tilbury (3 years in the Belfast team), experienced across weddings,
              fashion shows and photoshoots. Lessons and masterclasses available.
            </p>
          </div>
          <div className="card overflow-hidden">
            <Image src="/images/about-portrait.jpg" alt="Emily portrait" width={90} height={110} className="w-full h-auto object-cover" />
          </div>
        </div>
      </section>

      {/* Testimonials (anchor) */}
      <section id="testimonials" className="section scroll-mt-24">
        <h2 className="h2 mb-4">What clients say</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { q: 'Emily made me feel incredible on my wedding day — makeup lasted all night!', a: '— Sarah, bride' },
            { q: 'Perfect soft glam for my formal. Photos looked amazing.', a: '— Aoife' },
            { q: 'Professional, calm, and so talented. Booked again for our shoot.', a: '— Megan, photographer' },
          ].map((t, i) => (
            <blockquote key={i} className="card p-4">
              <p className="text-ink/90">“{t.q}”</p>
              <footer className="subtle mt-2">{t.a}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Contact (anchor) */}
      <ContactSection />
    </>
  )
}
