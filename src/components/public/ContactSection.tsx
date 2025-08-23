export default function ContactSection() {
  return (
    <section id="contact" className="section scroll-mt-24">
      <div className="max-w-xl">
        <h2 className="h2 mb-2">Contact</h2>
        <p className="subtle mb-5">Enquiries for weddings, occasions and bookings.</p>

        <form action="/api/contact" method="post" className="card p-5 grid gap-4">
          <input className="border rounded-xl px-4 py-3" name="name" placeholder="Your name" required />
          <input className="border rounded-xl px-4 py-3" type="email" name="email" placeholder="Email address" required />
          <input className="border rounded-xl px-4 py-3" name="phone" placeholder="Phone (optional)" />
          <textarea className="border rounded-xl px-4 py-3 min-h-[140px]" name="message" placeholder="Your message…" required />
          <button className="btn btn-primary w-full">Send message</button>
          {/* honeypot (simple spam guard) */}
          <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />
        </form>
      </div>
    </section>
  )
}
