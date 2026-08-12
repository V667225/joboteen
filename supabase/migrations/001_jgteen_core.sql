-- J.G-TEEN / JOBO-TEEN core backend schema
-- PostgreSQL + Supabase Auth + Row Level Security

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  bio text not null default '',
  location text not null default '',
  avatar_url text,
  xp integer not null default 0 check (xp >= 0),
  rank text not null default 'NOVICE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.life_stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null default '',
  is_private boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mentor_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mentor_name text not null,
  problem text not null,
  urgency text not null default 'normal' check (urgency in ('low','normal','high','urgent')),
  status text not null default 'pending' check (status in ('pending','accepted','resolved','closed')),
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  type text not null default 'info',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.broadcasts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references auth.users(id) on delete set null,
  title text not null,
  body text not null,
  type text not null default 'announcement',
  audience text not null default 'all',
  created_at timestamptz not null default now()
);

create table if not exists public.game_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  game text not null,
  score integer not null default 0 check (score >= 0),
  created_at timestamptz not null default now()
);

create index if not exists mentor_requests_user_idx on public.mentor_requests(user_id, created_at desc);
create index if not exists notifications_user_idx on public.notifications(user_id, created_at desc);
create index if not exists scores_game_idx on public.game_scores(game, score desc);

alter table public.profiles enable row level security;
alter table public.life_stories enable row level security;
alter table public.mentor_requests enable row level security;
alter table public.notifications enable row level security;
alter table public.broadcasts enable row level security;
alter table public.game_scores enable row level security;

create policy "profiles are readable by their owner" on public.profiles for select using (auth.uid() = id);
create policy "users can create their profile" on public.profiles for insert with check (auth.uid() = id);
create policy "users can update their profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "users own life stories" on public.life_stories for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users create mentor requests" on public.mentor_requests for insert with check (auth.uid() = user_id);
create policy "users read their mentor requests" on public.mentor_requests for select using (auth.uid() = user_id);
create policy "users read their notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "users mark their notifications read" on public.notifications for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "authenticated users read broadcasts" on public.broadcasts for select using (auth.uid() is not null);
create policy "users create scores" on public.game_scores for insert with check (auth.uid() = user_id);
create policy "users read their scores" on public.game_scores for select using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles for each row execute procedure public.touch_updated_at();
drop trigger if exists stories_touch on public.life_stories;
create trigger stories_touch before update on public.life_stories for each row execute procedure public.touch_updated_at();
drop trigger if exists mentor_requests_touch on public.mentor_requests;
create trigger mentor_requests_touch before update on public.mentor_requests for each row execute procedure public.touch_updated_at();
