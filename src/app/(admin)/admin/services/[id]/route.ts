import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    const form = await req.formData()
    const durationMin = Number(form.get('durationMin'))
    const depositPence = Number(form.get('depositPence'))
    const active = form.get('active') === 'on'
    await prisma.service.update({ where: { id: params.id }, data: { durationMin, depositPence, active } })
    return NextResponse.redirect(new URL('/admin/services', req.url))
  } catch (e) {
    return NextResponse.json({ error: 'Update failed' }, { status: 400 })
  }
}
