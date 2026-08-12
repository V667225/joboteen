# J.G-TEEN full-stack integration

The polish branch contains the Supabase schema, Edge Functions and browser integration bridge.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/migrations/001_jgteen_core.sql` in the SQL editor.
3. Copy `supabase-config.example.js` to `supabase-config.js` and fill in the project URL and browser-safe publishable key.
4. Never expose a secret/service-role key in frontend code.
5. Deploy the Edge Functions from `supabase/functions` when using the mentor/profile API endpoints.

The frontend bridge gracefully falls back to the existing local/demo behavior until valid browser-safe Supabase configuration is supplied.
