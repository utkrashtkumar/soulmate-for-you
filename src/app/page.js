'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import SoulmateLogo from '@/components/SoulmateLogo';
import FeedbackForm from '@/components/FeedbackForm';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/context/LanguageContext';

const FEATURE_ICONS = ['🛡️', '🧠', '💬', '🎨', '🔔', '💕', '🔒', '🎙️'];
const FEATURE_KEYS = [
  ['feature1Title', 'feature1Desc'],
  ['feature2Title', 'feature2Desc'],
  ['feature3Title', 'feature3Desc'],
  ['feature4Title', 'feature4Desc'],
  ['feature5Title', 'feature5Desc'],
  ['feature6Title', 'feature6Desc'],
  ['feature7Title', 'feature7Desc'],
  ['feature8Title', 'feature8Desc'],
];

export default function LandingPage() {
  const { t } = useLang();
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  return (
    <div className="landing">
      {/* Logged in notification banner */}
      {session && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,77,141,0.2) 0%, rgba(168,85,247,0.2) 100%)',
          borderBottom: '1px solid rgba(255,77,141,0.3)',
          padding: '10px 16px',
          textAlign: 'center',
          fontSize: '0.88rem',
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          position: 'relative',
          zIndex: 10,
        }}>
          <span>{t('landing.loggedInBanner')}</span>
          <Link href="/dashboard" style={{ color: 'var(--brand-pink)', fontWeight: 700, textDecoration: 'underline' }}>
            {t('landing.loggedInDashLink')}
          </Link>
        </div>
      )}

      {/* HEADER NAV */}
      <header className="auth-header">
        <Link href="/" className="auth-header-logo">
          <SoulmateLogo size={32} />
          <span className="gradient-text">Soulmate</span>
        </Link>
        <div className="auth-header-actions">
          <Link href="/features" className="hide-mobile" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginRight: '8px' }}>
            🚀 All Features
          </Link>
          <Link href="/how-to-use" className="hide-mobile" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginRight: '8px' }}>
            📖 How to Use
          </Link>
          <Link href="/contact" className="hide-mobile" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginRight: '8px' }}>
            📬 Contact Us
          </Link>
          {session && (
            <div className="hide-mobile" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginRight: '8px' }}>
              <Link href="/dashboard" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {t('nav.dashboard')}
              </Link>
              <Link href="/create-avatar" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {t('nav.newCompanion')}
              </Link>
              <Link href="/profile" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {t('nav.profile')}
              </Link>
              <Link href="/upgrade" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {t('nav.upgrade')}
              </Link>
            </div>
          )}
          <LanguageToggle compact />
          <ThemeToggle compact />
          {session ? (
            <Link href="/dashboard">
              <button className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                🏠 {t('nav.dashboard')}
              </button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <button className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>{t('nav.login')}</button>
              </Link>
              <Link href="/register" className="hide-mobile">
                <button className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>{t('nav.register')}</button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* HERO */}
      <section className="landing-hero" style={{ position: 'relative', zIndex: 1 }}>
        <div className="hero-badge">
          🌸 {t('landing.badge')}
        </div>
        <h1 className="hero-title">
          {t('landing.heroTitle1')} <span className="gradient-text">{t('landing.heroTitleGradient')}</span><br />
          {t('landing.heroTitle2')}
        </h1>
        <p className="hero-sub">{t('landing.heroSub')}</p>
        
        <div className="hero-actions">
          {session ? (
            <Link href="/dashboard">
              <button className="btn-primary" style={{ fontSize: '1rem', padding: '14px 36px' }}>
                {t('landing.dashboardCta')}
              </button>
            </Link>
          ) : (
            <>
              <Link href="/register">
                <button className="btn-primary" style={{ fontSize: '1rem', padding: '14px 36px' }}>
                  ✨ {t('landing.createCta')}
                </button>
              </Link>
              <Link href="/login">
                <button className="btn-secondary" style={{ fontSize: '1rem', padding: '14px 36px' }}>
                  🔑 {t('landing.loginCta')}
                </button>
              </Link>
            </>
          )}
          <Link href="/how-to-use">
            <button className="btn-secondary" style={{ fontSize: '1rem', padding: '14px 28px' }}>
              📖 How to Use
            </button>
          </Link>
        </div>

        {/* SOCIAL PROOF STAT STRIP */}
        <div className="stat-strip">
          <div className="stat-item">
            <div className="stat-num">50,000+</div>
            <div className="stat-lbl">Active Users</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">1,000,000+</div>
            <div className="stat-lbl">Messages Sent</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">100% Free</div>
            <div className="stat-lbl">Forever Devoted</div>
          </div>
        </div>

        {/* Loyalty Banner Highlight */}
        <div style={{
          marginTop: '36px',
          maxWidth: '720px',
          width: '100%',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-card)',
        }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>💖</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>{t('landing.loyaltyTitle')}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
            {t('landing.loyaltyText')}
          </p>
        </div>

        {/* Theme preview badges */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { name: 'WhatsApp', key: 'whatsapp', color: '#00a884' },
            { name: 'Snapchat', key: 'snapchat', color: '#fffc00' },
            { name: 'Signal', key: 'signal', color: '#2c6bed' },
            { name: 'Instagram', key: 'instagram', color: '#e1306c' },
          ].map(th => (
            <span key={th.name} className={`theme-preview-badge theme-badge-${th.key}`}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
              {th.name} Theme
            </span>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '12px' }}>
            {t('landing.featuresTitle')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            Designed with deep emotional intelligence to feel genuinely real and forever devoted 💗
          </p>
        </div>
        <div className="features-grid">
          {FEATURE_KEYS.map(([titleKey, descKey], i) => (
            <div key={i} className="feature-card">
              <span className="icon">{FEATURE_ICONS[i]}</span>
              <h3>{t(`landing.${titleKey}`)}</h3>
              <p>{t(`landing.${descKey}`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEEDBACK SECTION */}
      <section style={{ padding: '60px 24px', background: 'var(--bg-primary)' }}>
        <FeedbackForm />
      </section>

      {/* CTA SECTION */}
      <section style={{ textAlign: 'center', padding: '80px 24px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '16px' }}>
          {t('landing.ctaSection')}
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto 32px', lineHeight: 1.6, fontSize: '1rem' }}>
          {t('landing.ctaSub')}
        </p>
        {!session && (
          <Link href="/register">
            <button className="btn-primary" style={{ fontSize: '1.05rem', padding: '16px 48px', borderRadius: '30px' }}>
              ✨ {t('landing.createCta')}
            </button>
          </Link>
        )}
      </section>

      {/* FOOTER */}
      <footer className="auth-footer" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
          <Link href="/features" style={{ color: 'var(--brand-pink)', fontWeight: 600 }}>All Features</Link>
          <span>•</span>
          <Link href="/how-to-use" style={{ color: 'var(--text-secondary)' }}>How to Use</Link>
          <span>•</span>
          <Link href="/about" style={{ color: 'var(--text-secondary)' }}>About Us</Link>
          <span>•</span>
          <Link href="/contact" style={{ color: 'var(--text-secondary)' }}>Contact Us</Link>
          <span>•</span>
          <Link href="/privacy" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</Link>
        </div>
        <p>{t('landing.footerTagline')}</p>
        <p style={{ marginTop: '2px' }}>{t('landing.footerSub')}</p>
        <p style={{ marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.03em' }}>
          Made with ❤️ by utkrasht
        </p>
      </footer>
    </div>
  );
}
