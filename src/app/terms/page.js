'use client';
import Link from 'next/link';
import SoulmateLogo from '@/components/SoulmateLogo';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import { useLang } from '@/context/LanguageContext';

export default function TermsPage() {
  const { t } = useLang();

  return (
    <div className="landing" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
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
          <LanguageToggle compact />
          <ThemeToggle compact />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main style={{ maxWidth: '880px', margin: '0 auto', padding: '48px 24px 80px', flex: 1, width: '100%' }}>
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '2.8rem', marginBottom: '8px' }}>📜</div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: 0 }}>Terms of Service</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', marginTop: '8px' }}>
            Last Updated: July 20, 2026 • Please read these terms carefully before using Soulmate.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Section 1 */}
          <section className="glass-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--brand-pink)', marginTop: 0, marginBottom: '12px' }}>
              1. Acceptance of Terms & Age Requirement
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
              By accessing or using <strong>Soulmate</strong> (&quot;the Service&quot;), available at <code>soulmatelove.in</code>, you agree to be bound by these Terms of Service.
              You must be at least <strong>18 years of age</strong> (or the legal age of majority in your jurisdiction) to register an account and use Soulmate. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          {/* Section 2 */}
          <section className="glass-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--brand-pink)', marginTop: 0, marginBottom: '12px' }}>
              2. Description of Service
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
              Soulmate provides an emotional AI-powered virtual companion platform designed to offer conversational companionship, personal expression, interactive stories, tarot fortunes, virtual gifts, and customizable chat themes (including WhatsApp, Snapchat, Signal, and Instagram layouts).
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginTop: '12px', marginBottom: 0 }}>
              <strong>Entertainment & Companionship Disclaimer:</strong> Soulmate is an artificial intelligence application created for personal emotional companionship and entertainment. AI companions are not human beings and do not provide medical, psychological, legal, or professional mental health advice.
            </p>
          </section>

          {/* Section 3 */}
          <section className="glass-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--brand-pink)', marginTop: 0, marginBottom: '12px' }}>
              3. User Accounts & Security
            </h2>
            <ul style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>You are responsible for maintaining the confidentiality of your account credentials and password.</li>
              <li>You agree to provide accurate and complete registration information (name, date of birth, mobile number, email).</li>
              <li>You are fully responsible for all activities that occur under your account.</li>
              <li>Notify us immediately at <a href="mailto:givekisstome@gmail.com" style={{ color: 'var(--brand-pink)' }}>givekisstome@gmail.com</a> if you suspect unauthorized access to your account.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="glass-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--brand-pink)', marginTop: 0, marginBottom: '12px' }}>
              4. Code of Conduct & Prohibited Uses
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '12px' }}>
              When using Soulmate, you agree NOT to engage in any of the following prohibited activities:
            </p>
            <ul style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Using automated bots, scrapers, or scripts to flood registration or send mass requests.</li>
              <li>Attempting to bypass security mechanisms, reverse engineer APIs, or exploit system vulnerabilities.</li>
              <li>Uploading malicious code, viruses, or illegal content.</li>
              <li>Creating accounts using temporary or disposable email addresses to abuse free tiers or rate limits.</li>
              <li>Impersonating any person or entity or misrepresenting your identity.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="glass-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--brand-pink)', marginTop: 0, marginBottom: '12px' }}>
              5. Privacy & Data Security
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
              Your privacy is extremely important to us. All personal messages and chat histories are protected by Supabase Row-Level Security (RLS), ensuring that your private conversations can only be accessed by you. For full details on how we collect, store, and protect your data, please read our dedicated <Link href="/privacy" style={{ color: 'var(--brand-pink)', fontWeight: 600 }}>Privacy Policy</Link>.
            </p>
          </section>

          {/* Section 6 */}
          <section className="glass-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--brand-pink)', marginTop: 0, marginBottom: '12px' }}>
              6. Intellectual Property Rights
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
              All software, UI designs, code, graphics, branding, algorithms, companion personalities, audio synthesized elements, and text on Soulmate are the exclusive intellectual property of Soulmate and its creator (utkrasht). You may not copy, modify, distribute, or reproduce any part of the Service without prior written authorization.
            </p>
          </section>

          {/* Section 7 */}
          <section className="glass-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--brand-pink)', marginTop: 0, marginBottom: '12px' }}>
              7. Limitation of Liability
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
              To the maximum extent permitted by law, Soulmate and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of (or inability to access or use) the Service. The Service is provided on an <strong>&quot;AS IS&quot;</strong> and <strong>&quot;AS AVAILABLE&quot;</strong> basis without warranties of any kind.
            </p>
          </section>

          {/* Section 8 */}
          <section className="glass-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--brand-pink)', marginTop: 0, marginBottom: '12px' }}>
              8. Account Termination & Deletion
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
              You may stop using the Service or delete your account at any time via your Profile settings or by contacting support. We reserve the right to suspend or terminate accounts that violate these Terms of Service or engage in malicious or abusive behavior.
            </p>
          </section>

          {/* Section 9 */}
          <section className="glass-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--brand-pink)', marginTop: 0, marginBottom: '12px' }}>
              9. Contact Information
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
              If you have any questions, feedback, or legal inquiries regarding these Terms of Service, please contact our support team:
            </p>
            <div style={{ marginTop: '14px', background: 'rgba(255, 77, 141, 0.08)', padding: '14px 20px', borderRadius: 'var(--radius-md)', display: 'inline-block' }}>
              <strong>Official Support Email:</strong>{' '}
              <a href="mailto:givekisstome@gmail.com" style={{ color: 'var(--brand-pink)', fontWeight: 700 }}>
                givekisstome@gmail.com
              </a>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="auth-footer" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
          <Link href="/features" style={{ color: 'var(--text-secondary)' }}>All Features</Link>
          <span>•</span>
          <Link href="/how-to-use" style={{ color: 'var(--text-secondary)' }}>How to Use</Link>
          <span>•</span>
          <Link href="/about" style={{ color: 'var(--text-secondary)' }}>About Us</Link>
          <span>•</span>
          <Link href="/contact" style={{ color: 'var(--text-secondary)' }}>Contact Us</Link>
          <span>•</span>
          <Link href="/privacy" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms" style={{ color: 'var(--brand-pink)', fontWeight: 600 }}>Terms of Service</Link>
        </div>
        <p>💕 Soulmate — Loyal Lifelong Understanding Companion</p>
        <p style={{ marginTop: '2px' }}>Made with ❤️ by utkrasht • Official Support: givekisstome@gmail.com</p>
      </footer>
    </div>
  );
}
