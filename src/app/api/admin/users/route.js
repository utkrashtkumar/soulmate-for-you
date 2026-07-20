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

    const { userId, full_name, mobile, dob } = await request.json();
    if (!userId) {
      return Response.json({ error: 'Missing userId' }, { status: 400 });
    }

    const updateData = {};
    if (full_name !== undefined) updateData.full_name = full_name;
    if (mobile !== undefined) updateData.mobile = mobile;
    if (dob !== undefined) updateData.dob = dob;

    const { data, error: updateErr } = await serviceClient
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (updateErr) throw updateErr;

    return Response.json({ success: true, profile: data });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { serviceClient, user, error, status } = await verifyAdmin(request);
    if (error) return Response.json({ error }, { status });

    const { userId } = await request.json();
    if (!userId) {
      return Response.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Safety: Prevent admin from deleting themselves
    if (userId === user.id) {
      return Response.json({ error: 'You cannot delete your own account! ❌' }, { status: 400 });
    }

    // Delete user from auth.users (cascades to profile, avatars, messages)
    const { error: deleteErr } = await serviceClient.auth.admin.deleteUser(userId);
    if (deleteErr) throw deleteErr;

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
