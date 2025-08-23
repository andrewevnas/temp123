import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="section">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="h1 mb-4">Luxury glam with a personal touch.</h1>
            <p className="text-base text-ink/80 mb-6">
              Belfast’s trusted, home-grown makeup artist for weddings, formals & special occasions.
              Trained with Charlotte Tilbury. Mobile on request.
            </p>
            <div className="flex gap-3">
              <Link href="/booking" className="btn btn-primary">Book an appointment</Link>
              <Link href="/portfolio" className="btn btn-ghost">See portfolio</Link>
            </div>
          </div>

          <div className="card overflow-hidden">
            <Image
              src="/images/hero-placeholder.jpg" /* replace when you have a real shot */
              alt="Signature bridal glam"
              width={1200}
              height={900}
              priority
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Why book Emily */}
      <section className="section">
        <div className="mb-6">
          <h2 className="h2">Why book Emily</h2>
          <p className="subtle mt-1">Modern glam that still looks like you — long-lasting, photo-ready.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Bridal & events expert', body: 'Hundreds of happy clients; timings down to a tee.' },
            { title: 'Charlotte Tilbury trained', body: '3 years on the CT Belfast team. Skin-first prep, flattering finish.' },
            { title: 'Studio & mobile', body: 'Home studio in Belfast with travel options for weddings & shoots.' },
          ].map((f) => (
            <div key={f.title} className="card p-5">
              <h3 className="font-medium mb-1">{f.title}</h3>
              <p className="subtle">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services preview */}
      <section className="section">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="h2">Popular services</h2>
            <p className="subtle">Bridal, special occasion, editorial & lessons.</p>
          </div>
          <Link href="/services" className="subtle underline">All services →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {['Bridal Makeup', 'Special Occasion', 'Editorial', 'Lessons'].map((name) => (
            <div key={name} className="card p-5">
              <div className="font-medium">{name}</div>
              <p className="subtle mt-1">Learn more & book</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="card p-6 sm:p-10 text-center">
          <h2 className="h2 mb-2">Ready to feel incredible?</h2>
          <p className="subtle mb-6">Choose your service and secure your date with a small deposit.</p>
          <Link className="btn btn-primary" href="/booking">Book your appointment</Link>
        </div>
      </section>
    </>
  )
}
