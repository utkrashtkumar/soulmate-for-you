'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/context/LanguageContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useLang();
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = (sess) => {
      setSession(sess);
      setIsAdmin(sess?.user?.email === 'givekisstome@gmail.com');
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      checkAuth(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      checkAuth(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Don't show bottom nav inside chat view (chat has its own bottom input bar)
  if (!pathname || pathname.startsWith('/chat/')) {
    return null;
  }

  // If user is logged out, hide bottom nav on auth pages (login/register/landing)
  if (!session && (pathname === '/' || pathname === '/login' || pathname === '/register')) {
    return null;
  }

  const navItems = [
    { href: '/', label: t('nav.home'), icon: '🌐' },
    { href: '/dashboard', label: t('nav.dashboard'), icon: '🏠' },
    { href: '/create-avatar', label: t('nav.newCompanion').split(' ')[0], icon: '✨' },
    { href: '/profile', label: t('nav.profile').split(' ')[0], icon: '👤' },
    { href: '/upgrade', label: t('nav.upgrade'), icon: '👑' },
  ];

  if (isAdmin) {
    navItems.push({ href: '/admin', label: 'Admin', icon: '👑' });
  }

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map(item => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.href} href={item.href} className={`mobile-nav-item ${isActive ? 'active' : ''}`}>
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
