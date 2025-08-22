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

    const id = paramFromPath(new URL(req.url).pathname, 'appointments')
    if (!id) return NextResponse.json({ error: 'Bad URL' }, { status: 400 })

    const form = await req.formData()
    const status = String(form.get('status') || '')
    if (!['confirmed', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Bad status' }, { status: 400 })
    }

    await prisma.appointment.update({
      where: { id },
      data: { status: status as 'confirmed' | 'cancelled' },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error'
    const code = msg === 'UNAUTHORIZED' ? 401 : 500
    return NextResponse.json({ error: msg }, { status: code })
  }
}
