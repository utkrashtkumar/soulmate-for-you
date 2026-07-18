'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ThemeToggle from '@/components/ThemeToggle';
import SoulmateLogo from '@/components/SoulmateLogo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${origin}/reset-password`,
      });

      if (resetError) throw resetError;

      setMessage('Password reset link sent to your email! Please check your inbox 📬');
    } catch (err) {
      setError(err.message || 'Kuch error aa gaya. Dobara try karo!');
    } finally {
      setLoading(false);
    }
  };

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
            <button className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>Register</button>
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="auth-main-content">
        <div className="auth-card">
          <div className="auth-logo">
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
              <SoulmateLogo size={56} />
            </div>
            <h1 className="gradient-text">Reset Password</h1>
            <p>Apna registered email address dalo reset link pane ke liye</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                className="input-field"
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            {error && <div className="error-msg">⚠️ {error}</div>}
            {message && <div className="success-msg">✅ {message}</div>}

            <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
              {loading ? '⏳ Sending reset link...' : '🔑 Send Reset Link'}
            </button>
          </form>

          <div className="auth-link" style={{ marginTop: '20px' }}>
            Password yaad aa gaya? <Link href="/login">Login Karo</Link>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="auth-footer">
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
          <Link href="/about" style={{ color: 'var(--text-secondary)' }}>About Us</Link>
          <span>•</span>
          <Link href="/privacy" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</Link>
          <span>•</span>
          <Link href="/forgot-password" style={{ color: 'var(--brand-pink)', fontWeight: 600 }}>Reset Password</Link>
        </div>
        <p>💕 Soulmate — Loyal Lifelong Understanding Companion</p>
        <p style={{ marginTop: '2px' }}>Made with love • All free, always 🌸</p>
      </footer>
    </div>
  );
}
