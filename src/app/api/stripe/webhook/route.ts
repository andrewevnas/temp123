import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs' // ensure Node runtime

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature') as string
  const buf = Buffer.from(await req.arrayBuffer())
  const secret = process.env.STRIPE_WEBHOOK_SECRET!
  let event

  try {
    event = stripe.webhooks.constructEvent(buf, sig, secret)
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const appointmentId = session.metadata?.appointmentId
    if (appointmentId) {
      await prisma.payment.update({
        where: { appointmentId },
        data: {
          status: 'paid',
          stripePaymentIntent: session.payment_intent?.toString() || null,
        },
      })
      await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: 'confirmed' },
      })
      // (Optional) Send confirmation email here
    }
  }

  return NextResponse.json({ received: true })
}

export const config = {
  api: { bodyParser: false }, // important for Stripe
}
