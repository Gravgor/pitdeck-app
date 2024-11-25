import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/help',
          '/faq',
          '/privacy',
          '/roadmap',
          '/series',
          '/download',
        ],
        disallow: [
          '/api/',
          '/auth/',
          '/admin/',
          '/dashboard/',
          '/collection/',
          '/settings/',
          '/trades/',
        ]
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/*.js$',
          '/*.css$',
          '/*.png$',
          '/*.jpg$',
          '/*.gif$',
          '/*.svg$'
        ]
      },
    ],
    sitemap: 'https://pitdeck.app/sitemap.xml',
  }
} 