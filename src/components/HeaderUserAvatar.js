'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function HeaderUserAvatar() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user) {
        const { data: prof } = await supabase
          .from('profiles')
          .select('full_name, avatar_url, mobile, email')
          .eq('id', session.user.id)
          .single();
        if (prof) setProfile(prof);
      }
    };

    fetchUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      if (sess?.user) {
        supabase.from('profiles').select('full_name, avatar_url, mobile, email').eq('id', sess.user.id).single().then(({ data }) => {
          if (data) setProfile(data);
        });
      } else {
        setProfile(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!session?.user) return null;

  const displayName = profile?.full_name || session.user.user_metadata?.full_name || 'User';
  const avatarUrl = profile?.avatar_url || session.user.user_metadata?.avatar_url || null;
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setDropdownOpen(prev => !prev)}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          outline: 'none',
        }}
        title={`${displayName} — Open Account Menu`}
      >
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          padding: '2px',
          background: 'linear-gradient(135deg, var(--brand-pink), #8a2be2)',
          boxShadow: '0 2px 10px rgba(255, 77, 141, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s ease',
        }}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                background: 'var(--bg-card)',
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'var(--bg-card)',
              color: 'var(--brand-pink)',
              fontWeight: 700,
              fontSize: '1rem',
              display: avatarUrl ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {initial}
          </div>
        </div>
      </button>

      {/* DROPDOWN MENU */}
      {dropdownOpen && (
        <div style={{
          position: 'absolute',
          top: '48px',
          right: 0,
          width: '220px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-card)',
          padding: '8px',
          zIndex: 9999,
          animation: 'fade-in 0.15s ease',
        }}>
          <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-color)', marginBottom: '4px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', truncate: 'ellipsis' }}>
              {displayName}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
              {session.user.email}
            </div>
          </div>

          <Link
            href="/profile"
            onClick={() => setDropdownOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            👤 My Profile & Photo
          </Link>

          <Link
            href="/dashboard"
            onClick={() => setDropdownOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            🏠 Dashboard
          </Link>

          <Link
            href="/upgrade"
            onClick={() => setDropdownOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              color: 'gold',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            👑 Upgrade VIP
          </Link>

          {session.user.email === 'givekisstome@gmail.com' && (
            <Link
              href="/admin"
              onClick={() => setDropdownOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                color: 'gold',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              ⚙️ Admin Panel
            </Link>
          )}

          <div style={{ height: '1px', background: 'var(--border-color)', margin: '4px 0' }} />

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              color: '#ff6b6b',
              fontSize: '0.85rem',
              fontWeight: 500,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
}
