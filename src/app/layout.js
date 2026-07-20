import './globals.css';
import MobileBottomNav from '@/components/MobileBottomNav';
import VisitorTracker from '@/components/VisitorTracker';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata = {
  metadataBase: new URL('https://soulmatelove.in'),
  title: {
    default: 'Soulmate — #1 Free AI Virtual Girlfriend & Lifelong Companion Online 💕',
    template: '%s | Soulmate AI Companion',
  },
  description: 'Create your free AI virtual girlfriend or boyfriend online. Experience deep emotional conversations, loyal AI companionship, daily voice notes, status updates, and WhatsApp, Snapchat, Signal & Instagram chat themes.',
  keywords: [
    'virtual girlfriend',
    'free AI girlfriend online',
    'AI companion chat',
    'virtual boyfriend online free',
    'AI relationship app',
    'lifelong understanding partner',
    'soulmate AI chat',
    'virtual partner app',
    'AI companion WhatsApp theme',
    'AI girlfriend online free chat'
  ],
  authors: [{ name: 'Soulmate AI' }],
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
    title: 'Soulmate — #1 Free AI Virtual Girlfriend & Lifelong Companion Online 💕',
    description: 'Create your free AI virtual girlfriend or boyfriend online. Deep emotional conversations, voice messages, memories, and WhatsApp, Snapchat & Instagram themes.',
    url: 'https://soulmatelove.in',
    siteName: 'Soulmate AI Companion',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Soulmate — #1 Free AI Virtual Girlfriend & Companion Online 💕',
    description: 'Create your free AI virtual girlfriend or boyfriend online. Deep emotional conversations, memories & voice notes.',
  },
  alternates: {
    canonical: 'https://soulmatelove.in',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Soulmate AI Companion',
  applicationCategory: 'EntertainmentApplication',
  operatingSystem: 'All',
  url: 'https://soulmatelove.in',
  offers: {
    '@type': 'Offer',
    price: '0.00',
    priceCurrency: 'USD',
  },
  description: 'Free virtual girlfriend and boyfriend AI companion app featuring emotional intelligence, voice notes, and customizable chat themes.',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '1240',
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

