import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'
import type { EventAttributes } from 'ics'

export const runtime = 'nodejs'

function toUTCParts(d: Date) {
  return [
    d.getUTCFullYear(),
    d.getUTCMonth() + 1,
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
  ] as const
}

export async function GET(req: Request) {
  await requireAdmin()

  const url = new URL(req.url)
  const from = url.searchParams.get('from') // YYYY-MM-DD
  const to = url.searchParams.get('to')     // YYYY-MM-DD
  const status = url.searchParams.get('status') as
    | 'pending'
    | 'confirmed'
    | 'cancelled'
    | null
  const service = url.searchParams.get('service')

  const start = from ? new Date(from + 'T00:00:00Z') : new Date()
  const end =
    to ? new Date(to + 'T00:00:00Z') : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)

  const where: {
    startsAt: { gte: Date; lt: Date };
    status?: 'pending' | 'confirmed' | 'cancelled';
    serviceId?: string;
  } = { startsAt: { gte: start, lt: end } }
  if (status) where.status = status
  else where.status = 'confirmed'
  if (service) where.serviceId = service

  const rows = await prisma.appointment.findMany({
    where,
    include: { service: true },
    orderBy: { startsAt: 'asc' },
    take: 5000,
  })

  // Build typed EventAttributes (keep to the properties the lib expects)
  const events: EventAttributes[] = rows.map((r) => {
    const [y, m, d, hh, mm] = toUTCParts(r.startsAt)
    const durationMin = Math.max(
      0,
      Math.round((r.endsAt.getTime() - r.startsAt.getTime()) / 60000),
    )

    return {
      start: [y, m, d, hh, mm],
      // (No startInputType — some versions' types don't include it)
      title: `${r.service.name} – ${r.customerName}`,
      description: `Status: ${r.status}${
        r.phone ? `\nPhone: ${r.phone}` : ''
      }\nEmail: ${r.email}`,
      duration: { minutes: durationMin },
      uid: r.id,
      status: r.status === 'cancelled' ? 'CANCELLED' : 'CONFIRMED',
    }
  })

  // Dynamic import avoids ESM/CJS issues on Vercel
  const { createEvents } = await import('ics')

  const { error, value } = createEvents(events, {
    calName: 'Emily MUA',
    productId: 'emily-mua',
  })

  if (error || !value) {
    return new Response(String(error || 'ics error'), { status: 500 })
  }

  return new Response(value, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="calendar.ics"',
    },
  })
}
