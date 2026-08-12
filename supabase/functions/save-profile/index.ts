import { withSupabase } from 'npm:@supabase/server@^1';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export default {
  fetch: withSupabase({ auth: 'user' }, async (req, ctx) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
    if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405, headers: cors });

    try {
      const input = await req.json();
      const full_name = String(input.full_name ?? '').trim().slice(0, 120);
      const bio = String(input.bio ?? '').trim().slice(0, 500);
      const location = String(input.location ?? '').trim().slice(0, 120);
      const avatar_url = input.avatar_url ? String(input.avatar_url).slice(0, 1000) : null;
      const story = String(input.story ?? '').trim().slice(0, 10000);

      const userId = ctx.userClaims?.sub;
      if (!userId) return Response.json({ error: 'Not authenticated' }, { status: 401, headers: cors });

      const { data: profile, error: profileError } = await ctx.supabase
        .from('profiles')
        .upsert({ id: userId, full_name, bio, location, avatar_url }, { onConflict: 'id' })
        .select('*')
        .single();
      if (profileError) throw profileError;

      if (story) {
        const { data: existing } = await ctx.supabase
          .from('life_stories')
          .select('id')
          .eq('user_id', userId)
          .order('created_at', { ascending: true })
          .limit(1)
          .maybeSingle();

        const query = existing
          ? ctx.supabase.from('life_stories').update({ body: story }).eq('id', existing.id).eq('user_id', userId)
          : ctx.supabase.from('life_stories').insert({ user_id: userId, body: story });
        const { error: storyError } = await query;
        if (storyError) throw storyError;
      }

      return Response.json({ ok: true, profile }, { status: 200, headers: cors });
    } catch (error) {
      console.error(error);
      return Response.json({ error: 'Unable to sync profile.' }, { status: 500, headers: cors });
    }
  }),
};
