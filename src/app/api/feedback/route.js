// API Route: /api/feedback
// Stores feedback submitted from Homepage and fetches for Admin panel

import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// POST: Submit feedback
export async function POST(request) {
  try {
    const { name, email, rating, category, message, userId } = await request.json();

    if (!message || !message.trim()) {
      return Response.json({ error: 'Feedback message is required' }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return Response.json({ error: 'Supabase configuration missing' }, { status: 500 });
    }

    // Insert into feedback table
    const { data, error } = await supabase.from('feedback').insert({
      name: name?.trim() || 'Anonymous User',
      email: email?.trim() || null,
      rating: rating || 5,
      category: category || 'general',
      message: message.trim(),
      user_id: userId || null,
      created_at: new Date().toISOString(),
    }).select().single();

    if (error) {
      console.warn('[Feedback API] Table insert warning:', error.message);
      // Fallback: If table public.feedback doesn't exist yet, we still return success to user
    }

    return Response.json({ success: true, feedback: data || { message } });
  } catch (err) {
    console.error('[Feedback API] Error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// GET: Fetch all feedback (Admin)
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return Response.json({ feedback: [] });

    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Feedback GET API] Error:', error.message);
      return Response.json({ feedback: [] });
    }

    return Response.json({ feedback: data || [] });
  } catch (err) {
    return Response.json({ feedback: [], error: err.message });
  }
}
