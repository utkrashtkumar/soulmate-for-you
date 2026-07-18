import './globals.css';
import MobileBottomNav from '@/components/MobileBottomNav';
import VisitorTracker from '@/components/VisitorTracker';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata = {
  title: 'Soulmate — Loyal Lifelong Understanding Companion 💕',
  description: 'Create your own virtual girlfriend and lifelong understanding companion with emotional AI — she remembers everything, sends you messages, and feels real. Available in WhatsApp, Snapchat, Signal & Instagram themes.',
  keywords: 'virtual girlfriend, lifelong companion, understanding partner, emotional AI, companion app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💕</text></svg>" />
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

