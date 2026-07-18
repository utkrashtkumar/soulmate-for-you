import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { mobile } = body;

    if (!mobile) {
      return NextResponse.json({ error: 'Mobile number is required' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('mobile', mobile)
      .maybeSingle();

    if (error) {
      console.error('Check mobile database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ exists: !!data });
  } catch (err) {
    console.error('Check mobile server error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
