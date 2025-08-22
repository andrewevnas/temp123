import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import ReschedButton from '@/components/admin/reschedButton'

type AdminSearchParams = {
  status?: 'pending' | 'confirmed' | 'cancelled'
  from?: string
  to?: string
  service?: string
}

export default async function AdminAppointments({
  searchParams,
}: {
  // ✅ Next 15 expects a Promise here
  searchParams: Promise<AdminSearchParams>
}) {
  const sp = await searchParams

  // Build Prisma where clause from query params
  const where: any = {}
  if (sp.status) where.status = sp.status
  if (sp.service) where.serviceId = sp.service
  if (sp.from || sp.to) {
    where.startsAt = {}
    if (sp.from) where.startsAt.gte = new Date(sp.from)
    if (sp.to) {
      const to = new Date(sp.to)
      to.setHours(23, 59, 59, 999) // include the whole day
      where.startsAt.lte = to
    }
  }

  const [appts, services] = await Promise.all([
    prisma.appointment.findMany({
      where,
      include: { service: true, payment: true },
      orderBy: { startsAt: 'desc' },
      take: 200,
    }),
    prisma.service.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Appointments</h1>

      {/* Filters (GET form) */}
      <form className="flex flex-wrap gap-2 mb-4">
        <select
          name="status"
          defaultValue={sp.status || ''}
          className="border rounded p-2"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          name="service"
          defaultValue={sp.service || ''}
          className="border rounded p-2"
        >
          <option value="">All services</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="from"
          defaultValue={sp.from}
          className="border rounded p-2"
        />
        <input
          type="date"
          name="to"
          defaultValue={sp.to}
          className="border rounded p-2"
        />

        <button className="border rounded px-3">Apply</button>

        <Link
          className="border rounded px-3"
          href="/api/admin/appointments/export"
          target="_blank"
        >
          Export CSV
        </Link>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">When</th>
              <th className="p-2">Service</th>
              <th className="p-2">Client</th>
              <th className="p-2">Status</th>
              <th className="p-2">Deposit</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appts.map((a) => (
              <tr key={a.id} className="border-b align-top">
                <td className="p-2 whitespace-nowrap">
                  {new Date(a.startsAt).toLocaleString()}
                </td>
                <td className="p-2">{a.service.name}</td>
                <td className="p-2">
                  <div className="font-medium">{a.customerName}</div>
                  <div className="text-gray-500">{a.email}</div>
                  {a.phone ? <div className="text-gray-500">{a.phone}</div> : null}
                </td>
                <td className="p-2 capitalize">{a.status}</td>
                <td className="p-2">
                  {a.payment?.status
                    ? a.payment.status === 'paid'
                      ? 'Paid'
                      : a.payment.status
                    : '—'}
                </td>
                <td className="p-2">
                  <form
                    action={`/api/admin/appointments/${a.id}/status`}
                    method="post"
                    className="inline"
                  >
                    <input type="hidden" name="status" value="confirmed" />
                    <button
                      className="underline mr-3"
                      disabled={a.status === 'confirmed'}
                    >
                      Confirm
                    </button>
                  </form>

                  <form
                    action={`/api/admin/appointments/${a.id}/status`}
                    method="post"
                    className="inline"
                  >
                    <input type="hidden" name="status" value="cancelled" />
                    <button
                      className="underline mr-3 text-red-600"
                      disabled={a.status === 'cancelled'}
                    >
                      Cancel
                    </button>
                  </form>

                  {/* Client component for interactivity */}
                  <ReschedButton id={a.id} />
                </td>
              </tr>
            ))}
            {appts.length === 0 && (
              <tr>
                <td className="p-4 text-gray-500" colSpan={6}>
                  No appointments match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
