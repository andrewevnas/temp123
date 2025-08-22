import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'

export const runtime = 'nodejs'

function paramFromPath(pathname: string, marker: string) {
  const i = pathname.indexOf(`/${marker}/`)
  if (i === -1) return null
  const after = pathname.slice(i + marker.length + 2)
  const seg = after.split('/')[0]
  return seg ? decodeURIComponent(seg) : null
}

export async function POST(req: Request) {
  try {
    await requireAdmin()

    const id = paramFromPath(new URL(req.url).pathname, 'appointments')
    if (!id) return NextResponse.json({ error: 'Bad URL' }, { status: 400 })

    const { startsAtISO } = (await req.json()) as { startsAtISO?: string }
    const startsAt = startsAtISO ? new Date(startsAtISO) : null
    if (!startsAt || Number.isNaN(startsAt.getTime())) {
      return NextResponse.json({ error: 'Bad date' }, { status: 400 })
    }

    const appt = await prisma.appointment.findUnique({
      where: { id },
      include: { service: true },
    })
    if (!appt) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const endsAt = new Date(startsAt.getTime() + appt.service.durationMin * 60_000)

    const clash = await prisma.appointment.findFirst({
      where: {
        id: { not: appt.id },
        status: { in: ['pending', 'confirmed'] },
        OR: [{ startsAt: { lt: endsAt }, endsAt: { gt: startsAt } }],
      },
    })
    if (clash) {
      return NextResponse.json(
        { error: 'Time clashes with another appointment' },
        { status: 409 }
      )
    }

    await prisma.appointment.update({
      where: { id: appt.id },
      data: { startsAt, endsAt },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error'
    const code = msg === 'UNAUTHORIZED' ? 401 : 500
    return NextResponse.json({ error: msg }, { status: code })
  }
}
