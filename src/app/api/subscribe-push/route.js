// API Route: POST /api/subscribe-push
// Saves a web push subscription to the database

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { createClient } = await import('@supabase/supabase-js');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return Response.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { subscription, userId, avatarId } = await request.json();

    const { error } = await supabase.from('push_subscriptions').upsert({
      user_id: userId,
      avatar_id: avatarId || null,
      subscription,
    });

    if (error) throw error;
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
