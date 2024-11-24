import { Inter, Orbitron } from 'next/font/google';
import { Providers } from '@/providers/Providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import './globals.css';
import EA from '@/components/layout/EA';

// Font for headings - Orbitron has a modern, technical feel perfect for motorsports
const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
});

// Font for body text - Inter is highly readable
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'PitDeck - Motorsport Digital Collectibles',
  description: 'Collect and trade digital cards from Formula 1, WEC, IndyCar, NASCAR, and more.',
  metadataBase: new URL('https://pitdeck.app'),
  openGraph: {
    title: 'PitDeck - Motorsport Digital Collectibles',
    description: 'Collect and trade digital cards from Formula 1, WEC, IndyCar, NASCAR, and more.',
    url: 'https://pitdeck.app',
    siteName: 'PitDeck',
    images: [
      {
        url: '/og/default.png',
        width: 1200,
        height: 630,
        alt: 'PitDeck - Digital Racing Card Collection Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PitDeck - Motorsport Digital Collectibles',
    description: 'Collect and trade digital cards from Formula 1, WEC, IndyCar, NASCAR, and more.',
    images: ['/og/default.png'],
    creator: '@pitdeckapp',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    other: {
      me: ['your-social-profile-url'],
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${inter.variable}`}>
      <body className={`min-h-screen bg-black ${inter.className}`}>
        <Analytics />
        <SpeedInsights />
        <Providers>
          <Navbar />
          <main className="pt-16">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}