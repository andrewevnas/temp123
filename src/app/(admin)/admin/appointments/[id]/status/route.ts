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
    const status = String(form.get('status') || '')
    const allowed = new Set(['confirmed', 'cancelled'])
    if (!allowed.has(status)) {
      return NextResponse.json({ error: 'Bad status' }, { status: 400 })
    }

    await prisma.appointment.update({
      where: { id: params.id },
      data: { status: status as 'confirmed' | 'cancelled' },
    })

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error'
    const code = message === 'UNAUTHORIZED' ? 401 : 500
    return NextResponse.json({ error: message }, { status: code })
  }
}
