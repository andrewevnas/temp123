import { NextResponse } from 'next/server'
import { getAvailableSlots } from '@/lib/slots'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const serviceId = searchParams.get('serviceId')
  const date = searchParams.get('date') // yyyy-mm-dd

  if (!serviceId || !date) {
    return NextResponse.json({ error: 'Missing serviceId or date' }, { status: 400 })
  }

  // ensure service exists
  const service = await prisma.service.findUnique({ where: { id: serviceId } })
  if (!service) return NextResponse.json({ error: 'Invalid service' }, { status: 404 })

  const slots = await getAvailableSlots({ serviceId, date })
  return NextResponse.json({ slots })
}
