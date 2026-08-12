# J.G-TEEN backend

The project now has a production-oriented backend foundation using **Supabase Postgres + Auth + Row Level Security + Edge Functions**.

## Stack

- Frontend: HTML/CSS/JavaScript (existing UI)
- Data layer: PostgreSQL via Supabase
- Authentication: Supabase Auth
- Server/API: TypeScript Edge Functions on Deno
- Security: Row Level Security (RLS)
- Game data: PostgreSQL scores
- User data: profiles, stories, mentor requests, notifications

Supabase is a good fit here because Auth and Postgres share the same security model, while Edge Functions provide server-side TypeScript endpoints. See the official docs: https://supabase.com/docs/guides/auth and https://supabase.com/docs/guides/functions.

## Database

Run `supabase/migrations/001_jgteen_core.sql` in the Supabase SQL editor or apply it with the Supabase CLI.

Tables:

- `profiles`
- `life_stories`
- `mentor_requests`
- `notifications`
- `broadcasts`
- `game_scores`

RLS policies ensure normal users can only modify their own profile/story/request/score records.

## API functions

### `health`

Public health check. No credentials required.

### `mentor-request`

Authenticated POST endpoint. Body:

```json
{
  "mentor": "Mentor Name",
  "problem": "I need help with...",
  "urgency": "normal"
}
```

### `save-profile`

Authenticated POST endpoint for profile + life-story synchronization.

```json
{
  "full_name": "Student Name",
  "bio": "Aspiring developer",
  "location": "Nairobi",
  "avatar_url": null,
  "story": "My journey..."
}
```

## Deployment

1. Create a Supabase project.
2. Run the migration SQL.
3. Replace the project ID in `supabase/config.toml`.
4. Install/login to the Supabase CLI.
5. Deploy the functions:

```bash
supabase functions deploy health
supabase functions deploy mentor-request
supabase functions deploy save-profile
```

Never put a Supabase secret/service-role key in browser JavaScript. Browser code may use the publishable/anon key; privileged keys belong only in server-side secrets.

## Next integration step

The existing UI can be connected to these endpoints without throwing away the current application. The next pass should replace the demo-only registration/profile/mentor-request persistence with Supabase Auth and API calls, then add an admin role protected by database policies.
