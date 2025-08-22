import { addMinutes, formatISO, isBefore, parseISO, set } from 'date-fns'
import { prisma } from './prisma'

function parseHM(hm: string) {
  const [h, m] = hm.split(':').map(Number)
  return { h, m }
}

// Returns ISO strings (UTC) for valid start times on a given local date (yyyy-mm-dd)
export async function getAvailableSlots(opts: { serviceId: string; date: string }) {
  const { serviceId, date } = opts
  const service = await prisma.service.findUnique({ where: { id: serviceId } })
  if (!service) return []

  const dateObj = new Date(`${date}T00:00:00`) // local midnight -> we’ll treat as local

  const weekday = dateObj.getDay() // 0..6
  const rules = await prisma.availabilityRule.findMany({ where: { weekday } })
  if (!rules.length) return []

  // blackout check (normalize to midnight UTC)
  const startOfDayUTC = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()))
  const blackout = await prisma.blackoutDate.findFirst({ where: { date: startOfDayUTC } })
  if (blackout) return []

  // existing appointments that day
  const dayStart = new Date(dateObj); dayStart.setHours(0,0,0,0)
  const dayEnd = new Date(dateObj); dayEnd.setHours(23,59,59,999)
  const appts: { startsAt: Date; endsAt: Date }[] = await prisma.appointment.findMany({
    where: { startsAt: { gte: dayStart, lte: dayEnd }, status: { in: ['pending','confirmed'] } },
    select: { startsAt: true, endsAt: true },
  })

  const slots: string[] = []
  for (const r of rules) {
    const { h: sh, m: sm } = parseHM(r.startTime)
    const { h: eh, m: em } = parseHM(r.endTime)

    // candidate cursor in local time
    let cursor = set(new Date(dateObj), { hours: sh, minutes: sm, seconds: 0, milliseconds: 0 })
    const endWindow = set(new Date(dateObj), { hours: eh, minutes: em, seconds: 0, milliseconds: 0 })

    while (isBefore(cursor, endWindow)) {
      const start = new Date(cursor)
      const end = addMinutes(start, service.durationMin)

      const overlaps = appts.some((a: { startsAt: Date; endsAt: Date }) => !(end <= a.startsAt || start >= a.endsAt))
      if (!overlaps && end <= endWindow) {
        slots.push(formatISO(start)) // ISO local
      }
      cursor = addMinutes(cursor, 15) // 15-min granularity
    }
  }
  // remove past times if the date is today
  const now = new Date()
  return slots.filter(s => parseISO(s) > now)
}
