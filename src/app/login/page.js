'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import SoulmateLogo from '@/components/SoulmateLogo';
import Footer from '@/components/Footer';
import { useLang } from '@/context/LanguageContext';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLang();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('verified') === 'true') {
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
    if (!email || !password) { setError(t('login.bothRequired')); return; }
    setLoading(true);
    try {
      const { error: loginErr } = await supabase.auth.signInWithPassword({ email, password });
      if (loginErr) throw loginErr;
      router.push('/dashboard');
    } catch (err) {
      setError(err.message === 'Invalid login credentials' ? t('login.invalidCreds') : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      const { error: googleErr } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (googleErr) throw googleErr;
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Please try again.');
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
          <Link href="/register">
            <button className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
              {t('nav.register')}
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
            <h1 className="gradient-text">{t('login.title')}</h1>
            <p>{t('login.subtitle')}</p>
          </div>

          {verificationSuccess && (
            <div className="success-msg" style={{ marginBottom: '16px', textAlign: 'center' }}>
              {t('login.verifiedMsg')}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t('login.emailLabel')}</label>
              <input className="input-field" type="email" placeholder="example@gmail.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ margin: 0 }}>{t('login.passwordLabel')}</label>
                <Link href="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--brand-pink)' }}>
                  {t('login.forgotPassword')}
                </Link>
              </div>
              <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" style={{ marginTop: '6px' }} />
            </div>

            {error && <div className="error-msg">⚠️ {error}</div>}

            <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
              {loading ? t('login.loginBtnLoading') : t('login.loginBtn')}
            </button>
          </form>

          <div style={{ margin: '18px 0 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={handleGoogleSignIn}
            disabled={loading}
            style={{
              width: '100%',
              justify: 'center',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-color)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Continue with Google
          </button>

          <div className="auth-link" style={{ marginTop: '16px' }}>
            {t('login.noAccount')} <Link href="/register">{t('login.registerLink')}</Link>
          </div>
          <div className="auth-link" style={{ marginTop: '8px' }}>
            <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{t('login.backHome')}</Link>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
