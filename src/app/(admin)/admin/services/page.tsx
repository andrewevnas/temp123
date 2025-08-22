import { prisma } from '@/lib/prisma'

export default async function Services() {
  const services = await prisma.service.findMany({ orderBy: { name: 'asc' } })
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Services</h1>
      <div className="grid gap-4">
        {services.map(s => (
          <form key={s.id} action={`/api/admin/services/${s.id}`} method="post" className="border rounded p-4 grid md:grid-cols-5 gap-2 items-center">
            <div className="font-medium md:col-span-2">{s.name}</div>
            <label>Duration (min)<input name="durationMin" defaultValue={s.durationMin} className="border rounded p-2 w-full"/></label>
            <label>Deposit (pence)<input name="depositPence" defaultValue={s.depositPence} className="border rounded p-2 w-full"/></label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="active" defaultChecked={s.active}/> Active
            </label>
            <button className="border rounded px-3 py-2">Save</button>
          </form>
        ))}
      </div>
    </div>
  )
}
