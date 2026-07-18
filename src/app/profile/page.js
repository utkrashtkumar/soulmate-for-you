'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import SoulmateLogo from '@/components/SoulmateLogo';
import { useLang } from '@/context/LanguageContext';


export default function ProfilePage() {
  const router = useRouter();
  const { t } = useLang();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifStatus, setNotifStatus] = useState('unknown');
  const [notifMsg, setNotifMsg] = useState('');

  const calculateAge = (dobStr) => {
    if (!dobStr) return null;
    const dob = new Date(dobStr);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  };

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      setProfile({ ...prof, email: session.user.email });
      setLoading(false);

      // Check notification permission
      if ('Notification' in window) {
        setNotifStatus(Notification.permission);
      }
    };
    init();
  }, [router]);

  const requestNotifications = async () => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      setNotifMsg(t('profile.notifMsgSupport'));
      return;
    }

    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      const permission = await Notification.requestPermission();
      setNotifStatus(permission);

      if (permission === 'granted') {
        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidKey || vapidKey === 'your_vapid_public_key') {
          setNotifMsg(`✅ ${t('profile.enabledStatus')} (VAPID key set karo .env mein push ke liye)`);
          return;
        }

        // Convert VAPID key
        const urlBase64ToUint8 = (base64String) => {
          const padding = '='.repeat((4 - base64String.length % 4) % 4);
          const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
          const rawData = window.atob(base64);
          return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
        };

        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8(vapidKey),
        });

        const { data: { session } } = await supabase.auth.getSession();
        await fetch('/api/subscribe-push', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription: sub, userId: session.user.id }),
        });

        setNotifMsg(t('profile.notifMsgGranted'));
      } else {
        setNotifMsg(t('profile.notifMsgDenied'));
      }
    } catch (err) {
      setNotifMsg(t('profile.notifMsgSetup') + err.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) return <div className="loading-screen"><div className="loading-spinner" /></div>;

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <SoulmateLogo size={32} />
          <span className="gradient-text" style={{ marginLeft: '8px' }}>Soulmate</span>
        </div>
        <nav className="sidebar-nav">
          <Link href="/dashboard" className="nav-item"><span className="icon">🏠</span> Dashboard</Link>
          <Link href="/create-avatar" className="nav-item"><span className="icon">✨</span> New Companion</Link>
          <Link href="/profile" className="nav-item active"><span className="icon">👤</span> My Profile</Link>
          <Link href="/upgrade" className="nav-item"><span className="icon">👑</span> Upgrade</Link>
          {profile?.email === 'givekisstome@gmail.com' && (
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
          <button className="nav-item" onClick={handleLogout} style={{ width: '100%', color: '#ff6b6b', background: 'none', border: 'none' }}>
            <span className="icon">🚪</span> {t('profile.logoutBtn')}
          </button>
        </div>
      </aside>

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

        <div className="page-header">
          <h1>👤 <span className="gradient-text">{t('profile.title')}</span></h1>
          <p>{t('profile.subtitle')}</p>
        </div>

        <div className="settings-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {/* Profile Info */}
          <div className="settings-card" style={{ gridColumn: '1 / -1' }}>
            <h3>{t('profile.detailsTitle')}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
              {[
                { label: t('profile.fullNameLabel'), value: profile?.full_name },
                { label: t('profile.emailLabel'), value: profile?.email },
                { label: t('profile.mobileLabel'), value: profile?.mobile },
                { label: t('profile.dobLabel'), value: profile?.dob ? new Date(profile.dob).toLocaleDateString('en-IN') : '--' },
                { label: t('profile.ageLabel'), value: profile?.dob ? `${calculateAge(profile.dob)} ${t('profile.ageLabel').toLowerCase() === 'age' ? 'years' : 'saal'}` : '--' },
                { label: t('profile.memberSince'), value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN') : '--' },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', minWidth: 0 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{value || '--'}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="settings-card">
            <h3>{t('profile.pushTitle')}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
              {t('profile.pushDesc')}
            </p>
            <div style={{ marginBottom: '12px' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontSize: '0.82rem', fontWeight: 600,
                color: notifStatus === 'granted' ? '#00e676' : notifStatus === 'denied' ? '#ff6b6b' : 'var(--text-secondary)',
              }}>
                {notifStatus === 'granted' ? t('profile.enabledStatus') : notifStatus === 'denied' ? t('profile.blockedStatus') : t('profile.notSetStatus')}
              </span>
            </div>
            {notifStatus !== 'granted' && (
              <button className="btn-primary" onClick={requestNotifications} style={{ width: '100%', justifyContent: 'center' }}>
                {t('profile.pushBtn')}
              </button>
            )}
            {notifMsg && <div className="success-msg" style={{ marginTop: '10px', fontSize: '0.82rem' }}>{notifMsg}</div>}
          </div>

          {/* Danger Zone */}
          <div className="settings-card">
            <h3>{t('profile.actionsTitle')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="btn-secondary" onClick={handleLogout} style={{ width: '100%', justifyContent: 'center' }}>
                {t('profile.logoutBtn')}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
