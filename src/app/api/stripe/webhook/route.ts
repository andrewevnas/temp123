import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import type Stripe from 'stripe'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature') ?? ''
  const buf = Buffer.from(await req.arrayBuffer())
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) return new NextResponse('Webhook secret not set', { status: 500 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(buf, sig, secret)
  } catch (e) {
    const msg = (e as Error).message || 'Invalid signature'
    return new NextResponse(`Webhook Error: ${msg}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const appointmentId = session.metadata?.appointmentId
    if (appointmentId) {
      const pi =
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id ?? null

      await prisma.payment.update({
        where: { appointmentId },
        data: { status: 'paid', stripePaymentIntent: pi },
      })
      await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: 'confirmed' },
      })
    }
  }

  return NextResponse.json({ received: true })
}

export const config = {
  api: { bodyParser: false }, // important for Stripe
}
