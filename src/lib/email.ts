// src/lib/email.ts
import type Mail from 'nodemailer/lib/mailer'  // type-only; erased at build

type EmailParams = {
  to: string
  subject: string
  html: string
  ics?: { filename: string; content: string }
}

export async function sendEmail({ to, subject, html, ics }: EmailParams) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env

  // Dev fallback if SMTP isn't configured
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !EMAIL_FROM) {
    console.log('Email (dev fallback):', { to, subject })
    return
  }

  // Dynamic import keeps nodemailer server-only
  const nodemailer = (await import('nodemailer')).default

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, // 465 = SMTPS
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })

  const mail: Mail.Options = {
    from: EMAIL_FROM, // e.g., "Emily <no-reply@yourdomain.com>"
    to,
    subject,
    html,
  }

  if (ics) {
    mail.icalEvent = {
      method: 'REQUEST',
      filename: ics.filename,
      content: ics.content,
    }
  }

  await transporter.sendMail(mail)
}
