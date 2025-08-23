import Link from 'next/link'

export default function PortfolioPage() {
  return (
    <section className="section">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="h1">Portfolio</h1>
          <p className="subtle">Bridal · Fashion/Editorial · Photoshoots · Film/TV</p>
        </div>
        <Link href="/booking" className="btn btn-ghost">Book now</Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="card aspect-[4/5] bg-blush/40" />
        ))}
      </div>

      <p className="subtle mt-6">
        (Admin upload & categories arrive in Stage 6 — this is the visual shell.)
      </p>
    </section>
  )
}
