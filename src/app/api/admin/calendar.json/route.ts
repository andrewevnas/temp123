import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'
export const runtime = 'nodejs'

export async function GET(req: Request) {
  await requireAdmin()
  const url = new URL(req.url)
  const from = new Date(url.searchParams.get('from') || new Date(Date.now() - 7*864e5).toISOString())
  const to   = new Date(url.searchParams.get('to')   || new Date(Date.now() + 60*864e5).toISOString())

  const rows = await prisma.appointment.findMany({
    where: { startsAt: { gte: from, lt: to } },
    include: { service: true },
    orderBy: { startsAt: 'asc' },
    take: 5000,
  })

  return Response.json({
    events: rows.map(r => ({
      id: r.id,
      title: `${r.service.name} – ${r.customerName}`,
      start: r.startsAt.toISOString(),
      end: r.endsAt.toISOString(),
      status: r.status,
      serviceId: r.serviceId,
    })),
  })
}
