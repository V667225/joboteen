import { withSupabase } from 'npm:@supabase/server@^1';

export default {
  fetch: withSupabase({ auth: 'none' }, async () => {
    return Response.json({
      ok: true,
      service: 'J.G-TEEN API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  }),
};
