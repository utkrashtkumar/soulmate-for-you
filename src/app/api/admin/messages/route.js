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

export async function GET(request) {
  try {
    const { serviceClient, error, status } = await verifyAdmin(request);
    if (error) return Response.json({ error }, { status });

    const { searchParams } = new URL(request.url);
    const avatarId = searchParams.get('avatarId');

    if (!avatarId) {
      return Response.json({ error: 'Missing avatarId param' }, { status: 400 });
    }

    const { data: messages, error: messagesErr } = await serviceClient
      .from('messages')
      .select('*')
      .eq('avatar_id', avatarId)
      .order('created_at', { ascending: true });

    if (messagesErr) throw messagesErr;

    return Response.json({ success: true, messages: messages || [] });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { serviceClient, error, status } = await verifyAdmin(request);
    if (error) return Response.json({ error }, { status });

    const { messageId, avatarId } = await request.json();

    if (messageId) {
      // Delete single message
      const { error: deleteErr } = await serviceClient
        .from('messages')
        .delete()
        .eq('id', messageId);
      if (deleteErr) throw deleteErr;
      return Response.json({ success: true, deleted: 'message', messageId });
    } else if (avatarId) {
      // Clear entire chat history for this avatar
      const { error: deleteErr } = await serviceClient
        .from('messages')
        .delete()
        .eq('avatar_id', avatarId);
      if (deleteErr) throw deleteErr;
      return Response.json({ success: true, deleted: 'chat', avatarId });
    } else {
      return Response.json({ error: 'Either messageId or avatarId must be provided' }, { status: 400 });
    }
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
