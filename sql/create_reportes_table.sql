create table if not exists public.reportes (
  id uuid primary key default gen_random_uuid(),
  title text,
  summary text,
  file_url text,
  created_at timestamptz default now()
);
alter table public.reportes enable row level security;
create policy "public read reportes" on public.reportes for select using (true);
create policy "admin full reportes" on public.reportes for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')) with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
