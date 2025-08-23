import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  try {
    const { name, email, phone, message, website } = await req.json()

    // honeypot
    if (website) return NextResponse.json({ ok: true })

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 })
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env
    if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && CONTACT_TO) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      })
      const html = `
        <h2>New enquiry from ${escapeHtml(name)}</h2>
        <p><b>Email:</b> ${escapeHtml(email)}</p>
        ${phone ? `<p><b>Phone:</b> ${escapeHtml(phone)}</p>` : ''}
        <p><b>Message:</b><br/>${escapeHtml(message).replace(/\n/g,'<br/>')}</p>
      `
      await transporter.sendMail({
        from: `"Website" <${SMTP_USER}>`,
        to: CONTACT_TO,
        subject: `New enquiry — ${name}`,
        replyTo: email,
        html,
      })
    } else {
      console.log('[contact]', { name, email, phone, message })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[contact] error', e)
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}

function escapeHtml(s: string) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c] as string))
}
