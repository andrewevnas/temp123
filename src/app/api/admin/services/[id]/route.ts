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
      where: { id: params.id },
      data: { durationMin, depositPence, active },
    })

    // Redirect back to the services page in the admin UI
    return NextResponse.redirect(new URL('/admin/services', req.url))
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Update failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
