'use client';
import { useState } from 'react';
import Link from 'next/link';
import SoulmateLogo from '@/components/SoulmateLogo';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import HeaderUserAvatar from '@/components/HeaderUserAvatar';
import { useLang } from '@/context/LanguageContext';

export default function ContactPage() {
  const { t } = useLang();
  const [form, setForm] = useState({ name: '', email: '', subject: 'general', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.message.trim()) {
      setError('Please enter your message before sending.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name || 'Anonymous Guest',
          email: form.email || null,
          category: form.subject,
          rating: 5,
          message: form.message,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message.');

      setSuccess(true);
      setForm({ name: '', email: '', subject: 'general', message: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing">
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
          <HeaderUserAvatar />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main style={{ maxWidth: '840px', margin: '0 auto', padding: '48px 24px 80px', flex: 1, width: '100%' }}>
        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '2.8rem', marginBottom: '8px' }}>📬</div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: 0 }}>Contact Us</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '8px', maxWidth: '560px', margin: '8px auto 0' }}>
            Have a question, feedback, or need support? We&apos;d love to hear from you!
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
          {/* Direct Contact Info Card */}
          <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>Get in Touch</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              Our dedicated support team is available 24/7. Feel free to reach out directly via email or send us a message using the form.
            </p>

            <div style={{
              background: 'rgba(255, 77, 141, 0.08)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}>
              <span style={{ fontSize: '1.8rem' }}>✉️</span>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Official Support Email</div>
                <a href="mailto:givekisstome@gmail.com" style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--brand-pink)' }}>
                  givekisstome@gmail.com
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <span>🔒</span> 100% Private & Encrypted Support
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <span>⚡</span> Average response time: under 24 hours
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <span>🌸</span> Free user assistance & feature requests
              </div>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="glass-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '18px' }}>Send Us a Message</h2>

            {success ? (
              <div style={{
                background: 'rgba(0, 230, 118, 0.12)',
                border: '1px solid rgba(0, 230, 118, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🎉</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#00e676', margin: 0 }}>Message Sent Successfully!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '6px' }}>
                  Thank you for reaching out. Our team will review your message and get back to you at <strong>givekisstome@gmail.com</strong>!
                </p>
                <button
                  className="btn-secondary"
                  onClick={() => setSuccess(false)}
                  style={{ marginTop: '16px', fontSize: '0.85rem' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {error && <div className="error-msg">{error}</div>}

                <div className="form-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter your name (optional)"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Your Email Address</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Subject / Category</label>
                  <select
                    className="input-field"
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                  >
                    <option value="general">💬 General Inquiry</option>
                    <option value="feature">✨ Feature Request</option>
                    <option value="bug">🐛 Bug Report</option>
                    <option value="account">👤 Account & Privacy</option>
                    <option value="other">❓ Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Message <span style={{ color: 'var(--brand-pink)' }}>*</span></label>
                  <textarea
                    className="input-field"
                    rows={4}
                    placeholder="Write your question, idea, or issue here..."
                    required
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem', marginTop: '4px' }}
                >
                  {loading ? 'Sending...' : '✉️ Send Message'}
                </button>
              </form>
            )}
          </div>
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
          <Link href="/contact" style={{ color: 'var(--brand-pink)', fontWeight: 600 }}>Contact Us</Link>
          <span>•</span>
          <Link href="/privacy" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</Link>
        </div>
        <p>💕 Soulmate — Loyal Lifelong Understanding Companion</p>
        <p style={{ marginTop: '2px' }}>Made with ❤️ by utkrasht • Official Support: givekisstome@gmail.com</p>
      </footer>
    </div>
  );
}
