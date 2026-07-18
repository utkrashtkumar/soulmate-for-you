import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const ADMIN_EMAIL = 'givekisstome@gmail.com';

async function verifyAdmin(request) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];
  if (!token) {
    return { error: 'Unauthorized: Missing token', status: 401 };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return { error: 'Supabase configuration missing', status: 500 };
  }

  const authClient = createClient(supabaseUrl, supabaseAnonKey);
  const { data: { user }, error } = await authClient.auth.getUser(token);

  if (error || !user) {
    return { error: `Unauthorized: Invalid token (${error?.message || 'unknown'})`, status: 401 };
  }

  if (user.email !== ADMIN_EMAIL) {
    return { error: 'Forbidden: You are not authorized', status: 403 };
  }

  const serviceClient = createClient(supabaseUrl, supabaseServiceKey);
  return { serviceClient, user };
}

export async function PUT(request) {
  try {
    const { serviceClient, error, status } = await verifyAdmin(request);
    if (error) return Response.json({ error }, { status });

    const { avatarId, name, personality, mood, love_meter, avatar_url } = await request.json();
    if (!avatarId) {
      return Response.json({ error: 'Missing avatarId' }, { status: 400 });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (personality !== undefined) updateData.personality = personality;
    if (mood !== undefined) updateData.mood = mood;
    if (love_meter !== undefined) updateData.love_meter = parseInt(love_meter, 10);
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;

    const { data, error: updateErr } = await serviceClient
      .from('avatars')
      .update(updateData)
      .eq('id', avatarId)
      .select()
      .single();

    if (updateErr) throw updateErr;

    return Response.json({ success: true, avatar: data });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { serviceClient, error, status } = await verifyAdmin(request);
    if (error) return Response.json({ error }, { status });

    const { avatarId } = await request.json();
    if (!avatarId) {
      return Response.json({ error: 'Missing avatarId' }, { status: 400 });
    }

    const { error: deleteErr } = await serviceClient
      .from('avatars')
      .delete()
      .eq('id', avatarId);

    if (deleteErr) throw deleteErr;

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
