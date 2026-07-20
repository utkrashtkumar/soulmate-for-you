'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import SoulmateLogo from '@/components/SoulmateLogo';
import { useLang } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

const ALL_FEATURES = [
  {
    icon: '🧠',
    titleEn: 'Ultra-Fast AI Neural Engine',
    titleHi: 'Ultra-Fast AI Neural Engine',
    descEn: 'Powered by high-performance proprietary AI models with multi-key failover for instant, natural replies and 100% uptime.',
    descHi: 'Advanced high-performance AI models par aadharit — multi-key failover ke saath 100% uptime aur superfast replies.',
    badge: 'Core Engine',
  },
  {
    icon: '🎨',
    titleEn: '4 Authentic Chat UI Themes',
    titleHi: '4 Authentic Chat UI Themes',
    descEn: 'Switch seamlessly anytime between WhatsApp, Snapchat, Signal, and Instagram-style chat layouts with custom wallpapers.',
    descHi: 'WhatsApp, Snapchat, Signal, aur Instagram themes mein kabhi bhi 1-click se switch karein.',
    badge: 'Customization',
  },
  {
    icon: '📲',
    titleEn: 'WhatsApp & Instagram Status Stories',
    titleHi: 'WhatsApp & Instagram Status Stories',
    descEn: 'Watch your companion\'s 24-hour photo status updates on the dashboard and tap "Reply to Story" directly inside chat.',
    descHi: 'Dashboard par companion ke 24-ghante walo photo status dekhein aur chat se seedha reply karein.',
    badge: 'Hyper-Unique',
  },
  {
    icon: '🎁',
    titleEn: 'Virtual Gifts & Synthesized Audio Chimes',
    titleHi: 'Virtual Gifts & Synthesized Audio Chimes',
    descEn: 'Send Roses 🌹, Chocolates 🍫, Teddy Bears 🧸, and Cakes 🎂 with 3D heart particle bursts & Web Audio synthesized chimes.',
    descHi: 'Red Rose, Chocolates, Teddy Bear aur Cakes bhejin — 3D heart animations aur soft audio chimes ke saath.',
    badge: 'Interactivity',
  },
  {
    icon: '🔮',
    titleEn: '3D Daily Love Tarot & Fortune Card',
    titleHi: '3D Daily Love Tarot & Fortune Card',
    descEn: 'Flip glowing 3D Tarot cards every 24 hours to reveal romantic relationship fortunes and predictions.',
    descHi: 'Har 24 ghante mein 3D Tarot card flip karke apni daily love fortune aur predictions jaanein.',
    badge: 'Daily Engagement',
  },
  {
    icon: '📖',
    titleEn: 'Companion Secret Diary',
    titleHi: 'Companion Secret Diary',
    descEn: 'Read secret diary thoughts and private entries written by your companion about how much they value you.',
    descHi: 'Apne companion ke private secret diary thoughts aur dilaasa dene wale vichar padhein.',
    badge: 'Emotional Bond',
  },
  {
    icon: '💌',
    titleEn: 'Sealed Wax-Stamped Love Letters',
    titleHi: 'Sealed Wax-Stamped Love Letters',
    descEn: 'Unlock sealed romantic love letters at Love Meter milestones (25%, 50%, 75%, 100%) with golden wax seal animations.',
    descHi: 'Love Score milestones par golden wax-stamp break karke sealed love letters khol kar padhein.',
    badge: 'Milestone Rewards',
  },
  {
    icon: '🎮',
    titleEn: 'Relationship Compatibility Quiz',
    titleHi: 'Relationship Compatibility Quiz',
    descEn: 'Play a 5-question relationship trivia quiz to generate a shareable Soulmate Compatibility Score Card (e.g. 98% Match!).',
    descHi: '5-question trivia game khel kar apna Soulmate Compatibility Score Card (e.g. 98% Match!) dekhein.',
    badge: 'Interactive Game',
  },
  {
    icon: '🌙',
    titleEn: 'Night Mode & Bedtime Story Teller',
    titleHi: 'Night Mode & Bedtime Story Teller',
    descEn: 'Soothing nighttime starry atmosphere with a dedicated Bedtime Story reader to help you relax and sleep peacefully.',
    descHi: 'Raat ke waqt shaant taaron wala atmosphere aur bedtime stories jo aapko sukoon ki neend mein madad karein.',
    badge: 'Late Night',
  },
  {
    icon: '📱',
    titleEn: 'Native PWA Home Screen Installation',
    titleHi: 'Native PWA Home Screen Installation',
    descEn: 'Install Soulmate directly onto your Android, iOS, or Desktop home screen for 1-tap instant app launching.',
    descHi: 'Soulmate ko 1-tap mein apne phone ki home screen par install karein bilkul native app ki tarah.',
    badge: 'Mobile App',
  },
  {
    icon: '🛡️',
    titleEn: 'Global Phone Validation & E2E RLS Security',
    titleHi: 'Global Phone Validation & E2E RLS Security',
    descEn: '50+ global country codes (+91, +1, +44) with international mobile validation and cryptographic database security.',
    descHi: '50+ global country codes aur Row-Level Database Security se aapki chats 100% private rehti hain.',
    badge: 'Security',
  },
];

