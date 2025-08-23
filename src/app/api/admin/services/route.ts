import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  await requireAdmin()
  const form = await req.formData()
  const name = String(form.get('name') || '').trim()
  const durationMin = Number(form.get('durationMin'))
  const depositPence = Number(form.get('depositPence'))
  const active = form.get('active') === 'on'

  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })
  if (!Number.isFinite(durationMin) || durationMin <= 0) return NextResponse.json({ error: 'Invalid duration' }, { status: 400 })
  if (!Number.isFinite(depositPence) || depositPence < 0) return NextResponse.json({ error: 'Invalid deposit' }, { status: 400 })

  // enforce a sensible min deposit if you want:
  // if (depositPence < 50) return NextResponse.json({ error: 'Deposit too low' }, { status: 400 })

  try {
    // Generate slug from name (simple example: lowercased, spaces replaced with dashes)
    const slug = name.toLowerCase().replace(/\s+/g, '-')
    // Use depositPence as basePricePence, or set a sensible default
    const basePricePence = depositPence

    await prisma.service.create({ data: { name, slug, durationMin, depositPence, basePricePence, active } })
  } catch {
    // handle unique name collisions
    return NextResponse.json({ error: 'Service name must be unique' }, { status: 400 })
  }

  return NextResponse.redirect(new URL('/admin/services', req.url))
}
