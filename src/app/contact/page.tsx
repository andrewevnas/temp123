export default function ContactPage() {
  return (
    <section className="section">
      <div className="max-w-xl">
        <h1 className="h1 mb-4">Contact</h1>
        <p className="subtle mb-6">Enquiries for weddings, occasions and bookings.</p>

        <form action="/api/contact" method="post" className="card p-5 grid gap-4">
          <input className="border rounded-xl px-4 py-3" name="name" placeholder="Your name" required />
          <input className="border rounded-xl px-4 py-3" type="email" name="email" placeholder="Email address" required />
          <input className="border rounded-xl px-4 py-3" name="phone" placeholder="Phone (optional)" />
          <textarea className="border rounded-xl px-4 py-3 min-h-[140px]" name="message" placeholder="Your message…" required />
          <button className="btn btn-primary w-full">Send message</button>
        </form>

        <p className="subtle mt-3">* Form processing is added in Stage 5D.</p>
      </div>
    </section>
  )
}
