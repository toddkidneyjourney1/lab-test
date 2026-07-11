create extension if not exists pgcrypto;

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  default_role text not null default 'cast' check (default_role in ('cast', 'admin')),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.show_access (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  show_name text not null check (show_name in ('bare', 'fences', 'godofcarnage', 'godot', 'midsummer', 'pillowman', 'rivals')),
  role text not null check (role in ('cast', 'admin')),
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, show_name, role)
);

alter table public.user_profiles enable row level security;
alter table public.show_access enable row level security;

create policy "Users can read own profile"
on public.user_profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Users can update own profile"
on public.user_profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can read own show access"
on public.show_access
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can read own show access for login"
on public.show_access
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

insert into public.user_profiles (id, full_name, default_role)
values ('00000000-0000-0000-0000-000000000000', 'Replace Me', 'cast')
on conflict (id) do nothing;

-- Example access rows. Replace the UUID with a real auth.users id and keep only the rows you need.
insert into public.show_access (user_id, show_name, role)
values
  ('00000000-0000-0000-0000-000000000000', 'bare', 'cast'),
  ('00000000-0000-0000-0000-000000000000', 'bare', 'admin')
on conflict (user_id, show_name, role) do nothing;
