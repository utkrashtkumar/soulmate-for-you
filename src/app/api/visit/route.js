import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { path = '/', visitorId = null, userId = null } = body;

    const { error } = await supabase.from('site_visits').insert({
      path,
      visitor_id: visitorId,
      user_id: userId || null,
    });

    if (error) {
      console.error('Visit log error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
