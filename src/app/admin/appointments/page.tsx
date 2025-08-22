import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import type { Prisma, AppointmentStatus } from '@prisma/client'  // ← add this
import Link from 'next/link'

type Search = { searchParams: { status?: string; serviceId?: string; from?: string; to?: string } }

export default async function AdminAppointments({ searchParams }: Search) {
  const status = (searchParams.status ?? 'any') as 'any' | 'pending' | 'confirmed' | 'cancelled'
  const serviceId = searchParams.serviceId || undefined
  const from = searchParams.from ? new Date(searchParams.from) : undefined
  const to = searchParams.to ? new Date(searchParams.to) : undefined

  const services = await prisma.service.findMany({ orderBy: { name: 'asc' } })

  // ✅ strongly-typed where
  const where: Prisma.AppointmentWhereInput = {}
  if (serviceId) where.serviceId = serviceId
  if (status !== 'any') where.status = status as AppointmentStatus
  if (from || to) {
    where.startsAt = {
      ...(from ? { gte: from } : {}),
      ...(to ? { lte: to } : {}),
    }
  }

  const appts = await prisma.appointment.findMany({
    where,
    include: { service: true, payment: true },
    orderBy: { startsAt: 'desc' },
    take: 200,
  })

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Appointments</h1>

      <form className="grid grid-cols-6 gap-3 mb-4">
        <select name="status" defaultValue={status} className="border rounded p-2 col-span-1">
          <option value="any">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select name="serviceId" defaultValue={serviceId} className="border rounded p-2 col-span-2">
          <option value="">All services</option>
          {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input type="date" name="from" defaultValue={searchParams.from} className="border rounded p-2 col-span-1" />
        <input type="date" name="to" defaultValue={searchParams.to} className="border rounded p-2 col-span-1" />
        <button className="rounded bg-black text-white px-4">Filter</button>
        <a
          className="rounded border px-4 py-2 text-center"
          href={`/api/admin/appointments/export?status=${status}&serviceId=${serviceId ?? ''}&from=${searchParams.from ?? ''}&to=${searchParams.to ?? ''}`}
        >Export CSV</a>
      </form>

      <div className="overflow-x-auto bg-white rounded-2xl border">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="[&>th]:text-left [&>th]:p-3 border-b">
              <th>Date</th><th>Time</th><th>Service</th><th>Client</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appts.map(a => (
              <tr key={a.id} className="[&>td]:p-3 border-b">
                <td>{format(a.startsAt, 'dd LLL yyyy')}</td>
                <td>{format(a.startsAt, 'HH:mm')}–{format(a.endsAt, 'HH:mm')}</td>
                <td>{a.service.name}</td>
                <td>{a.customerName}<br/><span className="text-gray-500">{a.email}</span></td>
                <td className="capitalize">{a.status}</td>
                <td className="space-x-2">
                  {a.status !== 'confirmed' && (
                    <button data-id={a.id} data-status="confirmed" className="action-status rounded px-3 py-1 bg-green-600 text-white">Confirm</button>
                  )}
                  {a.status !== 'cancelled' && (
                    <button data-id={a.id} data-status="cancelled" className="action-status rounded px-3 py-1 bg-red-600 text-white">Cancel</button>
                  )}
                  <button data-id={a.id} className="action-resched rounded px-3 py-1 border">Reschedule</button>
                </td>
              </tr>
            ))}
            {!appts.length && <tr><td colSpan={6} className="p-6 text-center text-gray-500">No results</td></tr>}
          </tbody>
        </table>
      </div>

      {/* tiny client script for actions */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
          document.querySelectorAll('.action-status').forEach(btn=>{
            btn.addEventListener('click', async () => {
              const id = btn.getAttribute('data-id');
              const status = btn.getAttribute('data-status');
              const r = await fetch('/api/admin/appointments/'+id+'/status', {
                method: 'PATCH', headers:{'Content-Type':'application/json'},
                body: JSON.stringify({ status })
              });
              if (r.ok) location.reload(); else alert(await r.text());
            })
          });
          document.querySelectorAll('.action-resched').forEach(btn=>{
            btn.addEventListener('click', async () => {
              const id = btn.getAttribute('data-id');
              const iso = prompt('New start time (YYYY-MM-DDTHH:mm)');
              if(!iso) return;
              const r = await fetch('/api/admin/appointments/'+id+'/reschedule', {
                method: 'PATCH', headers:{'Content-Type':'application/json'},
                body: JSON.stringify({ startsAtISO: iso })
              });
              if (r.ok) location.reload(); else alert(await r.text());
            })
          });
        `,
        }}
      />
    </div>
  )
}
