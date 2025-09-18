
-- Supabase schema for PAE Tailwind Pixel-Perfect

create table if not exists public.user_roles (
  user_id uuid references auth.users(id) on delete cascade,
  role text check (role in ('admin','tecnico','viewer')),
  primary key (user_id)
);

create table if not exists public.pages (
  id text primary key,
  content text not null default '[]',
  updated_at timestamp with time zone default now()
);

alter table public.user_roles enable row level security;
alter table public.pages enable row level security;

create policy if not exists "public_select_pages" on public.pages
  for select using (true);

create policy if not exists "edit_pages_admin_tecnico" on public.pages
  for insert, update, delete using (
    exists (
      select 1 from public.user_roles ur
      where ur.user_id = auth.uid() and ur.role in ('admin','tecnico')
    )
  );
