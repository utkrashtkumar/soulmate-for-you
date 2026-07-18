-- Virtual Girlfriend App — Supabase Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────
-- PROFILES TABLE (extends Supabase auth.users)
-- ─────────────────────────────────────────
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  mobile text not null,
  dob date not null,
  gender text default 'male' check (gender in ('male', 'female', 'other')),
  theme text default 'whatsapp',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ─────────────────────────────────────────
-- AVATARS TABLE (girlfriend bots)
-- ─────────────────────────────────────────
create table if not exists public.avatars (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  avatar_url text,
  companion_gender text default 'female' check (companion_gender in ('male', 'female')),
  dob date not null,
  personality text default 'Caring & Cute',
  mood text default 'happy',
  love_meter int default 0 check (love_meter >= 0 and love_meter <= 100),
  last_chat_at timestamptz,
  created_at timestamptz default now()
);

alter table public.avatars enable row level security;

drop policy if exists "Users can manage own avatars" on public.avatars;
create policy "Users can manage own avatars"
  on public.avatars for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- MESSAGES TABLE (full chat history = memory)
-- ─────────────────────────────────────────
create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  avatar_id uuid references public.avatars(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

alter table public.messages enable row level security;

drop policy if exists "Users can manage own messages" on public.messages;
create policy "Users can manage own messages"
  on public.messages for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists idx_messages_avatar_id on public.messages(avatar_id);
create index if not exists idx_messages_created_at on public.messages(created_at);

-- ─────────────────────────────────────────
-- PUSH SUBSCRIPTIONS TABLE
-- ─────────────────────────────────────────
create table if not exists public.push_subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  avatar_id uuid references public.avatars(id) on delete cascade,
  subscription jsonb not null,
  created_at timestamptz default now()
);

alter table public.push_subscriptions enable row level security;

drop policy if exists "Users can manage own push subscriptions" on public.push_subscriptions;
create policy "Users can manage own push subscriptions"
  on public.push_subscriptions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- FUNCTION: Auto-create profile on signup
-- ─────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, mobile, dob, gender)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'mobile',
    (new.raw_user_meta_data->>'dob')::date,
    coalesce(new.raw_user_meta_data->>'gender', 'male')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────
-- STORAGE: Avatar images bucket
-- ─────────────────────────────────────────
insert into storage.buckets (id, name, public)
  values ('avatars', 'avatars', true)
  on conflict do nothing;

drop policy if exists "Anyone can view avatars" on storage.objects;
create policy "Anyone can view avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "Users can upload avatars" on storage.objects;
create policy "Users can upload avatars"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

drop policy if exists "Users can update their avatars" on storage.objects;
create policy "Users can update their avatars"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- MIGRATIONS: Add gender columns (run on existing DB)
-- ─────────────────────────────────────────
alter table public.profiles
  add column if not exists gender text default 'male' check (gender in ('male', 'female', 'other'));

alter table public.avatars
  add column if not exists companion_gender text default 'female' check (companion_gender in ('male', 'female'));

-- ─────────────────────────────────────────
-- SITE VISITS TABLE (for visitor analytics)
-- ─────────────────────────────────────────
create table if not exists public.site_visits (
  id uuid default uuid_generate_v4() primary key,
  path text default '/',
  visitor_id text,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now()
);

alter table public.site_visits enable row level security;

drop policy if exists "Anyone can log site visits" on public.site_visits;
create policy "Anyone can log site visits"
  on public.site_visits for insert
  with check (true);

drop policy if exists "Admins can view site visits" on public.site_visits;
create policy "Admins can view site visits"
  on public.site_visits for select
  using (true);

