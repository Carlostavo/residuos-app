-- Supabase schema for Residuos App

create table if not exists public.user_roles (
  user_id uuid references auth.users(id) on delete cascade,
  role text check (role in ('admin','tecnico','viewer')),
  primary key (user_id)
);

create table if not exists public.pages (
  id text primary key,
  content jsonb not null default '[]'::jsonb,
  updated_at timestamp with time zone default now()
);

alter table public.user_roles enable row level security;
alter table public.pages enable row level security;

create policy if not exists "select user_roles authenticated" on public.user_roles
  for select using (auth.role() is not null);

create policy if not exists "public select pages" on public.pages
  for select using (true);

create policy if not exists "edit pages admin tecnico" on public.pages
  for insert, update, delete using (
    exists (
      select 1 from public.user_roles ur
      where ur.user_id = auth.uid() and ur.role in ('admin','tecnico')
    )
  );
