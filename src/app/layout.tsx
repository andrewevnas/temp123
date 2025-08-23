import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: { default: 'Emily — Makeup Artist Belfast', template: '%s | Emily MUA' },
  description:
    'Luxury yet approachable makeup artist in Belfast for weddings, formals & editorials. Charlotte Tilbury–trained.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}

function SiteHeader() {
  // anchor links point to homepage sections (work from any route)
  return (
    <header className="bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-40 border-b border-black/5">
      <div className="container-xy h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-lg">Emily MUA</Link>
        <nav className="hidden sm:flex gap-6 text-sm">
          <Link href="/#about">About</Link>
          <Link href="/#testimonials">Testimonials</Link>
          <Link href="/#contact">Contact</Link>
          <Link href="/services">Services</Link>
        </nav>
        <Link href="/booking" className="btn btn-primary">Book</Link>
      </div>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-black/5">
      <div className="container-xy py-10 text-sm flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Emily — Makeup Artist Belfast</p>
        <div className="flex gap-5">
          <Link href="/privacy" className="subtle">Privacy</Link>
          <Link href="/terms" className="subtle">Terms</Link>
          <Link href="/services" className="subtle">Services</Link>
        </div>
      </div>
    </footer>
  )
}
