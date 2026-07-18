'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import SoulmateLogo from '@/components/SoulmateLogo';
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

          <div className="auth-link" style={{ marginTop: '16px' }}>
            {t('login.noAccount')} <Link href="/register">{t('login.registerLink')}</Link>
          </div>
          <div className="auth-link" style={{ marginTop: '8px' }}>
            <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{t('login.backHome')}</Link>
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
        <p>{t('landing.footerTagline')}</p>
        <p style={{ marginTop: '2px' }}>{t('landing.footerSub')}</p>
      </footer>
    </div>
  );
}
