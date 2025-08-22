import Link from 'next/link'
import { supabaseServer } from '@/lib/supabase-server'
import { isAdmin } from '@/lib/is-admin'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdmin(user.email)) redirect('/admin/login')

  return (
    <div className="min-h-screen grid md:grid-cols-[240px_1fr]">
      <aside className="border-r p-4 space-y-3">
        <div className="font-semibold">Emily Admin</div>
        <nav className="flex flex-col gap-2">
          <Link href="/admin/appointments">Appointments</Link>
          <Link href="/admin/calendar">Calendar</Link>
          <Link href="/admin/services">Services</Link>
          <Link href="/admin/availability">Availability</Link>
          <Link href="/admin/looks">Looks</Link>
          <Link href="/admin/testimonials">Testimonials</Link>
          <a href="/admin/logout" className="text-red-600">Log out</a>
        </nav>
      </aside>
      <main className="p-6">{children}</main>
    </div>
  )
}
