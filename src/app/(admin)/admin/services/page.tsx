import { prisma } from '@/lib/prisma'
import DeleteServiceButton from '@/components/admin/DeleteServiceButton'

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { name: 'asc' } })

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Services</h1>

      {/* Create new service */}
      <div className="mb-8 border rounded-lg p-4">
        <h2 className="font-medium mb-3">Create a new service</h2>
        <form action="/api/admin/services" method="post" className="grid md:grid-cols-5 gap-3 items-end">
          <label className="block">
            <div className="text-sm text-gray-600">Name</div>
            <input name="name" required className="border rounded p-2 w-full" placeholder="Bridal Makeup" />
          </label>
          <label className="block">
            <div className="text-sm text-gray-600">Duration (minutes)</div>
            <input name="durationMin" type="number" required min={15} step={5} className="border rounded p-2 w-full" placeholder="90" />
          </label>
          <label className="block">
            <div className="text-sm text-gray-600">Deposit (pence)</div>
            <input name="depositPence" type="number" required min={0} step={50} className="border rounded p-2 w-full" placeholder="3000" />
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="active" defaultChecked />
            <span className="text-sm text-gray-700">Active</span>
          </label>
          <button className="border rounded px-4 py-2">Create</button>
        </form>
      </div>

      <div className="grid gap-3">
        {services.map((s) => (
          <div key={s.id} className="border rounded-lg p-4">
            {/* UPDATE FORM */}
            <form
              action={`/api/admin/services/${s.id}`}
              method="post"
              className="grid md:grid-cols-6 gap-3 items-end"
            >
              <label className="block md:col-span-2">
                <div className="text-sm text-gray-600">Name</div>
                <input name="name" defaultValue={s.name} required className="border rounded p-2 w-full" />
              </label>
              <label className="block">
                <div className="text-sm text-gray-600">Duration (minutes)</div>
                <input name="durationMin" type="number" defaultValue={s.durationMin} min={15} step={5} required className="border rounded p-2 w-full" />
              </label>
              <label className="block">
                <div className="text-sm text-gray-600">Deposit (pence)</div>
                <input name="depositPence" type="number" defaultValue={s.depositPence} min={0} step={50} required className="border rounded p-2 w-full" />
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="active" defaultChecked={s.active} />
                <span className="text-sm text-gray-700">Active</span>
              </label>

              <div className="flex items-center gap-3">
                <button className="border rounded px-4 py-2">Save</button>
              </div>
            </form>

            {/* DELETE (separate control, not inside the form) */}
            <div className="mt-3">
              <DeleteServiceButton id={s.id} />
            </div>
          </div>
        ))}
        {services.length === 0 && (
          <div className="text-gray-500">No services yet. Create one above.</div>
        )}
      </div>
    </div>
  )
}