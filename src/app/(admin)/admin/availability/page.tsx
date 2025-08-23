import { prisma } from '@/lib/prisma'
import DeleteBlackoutButton from '@/components/admin/DeleteBlackoutButton'

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

export default async function AvailabilityPage() {
  const [rules, blackouts] = await Promise.all([
    prisma.availabilityRule.findMany(),
    prisma.blackoutDate.findMany({ orderBy: { date: 'asc' } }),
  ])
  const byDay = new Map(rules.map(r => [r.weekday, r]))

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Availability</h1>

      {/* Weekly rules */}
      <div className="mb-8">
        <h2 className="font-medium mb-3">Weekly hours</h2>
        <p className="text-sm text-gray-600 mb-3">
          Set start and end times (24h). Leave blank to close that day.
        </p>
        <div className="grid gap-3">
          {DAYS.map((label, weekday) => {
            const r = byDay.get(weekday)
            return (
              <form
                key={weekday}
                action="/api/admin/availability/rule"
                method="post"
                className="grid grid-cols-[80px_160px_160px_auto] items-end gap-3 border rounded-lg p-3"
              >
                <div className="font-medium">{label}</div>
                <input type="hidden" name="weekday" value={weekday} />
                <label className="block">
                  <div className="text-xs text-gray-600">Start</div>
                  <input name="startTime" type="time" defaultValue={r?.startTime} className="border rounded p-2 w-full" />
                </label>
                <label className="block">
                  <div className="text-xs text-gray-600">End</div>
                  <input name="endTime" type="time" defaultValue={r?.endTime} className="border rounded p-2 w-full" />
                </label>
                <button className="border rounded px-4 py-2 justify-self-start">Save</button>
              </form>
            )
          })}
        </div>
      </div>

      {/* Blackouts */}
      <div>
        <h2 className="font-medium mb-3">Blackout dates</h2>
        <form action="/api/admin/availability/blackout" method="post" className="flex flex-wrap gap-3 items-end mb-4">
          <label className="block">
            <div className="text-xs text-gray-600">Date</div>
            <input name="date" type="date" required className="border rounded p-2" />
          </label>
          <label className="block w-72">
            <div className="text-xs text-gray-600">Reason (optional)</div>
            <input name="reason" placeholder="Wedding away day" className="border rounded p-2 w-full" />
          </label>
          <button className="border rounded px-4 py-2">Add blackout</button>
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-[600px] w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Date</th>
                <th className="p-2">Reason</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blackouts.map(b => (
                <tr key={b.id} className="border-b">
                  <td className="p-2">{new Date(b.date).toISOString().slice(0,10)}</td>
                  <td className="p-2">{b.reason || '—'}</td>
                  <td className="p-2"><DeleteBlackoutButton id={b.id} /></td>
                </tr>
              ))}
              {blackouts.length === 0 && (
                <tr><td className="p-3 text-gray-500" colSpan={3}>No blackout dates.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
