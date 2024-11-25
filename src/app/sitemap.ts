import type { MetadataRoute } from 'next'
import { getSeriesData } from '@/lib/series'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all series for dynamic routes
  const series = await getSeriesData('all')

  // Static routes
  const staticRoutes = [
    {
      url: 'https://pitdeck.app',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: 'https://pitdeck.app/help',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: 'https://pitdeck.app/faq',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: 'https://pitdeck.app/privacy',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: 'https://pitdeck.app/roadmap',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: 'https://pitdeck.app/download',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: 'https://pitdeck.app/collections',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }
  ]

  return staticRoutes
} 