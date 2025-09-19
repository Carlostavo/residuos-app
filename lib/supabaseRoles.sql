
-- Crear usuarios de prueba y roles en Supabase

-- Crear tabla de roles si no existe
create table if not exists user_roles (
  user_id uuid references auth.users(id) on delete cascade,
  role text check (role in ('admin','tecnico','user')),
  primary key (user_id)
);

-- Crear usuario admin
insert into auth.users (id, email)
values (gen_random_uuid(), 'admin@demo.com')
on conflict do nothing;

-- Crear usuario técnico
insert into auth.users (id, email)
values (gen_random_uuid(), 'tecnico@demo.com')
on conflict do nothing;

-- Asignar roles
insert into user_roles (user_id, role)
select id, 'admin' from auth.users where email='admin@demo.com'
on conflict do nothing;

insert into user_roles (user_id, role)
select id, 'tecnico' from auth.users where email='tecnico@demo.com'
on conflict do nothing;
