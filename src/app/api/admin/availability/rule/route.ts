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

  // Clear day if either input is blank
  if (!startTime || !endTime) {
    await prisma.availabilityRule.deleteMany({ where: { weekday } })
    return NextResponse.redirect(new URL('/admin/availability', req.url))
  }

  // Upsert single rule per weekday
  await prisma.availabilityRule.upsert({
    where: { weekday },
    update: { startTime, endTime },
    create: { weekday, startTime, endTime },
  })

  return NextResponse.redirect(new URL('/admin/availability', req.url))
}
