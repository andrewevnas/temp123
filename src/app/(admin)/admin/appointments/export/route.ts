import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'

export async function GET() {
  await requireAdmin()
  const rows = await prisma.appointment.findMany({ include: { service: true, payment: true }, orderBy: { startsAt: 'desc' }, take: 1000 })
  const head = ['Date','Service','Name','Email','Status','DepositStatus']
  const csv = [head.join(',')].concat(rows.map(r =>
    [
      r.startsAt.toISOString(),
      r.service.name.replace(/,/g,';'),
      r.customerName.replace(/,/g,';'),
      r.email,
      r.status,
      r.payment?.status || ''
    ].join(',')
  )).join('\n')

  return new Response(csv, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="appointments.csv"' } })
}
