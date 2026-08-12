import { withSupabase } from 'npm:@supabase/server@^1';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export default {
  fetch: withSupabase({ auth: 'user' }, async (req, ctx) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405, headers: cors });
    }

    try {
      const body = await req.json();
      const mentor = String(body.mentor ?? '').trim();
      const problem = String(body.problem ?? '').trim();
      const urgency = ['low', 'normal', 'high', 'urgent'].includes(body.urgency) ? body.urgency : 'normal';

      if (!mentor || problem.length < 10) {
        return Response.json({ error: 'Mentor and a useful problem description are required.' }, { status: 400, headers: cors });
      }

      const { data, error } = await ctx.supabase
        .from('mentor_requests')
        .insert({
          user_id: ctx.userClaims?.sub,
          mentor_name: mentor,
          problem,
          urgency,
        })
        .select('id, mentor_name, urgency, status, created_at')
        .single();

      if (error) throw error;

      return Response.json({ ok: true, request: data }, { status: 201, headers: cors });
    } catch (error) {
      console.error(error);
      return Response.json({ error: 'Unable to create mentor request.' }, { status: 500, headers: cors });
    }
  }),
};
