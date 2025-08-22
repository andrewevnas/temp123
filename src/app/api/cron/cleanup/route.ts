// src/app/api/cron/cleanup/route.ts
import { NextResponse } from 'next/server'
import { subMinutes } from 'date-fns'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

/**
 * Cancels "pending" appointments older than TTL minutes
 * and marks any pending payments as "failed".
 * Auth: Bearer token or ?key= query param must match CRON_SECRET
 */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const header = req.headers.get('authorization') || ''
  const bearer = header.startsWith('Bearer ') ? header.slice(7) : null
  const queryKey = url.searchParams.get('key')
  const secret = process.env.CRON_SECRET

  if (!secret || (bearer !== secret && queryKey !== secret)) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const ttl = Number(process.env.STALE_APPT_MINUTES || 15)
  const cutoff = subMinutes(new Date(), ttl)

  // Find stale pending appointments
  const stale = await prisma.appointment.findMany({
    where: { status: 'pending', createdAt: { lt: cutoff } },
    select: { id: true },
  })
  const ids = stale.map((s: { id: string }) => s.id)

  if (ids.length) {
    // Mark related pending payments as failed
    await prisma.payment.updateMany({
      where: { appointmentId: { in: ids }, status: 'pending' },
      data: { status: 'failed' },
    })
    // Cancel the stale appointments
    const res = await prisma.appointment.updateMany({
      where: { id: { in: ids } },
      data: { status: 'cancelled' },
    })
    console.log(`Cron cleanup: cancelled ${res.count} stale appointments (ttl=${ttl}m)`)
  } else {
    console.log(`Cron cleanup: nothing to release (ttl=${ttl}m)`)
  }

  return NextResponse.json({ ttlMinutes: ttl, released: ids.length })
}
