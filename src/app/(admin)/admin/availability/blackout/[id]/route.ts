import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await requireAdmin()
  await prisma.blackoutDate.delete({ where: { id: params.id } })
  return NextResponse.redirect(new URL('/admin/availability', req.url))
}
