import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const serviceId = url.searchParams.get('serviceId')
  const dateStr = url.searchParams.get('date') // YYYY-MM-DD
  const stepMin = Number(url.searchParams.get('step') || 15)

  if (!serviceId || !dateStr) {
    return NextResponse.json({ slots: [] }, { status: 400 })
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId } })
  if (!service || !service.active) return NextResponse.json({ slots: [] })

  // The "day" in UTC
  const dayStart = new Date(dateStr + 'T00:00:00Z')        // 00:00 UTC
  const weekday = dayStart.getUTCDay()

  // Weekly rule
  const rule = await prisma.availabilityRule.findUnique({ where: { weekday } })
  if (!rule) return NextResponse.json({ slots: [] })

  // Blackout?
  const blackout = await prisma.blackoutDate.findUnique({ where: { date: dayStart } })
  if (blackout) return NextResponse.json({ slots: [] })

  // Rule window in UTC for that day
  const windowStart = new Date(`${dateStr}T${rule.startTime}:00Z`)
  const windowEnd   = new Date(`${dateStr}T${rule.endTime}:00Z`)
  if (!(windowStart < windowEnd)) return NextResponse.json({ slots: [] })

  const durMs = service.durationMin * 60_000
  const lastStart = new Date(windowEnd.getTime() - durMs)

  // Existing appointments overlapping the window
  const appts = await prisma.appointment.findMany({
    where: {
      status: { in: ['pending', 'confirmed'] },
      startsAt: { lt: windowEnd },
      endsAt: { gt: windowStart },
    },
    select: { startsAt: true, endsAt: true },
  })

  const slots: string[] = []
  for (let t = windowStart.getTime(); t <= lastStart.getTime(); t += stepMin * 60_000) {
    const s = t
    const e = t + durMs
    const overlaps = appts.some(a => a.startsAt.getTime() < e && a.endsAt.getTime() > s)
    if (!overlaps) slots.push(new Date(s).toISOString())
  }

  return NextResponse.json({ slots })
}
