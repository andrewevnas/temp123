import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr] bg-[#FFFAF7]">
      <aside className="bg-white border-r">
        <div className="p-4 font-semibold">Emily Admin</div>
        <nav className="px-4 space-y-2">
          <Link href="/admin/appointments" className="block px-3 py-2 rounded hover:bg-[#F6E9EC]">Appointments</Link>
          <Link href="/admin/services" className="block px-3 py-2 rounded hover:bg-[#F6E9EC]">Services</Link>
          <Link href="/admin/availability" className="block px-3 py-2 rounded hover:bg-[#F6E9EC]">Availability</Link>
          <Link href="/admin/looks" className="block px-3 py-2 rounded hover:bg-[#F6E9EC]">Looks</Link>
          <Link href="/admin/testimonials" className="block px-3 py-2 rounded hover:bg-[#F6E9EC]">Testimonials</Link>
          <form action="/api/admin/logout" method="POST" className="pt-4">
            <button className="px-3 py-2 rounded bg-black text-white w-full">Logout</button>
          </form>
        </nav>
      </aside>
      <main className="p-6">{children}</main>
    </div>
  )
}
