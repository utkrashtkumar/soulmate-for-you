import './globals.css';
import MobileBottomNav from '@/components/MobileBottomNav';
import VisitorTracker from '@/components/VisitorTracker';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata = {
  metadataBase: new URL('https://soulmatelove.in'),
  title: {
    default: 'Soulmate — Loyal Lifelong Understanding Companion 💕',
    template: '%s | Soulmate',
  },
  description: 'Create your own virtual girlfriend and lifelong understanding companion with emotional AI — she remembers everything, sends you messages, and feels real. Experience WhatsApp, Snapchat, Signal & Instagram themes.',
  keywords: [
    'virtual girlfriend',
    'lifelong companion',
    'understanding partner',
    'emotional AI',
    'companion app',
    'soulmate AI',
    'virtual partner India',
    'AI companion chat'
  ],
  authors: [{ name: 'Soulmate Team' }],
  creator: 'Soulmate',
  publisher: 'Soulmate',
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
  openGraph: {
    title: 'Soulmate — Loyal Lifelong Understanding Companion 💕',
    description: 'Create your own virtual girlfriend and lifelong understanding companion with emotional AI — available in WhatsApp, Snapchat, Signal & Instagram UI themes.',
    url: 'https://soulmatelove.in',
    siteName: 'Soulmate',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Soulmate — Loyal Lifelong Understanding Companion 💕',
    description: 'Create your own virtual girlfriend and lifelong understanding companion with emotional AI.',
  },
  alternates: {
    canonical: 'https://soulmatelove.in',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Soulmate',
  url: 'https://soulmatelove.in',
  description: 'Loyal lifelong understanding companion powered by emotional AI with custom themes.',
  applicationCategory: 'EntertainmentApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#ff4d8d" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Soulmate" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💕</text></svg>" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var mode = localStorage.getItem('app-mode');
              if (mode === 'light') document.documentElement.setAttribute('data-mode', 'light');
            } catch(e) {}
          })();
        `}} />
        <LanguageProvider>
          <VisitorTracker />
          {children}
          <MobileBottomNav />
        </LanguageProvider>
      </body>
    </html>
  );
}

