'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ThemeToggle from '@/components/ThemeToggle';
import SoulmateLogo from '@/components/SoulmateLogo';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('verified') === 'true') {
        // Sign out to clear the auto-login session created by the email hash redirect
        supabase.auth.signOut().then(() => {
          setVerificationSuccess(true);
          router.replace('/login');
        });
      }
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Email aur password dono chahiye 😅'); return; }
    setLoading(true);
    try {
      const { error: loginErr } = await supabase.auth.signInWithPassword({ email, password });
      if (loginErr) throw loginErr;
      router.push('/dashboard');
    } catch (err) {
      setError(err.message === 'Invalid login credentials' ? 'Galat email ya password 😬 Try karo dobara!' : err.message);
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
          <Link href="/register">
            <button className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
              Register
            </button>
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
            <h1 className="gradient-text">Login Karo</h1>
            <p>Lifelong understanding companion wait kar rahi hai 🥺</p>
          </div>

          {verificationSuccess && (
            <div className="success-msg" style={{ marginBottom: '16px', textAlign: 'center' }}>
              ✅ Email Verified! Now you can login into your account.
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input className="input-field" type="email" placeholder="example@gmail.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ margin: 0 }}>Password</label>
                <Link href="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--brand-pink)' }}>
                  Forgot Password?
                </Link>
              </div>
              <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" style={{ marginTop: '6px' }} />
            </div>

            {error && <div className="error-msg">⚠️ {error}</div>}

            <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
              {loading ? '⏳ Login ho raha hai...' : '💕 Login Karo'}
            </button>
          </form>

          <div className="auth-link" style={{ marginTop: '16px' }}>
            Naya account banao? <Link href="/register">Register Karo</Link>
          </div>
          <div className="auth-link" style={{ marginTop: '8px' }}>
            <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>← Back to Home</Link>
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
          <Link href="/forgot-password" style={{ color: 'var(--text-secondary)' }}>Reset Password</Link>
        </div>
        <p>💕 Soulmate — Loyal Lifelong Understanding Companion</p>
        <p style={{ marginTop: '2px' }}>Made with love • All free, always 🌸</p>
      </footer>
    </div>
  );
}
