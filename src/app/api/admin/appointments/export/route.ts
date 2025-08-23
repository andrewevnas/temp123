import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  await requireAdmin()
  const url = new URL(req.url)
  const status = url.searchParams.get('status') as 'pending' | 'confirmed' | 'cancelled' | null
  const service = url.searchParams.get('service')
  const from = url.searchParams.get('from')
  const to = url.searchParams.get('to')

  const where: {
    status?: 'pending' | 'confirmed' | 'cancelled'
    serviceId?: string
    startsAt?: {
      gte?: Date
      lte?: Date
    }
  } = {}
  if (status) where.status = status
  if (service) where.serviceId = service
  if (from || to) {
    where.startsAt = {}
    if (from) where.startsAt.gte = new Date(from)
    if (to) {
      const end = new Date(to)
      end.setHours(23, 59, 59, 999)
      where.startsAt.lte = end
    }
  }

  const rows = await prisma.appointment.findMany({
    where,
    include: { service: true, payment: true },
    orderBy: { startsAt: 'desc' },
    take: 5000,
  })

  const head = ['DateTime', 'Service', 'Name', 'Email', 'Phone', 'Status', 'Deposit']
  const csv = [head.join(',')].concat(
    rows.map(r => [
      r.startsAt.toISOString(),
      safeCSV(r.service.name),
      safeCSV(r.customerName),
      r.email,
      r.phone ?? '',
      r.status,
      r.payment?.status ?? '',
    ].join(','))
  ).join('\n')

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="appointments.csv"',
    },
  })
}

function safeCSV(s: string) {
  // basic CSV escaping for commas/quotes/newlines
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}
