'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import SoulmateLogo from '@/components/SoulmateLogo';
import HeaderUserAvatar from '@/components/HeaderUserAvatar';
import DatePicker from '@/components/DatePicker';
import { useLang } from '@/context/LanguageContext';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
];

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useLang();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    fullName: '',
    mobile: '',
    dob: '',
    gender: 'male',
    avatarUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  // Notification state
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

      let { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      
      if (!prof) {
        const googleName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User';
        const googlePic = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || '';
        
        const { data: createdProf } = await supabase.from('profiles').upsert({
          id: session.user.id,
          full_name: googleName,
          avatar_url: googlePic,
          created_at: new Date().toISOString(),
        }).select().single();

        prof = createdProf || { id: session.user.id, full_name: googleName, avatar_url: googlePic };
      }

      if (prof) {
        let dobVal = '';
        if (prof.dob) {
          if (prof.dob.includes('-')) {
            const [y, m, d] = prof.dob.split('-');
            dobVal = `${d}${m}${y}`;
          } else {
            dobVal = prof.dob;
          }
        }

        setProfile({ ...prof, email: session.user.email });
        setForm({
          fullName: prof.full_name || '',
          mobile: prof.mobile || '',
          dob: dobVal,
          gender: prof.gender || 'male',
          avatarUrl: prof.avatar_url || '',
        });
      }

      setLoading(false);

      if ('Notification' in window) {
        setNotifStatus(Notification.permission);
      }
    };
    init();
  }, [router]);

  // Handle custom photo file upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setSaveError('Photo size must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Data = uploadEvent.target?.result;
      if (base64Data) {
        setForm(prev => ({ ...prev, avatarUrl: base64Data }));
        setSaveSuccess('Profile photo updated! Click "Save Profile Changes" to apply.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Save profile updates to database
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess('');
    setSaveError('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Session expired. Please log in again.');

      let dobFormatted = null;
      if (form.dob && form.dob.length === 8) {
        const d = form.dob.slice(0, 2);
        const m = form.dob.slice(2, 4);
        const y = form.dob.slice(4, 8);
        dobFormatted = `${y}-${m}-${d}`;
      } else if (form.dob && form.dob.includes('-')) {
        dobFormatted = form.dob;
      }

      // 1. Update Supabase Auth User Metadata (Always succeeds)
      await supabase.auth.updateUser({
        data: {
          full_name: form.fullName.trim(),
          avatar_url: form.avatarUrl,
        }
      });

      // 2. Update public.profiles table
      const profileUpdateData = {
        full_name: form.fullName.trim(),
        mobile: form.mobile.trim(),
        gender: form.gender,
        avatar_url: form.avatarUrl,
      };

      if (dobFormatted) {
        profileUpdateData.dob = dobFormatted;
      }

      let { error: updateErr } = await supabase
        .from('profiles')
        .update(profileUpdateData)
        .eq('id', session.user.id);

      if (updateErr) throw updateErr;

      setProfile(prev => ({
        ...prev,
        full_name: form.fullName.trim(),
        mobile: form.mobile.trim(),
        gender: form.gender,
        dob: dobFormatted || prev?.dob,
        avatar_url: form.avatarUrl,
      }));

      setSaveSuccess('Profile details updated successfully! 💕');
      // Trigger header refresh across app
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      setSaveError('Failed to update profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

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
          setNotifMsg(`✅ ${t('profile.enabledStatus')}`);
          return;
        }

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
            <HeaderUserAvatar />
          </div>
        </header>

        <div className="page-header">
          <h1>👤 <span className="gradient-text">My Account & Profile</span></h1>
          <p>Update your personal info and custom profile avatar photo</p>
        </div>

        {saveSuccess && <div className="success-msg" style={{ marginBottom: '20px' }}>✅ {saveSuccess}</div>}
        {saveError && <div className="error-msg" style={{ marginBottom: '20px' }}>⚠️ {saveError}</div>}

        <div className="settings-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {/* PROFILE PICTURE & AVATAR EDIT CARD */}
          <div className="settings-card" style={{ gridColumn: '1 / -1' }}>
            <h3>📷 Profile Picture</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', marginTop: '16px' }}>
              {/* Main Avatar Preview */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  padding: '3px',
                  background: 'linear-gradient(135deg, var(--brand-pink), #8a2be2)',
                  boxShadow: '0 4px 20px rgba(255, 77, 141, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {form.avatarUrl ? (
                    <img
                      src={form.avatarUrl}
                      alt="Profile Avatar"
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', background: 'var(--bg-card)' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%', borderRadius: '50%', background: 'var(--bg-card)',
                      color: 'var(--brand-pink)', fontWeight: 800, fontSize: '2.5rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {(form.fullName || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Upload & Presets */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '240px' }}>
                <div>
                  <label className="btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                    📁 Upload Custom Photo
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                  </label>
                  {form.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setForm(p => ({ ...p, avatarUrl: '' }))}
                      style={{ background: 'none', border: 'none', color: '#ff6b6b', fontSize: '0.82rem', marginLeft: '12px', cursor: 'pointer' }}
                    >
                      Remove Photo
                    </button>
                  )}
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Or choose from preset avatars:</div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setForm(p => ({ ...p, avatarUrl: url }))}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: form.avatarUrl === url ? '2px solid var(--brand-pink)' : '2px solid transparent',
                        padding: '1px',
                        background: 'none',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease',
                      }}
                    >
                      <img src={url} alt={`Preset ${idx}`} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PROFILE DETAILS */}
          <div className="settings-card" style={{ gridColumn: '1 / -1' }}>
            <h3>📋 Personal Details</h3>
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={form.fullName}
                    onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>🔒 Email Address (Account ID - Read Only)</label>
                  <input
                    type="email"
                    className="input-field"
                    value={profile?.email || ''}
                    disabled
                    title="Account email cannot be changed"
                    style={{ opacity: 0.65, cursor: 'not-allowed', background: 'rgba(255,255,255,0.04)' }}
                  />
                </div>

                <div className="form-group">
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    className="input-field"
                    value={form.mobile}
                    onChange={e => setForm(p => ({ ...p, mobile: e.target.value }))}
                    placeholder="+91 9876543210"
                  />
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select
                    className="input-field"
                    value={form.gender}
                    onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}
                    style={{ background: 'var(--bg-primary)' }}
                  >
                    <option value="male">Male 👨</option>
                    <option value="female">Female 👩</option>
                    <option value="other">Other 🧑</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Date of Birth</label>
                  <DatePicker
                    value={form.dob}
                    onChange={val => setForm(p => ({ ...p, dob: val }))}
                    minAge={18}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={saving}
                  style={{ padding: '12px 28px', fontSize: '0.92rem' }}
                >
                  {saving ? 'Saving...' : '💾 Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Push Notifications Settings */}
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

          {/* Account Actions */}
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
