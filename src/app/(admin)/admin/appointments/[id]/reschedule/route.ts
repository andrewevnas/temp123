import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    const { startsAtISO } = await req.json()
    const startsAt = new Date(startsAtISO)
    if (isNaN(startsAt.getTime())) return NextResponse.json({ error: 'Bad date' }, { status: 400 })

    const appt = await prisma.appointment.findUnique({ where: { id: params.id }, include: { service: true } })
    if (!appt) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const endsAt = new Date(startsAt.getTime() + appt.service.durationMin * 60_000)

    // check overlap
    const clash = await prisma.appointment.findFirst({
      where: {
        id: { not: appt.id },
        status: { in: ['pending','confirmed'] },
        OR: [{ startsAt: { lt: endsAt }, endsAt: { gt: startsAt } }]
      }
    })
    if (clash) return NextResponse.json({ error: 'Time clashes with another appointment' }, { status: 409 })

    await prisma.appointment.update({ where: { id: appt.id }, data: { startsAt, endsAt } })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    const code = e?.message === 'UNAUTHORIZED' ? 401 : 500
    return NextResponse.json({ error: e?.message || 'Error' }, { status: code })
  }
}
