
create table if not exists paginas (
  nombre text primary key,
  contenido_html text
);

create table if not exists user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text check (role in ('admin','tecnico','viewer'))
);

alter table paginas enable row level security;
alter table user_roles enable row level security;

create policy "Public select paginas" on paginas for select using (true);

create policy "Admins/tecnicos edit paginas"
on paginas for insert with check (exists(select 1 from user_roles r where r.user_id = auth.uid() and r.role in ('admin','tecnico'))),
update with check (exists(select 1 from user_roles r where r.user_id = auth.uid() and r.role in ('admin','tecnico')));

create policy "Each user sees own role" on user_roles for select using (auth.uid() = user_id);

create policy "Admins manage roles" on user_roles for all using (exists(select 1 from user_roles r where r.user_id = auth.uid() and r.role = 'admin'));
