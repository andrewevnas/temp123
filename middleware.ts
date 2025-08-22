import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAdminToken } from './src/lib/adminAuth'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isAdminPath =
    pathname.startsWith('/admin') && pathname !== '/admin/login'
  const isAdminApi = pathname.startsWith('/api/admin')

  if (!isAdminPath && !isAdminApi) return NextResponse.next()

  const token = req.cookies.get('admin_token')?.value
  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  try {
    await verifyAdminToken(token)
    return NextResponse.next()
  } catch {
    const url = req.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
