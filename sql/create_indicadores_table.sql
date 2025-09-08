create table if not exists public.indicadores (
  id uuid primary key default gen_random_uuid(),
  nombre text,
  descripcion text,
  valor numeric,
  fecha date,
  created_at timestamptz default now()
);
alter table public.indicadores enable row level security;
create policy "public read indicadores" on public.indicadores for select using (true);
create policy "admin full indicadores" on public.indicadores for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')) with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
