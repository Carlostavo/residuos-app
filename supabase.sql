-- Supabase schema for PAE app
-- user_roles table
create table if not exists public.user_roles (
  user_id uuid references auth.users(id) on delete cascade,
  role text check (role in ('admin','tecnico','viewer')),
  primary key (user_id)
);

-- pages content table
create table if not exists public.pages (
  id text primary key,
  content jsonb not null default '[]'::jsonb,
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.user_roles enable row level security;
alter table public.pages enable row level security;

-- Policies
-- Allow users to read their own role
drop policy if exists "Each user sees own role" on public.user_roles;
create policy "Each user sees own role" on public.user_roles for select
using (auth.uid() = user_id);

-- Allow public read of pages
drop policy if exists "Public select paginas" on public.pages;
create policy "public select pages" on public.pages for select using (true);

-- Allow admin/tecnico to insert/update/delete pages
drop policy if exists "Admins/tecnicos edit paginas" on public.pages;
create policy "edit pages admin tecnico" on public.pages for insert, update, delete
using (
  exists (
    select 1 from public.user_roles ur
    where ur.user_id = auth.uid() and ur.role in ('admin','tecnico')
  )
);
