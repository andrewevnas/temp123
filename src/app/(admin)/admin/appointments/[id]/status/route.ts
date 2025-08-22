import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    const form = await req.formData()
    const status = String(form.get('status') || '')
    if (!['confirmed','cancelled'].includes(status)) return NextResponse.json({ error: 'Bad status' }, { status: 400 })
    await prisma.appointment.update({ where: { id: params.id }, data: { status: status as any } })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    const code = e?.message === 'UNAUTHORIZED' ? 401 : 500
    return NextResponse.json({ error: e?.message || 'Error' }, { status: code })
  }
}
