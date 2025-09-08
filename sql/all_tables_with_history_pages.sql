-- Full SQL: profiles, pages, page_history, metas, indicadores, avances, reportes
create extension if not exists pgcrypto;
-- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text default 'visualizador',
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
drop policy if exists "Profiles: self access" on public.profiles;
create policy "Profiles: self access" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
-- trigger: create profile on auth.users insert
create or replace function public.handle_new_user() returns trigger language plpgsql security definer as $$ begin insert into public.profiles (id, full_name) values (new.id, new.raw_user_meta_data->>'full_name') on conflict (id) do nothing; return new; end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
-- pages
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  content jsonb,
  updated_at timestamptz default now()
);
alter table public.pages enable row level security;
drop policy if exists "public read pages" on public.pages;
drop policy if exists "admin full pages" on public.pages;
create policy "public read pages" on public.pages for select using (true);
create policy "admin full pages" on public.pages for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')) with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
-- page_history
create table if not exists public.page_history (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references public.pages(id) on delete cascade,
  editor uuid references auth.users(id),
  content jsonb,
  created_at timestamptz default now()
);
alter table public.page_history enable row level security;
drop policy if exists "admin insert history" on public.page_history;
drop policy if exists "admin read history" on public.page_history;
create policy "admin insert history" on public.page_history for insert with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "admin read history" on public.page_history for select using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
-- metas
create table if not exists public.metas (id uuid primary key default gen_random_uuid(), title text, description text, owner uuid references auth.users(id), created_at timestamptz default now());
alter table public.metas enable row level security;
create policy "admin full metas" on public.metas for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')) with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "technician insert metas" on public.metas for insert with check (auth.uid() = owner);
create policy "technician update own metas" on public.metas for update using (auth.uid() = owner) with check (auth.uid() = owner);
create policy "public read metas" on public.metas for select using (true);
-- indicadores
create table if not exists public.indicadores (id uuid primary key default gen_random_uuid(), nombre text, descripcion text, valor numeric, fecha date, created_at timestamptz default now());
alter table public.indicadores enable row level security;
create policy "public read indicadores" on public.indicadores for select using (true);
create policy "admin full indicadores" on public.indicadores for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')) with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
-- avances
create table if not exists public.avances (id uuid primary key default gen_random_uuid(), actividad text, detalle text, responsable text, fecha date, created_at timestamptz default now());
alter table public.avances enable row level security;
create policy "public read avances" on public.avances for select using (true);
create policy "admin full avances" on public.avances for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')) with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
-- reportes
create table if not exists public.reportes (id uuid primary key default gen_random_uuid(), title text, summary text, file_url text, created_at timestamptz default now());
alter table public.reportes enable row level security;
create policy "public read reportes" on public.reportes for select using (true);
create policy "admin full reportes" on public.reportes for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')) with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
