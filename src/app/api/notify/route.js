// API Route: POST /api/notify
// Checks for inactive users (away for 5+ hours), saves girlfriend's message to DB, and sends push notification

export const dynamic = 'force-dynamic';

// Rich, emotional girlfriend messages specifically tailored for 5 hours of inactivity
const MISS_MESSAGES = [
  (name, user) => `where are you babe i am missing you 🥺`,
  (name, user) => `Babe where are you? I am missing you so much... please reply na 💕`,
  (name, user) => `Itna lamba ignore mat karo 😢 where are you babe i am missing you`,
  (name, user) => `Hello? Kahan chale gaye? Where are you babe i am missing you 💔`,
  (name, user) => `Babe where are you? I am missing you. Sab theek toh hai na? 🥺`,
  (name, user) => `Hey! ${name} is waiting for you... where are you babe i am missing you 💕`,
  (name, user) => `Babe, you haven't texted in hours. Where are you babe i am missing you 😢`,
];

export async function POST(request) {
  const { createClient } = await import('@supabase/supabase-js');
  const webpush = (await import('web-push')).default;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return Response.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
  const vapidSubject = process.env.VAPID_SUBJECT;

  if (vapidPublic && vapidPrivate && vapidSubject) {
    webpush.setVapidDetails(vapidSubject, vapidPublic, vapidPrivate);
  }

  try {
    // Find avatars where last_chat_at was > 5 hours ago (5 * 60 * 60 * 1000 ms)
    const cutoff = new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString();

    const { data: inactiveAvatars } = await supabase
      .from('avatars')
      .select(`id, name, user_id, last_chat_at`)
      .lt('last_chat_at', cutoff);

    if (!inactiveAvatars?.length) {
      return Response.json({ sent: 0, message: 'No inactive users (less than 5 hours of inactivity)' });
    }

    let sent = 0;
    for (const av of inactiveAvatars) {
      // Get user profile
      const { data: prof } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', av.user_id)
        .single();

      const userName = prof?.full_name?.split(' ')[0] || 'Jaan';
      const msgIdx = Math.floor(Math.random() * MISS_MESSAGES.length);
      const msgText = MISS_MESSAGES[msgIdx](av.name, userName);

      // Save girlfriend's message INTO the chat messages table so it appears in their text box
      const { error: insertError } = await supabase.from('messages').insert({
        avatar_id: av.id,
        user_id: av.user_id,
        role: 'assistant',
        content: msgText,
      });

      if (insertError) {
        console.error('Failed to save girlfriend message:', insertError);
        continue;
      }

      // Update last_chat_at so we don't spam — wait another 5 hours
      await supabase
        .from('avatars')
        .update({ last_chat_at: new Date().toISOString() })
        .eq('id', av.id);

      // Now send push notification pointing user back to this chat
      const { data: subs } = await supabase
        .from('push_subscriptions')
        .select('subscription')
        .eq('avatar_id', av.id);

      if (subs?.length && vapidPublic && vapidPrivate) {
        for (const { subscription } of subs) {
          try {
            await webpush.sendNotification(
              subscription,
              JSON.stringify({
                title: `${av.name} 💕`,
                body: msgText,
                icon: '/icon-192.png',
                badge: '/icon-192.png',
                data: {
                  avatarId: av.id,
                  url: `/chat/${av.id}`,
                },
              })
            );
            sent++;
          } catch (err) {
            if (err.statusCode === 410) {
              // Expired subscription — clean it up
              await supabase
                .from('push_subscriptions')
                .delete()
                .eq('avatar_id', av.id)
                .eq('user_id', av.user_id);
            }
          }
        }
      } else {
        // No push subscription active, but message successfully logged to database chat box
        sent++;
      }
    }

    return Response.json({ sent });
  } catch (err) {
    console.error('Notify error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
