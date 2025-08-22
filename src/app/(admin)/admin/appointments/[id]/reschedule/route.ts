import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'

export const runtime = 'nodejs'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const body = (await req.json()) as { startsAtISO?: string }
    const startsAt = body.startsAtISO ? new Date(body.startsAtISO) : null
    if (!startsAt || Number.isNaN(startsAt.getTime())) {
      return NextResponse.json({ error: 'Bad date' }, { status: 400 })
    }

    const appt = await prisma.appointment.findUnique({
      where: { id: params.id },
      include: { service: true },
    })
    if (!appt) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const endsAt = new Date(
      startsAt.getTime() + appt.service.durationMin * 60_000
    )

    // overlap check
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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error'
    const code = message === 'UNAUTHORIZED' ? 401 : 500
    return NextResponse.json({ error: message }, { status: code })
  }
}
