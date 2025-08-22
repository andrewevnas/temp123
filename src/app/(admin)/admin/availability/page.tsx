import { prisma } from '@/lib/prisma'

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

export default async function Availability() {
  const rules = await prisma.availabilityRule.findMany()
  const blackout = await prisma.blackoutDate.findMany({ orderBy: { date: 'asc' }, take: 60 })

  return (
    <div className="grid gap-8">
      <section>
        <h2 className="text-xl font-semibold mb-2">Weekly hours</h2>
        <div className="grid gap-2">
          {DAYS.map((d, i) => {
            const r = rules.find(x => x.weekday === i)
            return (
              <form key={i} action="/api/admin/availability/rule" method="post" className="flex gap-2 items-center">
                <input type="hidden" name="weekday" value={i} />
                <div className="w-12">{d}</div>
                <input name="startTime" defaultValue={r?.startTime || ''} placeholder="09:00" className="border rounded p-2" />
                <span>to</span>
                <input name="endTime" defaultValue={r?.endTime || ''} placeholder="17:00" className="border rounded p-2" />
                <button className="border rounded px-3 py-1">Save</button>
              </form>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Blackout days</h2>
        <form action="/api/admin/availability/blackout" method="post" className="flex gap-2 mb-3">
          <input type="date" name="date" className="border rounded p-2" />
          <input type="text" name="reason" placeholder="Reason" className="border rounded p-2" />
          <button className="border rounded px-3">Add</button>
        </form>
        <ul className="space-y-2">
          {blackout.map(b => (
            <li key={b.id} className="flex items-center gap-3">
              <span className="w-40">{new Date(b.date).toISOString().slice(0,10)}</span>
              <span className="flex-1">{b.reason || ''}</span>
              <form action={`/api/admin/availability/blackout/${b.id}`} method="post">
                <button className="text-red-600 underline">Remove</button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
