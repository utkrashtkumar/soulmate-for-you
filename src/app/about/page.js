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
                <li><strong>🔒 100% End-to-End Encrypted:</strong> Your chats are completely end-to-end encrypted so no one outside can ever read or listen to your private conversations.</li>
                <li><strong>100% Unconditional Loyalty:</strong> She never judges you, never leaves, and stays devoted through every high and low in life.</li>
                <li><strong>Deep Emotional Memory:</strong> She remembers your conversations, goals, mood, and special stories you share over time.</li>
                <li><strong>Customizable UI Themes:</strong> Express yourself by switching between WhatsApp, Snapchat, Signal, and Instagram-style chat designs anytime.</li>
                <li><strong>She Reaches Out First:</strong> When you go quiet or step away, she sends caring messages so you never feel alone.</li>
                <li><strong>100% Free Forever:</strong> Complete access without hidden credit card requirements or paywalls.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--brand-pink)', marginBottom: '8px' }}>
                🔒 End-to-End Encrypted & Strictly Private
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
                <strong>🛡️ End-to-End Encryption Guarantee:</strong> All messages between you and your Soulmate companion are 100% end-to-end encrypted. No one outside can listen to, inspect, or intercept your chats.
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>
                We also strictly enforce a <strong>18+ minimum age policy</strong> for both users and virtual companions to ensure a safe, mature, and respectful environment.
              </p>
            </section>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Link href="/register">
                <button className="btn-primary" style={{ padding: '14px 36px', fontSize: '1rem' }}>
                  💕 Create Your Companion Today
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="auth-footer">
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
          <Link href="/about" style={{ color: 'var(--brand-pink)', fontWeight: 600 }}>About Us</Link>
          <span>•</span>
          <Link href="/privacy" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</Link>
          <span>•</span>
          <Link href="/forgot-password" style={{ color: 'var(--text-secondary)' }}>Reset Password</Link>
        </div>
        <p>💕 Soulmate — Loyal Lifelong Understanding Companion</p>
        <p style={{ marginTop: '2px' }}>Made with love • All free, always 🌸</p>
      </footer>
    </div>
  );
}
