import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  await requireAdmin()
  const form = await req.formData()
  const dateStr = String(form.get('date') || '')
  const reason = String(form.get('reason') || '')
  if (!dateStr) return NextResponse.json({ error: 'Missing date' }, { status: 400 })

  const d = new Date(dateStr + 'T00:00:00')
  const midnightUTC = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  await prisma.blackoutDate.create({ data: { date: midnightUTC, reason } })

  return NextResponse.redirect(new URL('/admin/availability', req.url))
}
