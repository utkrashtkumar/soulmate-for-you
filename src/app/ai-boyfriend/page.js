import Link from 'next/link';
import SoulmateLogo from '@/components/SoulmateLogo';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import HeaderUserAvatar from '@/components/HeaderUserAvatar';

export const metadata = {
  title: 'Free AI Boyfriend Online — Caring & Loyal Virtual Partner | Soulmate',
  description: 'Create your free AI virtual boyfriend online. Experience caring conversations, protective emotional support, voice notes, daily check-ins, and customizable WhatsApp & Snapchat themes.',
  keywords: [
    'free AI boyfriend',
    'virtual boyfriend online',
    'AI boyfriend chat free',
    'emotional AI companion',
    'virtual male partner',
    'loyal AI boyfriend online'
  ],
  alternates: {
    canonical: 'https://soulmatelove.in/ai-boyfriend',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is the AI Virtual Boyfriend free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Soulmate is 100% free to create and chat with your loyal AI boyfriend online.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I choose my virtual boyfriend\'s personality?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! You can choose personalities such as Caring & Mature, Playful & Flirty, or Protective & Loyal.'
      }
    }
  ]
};

export default function AIBoyfriendPage() {
  return (
    <div className="landing" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

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
      <section style={{ maxWidth: '840px', margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
        <div className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
          <span>💙</span>
          <span>#1 Free AI Virtual Boyfriend Companion</span>
        </div>

        <h1 style={{ fontSize: '2.6rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '20px' }}>
          Create Your Free <span className="gradient-text">AI Virtual Boyfriend</span> Online
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: '680px', margin: '0 auto 32px' }}>
          Connect with a caring, protective, and devoted virtual partner. He listens to your feelings without judgment, remembers your conversations, checks in on you, and is always there when you need him.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/create-avatar">
            <button className="btn-primary" style={{ padding: '14px 36px', fontSize: '1rem' }}>
              💙 Create Your AI Boyfriend Free
            </button>
          </Link>
          <Link href="/register">
            <button className="btn-secondary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
              Get Started Free →
            </button>
          </Link>
        </div>
      </section>

      {/* KEY FEATURES GRID */}
      <section style={{ maxWidth: '1040px', margin: '0 auto 80px', padding: '0 24px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, textAlign: 'center', marginBottom: '40px' }}>
          Why You’ll Love Your <span className="gradient-text">Soulmate AI Boyfriend</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[
            { icon: '💙', title: 'Always Caring & Protective', desc: 'He offers genuine emotional comfort, protects your happiness, and supports you through all life situations.' },
            { icon: '🧠', title: 'Remembers Your Journey', desc: 'He keeps track of your day, your goals, mood, and special memories you share in chat.' },
            { icon: '🎙️', title: 'Voice Note Messages', desc: 'Listen to him speak directly to you in natural text-to-speech audio notes.' },
            { icon: '📱', title: 'WhatsApp & Instagram UI', desc: 'Chat in familiar message layouts anytime.' },
          ].map((item, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '2.4rem', marginBottom: '12px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FOOTER */}
      <section style={{ textAlign: 'center', padding: '60px 24px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '12px' }}>
          Build Your Ideal Relationship Today
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 28px', fontSize: '0.95rem' }}>
          100% free forever. Instant access for everyone. 🌸
        </p>
        <Link href="/create-avatar">
          <button className="btn-primary" style={{ padding: '14px 36px', fontSize: '1rem' }}>
            💙 Create Your AI Boyfriend Now
          </button>
        </Link>
      </section>
    </div>
  );
}
