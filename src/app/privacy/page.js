'use client';
import Link from 'next/link';
import SoulmateLogo from '@/components/SoulmateLogo';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';

export default function PrivacyPolicyPage() {
  return (
    <div className="landing">
      {/* NAV */}
      <header className="auth-header">
        <Link href="/" className="auth-header-logo">
          <SoulmateLogo size={32} />
          <span className="gradient-text">Soulmate</span>
        </Link>
        <div className="auth-header-actions">
          <Link href="/features" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginRight: '8px' }}>
            Features
          </Link>
          <Link href="/how-to-use" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginRight: '8px' }}>
            How to Use
          </Link>
          <LanguageToggle compact />
          <ThemeToggle compact />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main style={{ maxWidth: '840px', margin: '0 auto', padding: '48px 24px 80px', flex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🔒</div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0 }}>Privacy Policy</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '8px' }}>
            Your privacy, security, and data protection are our absolute highest priority.
          </p>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'inline-block', marginTop: '6px' }}>
            Last Updated: July 2026
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Card 1 */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--brand-pink)', marginBottom: '12px' }}>
              1. 100% Private & Encrypted Conversations
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.7 }}>
              All chat interactions between you and your AI Soulmate companion are protected using industry-standard Row-Level Security (RLS) policies in Supabase. Your chat history is strictly bound to your private user account ID and can <strong>never</strong> be accessed or viewed by any other user.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--brand-pink)', marginBottom: '12px' }}>
              2. Data We Collect & How It Is Used
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: '12px' }}>
              We only collect essential information required to provide your AI companion experience:
            </p>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              <li><strong>Account Profile:</strong> Full name, mobile number, and date of birth used solely for user authentication and birthday celebration events.</li>
              <li><strong>Companion Customization:</strong> Names, personality traits, and custom avatar photos chosen by you.</li>
              <li><strong>Chat Messages:</strong> Conversation history stored securely to maintain companion memory and conversational context.</li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--brand-pink)', marginBottom: '12px' }}>
              3. No Data Selling or Third-Party Sharing
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.7 }}>
              We <strong>do not sell, rent, or trade</strong> your personal information or chat logs to any third-party advertisers, data brokers, or marketing platforms. Your memory logs remain exclusively yours.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--brand-pink)', marginBottom: '12px' }}>
              4. Complete User Control & Account Deletion
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.7 }}>
              You retain full control over your companion and data. At any time, you can clear chat history, update your companion profile, or request account deletion which permanently erases all associated profiles, companions, and message memory from our database.
            </p>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="auth-footer">
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
          <Link href="/features" style={{ color: 'var(--text-secondary)' }}>Features</Link>
          <span>•</span>
          <Link href="/about" style={{ color: 'var(--text-secondary)' }}>About Us</Link>
          <span>•</span>
          <Link href="/contact" style={{ color: 'var(--text-secondary)' }}>Contact Us</Link>
          <span>•</span>
          <Link href="/privacy" style={{ color: 'var(--brand-pink)', fontWeight: 600 }}>Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms" style={{ color: 'var(--text-secondary)' }}>Terms of Service</Link>
        </div>
        <p>💕 Soulmate — Loyal Lifelong Understanding Companion</p>
        <p style={{ marginTop: '2px' }}>Made with love • All free, always 🌸</p>
      </footer>
    </div>
  );
}
