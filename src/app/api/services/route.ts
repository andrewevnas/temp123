import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
      // keep the shape simple while we fix schema drift
      select: { id: true, name: true, durationMin: true, depositPence: true },
    })
    return NextResponse.json({ services })
  } catch (e: unknown) {
    console.error('GET /api/services failed:', (e instanceof Error ? e.message : String(e)))
    return NextResponse.json({ services: [], error: 'services_failed' }, { status: 500 })
  }
}
