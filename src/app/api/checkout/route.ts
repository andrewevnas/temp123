import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export const runtime = 'nodejs' // ensure Node runtime (Stripe SDK won't run on Edge)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { serviceId, startsAtISO, customerName, email, phone, notes, partySize, venue, readyByTime } = body || {}

    if (!serviceId || !startsAtISO || !customerName || !email) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const service = await prisma.service.findUnique({ where: { id: serviceId } })
    if (!service) return NextResponse.json({ error: 'Invalid service.' }, { status: 404 })
    if (!service.depositPence || service.depositPence < 50) {
      return NextResponse.json({ error: 'Deposit not configured for this service.' }, { status: 400 })
    }

    const startsAt = new Date(startsAtISO)
    if (Number.isNaN(startsAt.getTime())) {
      return NextResponse.json({ error: 'Invalid start time.' }, { status: 400 })
    }
    const endsAt = new Date(startsAt.getTime() + service.durationMin * 60_000)

    // race-safe overlap check
    const clash = await prisma.appointment.findFirst({
      where: {
        status: { in: ['pending', 'confirmed'] },
        OR: [{ startsAt: { lt: endsAt }, endsAt: { gt: startsAt } }],
      },
    })
    if (clash) return NextResponse.json({ error: 'Slot just booked, pick another.' }, { status: 409 })

    // create pending appointment
    const appointment = await prisma.appointment.create({
      data: {
        serviceId: service.id,
        startsAt,
        endsAt,
        customerName,
        email,
        phone,
        notes,
        partySize,
        venue,
        readyByTime,
        status: 'pending',
      },
    })

    // compute absolute URLs safely
    const origin = process.env.SITE_URL || new URL(req.url).origin

    // create checkout session
    const amount = service.depositPence
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      currency: 'gbp',
      payment_method_types: ['card'],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'gbp',
            unit_amount: amount,
            product_data: {
              name: `Deposit — ${service.name}`,
              description: `Appointment on ${startsAt.toLocaleString()}`,
            },
          },
        },
      ],
      success_url: `${origin}/booking/success?aid=${appointment.id}`,
      cancel_url: `${origin}/booking?cancelled=1`,
      metadata: { appointmentId: appointment.id },
    })

    await prisma.payment.create({
      data: {
        appointmentId: appointment.id,
        provider: 'stripe',
        amountPence: amount,
        status: 'pending',
        stripeSessionId: session.id,
      },
    })

    return NextResponse.json({ checkoutUrl: session.url })
  } catch (err: unknown) {
    let message = 'Server error creating checkout session.'
    if (typeof err === 'object' && err && 'message' in err) message = String((err as { message?: unknown }).message)
    // Stripe error objects sometimes have "raw" with a message
    if (typeof err === 'object' && err && 'raw' in err && (err as { raw?: { message?: string } }).raw?.message) {
      message = (err as { raw: { message: string } }).raw.message
    }
    console.error('Checkout error:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
