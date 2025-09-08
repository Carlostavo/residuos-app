create extension if not exists pgcrypto;
create table if not exists public.metas (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  owner uuid references auth.users(id),
  created_at timestamptz default now()
);
alter table public.metas enable row level security;
-- admin full
create policy "admin full" on public.metas
  for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')) with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
-- technicians: can insert and update own
create policy "technician insert own" on public.metas
  for insert using (true) with check (auth.uid() = owner);
create policy "technician update own" on public.metas
  for update using (auth.uid() = owner);
-- public read
create policy "public read" on public.metas
  for select using (true);
