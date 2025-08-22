import { NextResponse } from 'next/server'
import { createAdminToken } from '@/lib/adminAuth'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const form = await req.formData()
  const password = String(form.get('password') ?? '')
  const next = String(form.get('next') ?? '/admin/appointments')

  if (!process.env.ADMIN_PASSWORD) {
    return new NextResponse('ADMIN_PASSWORD not set', { status: 500 })
  }
  if (password !== process.env.ADMIN_PASSWORD) {
    const url = new URL('/admin/login', req.url)
    url.searchParams.set('error', '1')
    return NextResponse.redirect(url)
  }

  const token = await createAdminToken()
  const res = NextResponse.redirect(new URL(next, req.url))
  res.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  return res
}
