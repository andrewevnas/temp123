import { prisma } from '@/lib/prisma'
import Link from 'next/link'

type SP = {
  // month indexes are 1–12 here (for URL friendliness)
  month?: string
  year?: string
  status?: 'pending' | 'confirmed' | 'cancelled'
  service?: string
}

function monthRange(y: number, m1_12: number) {
  const start = new Date(Date.UTC(y, m1_12 - 1, 1, 0, 0, 0))
  const next = new Date(Date.UTC(y, m1_12, 1, 0, 0, 0))
  return { start, end: next }
}

function labelMonth(y: number, m1_12: number) {
  return new Date(Date.UTC(y, m1_12 - 1, 1)).toLocaleString('en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export default async function AdminCalendar({
  searchParams,
}: {
  searchParams: Promise<SP>
}) {
  const sp = await searchParams

  const now = new Date()
  const y = Number(sp.year) || now.getUTCFullYear()
  const m = Number(sp.month) || now.getUTCMonth() + 1
  const { start, end } = monthRange(y, m)

  const where: {
    startsAt: { gte: Date; lt: Date };
    status?: 'pending' | 'confirmed' | 'cancelled';
    serviceId?: string;
  } = { startsAt: { gte: start, lt: end } }
  // default to confirmed only
  if (sp.status) where.status = sp.status
  else where.status = 'confirmed'
  if (sp.service) where.serviceId = sp.service

  const [appts, services] = await Promise.all([
    prisma.appointment.findMany({
      where,
      include: { service: true, payment: true },
      orderBy: { startsAt: 'asc' },
      take: 2000,
    }),
    prisma.service.findMany({ orderBy: { name: 'asc' } }),
  ])

  // group by day
  const byDay = new Map<string, typeof appts>()
  for (const a of appts) {
    const k = a.startsAt.toISOString().slice(0, 10) // YYYY-MM-DD
    const arr = byDay.get(k) || []
    arr.push(a)
    byDay.set(k, arr)
  }

  // nav months
  const prevM = m === 1 ? 12 : m - 1
  const prevY = m === 1 ? y - 1 : y
  const nextM = m === 12 ? 1 : m + 1
  const nextY = m === 12 ? y + 1 : y

  // build Export .ics link
  const qsBase = new URLSearchParams()
  qsBase.set('from', start.toISOString().slice(0, 10))
  qsBase.set('to', end.toISOString().slice(0, 10))
  if (sp.status) qsBase.set('status', sp.status)
  if (sp.service) qsBase.set('service', sp.service)
  const icsHref = `/api/admin/calendar.ics?${qsBase}`

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{labelMonth(y, m)}</h1>
        <div className="flex items-center gap-2">
          <Link
            className="border rounded px-3 py-1"
            href={`/admin/calendar?year=${prevY}&month=${prevM}${sp.status ? `&status=${sp.status}` : ''}${sp.service ? `&service=${sp.service}` : ''}`}
          >
            ← Prev
          </Link>
          <Link
            className="border rounded px-3 py-1"
            href={`/admin/calendar?year=${nextY}&month=${nextM}${sp.status ? `&status=${sp.status}` : ''}${sp.service ? `&service=${sp.service}` : ''}`}
          >
            Next →
          </Link>
          <Link className="border rounded px-3 py-1" href={icsHref} target="_blank">
            Export .ics
          </Link>
        </div>
      </div>

      {/* Filters (GET) */}
      <form className="flex flex-wrap gap-2 mb-4">
        <select name="status" defaultValue={sp.status || 'confirmed'} className="border rounded p-2">
          <option value="">All statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select name="service" defaultValue={sp.service || ''} className="border rounded p-2">
          <option value="">All services</option>
          {services.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <input type="number" name="year" className="border rounded p-2 w-24" defaultValue={y} />
        <input type="number" name="month" className="border rounded p-2 w-20" min={1} max={12} defaultValue={m} />
        <button className="border rounded px-3">Apply</button>
      </form>

      {/* Day groups */}
      <div className="grid gap-4">
        {Array.from(byDay.entries()).map(([day, list]) => (
          <div key={day} className="border rounded-lg p-3">
            <div className="font-medium mb-2">
              {new Date(day + 'T00:00:00Z').toLocaleDateString('en-GB', {
                weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
              })}
            </div>
            <div className="space-y-2">
              {list.map(a => (
                <div key={a.id} className="flex flex-wrap items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {new Date(a.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {' – '}
                      {new Date(a.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {' · '}
                      {a.service.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {a.customerName} {a.phone ? `· ${a.phone}` : ''} · {a.email}
                    </div>
                  </div>
                  <div className="text-sm capitalize">{a.status}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {byDay.size === 0 && <div className="text-gray-500">No appointments in this range.</div>}
      </div>
    </div>
  )
}
