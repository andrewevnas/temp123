'use client'

import { useState } from 'react'
import Image from 'next/image'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function ContactEditorial() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    const fd = new FormData(e.currentTarget)
    // simple client validation
    const name = String(fd.get('name') || '').trim()
    const email = String(fd.get('email') || '').trim()
    const phone = String(fd.get('phone') || '').trim()
    const message = String(fd.get('message') || '').trim()
    const trap = String(fd.get('website') || '') // honeypot

    if (!name || !email || !message) {
      setStatus('error'); setErrorMsg('Please complete name, email and message.')
      return
    }
    if (trap) {
      // bot — act successful w/out sending
      setStatus('sent')
      e.currentTarget.reset()
      return
    }

    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message }),
      })
      if (!r.ok) throw new Error(await r.text())
      setStatus('sent')
      e.currentTarget.reset()
    } catch (err: unknown) {
      setStatus('error')
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('Something went wrong. Please try again.')
      }
    }
  }

  return (
    <section id="contact" className="page scroll-mt-12">
      <div className="page-body">
        <div className="page-grid items-start lg:items-center">
          {/* Left: contact form */}
          <div className="lg:self-center">
            <div className="eyebrow mb-2">Contact</div>
            <h2 className="page-head">Let’s create your look.</h2>
            <p className="lead mt-3 mb-5">
              Tell me about your date, location and the vibe you’re going for. I’ll reply with availability and details.
            </p>

            <form onSubmit={onSubmit} className="space-y-3 max-w-[38rem]" noValidate>
              {/* honeypot */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />

              <div className="grid sm:grid-cols-2 gap-3">
                <label className="block">
                  <span className="field-label">Name</span>
                  <input name="name" required className="input" placeholder="Your full name" />
                </label>
                <label className="block">
                  <span className="field-label">Email</span>
                  <input name="email" type="email" required className="input" placeholder="you@email.com" />
                </label>
              </div>

              <label className="block">
                <span className="field-label">Phone (optional)</span>
                <input name="phone" className="input" placeholder="+44 ..." />
              </label>

              <label className="block">
                <span className="field-label">Message</span>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="textarea"
                  placeholder="Event date, location, number of people, inspo…"
                />
              </label>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button className="btn btn-primary disabled:opacity-60" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                </button>
                <a className="btn btn-ghost" href="mailto:hello@yourdomain.com">Email instead</a>
                <span className="subtle" aria-live="polite">
                  {status === 'sent' && 'Thanks! I’ll be in touch soon.'}
                  {status === 'error' && errorMsg && <span className="text-red-600"> {errorMsg}</span>}
                </span>
              </div>
            </form>
          </div>

          {/* Divider */}
          <div className="hidden lg:block page-rule min-h-[52vh]" aria-hidden />

          {/* Right: image */}
          <div className="lg:self-center">
            <div className="card overflow-hidden">
              <Image
                src="/images/contact-studio.jpg"
                alt="Studio / kit ready for appointments"
                width={1200}
                height={1500}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        <div className="rule mt-10" />
      </div>
    </section>
  )
}
