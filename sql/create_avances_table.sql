create table if not exists public.avances (
  id uuid primary key default gen_random_uuid(),
  actividad text,
  detalle text,
  responsable text,
  fecha date,
  created_at timestamptz default now()
);
alter table public.avances enable row level security;
create policy "public read avances" on public.avances for select using (true);
create policy "admin full avances" on public.avances for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')) with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
