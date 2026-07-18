'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    let visitorId = localStorage.getItem('soulmate_visitor_id');
    if (!visitorId) {
      visitorId = 'v_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      localStorage.setItem('soulmate_visitor_id', visitorId);
    }

    const logVisit = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        fetch('/api/visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: pathname,
            visitorId,
            userId: session?.user?.id || null,
          }),
        }).catch(() => {});
      } catch (err) {}
    };

    logVisit();
  }, [pathname]);

  return null;
}
