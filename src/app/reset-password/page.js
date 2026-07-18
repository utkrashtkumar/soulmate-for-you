'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ThemeToggle from '@/components/ThemeToggle';
import SoulmateLogo from '@/components/SoulmateLogo';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('Password minimum 6 characters ka hona chahiye');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords match nahi kar rahe 😬');
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) throw updateError;

      setSuccess('Naya password set ho gaya! 🎉 Login page par bhej raha hoon...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Password update nahi ho paya. Try again!');
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
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="auth-main-content">
        <div className="auth-card">
          <div className="auth-logo">
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
              <SoulmateLogo size={56} />
            </div>
            <h1 className="gradient-text">Naya Password Set Karo</h1>
            <p>Apna naya strong password enter karo</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Naya Password</label>
              <input
                className="input-field"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Naya Password</label>
              <input
                className="input-field"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="error-msg">⚠️ {error}</div>}
            {success && <div className="success-msg">✅ {success}</div>}

            <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
              {loading ? '⏳ Updating password...' : '🔒 Set New Password'}
            </button>
          </form>

          <div className="auth-link" style={{ marginTop: '20px' }}>
            <Link href="/login">Return to Login</Link>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="auth-footer">
        <p>💕 Soulmate — Loyal Lifelong Understanding Companion</p>
        <p style={{ marginTop: '2px' }}>Made with love • All free, always 🌸</p>
      </footer>
    </div>
  );
}
