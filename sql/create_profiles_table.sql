create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text default 'visualizador',
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table public.profiles enable row level security;
create policy "Profiles: self access" on public.profiles
  for all using ( auth.uid() = id );
