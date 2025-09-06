-- Tabla de páginas
create table if not exists public.pages (
  slug text primary key,
  title text,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Elementos arrastrables
create table if not exists public.elements (
  id uuid primary key,
  page_slug text references public.pages(slug) on delete cascade,
  type text, -- 'text','image','video'
  content text,
  src text,
  alt text,
  x int default 0,
  y int default 0,
  created_at timestamptz default now()
);

-- Roles de usuario
create table if not exists public.user_roles (
  user_id uuid primary key,
  role text -- 'viewer','tecnico','admin'
);
