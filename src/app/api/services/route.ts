// src/app/api/services/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs' // Prisma must run on Node, not Edge

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { active: true },
      select: { id: true, name: true, durationMin: true, depositPence: true },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json({ services })
  } catch (err) {
    console.error('GET /api/services failed:', err)
    return NextResponse.json({ services: [] }, { status: 500 })
  }
}
