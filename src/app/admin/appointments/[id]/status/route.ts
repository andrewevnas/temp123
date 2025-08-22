import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { status } = await req.json()
  if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
    return new NextResponse('Bad status', { status: 400 })
  }
  await prisma.appointment.update({ where: { id: params.id }, data: { status } })
  return NextResponse.json({ ok: true })
}
