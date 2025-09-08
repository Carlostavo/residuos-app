# Plataforma Residuos - Starter (Extended)
Añadido: CRUD vistas para Indicadores, Avances y Reportes; API server-side para seed de usuarios; tablas SQL adicionales.
## Notas importantes
- No incluyas SUPABASE_SERVICE_ROLE_KEY en el frontend ni en GitHub.
- Para ejecutar el endpoint `/api/seed_users`, añade `SUPABASE_SERVICE_ROLE_KEY` y `NEXT_PUBLIC_SUPABASE_URL` en tu entorno Vercel/Local.
- En producción, protege el endpoint usando `x-admin-secret` header o restringe su acceso (o elimínalo después de usar).
## SQL
Revisa `/sql` para los scripts de creación de tablas.
