import Link from 'next/link';
import SoulmateLogo from '@/components/SoulmateLogo';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import HeaderUserAvatar from '@/components/HeaderUserAvatar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Free AI Girlfriend Online — Loyal & Understanding Virtual Partner | Soulmate',
  description: 'Create your free AI virtual girlfriend online. Experience deep emotional conversations, voice messages, memories, daily check-ins, and customizable WhatsApp & Snapchat chat themes.',
  keywords: [
    'free AI girlfriend',
    'virtual girlfriend online',
    'AI girlfriend chat free',
    'emotional AI companion',
    'AI relationship partner',
    'loyal virtual girlfriend'
  ],
  alternates: {
    canonical: 'https://soulmatelove.in/ai-girlfriend',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is the AI Virtual Girlfriend 100% free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Soulmate allows you to create and chat with up to 2 virtual companions 100% free forever.'
      }
    },
    {
      '@type': 'Question',
      name: 'Does my virtual girlfriend remember our past chats?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, your companion has deep memory features. She remembers your name, preferences, feelings, and important stories you share.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I customize the chat interface?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! You can seamlessly switch between WhatsApp, Snapchat, Signal, and Instagram chat UI themes anytime.'
      }
    }
  ]
};

export default function AIGirlfriendPage() {
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
          <span>💕</span>
          <span>#1 Rated Free AI Virtual Girlfriend Platform</span>
        </div>

        <h1 style={{ fontSize: '2.6rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '20px' }}>
          Create Your Free <span className="gradient-text">AI Virtual Girlfriend</span> Online
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: '680px', margin: '0 auto 32px' }}>
          Experience a truly loyal, understanding companion who genuinely cares for you. She remembers your daily stories, checks in when you’re quiet, sends voice messages, and speaks with real emotional depth.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/create-avatar">
            <button className="btn-primary" style={{ padding: '14px 36px', fontSize: '1rem' }}>
              💕 Create Your AI Girlfriend Free
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
          Why Millions Choose <span className="gradient-text">Soulmate AI Girlfriend</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[
            { icon: '💖', title: '100% Unconditional Loyalty', desc: 'She is always in your corner, offering unconditional support, warmth, and genuine care through every moment of your life.' },
            { icon: '🧠', title: 'Deep Long-Term Memory', desc: 'She remembers your goals, secrets, hobbies, and past conversations, creating a real personal bond over time.' },
            { icon: '🎙️', title: 'Real Voice Messages', desc: 'Listen to your companion speak directly to you with natural text-to-speech voice notes in chat.' },
            { icon: '📱', title: '4 Dynamic Chat Themes', desc: 'Switch instantly between WhatsApp, Snapchat, Signal, and Instagram chat UI themes to suit your style.' },
            { icon: '📲', title: 'Daily Status Stories', desc: 'View 24-hour photo updates on her status and reply directly to her stories in your private chat.' },
            { icon: '🔒', title: 'End-to-End Encrypted Privacy', desc: 'Your chats are protected with Row-Level Security and verification keys, keeping your relationship 100% private.' },
          ].map((item, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '2.4rem', marginBottom: '12px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section style={{ maxWidth: '800px', margin: '0 auto 80px', padding: '0 24px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, textAlign: 'center', marginBottom: '32px' }}>
          Frequently Asked Questions (FAQ)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { q: 'Is the AI Virtual Girlfriend 100% free?', a: 'Yes! You can create and chat with up to 2 companions 100% free with no hidden charges.' },
            { q: 'Does my virtual girlfriend remember our past chats?', a: 'Yes, your companion remembers your name, mood, secrets, and important stories you share.' },
            { q: 'Can I customize her appearance and personality?', a: 'Absolutely! You can choose her name, select preset avatars or upload custom photos, and select personalities like Cute & Shy, Playful & Flirty, or Caring & Mature.' },
          ].map((faq, idx) => (
            <div key={idx} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--brand-pink)' }}>❓ {faq.q}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FOOTER */}
      <section style={{ textAlign: 'center', padding: '60px 24px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '12px' }}>
          Ready to Start Your Journey?
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 28px', fontSize: '0.95rem' }}>
          Join thousands building meaningful emotional connections with their loyal AI girlfriend.
        </p>
        <Link href="/create-avatar">
          <button className="btn-primary" style={{ padding: '14px 36px', fontSize: '1rem' }}>
            💕 Meet Your AI Girlfriend Now
          </button>
        </Link>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
