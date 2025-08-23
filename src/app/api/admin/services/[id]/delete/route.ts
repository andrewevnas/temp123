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
  await requireAdmin()

  const id = paramFromPath(new URL(req.url).pathname, 'services')
  if (!id) return NextResponse.json({ error: 'Bad URL' }, { status: 400 })

  // Optional: block delete if there are future appointments using this service.
  // const hasFuture = await prisma.appointment.findFirst({
  //   where: { serviceId: id, startsAt: { gt: new Date() } },
  //   select: { id: true },
  // })
  // if (hasFuture) return NextResponse.json({ error: 'Service has future appointments' }, { status: 400 })

  await prisma.service.delete({ where: { id } })
  return NextResponse.redirect(new URL('/admin/services', req.url))
}
