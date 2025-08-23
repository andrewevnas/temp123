import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const pages = ['/', '/services', '/portfolio', '/booking', '/about', '/contact']
  const now = new Date()
  return pages.map(p => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: p === '/' ? 'weekly' : 'monthly',
    priority: p === '/' ? 1 : 0.6,
  }))
}
