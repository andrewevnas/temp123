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

    const id = paramFromPath(new URL(req.url).pathname, 'services')
    if (!id) return NextResponse.json({ error: 'Bad URL' }, { status: 400 })

    const form = await req.formData()
    const durationMin = Number(form.get('durationMin'))
    const depositPence = Number(form.get('depositPence'))
    const active = form.get('active') === 'on'

    if (!Number.isFinite(durationMin) || durationMin <= 0) {
      return NextResponse.json({ error: 'Invalid duration' }, { status: 400 })
    }
    if (!Number.isFinite(depositPence) || depositPence < 0) {
      return NextResponse.json({ error: 'Invalid deposit' }, { status: 400 })
    }

    await prisma.service.update({
      where: { id },
      data: { durationMin, depositPence, active },
    })

    return NextResponse.redirect(new URL('/admin/services', req.url))
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Update failed'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
