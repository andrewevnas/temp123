import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'

export async function POST(req: Request) {
  await requireAdmin()
  const form = await req.formData()
  const weekday = Number(form.get('weekday'))
  const startTime = String(form.get('startTime') || '')
  const endTime = String(form.get('endTime') || '')
  // Upsert by unique [weekday, startTime, endTime] - simplest approach: delete old and insert new
  await prisma.availabilityRule.deleteMany({ where: { weekday } })
  if (startTime && endTime) await prisma.availabilityRule.create({ data: { weekday, startTime, endTime } })
  return NextResponse.redirect(new URL('/admin/availability', req.url))
}
