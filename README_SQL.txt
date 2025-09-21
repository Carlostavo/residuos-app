-- Ejemplo de SQL para crear la tabla 'elements' en Supabase (public schema)
create table if not exists public.elements(
  id uuid primary key default gen_random_uuid(),
  page_slug text,
  type text,
  title text,
  content text,
  x int,
  y int,
  width int,
  height int,
  maximized boolean default false,
  created_at timestamptz default now()
);
