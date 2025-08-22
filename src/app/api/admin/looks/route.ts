import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'

export async function POST(req: Request) {
  await requireAdmin()
  const { title, category, images } = await req.json() as { title: string; category: string; images: string[] }
  const look = await prisma.look.create({ data: { title, category, date: new Date() } })
  for (let i = 0; i < images.length; i++) {
    await prisma.lookImage.create({ data: { lookId: look.id, url: images[i], sort: i } })
  }
  return NextResponse.json({ ok: true })
}
