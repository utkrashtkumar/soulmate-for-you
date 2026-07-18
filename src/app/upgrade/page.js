'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import SoulmateLogo from '@/components/SoulmateLogo';
import { useLang } from '@/context/LanguageContext';

function Sidebar({ user, onLogout }) {
  const { t } = useLang();
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <SoulmateLogo size={32} />
        <span className="gradient-text" style={{ marginLeft: '8px' }}>Soulmate</span>
      </div>
      <nav className="sidebar-nav">
        <Link href="/dashboard" className="nav-item">
          <span className="icon">🏠</span> Dashboard
        </Link>
        <Link href="/create-avatar" className="nav-item">
          <span className="icon">✨</span> New Companion
        </Link>
        <Link href="/profile" className="nav-item">
          <span className="icon">👤</span> My Profile
        </Link>
        <Link href="/upgrade" className="nav-item active">
          <span className="icon">👑</span> Upgrade
        </Link>
        {user?.email === 'givekisstome@gmail.com' && (
          <Link href="/admin" className="nav-item" style={{ color: 'gold' }}>
            <span className="icon">👑</span> Admin Panel
          </Link>
        )}
      </nav>
      <div className="sidebar-footer">
        <div style={{ marginBottom: '10px', display: 'flex', gap: '8px' }}>
          <ThemeToggle />
          <LanguageToggle compact />
        </div>
        <button className="nav-item" onClick={onLogout} style={{ width: '100%', color: '#ff6b6b', background: 'none', border: 'none' }}>
          <span className="icon">🚪</span> {t('profile.logoutBtn')}
        </button>
      </div>
    </aside>
  );
}

export default function UpgradePage() {
  const router = useRouter();
  const { t } = useLang();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      setProfile({ ...prof, email: session.user.email });
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    );
  }

  // Get localized features array
  const features = t('upgrade.features') || [];

  return (
    <div className="app-layout">
      <Sidebar user={profile} onLogout={handleLogout} />
      <main className="main-content">
        <header className="app-header">
          <div className="mobile-logo">
            <SoulmateLogo size={28} />
            <span className="gradient-text" style={{ fontWeight: 700, fontSize: '1.1rem' }}>Soulmate</span>
          </div>
          <div className="hide-mobile" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <LanguageToggle compact />
            <ThemeToggle compact />
          </div>
        </header>

        {/* Upgrade Content Card */}
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', paddingTop: '20px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>👑</div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '12px' }}>
            <span className="gradient-text">{t('upgrade.title')}</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '36px', lineHeight: 1.7 }}>
            {t('upgrade.subtitle')}
          </p>

          {/* Coming Soon Banner */}
          <div className="glass-card" style={{
            background: 'linear-gradient(135deg, rgba(255,77,141,0.08) 0%, rgba(168,85,247,0.08) 100%)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)', padding: '28px', marginBottom: '32px',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🚀</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>{t('upgrade.comingSoonTitle')}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {t('upgrade.comingSoonDesc')}
            </p>
            <div style={{ marginTop: '20px' }}>
              <span className="coming-soon-badge" style={{ fontSize: '0.9rem', padding: '8px 20px' }}>🚀 {t('upgrade.comingSoonTitle')}</span>
            </div>
          </div>

          {/* Features Grid */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', color: 'var(--text-secondary)' }}>
            {t('upgrade.featuresTitle')}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '32px' }}>
            {features.map((f, i) => (
              <div key={i} className="glass-card" style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)', padding: '18px 16px', textAlign: 'left',
              }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{f.icon}</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{f.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {t('upgrade.freeNote')}<br />
            {t('upgrade.freeNoteSub')}
          </p>

          <div style={{ marginTop: '24px', marginBottom: '40px' }}>
            <Link href="/dashboard">
              <button className="btn-primary" style={{ padding: '14px 36px' }}>
                {t('upgrade.backBtn')}
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
