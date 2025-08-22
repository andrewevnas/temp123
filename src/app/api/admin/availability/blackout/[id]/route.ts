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

  const id = paramFromPath(new URL(req.url).pathname, 'blackout')
  if (!id) return NextResponse.json({ error: 'Bad URL' }, { status: 400 })

  await prisma.blackoutDate.delete({ where: { id } })

  // send back to the Availability admin page
  return NextResponse.redirect(new URL('/admin/availability', req.url))
}
