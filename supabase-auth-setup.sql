-- Supabase Auth setup for the portal, volunteer portal, and related pages.
-- Run this in the Supabase SQL Editor before testing the new sign-in flow.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role text check (role in ('cast', 'volunteer', 'admin')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.volunteers (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique not null references auth.users (id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public."Volunteer-shifts" (
  id uuid primary key default gen_random_uuid(),
  shift_name text not null,
  shift_date date not null,
  volunteer_count integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.volunteer_shifts (
  id uuid primary key default gen_random_uuid(),
  volunteer_id uuid not null references public.volunteers (id) on delete cascade,
  shift_id uuid not null references public."Volunteer-shifts" (id) on delete cascade,
  shift_start timestamptz,
  shift_end timestamptz,
  role text default 'Volunteer',
  created_at timestamptz not null default timezone('utc', now()),
  unique (volunteer_id, shift_id)
);

create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists volunteers_auth_user_id_idx on public.volunteers (auth_user_id);
create index if not exists volunteer_shifts_volunteer_id_idx on public.volunteer_shifts (volunteer_id);
create index if not exists volunteer_shifts_shift_id_idx on public.volunteer_shifts (shift_id);

alter table public.profiles enable row level security;
alter table public.volunteers enable row level security;
alter table public."Volunteer-shifts" enable row level security;
alter table public.volunteer_shifts enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists "Users can view own volunteer record" on public.volunteers;
create policy "Users can view own volunteer record"
  on public.volunteers
  for select
  using (auth.uid() = auth_user_id);

drop policy if exists "Users can insert own volunteer record" on public.volunteers;
create policy "Users can insert own volunteer record"
  on public.volunteers
  for insert
  with check (auth.uid() = auth_user_id);

drop policy if exists "Users can update own volunteer record" on public.volunteers;
create policy "Users can update own volunteer record"
  on public.volunteers
  for update
  using (auth.uid() = auth_user_id);

drop policy if exists "Authenticated users can view shifts" on public."Volunteer-shifts";
create policy "Authenticated users can view shifts"
  on public."Volunteer-shifts"
  for select
  using (auth.role() = 'authenticated');

drop policy if exists "Volunteer users can update shift counts" on public."Volunteer-shifts";
create policy "Volunteer users can update shift counts"
  on public."Volunteer-shifts"
  for update
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role in ('volunteer', 'admin')
    )
  )
  with check (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role in ('volunteer', 'admin')
    )
  );

drop policy if exists "Users can view own shift signups" on public.volunteer_shifts;
create policy "Users can view own shift signups"
  on public.volunteer_shifts
  for select
  using (
    volunteer_id in (
      select v.id
      from public.volunteers v
      where v.auth_user_id = auth.uid()
    )
  );

drop policy if exists "Users can insert own shift signups" on public.volunteer_shifts;
create policy "Users can insert own shift signups"
  on public.volunteer_shifts
  for insert
  with check (
    volunteer_id in (
      select v.id
      from public.volunteers v
      where v.auth_user_id = auth.uid()
    )
  );

drop policy if exists "Users can delete own shift signups" on public.volunteer_shifts;
create policy "Users can delete own shift signups"
  on public.volunteer_shifts
  for delete
  using (
    volunteer_id in (
      select v.id
      from public.volunteers v
      where v.auth_user_id = auth.uid()
    )
  );
