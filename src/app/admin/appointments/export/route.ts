import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import type { Prisma, AppointmentStatus } from '@prisma/client'  // ← add this

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const status = (searchParams.get('status') || 'any') as 'any'|'pending'|'confirmed'|'cancelled'
  const serviceId = searchParams.get('serviceId') || undefined
  const from = searchParams.get('from') ? new Date(searchParams.get('from') as string) : undefined
  const to = searchParams.get('to') ? new Date(searchParams.get('to') as string) : undefined

  // ✅ strongly-typed where
  const where: Prisma.AppointmentWhereInput = {}
  if (serviceId) where.serviceId = serviceId
  if (status !== 'any') where.status = status as AppointmentStatus
  if (from || to) {
    where.startsAt = {
      ...(from ? { gte: from } : {}),
      ...(to ? { lte: to } : {}),
    }
  }

  const rows = await prisma.appointment.findMany({
    where,
    include: { service: true, payment: true },
    orderBy: { startsAt: 'desc' },
    take: 2000,
  })

  const header = ['Date','Start','End','Service','Client','Email','Status','DepositPaid','PaymentStatus']
  const csv = [header.join(',')]
  for (const a of rows) {
    csv.push([
      a.startsAt.toISOString().slice(0,10),
      a.startsAt.toISOString().slice(11,16),
      a.endsAt.toISOString().slice(11,16),
      a.service.name.replace(/,/g,' '),
      a.customerName.replace(/,/g,' '),
      a.email,
      a.status,
      (a.payment?.amountPence ?? 0)/100,
      a.payment?.status ?? '',
    ].join(','))
  }

  return new NextResponse(csv.join('\n'), {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="appointments.csv"',
    },
  })
}