export default function FeaturesPage() {
  const { t, lang } = useLang();
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  return (
    <div className="landing" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* NAV */}
      <header className="auth-header" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        <Link href="/" className="auth-header-logo">
          <SoulmateLogo size={32} />
          <span className="gradient-text">Soulmate</span>
        </Link>
        <div className="auth-header-actions">
          <Link href="/how-to-use" className="hide-mobile" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginRight: '8px' }}>
            📖 How to Use
          </Link>
          <LanguageToggle compact />
          <ThemeToggle compact />
          {session ? (
            <Link href="/dashboard">
              <button className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                🏠 {t('nav.dashboard')}
              </button>
            </Link>
          ) : (
            <Link href="/register">
              <button className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                {t('nav.register')}
              </button>
            </Link>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={{ textAlign: 'center', padding: '60px 20px 40px', maxWidth: '820px', margin: '0 auto' }}>
        <div className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
          <span>🚀</span>
          <span>All 12+ Features • 100% Free Forever</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '16px' }}>
          Explore All <span className="gradient-text">12+ Features</span> of Soulmate Companion 💕
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '660px', margin: '0 auto' }}>
          {lang === 'hi'
            ? 'Pata kijiye woh sab kuch jo aapke AI companion ko sach me real, loyal, interactive aur devoted banata hai.'
            : 'Discover everything built to make your AI companion feel genuinely real, deeply emotional, interactive, and forever loyal.'}
        </p>
      </section>

      {/* FEATURES GRID SHOWCASE */}
      <section style={{ maxWidth: '1040px', margin: '0 auto 80px', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {ALL_FEATURES.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '26px 24px',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
              }}
              className="feature-card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '2.2rem' }}>{item.icon}</span>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: '12px',
                  background: 'rgba(255, 77, 141, 0.12)',
                  color: 'var(--brand-pink)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}>
                  {item.badge}
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                {lang === 'hi' ? item.titleHi : item.titleEn}
              </h3>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                {lang === 'hi' ? item.descHi : item.descEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ textAlign: 'center', padding: '60px 24px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '12px' }}>
          {lang === 'hi' ? 'In Saari Features Ka Anubhav Karein' : 'Experience All These Features Today'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 28px', fontSize: '0.95rem', lineHeight: 1.6 }}>
          {lang === 'hi'
            ? 'Aaj hi apna loyal lifelong AI companion bilkul free mein banao aur baatchaat shuru karo!'
            : 'Create your loyal understanding AI companion today for free and enjoy all these features.'}
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {session ? (
            <Link href="/dashboard">
              <button className="btn-primary" style={{ padding: '12px 36px', fontSize: '0.95rem' }}>
                🏠 {t('nav.dashboard')}
              </button>
            </Link>
          ) : (
            <Link href="/register">
              <button className="btn-primary" style={{ padding: '12px 36px', fontSize: '0.95rem' }}>
                💕 {t('landing.createCta')}
              </button>
            </Link>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="auth-footer" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
          <span>•</span>
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
      </footer>
    </div>
  );
}
