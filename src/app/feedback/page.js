import Link from 'next/link';
import SoulmateLogo from '@/components/SoulmateLogo';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import HeaderUserAvatar from '@/components/HeaderUserAvatar';
import FeedbackForm from '@/components/FeedbackForm';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Give Feedback & Feature Suggestions | Soulmate AI Companion',
  description: 'Share your feedback, report bugs, or suggest new features to help us build a better emotional AI companion experience.',
  keywords: [
    'soulmate feedback',
    'ai companion feedback',
    'suggest feature ai girlfriend',
    'report bug virtual companion'
  ],
  alternates: {
    canonical: 'https://soulmatelove.in/feedback',
  },
};

export default function DedicatedFeedbackPage() {
  return (
    <div className="landing" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* HEADER NAV */}
      <header className="auth-header" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        <Link href="/" className="auth-header-logo">
          <SoulmateLogo size={32} />
          <span className="gradient-text">Soulmate</span>
        </Link>
        <div className="auth-header-actions">
          <Link href="/features" className="hide-mobile" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginRight: '8px' }}>
            🚀 Features
          </Link>
          <LanguageToggle compact />
          <ThemeToggle compact />
          <HeaderUserAvatar />
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={{ maxWidth: '840px', margin: '0 auto', padding: '60px 24px 20px', textAlign: 'center' }}>
        <div className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
          <span>💬</span>
          <span>We listen to our users</span>
        </div>

        <h1 style={{ fontSize: '2.6rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '20px' }}>
          Share Your <span className="gradient-text">Feedback & Ideas</span>
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: '680px', margin: '0 auto 12px' }}>
          Your suggestions directly shape the future of Soulmate. Whether you want to request new personalities, report a bug, or suggest a feature, we read every single submission!
        </p>
      </section>

      {/* FEEDBACK FORM CONTAINER */}
      <section style={{ maxWidth: '800px', margin: '0 auto 80px', padding: '0 24px' }}>
        <FeedbackForm />
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
