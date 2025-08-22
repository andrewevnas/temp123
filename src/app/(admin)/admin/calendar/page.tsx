import { prisma } from '@/lib/prisma'

export default async function Calendar() {
  const events = await prisma.appointment.findMany({
    where: { status: 'confirmed' },
    include: { service: true },
    orderBy: { startsAt: 'asc' },
    take: 500,
  })

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Calendar (read-only)</h1>
      <ul className="space-y-2">
        {events.map(e => (
          <li key={e.id} className="border rounded p-2">
            {new Date(e.startsAt).toLocaleString()} — {e.service.name} — {e.customerName}
          </li>
        ))}
      </ul>
    </div>
  )
}
