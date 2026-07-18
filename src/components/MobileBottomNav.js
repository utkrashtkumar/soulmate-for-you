'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = (session) => {
      setIsAdmin(session?.user?.email === 'givekisstome@gmail.com');
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      checkAdmin(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      checkAdmin(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Don't show bottom nav on landing page or chat page (chat has its own bottom input)
  if (!pathname || pathname === '/' || pathname === '/login' || pathname === '/register' || pathname.startsWith('/chat/')) {
    return null;
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/create-avatar', label: 'New', icon: '✨' },
    { href: '/profile', label: 'Profile', icon: '👤' },
    { href: '/upgrade', label: 'Upgrade', icon: '👑' },
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
