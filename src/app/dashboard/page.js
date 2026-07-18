'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ThemeToggle from '@/components/ThemeToggle';
import SoulmateLogo from '@/components/SoulmateLogo';

const MOOD_EMOJI = { happy: '😊', sad: '😢', jealous: '😤', playful: '😋', romantic: '🥰', angry: '😠' };

function LoveMeter({ value }) {
  return (
    <div className="love-meter">
      <div className="love-meter-label">
        <span>💕 Love Meter</span>
        <span>{value}%</span>
      </div>
      <div className="love-meter-bar">
        <div className="love-meter-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Sidebar({ user, onLogout }) {
  const router = useRouter();
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <SoulmateLogo size={32} />
        <span className="gradient-text" style={{ marginLeft: '8px' }}>Soulmate</span>
      </div>
      <nav className="sidebar-nav">
        <Link href="/dashboard" className={`nav-item ${path === '/dashboard' ? 'active' : ''}`}>
          <span className="icon">🏠</span> Dashboard
        </Link>
        <Link href="/create-avatar" className={`nav-item ${path === '/create-avatar' ? 'active' : ''}`}>
          <span className="icon">✨</span> New Companion
        </Link>
        <Link href="/profile" className={`nav-item ${path === '/profile' ? 'active' : ''}`}>
          <span className="icon">👤</span> My Profile
        </Link>
        <Link href="/upgrade" className={`nav-item ${path === '/upgrade' ? 'active' : ''}`}>
          <span className="icon">👑</span> Upgrade Plan
        </Link>
        {user?.email === 'givekisstome@gmail.com' && (
          <Link href="/admin" className={`nav-item ${path === '/admin' ? 'active' : ''}`} style={{ color: 'gold', borderLeftColor: 'gold' }}>
            <span className="icon">👑</span> Admin Panel
          </Link>
        )}
      </nav>
      <div className="sidebar-footer">
        {user && (
          <div style={{ marginBottom: '12px', padding: '12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>👋 {user.full_name}</div>
            <div>{user.email}</div>
          </div>
        )}
        <div style={{ marginBottom: '10px' }}>
          <ThemeToggle />
        </div>
        <button className="nav-item" onClick={onLogout} style={{ width: '100%', color: '#ff6b6b', background: 'none', border: 'none' }}>
          <span className="icon">🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }

      const { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      const { data: avs } = await supabase.from('avatars').select('*').eq('user_id', session.user.id).order('created_at');

      setUser(session.user);
      setProfile({ ...prof, email: session.user.email });
      setAvatars(avs || []);
      setLoading(false);
    };
    init();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleNewAvatar = () => {
    if (avatars.length >= 2) { setShowPremiumModal(true); return; }
    router.push('/create-avatar');
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p style={{ color: 'var(--text-secondary)' }}>Loading... companion wait kar rahi hai 💕</p>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar user={profile} onLogout={handleLogout} />
      <main className="main-content">
        <div className="page-header">
          <h1>
            Namaste, <span className="gradient-text">{profile?.full_name?.split(' ')[0] || 'Yaar'}</span> 👋
          </h1>
          <p>Apni lifelong understanding companion se chat karo 💕</p>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            { label: 'Companions', value: `${avatars.length}/2`, icon: '💕' },
            { label: 'Total Chats', value: '∞', icon: '💬' },
            { label: 'Plan', value: 'Free', icon: '🌟' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)', padding: '16px 24px',
              display: 'flex', alignItems: 'center', gap: '12px', flex: '1', minWidth: '140px',
            }}>
              <span style={{ fontSize: '1.8rem' }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{s.value}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Avatar Cards */}
        <div className="avatars-grid">
          {avatars.map(av => (
            <div key={av.id} className="avatar-card" onClick={() => router.push(`/chat/${av.id}`)}>
              <div className="avatar-card-banner" />
              <div style={{ position: 'relative' }}>
                <div className="avatar-card-img">
                  {av.avatar_url ? <img src={av.avatar_url} alt={av.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👩'}
                </div>
              </div>
              <div className="avatar-card-body">
                <div className="avatar-card-name">{av.name}</div>
                <div className="avatar-card-meta">
                  <span className="mood-badge">{MOOD_EMOJI[av.mood] || '😊'} {av.mood}</span>
                  <span>{av.personality}</span>
                </div>
                <LoveMeter value={av.love_meter || 0} />
                <div className="avatar-card-actions" onClick={e => e.stopPropagation()}>
                  <button className="btn-primary" style={{ flex: 2 }} onClick={() => router.push(`/chat/${av.id}`)}>
                    💬 Chat Karo
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add new */}
          {avatars.length < 2 && (
            <div className="add-avatar-card" onClick={handleNewAvatar}>
              <div className="add-icon">+</div>
              <div style={{ fontWeight: 600, fontSize: '1rem' }}>Naya Companion Banao</div>
              <div style={{ fontSize: '0.82rem', textAlign: 'center', padding: '0 20px' }}>
                Apni loyal understanding companion create karo 💕
              </div>
            </div>
          )}

          {avatars.length >= 2 && (
            <div className="add-avatar-card" onClick={handleNewAvatar}
              style={{ borderColor: 'rgba(255,215,0,0.3)', color: 'gold' }}>
              <div className="add-icon" style={{ background: 'rgba(255,215,0,0.1)', color: 'gold' }}>👑</div>
              <div style={{ fontWeight: 600, fontSize: '1rem' }}>Premium Plan Chahiye</div>
              <div style={{ fontSize: '0.82rem', textAlign: 'center', padding: '0 20px' }}>
                2 se zyada companions ke liye upgrade karo
              </div>
              <span className="coming-soon-badge">Coming Soon</span>
            </div>
          )}
        </div>
      </main>

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="modal-overlay" onClick={() => setShowPremiumModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowPremiumModal(false)}>✕</button>
            <div className="modal-icon">👑</div>
            <h2>Premium Plan Chahiye!</h2>
            <p>Free plan mein sirf 2 understanding companions bana sakte ho. Teen ya zyada ke liye premium plan lena hoga.</p>
            <div className="premium-features">
              {['Unlimited companions', 'Voice messages', 'Custom personality training', 'Priority AI responses', 'No rate limits'].map(f => (
                <div key={f} className="premium-feature-item">
                  <span className="check">💎</span> {f}
                </div>
              ))}
            </div>
            <span className="coming-soon-badge">🚀 Coming Soon</span>
            <p style={{ marginTop: '16px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Abhi ke liye apne 2 companions ke saath enjoy karo! 💕
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
