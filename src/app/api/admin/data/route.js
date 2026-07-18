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

  // Use the anonymous client to verify the user token safely
  const authClient = createClient(supabaseUrl, supabaseAnonKey);
  const { data: { user }, error } = await authClient.auth.getUser(token);

  if (error || !user) {
    return { error: `Unauthorized: Invalid token (${error?.message || 'unknown'})`, status: 401 };
  }

  if (user.email !== ADMIN_EMAIL) {
    return { error: 'Forbidden: You are not authorized', status: 403 };
  }

  // If verified, initialize the service role client which bypasses RLS
  const serviceClient = createClient(supabaseUrl, supabaseServiceKey);
  return { serviceClient, user };
}

export async function GET(request) {
  try {
    const { serviceClient, error, status } = await verifyAdmin(request);
    if (error) {
      return Response.json({ error }, { status });
    }

    // 1. Fetch all users from Supabase Auth admin panel
    const { data: { users }, error: usersError } = await serviceClient.auth.admin.listUsers();
    if (usersError) throw usersError;

    // 2. Fetch profiles from database
    const { data: profiles, error: profilesError } = await serviceClient
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (profilesError) throw profilesError;

    // 3. Fetch avatars
    const { data: avatars, error: avatarsError } = await serviceClient
      .from('avatars')
      .select('*')
      .order('created_at', { ascending: false });
    if (avatarsError) throw avatarsError;

    // 4. Count total messages
    const { count: totalMessages, error: countError } = await serviceClient
      .from('messages')
      .select('*', { count: 'exact', head: true });
    if (countError) throw countError;

    // Merge users and profiles
    const mergedUsers = users.map(u => {
      const p = profiles?.find(prof => prof.id === u.id) || {};
      return {
        id: u.id,
        email: u.email,
        full_name: p.full_name || u.user_metadata?.full_name || 'N/A',
        mobile: p.mobile || u.user_metadata?.mobile || 'N/A',
        dob: p.dob || u.user_metadata?.dob || '',
        age: p.age || null,
        created_at: u.created_at || p.created_at,
      };
    });

    return Response.json({
      success: true,
      users: mergedUsers,
      avatars: avatars || [],
      stats: {
        totalUsers: mergedUsers.length,
        totalAvatars: avatars?.length || 0,
        totalMessages: totalMessages || 0,
      }
    });
  } catch (err) {
    console.error('Admin API error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
