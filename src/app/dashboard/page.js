'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import SoulmateLogo from '@/components/SoulmateLogo';
import UpdatePhotoModal from '@/components/UpdatePhotoModal';
import InstallAppPrompt from '@/components/InstallAppPrompt';

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

function Sidebar({ user, onLogout, onShare }) {
  const router = useRouter();
  const { t } = useLang();
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <SoulmateLogo size={32} />
        <span className="gradient-text" style={{ marginLeft: '8px' }}>Soulmate</span>
      </div>
      <nav className="sidebar-nav">
        <Link href="/" className={`nav-item ${path === '/' ? 'active' : ''}`}>
          <span className="icon">🌐</span> {t('nav.websiteHome')}
        </Link>
        <Link href="/dashboard" className={`nav-item ${path === '/dashboard' ? 'active' : ''}`}>
          <span className="icon">🏠</span> {t('nav.dashboard')}
        </Link>
        <Link href="/create-avatar" className={`nav-item ${path === '/create-avatar' ? 'active' : ''}`}>
          <span className="icon">✨</span> {t('nav.newCompanion')}
        </Link>
        <Link href="/profile" className={`nav-item ${path === '/profile' ? 'active' : ''}`}>
          <span className="icon">👤</span> {t('nav.profile')}
        </Link>
        <Link href="/upgrade" className={`nav-item ${path === '/upgrade' ? 'active' : ''}`}>
          <span className="icon">👑</span> {t('nav.upgrade')}
        </Link>
        <button onClick={onShare} className="nav-item" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', padding: '12px 14px' }}>
          <span className="icon">🔗</span> {t('dashboard.shareCta')}
        </button>
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
        <div style={{ marginBottom: '10px', display: 'flex', gap: '8px' }}>
          <ThemeToggle />
          <LanguageToggle compact />
        </div>
        <button className="nav-item" onClick={onLogout} style={{ width: '100%', color: '#ff6b6b', background: 'none', border: 'none' }}>
          <span className="icon">🚪</span> {t('common.logout')}
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
  const [selectedAvatarForPhoto, setSelectedAvatarForPhoto] = useState(null);

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

  const handleShare = async () => {
    const shareData = {
      title: t('dashboard.shareTitle'),
      text: t('dashboard.shareText'),
      url: window.location.origin,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert(t('dashboard.shareSuccess'));
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert(t('dashboard.shareSuccess'));
      }
    }
  };

  const { t } = useLang();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p style={{ color: 'var(--text-secondary)' }}>{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar user={profile} onLogout={handleLogout} onShare={handleShare} />
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
          <h1>
            {t('dashboard.greeting')}, <span className="gradient-text">{profile?.full_name?.split(' ')[0] || 'Friend'}</span> {t('dashboard.greetingSuffix')}
          </h1>
          <p>{t('dashboard.subtitle')}</p>
        </div>

        {/* Share Banner Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,77,141,0.08) 0%, rgba(168,85,247,0.08) 100%)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '20px 24px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }} className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1', minWidth: '240px' }}>
            <span style={{ fontSize: '2.5rem' }}>🎁</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>{t('dashboard.inviteTitle')}</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                {t('dashboard.inviteSub')}
              </p>
            </div>
          </div>
          <button className="btn-primary" onClick={handleShare} style={{ padding: '10px 24px', fontSize: '0.85rem' }}>
            🔗 {t('dashboard.shareCta')}
          </button>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            { label: t('dashboard.statsCompanions'), value: `${avatars.length}/2`, icon: '💕' },
            { label: t('dashboard.statsChats'), value: '∞', icon: '💬' },
            { label: t('dashboard.statsPlan'), value: t('dashboard.planFree'), icon: '🌟' },
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
                  {av.avatar_url && (av.avatar_url.startsWith('http') || av.avatar_url.startsWith('data:')) ? (
                    <img src={av.avatar_url} alt={av.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '1.8rem' }}>{av.avatar_url || '👩'}</span>
                  )}
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
                    {t('dashboard.chatNow')}
                  </button>
                  <button
                    className="btn-secondary"
                    style={{ padding: '0 12px', fontSize: '1.1rem' }}
                    title={t('createAvatar.changePhotoBtn')}
                    onClick={() => setSelectedAvatarForPhoto(av)}
                  >
                    📸
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add new */}
          {avatars.length < 2 && (
            <div className="add-avatar-card" onClick={handleNewAvatar}>
              <div className="add-icon">+</div>
              <div style={{ fontWeight: 600, fontSize: '1rem' }}>{t('dashboard.addNew')}</div>
              <div style={{ fontSize: '0.82rem', textAlign: 'center', padding: '0 20px' }}>
                {t('dashboard.noCompanionsSub')}
              </div>
            </div>
          )}

          {avatars.length >= 2 && (
            <div className="add-avatar-card" onClick={handleNewAvatar}
              style={{ borderColor: 'rgba(255,215,0,0.3)', color: 'gold' }}>
              <div className="add-icon" style={{ background: 'rgba(255,215,0,0.1)', color: 'gold' }}>👑</div>
              <div style={{ fontWeight: 600, fontSize: '1rem' }}>{t('dashboard.premiumTitle')}</div>
              <div style={{ fontSize: '0.82rem', textAlign: 'center', padding: '0 20px' }}>
                {t('dashboard.premiumDesc')}
              </div>
              <span className="coming-soon-badge">{t('common.comingSoon')}</span>
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
            <h2>{t('dashboard.premiumTitle')}</h2>
            <p>{t('dashboard.premiumDesc')}</p>
            <div className="premium-features">
              {['Unlimited companions', 'Voice messages', 'Custom personality training', 'Priority AI responses', 'No rate limits'].map(f => (
                <div key={f} className="premium-feature-item">
                  <span className="check">💎</span> {f}
                </div>
              ))}
            </div>
            <span className="coming-soon-badge">🚀 {t('common.comingSoon')}</span>
            <p style={{ marginTop: '16px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {t('upgrade.freeNote')}
            </p>
          </div>
        </div>
      )}
      {/* Update Photo Modal */}
      <UpdatePhotoModal
        avatar={selectedAvatarForPhoto}
        isOpen={!!selectedAvatarForPhoto}
        onClose={() => setSelectedAvatarForPhoto(null)}
        onSuccess={(newUrl) => {
          if (selectedAvatarForPhoto) {
            setAvatars(prev => prev.map(a => a.id === selectedAvatarForPhoto.id ? { ...a, avatar_url: newUrl } : a));
          }
        }}
      />
      <InstallAppPrompt />
    </div>
  );
}
