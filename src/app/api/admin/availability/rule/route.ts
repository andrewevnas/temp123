import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  await requireAdmin()
  const form = await req.formData()
  const weekday = Number(form.get('weekday'))
  const startTime = String(form.get('startTime') || '')
  const endTime = String(form.get('endTime') || '')

  // Replace the old rule for that weekday
  await prisma.availabilityRule.deleteMany({ where: { weekday } })
  if (startTime && endTime) {
    await prisma.availabilityRule.create({ data: { weekday, startTime, endTime } })
  }
  return NextResponse.redirect(new URL('/admin/availability', req.url))
}
