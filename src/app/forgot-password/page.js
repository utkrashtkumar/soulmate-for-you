'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import SoulmateLogo from '@/components/SoulmateLogo';
import { useLang } from '@/context/LanguageContext';

export default function ForgotPasswordPage() {
  const { t } = useLang();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email || !email.includes('@')) {
      setError(t('register.invalidEmail'));
      return;
    }

    setLoading(true);
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${origin}/reset-password`,
      });

      if (resetError) throw resetError;

      setMessage(t('login.resetSuccess'));
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
          <LanguageToggle compact />
          <ThemeToggle compact />
          <Link href="/login">
            <button className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>{t('login.loginLink') || t('nav.login') || 'Login'}</button>
          </Link>
          <Link href="/register" className="hide-mobile">
            <button className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>{t('login.registerLink') || t('nav.register') || 'Register'}</button>
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
            <h1 className="gradient-text">{t('login.forgotPasswordTitle')}</h1>
            <p>{t('login.forgotPasswordDesc')}</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t('login.emailLabel')}</label>
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
              {loading ? t('login.sendingResetBtn') : t('login.sendResetBtn')}
            </button>
          </form>

          <div className="auth-link" style={{ marginTop: '20px' }}>
            {t('login.backToLogin').split('?')[0]}? <Link href="/login">{t('login.backToLogin').split('?')[1] || t('login.loginLink') || 'Login'}</Link>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="auth-footer">
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
          <Link href="/about" style={{ color: 'var(--text-secondary)' }}>{t('nav.about') || 'About Us'}</Link>
          <span>•</span>
          <Link href="/privacy" style={{ color: 'var(--text-secondary)' }}>{t('nav.privacy') || 'Privacy Policy'}</Link>
          <span>•</span>
          <Link href="/forgot-password" style={{ color: 'var(--brand-pink)', fontWeight: 600 }}>{t('login.forgotPasswordTitle')}</Link>
        </div>
        <p>💕 Soulmate — Loyal Lifelong Understanding Companion</p>
        <p style={{ marginTop: '2px' }}>{t('landing.footerSub') || 'Made with love • All free, always 🌸'}</p>
      </footer>
    </div>
  );
}
