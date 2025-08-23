import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const runtime = 'nodejs' // ensures Prisma runs on Node

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
    select: { id: true, name: true, durationMin: true, depositPence: true },
  })

  return (
    <section className="section">
      <div className="mb-6">
        <h1 className="h1">Services</h1>
        <p className="subtle mt-1">Transparent pricing — deposits secure your time & date.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <article key={s.id} className="card p-5 flex flex-col">
            <h2 className="font-medium text-lg">{s.name}</h2>
            <p className="subtle mt-1">Duration: {s.durationMin} min</p>
            <p className="mt-2">
              <span className="text-ink/70">Deposit: </span>
              <strong>£{(s.depositPence / 100).toFixed(2)}</strong>
            </p>
            <div className="mt-auto pt-4">
              <Link href={`/booking?service=${s.id}`} className="btn btn-primary w-full">
                Book {s.name}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
