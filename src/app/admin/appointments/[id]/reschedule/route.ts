import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { startsAtISO } = await req.json()
  if (!startsAtISO) return new NextResponse('Missing startsAtISO', { status: 400 })
  const appt = await prisma.appointment.findUnique({ where: { id: params.id }, include: { service: true } })
  if (!appt) return new NextResponse('Not found', { status: 404 })

  const startsAt = new Date(startsAtISO)
  if (Number.isNaN(startsAt.getTime())) return new NextResponse('Invalid date', { status: 400 })
  const endsAt = new Date(startsAt.getTime() + appt.service.durationMin * 60_000)

  const clash = await prisma.appointment.findFirst({
    where: {
      id: { not: appt.id },
      status: { in: ['pending','confirmed'] },
      OR: [{ startsAt: { lt: endsAt }, endsAt: { gt: startsAt } }],
    },
  })
  if (clash) return new NextResponse('Time overlaps existing booking', { status: 409 })

  await prisma.appointment.update({ where: { id: appt.id }, data: { startsAt, endsAt } })
  return NextResponse.json({ ok: true })
}
