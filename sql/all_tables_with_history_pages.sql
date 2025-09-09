create extension if not exists pgcrypto;

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  content jsonb,
  updated_at timestamptz default now()
);

create table if not exists public.page_history (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references public.pages(id) on delete cascade,
  editor uuid references auth.users(id),
  content jsonb,
  created_at timestamptz default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id),
  full_name text,
  role text default 'visualizador',
  created_at timestamptz default now()
);
