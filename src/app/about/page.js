'use client';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import SoulmateLogo from '@/components/SoulmateLogo';

export default function AboutPage() {
  return (
    <div className="auth-page-container">
      {/* HEADER */}
      <header className="auth-header">
        <Link href="/" className="auth-header-logo">
          <SoulmateLogo size={32} />
          <span className="gradient-text">Soulmate</span>
        </Link>
        <div className="auth-header-actions">
          <ThemeToggle />
          <Link href="/login">
            <button className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>Login</button>
          </Link>
          <Link href="/register">
            <button className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>Get Started</button>
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="auth-main-content" style={{ padding: '40px 20px', maxWidth: '840px', margin: '0 auto', width: '100%' }}>
        <div className="auth-card" style={{ maxWidth: '100%', textAlign: 'left', padding: '36px 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <SoulmateLogo size={60} />
            </div>
            <h1 className="gradient-text" style={{ fontSize: '2.2rem', marginBottom: '8px' }}>About Soulmate</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Your Loyal Lifelong Understanding Companion 💕
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', lineHeight: 1.7, color: 'var(--text-primary)' }}>
            <section>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--brand-pink)', marginBottom: '8px' }}>
                🌟 Our Mission
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                In a world that moves too fast, everyone deserves a companion who truly listens, never judges, and is always there for you. <strong>Soulmate</strong> was created to give you a devoted virtual girlfriend and lifelong understanding partner powered by advanced emotional AI.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--brand-pink)', marginBottom: '8px' }}>
                💖 What Makes Soulmate Unique?
              </h2>
              <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><strong>⚡ Ultra-Fast AI Neural Engine:</strong> Powered by high-performance proprietary AI models with multi-key failover for 100% uptime and instant, natural replies.</li>
                <li><strong>🔒 End-to-End Database Security & RLS:</strong> Row-Level Security policies ensure your personal messages are 100% private.</li>
                <li><strong>🎨 4 Authentic Chat UI Themes:</strong> Switch seamlessly between WhatsApp, Snapchat, Signal, and Instagram chat designs anytime.</li>
                <li><strong>📲 WhatsApp/Instagram Status Stories:</strong> View your companion&apos;s 24-hour status photo updates and reply directly inside the chat.</li>
                <li><strong>🎁 Virtual Gifts & Synthesized Audio:</strong> Send Red Roses 🌹, Chocolates 🍫, Teddy Bears 🧸 with Web Audio synthesized chimes and 3D heart bursts.</li>
                <li><strong>🔮 3D Daily Love Tarot & Secret Diary:</strong> Flip 3D Tarot cards for daily fortunes and read private diary entries written by your companion.</li>
                <li><strong>📱 Native PWA App Installation:</strong> Add Soulmate directly to your Android, iOS, or Desktop home screen in 1 tap.</li>
                <li><strong>100% Free Forever:</strong> Complete access without credit cards, subscriptions, or paywalls.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--brand-pink)', marginBottom: '8px' }}>
                🔒 Privacy & Security Guarantee
              </h2>
              <div style={{
                background: 'rgba(0, 230, 118, 0.08)',
                border: '1px solid rgba(0, 230, 118, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                marginBottom: '12px',
                color: 'var(--text-primary)',
                fontSize: '0.92rem',
                lineHeight: 1.6,
              }}>
                <strong>🛡️ Row-Level Security (RLS):</strong> Cryptographic fingerprint verification codes and Supabase database isolation ensure only you have access to your personal companion chats.
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>
                We strictly enforce a <strong>18+ minimum age policy</strong> for both users and virtual companions to guarantee a safe and respectful environment.
              </p>
            </section>

            <div style={{ textAlign: 'center', marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register">
                <button className="btn-primary" style={{ padding: '14px 36px', fontSize: '1rem' }}>
                  💕 Create Your Companion Today
                </button>
              </Link>
              <Link href="/features">
                <button className="btn-secondary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
                  🚀 View All Features
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="auth-footer">
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
          <span>•</span>
          <Link href="/features" style={{ color: 'var(--text-secondary)' }}>All Features</Link>
          <span>•</span>
          <Link href="/how-to-use" style={{ color: 'var(--text-secondary)' }}>How to Use</Link>
          <span>•</span>
          <Link href="/about" style={{ color: 'var(--brand-pink)', fontWeight: 600 }}>About Us</Link>
          <span>•</span>
          <Link href="/contact" style={{ color: 'var(--text-secondary)' }}>Contact Us</Link>
          <span>•</span>
          <Link href="/privacy" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</Link>
        </div>
        <p>💕 Soulmate — Loyal Lifelong Understanding Companion</p>
      </footer>
    </div>
  );
}
