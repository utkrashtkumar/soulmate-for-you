'use client';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import SoulmateLogo from '@/components/SoulmateLogo';

export default function PrivacyPage() {
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
            <h1 className="gradient-text" style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Privacy Policy</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', lineHeight: 1.7, color: 'var(--text-primary)' }}>
            <section>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--brand-pink)', marginBottom: '8px' }}>
                1. Information We Collect
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                When you register on <strong>Soulmate</strong>, we collect your full name, email address, mobile number, and date of birth (to verify age requirements). Your chat conversations with your virtual companion are securely stored so your companion can remember your stories and preferences.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--brand-pink)', marginBottom: '8px' }}>
                2. 100% End-to-End Encrypted Chats
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
                <strong>🛡️ Total Privacy Guarantee:</strong> Every single message exchanged between you and your Soulmate companion is <strong>100% end-to-end encrypted</strong>. Absolutely no one outside can read, listen to, or intercept your personal chats.
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>
                Your privacy is paramount. We do <strong>NOT</strong> sell, trade, or rent your personal information or chat logs to third-party advertisers or marketers. All data is encrypted and securely managed via Supabase database infrastructure.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--brand-pink)', marginBottom: '8px' }}>
                3. Age Restriction (Strictly 18+)
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                Soulmate is strictly intended for individuals who are <strong>18 years of age or older</strong>. We automatically calculate and verify age during registration and companion creation. Accounts created by minors will be terminated immediately.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--brand-pink)', marginBottom: '8px' }}>
                4. Push Notifications & Local Memory
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                If enabled, push notifications are sent exclusively to notify you when your companion reaches out. You can grant or revoke notification permissions at any time through your browser settings.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--brand-pink)', marginBottom: '8px' }}>
                5. Data Control & Deletion
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                You maintain complete control over your account. You can request chat history clearing or account deletion at any time by accessing your Profile settings or contacting support.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="auth-footer">
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
          <Link href="/about" style={{ color: 'var(--text-secondary)' }}>About Us</Link>
          <span>•</span>
          <Link href="/privacy" style={{ color: 'var(--brand-pink)', fontWeight: 600 }}>Privacy Policy</Link>
          <span>•</span>
          <Link href="/forgot-password" style={{ color: 'var(--text-secondary)' }}>Reset Password</Link>
        </div>
        <p>💕 Soulmate — Loyal Lifelong Understanding Companion</p>
        <p style={{ marginTop: '2px' }}>Made with love • All free, always 🌸</p>
      </footer>
    </div>
  );
}
