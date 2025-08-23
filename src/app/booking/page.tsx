// src/app/booking/page.tsx
import BookingWidget from '@/components/public/BookingWidget'

export const metadata = { title: 'Book an appointment' }

export default function BookingPage() {
  return (
    <section className="page">
      <div className="page-body">
        <div className="page-grid items-start lg:items-center">
          {/* Left: summary / notes */}
          <div className="lg:self-center">
            <div className="eyebrow mb-2">Booking</div>
            <h1 className="page-head">Choose your date & time.</h1>
            <p className="lead mt-4">
              Deposits secure your slot. You’ll receive confirmation by email and calendar invites automatically.
            </p>
          </div>

          <div className="hidden lg:block page-rule min-h-[52vh]" aria-hidden />

          {/* Right: your existing component */}
          <div><BookingWidget /></div>
        </div>

        <div className="rule mt-10" />
      </div>
    </section>
  )
}
