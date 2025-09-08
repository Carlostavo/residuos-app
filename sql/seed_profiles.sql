-- Seed profiles example: replace UUIDs with real auth.user ids after creating users in Supabase Auth
insert into public.profiles (id, full_name, role)
values
  ('11111111-1111-1111-1111-111111111111','Admin Usuario','admin'),
  ('22222222-2222-2222-2222-222222222222','Tecnico Usuario','tecnico'),
  ('33333333-3333-3333-3333-333333333333','Visualizador Usuario','visualizador')
on conflict (id) do update set full_name = excluded.full_name, role = excluded.role;
